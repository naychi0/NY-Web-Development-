# Bean Boutique Demo

Bean Boutique is a responsive front-end storefront demo for portfolio and learning purposes.

## Demo Limitations

- Checkout only displays a success message. No orders are sent, verified, or processed, and no real payments occur.
- Sign-in and sign-up forms are visual demonstrations only. Do not enter real credentials or sensitive personal data.
- Cart contents and newsletter email entries are stored in the browser's `localStorage` and are not submitted to a backend.
- Cart prices are client-side display values and must never be trusted for real checkout.
- The site loads some third-party libraries from CDNs.

## Deploying the Demo

The main portfolio repository is rooted one level above this folder. To publish Bean Boutique as its own static site, configure the hosting provider's site root to `demos/bean-boutique/` and use `Home.html` as the entry page, or rename it to `index.html` in a separate deployment copy.