import { useEffect, useState } from "react";

import Header from "./components/layout/Header";

import Dashboard from "./pages/Dashboard";
import GrowthAgent from "./pages/GrowthAgent";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import AIBuyer from "./pages/AIBuyer";

import Login from "./pages/Login";
import Register from "./pages/Register";

import useAuth from "./hooks/useAuth";

import "./App.css";

function App() {
  const {
    merchant,
    loading,
    authenticated,
    login,
    logout,
  } = useAuth();

  const [
    currentPage,
    setCurrentPage,
  ] = useState(() => {
    return (
      localStorage.getItem(
        "merchantos_current_page"
      ) || "dashboard"
    );
  });
  useEffect(() => {
    localStorage.setItem(
      "merchantos_current_page",
      currentPage
    );
  }, [currentPage]);

  const [
    authPage,
    setAuthPage,
  ] = useState("login");

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="loading-container">

            <div className="loading-spinner" />

            <p>
              Loading MerchantOS...
            </p>

          </div>

        </div>
      </div>
    );
  }

  if (!authenticated) {

    if (authPage === "register") {
      return (
        <Register
          onRegister={login}
          onSwitchToLogin={() =>
            setAuthPage("login")
          }
        />
      );
    }

    return (
      <Login
        onLogin={login}
        onSwitchToRegister={() =>
          setAuthPage("register")
        }
      />
    );
  }

  const renderPage = () => {

    switch (currentPage) {

      case "dashboard":
        return (
          <Dashboard
            merchant={merchant}
            setCurrentPage={
              setCurrentPage
            }
          />
        );

      case "growth":
        return (
          <GrowthAgent
            merchant={merchant}
          />
        );

      case "ai-buyer":
        return (
          <AIBuyer
            merchant={merchant}
          />
        );

      case "orders":
        return (
          <Orders
            merchant={merchant}
          />
        );

      case "products":
        return (
          <Products
            merchant={merchant}
          />
        );

      case "analytics":
        return (
          <Analytics
            merchant={merchant}
          />
        );

      case "settings":
        return (
          <Settings
            merchant={merchant}
          />
        );

      default:
        return (
          <Dashboard
            merchant={merchant}
            setCurrentPage={
              setCurrentPage
            }
          />
        );
    }
  };

  return (
    <div className="app">

      <Header
        currentPage={currentPage}
        setCurrentPage={
          setCurrentPage
        }
        merchant={merchant}
        onLogout={logout}
      />

      <main className="app-content">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;