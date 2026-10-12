# SY — Chante Groenewald Physiotherapy website concept

A responsive, dependency-free static website based on the supplied Instagram handle `sy.cgphysio`.

## Run locally

From `/workspace/Chante-Website-Build`:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

The website uses plain HTML, CSS and JavaScript. No installation or build step is required. Newsreader Light and DM Sans are self-hosted in `assets/fonts/` with their font licences. Brand artwork is served locally from `assets/brand/`; no external images or fonts are required.

## Content status

Confirmed by the user: SY is the brand; Chante Groenewald Physiotherapy is the formal name; the practice is in Paarl, Western Cape, South Africa. Women’s and pelvic health are the core offering, with return to running, exercise and sport as a differentiator. The corrected Instagram handle is `sy.cgphysio`.

The user supplied the address (147 Main Road, Paarl, Western Cape), phone/WhatsApp number (066 168 0935) and email (admin@cgphysio.co.za). Links support map search, calls, WhatsApp and email. Contact buttons open Instagram; no appointment request is sent through the website. No qualifications, registration details, testimonials, results or appointment availability are invented.

Edit `index.html` for page content, `styles.css` for design and `app.js` for care details and interactions. The business growth planning documents are maintained separately in the cloud workspace. Professional and advertising review is pending before public launch.

## Brand design

The supplied SVG artwork defines these colours: blush `#c4a69d`, linen `#ede4db`, olive `#bab8a2`, sand `#b69678` and white `#ffffff`. Dark neutral `#3e4037` supports readable text and controls. Newsreader Light (300), including italic, is used for headings; DM Sans is used for body text. Both are self-hosted from Fontsource distributions with their SIL Open Font Licences included. The reference overview informs white space, a sand wordmark on white, and a blush footer with white curve artwork. Original SVGs are preserved without recolouring.

Header and footer use the linen women’s health wordmark. The hero uses the sand logo with dot. All three supplied curve designs appear in the hero, page divider and approach section. The library includes additional colour variants for future use. No photographs were included in the staged assets.

Text appears with a subtle upward fade once when scrolled into view. Reduced-motion preferences disable the animation, and text remains visible when JavaScript is disabled.

## Practitioner profile

The Meet your Physio section shows one profile for Chanté Groenewald, the user-supplied portrait, practice focus areas and a contact link. The original JPEG is served from `assets/images/chante-groenewald.jpg`, with responsive cropping handled by CSS. Supply a verified biography/qualifications when ready. The introduction uses the confirmed practice positioning and does not invent credentials or experience.

Section boundaries use pale linen and olive background washes, thin sand-tinted rules and consistent spacing. The original brand colours remain the accents; sections alternate gently without strong visual breaks.
