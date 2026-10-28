document.addEventListener("DOMContentLoaded", function () {
    const cars = [
        {
            id: "camry",
            name: "Toyota Camry",
            category: "Comfort",
            price: 30000,
            image: "images/camry.webp",
            description: "A reliable sedan for city driving and family trips.",
            rating: 0,
            getPriceText: function () {
                return this.price + " KZT / day";
            }
        },
        {
            id: "audi",
            name: "Audi A6",
            category: "Business",
            price: 50000,
            image: "images/audi1.webp",
            description: "A practical business car for comfortable travel.",
            rating: 0,
            getPriceText: function () {
                return this.price + " KZT / day";
            }
        },
        {
            id: "bmw",
            name: "BMW 5 Series",
            category: "Premium",
            price: 40000,
            image: "images/bmw.webp",
            description: "A premium sedan for business and long-distance trips.",
            rating: 0,
            getPriceText: function () {
                return this.price + " KZT / day";
            }
        },
        {
            id: "mercedes",
            name: "Mercedes E-Class",
            category: "Luxury",
            price: 60000,
            image: "images/mercedes.webp",
            description: "An elegant car for comfortable premium travel.",
            rating: 0,
            getPriceText: function () {
                return this.price + " KZT / day";
            }
        }
    ];

    let selectedCategory = "All";
    let selectedCarId = "";
    let muted = false;
    let audioContext = null;
    let activeOscillator = null;

    function getToday() {
        const now = new Date();
        return now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");
    }

    function setUpMenuKeyboard() {
        document.addEventListener("keydown", function (event) {
            if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
            if (!(event.target instanceof Element) ||
                event.target.matches("input, textarea, select, [contenteditable='true']")) return;

            const currentLink = event.target.closest(
                "nav[aria-label='Main navigation'] .nav-link, nav[aria-label='Sidebar navigation'] .sidebar-link"
            );
            if (!currentLink) return;

            const menu = currentLink.closest("nav");
            const links = Array.from(menu.querySelectorAll(".nav-link, .sidebar-link"));
            const currentIndex = links.indexOf(currentLink);
            if (currentIndex === -1 || links.length < 2) return;

            const movesForward = event.key === "ArrowDown" || event.key === "ArrowRight";
            const nextIndex = (currentIndex + (movesForward ? 1 : -1) + links.length) % links.length;
            event.preventDefault();
            links[nextIndex].focus();
        });
    }

    function playNotification() {
        const AudioContextType = window.AudioContext || window.webkitAudioContext;
        if (muted || !AudioContextType) return;

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

    function setUpSoundControl() {
        const soundButton = document.getElementById("soundToggle");
        if (!soundButton) return;

        if (!(window.AudioContext || window.webkitAudioContext)) {
            soundButton.disabled = true;
            soundButton.textContent = "Sound unavailable";
            return;
        }

        soundButton.addEventListener("click", function () {
            muted = !muted;
            soundButton.setAttribute("aria-pressed", String(muted));
            soundButton.textContent = muted ? "Sound: Off" : "Sound: On";
        });
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
        image.alt = car.name;

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
        price.textContent = car.getPriceText();

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
            status.textContent = "Your demo plan is ready. This did not create a real reservation.";
            status.className = "planner-status alert alert-success planner-success";
            playNotification();
        });
    }

    setUpMenuKeyboard();
    setUpSoundControl();
    setUpCarFinder();
    setUpRentalPlanner();
});
