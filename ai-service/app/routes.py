from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.agents.growth_agent import (
    build_growth_agent,
)

from app.agents.buyer_agent import (
    recommend_products,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/agent",
    tags=["AI Agents"],
)


# =========================================================
# GROWTH AGENT
# =========================================================

growth_agent = build_growth_agent()


@router.post("/analyze/{merchant_id}")
async def analyze_merchant(
    merchant_id: str,
):
    try:

        result = growth_agent.invoke(
            {
                "merchant_id":
                    merchant_id,
            }
        )

        return {
            "success": True,

            "agent":
                "MerchantOS Growth Agent",

            "data":
                {
                    "overview":
                        result.get(
                            "overview",
                            {},
                        ),

                    "diagnosis":
                        result.get(
                            "diagnosis",
                            {},
                        ),

                    "recommendations":
                        result.get(
                            "recommendations",
                            [],
                        ),

                    "ai_analysis":
                        result.get(
                            "ai_analysis",
                            "",
                        ),
                },
        }

    except Exception as error:

        print(
            "Growth agent error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# AI BUYER REQUEST MODEL
# =========================================================

class BuyerRequest(BaseModel):
    merchant_id: str = Field(
        ...,
        min_length=1,
    )

    message: str = Field(
        ...,
        min_length=1,
    )

    history: list[dict[str, Any]] = Field(
        default_factory=list,
    )


# =========================================================
# AI BUYER
# =========================================================

@router.post("/buyer/recommend")
async def recommend_buyer_products(
    request: BuyerRequest,
):

    try:

        result = recommend_products(
            merchant_id=request.merchant_id,
            message=request.message,
            history=request.history,
        )

        return {
            "success": True,

            "agent":
                "MerchantOS AI Buyer",

            "data":
                result,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:

        print(
            "AI Buyer agent error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )