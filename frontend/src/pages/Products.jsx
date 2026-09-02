import { useEffect, useMemo, useState } from "react";

import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";
import Alert from "../components/common/Alert";

import api from "../services/api";

import {
  formatCurrency,
  formatNumber,
} from "../utils/formatters";


const PRODUCT_CATEGORIES = [
  "Electronics",
  "Computers & Laptops",
  "Mobile Phones & Accessories",
  "Cameras & Photography",
  "Fashion",
  "Beauty & Personal Care",
  "Home & Kitchen",
  "Furniture",
  "Appliances",
  "Grocery & Food",
  "Health & Wellness",
  "Sports & Fitness",
  "Books & Stationery",
  "Toys & Games",
  "Baby & Kids",
  "Jewelry & Accessories",
  "Automotive",
  "Pet Supplies",
  "Travel & Luggage",
  "Office Supplies",
  "Software & Digital Products",
  "Education",
  "Services",
  "Other",
];

const CURRENCIES = [
  ["INR", "🇮🇳 INR — Indian Rupee"],
  ["USD", "🇺🇸 USD — US Dollar"],
  ["EUR", "🇪🇺 EUR — Euro"],
  ["GBP", "🇬🇧 GBP — British Pound"],
  ["JPY", "🇯🇵 JPY — Japanese Yen"],
  ["CNY", "🇨🇳 CNY — Chinese Yuan"],
  ["CAD", "🇨🇦 CAD — Canadian Dollar"],
  ["AUD", "🇦🇺 AUD — Australian Dollar"],
  ["CHF", "🇨🇭 CHF — Swiss Franc"],
  ["SGD", "🇸🇬 SGD — Singapore Dollar"],
  ["AED", "🇦🇪 AED — UAE Dirham"],
  ["SAR", "🇸🇦 SAR — Saudi Riyal"],
  ["KRW", "🇰🇷 KRW — South Korean Won"],
  ["NZD", "🇳🇿 NZD — New Zealand Dollar"],
  ["ZAR", "🇿🇦 ZAR — South African Rand"],
  ["HKD", "🇭🇰 HKD — Hong Kong Dollar"],
  ["SEK", "🇸🇪 SEK — Swedish Krona"],
  ["NOK", "🇳🇴 NOK — Norwegian Krone"],
  ["DKK", "🇩🇰 DKK — Danish Krone"],
  ["BRL", "🇧🇷 BRL — Brazilian Real"],
  ["MXN", "🇲🇽 MXN — Mexican Peso"],
  ["PLN", "🇵🇱 PLN — Polish Zloty"],
  ["TRY", "🇹🇷 TRY — Turkish Lira"],
];

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [stockFilter, setStockFilter] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    sku: "",
    currency: "INR",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/products?limit=100"
        );

      const data =
        response?.data?.products || [];

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts =
    async () => {
      try {
        setRefreshing(true);
        setError("");
        setSuccess("");

        const response =
          await api.get(
            "/products?limit=100"
          );

        const data =
          response?.data?.products || [];

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to refresh products."
        );
      } finally {
        setRefreshing(false);
      }
    };

  const handleFormChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      sku: "",
      currency: "INR",
    });
  };

  const handleCreateProduct =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        !form.name.trim() ||
        !form.description.trim() ||
        !form.category.trim() ||
        form.price === "" ||
        !form.sku.trim()
      ) {
        setError(
          "Product name, description, category, price and SKU are required."
        );
        return;
      }

      if (
        Number(form.price) < 0
      ) {
        setError(
          "Price cannot be negative."
        );
        return;
      }

      if (
        form.stock !== "" &&
        Number(form.stock) < 0
      ) {
        setError(
          "Stock cannot be negative."
        );
        return;
      }

      try {
        setCreating(true);

        const response =
          await api.post(
            "/products",
            {
              name:
                form.name.trim(),

              description:
                form.description.trim(),

              category:
                form.category.trim(),

              price:
                Number(form.price),

              stock:
                form.stock === ""
                  ? 0
                  : Number(form.stock),

              sku:
                form.sku
                  .trim()
                  .toUpperCase(),

              currency:
                form.currency,
            }
          );

        if (
          !response?.success
        ) {
          setError(
            response?.message ||
              "Failed to create product."
          );
          return;
        }

        setSuccess(
          response?.message ||
            "Product created successfully."
        );

        resetForm();

        setShowCreateForm(false);

        await loadProducts();
      } catch (err) {
        console.error(
          "Create product error:",
          err
        );

        setError(
          err?.message ||
            "Unable to create product."
        );
      } finally {
        setCreating(false);
      }
    };

  const categories =
    useMemo(() => {
      const productCategories =
        products
          .map(
            (product) =>
              product?.category?.trim()
          )
          .filter(Boolean);

      return [
        ...new Set([
          ...PRODUCT_CATEGORIES,
          ...productCategories,
        ]),
      ].sort((a, b) =>
        a.localeCompare(b)
      );
    }, [products]);

  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return products.filter(
        (product) => {
          const name =
            String(
              product?.name || ""
            ).toLowerCase();

          const sku =
            String(
              product?.sku || ""
            ).toLowerCase();

          const productCategory =
            String(
              product?.category || ""
            ).toLowerCase();

          const stock =
            Number(
              product?.stock || 0
            );

          const matchesSearch =
            !query ||
            name.includes(query) ||
            sku.includes(query) ||
            productCategory.includes(
              query
            );

          const matchesCategory =
            !category ||
            product?.category ===
              category;

          let matchesStock = true;

          if (
            stockFilter ===
            "in-stock"
          ) {
            matchesStock =
              stock > 0;
          }

          if (
            stockFilter ===
            "low-stock"
          ) {
            matchesStock =
              stock > 0 &&
              stock <= 10;
          }

          if (
            stockFilter ===
            "out-of-stock"
          ) {
            matchesStock =
              stock === 0;
          }

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStock
          );
        }
      );
    }, [
      products,
      search,
      category,
      stockFilter,
    ]);

  const statistics =
    useMemo(() => {
      const total =
        products.length;

      const active =
        products.filter(
          (product) =>
            product?.isActive !== false
        ).length;

      const inStock =
        products.filter(
          (product) =>
            Number(
              product?.stock || 0
            ) > 0
        ).length;

      const lowStock =
        products.filter(
          (product) => {
            const stock =
              Number(
                product?.stock || 0
              );

            return (
              stock > 0 &&
              stock <= 10
            );
          }
        ).length;

      const outOfStock =
        products.filter(
          (product) =>
            Number(
              product?.stock || 0
            ) === 0
        ).length;

      const totalValue =
        products.reduce(
          (total, product) => {
            const price =
              Number(
                product?.price || 0
              );

            const stock =
              Number(
                product?.stock || 0
              );

            return (
              total +
              price * stock
            );
          },
          0
        );

      return {
        total,
        active,
        inStock,
        lowStock,
        outOfStock,
        totalValue,
      };
    }, [products]);

  const getStockClass = (
    stock
  ) => {
    const value =
      Number(stock || 0);

    if (value === 0) {
      return "status-rejected";
    }

    if (value <= 10) {
      return "status-pending";
    }

    return "status-completed";
  };

  if (loading) {
    return (
      <div className="page module-page">

        <div className="page-heading">

          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage your product catalog,
            pricing and inventory.
          </p>

        </div>

        <div className="page-card">

          <Loading
            message="Loading products..."
          />

        </div>

      </div>
    );
  }

  return (
    <div className="page module-page">

      {/* HEADER */}

      <div className="page-heading">

        <div>

          <span className="eyebrow">
            MERCHANT COMMAND CENTER
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage your product catalog,
            pricing and inventory.
          </p>

        </div>

      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() =>
            setError("")
          }
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() =>
            setSuccess("")
          }
        />
      )}

      {/* STATISTICS */}

      <div className="dashboard-metrics">

        <StatCard
          label="TOTAL PRODUCTS"
          value={statistics.total}
          icon="▦"
        />

        <StatCard
          label="ACTIVE"
          value={statistics.active}
          icon="✓"
        />

        <StatCard
          label="LOW STOCK"
          value={statistics.lowStock}
          icon="!"
        />

        <StatCard
          label="OUT OF STOCK"
          value={statistics.outOfStock}
          icon="×"
        />

      </div>

      {/* CATALOG */}

      <div className="page-card">

        <div className="card-header">

          <div>

            <span className="section-label">
              PRODUCT CATALOG
            </span>

            <h2>
              Your Products
            </h2>

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >

            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                setError("");
                setSuccess("");

                setShowCreateForm(
                  (previous) =>
                    !previous
                );
              }}
            >
              {showCreateForm
                ? "Close"
                : "+ Add Product"}
            </button>

            <button
              type="button"
              className="button button-secondary"
              onClick={
                refreshProducts
              }
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

        </div>

        {/* CREATE PRODUCT FORM */}

        {showCreateForm && (
          <div
            className="page-card"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              background:
                "#f8fafc",
            }}
          >

            <div
              className="card-header"
            >

              <div>

                <span className="section-label">
                  PRODUCT CREATION
                </span>

                <h2>
                  Add New Product
                </h2>

              </div>

            </div>

            <form
              onSubmit={
                handleCreateProduct
              }
            >

              <div className="product-form-grid">

                <div className="form-group">

                  <label>
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Wireless Headphones"
                  />

                </div>

                <div className="form-group">

                  <label>
                    SKU *
                  </label>

                  <input
                    type="text"
                    name="sku"
                    value={
                      form.sku
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="WH-001"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Category *
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Select or type a category"
                    list="product-category-options"
                    autoComplete="off"
                  />

                  <datalist id="product-category-options">
                    {PRODUCT_CATEGORIES.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        />
                      )
                    )}
                  </datalist>

                </div>

                <div className="form-group">

                  <label>
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      form.price
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="2999"
                    min="0"
                    step="0.01"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={
                      form.stock
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="50"
                    min="0"
                    step="1"
                  />

                </div>

                {/* CURRENCY */}

                <div className="form-group">

                  <label>
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={
                      form.currency
                    }
                    onChange={
                      handleFormChange
                    }
                  >

                    {CURRENCIES.map(
                      ([code, label]) => (
                        <option
                          key={code}
                          value={code}
                        >
                          {label}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="form-group product-description-field">

                  <label>
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Describe your product..."
                    rows="4"
                  />

                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "18px",
                }}
              >

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={creating}
                >
                  {creating
                    ? "Creating..."
                    : "Create Product"}
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  disabled={creating}
                  onClick={() => {
                    resetForm();

                    setShowCreateForm(
                      false
                    );
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* FILTERS */}

        <div className="products-toolbar">

          <div className="search-field">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products, SKU or category..."
            />

          </div>

          <select
            className="form-input"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
          >

            <option value="">
              All categories
            </option>

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

          <select
            className="form-input"
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(
                event.target.value
              )
            }
          >

            <option value="">
              All stock
            </option>

            <option value="in-stock">
              In stock
            </option>

            <option value="low-stock">
              Low stock
            </option>

            <option value="out-of-stock">
              Out of stock
            </option>

          </select>

        </div>

        {/* TABLE */}

        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            message={
              error
                ? "Products could not be loaded from the backend."
                : "Your product catalog will appear here. Click + Add Product to create your first product."
            }
          />
        ) : filteredProducts.length ===
          0 ? (
          <EmptyState
            title="No matching products"
            message="Try changing your search or filters."
          />
        ) : (
          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    SKU
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {
                    const stock =
                      Number(
                        product?.stock || 0
                      );

                    return (
                      <tr
                        key={
                          product?._id
                        }
                      >

                        <td>

                          <strong>
                            {product?.name ||
                              "Unnamed Product"}
                          </strong>

                          {product?.description && (
                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "4px",
                                color:
                                  "var(--muted)",
                                maxWidth:
                                  "280px",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                product.description
                              }
                            </small>
                          )}

                        </td>

                        <td>
                          {product?.sku ||
                            "—"}
                        </td>

                        <td>
                          {product?.category ||
                            "General"}
                        </td>

                        <td>

                          <strong>
                            {formatCurrency(
                              product?.price,
                              product?.currency ||
                                "INR"
                            )}
                          </strong>

                          {product?.compareAtPrice &&
                            Number(
                              product.compareAtPrice
                            ) >
                              Number(
                                product.price ||
                                  0
                              ) && (
                              <small
                                style={{
                                  display:
                                    "block",
                                  marginTop:
                                    "4px",
                                  color:
                                    "var(--muted)",
                                  textDecoration:
                                    "line-through",
                                }}
                              >
                                {formatCurrency(
                                  product.compareAtPrice,
                                  product?.currency ||
                                    "INR"
                                )}
                              </small>
                            )}

                        </td>

                        <td>
                          {formatNumber(
                            stock
                          )}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${getStockClass(
                              stock
                            )}`}
                          >
                            {stock === 0
                              ? "Out of Stock"
                              : stock <= 10
                              ? "Low Stock"
                              : "In Stock"}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="dashboard-metric">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <span className="metric-label">
          {label}
        </span>

        <strong className="metric-value">
          {value}
        </strong>

      </div>

    </div>
  );
}

export default Products;