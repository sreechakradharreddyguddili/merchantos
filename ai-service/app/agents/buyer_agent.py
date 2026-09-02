import json
import re
from typing import Any

from bson import ObjectId

from app.services.database import products_collection
from app.services.llm import get_llm


# =========================================================
# HELPERS
# =========================================================

def _clean_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []

    return [
        str(item).strip()
        for item in value
        if item is not None and str(item).strip()
    ]


def _clean_text(value: Any) -> str:
    if value is None:
        return ""

    return str(value).strip()


def _product_to_catalog_item(product: dict) -> dict:
    ai_metadata = (
        product.get("aiMetadata", {})
        or {}
    )

    return {
        "id": str(product["_id"]),
        "name": _clean_text(
            product.get("name")
        ),
        "description": _clean_text(
            product.get("description")
        ),
        "category": _clean_text(
            product.get("category")
        ),
        "price": float(
            product.get("price", 0)
            or 0
        ),
        "currency": (
            product.get("currency")
            or "INR"
        ),
        "stock": int(
            product.get("stock", 0)
            or 0
        ),
        "features": _clean_list(
            product.get("features")
        ),
        "tags": _clean_list(
            product.get("tags")
        ),
        "targetAudience": _clean_list(
            ai_metadata.get(
                "targetAudience"
            )
        ),
        "useCases": _clean_list(
            ai_metadata.get(
                "useCases"
            )
        ),
        "compatibleWith": _clean_list(
            ai_metadata.get(
                "compatibleWith"
            )
        ),
        "sellingPoints": _clean_list(
            ai_metadata.get(
                "sellingPoints"
            )
        ),
    }


def _catalog_text(product: dict) -> str:
    values = [
        product.get("name"),
        product.get("description"),
        product.get("category"),
        *product.get("features", []),
        *product.get("tags", []),
        *product.get("targetAudience", []),
        *product.get("useCases", []),
        *product.get("compatibleWith", []),
        *product.get("sellingPoints", []),
    ]

    return " ".join(
        str(value)
        for value in values
        if value
    ).lower()


def _extract_json(text: str) -> dict:
    if not text:
        return {}

    cleaned = text.strip()

    # Remove markdown code fences.
    cleaned = re.sub(
        r"^```(?:json)?\s*",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        r"\s*```$",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    try:
        parsed = json.loads(cleaned)

        if isinstance(parsed, dict):
            return parsed

    except json.JSONDecodeError:
        pass

    # Try to locate the first JSON object.
    match = re.search(
        r"\{.*\}",
        cleaned,
        flags=re.DOTALL,
    )

    if not match:
        return {}

    try:
        parsed = json.loads(
            match.group(0)
        )

        if isinstance(parsed, dict):
            return parsed

    except json.JSONDecodeError:
        return {}

    return {}


def _tokenize(text: str) -> set[str]:
    words = re.findall(
        r"[a-zA-Z0-9]+",
        text.lower(),
    )

    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "under",
        "from",
        "need",
        "want",
        "something",
        "looking",
        "buy",
        "get",
        "a",
        "an",
        "to",
        "my",
        "is",
        "in",
        "on",
        "of",
    }

    return {
        word
        for word in words
        if len(word) > 2
        and word not in stop_words
    }


def _fallback_rank_products(
    message: str,
    catalog: list[dict],
) -> list[dict]:
    query_tokens = _tokenize(
        message
    )

    scored = []

    budget_match = re.search(
        r"(?:under|below|within|less than|upto|up to)\s*[₹rs.]?\s*([0-9,]+)",
        message.lower(),
    )

    budget = None

    if budget_match:
        try:
            budget = float(
                budget_match.group(1).replace(
                    ",",
                    "",
                )
            )
        except ValueError:
            budget = None

    for product in catalog:
        if product["stock"] <= 0:
            continue

        text = _catalog_text(
            product
        )

        product_tokens = _tokenize(
            text
        )

        score = len(
            query_tokens.intersection(
                product_tokens
            )
        )

        if budget is not None:
            if product["price"] <= budget:
                score += 5
            else:
                score -= 5

        if score > 0:
            scored.append(
                (
                    score,
                    product,
                )
            )

    scored.sort(
        key=lambda item: (
            item[0],
            -item[1]["price"],
        ),
        reverse=True,
    )

    return [
        item[1]
        for item in scored[:5]
    ]


