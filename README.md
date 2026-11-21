# RJ PRODUCTION — Complete Website

A complete responsive one-page website built with HTML5, CSS3 and vanilla JavaScript.

## Run in VS Code
1. Extract this ZIP.
2. Open the `RJ_PRODUCTION` folder in VS Code.
3. Open `index.html` with the Live Server extension.

## Day / Night environment
- Day mode: warm golden desert sky, layered dunes and continuously drifting sand/wind particles.
- Night mode: deep galaxy sky, glowing nebula, twinkling stars and continuously falling snow.
- The theme button is icon-only (no square tile background), animates on hover and changes the full page environment.
- The selected theme is saved in localStorage.

## Hero video
Put your MP4 file at:
`assets/videos/rj-production-showreel.mp4`

The hero player autoplays muted, loops and plays inline. If the video is missing, the branded fallback is shown instead of a broken player.

## Contact
The project contact details supplied in the existing RJ PRODUCTION project are used:
- WhatsApp / Phone: +91 8286232467
- Email: rjproductionin@gmail.com (add to your preferred contact area if required)
The enquiry form validates fields and opens WhatsApp with a pre-filled message. It does not submit data to a server.

## Files
- `index.html` — page structure
- `style.css` — responsive styling and component layouts
- `script.js` — theme, weather effects, navigation, typewriter, reveal, video fallback and enquiry form
- `assets/` — supplied logo, banners, service and portfolio images

No framework or build step is required.


## Day/Night background visibility fix
The day/night scene CSS is now embedded at the end of the document head so it overrides older inline theme styles. Main section backgrounds are transparent so the full-screen scenery remains visible behind the content. The day scene includes a visible sun, layered desert dunes and continuous wind-blown sand. The night scene includes a galaxy nebula, twinkling stars and continuous falling snow. The theme control is icon-only with no square tile.


**Visibility fix:** The final scene CSS is embedded after the existing styles and before the body, and the missing `</head>` has been repaired. All page sections are transparent to reveal the full-screen desert or galaxy scenery.


## Optional Day / Night background videos
Add your own MP4 files with these exact names and paths:
- `assets/videos/day.mp4` — plays continuously in Day mode
- `assets/videos/night.mp4` — plays continuously in Night mode

Both videos are muted, looped, inline and switched automatically by the Sun/Moon theme button. Only the active mode's video plays. If a video file is not present or cannot autoplay, the existing animated desert/galaxy background remains as a fallback. You only need to replace/add these two MP4 files; no code changes are required.


## Background video visibility fix
The background MP4 now renders above the CSS desert/galaxy fallback. The fallback is hidden only after the matching video fires its `playing` event; if the MP4 is missing or fails, the CSS scene remains visible. When changing theme, the inactive video pauses and the selected mode's video starts.

**Important:** the downloaded file shown in your screenshot is named `videoplayback.mp4`. Rename your daytime MP4 to `day.mp4` and place it in `assets/videos/`. Place your night MP4 as `night.mp4` in the same folder.


## Day / Night background video files
Place your two full-screen background MP4 files here:
- `assets/videos/day.mp4` — plays in Day Mode
- `assets/videos/night.mp4` — plays in Night Mode

Videos autoplay muted, loop continuously and switch automatically with the theme button. Only the active theme video plays. The animated desert / galaxy CSS scenery remains as a fallback if the MP4 is missing, unsupported or autoplay is blocked. Keep the existing hero showcase video at `assets/videos/rj-production-showreel.mp4` if you use it; it is separate from the full-screen background videos.

## Merged effects
The current RJ PRODUCTION page structure and content are retained. The legacy scroll reveal, staggered cards, heading shimmer, independent brand-line entrance, animated buttons, glowing pointer cursor, theme wipe, and typewriter effect are included alongside the current responsive layout, portfolio, contact form and WhatsApp integration.

## Contact settings
WhatsApp: `918286232467`
Phone: `+91 8286232467`
Edit `SITE_CONFIG` near the contact integration section in `script.js` if these details ever change.
