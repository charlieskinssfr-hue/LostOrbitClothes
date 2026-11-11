const Stripe = require("stripe");

const CATALOGUE = {
  tracksuit: { name: "Lost Orbit Tracksuit", cents: 9500 },
  shorts: { name: "Lost Orbit Shorts", cents: 4495 },
  shirt: { name: "Lost Orbit Shirt", cents: 6500 }
};
const COLOURS = ["Black", "Pink", "Grey"];
const SIZES = ["S", "M", "L", "XL"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: "Stripe isn't configured yet. Add STRIPE_SECRET_KEY to your Vercel environment variables." });
  }
  try {
    const { customerName, email, items } = req.body || {};
    if (typeof customerName !== "string" || !customerName.trim() ||
        typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !Array.isArray(items) || items.length < 1 || items.length > 30) {
      return res.status(400).json({ error: "Please enter a valid name, email and cart." });
    }
    const line_items = items.map(item => {
      const product = CATALOGUE[item.id];
      const qty = Number(item.qty);
      if (!product || !COLOURS.includes(item.colour) || !SIZES.includes(item.size) ||
          !Number.isInteger(qty) || qty < 1 || qty > 10) {
        throw new Error("One of the cart items is invalid. Please refresh your cart and try again.");
      }
      return {
        quantity: qty,
        price_data: {
          currency: "aud",
          unit_amount: product.cents,
          product_data: {
            name: product.name,
            description: `${item.colour} / Size ${item.size}`,
            metadata: { product_id: item.id, colour: item.colour, size: item.size }
          }
        }
      };
    });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: email.trim(),
      customer_creation: "always",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["AU"] },
      phone_number_collection: { enabled: true },
      metadata: { customer_name: customerName.trim() },
      success_url: `${siteUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`
    });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(400).json({ error: error.message || "Unable to create checkout session." });
  }
};
