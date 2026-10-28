

document.addEventListener("DOMContentLoaded", function () {
    // Background color changer (Home page)
    const colors = ["#f7f8fa", "#e0f2fe", "#fef3c7", "#dcfce7", "#f3e8ff"];
    const colorNames = ["Original", "Light Blue", "Light Yellow", "Light Green", "Light Purple"];
    const storageKey = "drivenow-page-background";
    let savedColor = null;

    try {
        savedColor = localStorage.getItem(storageKey);
    } catch (error) {

    }

    let colorIndex = colors.indexOf(savedColor);
    if (colorIndex === -1) colorIndex = 0;
    document.body.style.setProperty("--page-background", colors[colorIndex]);

    const clock = document.getElementById("liveDateTime");
    if (clock) {
        function updateClock() {
            const now = new Date();
            clock.textContent = now.toLocaleString("en-US", {
                year: "numeric", month: "long", day: "numeric",
                hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true
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
            colorName.textContent = "Current color: " + colorNames[colorIndex];
            try {
                localStorage.setItem(storageKey, colors[colorIndex]);
            } catch (error) {
                // Color change still works without saving it.
            }
        });
    }


    const faqButtons = document.querySelectorAll(".faq-question");
    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const answer = document.getElementById(button.getAttribute("aria-controls"));
            if (!answer) return;
            const isOpen = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!isOpen));
            const symbol = button.querySelector(".faq-symbol");
            if (symbol) symbol.textContent = isOpen ? "+" : "−";
            answer.style.maxHeight = isOpen ? "0px" : answer.scrollHeight + "px";
        });
    });


    function isValidName(value) {
        const name = value.trim();
        // Letters (including Kazakh/Cyrillic) with spaces, apostrophes or hyphens.
        return name.length >= 2 && /^\p{L}+(?:[ '-]\p{L}+)*$/u.test(name);
    }

    function isValidEmail(value) {

        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(value.trim());
    }

    function showError(input, message) {
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");

        const feedback = document.createElement("div");
        feedback.className = "js-error text-danger small mt-1";
        feedback.id = input.id + "-error";
        feedback.textContent = message;
        input.setAttribute("aria-describedby", feedback.id);

        // Keep the phone input group layout intact.
        const placeAfter = input.closest(".input-group") || input;
        placeAfter.insertAdjacentElement("afterend", feedback);
    }

    function clearFieldError(input) {
        if (!input || !input.id) return;
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        if (input.getAttribute("aria-describedby") === input.id + "-error") {
            input.removeAttribute("aria-describedby");
        }
        const error = document.getElementById(input.id + "-error");
        if (error) error.remove();
    }

    function clearAllErrors(form) {
        form.querySelectorAll(".js-error").forEach(function (error) {
            error.remove();
        });
        form.querySelectorAll(".is-invalid").forEach(function (input) {
            input.classList.remove("is-invalid");
            input.removeAttribute("aria-invalid");
            if (input.getAttribute("aria-describedby") === input.id + "-error") {
                input.removeAttribute("aria-describedby");
            }
        });
    }

    function watchCorrections(form, status) {
        function onEdit(event) {
            const input = event.target;
            if (input.matches("input, select, textarea")) {
                clearFieldError(input);
                if (input.name === "payment") {
                    const paymentError = document.getElementById("payment-error");
                    if (paymentError) paymentError.remove();
                }
                if (status) {
                    status.textContent = "";
                    status.className = "mt-3";
                }
            }
        }
        form.addEventListener("input", onEdit);
        form.addEventListener("change", onEdit);
    }


    const popup = document.getElementById("contactPopup");
    const openPopupButton = document.getElementById("openContactPopup");
    if (popup && openPopupButton) {
        const closePopupButton = document.getElementById("closeContactPopup");
        const contactForm = document.getElementById("contactForm");
        const contactStatus = document.getElementById("contactStatus");
        contactForm.noValidate = true;
        watchCorrections(contactForm, contactStatus);

        function openPopup() {
            popup.hidden = false;
            document.body.classList.add("popup-open");
            contactForm.querySelector("input").focus();
        }

        function closePopup() {
            popup.hidden = true;
            document.body.classList.remove("popup-open");
            openPopupButton.focus();
        }

        openPopupButton.addEventListener("click", openPopup);
        closePopupButton.addEventListener("click", closePopup);
        popup.addEventListener("click", function (event) {
            if (event.target === popup) closePopup();
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && !popup.hidden) closePopup();
        });

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            clearAllErrors(contactForm);
            contactStatus.textContent = "";
            contactStatus.className = "mt-3";

            const name = document.getElementById("contactName");
            const email = document.getElementById("contactEmail");
            const message = document.getElementById("contactMessage");
            let firstInvalid = null;

            function check(input, correct, errorMessage) {
                if (!correct) {
                    showError(input, errorMessage);
                    if (!firstInvalid) firstInvalid = input;
                }
            }
            check(name, isValidName(name.value), "Enter a name with at least 2 letters (no numbers).");
            check(email, isValidEmail(email.value), "Enter a valid email (e.g. name@example.com).");
            check(message, message.value.trim().length >= 3, "Please enter a message (at least 3 characters).");

            if (firstInvalid) {
                contactStatus.textContent = "Please correct the highlighted fields.";
                contactStatus.className = "alert alert-danger mt-3";
                firstInvalid.focus();
            } else {
                contactStatus.textContent = "All fields are valid! This is a demo, so no message was sent.";
                contactStatus.className = "alert alert-success mt-3 mb-0";
                contactForm.reset();
            }
        });
    }


    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        bookingForm.noValidate = true;
        const status = document.getElementById("bookingStatus");
        watchCorrections(bookingForm, status);

        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();
            clearAllErrors(bookingForm);
            status.textContent = "";
            status.className = "mt-3";

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const car = document.getElementById("car");
            const pickup = document.getElementById("pickup");
            const returnDate = document.getElementById("return");
            const password = document.getElementById("demoPassword");
            const confirmPassword = document.getElementById("confirmPassword");
            const payment = bookingForm.querySelector("input[name='payment']:checked");
            let firstInvalid = null;

            function check(input, correct, errorMessage) {
                if (!correct) {
                    showError(input, errorMessage);
                    if (!firstInvalid) firstInvalid = input;
                }
            }

            check(name, isValidName(name.value), "Enter your name using letters (at least 2 characters).");
            check(email, isValidEmail(email.value), "Enter a valid email (e.g. name@example.com).");

            // Phone is optional. If provided, it must contain 10 digits after +7.
            const phoneDigits = phone.value.replace(/\D/g, "");
            check(phone, phone.value.trim() === "" || phoneDigits.length === 10,
                "Enter 10 digits after +7, for example 700 123 45 67.");

            check(car, car.value !== "", "Please select a car.");

            // Compare dates in the YYYY-MM-DD format used by input type=date.
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const today = year + "-" + month + "-" + day;

            if (pickup.value === "") {
                check(pickup, false, "Please choose a pick-up date.");
            } else {
                check(pickup, pickup.value >= today, "Pick-up date cannot be in the past.");
            }

            if (returnDate.value === "") {
                check(returnDate, false, "Please choose a return date.");
            } else if (pickup.value !== "") {
                check(returnDate, returnDate.value > pickup.value,
                    "Return date must be after pick-up date.");
            }

            if (!payment) {
                const paymentError = document.createElement("div");
                paymentError.className = "js-error text-danger small mt-1";
                paymentError.id = "payment-error";
                paymentError.textContent = "Please select a payment method.";
                bookingForm.querySelector("fieldset").appendChild(paymentError);
                if (!firstInvalid) firstInvalid = document.getElementById("paymentCard");
            }

            check(password, password.value.length >= 8,
                "Password must contain at least 8 characters.");
            check(confirmPassword, confirmPassword.value !== "" &&
                confirmPassword.value === password.value, "Passwords must match.");

            if (firstInvalid) {
                status.textContent = "Please correct the highlighted fields.";
                status.className = "alert alert-danger mt-3";
                firstInvalid.focus();
            } else {
                status.textContent = "All fields are valid! This is a demo, so no booking request was sent.";
                status.className = "alert alert-success mt-3";
                // Do not keep the demo passwords in the form after validation.
                password.value = "";
                confirmPassword.value = "";
            }
        });
    }
});
