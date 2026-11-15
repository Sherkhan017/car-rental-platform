# DriveNow Luxury Edition | Final Project

**Live website (after deploying the updated files):** https://sherkhan017.github.io/car-rental-platform/  
**Repository:** https://github.com/Sherkhan017/car-rental-platform  
**University project:** Front-End Development, Astana IT University, SE-2501  
**Team members (from the original project):** Amangeldi Sherkhan and Bekzat Abilkhaev

> This ZIP is a locally prepared final-project candidate. The original GitHub repository and current GitHub Pages deployment have **not** been updated by preparing this ZIP. The URL above points to the repository's existing Pages site until you deploy these files.

## Features

- **10 connected HTML pages:** `index.html`, `cars.html`, `car-details.html`, `booking.html`, `login.html`, `profile.html`, `my-bookings.html`, `compare.html`, `settings.html`, `about.html`.
- **Luxury redesign** with warm-gold/black visuals, responsive navigation, desktop/tablet/mobile layouts and tasteful transitions.
- **Right-aligned light/dark theme toggle** on every page; preference saved in `localStorage`.
- **Three languages:** English, қазақша, русский; language saved across pages.
- **New sidebar:** Profile, My Bookings, Compare, Favorites, Settings, Contact and language selection. Main navigation remains Home, Cars, Booking, About in the header.
- **20 demo cars** inherited from the previous DriveNow project, including image credits and local image fallbacks.
- **Real-time search, brand/category/price filters, sorting**, with saved filter selections.
- **Vehicle details** with specs and browser-local reviews (login required to post), and **Favorites** associated with the active demo account.
- **Car comparison** with up to two vehicles.
- **Sign Up and Log In** backed by `localStorage`; guest users can browse, but booking requires signing in. After a normal login, users land on Profile; when starting a booking, they return to the selected vehicle's booking flow.
- **Reduced booking form:** name and email prefilled from account; phone, car, pickup/return dates, pickup city, optional area and notes. Price updates automatically; requests saved in My Bookings with cancellation.
- **Custom JavaScript form validation** with inline error messages, no native required/pattern/minlength/max/min/type=email validation. All HTML forms have `novalidate`.
- **OpenStreetMap map + public Nominatim Search API** for optional pickup-area lookup. Searches occur *only* when the user presses the lookup button, never as autocomplete. `fetch()` has visible loading/error/empty states, in-browser caching, a short client-side throttle, OpenStreetMap attribution and a fallback if Leaflet is unavailable. No API key is required.
- **Contact form demo** with custom JS validation and clear "not sent" status.

## Project files

```
car-rental-platform/
├── index.html
├── cars.html
├── car-details.html
├── booking.html
├── login.html
├── profile.html
├── my-bookings.html
├── compare.html
├── settings.html
├── about.html
├── css/
│   └── style.css
├── js/
│   ├── data.js       # Cars imported from the original project's Assignment 5 code
│   ├── i18n.js       # UI translations
│   └── app.js        # Shared UI, routing, state, validation, map
├── images/
│   └── ...
├── IMAGE_CREDITS.md
├── PRESENTATION_GUIDE.md
└── README.md
```

## Run locally

Recommended: open this folder in VS Code and install/use **Live Server**, or run:

```bash
python -m http.server 5500
```

Open `http://localhost:5500/index.html`. Opening as `file://` may block external API calls; a local server or GitHub Pages is preferable. This is **vanilla HTML/CSS/JavaScript**, with Leaflet only for the map. No package installation, build step, backend, Bootstrap or jQuery is required.

## GitHub Pages deployment

**Option A: GitHub web UI**
1. Download this final-project ZIP and extract it.
2. In your repository, replace the four original HTML pages with the updated versions; also upload the six new HTML pages, `css/style.css`, `js/app.js`, `js/i18n.js`, `js/data.js`, `images/logo.svg`, `README.md`, `PRESENTATION_GUIDE.md` and any images that are missing. You can remove unused old scripts/styles after confirming your new pages no longer reference them.
3. Commit the changes to the repository's `main` branch (if your team agrees).
4. Open **Settings → Pages**, choose **Deploy from a branch → main → / (root)**, save.
5. Visit https://sherkhan017.github.io/car-rental-platform/ and test all ten links, dark mode, languages, search, login, booking and map.

**Option B: Git command line** (from a clone of the existing repository):

```bash
# Copy the CONTENTS of this ZIP into your repository root first.
git add -A
git commit -m "Build DriveNow final luxury edition"
git push origin main
```

Do not nest `DriveNow-Luxury-Final/` inside the existing repository: `index.html` must remain at the repository root for GitHub Pages. Avoid overwriting teammates' uncommitted changes. Check `git status` and merge/pull first.

## Test checklist

- [ ] At 390px mobile, 768px tablet and 1366px desktop, no horizontal scroll or overlapping cards.
- [ ] Light/dark theme stays selected when navigating between pages and refreshing.
- [ ] Language changes update all page headings, controls, messages and navigation.
- [ ] Catalogue filters combine correctly; reset clears them.
- [ ] Compare up to two cars; a third choice is rejected with an explanatory toast.
- [ ] Guest Rent Now → login/signup → returns to Booking with the correct car.
- [ ] Sign Up rejects invalid emails, weak passwords and mismatched passwords; Login rejects incorrect credentials.
- [ ] Profile shows saved name and email; favorites can be added/removed.
- [ ] Booking rejects empty/invalid phone, past dates and an invalid return date; saves a demo request and computes the total.
- [ ] My Bookings shows the request; Cancel Request updates its status.
- [ ] Review form rejects short review or missing rating; saved reviews show on the details page.
- [ ] Maps: enter a pickup area, press Find on Map, see loading then marker or explicit error message.
- [ ] Contact form shows inline errors and a demo-success message.
- [ ] All ten pages load via their GitHub Pages URLs; repository and live links are included in submission.

## Security & API limitations

This is intentionally **not real authentication**. Passwords are stored in browser `localStorage` because the coursework explicitly requests a backend-free authentication simulation. Do not register with a real password or sensitive personal information. Other users of the same browser/device may inspect demo data. No real bookings are submitted, no money is charged, and no emails are sent. Before a production launch, authentication, reservations, payments and sensitive data must move to a secure backend.

Nominatim / OpenStreetMap are independent third-party services. The map requires an internet connection and may be rate limited or temporarily unavailable. **No address lookup is sent while the user types**. This demo sends only an explicit place-name query and may not represent any real rental branch. API policy: https://operations.osmfoundation.org/policies/nominatim/ ; map and attribution: https://www.openstreetmap.org/copyright ; Leaflet: https://leafletjs.com/ . Vehicle images and rental rates are illustrative; see `IMAGE_CREDITS.md` for third-party assets.
