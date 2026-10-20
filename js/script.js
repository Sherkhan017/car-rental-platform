// DriveNow - Assignment 4: Introduction to JavaScript
// Each feature works only on the pages where its HTML elements exist.

document.addEventListener("DOMContentLoaded", function () {
    const colors = ["#f7f8fa", "#e0f2fe", "#fef3c7", "#dcfce7", "#f3e8ff"];
    const colorNames = ["Original", "Light Blue", "Light Yellow", "Light Green", "Light Purple"];
    const backgroundStorageKey = "drivenow-page-background";
    const savedColor = localStorage.getItem(backgroundStorageKey);
    let colorIndex = colors.indexOf(savedColor);
    if (colorIndex < 0) colorIndex = 0;
    document.body.style.setProperty("--page-background", colors[colorIndex]);


    const clock = document.getElementById("liveDateTime");
    if (clock) {
        function updateClock() {
            const now = new Date();
            clock.textContent = now.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });
        }

        updateClock();
        setInterval(updateClock, 1000);
    }


    const colorButton = document.getElementById("changeColorBtn");
    const colorName = document.getElementById("colorName");
    if (colorButton && colorName) {
        colorName.textContent = "Current color: " + colorNames[colorIndex];
        colorButton.addEventListener("click", function () {
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.setProperty("--page-background", colors[colorIndex]);
            localStorage.setItem(backgroundStorageKey, colors[colorIndex]);
            colorName.textContent = "Current color: " + colorNames[colorIndex];
        });
    }


    const faqButtons = document.querySelectorAll(".faq-question");
    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const answer = document.getElementById(button.getAttribute("aria-controls"));
            const isOpen = button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isOpen));
            button.querySelector(".faq-symbol").textContent = isOpen ? "+" : "−";
            answer.style.maxHeight = isOpen ? "0px" : answer.scrollHeight + "px";
        });
    });

    const popup = document.getElementById("contactPopup");
    const openPopupButton = document.getElementById("openContactPopup");

    if (popup && openPopupButton) {
        const closePopupButton = document.getElementById("closeContactPopup");
        const contactForm = document.getElementById("contactForm");
        const contactStatus = document.getElementById("contactStatus");

        function openPopup() {
            popup.hidden = false;
            document.body.classList.add("popup-open");
            popup.querySelector("input").focus();
        }

        function closePopup() {
            popup.hidden = true;
            document.body.classList.remove("popup-open");
            openPopupButton.focus();
        }

        openPopupButton.addEventListener("click", openPopup);
        closePopupButton.addEventListener("click", closePopup);

        popup.addEventListener("click", function (event) {
            if (event.target === popup) {
                closePopup();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !popup.hidden) {
                closePopup();
            }
        });

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            contactStatus.textContent = "Form completed! This is a demo, so no message was sent.";
            contactStatus.className = "alert alert-success mt-3 mb-0";
            contactForm.reset();
        });
    }

    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        bookingForm.noValidate = true; // Show our own error messages instead of browser popups.

        function showError(input, message) {
            input.classList.add("is-invalid");

            const feedback = document.createElement("div");
            feedback.className = "js-error text-danger small mt-1";
            feedback.textContent = message;
            input.insertAdjacentElement("afterend", feedback);
        }

        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault(); // We do not have a backend server yet.

            bookingForm.querySelectorAll(".js-error").forEach(function (error) {
                error.remove();
            });
            bookingForm.querySelectorAll(".is-invalid").forEach(function (input) {
                input.classList.remove("is-invalid");
            });

            const status = document.getElementById("bookingStatus");
            status.textContent = "";
            status.className = "mt-3";

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const car = document.getElementById("car");
            const pickup = document.getElementById("pickup");
            const returnDate = document.getElementById("return");
            const password = document.getElementById("demoPassword");
            const confirmPassword = document.getElementById("confirmPassword");
            const payment = bookingForm.querySelector("input[name='payment']:checked");
            let firstInvalid = null;

            function check(input, isValid, message) {
                if (!isValid) {
                    showError(input, message);
                    if (!firstInvalid) firstInvalid = input;
                }
            }

            check(name, name.value.trim().length >= 2, "Please enter your full name.");
            check(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), "Please enter a valid email address.");
            check(car, car.value !== "", "Please select a car.");
            check(pickup, pickup.value !== "", "Please choose a pick-up date.");
            check(returnDate, returnDate.value !== "", "Please choose a return date.");

            if (pickup.value && returnDate.value) {
                check(returnDate, returnDate.value > pickup.value, "Return date must be after pick-up date.");
            }

            if (!payment) {
                const error = document.createElement("div");
                error.className = "js-error text-danger small";
                error.textContent = "Please select a payment method.";
                bookingForm.querySelector("fieldset").appendChild(error);
                if (!firstInvalid) firstInvalid = document.getElementById("paymentCard");
            }

            check(password, password.value.length >= 8, "Password must contain at least 8 characters.");
            check(confirmPassword,
                confirmPassword.value !== "" && confirmPassword.value === password.value,
                "Passwords must match.");

            if (firstInvalid) {
                status.textContent = "Please correct the highlighted fields.";
                status.className = "alert alert-danger mt-3";
                firstInvalid.focus();
            } else {
                status.textContent = "All fields are valid! This is a demo, so no booking request was sent.";
                status.className = "alert alert-success mt-3";
            }
        });
    }
});
