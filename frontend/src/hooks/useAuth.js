import { useEffect, useState } from "react";

import {
  getMerchantProfile,
  getStoredMerchant,
  getToken,
  logoutMerchant,
} from "../services/authService";

function useAuth() {
  const [merchant, setMerchant] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = getToken();

    if (!token) {
      setMerchant(null);
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    const storedMerchant =
      getStoredMerchant();

    if (storedMerchant) {
      setMerchant(storedMerchant);
      setAuthenticated(true);
    }

    try {
      const response =
        await getMerchantProfile();

      if (
        response.success &&
        response.data?.merchant
      ) {
        setMerchant(
          response.data.merchant
        );

        setAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (
    merchantData
  ) => {
    setMerchant(
      merchantData ||
        getStoredMerchant()
    );

    setAuthenticated(true);
  };

  const handleLogout = () => {
    logoutMerchant();

    setMerchant(null);
    setAuthenticated(false);
  };

  return {
    merchant,
    loading,
    authenticated,
    login: handleLogin,
    logout: handleLogout,
  };
}

export default useAuth;