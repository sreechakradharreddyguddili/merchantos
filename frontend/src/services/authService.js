import api from "./api";

export const registerMerchant = async ({
  businessName,
  identifier,
  password,
  businessType,
}) => {
  const response = await api.post(
    "/merchants/register",
    {
      businessName,
      identifier,
      password,
      businessType,
    }
  );

  if (
    response.success &&
    response.data?.token
  ) {
    localStorage.setItem(
      "merchantToken",
      response.data.token
    );

    if (
      response.data.merchant
    ) {
      localStorage.setItem(
        "merchant",
        JSON.stringify(
          response.data.merchant
        )
      );
    }
  }

  return response;
};

export const loginMerchant = async (
  identifier,
  password
) => {
  const response = await api.post(
    "/merchants/login",
    {
      identifier,
      password,
    }
  );

  if (
    response.success &&
    response.data?.token
  ) {
    localStorage.setItem(
      "merchantToken",
      response.data.token
    );

    if (
      response.data.merchant
    ) {
      localStorage.setItem(
        "merchant",
        JSON.stringify(
          response.data.merchant
        )
      );
    }
  }

  return response;
};

export const getMerchantProfile =
  async () => {
    const response =
      await api.get(
        "/merchants/profile"
      );

    if (
      response.success &&
      response.data?.merchant
    ) {
      localStorage.setItem(
        "merchant",
        JSON.stringify(
          response.data.merchant
        )
      );
    }

    return response;
  };

export const logoutMerchant = () => {
  localStorage.removeItem(
    "merchantToken"
  );

  localStorage.removeItem(
    "merchant"
  );
};

export const getToken = () => {
  return localStorage.getItem(
    "merchantToken"
  );
};

export const getStoredMerchant =
  () => {
    const merchant =
      localStorage.getItem(
        "merchant"
      );

    if (!merchant) {
      return null;
    }

    try {
      return JSON.parse(
        merchant
      );
    } catch {
      return null;
    }
  };

export const isAuthenticated = () => {
  return Boolean(
    getToken()
  );
};