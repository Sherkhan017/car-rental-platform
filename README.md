# DriveNow - Car Rental Platform (Final Project)

A simple, responsive, six-page car-rental demonstration built from our original blue-and-white DriveNow. This is a student front-end project with **no backend** and **no real reservations or payments**.

**Team:** DriveNow Team | **Group:** SE-2501  
**Members:** Amangeldi Sherkhan, Bekzat Abilkhaev

- **Repository:** https://github.com/Sherkhan017/car-rental-platform
- **GitHub Pages:** https://sherkhan017.github.io/car-rental-platform/

## Six connected pages

| Page | Purpose |
|---|---|
| `index.html` | Home, featured cars, 3-step rental planner |
| `cars.html` | Six local-photo car listings; live name/category search, filters, ratings |
| `booking.html` | Account-gated booking form; OpenStreetMap location search |
| `about.html` | Project, team, pricing, carousel, FAQ, contact form |
| `login.html` | Sign Up and Log In; friendly inline JavaScript validation |
| `profile.html` | Stored account information, booking history and cancellation |

All six pages share the same blue/white design, responsive Bootstrap 5.3.6 grid, custom CSS, local jQuery 3.7.1, navigation and persistent Light/Dark switch.

## Functionality and grading criteria

- **Responsive:** mobile sidebar, grid/card layout and readable forms at phone, tablet and desktop sizes.
- **Hosting:** static pages deploy from `main` / repository root on GitHub Pages.
- **Theme:** toggle saved under localStorage key `drivenow-theme`; applies across all pages.
- **Login:** Sign Up saves name, email and a **demo password** locally; Log In checks credentials and sends normal login to Profile. A user selecting Book first logs in, then returns to Booking with their selected car.
- **Validation:** `novalidate` forms and JavaScript checks for required fields, email, password complexity, KZ phone number and rental dates. Errors are rendered under each field, not only in alerts.
- **Live search:** filters six cars; category buttons, ratings, selection controls and planner work.
- **Animations:** button hover, cards, theme toggle, counter, loading state and carousel.
- **Public API:** on-demand `fetch()` to OpenStreetMap Nominatim for pick-up locations; loading/error messages and an embedded OpenStreetMap result; search is optional.
- **Code organization:** `/css`, `/js`, `/images`, `/vendor`; shared responsibilities separated from task-specific scripts.

## Demo walkthrough

1. Start on Home and open Cars. Search for BMW, switch a category and rate a car.
2. Click **Book this car**. Guests are sent to Login with their selected car preserved.
3. Sign up with *demo-only* details and a sample password such as `DemoPass1!`. Log in.
4. Choose a phone number and future rental dates; submit the demo booking.
5. Open Profile to see the saved request, then cancel it to show the status update.
6. Switch to Dark Mode and navigate between pages to show persistence.
7. Enter `Astana, Kazakhstan` under Pick-up Location, press Find and show API data / embedded map.
8. Demonstrate the mobile menu using browser device emulation.

## Important security notice

This is **not real authentication**. The coursework explicitly requires a localStorage simulation, so demonstration passwords are stored in this browser in readable form. **Never reuse a personal password or enter sensitive data.** Bookings are not transmitted or confirmed by any rental agency.

## Third-party resources

Bootstrap and jQuery files are stored under `vendor/` to avoid CDN dependency. Their license links and notices are documented in `vendor/THIRD_PARTY_LICENSES.md`. Vehicle photos are stored under `images/`; photo credit notes are in `IMAGE_CREDITS.md`.

## Running and publishing

Open `index.html` locally, or serve the folder with `python -m http.server 8000` from this directory. For best results, use `http://localhost:8000/` because localStorage may be restricted on `file://`.

In GitHub Settings -> Pages, select Deploy from a branch -> `main` -> `/(root)` and visit the public URL. Open all six pages and test the external API on the actual hosted site. The public Nominatim endpoint depends on internet connectivity and rate limits.

## Deliverables / quality assurance

- `DriveNow_SE2501_FinalProject.zip` - the complete site
- `DriveNow_SE2501_Report.pdf` - project title/team, goal, division of work, page descriptions and screenshots
- `DriveNow_SE2501_Links.txt` - repository and live website links
- `QA_REPORT.md` - static and interaction checks with limitations
- `PRESENTATION_NOTES.md` - a five-minute speaking/demo outline

**Warning:** the course presentation PDF says the report must be **PDF**, although one example filename ends with `.docx`; the PDF-format requirement is followed here.
