from bson import ObjectId

from app.services.database import (
    products_collection,
    orders_collection,
)


# =========================================================
# MERCHANT OVERVIEW
# =========================================================

def get_merchant_overview(
    merchant_id: str,
) -> dict:
    merchant_object_id = ObjectId(
        merchant_id
    )

    paid_orders = list(
        orders_collection.find(
            {
                "merchant":
                    merchant_object_id,

                "payment.status":
                    "paid",
            }
        )
    )

    total_orders = (
        orders_collection.count_documents(
            {
                "merchant":
                    merchant_object_id,
            }
        )
    )

    failed_payments = (
        orders_collection.count_documents(
            {
                "merchant":
                    merchant_object_id,

                "payment.status":
                    "failed",
            }
        )
    )

    revenue = sum(
        float(
            order.get(
                "totalAmount",
                0,
            )
            or 0
        )
        for order in paid_orders
    )

    paid_order_count = len(
        paid_orders
    )

    average_order_value = (
        revenue / paid_order_count
        if paid_order_count
        else 0
    )

    payment_attempts = (
        paid_order_count +
        failed_payments
    )

    payment_success_rate = (
        (
            paid_order_count /
            payment_attempts
        )
        * 100
        if payment_attempts
        else 0
    )

    return {
        "revenue":
            round(revenue, 2),

        "total_orders":
            total_orders,

        "paid_orders":
            paid_order_count,

        "failed_payments":
            failed_payments,

        "average_order_value":
            round(
                average_order_value,
                2,
            ),

        "payment_success_rate":
            round(
                payment_success_rate,
                2,
            ),
    }
# =========================================================
# AI BUYER ANALYTICS
# =========================================================

def get_ai_buyer_analytics(
    merchant_id: str,
) -> dict:

    merchant_object_id = ObjectId(
        merchant_id
    )

    ai_buyer_orders = list(
        orders_collection.find(
            {
                "merchant":
                    merchant_object_id,

                "source":
                    "ai_buyer",
            }
        )
    )

    total_ai_buyer_orders = len(
        ai_buyer_orders
    )

    paid_ai_buyer_orders = [
        order
        for order in ai_buyer_orders
        if (
            order.get(
                "payment",
                {}
            )
            or {}
        ).get("status") == "paid"
    ]

    failed_ai_buyer_orders = [
        order
        for order in ai_buyer_orders
        if (
            order.get(
                "payment",
                {}
            )
            or {}
        ).get("status") == "failed"
    ]

    paid_ai_buyer_count = len(
        paid_ai_buyer_orders
    )

    failed_ai_buyer_count = len(
        failed_ai_buyer_orders
    )

    ai_buyer_revenue = sum(
        float(
            order.get(
                "totalAmount",
                0
            )
            or 0
        )
        for order in paid_ai_buyer_orders
    )

    ai_buyer_aov = (
        ai_buyer_revenue /
        paid_ai_buyer_count
        if paid_ai_buyer_count
        else 0
    )

    payment_attempts = (
        paid_ai_buyer_count +
        failed_ai_buyer_count
    )

    ai_buyer_payment_success_rate = (
        (
            paid_ai_buyer_count /
            payment_attempts
        ) * 100
        if payment_attempts
        else 0
    )

    # -----------------------------------------------------
    # TOTAL MERCHANT PERFORMANCE
    # -----------------------------------------------------

    all_paid_orders = list(
        orders_collection.find(
            {
                "merchant":
                    merchant_object_id,

                "payment.status":
                    "paid",
            }
        )
    )

    total_merchant_revenue = sum(
        float(
            order.get(
                "totalAmount",
                0
            )
            or 0
        )
        for order in all_paid_orders
    )

    total_merchant_paid_orders = len(
        all_paid_orders
    )

    ai_buyer_revenue_share = (
        (
            ai_buyer_revenue /
            total_merchant_revenue
        ) * 100
        if total_merchant_revenue
        else 0
    )

    ai_buyer_order_share = (
        (
            paid_ai_buyer_count /
            total_merchant_paid_orders
        ) * 100
        if total_merchant_paid_orders
        else 0
    )

    # -----------------------------------------------------
    # TOP AI BUYER PRODUCTS
    # -----------------------------------------------------

    product_stats = {}

    for order in paid_ai_buyer_orders:

        for item in order.get(
            "items",
            []
        ):

            product_id = item.get(
                "product"
            )

            key = (
                str(product_id)
                if product_id
                else item.get(
                    "name",
                    "unknown"
                )
            )

            if key not in product_stats:

                product_stats[key] = {
                    "product_id":
                        key,

                    "product_name":
                        item.get(
                            "name",
                            "Unknown product"
                        ),

                    "units_sold":
                        0,

                    "orders":
                        0,

                    "revenue":
                        0,
                }

            product_stats[key][
                "units_sold"
            ] += int(
                item.get(
                    "quantity",
                    0
                )
                or 0
            )

            product_stats[key][
                "orders"
            ] += 1

            product_stats[key][
                "revenue"
            ] += float(
                item.get(
                    "totalPrice",
                    0
                )
                or 0
            )

    top_ai_buyer_products = sorted(
        product_stats.values(),
        key=lambda item:
            item["revenue"],
        reverse=True,
    )[:10]

    for item in top_ai_buyer_products:

        item["revenue"] = round(
            item["revenue"],
            2
        )

    return {
        "total_ai_buyer_orders":
            total_ai_buyer_orders,

        "paid_ai_buyer_orders":
            paid_ai_buyer_count,

        "failed_ai_buyer_orders":
            failed_ai_buyer_count,

        "ai_buyer_revenue":
            round(
                ai_buyer_revenue,
                2
            ),

        "ai_buyer_aov":
            round(
                ai_buyer_aov,
                2
            ),

        "ai_buyer_payment_success_rate":
            round(
                ai_buyer_payment_success_rate,
                2
            ),

        "ai_buyer_revenue_share":
            round(
                ai_buyer_revenue_share,
                2
            ),

        "ai_buyer_order_share":
            round(
                ai_buyer_order_share,
                2
            ),

        "top_ai_buyer_products":
            top_ai_buyer_products,
    }

