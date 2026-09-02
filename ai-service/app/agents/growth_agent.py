from typing import TypedDict

from langgraph.graph import (
    StateGraph,
    START,
    END,
)

from app.services.llm import get_llm

from app.tools.analytics_tools import (
    get_merchant_overview,
    get_product_opportunities,
    get_cross_sell_opportunities,
    get_payment_failure_analysis,
    get_ai_buyer_analytics,
)


# =========================================================
# STATE
# =========================================================

class GrowthAgentState(
    TypedDict,
    total=False,
):

    merchant_id: str

    overview: dict

    product_opportunities: list

    cross_sell_opportunities: list

    payment_analysis: dict

    ai_buyer_analytics: dict

    diagnosis: dict

    recommendations: list

    ai_analysis: str


# =========================================================
# COLLECT BUSINESS DATA
# =========================================================

def collect_business_data(
    state: GrowthAgentState,
) -> GrowthAgentState:

    merchant_id = (
        state["merchant_id"]
    )

    overview = (
        get_merchant_overview(
            merchant_id
        )
    )

    product_opportunities = (
        get_product_opportunities(
            merchant_id
        )
    )

    cross_sell_opportunities = (
        get_cross_sell_opportunities(
            merchant_id
        )
    )

    payment_analysis = (
        get_payment_failure_analysis(
            merchant_id
        )
    )

    ai_buyer_analytics = (
        get_ai_buyer_analytics(
            merchant_id
        )
    )

    return {
        **state,

        "overview":
            overview,

        "product_opportunities":
            product_opportunities,

        "cross_sell_opportunities":
            cross_sell_opportunities,

        "payment_analysis":
            payment_analysis,

        "ai_buyer_analytics":
            ai_buyer_analytics,
    }


# =========================================================
# DIAGNOSIS
# =========================================================

