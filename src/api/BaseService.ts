// Centralized API configuration for Hridhay Connect
export const API_BASE_URL = "https://localhost:7103/api";

// Mapping of category page slugs to their respective API category IDs
export const CATEGORY_IDS = {
  soap: 15,
  "hair-oil": 16,
  mukhwas: 17,
  "tea-masala": 18,
  "hridhay-special": 19,
};

let lastApiResponseData: any = null;

async function fetchApi(url: string, options: RequestInit = {}) {
  // Use the authToken established in your auth flow
  const token = localStorage.getItem("authToken");

  const headers = new Headers(options.headers || {});

  // Only attach auth header when a token exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Content-Type is needed only for body requests
  const method = (options.method || "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Attempt to parse response body
    let responseData = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      lastApiResponseData = responseData;
      // Simulate axios error structure for compatibility
      return Promise.reject({ response: { data: responseData, status: response.status } });
    }

    lastApiResponseData = responseData;
    return responseData;
  } catch (error) {
    lastApiResponseData = error;
    return Promise.reject(error);
  }
}

export async function get(url: string, config: RequestInit = {}) {
  return fetchApi(url, { ...config, method: "GET" });
}

export async function post(url: string, data: any, config: RequestInit = {}) {
  return fetchApi(url, { ...config, method: "POST", body: JSON.stringify(data) });
}

export async function put(url: string, data: any, config: RequestInit = {}) {
  return fetchApi(url, { ...config, method: "PUT", body: JSON.stringify(data) });
}

export async function del(url: string, config: RequestInit = {}) {
  return fetchApi(url, { ...config, method: "DELETE" });
}

export async function getBlob(url: string, config: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers = new Headers(config.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...config,
    method: "GET",
    headers,
  });
  
  if (!response.ok) {
    return Promise.reject(new Error(`Error fetching blob: ${response.statusText}`));
  }
  return response.blob();
}

export function getLastApiResponse() {
  return lastApiResponseData;
}

// Generic Lov dropdown helper
export async function getLovDropdownList(lovColumn: string) {
  return get(`/Dropdown/LovMaster?Lov_column=${encodeURIComponent(lovColumn)}`);
}