# =========================================================
# PRODUCT HELPERS
# =========================================================

def _clean_list(value):
    if not isinstance(value, list):
        return []

    return [
        str(item)
        .strip()
        .lower()
        for item in value
        if item is not None
        and str(item).strip()
    ]


def _clean_text(value):
    if value is None:
        return ""

    return str(value).strip().lower()


def _product_terms(product):
    terms = set()

    name = _clean_text(
        product.get("name")
    )

    category = _clean_text(
        product.get("category")
    )

    description = _clean_text(
        product.get("description")
    )

    terms.update(
        word
        for word in name.split()
        if len(word) > 2
    )

    terms.update(
        word
        for word in category.split()
        if len(word) > 2
    )

    terms.update(
        word
        for word in description.split()
        if len(word) > 2
    )

    terms.update(
        _clean_list(
            product.get("features")
        )
    )

    terms.update(
        _clean_list(
            product.get("tags")
        )
    )

    ai_metadata = (
        product.get(
            "aiMetadata"
        )
        or {}
    )

    terms.update(
        _clean_list(
            ai_metadata.get(
                "targetAudience"
            )
        )
    )

    terms.update(
        _clean_list(
            ai_metadata.get(
                "useCases"
            )
        )
    )

    terms.update(
        _clean_list(
            ai_metadata.get(
                "compatibleWith"
            )
        )
    )

    terms.update(
        _clean_list(
            ai_metadata.get(
                "sellingPoints"
            )
        )
    )

    return terms


def _product_profile(product):
    ai_metadata = (
        product.get(
            "aiMetadata"
        )
        or {}
    )

    return {
        "name":
            product.get(
                "name",
                "",
            ),

        "category":
            product.get(
                "category",
                "",
            ),

        "description":
            product.get(
                "description",
                "",
            ),

        "features":
            _clean_list(
                product.get(
                    "features"
                )
            ),

        "tags":
            _clean_list(
                product.get(
                    "tags"
                )
            ),

        "target_audience":
            _clean_list(
                ai_metadata.get(
                    "targetAudience"
                )
            ),

        "use_cases":
            _clean_list(
                ai_metadata.get(
                    "useCases"
                )
            ),

        "compatible_with":
            _clean_list(
                ai_metadata.get(
                    "compatibleWith"
                )
            ),

        "selling_points":
            _clean_list(
                ai_metadata.get(
                    "sellingPoints"
                )
            ),
    }


