const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email server error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

// Generic send email function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"SmartDiscover" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

/**
 * Welcome Email (After Registration)
 */
async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to SmartDiscover 🎉";

  const text = `
Hi ${name},

Welcome to SmartDiscover!

Your account has been successfully created.

Start exploring thousands of products from verified sellers.

Best regards,
SmartDiscover Team
`;

  const html = `
<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
  <h2 style="margin-bottom:12px">Welcome ${name}! 🎉</h2>
  <p>Your account has been successfully created.</p>
  <p>Start exploring thousands of products from verified sellers.</p>
  <p style="margin-top:24px">Happy shopping!<br/><strong>SmartDiscover Team</strong></p>
</div>
`;

  await sendEmail({
    to: userEmail,
    subject,
    text,
    html,
  });
}

/**
 * Password Reset Email
 */
async function sendPasswordResetEmail(userEmail, name, resetLink) {
  const subject = "Reset Your SmartDiscover Password";

  const text = `
Hi ${name},

We received a request to reset your password.

Click the link below to reset your password:

${resetLink}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.
`;

  const html = `
<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
  <h2>Hi ${name},</h2>
  <p>We received a request to reset your password.</p>

  <a href="${resetLink}"
     style="display:inline-block;margin:20px 0;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px">
     Reset Password
  </a>

  <p style="font-size:13px;color:#666">
    This link expires in <strong>1 hour</strong>.
  </p>

  <p style="font-size:12px;color:#999">
    If you didn't request this, you can safely ignore this email.
  </p>
</div>
`;

  await sendEmail({
    to: userEmail,
    subject,
    text,
    html,
  });
}

module.exports = {
  sendRegistrationEmail,
  sendPasswordResetEmail,
};
