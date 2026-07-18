import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    console.warn("[zenvora] SMTP not configured. Emails will be logged to console only.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

export async function sendOrderConfirmationEmail(order, toEmail) {
  if (!toEmail) return { skipped: true, reason: "no-email" };

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #22304a;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #22304a;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #22304a;text-align:right;">৳${item.price}</td>
        </tr>`
    )
    .join("");

  const html = `
  <div style="background:#0a0f16;padding:32px;font-family:Arial,sans-serif;color:#e6f7f9;">
    <div style="max-width:560px;margin:0 auto;background:#111927;border:1px solid #22304a;border-radius:16px;padding:24px;">
      <h2 style="color:#22e8f5;margin-top:0;">Zenvora Mart BD</h2>
      <p>Hi ${order.shipping.fullName}, thank you for your order!</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been received and is now <strong>${order.status}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #22304a;">Item</th>
            <th style="padding:8px;border-bottom:1px solid #22304a;">Qty</th>
            <th style="text-align:right;padding:8px;border-bottom:1px solid #22304a;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="margin-top:16px;text-align:right;font-size:18px;">
        <strong>Total: ৳${order.total}</strong>
      </p>
      <p style="color:#9fb3c8;font-size:13px;">
        Payment method: ${order.paymentMethod.toUpperCase()} · You can track your order anytime using your order number on our Order Tracking page.
      </p>
    </div>
  </div>`;

  const t = getTransporter();
  if (!t) {
    console.log(`[zenvora][email:mock] To: ${toEmail} | Order ${order.orderNumber} confirmation`);
    return { skipped: true, reason: "smtp-not-configured" };
  }

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || "Zenvora Mart BD <no-reply@zenvoramart.com>",
      to: toEmail,
      subject: `Order Confirmed - ${order.orderNumber} | Zenvora Mart BD`,
      html
    });
    return { sent: true };
  } catch (err) {
    console.error("[zenvora][email] Failed to send:", err.message);
    return { sent: false, error: err.message };
  }
}
