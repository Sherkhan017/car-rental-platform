# DriveNow — Car Rental Platform

Student front-end project for a six-page car-rental demo. It uses browser storage only; it has no backend and does not create real reservations or payments.

**Team:** DriveNow Team · **Group:** SE-2501

**Members:** Amangeldi Sherkhan, Bekzat Abilkhaev

- [GitHub repository](https://github.com/Sherkhan017/car-rental-platform)
- [Live demo](https://sherkhan017.github.io/car-rental-platform/)

## Pages

| Page | Features |
|---|---|
| `index.html` | Home, featured cars, quick rental planner |
| `cars.html` | 20-car catalogue, search, filters and ratings |
| `booking.html` | Demo booking form and OpenStreetMap location search |
| `about.html` | Project and team information, FAQ and contact form |
| `login.html` | Demo sign-up and login |
| `profile.html` | Account details and saved demo requests |

## Run locally

Open `index.html`, or run `python -m http.server 8000` from the project directory and visit `http://localhost:8000/`.

The site can be published with GitHub Pages from the `main` branch and repository root. OpenStreetMap search requires an internet connection and may be rate-limited.

## Notes

- Demo accounts, preferences and booking requests are stored in browser `localStorage`. Passwords are stored in readable form; never use a real password or sensitive information.
- Vehicle photos are representative examples, not actual rental inventory. Photographer credits, sources and licenses are listed in [`IMAGE_CREDITS.md`](IMAGE_CREDITS.md).
- Bootstrap and jQuery are included under `vendor/`; both are distributed under the [MIT License](https://opensource.org/license/mit/). Their license notices are retained in the vendor files.
