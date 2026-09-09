import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import uploadsRoutes from "./routes/uploads.js";
import contactRoutes from "./routes/contact.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
const defaultDevOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOrigins = allowedOrigins.length ? allowedOrigins : defaultDevOrigins;

app.use(
  cors({
    origin(origin, callback) {
      // allow tools like curl/Postman (no origin header) and whitelisted origins
      if (!origin || corsOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/contact", contactRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => console.log(`API listening on :${PORT}`));

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the process using this port or set a different PORT in .env.`);
        process.exit(1);
      }
      console.error("Server error:", err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });