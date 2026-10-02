# La Boutique Del Lago

Marketing site for **La Boutique Del Lago**, a concept store in Lecco selling territorial
souvenirs, artisan pasta, local wines and oils, and wooden utensils.

Built with [Astro](https://astro.build) as a fully static site -
no client-side framework is shipped. Live at <https://www.laboutiquedellago.com>.

## 🚀 Getting started

Requires **Node.js >= 22.12.0**.

```sh
npm install
npm run dev      # http://localhost:4321
```

| Command                   | Action                                            |
| :------------------------ | :------------------------------------------------ |
| `npm install`             | Installs dependencies                             |
| `npm run dev`             | Starts local dev server at `localhost:4321`       |
| `npm run build`           | Builds the production site to `./dist/`           |
| `npm run preview`         | Previews the build locally, before deploying      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`  |
| `npm run astro -- --help` | Get help using the Astro CLI                      |

## 🧞 Stack

| Concern       | Choice                                                    |
| :------------ | :-------------------------------------------------------- |
| Framework     | Astro 7, `output: 'static'`                               |
| Styling       | Tailwind CSS 4 via the `@tailwindcss/vite` plugin         |
| Carousels     | [Embla](https://embla-carousel.com)                        |
| SEO           | `@astrojs/sitemap` + hand-written tags in `MainLayout`    |

Design tokens (fonts and brand colours) live in the `@theme` block in
`src/styles/global.css` — edit them there rather than hard-coding values.

## 👗 Project structure

```text
/
├── public/
│   ├── favicon.svg            # light-mode icon (black)
│   ├── favicon-white.svg      # dark-mode icon (white)
│   ├── favicon.ico            # legacy fallback
│   └── images/                # og-image.jpg, background.jpeg
└── src/
    ├── assets/                # imported images, SVGs, social icons
    ├── components/
    │   ├── ui/                # CookieBanner, ImageCarousel
    │   └── *.astro            # one component per homepage section
    ├── layouts/MainLayout.astro
    ├── pages/                 # index.astro, privacy.astro
    └── styles/global.css
```

`src/assets/` files are imported through Vite, so they get hashed and optimized.
Only files that must sit at a stable, predictable URL (favicons, `og-image.jpg`)
belong in `public/`.

The homepage (`src/pages/index.astro`) is a flat list of section components —
`Hero`, `About`, `Merch`, `OurProducts`, `PastaSection`, `WineSection`,
`OilSection`, `Maps`, `Footer`. Add or reorder sections there.

## 🔍 SEO

`src/layouts/MainLayout.astro` handles canonical URLs, Open Graph, Twitter cards,
geo tags and a `Store` JSON-LD schema (name, address, geo, opening hours, VAT ID).
Every page sets its own `title`, `description` and social `image` via props:

```astro
<MainLayout
  title="..."
  description="..."
  image="/images/og-image.jpg"
  noindex={true}
>
```

The site URL lives in `astro.config.mjs` and is mirrored by `SITE_URL` in
`MainLayout.astro` — update both when the domain changes.

## 🎨 Favicons

The logo is near-black, so it disappears on dark browser chrome. `MainLayout`
therefore ships two SVGs and switches between them with `prefers-color-scheme`:

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/svg+xml" media="(prefers-color-scheme: light)" href="/favicon.svg" />
<link rel="icon" type="image/svg+xml" media="(prefers-color-scheme: dark)" href="/favicon-white.svg" />
```

The `.ico` comes first on purpose: it has no `media` attribute, so it always
matches and must stay *before* the media-scoped SVGs, otherwise it can win in
browsers that pick the last matching icon.

Browsers cache favicons aggressively — expect a hard reload or a re-pin before
seeing changes.

## 🍪 Cookie banner

`src/components/ui/CookieBanner.astro` only reads, writes and persists
`localStorage`. It is presentation, not consent enforcement — if real analytics
are ever added, gate them on the stored choice.

## 📚 Documentation

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
