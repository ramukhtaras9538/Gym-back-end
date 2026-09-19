import { Router } from "express";
import { transporter } from "../config/mailer.js";

const router = Router();
const mailUser = process.env.EMAIL_USER;

const escapeHtml = (unsafe) =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

router.post("/", async (req, res) => {
  const { name, email, phone, program, message } = req.body || {};

  console.log("Received contact form submission:", {
    name,
    email,
    phone,
    program,
    message,
  });

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Missing required fields: name, email, message",
      });
  }

  const mailOptions = {
    from: mailUser,
    replyTo: email,
    to: mailUser,
    subject: `New inquiry from ${name} - ${program || "No Program"}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nProgram: ${program || "No Program"}\n\n${message}`,
    html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Gym Inquiry</title>
        </head>

        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif; color:#333;">

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:30px 15px;">
            <tr>
              <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" border="0"
                  style="max-width:600px; width:100%; background-color:#ffffff; border-radius:10px; overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="background-color:#111827; padding:25px 30px; text-align:center;">
                      <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:600;">
                        New Gym Inquiry
                      </h1>

                      <p style="margin:8px 0 0; color:#d1d5db; font-size:14px;">
                        A new inquiry has been submitted through your website
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:30px;">

                      <h2 style="margin:0 0 20px; color:#111827; font-size:20px;">
                        Contact Details
                      </h2>

                      <!-- Name -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="margin-bottom:12px; background:#f9fafb; border-radius:6px;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">
                              NAME
                            </div>
                            <div style="font-size:15px; color:#111827; font-weight:600;">
                              ${escapeHtml(name)}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Email -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="margin-bottom:12px; background:#f9fafb; border-radius:6px;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">
                              EMAIL
                            </div>
                            <div style="font-size:15px; color:#111827;">
                              ${escapeHtml(email)}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Phone -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="margin-bottom:12px; background:#f9fafb; border-radius:6px;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">
                              PHONE
                            </div>
                            <div style="font-size:15px; color:#111827;">
                              ${escapeHtml(phone || "N/A")}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Program -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="margin-bottom:25px; background:#f9fafb; border-radius:6px;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">
                              PROGRAM
                            </div>
                            <div style="font-size:15px; color:#111827; font-weight:600;">
                              ${escapeHtml(program || "N/A")}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Message -->
                      <h2 style="margin:0 0 12px; color:#111827; font-size:18px;">
                        Message
                      </h2>

                      <div style="
                        background:#f9fafb;
                        border-left:4px solid #111827;
                        padding:16px;
                        border-radius:4px;
                        font-size:15px;
                        line-height:1.6;
                        color:#374151;
                      ">
                        ${escapeHtml(message).replace(/\n/g, "<br>")}
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f9fafb; padding:18px 30px; text-align:center; border-top:1px solid #e5e7eb;">
                      <p style="margin:0; font-size:12px; color:#6b7280;">
                        This inquiry was submitted through your gym website contact form.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", {
      code: error.code,
      responseCode: error.responseCode,
      response: error.response,
      message: error.message,
    });
    return res
      .status(502)
      .json({ success: false, message: "Failed to send email" });
  }
});

export default router;
