import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  recommendAIBuyerProducts,
  createAIBuyerOrder,
  createAIBuyerPayment,
  getAIBuyerCatalog,
  verifyAIBuyerPayment,
} from "../services/aiBuyerService";

/* =========================================================
   HELPERS
   ========================================================= */

const formatCurrency = (
  amount,
  currency = "INR"
) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  } catch {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  }
};

const getProductId = (product) => {
  return String(
    product?.id ||
      product?._id ||
      product?.productId ||
      ""
  );
};

const getProductText = (product) => {
  return [
    product?.name,
    product?.description,
    product?.category,
    ...(product?.features || []),
    ...(product?.tags || []),
    ...(product?.useCases || []),
    ...(product?.targetAudience || []),
    ...(product?.sellingPoints || []),
    ...(product?.compatibleWith || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

/* =========================================================
   LOCAL FALLBACK SEARCH
   ========================================================= */

const findProducts = (
  products,
  query
) => {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products.slice(0, 6);
  }

  const queryWords =
    normalizedQuery
      .split(/\s+/)
      .filter(
        (word) => word.length > 2
      );

  const scored =
    products.map((product) => {
      const text =
        getProductText(product);

      let score = 0;

      if (
        text.includes(
          normalizedQuery
        )
      ) {
        score += 10;
      }

      queryWords.forEach(
        (word) => {
          if (text.includes(word)) {
            score += 2;
          }
        }
      );

      return {
        product,
        score,
      };
    });

  return scored
    .filter(
      (item) => item.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 6)
    .map(
      (item) => item.product
    );
};

/* =========================================================
   LOCAL FALLBACK CROSS SELL
   ========================================================= */

const findCrossSellProducts = (
  products,
  primaryProduct
) => {
  if (!primaryProduct) {
    return [];
  }

  const primaryId =
    getProductId(primaryProduct);

  const primaryText =
    getProductText(
      primaryProduct
    );

  const compatibilityTerms = [
    ...(primaryProduct.tags || []).map(
      (item) =>
        String(item).toLowerCase()
    ),

    ...(primaryProduct.features ||
      []
    ).map((item) =>
      String(item).toLowerCase()
    ),

    ...(primaryProduct.compatibleWith ||
      []
    ).map((item) =>
      String(item).toLowerCase()
    ),
  ];

  const scored = products
    .filter(
      (product) =>
        getProductId(product) !==
        primaryId
    )
    .map((product) => {
      const text =
        getProductText(product);

      let score = 0;

      compatibilityTerms.forEach(
        (term) => {
          if (
            term &&
            text.includes(term)
          ) {
            score += 3;
          }
        }
      );

      if (
        primaryText.includes("watch") &&
        (text.includes(
          "headphone"
        ) ||
          text.includes("earbud") ||
          text.includes("audio"))
      ) {
        score += 8;
      }

      if (
        primaryText.includes("phone") &&
        (text.includes("case") ||
          text.includes("charger") ||
          text.includes("earbud"))
      ) {
        score += 8;
      }

      if (
        primaryText.includes("laptop") &&
        (text.includes("mouse") ||
          text.includes("keyboard") ||
          text.includes("bag"))
      ) {
        score += 8;
      }

      if (
        primaryText.includes("camera") &&
        (text.includes("tripod") ||
          text.includes("bag") ||
          text.includes("lens"))
      ) {
        score += 8;
      }

      return {
        product,
        score,
      };
    });

  return scored
    .filter(
      (item) => item.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 3)
    .map(
      (item) => item.product
    );
};

/* =========================================================
   RAZORPAY SCRIPT
   ========================================================= */

const loadRazorpayScript =
  () => {
    return new Promise(
      (resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const scriptUrl =
          "https://checkout.razorpay.com/v1/checkout.js";

        const existingScript =
          document.querySelector(
            `script[src="${scriptUrl}"]`
          );

        if (existingScript) {
          existingScript.addEventListener(
            "load",
            () => resolve(true),
            { once: true }
          );

          existingScript.addEventListener(
            "error",
            () => resolve(false),
            { once: true }
          );

          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          scriptUrl;

        script.async = true;

        script.onload = () =>
          resolve(true);

        script.onerror = () =>
          resolve(false);

        document.body.appendChild(
          script
        );
      }
    );
  };

/* =========================================================
   AI PRODUCT NORMALIZATION
   ========================================================= */

const normalizeAIProduct = (
  aiProduct,
  catalog
) => {
  if (!aiProduct) {
    return null;
  }

  const aiId =
    getProductId(aiProduct);

  if (!aiId) {
    return null;
  }

  const catalogProduct =
    catalog.find(
      (product) =>
        getProductId(product) ===
        aiId
    );

  if (!catalogProduct) {
    return null;
  }

  return {
    ...catalogProduct,
    ...aiProduct,
    id:
      catalogProduct.id ||
      catalogProduct._id,
  };
};

const normalizeAIProducts = (
  aiProducts,
  recommendedIds,
  catalog
) => {
  const normalized = [];

  if (
    Array.isArray(aiProducts)
  ) {
    aiProducts.forEach(
      (product) => {
        const normalizedProduct =
          normalizeAIProduct(
            product,
            catalog
          );

        if (
          normalizedProduct &&
          !normalized.some(
            (item) =>
              getProductId(item) ===
              getProductId(
                normalizedProduct
              )
          )
        ) {
          normalized.push(
            normalizedProduct
          );
        }
      }
    );
  }

  if (
    Array.isArray(
      recommendedIds
    )
  ) {
    recommendedIds.forEach(
      (id) => {
        const normalizedId =
          String(id);

        const catalogProduct =
          catalog.find(
            (product) =>
              getProductId(
                product
              ) === normalizedId
          );

        if (
          catalogProduct &&
          !normalized.some(
            (item) =>
              getProductId(item) ===
              normalizedId
          )
        ) {
          normalized.push(
            catalogProduct
          );
        }
      }
    );
  }

  return normalized;
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function AIBuyer({
  merchant,
}) {
  const merchantId =
    merchant?._id ||
    merchant?.id ||
    merchant?.merchantId ||
    localStorage.getItem(
      "merchantId"
    ) ||
    localStorage.getItem(
      "merchant_id"
    ) ||
    "";

  const merchantName =
    merchant?.businessName ||
    merchant?.name ||
    merchant?.storeName ||
    "NovaTech Store";

  const [
    catalog,
    setCatalog,
  ] = useState([]);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    messages,
    setMessages,
  ] = useState([
    {
      id: 1,
      sender: "ai",
      type: "text",
      text:
        "Hi! I'm your AI shopping assistant. Tell me what you're looking for, your budget, features, or how you plan to use the product.",
    },
  ]);

  const [
    recommendations,
    setRecommendations,
  ] = useState([]);

  const [
    crossSellProduct,
    setCrossSellProduct,
  ] = useState(null);

  const [
    crossSellReason,
    setCrossSellReason,
  ] = useState("");

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState("");

  const [
    loadingCatalog,
    setLoadingCatalog,
  ] = useState(true);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    creatingOrder,
    setCreatingOrder,
  ] = useState(false);

  const [
    paymentProcessing,
    setPaymentProcessing,
  ] = useState(false);

  const [
    paymentSuccess,
    setPaymentSuccess,
  ] = useState(false);

  const [
    completedOrder,
    setCompletedOrder,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     LOAD AI-READY CATALOG
     ======================================================= */

  useEffect(() => {
    const loadCatalog =
      async () => {
        if (!merchantId) {
          setLoadingCatalog(
            false
          );

          setError(
            "Merchant ID is not available."
          );

          return;
        }

        try {
          setLoadingCatalog(
            true
          );

          setError("");

          console.log(
            "AI Buyer merchant ID:",
            merchantId
          );

          const response =
            await getAIBuyerCatalog(
              merchantId
            );

          console.log(
            "AI Buyer catalog response:",
            response
          );

          const products =
            response?.data
              ?.data
              ?.products ||
            response?.data
              ?.products ||
            response?.products ||
            [];

          setCatalog(
            Array.isArray(
              products
            )
              ? products
              : []
          );
        } catch (err) {
          console.error(
            "AI Buyer catalog error:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Unable to load the merchant catalog."
          );
        } finally {
          setLoadingCatalog(
            false
          );
        }
      };

    loadCatalog();
  }, [merchantId]);

  /* =======================================================
     LOCAL RECOMMENDATIONS
     ======================================================= */

  const localRecommendations =
    useMemo(() => {
      return findProducts(
        catalog,
        query
      );
    }, [
      catalog,
      query,
    ]);

  /* =======================================================
     REAL AI BUYER SEARCH
     ======================================================= */

  const handleSearch = async (
    event
  ) => {
    event?.preventDefault();

    const currentQuery =
      query.trim();

    if (!currentQuery) {
      return;
    }

    if (!merchantId) {
      setError(
        "Merchant ID is not available."
      );

      return;
    }

    setSearching(true);
    setError("");

    const userMessage = {
      id: Date.now(),
      sender: "user",
      type: "text",
      text: currentQuery,
    };

    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ]
    );

    setQuery("");

    try {
      /* ---------------------------------------------------
         BUILD CONVERSATION HISTORY
         --------------------------------------------------- */

      const history =
        messages.map(
          (message) => ({
            role:
              message.sender ===
              "user"
                ? "user"
                : "assistant",

            content:
              message.text,
          })
        );

      /* ---------------------------------------------------
         CALL EXPRESS → FASTAPI → BUYER AGENT
         --------------------------------------------------- */

      const response =
        await recommendAIBuyerProducts(
          {
            merchantId,
            message:
              currentQuery,
            history,
          }
        );

      console.log(
        "AI Buyer recommendation response:",
        response
      );

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   agent: "MerchantOS AI Buyer",
       *   data: {
       *     reply,
       *     intent,
       *     recommended_products,
       *     cross_sell_product,
       *     cross_sell_reason,
       *     confidence
       *   }
       * }
       */

      const aiData =
        response?.data?.data ||
        {};

      /* ---------------------------------------------------
         AI PRODUCT RECOMMENDATIONS
         --------------------------------------------------- */

      const aiProducts =
        Array.isArray(
          aiData
            ?.recommended_products
        )
          ? aiData.recommended_products
          : [];

      const aiProductIds =
        Array.isArray(
          aiData
            ?.recommended_product_ids
        )
          ? aiData.recommended_product_ids
          : [];

      const aiRecommendedProducts =
        normalizeAIProducts(
          aiProducts,
          aiProductIds,
          catalog
        );

      /* ---------------------------------------------------
         FALLBACK TO LOCAL SEARCH
         --------------------------------------------------- */

      const fallbackProducts =
        findProducts(
          catalog,
          currentQuery
        );

      const finalProducts =
        aiRecommendedProducts.length >
        0
          ? aiRecommendedProducts
          : fallbackProducts;

      /* ---------------------------------------------------
         AI CROSS SELL
         --------------------------------------------------- */

      let normalizedCrossSell =
        null;

      if (
        aiData?.cross_sell_product
      ) {
        normalizedCrossSell =
          normalizeAIProduct(
            aiData.cross_sell_product,
            catalog
          );
      }

      /*
       * Local cross-sell fallback
       */

      if (
        !normalizedCrossSell &&
        finalProducts.length >
          0
      ) {
        const fallbackCrossSell =
          findCrossSellProducts(
            catalog,
            finalProducts[0]
          );

        normalizedCrossSell =
          fallbackCrossSell[0] ||
          null;
      }

      setRecommendations(
        finalProducts
      );

      setCrossSellProduct(
        normalizedCrossSell
      );

      setCrossSellReason(
        aiData?.cross_sell_reason ||
          ""
      );

      /* ---------------------------------------------------
         AI TEXT RESPONSE
         --------------------------------------------------- */

      let responseText =
        aiData?.reply ||
        aiData?.message ||
        "";

      if (!responseText) {
        if (
          finalProducts.length >
          0
        ) {
          const topProduct =
            finalProducts[0];

          responseText =
            `Based on your request, my top recommendation is ${topProduct.name}.`;

          if (
            finalProducts.length >
            1
          ) {
            responseText +=
              ` I also found ${
                finalProducts.length -
                1
              } other matching products.`;
          }
        } else {
          responseText =
            "I couldn't find a suitable product for that request. Try mentioning a product type, budget, feature, or use case.";
        }
      }

      /* ---------------------------------------------------
         ADD AI RESPONSE TO CHAT
         --------------------------------------------------- */

      setMessages(
        (previous) => [
          ...previous,
          {
            id:
              Date.now() + 1,
            sender: "ai",
            type:
              finalProducts.length >
              0
                ? "recommendation"
                : "text",
            text:
              responseText,
            products:
              finalProducts,
          },
        ]
      );

      /* ---------------------------------------------------
         AI CROSS-SELL MESSAGE
         --------------------------------------------------- */

      if (
        normalizedCrossSell &&
        aiData?.cross_sell_reason
      ) {
        setMessages(
          (previous) => [
            ...previous,
            {
              id:
                Date.now() + 2,
              sender: "ai",
              type: "text",
              text:
                `Smart cross-sell: ${normalizedCrossSell.name}. ${aiData.cross_sell_reason}`,
            },
          ]
        );
      }
    } catch (err) {
      console.error(
        "AI Buyer agent error:",
        err
      );

      /*
       * IMPORTANT:
       * The application still works if the
       * AI service is temporarily unavailable.
       */

      const fallbackProducts =
        findProducts(
          catalog,
          currentQuery
        );

      setRecommendations(
        fallbackProducts
      );

      if (
        fallbackProducts.length >
        0
      ) {
        const topProduct =
          fallbackProducts[0];

        setMessages(
          (previous) => [
            ...previous,
            {
              id:
                Date.now() + 1,
              sender: "ai",
              type:
                "recommendation",
              text:
                `The AI service is temporarily unavailable, but I found ${fallbackProducts.length} matching product${
                  fallbackProducts.length ===
                  1
                    ? ""
                    : "s"
                }. My top match is ${topProduct.name}.`,
              products:
                fallbackProducts,
            },
          ]
        );
      } else {
        setMessages(
          (previous) => [
            ...previous,
            {
              id:
                Date.now() + 1,
              sender: "ai",
              type: "text",
              text:
                "The AI service is temporarily unavailable and I couldn't find a catalog match.",
            },
          ]
        );
      }

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Unable to contact the AI Buyer."
      );
    } finally {
      setSearching(false);
    }
  };

  /* =======================================================
     PRODUCT SELECTION
     ======================================================= */

  const handleSelectProduct =
    (product) => {
      setSelectedProduct(
        product
      );

      /*
       * If AI already recommended a
       * cross-sell, try to keep it.
       */
      let bestCrossSell =
        crossSellProduct;

      /*
       * Otherwise use local heuristic.
       */
      if (!bestCrossSell) {
        const relatedProducts =
          findCrossSellProducts(
            catalog,
            product
          );

        bestCrossSell =
          relatedProducts.length >
          0
            ? relatedProducts[0]
            : null;
      }

      /*
       * Never recommend the selected
       * product as its own cross-sell.
       */

      if (
        bestCrossSell &&
        getProductId(
          bestCrossSell
        ) ===
          getProductId(product)
      ) {
        bestCrossSell = null;
      }

      setCrossSellProduct(
        bestCrossSell
      );

      setQuantity(1);

      setPaymentSuccess(false);

      setCompletedOrder(
        null
      );

      setMessages(
        (previous) => [
          ...previous,
          {
            id: Date.now(),
            sender: "ai",
            type: "text",
            text:
              bestCrossSell
                ? `Great choice. I also recommend ${bestCrossSell.name}, which complements ${product.name}.`
                : `Great choice. ${product.name} is available for ${formatCurrency(
                    product.price,
                    product.currency
                  )}.`,
          },
        ]
      );
    };

  /* =======================================================
     CREATE ORDER + RAZORPAY
     ======================================================= */

  const handleCreateOrderAndPay =
    async () => {
      if (!merchantId) {
        setError(
          "Merchant ID is not configured."
        );

        return;
      }

      if (!selectedProduct) {
        setError(
          "Please select a product first."
        );

        return;
      }

      if (!customerName.trim()) {
        setError(
          "Please enter the customer name."
        );

        return;
      }

      if (!customerEmail.trim()) {
        setError(
          "Please enter the customer email."
        );

        return;
      }

      if (
        quantity <= 0 ||
        !Number.isInteger(
          Number(quantity)
        )
      ) {
        setError(
          "Quantity must be a positive integer."
        );

        return;
      }

      const availableStock =
        Number(
          selectedProduct.stock ||
            0
        );

      if (
        availableStock > 0 &&
        Number(quantity) >
          availableStock
      ) {
        setError(
          `Only ${availableStock} units are available.`
        );

        return;
      }

      try {
        setCreatingOrder(true);

        setError("");

        setPaymentSuccess(false);

        setCompletedOrder(
          null
        );

        /* -----------------------------------------------
           1. CREATE MERCHANTOS ORDER
           ----------------------------------------------- */

        const productId =
          selectedProduct.id ||
          selectedProduct._id;

        if (!productId) {
          throw new Error(
            "Selected product ID is missing."
          );
        }

        console.log(
          "Creating AI Buyer order..."
        );

        const orderResponse =
          await createAIBuyerOrder({
            merchantId,

            productId,

            quantity:
              Number(quantity),

            customerInfo: {
              name:
                customerName.trim(),

              email:
                customerEmail.trim(),

              phone:
                customerPhone.trim(),
            },
          });

        console.log(
          "AI Buyer order response:",
          orderResponse
        );

        /*
         * Controller returns:
         *
         * {
         *   success: true,
         *   data: {
         *     order: {...}
         *   }
         * }
         */

        const createdOrder =
          orderResponse?.data
            ?.data
            ?.order ||
          orderResponse?.data
            ?.order ||
          orderResponse?.order ||
          null;

        const merchantOrderId =
          createdOrder?._id ||
          createdOrder?.id;

        if (!merchantOrderId) {
          throw new Error(
            "MerchantOS order was created but no order ID was returned."
          );
        }

        /* -----------------------------------------------
           2. LOAD RAZORPAY CHECKOUT
           ----------------------------------------------- */

        setCreatingOrder(
          false
        );

        setPaymentProcessing(
          true
        );

        const razorpayLoaded =
          await loadRazorpayScript();

        if (
          !razorpayLoaded ||
          !window.Razorpay
        ) {
          throw new Error(
            "Razorpay Checkout failed to load. Check your internet connection."
          );
        }

        /* -----------------------------------------------
           3. CREATE RAZORPAY ORDER
           ----------------------------------------------- */

        console.log(
          "Creating Razorpay order..."
        );

        const paymentResponse =
          await createAIBuyerPayment({
            merchantId,

            orderId:
              merchantOrderId,
          });

        console.log(
          "Razorpay order response:",
          paymentResponse
        );

        /*
         * Controller returns:
         *
         * {
         *   success: true,
         *   data: {
         *      razorpayOrderId,
         *      amount,
         *      currency,
         *      merchantKeyId
         *   }
         * }
         */

        const paymentData =
          paymentResponse?.data
            ?.data ||
          paymentResponse?.data ||
          paymentResponse ||
          {};

        const razorpayOrderId =
          paymentData?.razorpayOrderId;

        const razorpayKeyId =
          paymentData?.merchantKeyId;

        const amount =
          Number(
            paymentData?.amount ||
              0
          );

        const currency =
          paymentData?.currency ||
          createdOrder?.currency ||
          selectedProduct.currency ||
          "INR";

        if (!razorpayOrderId) {
          throw new Error(
            "Razorpay order ID was not returned by the backend."
          );
        }

        if (!razorpayKeyId) {
          throw new Error(
            "Razorpay Key ID was not returned by the backend."
          );
        }

        if (!amount) {
          throw new Error(
            "Invalid Razorpay amount returned by the backend."
          );
        }

        /* -----------------------------------------------
           4. OPEN RAZORPAY CHECKOUT
           ----------------------------------------------- */

        const options = {
          key:
            razorpayKeyId,

          amount:
            amount,

          currency,

          name:
            merchantName,

          description:
            selectedProduct.name,

          order_id:
            razorpayOrderId,

          prefill: {
            name:
              customerName.trim(),

            email:
              customerEmail.trim(),

            contact:
              customerPhone.trim(),
          },

          notes: {
            merchantos_order_id:
              String(
                merchantOrderId
              ),

            source:
              "ai_buyer",

            product:
              selectedProduct.name,
          },

          theme: {
            color:
              "#101827",
          },

          handler:
            async (
              razorpayResponse
            ) => {
              try {
                setPaymentProcessing(
                  true
                );

                setError("");

                console.log(
                  "Razorpay payment response:",
                  razorpayResponse
                );

                /* -----------------------------------------
                   5. VERIFY PAYMENT ON SERVER
                   ----------------------------------------- */

                const verifyResponse =
                  await verifyAIBuyerPayment(
                    {
                      merchantId,

                      orderId:
                        merchantOrderId,

                      razorpayOrderId:
                        razorpayResponse?.razorpay_order_id,

                      razorpayPaymentId:
                        razorpayResponse?.razorpay_payment_id,

                      razorpaySignature:
                        razorpayResponse?.razorpay_signature,
                    }
                  );

                console.log(
                  "Payment verification response:",
                  verifyResponse
                );

                const verifiedData =
                  verifyResponse?.data
                    ?.data ||
                  verifyResponse?.data ||
                  {};

                setPaymentSuccess(
                  true
                );

                setCompletedOrder(
                  {
                    merchantOrderId,

                    razorpayOrderId:
                      razorpayResponse?.razorpay_order_id,

                    razorpayPaymentId:
                      razorpayResponse?.razorpay_payment_id,

                    orderNumber:
                      verifiedData?.orderNumber ||
                      createdOrder?.orderNumber,

                    amount:
                      Number(
                        amount
                      ) / 100,
                  }
                );

                setMessages(
                  (previous) => [
                    ...previous,
                    {
                      id:
                        Date.now(),
                      sender:
                        "ai",
                      type:
                        "success",
                      text:
                        verifiedData?.orderNumber
                          ? `Payment successful! Order ${verifiedData.orderNumber} is confirmed.`
                          : "Payment successful! Your order is confirmed.",
                    },
                  ]
                );

                /*
                 * Refresh catalog locally so stock
                 * displayed by the UI is updated.
                 */
                try {
                  const refreshedCatalog =
                    await getAIBuyerCatalog(
                      merchantId
                    );

                  const refreshedProducts =
                    refreshedCatalog
                      ?.data
                      ?.data
                      ?.products ||
                    refreshedCatalog
                      ?.data
                      ?.products ||
                    [];

                  if (
                    Array.isArray(
                      refreshedProducts
                    )
                  ) {
                    setCatalog(
                      refreshedProducts
                    );
                  }
                } catch (
                  refreshError
                ) {
                  console.warn(
                    "Could not refresh catalog after payment:",
                    refreshError
                  );
                }
              } catch (
                verifyError
              ) {
                console.error(
                  "Payment verification error:",
                  verifyError
                );

                setError(
                  verifyError
                    ?.response
                    ?.data
                    ?.message ||
                    verifyError?.message ||
                    "Payment completed, but server verification failed. Please check the order status before retrying."
                );
              } finally {
                setPaymentProcessing(
                  false
                );
              }
            },

          modal: {
            ondismiss:
              () => {
                console.log(
                  "Razorpay checkout closed."
                );

                setPaymentProcessing(
                  false
                );

                setCreatingOrder(
                  false
                );
              },
          },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.on(
          "payment.failed",
          (response) => {
            console.error(
              "Razorpay payment failed:",
              response
            );

            const reason =
              response?.error
                ?.description ||
              response?.error
                ?.reason ||
              "Payment failed.";

            setError(
              reason
            );

            setPaymentProcessing(
              false
            );
          }
        );

        razorpay.open();
      } catch (err) {
        console.error(
          "AI Buyer checkout error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to start checkout."
        );

        setCreatingOrder(
          false
        );

        setPaymentProcessing(
          false
        );
      }
    };

  /* =======================================================
     PRODUCT CARD
     ======================================================= */

  const renderProductCard = (
    product,
    compact = false
  ) => {
    const productId =
      getProductId(product) ||
      product?.name ||
      Math.random();

    return (
      <div
        className={`ai-buyer-product-card ${
          compact
            ? "ai-buyer-product-card-compact"
            : ""
        }`}
        key={productId}
      >
        <div className="ai-buyer-product-top">
          <div>
            <div className="ai-buyer-product-category">
              {product.category ||
                "Product"}
            </div>

            <h4>
              {product.name}
            </h4>
          </div>

          <div className="ai-buyer-product-price">
            {formatCurrency(
              product.price,
              product.currency ||
                "INR"
            )}
          </div>
        </div>

        {!compact && (
          <p className="ai-buyer-product-description">
            {product.description ||
              product.sellingPoints?.[0] ||
              "Available in the AI-ready merchant catalog."}
          </p>
        )}

        <div className="ai-buyer-product-meta">
          <span>
            Stock:{" "}
            {product.stock ??
              (product.available
                ? "Available"
                : 0)}
          </span>

          {product.targetAudience
            ?.length > 0 && (
            <span>
              For:{" "}
              {product.targetAudience
                .slice(0, 2)
                .join(", ")}
            </span>
          )}
        </div>

        <button
          className="button button-primary"
          type="button"
          onClick={() =>
            handleSelectProduct(
              product
            )
          }
          disabled={
            Number(
              product.stock || 0
            ) <= 0
          }
        >
          {Number(
            product.stock || 0
          ) > 0
            ? "Select product"
            : "Out of stock"}
        </button>
      </div>
    );
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="page ai-buyer-page">
      {/* HEADER */}

      <div className="ai-buyer-header">
        <div>
          <span className="ai-buyer-eyebrow">
            AGENTIC COMMERCE
          </span>

          <h1>
            AI Buyer
          </h1>

          <p>
            Discover products, get
            intelligent recommendations,
            and continue to checkout
            through MerchantOS.
          </p>
        </div>

        <div className="ai-buyer-status">
          <span className="ai-buyer-status-dot" />

          AI Buyer Active
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="alert alert-error ai-buyer-error">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {paymentSuccess &&
        completedOrder && (
          <div className="alert alert-success ai-buyer-error">
            <div>
              <strong>
                Payment successful
              </strong>

              <div>
                {completedOrder.orderNumber
                  ? `Order ${completedOrder.orderNumber}`
                  : `MerchantOS Order ${completedOrder.merchantOrderId}`}
              </div>

              {completedOrder.amount !==
                undefined && (
                <div>
                  Amount:{" "}
                  {formatCurrency(
                    completedOrder.amount
                  )}
                </div>
              )}

              <div>
                Razorpay Payment ID:{" "}
                {
                  completedOrder.razorpayPaymentId
                }
              </div>
            </div>
          </div>
        )}

      {/* MAIN */}

      <div className="ai-buyer-layout">
        {/* CHAT */}

        <section className="card ai-buyer-chat-card">
          <div className="ai-buyer-chat-header">
            <div>
              <h2>
                Shopping Assistant
              </h2>

              <span>
                AI-powered product
                discovery
              </span>
            </div>

            <span className="ai-buyer-live-badge">
              LIVE
            </span>
          </div>

          <div className="ai-buyer-messages">
            {messages.map(
              (message) => (
                <div
                  key={
                    message.id
                  }
                  className={`ai-buyer-message-row ${
                    message.sender ===
                    "user"
                      ? "ai-buyer-message-user"
                      : "ai-buyer-message-ai"
                  }`}
                >
                  <div
                    className={`ai-buyer-message ${
                      message.sender ===
                      "user"
                        ? "ai-buyer-message-user-bubble"
                        : "ai-buyer-message-ai-bubble"
                    }`}
                  >
                    <p>
                      {message.text}
                    </p>

                    {message.type ===
                      "recommendation" &&
                      message.products
                        ?.length >
                        0 && (
                        <div className="ai-buyer-inline-products">
                          {message.products.map(
                            (
                              product
                            ) =>
                              renderProductCard(
                                product
                              )
                          )}
                        </div>
                      )}

                    {message.type ===
                      "success" && (
                      <div className="ai-buyer-success-box">
                        Order successfully
                        paid and
                        verified.
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {searching && (
              <div className="ai-buyer-message-row ai-buyer-message-ai">
                <div className="ai-buyer-message ai-buyer-message-ai-bubble">
                  <p>
                    Analyzing your
                    requirements
                    and checking
                    the catalog...
                  </p>
                </div>
              </div>
            )}
          </div>

          <form
            className="ai-buyer-composer"
            onSubmit={
              handleSearch
            }
          >
            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target
                    .value
                )
              }
              placeholder='Try "smartwatch under ₹5000 for fitness" or "wireless headphones for travel"'
              disabled={
                loadingCatalog ||
                searching ||
                paymentProcessing
              }
            />

            <button
              className="button button-primary"
              type="submit"
              disabled={
                loadingCatalog ||
                searching ||
                paymentProcessing ||
                !query.trim()
              }
            >
              {searching
                ? "Thinking..."
                : "Ask AI"}
            </button>
          </form>
        </section>

        {/* SIDEBAR */}

        <aside className="ai-buyer-sidebar">
          {/* CATALOG */}

          <section className="card ai-buyer-catalog-card">
            <div className="ai-buyer-section-heading">
              <div>
                <span className="ai-buyer-eyebrow">
                  CATALOG
                </span>

                <h3>
                  AI-ready Products
                </h3>
              </div>

              <span className="ai-buyer-count">
                {catalog.length}
              </span>
            </div>

            {loadingCatalog ? (
              <div className="ai-buyer-empty-state">
                Loading merchant
                catalog...
              </div>
            ) : catalog.length ===
              0 ? (
              <div className="ai-buyer-empty-state">
                No AI-enabled
                products are
                currently
                available.
              </div>
            ) : (
              <div className="ai-buyer-catalog-list">
                {(recommendations.length >
                0
                  ? recommendations
                  : catalog.slice(
                      0,
                      5
                    )
                ).map(
                  (product) =>
                    renderProductCard(
                      product,
                      true
                    )
                )}
              </div>
            )}
          </section>

          {/* PURCHASE */}

          <section className="card ai-buyer-checkout-card">
            <div className="ai-buyer-section-heading">
              <div>
                <span className="ai-buyer-eyebrow">
                  PURCHASE
                </span>

                <h3>
                  Selected Product
                </h3>
              </div>
            </div>

            {!selectedProduct ? (
              <div className="ai-buyer-empty-state">
                Select a product
                from the
                conversation to
                begin checkout.
              </div>
            ) : (
              <>
                {/* SELECTED PRODUCT */}

                <div className="ai-buyer-selected-product">
                  <div>
                    <span>
                      {
                        selectedProduct.category
                      }
                    </span>

                    <h4>
                      {
                        selectedProduct.name
                      }
                    </h4>
                  </div>

                  <strong>
                    {formatCurrency(
                      selectedProduct.price,
                      selectedProduct.currency ||
                        "INR"
                    )}
                  </strong>
                </div>

                {/* AI CROSS SELL */}

                {crossSellProduct && (
                  <div className="ai-buyer-cross-sell">
                    <span>
                      AI CROSS-SELL
                    </span>

                    <strong>
                      {
                        crossSellProduct.name
                      }
                    </strong>

                    <p>
                      {crossSellReason ||
                        "This product complements your selected item and may increase the value of the purchase."}
                    </p>
                  </div>
                )}

                {/* CUSTOMER NAME */}

                <div className="ai-buyer-field">
                  <label htmlFor="customer-name">
                    Customer name
                  </label>

                  <input
                    id="customer-name"
                    type="text"
                    value={
                      customerName
                    }
                    onChange={(
                      event
                    ) =>
                      setCustomerName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter name"
                    disabled={
                      paymentProcessing
                    }
                  />
                </div>

                {/* EMAIL */}

                <div className="ai-buyer-field">
                  <label htmlFor="customer-email">
                    Email
                  </label>

                  <input
                    id="customer-email"
                    type="email"
                    value={
                      customerEmail
                    }
                    onChange={(
                      event
                    ) =>
                      setCustomerEmail(
                        event.target
                          .value
                      )
                    }
                    placeholder="customer@example.com"
                    disabled={
                      paymentProcessing
                    }
                  />
                </div>

                {/* PHONE */}

                <div className="ai-buyer-field">
                  <label htmlFor="customer-phone">
                    Phone
                  </label>

                  <input
                    id="customer-phone"
                    type="tel"
                    value={
                      customerPhone
                    }
                    onChange={(
                      event
                    ) =>
                      setCustomerPhone(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter phone number"
                    disabled={
                      paymentProcessing
                    }
                  />
                </div>

                {/* QUANTITY */}

                <div className="ai-buyer-quantity">
                  <label htmlFor="quantity">
                    Quantity
                  </label>

                  <div className="ai-buyer-quantity-controls">
                    <button
                      type="button"
                      disabled={
                        paymentProcessing ||
                        quantity <= 1
                      }
                      onClick={() =>
                        setQuantity(
                          (value) =>
                            Math.max(
                              1,
                              Number(
                                value
                              ) - 1
                            )
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={
                        paymentProcessing ||
                        Number(
                          selectedProduct.stock ||
                            1
                        ) <=
                          quantity
                      }
                      onClick={() =>
                        setQuantity(
                          (value) =>
                            Math.min(
                              Number(
                                selectedProduct.stock ||
                                  1
                              ),
                              Number(
                                value
                              ) + 1
                            )
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* TOTAL */}

                <div className="ai-buyer-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    {formatCurrency(
                      Number(
                        selectedProduct.price ||
                          0
                      ) *
                        Number(
                          quantity
                        ),
                      selectedProduct.currency ||
                        "INR"
                    )}
                  </strong>
                </div>

                {/* CHECKOUT */}

                <button
                  className="button button-primary ai-buyer-checkout-button"
                  type="button"
                  onClick={
                    handleCreateOrderAndPay
                  }
                  disabled={
                    creatingOrder ||
                    paymentProcessing ||
                    paymentSuccess
                  }
                >
                  {creatingOrder
                    ? "Creating order..."
                    : paymentProcessing
                    ? "Processing payment..."
                    : paymentSuccess
                    ? "Payment completed"
                    : "Continue to Razorpay"}
                </button>
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}