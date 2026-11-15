# DriveNow Final Project — Simple Edition
DriveNow is a responsive 6-page car-rental website based on our original blue-and-white coursework project, not the Luxury redesign.

**Team:** DriveNow Team
**Group:** SE-2501
**Members:** Amangeldi Sherkhan, Bekzat Abilkhaev

**Live website:** https://sherkhan017.github.io/car-rental-platform/
**Repository:** https://github.com/Sherkhan017/car-rental-platform

## Pages
- index.html: Home, car cards and rental planner
- cars.html: catalogue, search and filters
- booking.html: short rental form, login gate and OpenStreetMap location search
- about.html: team, FAQ, gallery and contact form
- login.html: Login and Sign Up in the same page
- profile.html: saved user details and demo booking requests

## Final requirements
- Responsive Bootstrap grid and existing mobile sidebar.
- GitHub Pages hosting from main branch root.
- Light/Dark toggle persisted with localStorage key "drivenow-theme".
- Consistent original design and car-related imagery.
- Signup stores name, email and password in localStorage; Login checks them and redirects to Profile (or returns to requested booking).
- On-page JavaScript validation for email, password complexity, required inputs, phone format and booking dates; all forms use novalidate.
- Live search/filter of cars from the existing catalogue.
- Hover animations, scroll stats and existing JS features.
- External OpenStreetMap Nominatim API via fetch() on user-triggered map search, with loading and error states.
- Organized CSS, JavaScript and images directories.

## Demonstration
1. Browse Cars without logging in.
2. Choose Rent Now; login is required.
3. Sign Up using a **test password** (8+ characters, uppercase, lowercase, number and symbol).
4. Log In; it returns to your selected car in Booking.
5. Fill the short form and submit; Profile shows the saved demo request.
6. Try Light/Dark mode and the city search on Booking (example: Astana).
7. Verify 6 pages and mobile layout on the live GitHub Pages link.

**Security:** This is a frontend-only classroom simulation and is NOT a real secure login or actual booking system. Do not use real passwords or sensitive information.

**Deployment:** Settings > Pages > Deploy from a branch > main > /(root). Check the live website after deployment.