# =========================================================
# CROSS-SELL SCORE
# =========================================================

def _calculate_cross_sell_score(
    first_product,
    second_product,
):
    first_profile = _product_profile(
        first_product
    )

    second_profile = _product_profile(
        second_product
    )

    first_terms = _product_terms(
        first_product
    )

    second_terms = _product_terms(
        second_product
    )

    score = 0

    reasons = []

    # -----------------------------------------------------
    # SAME CATEGORY
    # -----------------------------------------------------

    first_category = _clean_text(
        first_product.get(
            "category"
        )
    )

    second_category = _clean_text(
        second_product.get(
            "category"
        )
    )

    if (
        first_category
        and
        second_category
        and
        first_category ==
        second_category
    ):
        score += 15

        reasons.append(
            "Both products belong to the same shopping category."
        )

    # -----------------------------------------------------
    # FEATURE OVERLAP
    # -----------------------------------------------------

    first_features = set(
        first_profile["features"]
    )

    second_features = set(
        second_profile["features"]
    )

    feature_overlap = (
        first_features &
        second_features
    )

    if feature_overlap:
        score += min(
            15,
            len(feature_overlap) * 5,
        )

        reasons.append(
            "Products share related features and customer intent."
        )

    # -----------------------------------------------------
    # TAG OVERLAP
    # -----------------------------------------------------

    first_tags = set(
        first_profile["tags"]
    )

    second_tags = set(
        second_profile["tags"]
    )

    tag_overlap = (
        first_tags &
        second_tags
    )

    if tag_overlap:
        score += min(
            15,
            len(tag_overlap) * 5,
        )

        reasons.append(
            "Products target related customer interests."
        )

    # -----------------------------------------------------
    # USE CASE OVERLAP
    # -----------------------------------------------------

    first_use_cases = set(
        first_profile["use_cases"]
    )

    second_use_cases = set(
        second_profile["use_cases"]
    )

    use_case_overlap = (
        first_use_cases &
        second_use_cases
    )

    if use_case_overlap:
        score += min(
            20,
            len(use_case_overlap) * 7,
        )

        reasons.append(
            "Products support similar customer use cases."
        )

    # -----------------------------------------------------
    # COMPATIBILITY
    # -----------------------------------------------------

    first_compatible = set(
        first_profile[
            "compatible_with"
        ]
    )

    second_compatible = set(
        second_profile[
            "compatible_with"
        ]
    )

    first_name = _clean_text(
        first_product.get(
            "name"
        )
    )

    second_name = _clean_text(
        second_product.get(
            "name"
        )
    )

    if (
        second_name
        and any(
            second_name in value
            or value in second_name
            for value in first_compatible
        )
    ):
        score += 30

        reasons.append(
            "The first product explicitly indicates compatibility with the second product."
        )

    if (
        first_name
        and any(
            first_name in value
            or value in first_name
            for value in second_compatible
        )
    ):
        score += 30

        reasons.append(
            "The second product explicitly indicates compatibility with the first product."
        )

    # -----------------------------------------------------
    # COMPLEMENTARY PRODUCT HEURISTICS
    # -----------------------------------------------------
    #
    # These are useful when products have little/no
    # analytics yet and explicit AI metadata is missing.
    #

    complementary_groups = [
        (
            {
                "watch",
                "smartwatch",
                "smart",
            },
            {
                "headphone",
                "headphones",
                "earbuds",
                "earphone",
                "audio",
            },
            "Wearable and audio products can be used together."
        ),

        (
            {
                "watch",
                "smartwatch",
                "fitness",
            },
            {
                "band",
                "strap",
                "charger",
                "charging",
            },
            "The products can complement a wearable setup."
        ),

        (
            {
                "phone",
                "smartphone",
                "mobile",
            },
            {
                "headphone",
                "headphones",
                "earbuds",
                "charger",
                "powerbank",
                "case",
            },
            "The products commonly support the same mobile-use workflow."
        ),

        (
            {
                "laptop",
                "computer",
                "notebook",
            },
            {
                "mouse",
                "keyboard",
                "headphone",
                "headphones",
                "bag",
                "stand",
            },
            "The products can complement a computer setup."
        ),

        (
            {
                "camera",
                "dslr",
                "mirrorless",
            },
            {
                "tripod",
                "bag",
                "memory",
                "card",
                "lens",
                "battery",
            },
            "The products can complement a photography setup."
        ),
    ]

    first_name_words = set(
        first_name.replace(
            "-",
            " ",
        ).split()
    )

    second_name_words = set(
        second_name.replace(
            "-",
            " ",
        ).split()
    )

    for (
        group_a,
        group_b,
        reason,
    ) in complementary_groups:

        if (
            first_name_words &
            group_a
        ) and (
            second_name_words &
            group_b
        ):
            score += 35

            reasons.append(
                reason
            )

        elif (
            first_name_words &
            group_b
        ) and (
            second_name_words &
            group_a
        ):
            score += 35

            reasons.append(
                reason
            )

    # -----------------------------------------------------
    # DISTINCT PRODUCTS
    # -----------------------------------------------------

    if (
        first_product.get(
            "_id"
        )
        !=
        second_product.get(
            "_id"
        )
    ):
        score += 5

    score = min(
        score,
        100,
    )

    # Remove duplicate reasons
    unique_reasons = list(
        dict.fromkeys(
            reasons
        )
    )

    return (
        score,
        unique_reasons,
    )


