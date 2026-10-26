# Ramin Kupaei · Portfolio

My personal site: social robots, research, and the web projects I started with.

It's a plain static site (HTML, CSS and a little JavaScript), so it runs on GitHub Pages with no build step.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | All the page content: hero, work, papers, lessons, about, archive, contact |
| `styles.css` | Colours, type and layout. Colour tokens for light and dark mode are at the top |
| `main.js` | Theme toggle, the clickable robot, ArUco markers, copy-email button |
| `projects.html` | Redirects the old projects page to `index.html#archive` so old links still work |
| `images/` | Headshot, favicon and archive screenshots |

## Common edits

- **Add a paper or project:** copy one `<article class="work">` block in `index.html` and change the text. Status chips are `published`, `review` or `progress`.
- **Change what the robot says:** edit the `lines` list in `main.js`. Each line is `[mood, text]`, where mood is `idle`, `happy`, `wow` or `wink`.
- **Add a real photo to a project:** replace the `<div class="art ...">` illustration with `<div class="art"><img src="images/your-photo.webp" alt="..."></div>`.
- **The black-and-white squares** are real ArUco markers (DICT_4X4_50). Add one anywhere with `<svg class="aruco" data-id="7" viewBox="0 0 8 8"></svg>` using an ID listed in `main.js`.

## Deploy on GitHub Pages

1. Push these files to the repository's `main` branch.
2. In **Settings → Pages**, set the source to `main` and the root folder.
