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
import videoRoutes from "./routes/videoRoutes.js";
import memeRoutes from "./routes/memeRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { sanitizeMiddleware } from "./middlewares/sanitizeMiddleware.js";
import { xssMiddleware } from "./middlewares/xssMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			return callback(null, true);
		}

		let hostname;

		try {
			hostname = new URL(origin).hostname;
		} catch {
			// Malformed Origin header: deny without throwing to avoid 500 errors
			return callback(null, false);
		}

		const isLocalDevOrigin = hostname === "localhost" || hostname === "127.0.0.1";

		const isAllowedByEnv = allowedOrigins.some((allowedOrigin) => {
			try {
				const allowedHostname = new URL(allowedOrigin).hostname;
				return allowedHostname === hostname;
			} catch {
				// If allowedOrigin is not a full URL, fall back to direct comparison
				return allowedOrigin === origin || allowedOrigin === hostname;
			}
		});

		if (isLocalDevOrigin || isAllowedByEnv) {
			return callback(null, true);
		}

		// Disallowed origin: cleanly deny without throwing
		return callback(null, false);
	},
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true
};

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100
});

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(xssMiddleware);
app.use(sanitizeMiddleware);
app.use(apiLimiter);

// Standard Middleware
app.use(express.json());
app.use(morgan("dev"));

if (process.env.DEBUG_REQUEST_LOGS === "true") {
	app.use((req, res, next) => {
		console.log(`[REQ] ${req.method} ${req.originalUrl}`);
		next();
	});
}
// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/memes", memeRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use(errorHandler);

export default app;