def diagnose_business(
    state: GrowthAgentState,
) -> GrowthAgentState:

    overview = (
        state["overview"]
    )

    product_opportunities = (
        state[
            "product_opportunities"
        ]
    )

    cross_sell_opportunities = (
        state[
            "cross_sell_opportunities"
        ]
    )

    payment_analysis = (
        state[
            "payment_analysis"
        ]
    )

    ai_buyer_analytics = (
        state[
            "ai_buyer_analytics"
        ]
    )

    issues = []

    payment_success_rate = (
        overview.get(
            "payment_success_rate",
            0,
        )
    )

    # =====================================================
    # PAYMENT ISSUE
    # =====================================================

    if payment_success_rate < 90:

        issues.append(
            {
                "type":
                    "payment_conversion",

                "severity":
                    "high",

                "title":
                    "Payment conversion problem",

                "evidence":
                    (
                        f"Payment success rate is "
                        f"{payment_success_rate}%."
                    ),

                "impact":
                    (
                        "Failed payments may be "
                        "causing revenue leakage."
                    ),

                "estimated_loss":
                    payment_analysis.get(
                        "estimated_lost_revenue",
                        0,
                    ),
            }
        )

    # =====================================================
    # PRODUCT OPPORTUNITY
    # =====================================================

    behavioral_products = [
        item
        for item in product_opportunities
        if item.get(
            "views",
            0,
        ) > 0
    ]

    if behavioral_products:

        top = behavioral_products[0]

        issue = {
            "type":
                "product_conversion",

            "severity":
                "high",

            "title":
                "Product conversion opportunity",

            "product":
                top.get(
                    "product_name",
                    "Top product",
                ),

            "opportunity_score":
                top.get(
                    "opportunity_score",
                    0,
                ),

            "evidence":
                top.get(
                    "reasons",
                    [],
                ),

            "metrics":
                {
                    "views":
                        top.get(
                            "views",
                            0,
                        ),

                    "cart_adds":
                        top.get(
                            "cart_adds",
                            0,
                        ),

                    "purchases":
                        top.get(
                            "purchases",
                            0,
                        ),

                    "cart_to_purchase_rate":
                        top.get(
                            "cart_to_purchase_rate",
                            0,
                        ),
                },

            "estimated_revenue_opportunity":
                top.get(
                    "estimated_revenue_opportunity",
                    0,
                ),
        }

        issues.append(
            issue
        )

    # =====================================================
    # CROSS SELL ISSUE
    # =====================================================

    if cross_sell_opportunities:

        top_cross_sell = (
            cross_sell_opportunities[0]
        )

        issues.append(
            {
                "type":
                    "cross_sell",

                "severity":
                    "medium",

                "title":
                    "Cross-sell opportunity",

                "product":
                    top_cross_sell.get(
                        "primary_product_name"
                    ),

                "recommended_product":
                    top_cross_sell.get(
                        "complementary_product_name"
                    ),

                "opportunity_score":
                    top_cross_sell.get(
                        "score",
                        0,
                    ),

                "evidence":
                    top_cross_sell.get(
                        "reasons",
                        [],
                    ),

                "estimated_revenue_opportunity":
                    top_cross_sell.get(
                        "estimated_revenue_opportunity",
                        0,
                    ),
            }
        )

    # =====================================================
    # AI BUYER PERFORMANCE
    # =====================================================

    ai_buyer_orders = (
        ai_buyer_analytics.get(
            "paid_ai_buyer_orders",
            0,
        )
    )

    ai_buyer_revenue = (
        ai_buyer_analytics.get(
            "ai_buyer_revenue",
            0,
        )
    )

    ai_buyer_revenue_share = (
        ai_buyer_analytics.get(
            "ai_buyer_revenue_share",
            0,
        )
    )

    if ai_buyer_orders > 0:

        issues.append(
            {
                "type":
                    "ai_buyer_growth",

                "severity":
                    "medium",

                "title":
                    "AI Buyer revenue channel",

                "evidence":
                    (
                        f"AI Buyer generated "
                        f"{ai_buyer_orders} paid order(s) "
                        f"and ₹{ai_buyer_revenue:.2f} "
                        "in revenue."
                    ),

                "revenue":
                    ai_buyer_revenue,

                "revenue_share":
                    ai_buyer_revenue_share,
            }
        )

    # =====================================================
    # AOV
    # =====================================================

    if (
        overview.get(
            "average_order_value",
            0,
        ) > 0
    ):

        issues.append(
            {
                "type":
                    "average_order_value",

                "severity":
                    "medium",

                "title":
                    "Average Order Value Opportunity",

                "evidence":
                    [
                        (
                            "Complementary products "
                            "can increase basket value."
                        )
                    ],

                "current_aov":
                    overview.get(
                        "average_order_value",
                        0,
                    ),
            }
        )

    # =====================================================
    # BUSINESS HEALTH
    # =====================================================

    has_high_issue = any(
        issue.get(
            "severity"
        ) == "high"
        for issue in issues
    )

    if has_high_issue:

        business_health = (
            "critical"
            if payment_success_rate < 70
            else "needs_attention"
        )

    elif issues:

        business_health = (
            "needs_attention"
        )

    else:

        business_health = (
            "healthy"
        )

    return {
        **state,

        "diagnosis":
            {
                "business_health":
                    business_health,

                "issues":
                    issues,

                "payment_analysis":
                    payment_analysis,

                "ai_buyer_analytics":
                    ai_buyer_analytics,
            },
    }


# =========================================================
# RECOMMENDATIONS
# =========================================================