# =========================================================
# CROSS-SELL OPPORTUNITIES
# =========================================================

def get_cross_sell_opportunities(
    merchant_id: str,
) -> list:
    merchant_object_id = ObjectId(
        merchant_id
    )

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
            }
        )
    )

    if len(products) < 2:
        return []

    opportunities = []

    for index, first_product in enumerate(
        products
    ):
        for second_product in products[
            index + 1:
        ]:

            score, reasons = (
                _calculate_cross_sell_score(
                    first_product,
                    second_product,
                )
            )

            if score < 25:
                continue

            first_price = float(
                first_product.get(
                    "price",
                    0,
                )
                or 0
            )

            second_price = float(
                second_product.get(
                    "price",
                    0,
                )
                or 0
            )

            # -------------------------------------------------
            # ESTIMATED CROSS-SELL IMPACT
            # -------------------------------------------------
            #
            # Conservative estimate:
            # assume 5% of paid orders may add
            # the complementary product.
            #

            paid_order_count = (
                orders_collection.count_documents(
                    {
                        "merchant":
                            merchant_object_id,

                        "payment.status":
                            "paid",
                    }
                )
            )

            estimated_extra_orders = max(
                1,
                round(
                    paid_order_count *
                    0.05,
                    2,
                ),
            )

            recommended_price = (
                second_price
            )

            estimated_impact = (
                estimated_extra_orders *
                recommended_price
            )

            opportunities.append(
                {
                    "primary_product_id":
                        str(
                            first_product["_id"]
                        ),

                    "primary_product_name":
                        first_product.get(
                            "name"
                        ),

                    "primary_product_price":
                        first_price,

                    "complementary_product_id":
                        str(
                            second_product["_id"]
                        ),

                    "complementary_product_name":
                        second_product.get(
                            "name"
                        ),

                    "complementary_product_price":
                        second_price,

                    "score":
                        score,

                    "reasons":
                        reasons,

                    "estimated_additional_orders":
                        estimated_extra_orders,

                    "estimated_revenue_opportunity":
                        round(
                            estimated_impact,
                            2,
                        ),

                    "strategy":
                        (
                            f"Recommend "
                            f"{second_product.get('name')} "
                            f"to customers considering "
                            f"{first_product.get('name')}."
                        ),
                }
            )

            # Add reverse direction as well.
            reverse_score, reverse_reasons = (
                _calculate_cross_sell_score(
                    second_product,
                    first_product,
                )
            )

            if reverse_score >= 25:

                reverse_estimated_impact = (
                    estimated_extra_orders *
                    first_price
                )

                opportunities.append(
                    {
                        "primary_product_id":
                            str(
                                second_product[
                                    "_id"
                                ]
                            ),

                        "primary_product_name":
                            second_product.get(
                                "name"
                            ),

                        "primary_product_price":
                            second_price,

                        "complementary_product_id":
                            str(
                                first_product[
                                    "_id"
                                ]
                            ),

                        "complementary_product_name":
                            first_product.get(
                                "name"
                            ),

                        "complementary_product_price":
                            first_price,

                        "score":
                            reverse_score,

                        "reasons":
                            reverse_reasons,

                        "estimated_additional_orders":
                            estimated_extra_orders,

                        "estimated_revenue_opportunity":
                            round(
                                reverse_estimated_impact,
                                2,
                            ),

                        "strategy":
                            (
                                f"Recommend "
                                f"{first_product.get('name')} "
                                f"to customers considering "
                                f"{second_product.get('name')}."
                            ),
                    }
                )

    opportunities.sort(
        key=lambda item: (
            item[
                "score"
            ],
            item[
                "estimated_revenue_opportunity"
            ],
        ),
        reverse=True,
    )

    return opportunities


