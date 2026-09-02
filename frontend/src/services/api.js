const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem(
    "merchantToken"
  );
};

const request = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.detail ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

const api = {
  get: (endpoint) =>
    request(endpoint, {
      method: "GET",
    }),

  post: (
    endpoint,
    body = {}
  ) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (
    endpoint,
    body = {}
  ) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (
    endpoint,
    body = {}
  ) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE",
    }),
};

export { api };

export default api;