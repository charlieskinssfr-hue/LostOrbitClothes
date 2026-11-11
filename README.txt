LOST ORBIT — UPDATED STORE

PRODUCTS (AUD)
- Tracksuit: $95.00
- Shorts: $44.95
- Shirt: $65.00
- Colours: Black / Pink / Grey
- Sizes: S / M / L / XL

The uploaded clothing photos are kept in /images.
The cart remembers product, colour, size and quantity.

IMPORTANT: CHECKOUT / PAYMENTS
The storefront is static, but real card payments must be handled by a secure server.
This ZIP includes a Stripe Checkout server endpoint in /api/create-checkout-session.js.
It validates products and prices on the server (not in the browser), then redirects
customers to Stripe's hosted checkout. Stripe collects payment details and the
shipping address. This website does not store card details.

To enable live checkout:
1. Create a Stripe account at https://stripe.com/ and complete its business verification.
2. Import this project into Vercel at https://vercel.com/ (GitHub Pages alone cannot run the API).
3. In Vercel, add environment variable STRIPE_SECRET_KEY using your Stripe SECRET key.
   Never put this key in index.html, script.js, GitHub Pages files or public source code.
4. Add SITE_URL with your deployed website URL, e.g. https://your-store.vercel.app
5. Deploy. Test in Stripe test mode before switching to live mode.
6. In api/create-checkout-session.js, adjust allowed_countries if you ship outside Australia.
7. For a production store, configure Stripe webhooks and an order-management/email workflow
   before accepting live orders. The success page alone is not proof of payment.

LOGO
The Discord logo URL supplied in chat could not be downloaded (it may have expired).
Upload the logo image into images/lost-orbit-logo.webp and tell me when it's there;
it can then be placed as a subtle background graphic. A faint text watermark is included
in the meantime.

GITHUB PAGES NOTE
If you keep hosting only on GitHub Pages, the product catalogue and cart work, but the
secure payment API will not run there. Deploy the project to Vercel to use the included
Stripe checkout endpoint.