# =========================================================
# PRODUCT OPPORTUNITIES
# =========================================================

def get_product_opportunities(
    merchant_id: str,
) -> list:
    merchant_object_id = ObjectId(
        merchant_id
    )

    products = list(
        products_collection.find(
            {
                "merchant":
                    merchant_object_id,

                "isActive":
                    True,
            }
        )
    )

    opportunities = []

    for product in products:

        analytics = (
            product.get(
                "analytics",
                {},
            )
            or {}
        )

        views = int(
            analytics.get(
                "views",
                0,
            )
            or 0
        )

        cart_adds = int(
            analytics.get(
                "cartAdds",
                0,
            )
            or 0
        )

        purchases = int(
            analytics.get(
                "purchases",
                0,
            )
            or 0
        )

        revenue = float(
            analytics.get(
                "revenue",
                0,
            )
            or 0
        )

        price = float(
            product.get(
                "price",
                0,
            )
            or 0
        )

        stock = int(
            product.get(
                "stock",
                0,
            )
            or 0
        )

        # -------------------------------------------------
        # NEW PRODUCTS WITHOUT ANALYTICS
        # -------------------------------------------------
        #
        # Do not discard them completely.
        # They may still be useful for cross-sell,
        # inventory, or catalog analysis.
        #

        if views <= 0:

            if stock <= 0:
                continue

            opportunities.append(
                {
                    "product_id":
                        str(
                            product["_id"]
                        ),

                    "product_name":
                        product.get(
                            "name"
                        ),

                    "category":
                        product.get(
                            "category"
                        ),

                    "price":
                        price,

                    "views":
                        0,

                    "cart_adds":
                        0,

                    "purchases":
                        0,

                    "revenue":
                        0,

                    "cart_rate":
                        0,

                    "purchase_rate":
                        0,

                    "cart_to_purchase_rate":
                        0,

                    "opportunity_score":
                        10,

                    "estimated_revenue_opportunity":
                        0,

                    "reasons":
                        [
                            "Product has inventory available but does not have enough behavioral data yet."
                        ],

                    "recommended_actions":
                        [
                            "Use this product in cross-sell recommendations."
                        ],
                }
            )

            continue

        # -------------------------------------------------
        # CONVERSION METRICS
        # -------------------------------------------------

        cart_rate = (
            (
                cart_adds /
                views
            )
            * 100
        )

        purchase_rate = (
            (
                purchases /
                views
            )
            * 100
        )

        cart_to_purchase_rate = (
            (
                purchases /
                cart_adds
            )
            * 100
            if cart_adds
            else 0
        )

        opportunity_score = 0

        reasons = []

        actions = []

        # -------------------------------------------------
        # HIGH CUSTOMER INTEREST
        # -------------------------------------------------

        if cart_rate >= 20:
            opportunity_score += 20

            reasons.append(
                "Strong customer interest."
            )

        # -------------------------------------------------
        # LOW CONVERSION
        # -------------------------------------------------

        if (
            cart_adds >= 100
            and
            cart_to_purchase_rate < 20
        ):
            opportunity_score += 30

            reasons.append(
                "High cart activity but weak checkout conversion."
            )

            actions.append(
                "Test checkout recovery."
            )

        # -------------------------------------------------
        # HIGH TRAFFIC
        # -------------------------------------------------

        if views >= 5000:
            opportunity_score += 15

            reasons.append(
                "High product traffic."
            )

        # -------------------------------------------------
        # REVENUE IMPORTANCE
        # -------------------------------------------------

        if revenue >= 100000:
            opportunity_score += 10

            reasons.append(
                "Product already generates meaningful revenue."
            )

        # -------------------------------------------------
        # PURCHASE BASE
        # -------------------------------------------------

        if purchases >= 100:
            opportunity_score += 10

            reasons.append(
                "Large customer purchase base."
            )

            actions.append(
                "Create complementary-product cross-sell."
            )

        # -------------------------------------------------
        # PRICE EXPERIMENT
        # -------------------------------------------------

        if (
            cart_to_purchase_rate < 15
            and
            price >= 3000
        ):
            opportunity_score += 10

            reasons.append(
                "Higher price may be contributing to conversion friction."
            )

            actions.append(
                "Test a controlled incentive."
            )

        # -------------------------------------------------
        # STOCK RISK
        # -------------------------------------------------

        if (
            purchases >= 100
            and
            stock <= 20
        ):
            opportunity_score += 15

            reasons.append(
                "High demand with limited inventory."
            )

            actions.append(
                "Prioritize inventory replenishment."
            )

        # -------------------------------------------------
        # ESTIMATED OPPORTUNITY
        # -------------------------------------------------

        estimated_revenue_opportunity = 0

        if cart_adds > purchases:

            lost_purchase_count = (
                cart_adds -
                purchases
            )

            conservative_recovery_rate = (
                0.10
            )

            estimated_recovered_purchases = (
                lost_purchase_count *
                conservative_recovery_rate
            )

            estimated_revenue_opportunity = (
                estimated_recovered_purchases *
                price
            )

        if opportunity_score == 0:
            continue

        opportunity_score = min(
            opportunity_score,
            100,
        )

        opportunities.append(
            {
                "product_id":
                    str(
                        product["_id"]
                    ),

                "product_name":
                    product.get(
                        "name"
                    ),

                "category":
                    product.get(
                        "category"
                    ),

                "price":
                    price,

                "views":
                    views,

                "cart_adds":
                    cart_adds,

                "purchases":
                    purchases,

                "revenue":
                    revenue,

                "cart_rate":
                    round(
                        cart_rate,
                        2,
                    ),

                "purchase_rate":
                    round(
                        purchase_rate,
                        2,
                    ),

                "cart_to_purchase_rate":
                    round(
                        cart_to_purchase_rate,
                        2,
                    ),

                "opportunity_score":
                    opportunity_score,

                "estimated_revenue_opportunity":
                    round(
                        estimated_revenue_opportunity,
                        2,
                    ),

                "reasons":
                    reasons,

                "recommended_actions":
                    actions,
            }
        )

    opportunities.sort(
        key=lambda item: (
            item[
                "opportunity_score"
            ],
            item[
                "estimated_revenue_opportunity"
            ],
        ),
        reverse=True,
    )

    return opportunities


