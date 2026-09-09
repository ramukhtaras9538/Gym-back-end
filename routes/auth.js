import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = Router();

// Login using credentials stored in the DB (preferred) or fall back to env vars.
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Try DB first
  const admin = await Admin.findOne({ username });
  let passwordHash = admin ? admin.passwordHash : process.env.ADMIN_PASSWORD_HASH;
  const validUsername = admin ? true : username === process.env.ADMIN_USERNAME;
  const validPassword = passwordHash && (await bcrypt.compare(password, passwordHash));

  if (!validUsername || !validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ token });
});

// Lets the admin panel check whether a stored token is still valid on load.
router.get("/me", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ username: payload.username });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;