document.addEventListener("DOMContentLoaded", function () {
    // Shared demo catalogue: five cars per category; all images are local.
    const cars = [
        { id: "camry", name: "Toyota Camry", category: "Comfort", price: 30000, image: "images/camry.webp", description: "Comfortable sedan for city driving and family trips.", rating: 0 },
        { id: "audi", name: "Audi A6", category: "Business", price: 50000, image: "images/audi1.webp", description: "A practical business car for comfortable travel.", rating: 0 },
        { id: "bmw", name: "BMW 5 Series", category: "Premium", price: 40000, image: "images/bmw.webp", description: "Premium sedan with a smooth and enjoyable ride.", rating: 0 },
        { id: "mercedes", name: "Mercedes E-Class", category: "Premium", price: 60000, image: "images/mercedes.webp", description: "Elegant car for comfortable journeys.", rating: 0 },
        { id: "k8", name: "Kia K8", category: "Business", price: 42000, image: "images/k8.webp", description: "Spacious sedan with modern comfort features.", rating: 0 },
        { id: "gls", name: "Mercedes GLS", category: "Luxury", price: 110000, image: "images/gls.jpeg", description: "Large luxury SUV for relaxed trips with family or friends.", rating: 0 },
        { id: "elantra", name: "Hyundai Elantra", category: "Comfort", price: 25000, image: "images/hyundai-elantra.jpg", description: "Economical automatic sedan with easy city handling.", rating: 0 },
        { id: "kia-k5", name: "Kia K5", category: "Comfort", price: 29000, image: "images/kia-k5.jpg", description: "Roomy midsize sedan with modern safety features.", rating: 0 },
        { id: "accord", name: "Honda Accord", category: "Comfort", price: 34000, image: "images/honda-accord.jpg", description: "Smooth everyday travel with a spacious cabin.", rating: 0 },
        { id: "passat", name: "Volkswagen Passat", category: "Comfort", price: 32000, image: "images/volkswagen-passat.jpg", description: "Practical long-distance comfort with generous luggage space.", rating: 0 },
        { id: "lexus-es", name: "Lexus ES 250", category: "Business", price: 56000, image: "images/lexus-es.jpg", description: "Quiet executive sedan with comfortable rear seating.", rating: 0 },
        { id: "crown", name: "Toyota Crown", category: "Business", price: 55000, image: "images/toyota-crown.jpg", description: "Refined sedan for airport transfers and business visits.", rating: 0 },
        { id: "genesis", name: "Genesis G80", category: "Business", price: 62000, image: "images/genesis-g80.jpg", description: "Modern executive car with a refined interior.", rating: 0 },
        { id: "audi-a7", name: "Audi A7", category: "Premium", price: 70000, image: "images/audi-a7.jpg", description: "Premium fastback with elegant styling and roomy cabin.", rating: 0 },
        { id: "bmw-7", name: "BMW 7 Series", category: "Premium", price: 95000, image: "images/bmw-7-series.jpg", description: "Flagship business-class sedan with a luxurious ride.", rating: 0 },
        { id: "volvo", name: "Volvo S90", category: "Premium", price: 68000, image: "images/volvo-s90.jpg", description: "Comfort-focused premium sedan for relaxed journeys.", rating: 0 },
        { id: "panamera", name: "Porsche Panamera", category: "Luxury", price: 125000, image: "images/porsche-panamera.jpg", description: "Sporty luxury sedan for a premium driving experience.", rating: 0 },
        { id: "range-rover", name: "Range Rover Autobiography", category: "Luxury", price: 145000, image: "images/range-rover.jpg", description: "Prestigious SUV with spacious interior and elevated comfort.", rating: 0 },
        { id: "s-class", name: "Mercedes S-Class", category: "Luxury", price: 135000, image: "images/mercedes-s-class.jpg", description: "Flagship limousine designed for executive comfort.", rating: 0 },
        { id: "lexus-lx", name: "Lexus LX 600", category: "Luxury", price: 130000, image: "images/lexus-lx.jpg", description: "Large luxury SUV built for refined family travel.", rating: 0 }
    ];

    cars.forEach(function (car) {
        car.getPriceText = function () { return this.price + " KZT / day"; };
    });
    const categories = ["Comfort", "Business", "Premium", "Luxury"];
    cars.sort(function (a, b) {
        return categories.indexOf(a.category) - categories.indexOf(b.category) ||
            a.name.localeCompare(b.name);
    });
    window.driveNowCatalog = cars;

    function setUpBookingCarOptions() {
        const field = document.getElementById("car");
        if (!field) return;
        field.innerHTML = '<option value="" selected disabled>Select a car</option>';
        cars.forEach(function (car) {
            const option = document.createElement("option");
            option.value = car.id;
            option.textContent = car.name + " - " + car.getPriceText();
            field.appendChild(option);
        });
        const requested = new URLSearchParams(window.location.search).get("car");
        if (requested && cars.some(function (car) { return car.id === requested; })) {
            field.value = requested;
        }
    }

    let selectedCategory = "All";
    let selectedCarId = "";
    let muted = false;
    try { muted = localStorage.getItem("drivenow-sound") === "off"; } catch (error) { /* storage unavailable */ }
    let audioContext = null;
    let activeOscillator = null;
    let lastSoundAt = 0;

    function getToday() {
        const now = new Date();
        return now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");
    }

    function setUpMenuKeyboard() {
        document.addEventListener("keydown", function (event) {
            if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
            if (!(event.target instanceof Element)) return;
            if (event.target.matches("input, textarea, select") ||
                event.target.closest("[contenteditable]:not([contenteditable='false'])")) return;
            if (event.target.closest(".carousel, .rating-stars, #rentalPlanner, [role='dialog'], .popup-overlay")) return;

            const currentLink = event.target.closest(
                "nav[aria-label='Main navigation'] .nav-link"
            );
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                if (!currentLink) return;
                const menu = currentLink.closest("nav");
                const links = Array.from(menu.querySelectorAll(".nav-link"));
                const currentIndex = links.indexOf(currentLink);
                if (currentIndex === -1 || links.length < 2) return;
                const nextIndex = (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
                event.preventDefault();
                links[nextIndex].focus();
                return;
            }

            if (currentLink) {
                const links = ["index.html", "cars.html", "booking.html", "about.html"];
                const currentPage = window.location.pathname.split("/").pop() || "index.html";
                const currentIndex = links.indexOf(currentPage);
                if (currentIndex === -1) return;
                const nextIndex = (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + links.length) % links.length;
                event.preventDefault();
                window.location.href = links[nextIndex];
                return;
            }

            if (event.target.matches("body, html") ||
                !event.target.closest("a, button, [role='button'], [tabindex]:not([tabindex='-1'])")) {
                const links = ["index.html", "cars.html", "booking.html", "about.html"];
                const currentPage = window.location.pathname.split("/").pop() || "index.html";
                const currentIndex = links.indexOf(currentPage);
                if (currentIndex === -1) return;
                const nextIndex = (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + links.length) % links.length;
                event.preventDefault();
                window.location.href = links[nextIndex];
            }
        });
    }

    function playNotification() {
        const AudioContextType = window.AudioContext || window.webkitAudioContext;
        if (muted || !AudioContextType) return;
        const now = Date.now();
        if (now - lastSoundAt < 90) return;
        lastSoundAt = now;

        if (!audioContext) audioContext = new AudioContextType();
        if (activeOscillator) {
            activeOscillator.stop();
            activeOscillator = null;
        }

        if (audioContext.state === "suspended") audioContext.resume();
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();
        const startTime = audioContext.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(660, startTime);
        volume.gain.setValueAtTime(0.08, startTime);
        volume.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
        oscillator.connect(volume);
        volume.connect(audioContext.destination);
        activeOscillator = oscillator;
        oscillator.onended = function () {
            if (activeOscillator === oscillator) activeOscillator = null;
            oscillator.disconnect();
            volume.disconnect();
        };
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.12);
    }

    window.driveNowPlaySound = playNotification;

    function setUpSoundControl() {
        const soundButton = document.getElementById("soundToggle");
        if (!soundButton) return;
        const label = soundButton.querySelector(".sound-toggle-label");
        function showSoundState() {
            soundButton.setAttribute("aria-pressed", String(!muted));
            if (label) label.textContent = muted ? "Sound: Off" : "Sound: On";
        }
        showSoundState();
        soundButton.addEventListener("click", function () {
            muted = !muted;
            try { localStorage.setItem("drivenow-sound", muted ? "off" : "on"); }
            catch (error) { /* storage unavailable */ }
            showSoundState();
            if (!muted) playNotification();
        });
        const testButton = document.getElementById("testSound");
        const settingsStatus = document.getElementById("settingsStatus");
        if (testButton && settingsStatus) testButton.addEventListener("click", function () {
            if (muted) { settingsStatus.textContent = "Sound is turned off. Enable it first."; return; }
            if (!(window.AudioContext || window.webkitAudioContext)) {
                settingsStatus.textContent = "This browser cannot play demo sounds.";
                return;
            }
            settingsStatus.textContent = "Playing a short demo tone.";
            playNotification();
        });
    }

    function setUpUniversalClickSound() {
        document.addEventListener("click", function (event) {
            const interactive = event.target.closest(
                "button, .btn, .nav-link, .sidebar-option, .dropdown-item, summary, [role='button']"
            );
            if (!interactive) return;
            if (interactive.id === "soundToggle" || interactive.id === "testSound") return;
            if (interactive.disabled || interactive.getAttribute("aria-disabled") === "true") return;
            playNotification();
        }, true);
    }

    function makeRatingStars(car) {
        const starGroup = document.createElement("div");
        starGroup.className = "rating-stars";
        starGroup.setAttribute("role", "group");
        starGroup.setAttribute("aria-label", "Your demo rating for " + car.name);

        for (let starNumber = 1; starNumber <= 5; starNumber += 1) {
            const starButton = document.createElement("button");
            starButton.type = "button";
            starButton.className = "rating-star";
            starButton.textContent = "★";
            starButton.setAttribute("aria-label", "Rate " + car.name + " " + starNumber + " out of 5");
            starButton.setAttribute("aria-pressed", String(starNumber <= car.rating));
            starButton.classList.toggle("is-selected", starNumber <= car.rating);
            starButton.setAttribute("data-car-id", car.id);
            starButton.setAttribute("data-rating", String(starNumber));
            starGroup.appendChild(starButton);
        }
        return starGroup;
    }

    function makeCarCard(car) {
        const column = document.createElement("div");
        column.className = "col-12 col-sm-6 col-xl-3";
        const card = document.createElement("article");
        card.className = "card finder-card h-100";
        card.setAttribute("data-car-id", car.id);

        const image = document.createElement("img");
        image.className = "card-img-top";
        image.src = car.image;
        image.loading = "lazy";
        image.alt = car.name;
        if (car.photoSource) {
            image.referrerPolicy = "no-referrer";
            image.addEventListener("error", function () {
                if (!image.dataset.triedBackup && car.backupImage && car.backupImage !== car.image) {
                    image.dataset.triedBackup = "yes";
                    image.src = car.backupImage;
                    return;
                }
                image.style.display = "none";
                const placeholder = document.createElement("div");
                placeholder.className = "car-photo-unavailable";
                placeholder.textContent = "Photo unavailable";
                card.insertBefore(placeholder, card.firstChild);
            });
        }

        const body = document.createElement("div");
        body.className = "card-body d-flex flex-column";

        const category = document.createElement("p");
        category.className = "car-category mb-2";
        category.textContent = car.category.toUpperCase();

        const title = document.createElement("h3");
        title.className = "card-title h5";
        title.textContent = car.name;

        const description = document.createElement("p");
        description.className = "card-text flex-grow-1";
        description.textContent = car.description;

        const price = document.createElement("strong");
        price.className = "d-block mb-3";
        const amount = document.createElement("span");
        amount.className = "price-amount";
        amount.textContent = String(car.price);
        const unit = document.createElement("small");
        unit.className = "price-unit";
        unit.textContent = " KZT / day";
        price.append(amount, unit);

        const rating = makeRatingStars(car);
        const ratingMessage = document.createElement("p");
        ratingMessage.className = "rating-message small mb-3";
        ratingMessage.setAttribute("aria-live", "polite");
        ratingMessage.textContent = car.rating ? "Your rating: " + car.rating + "/5" : "No personal rating yet.";

        const selectButton = document.createElement("button");
        selectButton.type = "button";
        selectButton.className = "btn btn-outline-primary mt-auto select-car-button";
        selectButton.textContent = car.id === selectedCarId ? "Selected" : "Select this car";
        selectButton.setAttribute("data-select-car", car.id);
        selectButton.setAttribute("aria-pressed", String(car.id === selectedCarId));

        body.append(category, title, description, price, rating, ratingMessage, selectButton);

        const bookingLink = document.createElement("a");
        bookingLink.className = "btn btn-primary btn-sm mt-2";
        bookingLink.href = "booking.html?car=" + encodeURIComponent(car.id);
        bookingLink.textContent = "Book this car";
        body.appendChild(bookingLink);

        if (car.photoSource) {
            const credit = document.createElement("a");
            credit.className = "car-photo-credit mt-2";
            credit.href = car.photoSource;
            credit.target = "_blank";
            credit.rel = "noopener noreferrer";
            credit.textContent = "Photo: Wikimedia Commons";
            credit.title = car.photoAuthor + " · " + car.photoLicense;
            body.appendChild(credit);
        }

        card.append(image, body);
        column.appendChild(card);
        return column;
    }

    function filterCars(category) {
        switch (category) {
            case "Comfort":
                return cars.filter(function (car) { return car.category === "Comfort"; });
            case "Business":
                return cars.filter(function (car) { return car.category === "Business"; });
            case "Premium":
                return cars.filter(function (car) { return car.category === "Premium"; });
            case "Luxury":
                return cars.filter(function (car) { return car.category === "Luxury"; });
            case "All":
                return cars.filter(function () { return true; });
            default:
                return [];
        }
    }

    function renderCars() {
        const list = document.getElementById("finderCars");
        const count = document.getElementById("availableCarsCount");
        const emptyMessage = document.getElementById("finderEmptyMessage");
        if (!list || !count || !emptyMessage) return;

        const matchingCars = filterCars(selectedCategory);
        list.replaceChildren();
        matchingCars.forEach(function (car) {
            list.appendChild(makeCarCard(car));
        });
        count.textContent = matchingCars.length + (matchingCars.length === 1 ? " car available" : " cars available");
        emptyMessage.hidden = matchingCars.length !== 0;
        list.querySelectorAll(".finder-card").forEach(function (card) {
            requestAnimationFrame(function () {
                card.classList.add("is-visible");
            });
        });

        const filterButtons = document.querySelectorAll("[data-car-filter]");
        filterButtons.forEach(function (button) {
            const isSelected = button.getAttribute("data-car-filter") === selectedCategory;
            button.classList.toggle("active", isSelected);
            button.setAttribute("aria-pressed", String(isSelected));
        });
    }

    function updateRating(car, ratingButton) {
        car.rating = Number(ratingButton.getAttribute("data-rating"));
        const card = ratingButton.closest(".finder-card");
        card.querySelectorAll(".rating-star").forEach(function (star) {
            const selected = Number(star.getAttribute("data-rating")) <= car.rating;
            star.classList.toggle("is-selected", selected);
            star.setAttribute("aria-pressed", String(selected));
        });
        card.querySelector(".rating-message").textContent = "Your rating: " + car.rating + "/5";
        ratingButton.classList.add("rating-pop");
        window.setTimeout(function () { ratingButton.classList.remove("rating-pop"); }, 220);
        ratingButton.closest(".rating-stars").style.backgroundColor = "#e0f2fe";
        playNotification();
    }

    function setUpCarFinder() {
        const carList = document.querySelector("#finderCars");
        if (!carList) return;

        const filterButtons = document.querySelectorAll("[data-car-filter]");
        filterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedCategory = button.getAttribute("data-car-filter");
                renderCars();
            });
        });

        carList.addEventListener("click", function (event) {
            const ratingButton = event.target.closest(".rating-star");
            if (ratingButton) {
                const car = cars.find(function (item) {
                    return item.id === ratingButton.getAttribute("data-car-id");
                });
                if (!car) return;
                updateRating(car, ratingButton);
                return;
            }

            const selectButton = event.target.closest("[data-select-car]");
            if (!selectButton) return;
            selectedCarId = selectButton.getAttribute("data-select-car");
            const selectedCar = cars.find(function (item) { return item.id === selectedCarId; });
            const selectedInfo = document.getElementById("selectedCarInfo");
            if (selectedCar && selectedInfo) {
                selectedInfo.textContent = selectedCar.name + " — " + selectedCar.getPriceText();
                selectedInfo.classList.add("selection-highlight");
                selectButton.setAttribute("aria-pressed", "true");
                selectButton.textContent = "Selected";
                carList.querySelectorAll("[data-select-car]").forEach(function (button) {
                    if (button !== selectButton) {
                        button.setAttribute("aria-pressed", "false");
                        button.textContent = "Select this car";
                    }
                });
                if (window.driveNowToast) {
                    window.driveNowToast(selectedCar.name + " selected.");
                }
            }
        });

        renderCars();
    }

    function setUpRentalPlanner() {
        const planner = document.getElementById("rentalPlanner");
        if (!planner) return;

        const carSelect = document.getElementById("plannerCar");
        const startDate = document.getElementById("plannerStart");
        const endDate = document.getElementById("plannerEnd");
        const status = document.getElementById("plannerStatus");
        const today = getToday();
        startDate.min = today;
        endDate.min = today;

        cars.map(function (car) {
            const option = document.createElement("option");
            option.value = car.id;
            option.textContent = car.name + " — " + car.getPriceText();
            carSelect.appendChild(option);
            return option;
        });

        let currentStep = 1;

        function validateCurrentStep() {
            status.textContent = "";
            status.className = "planner-status";

            if (currentStep === 1 && !carSelect.value) {
                status.textContent = "Please choose a car before continuing.";
                status.classList.add("alert", "alert-danger");
                carSelect.focus();
                return false;
            }
            if (currentStep === 2) {
                if (!startDate.value || !endDate.value) {
                    status.textContent = "Please choose both rental dates.";
                    status.classList.add("alert", "alert-danger");
                    (startDate.value ? endDate : startDate).focus();
                    return false;
                }
                if (startDate.value < today || endDate.value <= startDate.value) {
                    status.textContent = "Choose a start date today or later and an end date after it.";
                    status.classList.add("alert", "alert-danger");
                    (startDate.value < today ? startDate : endDate).focus();
                    return false;
                }
            }
            return true;
        }

        function showStep(stepNumber, onShown) {
            currentStep = stepNumber;
            planner.querySelectorAll(".planner-step").forEach(function (step) {
                const isActive = Number(step.getAttribute("data-step")) === currentStep;
                step.hidden = !isActive;
                step.classList.toggle("is-active", isActive);
            });
            document.getElementById("plannerStepLabel").textContent = "Step " + currentStep + " of 3";
            if (currentStep === 3) updateReview();
            if (onShown) onShown();
        }

        function updateReview() {
            const selectedCar = cars.find(function (car) { return car.id === carSelect.value; });
            document.getElementById("reviewCar").textContent = selectedCar
                ? selectedCar.name + " — " + selectedCar.getPriceText()
                : "No car selected";
            document.getElementById("reviewDates").textContent =
                startDate.value + " to " + endDate.value;
        }

        function navigateToStep(nextStep, callback) {
            if (nextStep > currentStep && !validateCurrentStep()) return;
            callback(nextStep);
        }

        planner.querySelectorAll("[data-planner-next]").forEach(function (button) {
            button.addEventListener("click", function () {
                navigateToStep(currentStep + 1, function (nextStep) {
                    showStep(nextStep, function () {
                        const nextPanel = planner.querySelector(".planner-step.is-active");
                        nextPanel.classList.add("step-arrive");
                        window.setTimeout(function () { nextPanel.classList.remove("step-arrive"); }, 280);
                    });
                });
            });
        });

        planner.querySelectorAll("[data-planner-back]").forEach(function (button) {
            button.addEventListener("click", function () {
                navigateToStep(currentStep - 1, function (previousStep) {
                    showStep(previousStep, function () {
                        const previousPanel = planner.querySelector(".planner-step.is-active");
                        previousPanel.classList.add("step-arrive");
                        window.setTimeout(function () { previousPanel.classList.remove("step-arrive"); }, 280);
                    });
                });
            });
        });

        document.getElementById("plannerConfirm").addEventListener("click", function () {
            updateReview();
            const selectedCar = cars.find(function (car) { return car.id === carSelect.value; });
            if (!selectedCar) return;
            window.dispatchEvent(new CustomEvent("drivenow:save-planner", {
                detail: {
                    car: selectedCar.name + " — " + selectedCar.getPriceText(),
                    start: startDate.value,
                    end: endDate.value
                }
            }));
            playNotification();
        });
    }

    setUpMenuKeyboard();
    setUpBookingCarOptions();
    setUpSoundControl();
    setUpUniversalClickSound();
    setUpCarFinder();
    setUpRentalPlanner();
});
