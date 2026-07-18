/**
 * Generic SMS gateway hook. Configured by default for a BulkSMSBD-style
 * REST API (GET request with api_key, senderid, number, message). Swap the
 * query params below if you use a different local gateway (e.g. Sslwireless,
 * Alpha SMS, Reve Systems) - the calling code elsewhere never needs to change.
 */
export async function sendOrderConfirmationSMS(order) {
  const phone = order?.shipping?.phone;
  if (!phone) return { skipped: true, reason: "no-phone" };

  const message = `Zenvora Mart BD: Order ${order.orderNumber} confirmed! Total Tk ${order.total}. Payment: ${order.paymentMethod.toUpperCase()}. Track it on our website. Thank you!`;

  if (!process.env.SMS_API_URL || !process.env.SMS_API_KEY) {
    console.log(`[zenvora][sms:mock] To: ${phone} | ${message}`);
    return { skipped: true, reason: "sms-not-configured" };
  }

  try {
    const url = new URL(process.env.SMS_API_URL);
    url.searchParams.set("api_key", process.env.SMS_API_KEY);
    url.searchParams.set("senderid", process.env.SMS_SENDER_ID || "");
    url.searchParams.set("number", phone.replace(/^0/, "88 0"));
    url.searchParams.set("message", message);

    const res = await fetch(url.toString(), { method: "GET" });
    const data = await res.json().catch(() => ({}));
    return { sent: res.ok, data };
  } catch (err) {
    console.error("[zenvora][sms] Failed to send:", err.message);
    return { sent: false, error: err.message };
  }
}
