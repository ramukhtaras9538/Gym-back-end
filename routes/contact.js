import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

function getMailer() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP email configuration is incomplete. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_TO in your .env file. For Gmail, use your Gmail address and an app password."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function getEmailMetadata() {
  const to = process.env.EMAIL_TO || process.env.SMTP_USER;
  if (!to) {
    throw new Error("EMAIL_TO is not configured. Please set EMAIL_TO in your environment.");
  }

  return {
    to,
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    subjectPrefix: process.env.EMAIL_SUBJECT_PREFIX || "[Inquiry] ",
  };
}

router.get("/test", async (req, res, next) => {
  try {
    const transporter = getMailer();
    await transporter.verify();
    res.json({ ok: true, message: "SMTP configuration is valid." });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, program, message } = req.body || {};
    const safeName = String(name || "").trim();
    const safeEmail = String(email || "").trim();
    const safeMessage = String(message || "").trim();

    if (!safeName || !safeEmail || !safeMessage) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const { to, from, subjectPrefix } = getEmailMetadata();
    const transporter = getMailer();

    const mailOptions = {
      from,
      to,
      replyTo: safeEmail,
      subject: `${subjectPrefix}New inquiry from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\nPhone: ${String(phone || "N/A").trim() || "N/A"}\nProgram: ${String(program || "N/A").trim() || "N/A"}\n\nMessage:\n${safeMessage}`,
      html: `
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${String(phone || "N/A").trim() || "N/A"}</p>
        <p><strong>Program:</strong> ${String(program || "N/A").trim() || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g, "<br />")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
