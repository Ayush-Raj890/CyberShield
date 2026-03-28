const sanitizeObject = (input) => {
  if (!input || typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item));
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(input)) {
    // Strip keys that can trigger Mongo query operator injection.
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }

    sanitized[key] = sanitizeObject(value);
  }

  return sanitized;
};

export const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }

  if (req.query && typeof req.query === "object") {
    const sanitizedQuery = sanitizeObject(req.query);

    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }

    Object.assign(req.query, sanitizedQuery);
  }

  next();
};
