const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "SmartDiscover <onboarding@resend.dev>";

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(to, name, resetLink) {
  console.log("🔗 Reset link for", to, "→", resetLink);
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your SmartDiscover password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #e5e7eb">
        <h2 style="margin:0 0 8px;font-size:20px;color:#111">Hi ${name},</h2>
        <p style="color:#6b7280;font-size:14px;margin:0 0 24px">
          We received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetLink}"
          style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600">
          Reset Password
        </a>
        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
