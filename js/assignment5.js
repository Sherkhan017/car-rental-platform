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

    const extraCars = [
        {"id":"sonata","name":"Hyundai Sonata","category":"Comfort","price":28000,"description":"A spacious sedan for comfortable city and highway trips.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/2024_Hyundai_Sonata_SEL%2C_front_right.jpg/720px-2024_Hyundai_Sonata_SEL%2C_front_right.jpg","backupImage":"https://upload.wikimedia.org/wikipedia/commons/1/1d/2024_Hyundai_Sonata_SEL%2C_front_right.jpg","photoSource":"https://commons.wikimedia.org/wiki/File:2024_Hyundai_Sonata_SEL%2C_front_right.jpg","photoAuthor":"MercurySable99","photoLicense":"CC BY-SA 4.0"},
        {"id":"kia-k5","name":"Kia K5","category":"Comfort","price":32000,"description":"A modern sedan with a smooth ride and a stylish design.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/2021_Kia_K5_white_front.jpg/720px-2021_Kia_K5_white_front.jpg","backupImage":"https://upload.wikimedia.org/wikipedia/commons/d/db/2021_Kia_K5_white_front.jpg","photoSource":"https://commons.wikimedia.org/wiki/File:2021_Kia_K5_white_front.jpg","photoAuthor":"Throwawayacc222","photoLicense":"CC0"},
        {"id":"corolla","name":"Toyota Corolla","category":"Comfort","price":24000,"description":"A practical choice for economical trips around the city.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/2020_Toyota_Corolla_SE%2C_front_2.29.20.jpg/720px-2020_Toyota_Corolla_SE%2C_front_2.29.20.jpg","backupImage":"https://upload.wikimedia.org/wikipedia/commons/d/d2/2020_Toyota_Corolla_SE%2C_front_2.29.20.jpg","photoSource":"https://commons.wikimedia.org/wiki/File:2020_Toyota_Corolla_SE%2C_front_2.29.20.jpg","photoAuthor":"Kevauto","photoLicense":"CC BY-SA 4.0"},
        {"id":"elantra","name":"Hyundai Elantra","category":"Comfort","price":26000,"description":"An efficient compact sedan with room for five passengers.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/2022_Hyundai_Elantra_Ultimate_in_Cyber_Grey%2C_Front_Right%2C_05-16-2022.jpg/720px-2022_Hyundai_Elantra_Ultimate_in_Cyber_Grey%2C_Front_Right%2C_05-16-2022.jpg","backupImage":"https://upload.wikimedia.org/wikipedia/commons/6/68/2022_Hyundai_Elantra_Ultimate_in_Cyber_Grey%2C_Front_Right%2C_05-16-2022.jpg","photoSource":"https://commons.wikimedia.org/wiki/File:2022_Hyundai_Elantra_Ultimate_in_Cyber_Grey%2C_Front_Right%2C_05-16-2022.jpg","photoAuthor":"Elise240SX","photoLicense":"CC BY-SA 4.0"},
        {"id":"audi-rs3","name":"Audi RS3","category":"Business","price":58000,"description":"A compact sports sedan with a refined interior.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Audi_RS3_8Y_1X7A6091.jpg/720px-Audi_RS3_8Y_1X7A6091.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/audi_rs3_8y.png","photoSource":"https://commons.wikimedia.org/wiki/File:Audi_RS3_8Y_1X7A6091.jpg","photoAuthor":"Alexander Migl","photoLicense":"CC BY-SA 4.0"},
        {"id":"audi-rs5","name":"Audi RS5 Sportback","category":"Business","price":75000,"description":"A powerful five-door car with business-class comfort.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/AUDI_RS5_SPORTBACK_5F_China.jpg/720px-AUDI_RS5_SPORTBACK_5F_China.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/audi_rs5_sportback.png","photoSource":"https://commons.wikimedia.org/wiki/File:AUDI_RS5_SPORTBACK_5F_China.jpg","photoAuthor":"Dinkun Chen","photoLicense":"CC BY-SA 4.0"},
        {"id":"bmw-m3","name":"BMW M3 Competition","category":"Business","price":90000,"description":"A premium sports sedan with responsive handling.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/BMW_M3_COMPETITION_%28G80%29_China.jpg/720px-BMW_M3_COMPETITION_%28G80%29_China.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/bmw_m3_g80.png","photoSource":"https://commons.wikimedia.org/wiki/File:BMW_M3_COMPETITION_%28G80%29_China.jpg","photoAuthor":"Dinkun Chen","photoLicense":"CC BY-SA 4.0"},
        {"id":"audi-rs4","name":"Audi RS4 Avant","category":"Business","price":72000,"description":"A fast and comfortable wagon with useful luggage space.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Audi_RS4%2C_IAA_2017%2C_Frankfurt_%281Y7A2886%29.jpg/720px-Audi_RS4%2C_IAA_2017%2C_Frankfurt_%281Y7A2886%29.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/audi_rs4_b9.png","photoSource":"https://commons.wikimedia.org/wiki/File:Audi_RS4%2C_IAA_2017%2C_Frankfurt_%281Y7A2886%29.jpg","photoAuthor":"Matti Blume","photoLicense":"CC BY-SA 4.0"},
        {"id":"macan","name":"Porsche Macan","category":"Premium","price":95000,"description":"A sporty compact SUV for city and highway driving.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/2022_Porsche_Macan_1X7A6050.jpg/720px-2022_Porsche_Macan_1X7A6050.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/porsche_macan.png","photoSource":"https://commons.wikimedia.org/wiki/File:2022_Porsche_Macan_1X7A6050.jpg","photoAuthor":"Alexander Migl","photoLicense":"CC BY-SA 4.0"},
        {"id":"cayenne","name":"Porsche Cayenne Electric","category":"Premium","price":125000,"description":"An electric premium SUV with a roomy interior.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Porsche_Cayenne_Electric_IMG_6129.jpg/720px-Porsche_Cayenne_Electric_IMG_6129.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/porsche_cayenne.png","photoSource":"https://commons.wikimedia.org/wiki/File:Porsche_Cayenne_Electric_IMG_6129.jpg","photoAuthor":"Alexander Migl","photoLicense":"CC BY-SA 4.0"},
        {"id":"bmw-x5m","name":"BMW X5 M","category":"Premium","price":140000,"description":"A powerful premium SUV with plenty of space.","image":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/bmw_x5m_e70.png","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/bmw_x5m_e70.png","photoSource":"https://commons.wikimedia.org/wiki/File:BMW_X5_M_-_Flickr_-_Alexandre_Pr%C3%A9vot.jpg","photoAuthor":"Alexandre Prévot","photoLicense":"CC BY-SA 2.0"},
        {"id":"aston-dbx","name":"Aston Martin DBX 707","category":"Premium","price":220000,"description":"A high-performance SUV with an elegant cabin.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/2024_Aston_Martin_DBX_707.jpg/720px-2024_Aston_Martin_DBX_707.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/aston_dbx.png","photoSource":"https://commons.wikimedia.org/wiki/File:2024_Aston_Martin_DBX_707.jpg","photoAuthor":"Calreyn88","photoLicense":"CC0"},
        {"id":"bentayga","name":"Bentley Bentayga","category":"Luxury","price":240000,"description":"A large luxury SUV with exceptional comfort.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Bentley_Bentayga_EWB_Auto_Zuerich_2023_1X7A1234.jpg/720px-Bentley_Bentayga_EWB_Auto_Zuerich_2023_1X7A1234.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/bentley_bentayga.png","photoSource":"https://commons.wikimedia.org/wiki/File:Bentley_Bentayga_EWB_Auto_Zuerich_2023_1X7A1234.jpg","photoAuthor":"Alexander-93","photoLicense":"CC BY-SA 4.0"},
        {"id":"continental","name":"Bentley Continental GTC","category":"Luxury","price":280000,"description":"A luxurious convertible for long and relaxed journeys.","image":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/bentley_continental_gt_mk3.png","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/bentley_continental_gt_mk3.png","photoSource":"https://commons.wikimedia.org/wiki/File:Bentley_Continental_GTC_at_Auto_Guangzhou_2023_20231126.jpg","photoAuthor":"Tim Wu","photoLicense":"CC BY-SA 4.0"},
        {"id":"porsche-911","name":"Porsche 911 Carrera Cabriolet","category":"Luxury","price":200000,"description":"An iconic open-top sports car for a special trip.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2025_Porsche_992_Carrera_convertible_DSC_7024_%28cropped%29.jpg/720px-2025_Porsche_992_Carrera_convertible_DSC_7024_%28cropped%29.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/porsche_911_carrera_992.png","photoSource":"https://commons.wikimedia.org/wiki/File:2025_Porsche_992_Carrera_convertible_DSC_7024_%28cropped%29.jpg","photoAuthor":"Alexander Migl","photoLicense":"CC BY-SA 4.0"},
        {"id":"ferrari-roma","name":"Ferrari Roma","category":"Luxury","price":260000,"description":"An elegant Italian grand touring sports car.","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ferrari_Roma_IMG_9620_%28cropped%29.jpg/720px-Ferrari_Roma_IMG_9620_%28cropped%29.jpg","backupImage":"https://raw.githubusercontent.com/Tirthraj-Raval/hypercar-colorscripts/main/assets/images/ferrari_roma.png","photoSource":"https://commons.wikimedia.org/wiki/File:Ferrari_Roma_IMG_9620_%28cropped%29.jpg","photoAuthor":"Alexander-93","photoLicense":"CC BY-SA 4.0"}
    ];

    extraCars.forEach(function (car) {
        car.rating = 0;
        car.getPriceText = function () {
            return this.price + " KZT / day";
        };
        cars.push(car);
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
            if (!(event.target instanceof Element)) return;
            if (event.target.matches("input, textarea, select") ||
                event.target.closest("[contenteditable]:not([contenteditable='false'])")) return;
            if (event.target.closest(".carousel, .rating-stars, #rentalPlanner, [role='dialog'], .popup-overlay")) return;

            const currentLink = event.target.closest(
                "nav[aria-label='Main navigation'] .nav-link, nav[aria-label='Sidebar navigation'] .sidebar-link"
            );
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                if (!currentLink) return;
                const menu = currentLink.closest("nav");
                const links = Array.from(menu.querySelectorAll(".nav-link, .sidebar-link"));
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
            status.textContent = "Your demo plan is ready. This did not create a real reservation.";
            status.className = "planner-status alert alert-success planner-success";
            playNotification();
        });
    }

    setUpMenuKeyboard();
    setUpBookingCarOptions();
    setUpSoundControl();
    setUpCarFinder();
    setUpRentalPlanner();
});