def _safe_ids(
    values: Any,
    valid_ids: set[str],
) -> list[str]:
    if not isinstance(values, list):
        return []

    result = []

    for value in values:
        value = str(value)

        if value in valid_ids and value not in result:
            result.append(value)

    return result


# =========================================================
# MAIN BUYER AGENT
# =========================================================

def recommend_products(
    merchant_id: str,
    message: str,
    history: list | None = None,
) -> dict:

    if not merchant_id:
        raise ValueError(
            "Merchant ID is required"
        )

    if not ObjectId.is_valid(
        merchant_id
    ):
        raise ValueError(
            "Invalid merchant ID"
        )

    message = _clean_text(message)

    if not message:
        raise ValueError(
            "Buyer message is required"
        )

    merchant_object_id = ObjectId(
        merchant_id
    )

    # -----------------------------------------------------
    # LOAD AI-READY CATALOG
    # -----------------------------------------------------

    products = list(
        products_collection.find(
            {
                "merchant":
                    merchant_object_id,

                "isActive":
                    True,

                "stock":
                    {
                        "$gt": 0,
                    },

                "aiMetadata.aiSearchEnabled":
                    True,
            }
        )
        .limit(100)
    )

    catalog = [
        _product_to_catalog_item(
            product
        )
        for product in products
    ]

    if not catalog:
        return {
            "success": True,
            "reply": (
                "I don't currently have any "
                "AI-ready products available "
                "in this store."
            ),
            "intent": {
                "category": None,
                "budget_max": None,
                "use_case": None,
                "keywords": [],
            },
            "recommended_product_ids": [],
            "recommended_products": [],
            "cross_sell_product_id": None,
            "cross_sell_product": None,
            "cross_sell_reason": None,
            "confidence": 0,
        }

    catalog_by_id = {
        product["id"]: product
        for product in catalog
    }

    valid_ids = set(
        catalog_by_id.keys()
    )

    # -----------------------------------------------------
    # CONVERSATION CONTEXT
    # -----------------------------------------------------

    safe_history = []

    if isinstance(history, list):
        for item in history[-8:]:
            if not isinstance(
                item,
                dict,
            ):
                continue

            role = item.get("role")

            content = _clean_text(
                item.get("content")
                or item.get("text")
            )

            if role in {
                "user",
                "assistant",
            } and content:

                safe_history.append(
                    {
                        "role": role,
                        "content": content[
                            :1000
                        ],
                    }
                )

    history_text = "\n".join(
        f'{item["role"]}: {item["content"]}'
        for item in safe_history
    )

    # -----------------------------------------------------
    # CATALOG CONTEXT
    # -----------------------------------------------------

    catalog_context = []

    for product in catalog:
        catalog_context.append(
            {
                "id": product["id"],
                "name": product["name"],
                "description": product[
                    "description"
                ],
                "category": product[
                    "category"
                ],
                "price": product[
                    "price"
                ],
                "currency": product[
                    "currency"
                ],
                "stock": product[
                    "stock"
                ],
                "features": product[
                    "features"
                ],
                "tags": product[
                    "tags"
                ],
                "targetAudience": product[
                    "targetAudience"
                ],
                "useCases": product[
                    "useCases"
                ],
                "compatibleWith": product[
                    "compatibleWith"
                ],
                "sellingPoints": product[
                    "sellingPoints"
                ],
            }
        )

    catalog_json = json.dumps(
        catalog_context,
        ensure_ascii=False,
        indent=2,
    )

    # -----------------------------------------------------
    # LLM PROMPT
    # -----------------------------------------------------

    prompt = f"""
You are the AI Buyer Agent inside MerchantOS.

Your job is to help a customer discover products
from the merchant's real catalog.

CUSTOMER MESSAGE:
{message}

CONVERSATION HISTORY:
{history_text or "No previous conversation."}

AVAILABLE PRODUCT CATALOG:
{catalog_json}

IMPORTANT RULES:

1. Recommend ONLY products that exist in the provided catalog.
2. Never invent a product, price, feature, stock value, or discount.
3. Only recommend products with stock greater than zero.
4. Understand natural language, intent, budget, category,
   use case, preferences, and compatibility.
5. Extract a maximum budget when the customer provides one.
6. Select the best primary product(s) for the request.
7. If another catalog product naturally complements the selected
   product, identify ONE cross-sell product.
8. The cross-sell product must also exist in the catalog.
9. Explain why the primary recommendation fits the request.
10. Explain why the cross-sell product complements it.
11. Do not say a purchase has happened.
12. Do not claim payment, checkout, or order completion.
13. Be concise and helpful.
14. If nothing matches well, return an empty recommendation list
    and explain what information would help.

Return ONLY valid JSON.

Use exactly this structure:

{{
  "reply": "natural-language response to the customer",
  "intent": {{
    "category": "string or null",
    "budget_max": 0,
    "use_case": "string or null",
    "keywords": ["keyword1", "keyword2"]
  }},
  "recommended_product_ids": ["catalog-product-id"],
  "cross_sell_product_id": "catalog-product-id or null",
  "cross_sell_reason": "string or null",
  "confidence": 0.0
}}

The confidence value must be between 0 and 1.
"""

    # -----------------------------------------------------
    # CALL LLM
    # -----------------------------------------------------

    llm = get_llm()

    try:
        response = llm.invoke(
            prompt
        )

        raw_content = getattr(
            response,
            "content",
            "",
        )

        parsed = _extract_json(
            raw_content
        )

    except Exception as error:
        print(
            "Buyer agent LLM error:",
            error,
        )

        parsed = {}

    # -----------------------------------------------------
    # VALIDATE LLM RESULT
    # -----------------------------------------------------

    recommended_ids = _safe_ids(
        parsed.get(
            "recommended_product_ids"
        ),
        valid_ids,
    )

    cross_sell_id = parsed.get(
        "cross_sell_product_id"
    )

    if cross_sell_id is not None:
        cross_sell_id = str(
            cross_sell_id
        )

        if (
            cross_sell_id
            not in valid_ids
        ):
            cross_sell_id = None

    # -----------------------------------------------------
    # FALLBACK RANKING
    # -----------------------------------------------------

    if not recommended_ids:

        fallback_products = (
            _fallback_rank_products(
                message,
                catalog,
            )
        )

        recommended_ids = [
            product["id"]
            for product
            in fallback_products
        ]

    # -----------------------------------------------------
    # BUILD SAFE PRODUCT OUTPUT
    # -----------------------------------------------------

    recommended_products = [
        catalog_by_id[product_id]
        for product_id
        in recommended_ids
        if product_id
        in catalog_by_id
    ]

    cross_sell_product = None

    if cross_sell_id:
        cross_sell_product = (
            catalog_by_id.get(
                cross_sell_id
            )
        )

    # -----------------------------------------------------
    # FALLBACK CROSS-SELL
    # -----------------------------------------------------

    if (
        not cross_sell_product
        and recommended_products
    ):
        primary = (
            recommended_products[0]
        )

        primary_text = _catalog_text(
            primary
        )

        candidates = []

        for product in catalog:

            if (
                product["id"]
                == primary["id"]
            ):
                continue

            score = 0

            product_text = (
                _catalog_text(
                    product
                )
            )

            for term in (
                primary.get(
                    "tags",
                    []
                )
                + primary.get(
                    "features",
                    []
                )
                + primary.get(
                    "compatibleWith",
                    []
                )
            ):

                term = str(
                    term
                ).lower()

                if (
                    term
                    and term
                    in product_text
                ):
                    score += 3

            if (
                "watch"
                in primary_text
                and (
                    "headphone"
                    in product_text
                    or "earbud"
                    in product_text
                    or "audio"
                    in product_text
                )
            ):
                score += 8

            if (
                "phone"
                in primary_text
                and (
                    "case"
                    in product_text
                    or "charger"
                    in product_text
                    or "earbud"
                    in product_text
                )
            ):
                score += 8

            if (
                "laptop"
                in primary_text
                and (
                    "mouse"
                    in product_text
                    or "keyboard"
                    in product_text
                    or "bag"
                    in product_text
                )
            ):
                score += 8

            if (
                "camera"
                in primary_text
                and (
                    "tripod"
                    in product_text
                    or "lens"
                    in product_text
                    or "bag"
                    in product_text
                )
            ):
                score += 8

            if score > 0:
                candidates.append(
                    (
                        score,
                        product,
                    )
                )

        if candidates:
            candidates.sort(
                key=lambda item:
                    item[0],
                reverse=True,
            )

            cross_sell_product = (
                candidates[0][1]
            )

            cross_sell_id = (
                cross_sell_product[
                    "id"
                ]
            )

    # -----------------------------------------------------
    # INTENT
    # -----------------------------------------------------

    parsed_intent = (
        parsed.get("intent")
        if isinstance(
            parsed.get("intent"),
            dict,
        )
        else {}
    )

    category = (
        parsed_intent.get(
            "category"
        )
        or None
    )

    use_case = (
        parsed_intent.get(
            "use_case"
        )
        or None
    )

    budget_max = (
        parsed_intent.get(
            "budget_max"
        )
    )

    try:
        if budget_max is not None:
            budget_max = float(
                budget_max
            )
    except (
        TypeError,
        ValueError,
    ):
        budget_max = None

    keywords = _clean_list(
        parsed_intent.get(
            "keywords"
        )
    )

    # -----------------------------------------------------
    # REPLY
    # -----------------------------------------------------

    reply = _clean_text(
        parsed.get("reply")
    )

    if not reply:

        if recommended_products:
            primary = (
                recommended_products[0]
            )

            reply = (
                f"I recommend "
                f"{primary['name']} "
                f"for ₹{primary['price']:,.0f}. "
                f"It matches your request based "
                f"on the available catalog."
            )

            if cross_sell_product:
                reply += (
                    f" You may also like "
                    f"{cross_sell_product['name']}, "
                    f"which complements it."
                )

        else:
            reply = (
                "I couldn't find a strong "
                "match in the current catalog. "
                "Try specifying a product type, "
                "budget, or use case."
            )

    # -----------------------------------------------------
    # CROSS-SELL REASON
    # -----------------------------------------------------

    cross_sell_reason = _clean_text(
        parsed.get(
            "cross_sell_reason"
        )
    )

    if (
        cross_sell_product
        and not cross_sell_reason
    ):
        cross_sell_reason = (
            f"{cross_sell_product['name']} "
            "is a complementary option "
            "for the selected product."
        )

    # -----------------------------------------------------
    # CONFIDENCE
    # -----------------------------------------------------

    try:
        confidence = float(
            parsed.get(
                "confidence",
                0.0,
            )
        )
    except (
        TypeError,
        ValueError,
    ):
        confidence = 0.0

    confidence = max(
        0.0,
        min(
            confidence,
            1.0,
        ),
    )

    return {
        "success": True,
        "reply": reply,
        "intent": {
            "category": category,
            "budget_max": budget_max,
            "use_case": use_case,
            "keywords": keywords,
        },
        "recommended_product_ids":
            recommended_ids,
        "recommended_products":
            recommended_products,
        "cross_sell_product_id":
            cross_sell_id,
        "cross_sell_product":
            cross_sell_product,
        "cross_sell_reason":
            cross_sell_reason
            or None,
        "confidence":
            confidence,
    }


# =========================================================
# ALIAS
# =========================================================

def build_buyer_agent():
    return recommend_products