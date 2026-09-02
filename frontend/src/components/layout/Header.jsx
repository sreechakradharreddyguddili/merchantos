function Header({
  currentPage,
  setCurrentPage,
  merchant,
  onLogout,
}) {
  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "growth",
      label: "Growth Agent",
    },
    {
      id: "ai-buyer",
      label: "AI Buyer",
    },
    {
      id: "orders",
      label: "Orders",
    },
    {
      id: "products",
      label: "Products",
    },
    {
      id: "analytics",
      label: "Analytics",
    },
    {
      id: "settings",
      label: "Settings",
    },
  ];

  const merchantName =
    merchant?.name ||
    merchant?.businessName ||
    merchant?.storeName ||
    "NovaTech Store";

  const merchantEmail =
    merchant?.email ||
    "demo@merchantos.com";

  const initial =
    merchantName?.charAt(0)?.toUpperCase() ||
    "N";

  const goToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "merchantToken"
    );

    localStorage.removeItem(
      "merchant"
    );

    localStorage.removeItem(
      "merchantData"
    );

    localStorage.removeItem(
      "merchantos_current_page"
    );

    if (onLogout) {
      onLogout();
      return;
    }

    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-inner">

        {/* =================================================
            BRAND
            ================================================= */}

        <button
          type="button"
          className="brand brand-button"
          onClick={goToDashboard}
          aria-label="Go to MerchantOS Dashboard"
        >
          <div className="brand-logo">
            M
          </div>

          <div className="brand-info">

            <div className="brand-name">
              MerchantOS
            </div>

            <div className="brand-subtitle">
              AI COMMERCE OS
            </div>

          </div>
        </button>

        {/* =================================================
            NAVIGATION
            ================================================= */}

        <nav className="header-nav">

          {navigation.map(
            (item) => (
              <button
                key={item.id}
                type="button"
                className={
                  currentPage ===
                  item.id
                    ? "nav-link active"
                    : "nav-link"
                }
                onClick={() =>
                  setCurrentPage(
                    item.id
                  )
                }
              >
                {item.label}
              </button>
            )
          )}

        </nav>

        {/* =================================================
            HEADER ACTIONS
            ================================================= */}

        <div className="header-actions">

          {/* System Status */}

          <div className="system-status">
            <span className="status-dot" />

            System Operational
          </div>

          {/* Merchant Profile */}

          <div className="merchant-profile">

            <div className="merchant-avatar">
              {initial}
            </div>

            <div className="merchant-details">

              <div className="merchant-name">
                {merchantName}
              </div>

              <div className="merchant-email">
                {merchantEmail}
              </div>

            </div>

          </div>

          {/* Logout */}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}

export default Header;