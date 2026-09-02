import api from "./api";

export const getProducts = async (
  params = {}
) => {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          value
        );
      }
    }
  );

  const query =
    searchParams.toString();

  return api.get(
    `/products${query ? `?${query}` : ""}`
  );
};

export const getProductById =
  async (productId) => {
    return api.get(
      `/products/${productId}`
    );
  };

export const createProduct =
  async (productData) => {
    return api.post(
      "/products",
      productData
    );
  };

export const updateProduct =
  async (
    productId,
    productData
  ) => {
    return api.put(
      `/products/${productId}`,
      productData
    );
  };

export const deleteProduct =
  async (productId) => {
    return api.delete(
      `/products/${productId}`
    );
  };

export const getAIProductCatalog =
  async () => {
    return api.get(
      "/products/ai/catalog"
    );
  };