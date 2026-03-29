import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { sanitizeMiddleware } from "./middlewares/sanitizeMiddleware.js";
import { xssMiddleware } from "./middlewares/xssMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100
});

// Security Middleware
app.use(helmet());
app.use(xssMiddleware);
app.use(sanitizeMiddleware);
app.use(apiLimiter);

// Standard Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use(errorHandler);

export default app;
