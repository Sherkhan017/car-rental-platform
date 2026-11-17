# DriveNow Final Project — QA Verification (17 November 2026)

## Fixes in this commit
- Replaced the effects-free jQuery 3.7.1 custom build with the **official full jQuery 3.7.1 build**. The live statistics counter and toast notifications now use working `.animate()`, `.stop()`, `.fadeIn()`, and `.fadeOut()`.
- Added 7-day bounded cache (15 queries maximum) to on-demand Nominatim location search; repeated queries reuse local results rather than hitting the public API again.
- Added an OpenStreetMap direct link under the embedded map as a fallback if iframe tiles cannot load.
- Preserved the existing blue-white six-page UI; removed stray `</link>` HTML closing tags.
- Did not add unnecessary pages or luxury features.

## Automated checks completed
- **48/48 focused browser regression checks:** 6 pages at 320px, 390px, 768px and 1366px; six Dark Mode appearance changes + stored preferences; mobile sidebar; counters; toast appearance/fade; Maps mocked successful response, map frame and fallback link, cached repeat query, failure message.
- **21/21 earlier scenario checks:** Sign Up/Log In/Profile, email/password/phone/required validation, booking persistence, search/empty state, contact form, theme persistence, and map success/failure with stubbed HTTP responses.
- **Static audit:** 6 pages; no missing local link/image/script/style targets; all forms use `novalidate`; no forbidden native validation attributes; JS syntax checks pass.

## Production limitations and verification
The browser execution environment blocks navigation to HTTP/HTTPS even for localhost; it cannot execute the real hosted journey end-to-end. Geocoding HTTP responses were stubbed in automated tests; the **live Nominatim endpoint and GitHub Pages UI require a human live-browser smoke test**. The site is hosted using GitHub Pages, but deployment success does not guarantee third-party API availability.

### Final real-browser smoke checklist
1. Open https://sherkhan017.github.io/car-rental-platform/ and visit all six pages.
2. Toggle Dark Mode on Home, then check that Cars, About, Login and Profile retain it.
3. Visit Cars and confirm search, category filters, rating, copy-to-clipboard toast and booking link.
4. Sign Up with disposable demo credentials, Log In, then submit a sample rental booking, check it on Profile and cancel the request.
5. In Booking, type `Astana, Kazakhstan`, press Find, check coordinates/result map; repeat to verify cache; test a nonexistent location for a friendly error.
6. Repeat key actions at phone/tablet sizes and inspect browser console for errors.

### Third-party service notes
Nominatim search is only triggered explicitly on Find, is throttled to >1.2 seconds between requests in a tab, and repeats are cached. The public service imposes 1 request/second **across the whole app**, so this free endpoint is appropriate only for the low-traffic class demo. It can rate-limit or fail externally. Attribution appears in Booking. See https://operations.osmfoundation.org/policies/nominatim/.

### Security
This is front-end-only coursework. Test accounts and booking requests live in the user's own browser localStorage; credentials are not secure for real-world use. No genuine passwords or personal booking details should be used.

## Account sidebar and balanced catalogue update (17 November 2026)

- Account/preferences sidebar opens on desktop and mobile, and contains **Profile, Login for guests, Dark Mode, background color, Sound On/Off and expandable Settings**. The main navbar retains **Home, Cars, Booking, About and guest Login**; Profile and theme were removed from the top navbar. Settings can reset stored preferences or test the demo sound.
- The catalogue now contains **20 demo vehicles**: exactly **5 Comfort, 5 Business, 5 Premium, 5 Luxury**. Booking and the homepage rental planner draw options from the same catalogue; About's price table has been reconciled to those vehicles/prices.
- Six existing photo listings retain their local image assets. The remaining fourteen have labeled **local concept illustrations**, not misleading stock photos. Image paths and XML validity checked. Vehicle titles, descriptions, prices and ratings use clearer typography.
- Browser checks using inline-loaded project assets and a simulated localStorage backend: **24/24 page-size combinations** (6 HTML pages x 320/390/768/1366px) showed no horizontal overflow; no JavaScript runtime errors in the isolated tests. Each category filter showed exactly 5 results; sidebar opening, theme toggle, saved background change, Sound Off, Settings expansion and test-sound disabled state were exercised.
- **Limitations:** the automated browser environment blocks navigation to HTTP(S) and file URLs, so the booking page's top-of-document navigation guard was omitted only in the isolated test harness. Production navigation, live GitHub Pages asset loading and external Maps API still need a smoke test in an unrestricted browser. No guarantee of real booking inventory or external API uptime.
