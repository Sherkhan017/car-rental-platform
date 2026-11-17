# DriveNow Final Project - QA and Criteria Report

**Test target:** six-page simple blue/white DriveNow site.  
**Test setup:** HTML/CSS/JS from this project, Chromium via Playwright, Node.js syntax checks, BeautifulSoup static checks, desktop/tablet/mobile viewports. Frontend libraries were inlined into a temporary isolated browser test document because direct URL navigation was blocked by the test container.  
**Important:** localStorage was emulated for cross-page browser tests; network API results were **mocked**. These checks are not a live GitHub Pages production run.

## Functional checks - 21/21 passed (isolated browser tests)

1. Sign Up required fields validation - PASS
2. Sign Up invalid email validation - PASS
3. Sign Up password complexity - PASS
4. Sign Up saves demo account - PASS
5. Incorrect login credentials rejected - PASS
6. Correct login saves session - PASS
7. Profile displays saved name - PASS
8. Profile displays saved email - PASS
9. Booking required field validation - PASS
10. Kazakhstan phone validation - PASS
11. Booking saved to demo localStorage - PASS
12. Location API response renders map (mocked HTTP) - PASS
13. Location API failure displays user-friendly message (mocked failure) - PASS
14. Live search filters car catalogue - PASS
15. No matches displays empty state - PASS
16. Contact form shows inline errors - PASS
17. Contact form successful validation - PASS
18. Dark Mode toggles - PASS
19. Theme preference saves - PASS
20. Theme preference persists across simulated pages - PASS
21. Mobile off-canvas navigation opens - PASS

### Additional checks

- Category filter Luxury: 1 relevant vehicle - PASS
- Rating star updates displayed rating - PASS
- Car selection shows selected vehicle - PASS
- Quick Rental Planner: step 1 -> 2 -> 3 -> success - PASS
- HTML: internal page/assets targets present; native validation attributes not used; all forms have `novalidate` - PASS
- JavaScript syntax (`node --check`) - PASS
- Responsive: no horizontal overflow in tested viewports 320, 390, 768 and 1366 px - PASS
- Main navbar highlights current page correctly - PASS
- Vehicle catalogue contains six images bundled locally, instead of unreliable third-party hotlinks - PASS

## Grading requirements (status before live final verification)

| Criterion | Evidence | Status |
|---|---|---|
| Responsive (10) | Bootstrap grid, mobile nav, 320/390/768/1366 viewports checked | Local PASS |
| Hosting (5) | GitHub repository and Pages URL supplied | Must verify public deployment |
| Light/Dark (5) | Persistent toggle on all six pages | Local PASS |
| Design & UX (20) | Consistent blue/white UI, local car photos, spacing, SVG feature icons | Local PASS; visual review subjective |
| JS (25) | Signup/login/profile; validation; search and filters | Local PASS |
| Animation (5) | Hover, card effects, planner, rating interaction | Local PASS |
| API (10) | Nominatim fetch, loading/error/map logic; HTTP mocked | Live API NOT verified |
| Cohesion (10) | All features support the rental journey | Reviewed |
| Presentation (5) | Five-minute notes provided | Actual presentation not yet performed |
| Code organization (5) | Six HTML pages, css/js/images/vendor folders | Static PASS |

## Remaining verification / limitations

1. Open GitHub Pages after the final commit and confirm the deployed version and six pages display without 404s.
2. Test **real** Nominatim API response using the live website and internet connectivity. External service availability/rate limits are out of project control.
3. Test the full redirect flow on actual HTTP/HTTPS origin. Container browser policy blocked URL navigation, so navigation code was inspected and the post-login/session behavior tested separately.
4. Open in mobile Safari/Firefox if available (only Chromium rendering was tested here).
5. Perform and rehearse a live 4:30-5:00 demonstration as a team. Submission and grading are separate actions.

### Security

This project deliberately stores sample passwords in localStorage **only for the coursework simulation**. It is not secure for a real service. Avoid genuine passwords or payment/customer data.
