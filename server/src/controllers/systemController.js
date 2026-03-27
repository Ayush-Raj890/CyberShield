import ClientErrorLog from "../models/ClientErrorLog.js";
import { validationResult } from "express-validator";
import { sendError, sendSuccess } from "../utils/response.js";

export const logClientError = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const {
      message,
      stack,
      componentStack,
      source,
      path,
      method,
      statusCode,
      userAgent,
      userId
    } = req.body;

    if (!message || !String(message).trim()) {
      return sendError(res, 400, "Message is required");
    }

    const created = await ClientErrorLog.create({
      message: String(message).slice(0, 3000),
      stack: stack ? String(stack).slice(0, 12000) : undefined,
      componentStack: componentStack ? String(componentStack).slice(0, 12000) : undefined,
      source,
      path,
      method,
      statusCode,
      userAgent,
      userId
    });

    return sendSuccess(res, { id: created._id }, 201, "Client error logged");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getClientErrors = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const source = req.query.source;
    const statusCode = req.query.statusCode;
    const q = req.query.q?.trim();

    const query = {};

    if (["UI", "API"].includes(source)) {
      query.source = source;
    }

    if (statusCode && !Number.isNaN(Number(statusCode))) {
      query.statusCode = Number(statusCode);
    }

    if (q) {
      query.$or = [
        { message: { $regex: q, $options: "i" } },
        { path: { $regex: q, $options: "i" } },
        { method: { $regex: q, $options: "i" } }
      ];
    }

    const [items, total] = await Promise.all([
      ClientErrorLog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ClientErrorLog.countDocuments(query)
    ]);

    return sendSuccess(res, {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
