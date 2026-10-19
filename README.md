# RJ PRODUCTION Website

A simple, responsive, premium blue-and-white business website built with HTML, CSS and vanilla JavaScript.

## Files
- `index.html` — page structure and content
- `style.css` — responsive styling and animations
- `script.js` — mobile menu, service pre-selection, WhatsApp enquiry form, contact links and locally saved banner loading
- `admin.html`, `admin.css`, `admin.js` — demo banner-management panel
- `assets/` — supplied RJ PRODUCTION logo and 12 service banner images

## Run locally
### Option 1: Open directly
Double-click `index.html` to open it in your browser.

### Option 2: VS Code + Live Server (recommended)
1. Extract the ZIP file.
2. Open the extracted `rj_production_website` folder in VS Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and choose **Open with Live Server**.

### Option 3: Python local server
Open a terminal in this folder and run:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Important: Set your contact details
Open `script.js` and edit `SITE_CONFIG` at the top:

```js
const SITE_CONFIG = {
  whatsappNumber: "918286232467",
  phoneNumber: "+91 8286232467"
};
```

The website is preconfigured with the provided business number **+91 82862 32467** for WhatsApp and phone calls. Change it in `script.js` if needed.

The form validates the enquiry and opens a pre-filled WhatsApp message for the visitor to review and send. It does **not** silently send a message or store customer details on a server.

## Customise
- Change services: edit the service cards and service dropdown in `index.html`.
- Change colours: edit the CSS variables at the top of `style.css`.
- Replace the illustrative portfolio previews with actual project screenshots when available.
- Google Fonts are loaded from Google Fonts; a system font fallback is available if offline.

## Publish online
Upload these three files (`index.html`, `style.css`, `script.js`) to your hosting provider's public web folder (often named `public_html`). If your domain is already connected to hosting, point the domain to that folder. Test WhatsApp and phone links after publishing.

## Notes
This is a static front-end website. It does not include a database, admin panel, server-side form delivery, or analytics. The project previews are CSS illustrations, not claims about completed client projects.


## Admin panel (banner management demo)
- Open `admin.html` in the same browser as the website.
- Upload a banner for each service and click **Save changes**.
- Return to `index.html` in the same browser to see saved banner selections.
- The panel saves to that browser's local storage only. It has no secure authentication, server/database storage, or multi-device publishing. For a real production admin panel, connect a backend (for example Firebase) and add secure admin authentication.

## Portfolio
The homepage includes a portfolio section for BECHO, VJ Finance, Aratis Organics, Indian Railway Simulation, Service Support and the RJ PRODUCTION website. These cards are project summaries/visual previews; update their descriptions and status as projects progress.


Logo display fix: the supplied RJ PRODUCTION logo is constrained to a compact responsive size in the header and footer, including on mobile screens. WhatsApp is configured as +91 82862 32467. Portfolio section and existing service/admin features are preserved.
