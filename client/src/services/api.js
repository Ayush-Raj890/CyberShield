import axios from "axios";
import { saveErrorContext } from "../utils/errorReporter";

const apiBase = (() => {
  const rawBase = import.meta.env.VITE_API_URL;

  if (!rawBase) {
    return "http://localhost:5000/api";
  }

  // Trim trailing slashes from the configured base URL
  const normalized = rawBase.replace(/\/+$/, "");

  // Only append "/api" if it's not already present at the end
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
})();
const API = axios.create({
  baseURL: apiBase
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => {
    const payload = response.data;

    if (payload && typeof payload === "object" && "success" in payload) {
      response.data = payload.data;
    }

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isReportingCall = requestUrl.includes("/system/client-errors");
    const isServerError = Number.isInteger(status) && status >= 500 && status <= 599;

    saveErrorContext({
      source: "API",
      message: error?.response?.data?.message || error?.message || "API request failed",
      stack: error?.stack,
      path: window.location.pathname,
      method: error?.config?.method?.toUpperCase(),
      statusCode: status
    });

    if (
      !isReportingCall &&
      isServerError &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/500"
    ) {
      window.location.assign("/500");
    }

    return Promise.reject(error);
  }
);

export default API;