def generate_recommendations(
    state: GrowthAgentState,
) -> GrowthAgentState:

    recommendations = []

    payment_analysis = (
        state[
            "payment_analysis"
        ]
    )

    product_opportunities = (
        state[
            "product_opportunities"
        ]
    )

    cross_sell_opportunities = (
        state[
            "cross_sell_opportunities"
        ]
    )

    ai_buyer_analytics = (
        state[
            "ai_buyer_analytics"
        ]
    )

    # =====================================================
    # PAYMENT RECOVERY
    # =====================================================

    if (
        payment_analysis.get(
            "total_failures",
            0,
        )
        > 0
    ):

        recommendations.append(
            {
                "id":
                    "PAYMENT_RECOVERY",

                "action":
                    "Recover failed payments",

                "priority":
                    "HIGH",

                "reason":
                    (
                        f"{payment_analysis['total_failures']} "
                        "failed payment attempts detected."
                    ),

                "estimated_impact":
                    payment_analysis.get(
                        "estimated_lost_revenue",
                        0,
                    ),

                "financial_action":
                    True,

                "requires_approval":
                    True,
            }
        )

    # =====================================================
    # CONVERSION EXPERIMENT
    # =====================================================

    behavioral_products = [
        item
        for item in product_opportunities
        if item.get(
            "views",
            0,
        ) > 0
    ]

    if behavioral_products:

        top = behavioral_products[0]

        recommendations.append(
            {
                "id":
                    "CONVERSION_EXPERIMENT",

                "action":
                    "Run controlled conversion experiment",

                "priority":
                    "HIGH",

                "product":
                    top.get(
                        "product_name"
                    ),

                "opportunity_score":
                    top.get(
                        "opportunity_score",
                        0,
                    ),

                "estimated_impact":
                    top.get(
                        "estimated_revenue_opportunity",
                        0,
                    ),

                "recommended_actions":
                    top.get(
                        "recommended_actions",
                        [],
                    ),

                "financial_action":
                    True,

                "requires_approval":
                    True,
            }
        )

    # =====================================================
    # AI BUYER GROWTH
    # =====================================================

    ai_buyer_orders = (
        ai_buyer_analytics.get(
            "paid_ai_buyer_orders",
            0,
        )
    )

    ai_buyer_revenue = (
        ai_buyer_analytics.get(
            "ai_buyer_revenue",
            0,
        )
    )

    ai_buyer_revenue_share = (
        ai_buyer_analytics.get(
            "ai_buyer_revenue_share",
            0,
        )
    )

    if ai_buyer_orders > 0:

        estimated_impact = (
            ai_buyer_revenue * 0.10
        )

        recommendations.append(
            {
                "id":
                    "AI_BUYER_GROWTH",

                "action":
                    "Increase AI Buyer conversion",

                "priority":
                    "MEDIUM",

                "reason":
                    (
                        f"AI Buyer currently contributes "
                        f"₹{ai_buyer_revenue:.2f} in revenue "
                        f"({ai_buyer_revenue_share:.2f}% of merchant revenue). "
                        "Improving AI-assisted discovery, "
                        "recommendations, and cross-sell can "
                        "increase this channel."
                    ),

                "estimated_impact":
                    round(
                        estimated_impact,
                        2,
                    ),

                "current_revenue":
                    round(
                        ai_buyer_revenue,
                        2,
                    ),

                "current_revenue_share":
                    round(
                        ai_buyer_revenue_share,
                        2,
                    ),

                "recommended_actions":
                    [
                        (
                            "Review AI Buyer queries "
                            "and recommendation quality."
                        ),

                        (
                            "Improve product metadata "
                            "for better intent matching."
                        ),

                        (
                            "Use complementary products "
                            "for AI cross-sell."
                        ),
                    ],

                "financial_action":
                    False,

                "requires_approval":
                    True,
            }
        )

    # =====================================================
    # INTELLIGENT CROSS SELL
    # =====================================================

    if cross_sell_opportunities:

        top_cross_sell = (
            cross_sell_opportunities[0]
        )

        recommendations.append(
            {
                "id":
                    "SMART_CROSS_SELL",

                "action":
                    (
                        "Create intelligent cross-sell "
                        "recommendations"
                    ),

                "priority":
                    "MEDIUM",

                "product":
                    top_cross_sell.get(
                        "complementary_product_name"
                    ),

                "primary_product":
                    top_cross_sell.get(
                        "primary_product_name"
                    ),

                "complementary_product":
                    top_cross_sell.get(
                        "complementary_product_name"
                    ),

                "reason":
                    (
                        top_cross_sell.get(
                            "strategy"
                        )
                        or
                        (
                            "Recommend complementary "
                            "products to increase basket value."
                        )
                    ),

                "estimated_impact":
                    top_cross_sell.get(
                        "estimated_revenue_opportunity",
                        0,
                    ),

                "opportunity_score":
                    top_cross_sell.get(
                        "score",
                        0,
                    ),

                "recommended_actions":
                    [
                        (
                            "Show the complementary product "
                            "on the primary product page."
                        ),

                        (
                            "Use the complementary product "
                            "in cart recommendations."
                        ),

                        (
                            "Test the recommendation on "
                            "customers with matching intent."
                        ),
                    ],

                "cross_sell_details":
                    {
                        "primary_product":
                            top_cross_sell.get(
                                "primary_product_name"
                            ),

                        "complementary_product":
                            top_cross_sell.get(
                                "complementary_product_name"
                            ),

                        "primary_price":
                            top_cross_sell.get(
                                "primary_product_price"
                            ),

                        "complementary_price":
                            top_cross_sell.get(
                                "complementary_product_price"
                            ),

                        "score":
                            top_cross_sell.get(
                                "score"
                            ),

                        "reasons":
                            top_cross_sell.get(
                                "reasons",
                                [],
                            ),
                    },

                "financial_action":
                    False,

                "requires_approval":
                    True,
            }
        )

    else:

        # -------------------------------------------------
        # FALLBACK CROSS SELL
        # -------------------------------------------------

        recommendations.append(
            {
                "id":
                    "SMART_CROSS_SELL",

                "action":
                    (
                        "Create intelligent cross-sell "
                        "recommendations"
                    ),

                "priority":
                    "MEDIUM",

                "reason":
                    (
                        "The catalog does not yet contain "
                        "enough product relationships to "
                        "calculate a specific cross-sell pair."
                    ),

                "estimated_impact":
                    0,

                "opportunity_score":
                    0,

                "recommended_actions":
                    [
                        (
                            "Add complementary product "
                            "metadata such as tags, "
                            "use cases, and compatibility."
                        )
                    ],

                "financial_action":
                    False,

                "requires_approval":
                    True,
            }
        )

    return {
        **state,

        "recommendations":
            recommendations,
    }


