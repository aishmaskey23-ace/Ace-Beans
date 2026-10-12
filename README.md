# Ace Beans — Responsive Landing Page

A responsive landing page for **Ace Beans**, a concept coffee subscription brand based in Nepal. Green beans are sourced from mid-hill cooperatives in Gulmi, Kavre, Palpa and Syangja, then roasted in small batches at a Lalitpur roastery in the Kathmandu Valley, so customers get coffee just days off the roaster instead of beans that have sat in a warehouse for months.

Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Just unzip and open `index.html`.

## Live Demo Link: 
ace-beans.vercel.app 
![Demo video](<Ace Beans gif.gif>)

## Live features

- **Responsive layout** — fluid type and spacing, grid layouts that collapse cleanly from desktop down to mobile
- **Sticky navigation** with a mobile hamburger menu
- **Dark / light mode toggle**, preference saved in `localStorage` and applied before first paint (no light-mode flash)
- **Hero section** with animated, count-up stats (triggered on scroll via `IntersectionObserver`)
- **Bean lineup** — three single-origin roasts with tasting notes, Nepali Rupee (Rs.) pricing and an "Order on WhatsApp" button on each card
- **Origin story timeline** — farm → drying → roastery → delivery
- **"How it works"** — 3-step subscription explainer
- **Testimonial carousel** — autoplay with dot navigation and prev/next controls; pauses on hover, keyboard focus, or a pause button, and doesn't autoplay for visitors who prefer reduced motion
- **Pricing tiers** — weekly / every-2-weeks / every-4-weeks plans, with price ranges by roast and prefilled WhatsApp order messages
- **Newsletter signup** — client-side email validation; falls back to a WhatsApp message until a real form endpoint is added
- **FAQ accordion** — one section open at a time
- **Floating WhatsApp button** — links directly to `+977 9746553700` for direct customer DMs
- **Back-to-top button**
- **SEO / sharing** — favicon, meta description and Open Graph tags
- **Accessibility** — skip link, visible keyboard focus states, AA-contrast buttons in both themes, screen-reader-friendly marquee, content stays visible if JavaScript is off, and `prefers-reduced-motion` support

## Screenshots of Website (Specific portion only )
![alt text](images/image.png)
![alt text](images/image-1.png)
![alt text](images/image-2.png)
![alt text](images/image-3.png)
![alt text](images/image-4.png)
![alt text](images/image-5.png)
![alt text](images/image-6.png)
![alt text](images/image-7.png)

## Project structure

```
ace-beans/
├── index.html        # Page structure and content
├── css/
│   └── styles.css    # Design tokens, layout, responsive rules, dark mode
├── js/
│   └── script.js     # Nav, theme toggle, counters, carousel, forms
├── images/
│   └── photos/       # Locally hosted photos (hero, beans, story timeline)
└── README.md
```

## Running it locally

No build tools required. Either:

1. Double-click `index.html` to open it directly in a browser, or
2. Serve it locally for a closer-to-production feel:
   ```bash
   cd ace-beans
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```

## Customizing

- **Colors / type / spacing** — all defined as CSS custom properties at the top of `css/styles.css` (`:root` for light mode, `[data-theme="dark"]` for dark mode)
- **Copy and pricing** — edit directly in `index.html`
- **WhatsApp number** — the number `9779746553700` appears in the `wa.me` links in `index.html` (floating button, bean cards, plan buttons, footer) and in `WHATSAPP_NUMBER` in `js/script.js`; search for it and replace all occurrences
- **Newsletter** — set `NEWSLETTER_ENDPOINT` at the top of the newsletter section in `js/script.js` to a form service URL (e.g. Formspree) to switch email signups on
- **Payments** — ordering currently happens over WhatsApp; wire up a real checkout (e.g. eSewa / Khalti) to take payments on the site

## Images

Photos (hero collage, bean cards, and the "Our Story" timeline) come from [Pexels](https://www.pexels.com), which are free to use for commercial projects with no attribution required. They are downloaded and stored locally in `images/photos/` so the page doesn't break if a link changes. They're placeholders standing in for real farm/roastery photography.

## Tech notes

- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display), [Work Sans](https://fonts.google.com/specimen/Work+Sans) (body), [Noto Sans Devanagari](https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari) (for the नमस्ते accent) — loaded from Google Fonts
- No external JS libraries — the carousel, counters, and theme toggle are all hand-written vanilla JS
- Breakpoints at `960px` and `720px`

## License / status

This is a coursework / portfolio project built around a fictional brand concept. Not a live business — swap in real content, payment integrations, and legal pages before using it for an actual company.