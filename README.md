# QRNova — Free Online QR Code Generator

Create. Scan. Connect. QRNova turns **images, links and text** into customizable QR codes. Built with React, TypeScript, Vite, Tailwind CSS 3 and [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling). Deploys to Netlify as-is.

> **Status:** `npm run typecheck` and `npm run build` pass. Work through [TESTING.md](./TESTING.md) to verify the browser flows after deployment.

## What it does

| Mode | How it works |
| --- | --- |
| Link to QR | Validates and normalizes the URL (adds `https://`, accepts only http/https). Generated in the browser. |
| Text to QR | Encodes the exact text, multiline supported, with a byte counter and capacity/density warnings. Generated in the browser. |
| Image to QR | Uploads the PNG/JPG to a Netlify Function (stored in Netlify Blobs) and encodes its public URL `/i/<id>`. Shows an unavailable state if hosting isn't reachable. |

Customization: palettes, foreground/background colors with contrast checking, square/rounded/dot modules, margin, error correction, optional center logo (forces level H). Exports: PNG (1024 px), SVG, print PNG (3000 px), copy image to clipboard. Export uses the same settings as the preview.

## Project structure

```
qrnova/
├─ index.html                 SEO, Open Graph, favicon links, JSON-LD
├─ netlify.toml               build, functions, security headers
├─ .env.example
├─ public/                    logo, favicons, og-image, robots.txt
├─ netlify/functions/
│  ├─ upload-image.ts         GET/POST /api/upload
│  └─ image.ts                GET /i/:id
└─ src/
   ├─ main.tsx, App.tsx, index.css
   ├─ lib/                    types, qr (options + export), validation, contrast, download, upload
   └─ components/             Navbar, Hero, QRGenerator, ImageToQR, LinkToQR, TextToQR,
                              CustomizationPanel, QRPreview, QRCanvas, DownloadControls,
                              Features, HowItWorks, FAQ, Footer, LegalDialog, ErrorBoundary, Logo
```

## Local development

Requires Node 18.18+ (Node 20 recommended).

```bash
npm install
npm run dev            # http://localhost:5173 — link/text modes work; image mode shows "unavailable"
npm run dev:netlify    # http://localhost:8888 — runs the functions too, so image mode works
npm run typecheck
npm run build && npm run preview
```

## Deploy to Netlify

1. Push the project to GitHub/GitLab/Bitbucket (commit the `package-lock.json` created by `npm install`).
2. In Netlify: **Add new site → Import an existing project**, pick the repo. Settings are read from `netlify.toml` (build `npm run build`, publish `dist`, functions `netlify/functions`).
3. Deploy. No environment variables are required.

CLI alternative: `npx netlify-cli deploy --build --prod`. Use Git or the CLI rather than dragging the `dist` folder into Netlify, because a plain `dist` upload has no functions, so image mode would be unavailable.

## Enabling image hosting

Image hosting is built in and needs **no API keys**: the function stores uploads in [Netlify Blobs](https://docs.netlify.com/blobs/overview/) on your own site. It activates automatically on a Netlify deploy and under `netlify dev`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `IMAGE_UPLOAD_ENABLED` | `true` | Set to `false` to switch image mode off (the UI then shows the unavailable state). |
| `IMAGE_MAX_MB` | `4` | Upload limit, clamped to 1–4 MB (Netlify Functions accept ~6 MB request bodies). |

Set them under **Site configuration → Environment variables**, then redeploy.

**Things to know**
- Uploaded images are **public** to anyone with the link and stay until you delete them (Netlify UI → **Blobs**, store `qrnova-images`). A QR code only works while its image exists. The Privacy Policy and FAQ say this.
- The function checks the file's magic bytes (PNG/JPEG only) and size, serves images with `nosniff` and a sandboxing CSP, and never exposes credentials to the browser.
- There is **no rate limiting or abuse reporting** built in. For a public launch, consider Netlify's rate limiting, CAPTCHA, or periodic review of the store.

## Configuration notes

- `VITE_CONTACT_EMAIL` shows a Contact link in the footer. Leave it empty and the footer says contact isn't configured. It is public by design; never put secrets in `VITE_*` variables.
- Social previews use Netlify's build-time `URL` for an absolute `og:image`. On a custom domain, set it as the primary domain in Netlify (or set `SITE_URL` as a build variable).
- The Privacy Policy and Terms are plain-language starting points. Have them reviewed for your jurisdiction.
- Fonts (Inter) are bundled, with no calls to Google Fonts.

## Honest limits

QR codes here are **static**: no editing after creation, no scan analytics. Scanning depends on the phone, print quality and design choices, so test every code you plan to distribute.