# =========================================================
# AI ANALYSIS
# =========================================================

def generate_ai_analysis(
    state: GrowthAgentState,
) -> GrowthAgentState:

    llm = get_llm()

    overview = (
        state["overview"]
    )

    diagnosis = (
        state["diagnosis"]
    )

    recommendations = (
        state["recommendations"]
    )

    cross_sell_opportunities = (
        state[
            "cross_sell_opportunities"
        ]
    )

    ai_buyer_analytics = (
        state[
            "ai_buyer_analytics"
        ]
    )

    prompt = f"""
You are the senior AI Growth Strategist
inside MerchantOS.

Analyze the merchant data below.

BUSINESS OVERVIEW:
{overview}

DIAGNOSIS:
{diagnosis}

AI BUYER ANALYTICS:
{ai_buyer_analytics}

CROSS-SELL OPPORTUNITIES:
{cross_sell_opportunities}

RECOMMENDATIONS:
{recommendations}

Produce a concise executive-level analysis.

Explain:

1. BUSINESS HEALTH
2. BIGGEST OPPORTUNITY
3. REVENUE LEAKAGE
4. CROSS-SELL OPPORTUNITY
5. AI BUYER PERFORMANCE
6. WHY IT MATTERS
7. RECOMMENDED NEXT ACTION
8. EXPECTED IMPACT
9. RISK

Rules:

- Use only the supplied data.
- Never invent actual revenue.
- Clearly distinguish estimated impact
  from actual revenue.
- Mention specific product names when
  a cross-sell pair is available.
- Mention AI Buyer revenue separately
  from total merchant revenue.
- Never claim an action was executed.
- Merchant approval is required before
  executing an agent action.
"""

    response = llm.invoke(
        prompt
    )

    return {
        **state,

        "ai_analysis":
            response.content,
    }


# =========================================================
# BUILD AGENT
# =========================================================

def build_growth_agent():

    workflow = StateGraph(
        GrowthAgentState
    )

    workflow.add_node(
        "collect_business_data",
        collect_business_data,
    )

    workflow.add_node(
        "diagnose_business",
        diagnose_business,
    )

    workflow.add_node(
        "generate_recommendations",
        generate_recommendations,
    )

    workflow.add_node(
        "generate_ai_analysis",
        generate_ai_analysis,
    )

    workflow.add_edge(
        START,
        "collect_business_data",
    )

    workflow.add_edge(
        "collect_business_data",
        "diagnose_business",
    )

    workflow.add_edge(
        "diagnose_business",
        "generate_recommendations",
    )

    workflow.add_edge(
        "generate_recommendations",
        "generate_ai_analysis",
    )

    workflow.add_edge(
        "generate_ai_analysis",
        END,
    )

    return workflow.compile()