# =========================================================
# PAYMENT FAILURE ANALYSIS
# =========================================================

def get_payment_failure_analysis(
    merchant_id: str,
) -> dict:
    merchant_object_id = ObjectId(
        merchant_id
    )

    failed_orders = list(
        orders_collection.find(
            {
                "merchant":
                    merchant_object_id,

                "payment.status":
                    "failed",
            }
        )
    )

    total_failures = len(
        failed_orders
    )

    failure_reasons = {}

    payment_methods = {}

    lost_revenue = 0

    for order in failed_orders:

        payment = (
            order.get(
                "payment",
                {},
            )
            or {}
        )

        reason = (
            payment.get(
                "failureReason"
            )
            or "Unknown"
        )

        failure_reasons[
            reason
        ] = (
            failure_reasons.get(
                reason,
                0,
            )
            + 1
        )

        method = (
            payment.get(
                "method"
            )
            or "unknown"
        )

        payment_methods[
            method
        ] = (
            payment_methods.get(
                method,
                0,
            )
            + 1
        )

        lost_revenue += float(
            order.get(
                "totalAmount",
                0,
            )
            or 0
        )

    return {
        "total_failures":
            total_failures,

        "failure_reasons":
            failure_reasons,

        "payment_methods":
            payment_methods,

        "estimated_lost_revenue":
            round(
                lost_revenue,
                2,
            ),
    }