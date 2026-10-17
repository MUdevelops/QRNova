# QRNova testing checklist

Nothing below has been run yet. Tick items off after your first install and deploy. Use at least one iPhone and one Android phone for scan tests.

## Setup
- [ ] `npm install` finishes without errors
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds; `npm run preview` loads with no console errors
- [ ] Netlify deploy succeeds; both functions appear under **Functions** (`upload-image`, `image`)

## Link to QR
- [ ] `example.com` becomes `https://example.com/`; valid link shows a green confirmation and a live QR
- [ ] `javascript:alert(1)`, `ftp://x.com`, `not a url`, and text with spaces are rejected with a clear message
- [ ] `http://example.com` shows the "not encrypted" warning but still works
- [ ] Copy link copies the normalized URL
- [ ] Phone camera opens the exact URL

## Text to QR
- [ ] Multiline text scans back with line breaks intact
- [ ] Emoji and non-Latin text (for example `Привет 你好 😀`) scan back correctly — **verify this one specifically**
- [ ] Counter updates; warning appears above 500 bytes; error and paused preview above capacity
- [ ] Empty or whitespace-only text shows the empty state

## Image to QR
- [ ] `npm run dev` (no functions): shows "isn't available here", nothing is uploaded
- [ ] `npm run dev:netlify` / deployed site: PNG and JPG preview correctly; Replace and Remove work
- [ ] GIF, WebP, a renamed `.txt`, and an over-limit file are rejected
- [ ] Upload creates a QR; scanning opens the image; the link opens in a private window
- [ ] Replacing the image mid-upload doesn't leave a stale QR
- [ ] `IMAGE_UPLOAD_ENABLED=false` shows the disabled state after redeploy

## Customization
- [ ] Palettes, color picker and hex field update the preview; invalid hex is ignored
- [ ] Square, Rounded and Dots all scan
- [ ] Contrast below 2:1 pauses downloads; 2–4.5 warns; light-on-dark warns
- [ ] Margin and error-correction changes apply; margin under 5% warns
- [ ] Adding a logo locks error correction to High and shows the warning; the code still scans; Remove restores the previous level
- [ ] Reset restores all defaults including the logo

## Downloads
- [ ] PNG (1024), SVG and Print PNG (3000) download as `qrnova-website.png`, `.svg`, `-print.png` (and `-text` / `-image` variants)
- [ ] Each downloaded file scans and matches the preview, including colors, style and logo
- [ ] SVG opens in a browser and in a vector editor
- [ ] Copy image pastes into a chat or document (Chrome/Edge/Safari; hidden where unsupported)
- [ ] Switching tabs never shows another mode's QR

## Accessibility and responsive
- [ ] Tab through the page: visible focus, tab arrows (Left/Right/Home/End) switch modes
- [ ] FAQ buttons toggle with Enter and Space; Privacy/Terms dialogs close with Esc
- [ ] 360 px width: no horizontal scroll; mobile menu opens and closes
- [ ] Reduced-motion setting disables smooth scroll

## SEO
- [ ] Title and meta description match the brief; favicon shows in the tab
- [ ] Share the deployed URL in a link-preview tool and confirm the og-image loads
