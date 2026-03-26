const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw {
      message: payload?.message || "Request failed",
      errors: payload?.errors || {},
    };
  }

  return payload;
};

export const apiRequest = async ({ path, method = "GET", token, body }) => {
  const headers = {};
  const isFormData = body instanceof FormData;

  if (body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  return parseResponse(response);
};

export const toAssetUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `${API_BASE_URL}${filePath}`;
};
