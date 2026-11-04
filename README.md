# DriveNow — Car Rental Platform

DriveNow is our car rental website for Front-End Development. We started with HTML and CSS and continued the same project through Assignments 1–6.

**Team:** DriveNow Team  
**Group:** SE-2501  
**Members:** Amangeldi Sherkhan, Bekzat Abilkhaev

**Website:** https://sherkhan017.github.io/car-rental-platform/

## Pages

- `index.html` — home page, car information, statistics and Quick Rental Planner.
- `cars.html` — car catalogue, search, category filters, ratings and copy button.
- `booking.html` — booking request form with JavaScript validation and loading spinner.
- `about.html` — team, price table, image carousel, FAQ and contact form.

## Project files

```text
car-rental-platform/
├── index.html
├── cars.html
├── booking.html
├── about.html
├── css/
│   ├── style.css
│   ├── assignment5.css
│   └── assignment6.css
├── js/
│   ├── script.js
│   ├── assignment5.js
│   └── assignment6.js
├── images/
└── README.md
```

## Assignment 6 — jQuery

- Real-time car search by name or category.
- Autocomplete suggestions and highlighted search terms.
- Scroll progress bar and animated statistics.
- Loading spinner during the booking form demo.
- Toast notifications and copy selected-car information.
- Lazy loading for images, including carousel slides.
- Dark/Light toggle at the left of the navigation bar. The choice is saved in the browser.
- Left and right arrow keys switch pages when not typing or using an interactive component. Up and down arrows move focus between focused menu links.

The website also keeps the previous assignments' features: Bootstrap navigation and carousel, booking validation, FAQ, contact popup, live clock, background color control, car ratings and rental planner.

## Running the project

Open `index.html` in a browser. The site uses Bootstrap 5 and jQuery 4 from CDNs, so it needs an internet connection to load those libraries. HTML, CSS, JavaScript and images use relative paths for GitHub Pages.

This is a front-end demonstration. No real bookings or messages are sent to a server.

## Extended catalogue

The Car Finder contains 20 demo cars, with five models in each category (Comfort, Business, Premium, and Luxury). The search, car ratings, booking form and rental planner use the same car list. New photos are free-license Wikimedia Commons images served as remote thumbnails, with additional fallbacks for selected models. See [IMAGE_CREDITS.md](IMAGE_CREDITS.md) for the photo sources and licenses.

An internet connection is needed to display the new remotely hosted car photos. Rental prices are illustrative student-project data, not real-time offers.
