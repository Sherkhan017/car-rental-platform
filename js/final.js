// Final Project additions: a lightweight frontend-only account and booking demo.
(function () {
    'use strict';
    const USERS = 'drivenow-users';
    const SESSION = 'drivenow-session';
    const BOOKINGS = 'drivenow-bookings';
    const MAP_CACHE = 'drivenow-location-cache';
    const el = (id) => document.getElementById(id);
    const load = (key, fallback) => {
        try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
        catch (error) { return fallback; }
    };
    const save = (key, value) => {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch (error) { return false; }
    };
    const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
    const passOk = (value) => value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
    const fullNameOk = (value) => (value.match(/\p{L}/gu) || []).length >= 2 && /^[\p{L}\s.'-]+$/u.test(value);
    const getSession = () => { try { return localStorage.getItem(SESSION) || ''; } catch (error) { return ''; } };
    const getUser = () => load(USERS, []).find((user) => user.email === getSession());

    function fieldError(id, message) {
        const input = el(id);
        const output = el(id + 'Error');
        if (output) output.textContent = message || '';
        if (input) {
            input.classList.toggle('is-invalid', Boolean(message));
            if (message) input.setAttribute('aria-invalid', 'true');
            else input.removeAttribute('aria-invalid');
        }
        return !message;
    }
    function checkField(id, condition, message) {
        return fieldError(id, condition ? '' : message);
    }
    function status(id, message, type) {
        const element = el(id);
        if (!element) return;
        element.textContent = message;
        element.className = message ? 'alert alert-' + type + ' mt-3' : 'mt-3';
    }

    // A guest may browse cars, but booking requires an account.
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-guest-link]').forEach((link) => { link.style.display = getUser() ? 'none' : ''; });
        if (el('loginForm')) initLogin();
        if (el('profileUser')) initProfile();
        if (el('finalBookingForm')) initBooking();
        if (el('findMap')) initMap();
        // Keep theme toggle operational when the optional jQuery CDN is unavailable.
        if (!window.jQuery) {
            let dark = false;
            try { dark = localStorage.getItem('drivenow-theme') === 'dark'; } catch (error) { /* storage blocked */ }
            const apply = () => {
                document.body.classList.toggle('dark-mode', dark);
                document.querySelectorAll('.theme-toggle').forEach((b) => { b.setAttribute('aria-pressed', String(dark)); b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); });
            };
            apply();
            document.querySelectorAll('.theme-toggle').forEach((b) => b.addEventListener('click', () => {
                dark = !dark; apply();
                try { localStorage.setItem('drivenow-theme', dark ? 'dark' : 'light'); } catch (error) { /* storage blocked */ }
            }));
        }
    });

    function initLogin() {
        const loginForm = el('loginForm');
        const signupForm = el('signupForm');
        const showLogin = el('showLogin');
        const showSignup = el('showSignup');
        function choose(signup) {
            loginForm.hidden = signup;
            signupForm.hidden = !signup;
            showLogin.className = signup ? 'btn btn-outline-primary' : 'btn btn-primary';
            showSignup.className = signup ? 'btn btn-primary' : 'btn btn-outline-primary';
        }
        showLogin.addEventListener('click', () => choose(false));
        showSignup.addEventListener('click', () => choose(true));
        if (new URLSearchParams(window.location.search).get('mode') === 'signup') choose(true);
        [loginForm, signupForm].forEach((form) => form.addEventListener('input', (event) => {
            const id = event.target.id;
            if (id) fieldError(id, '');
        }));

        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = el('signupName').value.trim();
            const email = el('signupEmail').value.trim().toLowerCase();
            const password = el('signupPassword').value;
            let valid = checkField('signupName', fullNameOk(name), 'Enter your full name (at least 2 letters).');
            valid = checkField('signupEmail', emailOk(email), 'Enter a valid email address.') && valid;
            valid = checkField('signupPassword', passOk(password), 'Use 8+ characters, uppercase, lowercase, number and symbol.') && valid;
            if (!valid) { status('signupStatus', 'Please correct the highlighted fields.', 'danger'); return; }
            const users = load(USERS, []);
            if (users.some((user) => user.email === email)) {
                fieldError('signupEmail', 'This email is already registered. Log in instead.');
                status('signupStatus', 'An account with this email already exists.', 'danger');
                return;
            }
            users.push({ name, email, password }); // Demo only: never use actual passwords here.
            if (!save(USERS, users)) { status('signupStatus', 'Browser storage is unavailable. Try another browser.', 'danger'); return; }
            el('loginEmail').value = email;
            el('loginPassword').value = '';
            signupForm.reset();
            choose(false);
            status('loginStatus', 'Account created. Enter your password to log in.', 'success');
        });

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = el('loginEmail').value.trim().toLowerCase();
            const password = el('loginPassword').value;
            let valid = checkField('loginEmail', emailOk(email), 'Enter a valid email address.');
            valid = checkField('loginPassword', passOk(password), 'Enter the password you registered with (8+ characters and a symbol, number, upper/lowercase).') && valid;
            if (!valid) { status('loginStatus', 'Please correct the highlighted fields.', 'danger'); return; }
            const user = load(USERS, []).find((u) => u.email === email && u.password === password);
            if (!user) { status('loginStatus', 'Incorrect email or password.', 'danger'); return; }
            try { localStorage.setItem(SESSION, user.email); }
            catch (error) { status('loginStatus', 'Browser storage is unavailable.', 'danger'); return; }
            const next = new URLSearchParams(location.search).get('next');
            const destination = next && /^booking\.html(?:\?[^#]*)?$/.test(next) ? next : 'profile.html';
            window.location.assign(destination);
        });
    }

    function initProfile() {
        const user = getUser();
        el('profileGuest').hidden = Boolean(user);
        el('profileUser').hidden = !user;
        if (!user) return;
        el('profileName').textContent = user.name;
        el('profileEmail').textContent = user.email;
        el('logoutButton').addEventListener('click', () => {
            try { localStorage.removeItem(SESSION); } catch (error) { /* no session persisted */ }
            window.location.assign('index.html');
        });
        renderBookings(user.email);
    }

    function renderBookings(email) {
        const element = el('myBookings');
        element.replaceChildren();
        const bookings = load(BOOKINGS, []).filter((b) => b.email === email);
        if (!bookings.length) {
            const message = document.createElement('p');
            message.className = 'text-secondary';
            message.textContent = 'No booking requests yet.';
            element.append(message);
            return;
        }
        bookings.slice().reverse().forEach((b) => {
            const row = document.createElement('div');
            row.className = 'border-bottom py-2';
            const heading = document.createElement('strong');
            heading.textContent = b.car;
            const dates = document.createElement('p');
            dates.className = 'mb-2 small';
            dates.textContent = b.start + ' → ' + b.end + ' · ' + b.status;
            row.append(heading, dates);
            if (b.status !== 'Cancelled') {
                const cancel = document.createElement('button');
                cancel.type = 'button';
                cancel.className = 'btn btn-sm btn-outline-danger';
                cancel.textContent = 'Cancel request';
                cancel.addEventListener('click', () => {
                    const list = load(BOOKINGS, []);
                    const item = list.find((entry) => entry.id === b.id && entry.email === email);
                    if (item) item.status = 'Cancelled';
                    save(BOOKINGS, list);
                    renderBookings(email);
                });
                row.append(cancel);
            }
            element.append(row);
        });
    }

    function initBooking() {
        const user = getUser();
        if (!user) {
            window.location.replace('login.html?next=' + encodeURIComponent('booking.html' + location.search));
            return;
        }
        el('bookingName').value = user.name;
        el('bookingEmail').value = user.email;
        const requestedCar = new URLSearchParams(location.search).get('car');
        if (requestedCar && [...el('car').options].some((opt) => opt.value === requestedCar)) el('car').value = requestedCar;
        const form = el('finalBookingForm');
        form.addEventListener('input', (e) => { if (e.target.id) fieldError(e.target.id, ''); });
        form.addEventListener('change', (e) => { if (e.target.id) fieldError(e.target.id, ''); });
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = el('bookingName').value.trim();
            const email = el('bookingEmail').value.trim().toLowerCase();
            const phone = el('bookingPhone').value.replace(/\D/g, '');
            const start = el('bookingStart').value;
            const end = el('bookingEnd').value;
            const now = new Date();
            const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
            let valid = checkField('bookingName', fullNameOk(name), 'Enter a full name (2+ letters).');
            valid = checkField('bookingEmail', emailOk(email) && email === user.email, 'Use your account email address.') && valid;
            valid = checkField('bookingPhone', (/^7\d{9}$/.test(phone) || /^77\d{9}$/.test(phone)), 'Enter a Kazakhstan phone number: 10 digits after +7.') && valid;
            valid = checkField('car', el('car').value !== '', 'Select a car.') && valid;
            valid = checkField('bookingStart', start !== '' && start >= today, 'Choose a pick-up date today or later.') && valid;
            valid = checkField('bookingEnd', end !== '' && end > start, 'Return date must be later than pick-up date.') && valid;
            if (!valid) { status('finalBookingStatus', 'Please correct the highlighted fields.', 'danger'); return; }
            const bookings = load(BOOKINGS, []);
            bookings.push({ id: 'B' + Date.now(), email, name, phone, car: el('car').selectedOptions[0].textContent.trim(), start, end, status: 'Demo request' });
            if (!save(BOOKINGS, bookings)) { status('finalBookingStatus', 'Could not save the request. Browser storage is unavailable.', 'danger'); return; }
            status('finalBookingStatus', 'Request saved in this browser! View it in your Profile. This is not a real reservation.', 'success');
        });
    }

    function initMap() {
        let lastRequestAt = 0;
        el('findMap').addEventListener('click', async function () {
            const locationQuery = el('pickupPlace').value.trim();
            const map = el('mapResult');
            if (locationQuery.length < 3) { el('mapStatus').textContent = 'Enter a city or location (at least 3 letters).'; return; }
            if (Date.now() - lastRequestAt < 1200) { el('mapStatus').textContent = 'Wait a moment before searching again.'; return; }
            lastRequestAt = Date.now();
            el('mapStatus').textContent = 'Finding location...';
            map.replaceChildren();
            el('findMap').disabled = true;
            try {
                // Only search on explicit click. Reuse recent results to respect Nominatim's
                // public-service rate limits and keep repeated student demos reliable.
                const cacheKey = locationQuery.toLowerCase();
                const cached = load(MAP_CACHE, {});
                let result;
                if (cached[cacheKey] && Date.now() - cached[cacheKey].savedAt < 7 * 24 * 60 * 60 * 1000) {
                    result = cached[cacheKey].items;
                } else {
                    const controller = new AbortController();
                    const timeout = setTimeout(() => controller.abort(), 8500);
                    let response;
                    try {
                        response = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(locationQuery), {
                            signal: controller.signal,
                            referrerPolicy: 'strict-origin-when-cross-origin'
                        });
                    } finally { clearTimeout(timeout); }
                    if (!response.ok) throw new Error('Map service error (' + response.status + ')');
                    result = await response.json();
                    if (!Array.isArray(result)) throw new Error('Unexpected map response');
                    const updated = { ...cached, [cacheKey]: { savedAt: Date.now(), items: result } };
                    // Bound cache size to avoid filling localStorage with searches.
                    const entries = Object.entries(updated).sort((a, b) => b[1].savedAt - a[1].savedAt).slice(0, 15);
                    save(MAP_CACHE, Object.fromEntries(entries));
                }
                if (!Array.isArray(result) || !result.length) { el('mapStatus').textContent = 'Location not found. Try a larger city name.'; return; }
                const latitude = Number(result[0].lat);
                const longitude = Number(result[0].lon);
                if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Invalid coordinates');
                const zoom = 0.02;
                const bbox = [longitude - zoom, latitude - zoom, longitude + zoom, latitude + zoom].join(',');
                const frame = document.createElement('iframe');
                frame.title = 'OpenStreetMap location';
                frame.loading = 'lazy';
                frame.referrerPolicy = 'strict-origin-when-cross-origin';
                frame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + encodeURIComponent(bbox) + '&layer=mapnik&marker=' + encodeURIComponent(latitude + ',' + longitude);
                map.append(frame);
                const directLink = document.createElement('a');
                directLink.href = 'https://www.openstreetmap.org/?mlat=' + encodeURIComponent(latitude) + '&mlon=' + encodeURIComponent(longitude) + '#map=14/' + latitude + '/' + longitude;
                directLink.target = '_blank';
                directLink.rel = 'noopener noreferrer';
                directLink.className = 'd-inline-block mt-2';
                directLink.textContent = 'Open location in OpenStreetMap';
                map.append(directLink);
                el('mapStatus').textContent = result[0].display_name || locationQuery;
            } catch (error) {
                el('mapStatus').textContent = 'Map search is unavailable right now. Check your internet connection and try again.';
            } finally { el('findMap').disabled = false; }
        });
    }
})();
