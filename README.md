# DriveNow — Car Rental Platform

DriveNow is a responsive, static car-rental website built with HTML, CSS, Bootstrap 5, and vanilla JavaScript. It continues the same project across its assignments. There is no backend: the booking and contact forms and the rental planner are demonstrations and do not send or save reservations.

## Pages

- `index.html` — home page, background color control, and three-step Quick Rental Planner.
- `cars.html` — car catalogue, category filters, and personal demo ratings.
- `booking.html` — booking form with client-side validation.
- `about.html` — team information, price table, car carousel, FAQ, and contact form popup.

## Project structure

```text
car-rental-platform/
├── index.html
├── cars.html
├── booking.html
├── about.html
├── css/
│   ├── style.css
│   └── assignment5.css
├── js/
│   ├── script.js
│   └── assignment5.js
├── images/
│   ├── audi1.webp
│   ├── bmw.webp
│   ├── camry.webp
│   ├── gls.jpeg
│   ├── hero-car.jpeg
│   ├── k8.webp
│   ├── luxury_car.jpg
│   ├── mercedes.webp
│   ├── premium_sedan.jpg
│   ├── student1.jpg
│   └── student2.jpg
├── .gitignore
└── README.md
```

## Features

- Responsive navigation, including a Bootstrap offcanvas menu, and a car-image carousel.
- Car catalogue with filtering for All, Comfort, Business, Premium, and Luxury.
- Five-star personal demo rating for each car; these are not customer reviews.
- Quick Rental Planner with car selection, rental dates, validation, and a review step. It does not create a real reservation.
- Keyboard arrow navigation between focused menu links.
- Short, user-triggered notification sounds with a mute control.
- Booking form validation, FAQ accordion, contact form popup, background color changer, and live date and time.
- CSS transitions and animations that respect reduced-motion preferences.

## JavaScript and CSS files

- `js/script.js` — booking and contact form validation, FAQ accordion, contact popup, background color changer, and live clock.
- `js/assignment5.js` — car data, category filtering, ratings, menu keyboard navigation, notification sound, and rental planner.
- `css/style.css` — shared website styles.
- `css/assignment5.css` — Assignment 5 component styles, responsive rules, and animations.

## Run locally

Open `index.html` in a browser or serve the project folder with a static-file server. Bootstrap is loaded from jsDelivr, so an internet connection is needed for Bootstrap styles and components. Project images, CSS, and JavaScript use relative paths.

## Team

- **Team Name:** DriveNow Team
- **Group:** SE-2501
- **Team Members:** Amangeldi Sherkhan, Bekzat Abilkhaev
- **Website:** <https://sherkhan017.github.io/car-rental-platform/>
