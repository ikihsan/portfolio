# ikihsan.me — Next.js Portfolio Starter

This repository is a production-ready portfolio starter for the domain `ikihsan.me`. It's built with Next.js (App Router), Tailwind CSS, and Framer Motion. The project includes a tasteful animated gradient background, an accessible randomized quote popup, and skeleton pages to customize.

Quick start

1. Install dependencies

```powershell
npm install
```

2. Run development server

```powershell
npm run dev
```

3. Build and run production locally

```powershell
npm run build
npm run start
```

Deploy

- Vercel (recommended): Import from your GitHub repo in Vercel dashboard, set framework to `Next.js`, and deploy. To set the domain `ikihsan.me`, add it in Vercel's Domains settings and follow DNS instructions.
- GitHub Pages: Next.js is server-based; GitHub Pages isn't ideal. If you need static export, run `npm run build && npm run export` and serve the `out/` folder — not recommended for full Next.js features.

Files of interest

- `app/layout.jsx` — Root layout and font setup.
- `components/GradientBackground.jsx` — Animated gradient background.
- `components/PopupQuote.jsx` — Accessible quote modal with auto-dismiss and localStorage logic.
- `data/quotes.js` — The 50 developer quotes used by the popup.
- `styles/globals.css` — Tailwind + custom CSS for theme.

Replace placeholders

- `public/logo.svg` — Replace with your logo.
- `public/og-image.png` — Replace with a sharing image.

Accessibility & analytics

- The popup is `role="dialog"` and announced to assistive tech. It stores a 24-hour localStorage flag. There's a reduced-motion toggle utility and an analytics stub commented where you can add GA or Plausible.

Screenshots (placeholders)

Popup (on first load):

  [ GLASSY NEON POPUP centered over blurred animated gradient background ]

Final page after popup fades:

  [ HERO with large Poppins headline, rotating roles, CTA buttons, subtle terminal / code area ]