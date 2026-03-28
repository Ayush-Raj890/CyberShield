const escapeHtml = (value) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const sanitizeStrings = (input) => {
  if (typeof input === "string") {
    return escapeHtml(input);
  }

  if (!input || typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeStrings(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(input)) {
    sanitized[key] = sanitizeStrings(value);
  }

  return sanitized;
};

export const xssMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeStrings(req.body);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeStrings(req.params);
  }

  if (req.query && typeof req.query === "object") {
    const sanitizedQuery = sanitizeStrings(req.query);

    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }

    Object.assign(req.query, sanitizedQuery);
  }

  next();
};
