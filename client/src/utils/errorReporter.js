import axios from "axios";

const ERROR_CONTEXT_KEY = "cybershield_error_context";
const API_BASE = (() => {
  const rawBase = import.meta.env.VITE_API_URL;

  if (!rawBase) {
    return "http://localhost:5000/api";
  }

  const normalized = rawBase.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
})();

export const saveErrorContext = (context) => {
  try {
    sessionStorage.setItem(ERROR_CONTEXT_KEY, JSON.stringify(context));
  } catch {
    // Ignore storage failures in private mode or restricted environments.
  }
};

export const getErrorContext = () => {
  try {
    const raw = sessionStorage.getItem(ERROR_CONTEXT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearErrorContext = () => {
  try {
    sessionStorage.removeItem(ERROR_CONTEXT_KEY);
  } catch {
    // No-op
  }
};

export const sendErrorReport = async () => {
  const context = getErrorContext();
  if (!context?.message) {
    throw new Error("No error context available");
  }

  const user = JSON.parse(localStorage.getItem("user") || "null");

  await axios.post(`${API_BASE}/system/client-errors`, {
    ...context,
    userAgent: navigator.userAgent,
    userId: user?._id
  });

  clearErrorContext();
};
