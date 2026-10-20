# Jagannath Patnaik — Portfolio

A single-page portfolio for a Java full-stack developer. It uses semantic HTML, plain CSS, and native JavaScript. The optional animated background uses Three.js 0.186.0 from a pinned jsDelivr CDN import; the page content remains available if WebGL or that CDN is unavailable.

## Files

```text
portfolio/
├── index.html    Page content, metadata, and section structure
├── style.css     Design tokens, layout, responsive rules, and motion preferences
├── script.js     Navigation, concept diagrams, contact draft, and optional Three.js scenes
├── favicon.svg   JP monogram site icon
└── README.md     Setup and customization notes
```

## Run locally

The Three.js module uses browser imports, so serve the folder over HTTP instead of opening `index.html` directly.

1. Install Python 3 if it is not available on your computer.
2. Open a terminal in the `portfolio` folder.
3. Run `python -m http.server 8000` (on Windows, `py -m http.server 8000` also works when the Python launcher is installed).
4. Visit <http://localhost:8000> in a modern browser.

There is no package installation or build step.

## Personalize the content

- **Name, headline, bio, and sections:** edit `index.html`.
- **Skills:** update the badges in the Toolkit section of `index.html`. Keep only technologies that reflect your experience.
- **Projects:** the three current cards are explicitly labeled engineering concepts, not shipped work. Replace their titles, descriptions, technology badges, and architecture sketches with verified project details. Add real demo or repository links only when those destinations exist.
- **Email and profiles:** set `CONTACT_EMAIL`, `PROFILE_URLS.github`, and `PROFILE_URLS.linkedin` near the top of `script.js`. Social links appear only when configured.
- **Theme:** the page follows the visitor’s system light/dark preference on first visit. The navigation toggle switches themes and remembers the choice in that browser.
- **Résumé:** no résumé was provided. Add a real PDF to this folder and link it from `index.html` if you want to include one.
- **Experience, education, and certifications:** no details were present in the supplied project, so no timeline or credentials are claimed. Add verified entries to `index.html` when ready.
- **Icon:** replace `favicon.svg` with your own SVG and keep the matching `<link rel="icon">` path in the page head.
- **Colors and layout:** edit the CSS custom properties at the top of `style.css`.

## Contact behavior

The contact form validates name, email, and message fields, then prepares a `mailto:` draft. It does not submit to a server, store personal information, or confirm message delivery. Configure `CONTACT_EMAIL` before publishing so the draft opens with a recipient. The visitor still sends the message from their own email application.

## Search and social previews

The page includes a descriptive title, meta description, Open Graph title and description, and a summary Twitter card. A canonical URL and preview image are intentionally omitted because no production domain or share image was supplied. Add them when the final hosting URL and image are known.

## Deploy

This is a static site. Upload the contents of this folder to the root of a static host such as GitHub Pages, Netlify, or Vercel; no build command is required. Configure a production domain and its HTTPS settings in the hosting platform, then update canonical/social metadata if you add a domain or preview image. The Three.js and Google Fonts resources need an internet connection; text and layout fall back to system fonts and a CSS background when external resources are unavailable.
