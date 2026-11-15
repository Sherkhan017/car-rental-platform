# DriveNow Final Project | Team Presentation Guide

**Suggested length:** 4–5 minutes (adjust to the teacher's exact time limit).  
**Presenters:** Amangeldi Sherkhan and Bekzat Abilkhaev (agree on who presents each section).

## 1. Intro / purpose (30 seconds)

“Good afternoon. This is DriveNow, our responsive car-rental website. The purpose is to help visitors find suitable cars, compare vehicles and make a demo booking. We continued our existing project and expanded it from four pages to ten connected pages.”

## 2. Design and responsiveness (45 seconds)

“DriveNow uses a premium black-and-gold design with consistent typography, clear price hierarchy and SVG icons. The main menu remains simple while account features live in the sidebar. The theme toggle is on the right. Dark or light mode and English, Kazakh or Russian preferences persist across pages. The layout adapts to laptop, tablet and phone screens.”

**Live demonstration:** switch theme, change language, briefly narrow browser width.

## 3. Catalogue and personalization (45 seconds)

“The catalogue contains 20 demonstration vehicles and offers dynamic search, brand, category, maximum price and sorting filters. Users can save favorites, compare up to two vehicles side by side and open full vehicle details with customer reviews.”

**Live demonstration:** search Toyota, filter category, save a car or compare two.

## 4. Authentication and booking (70 seconds)

“Guests can explore every car, but when they select Rent Now, DriveNow prompts them to log in or create a demo account. Registration and login use localStorage because the project has no backend. The chosen car is preserved after login. The booking form is shorter, validates contact information and dates with JavaScript, and calculates the estimated rental cost. My Bookings displays each request and supports cancellation.”

**Live demonstration:** invalid form errors → sign up with test credentials → rent a car → see My Bookings.

## 5. API and JavaScript (50 seconds)

“On the booking page, a map uses OpenStreetMap with the Nominatim public geocoding API. Clicking Find on Map sends a fetch request, displays a loading state, and places a marker when a place is found. Errors are handled visibly. We deliberately avoid automatic searches to respect usage rules. Other interactive features include theme persistence, filters, form feedback and reviews.”

**Live demonstration:** search a general city-center place on the map while online; show loading and result or error handling.

## 6. Code quality and closing (30 seconds)

“Our project uses ten HTML files, one shared responsive stylesheet, a car data file, localization data and a main JavaScript application. GitHub hosts the static website. DriveNow is an educational simulation; it does not process real rentals or passwords securely. Thank you.”

## Before the presentation

- Verify the exact live URL after deploying new code to GitHub Pages.
- Use TEST ONLY credentials such as `demo@example.com` and a unique fake password.
- Pre-test the map on the presentation network, but be prepared to explain its error state if the public API is unavailable.
- Agree on the speaking order and rehearse within the allotted time.
