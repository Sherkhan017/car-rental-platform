// DriveNow - Assignment 4: Introduction to JavaScript
// Each feature works only on the pages where its HTML elements exist.

document.addEventListener("DOMContentLoaded", function () {
    const colors = ["#f7f8fa", "#e0f2fe", "#fef3c7", "#dcfce7", "#f3e8ff"];
    const colorNames = ["Original", "Light Blue", "Light Yellow", "Light Green", "Light Purple"];
    const backgroundStorageKey = "drivenow-page-background";
    let savedColor = null;
    try {
        savedColor = localStorage.getItem(backgroundStorageKey);
    } catch (error) {
        // Color selection still works when storage is unavailable.
    }
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
            try {
                localStorage.setItem(backgroundStorageKey, colors[colorIndex]);
            } catch (error) {
                // Ignore storage restrictions.
            }
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
        let bookingPending = false;

        function isValidName(value) {
            return /^\p{L}+(?:[ '-]\p{L}+)*$/u.test(value.trim()) && value.trim().length >= 2;
        }

        function isValidEmail(value) {
            return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(value.trim());
        }

        function showError(input, message) {
            input.classList.add("is-invalid");
            input.setAttribute("aria-invalid", "true");

            const feedback = document.createElement("div");
            feedback.className = "js-error text-danger small mt-1";
            feedback.textContent = message;
            feedback.id = input.id + "-error";
            input.setAttribute("aria-describedby", feedback.id);
            const after = input.closest(".input-group") || input;
            after.insertAdjacentElement("afterend", feedback);
        }

        function clearError(event) {
            const input = event.target;
            if (!input.matches("input, select, textarea")) return;
            input.classList.remove("is-invalid");
            input.removeAttribute("aria-invalid");
            if (input.getAttribute("aria-describedby") === input.id + "-error") {
                input.removeAttribute("aria-describedby");
            }
            const message = document.getElementById(input.id + "-error");
            if (message) message.remove();
            if (input.name === "payment") {
                const paymentError = document.getElementById("payment-error");
                if (paymentError) paymentError.remove();
            }
        }

        bookingForm.addEventListener("input", clearError);
        bookingForm.addEventListener("change", clearError);

        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault(); // We do not have a backend server yet.
            if (bookingPending) return;

            bookingForm.querySelectorAll(".js-error").forEach(function (error) {
                error.remove();
            });
            bookingForm.querySelectorAll(".is-invalid").forEach(function (input) {
                input.classList.remove("is-invalid");
                input.removeAttribute("aria-invalid");
                if (input.getAttribute("aria-describedby") === input.id + "-error") {
                    input.removeAttribute("aria-describedby");
                }
            });

            const status = document.getElementById("bookingStatus");
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

            function check(input, isValid, message) {
                if (!isValid) {
                    showError(input, message);
                    if (!firstInvalid) firstInvalid = input;
                }
            }

            check(name, isValidName(name.value), "Enter your name using letters (at least 2 characters).");
            check(email, isValidEmail(email.value), "Enter a valid email address.");

            const phoneDigits = phone.value.replace(/\D/g, "");
            check(phone, phone.value.trim() === "" || phoneDigits.length === 10,
                "Enter 10 digits after +7.");

            check(car, car.value !== "", "Please select a car.");

            const now = new Date();
            const today = now.getFullYear() + "-" +
                String(now.getMonth() + 1).padStart(2, "0") + "-" +
                String(now.getDate()).padStart(2, "0");

            check(pickup, pickup.value !== "" && pickup.value >= today,
                pickup.value ? "Pick-up date cannot be in the past." : "Please choose a pick-up date.");
            check(returnDate, returnDate.value !== "" &&
                (!pickup.value || returnDate.value > pickup.value),
                returnDate.value ? "Return date must be after pick-up date." : "Please choose a return date.");

            if (!payment) {
                const error = document.createElement("div");
                error.className = "js-error text-danger small";
                error.id = "payment-error";
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
                bookingPending = true;
                const submitButton = bookingForm.querySelector("button[type='submit']");
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Please wait...';
                status.textContent = "Checking your demo booking...";
                status.className = "alert alert-info mt-3";

                window.setTimeout(function () {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    bookingPending = false;
                    status.textContent = "All fields are valid! This is a demo, so no booking request was sent.";
                    status.className = "alert alert-success mt-3";
                    password.value = "";
                    confirmPassword.value = "";
                    if (window.driveNowToast) {
                        window.driveNowToast("Demo booking completed. No request was sent.");
                    }
                }, 900);
            }
        });
    }
});
