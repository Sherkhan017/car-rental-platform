// DriveNow - Assignment 6: jQuery
// Shared features and small interactive components for the existing website.
(function () {
    "use strict";

    // Task 9: Load real image URLs from data-src when pictures come near the screen.
    // This also works without jQuery, so the images are never dependent on a CDN.
    function loadImage(image) {
        const source = image.getAttribute("data-src");
        if (!source) return;
        if (window.jQuery) {
            window.jQuery(image).attr("src", source).removeAttr("data-src");
        } else {
            image.setAttribute("src", source);
            image.removeAttribute("data-src");
        }
    }

    function prepareImages() {
        const pictures = document.querySelectorAll("img[data-src]");
        // Load the hero image immediately, but keep other pictures lazy.
        pictures.forEach(function (image) {
            if (image.closest(".hero-section")) loadImage(image);
        });

        // Carousel slides are hidden until they become active.
        document.querySelectorAll(".carousel").forEach(function (carousel) {
            carousel.addEventListener("slide.bs.carousel", function (event) {
                const nextImage = event.relatedTarget && event.relatedTarget.querySelector("img[data-src]");
                if (nextImage) loadImage(nextImage);
            });
        });
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "300px" });
            pictures.forEach(function (image) {
                if (!image.hasAttribute("data-src")) return;
                if (image.closest(".carousel") && !image.closest(".carousel-item.active")) return;
                observer.observe(image);
            });
        } else {
            pictures.forEach(loadImage);
        }
    }

    document.addEventListener("DOMContentLoaded", prepareImages);

    if (!window.jQuery) {
        console.warn("jQuery did not load. Images will still work, but Assignment 6 needs the jQuery CDN.");
        return;
    }

    jQuery(document).ready(function ($) {
        console.log("jQuery is ready!");

        // Dark/Light mode for all four pages. The saved theme stays after navigation.
        const themeKey = "drivenow-theme";
        let dark = false;
        try { dark = localStorage.getItem(themeKey) === "dark"; } catch (error) { /* storage disabled */ }

        function showTheme() {
            $("body").toggleClass("dark-mode", dark);
            const label = dark ? "Switch to light mode" : "Switch to dark mode";
            $(".theme-toggle").attr({
                "aria-label": label,
                "title": label,
                "aria-pressed": String(dark)
            });
        }

        showTheme();
        $(".theme-toggle").on("click", function () {
            dark = !dark;
            showTheme();
            try { localStorage.setItem(themeKey, dark ? "dark" : "light"); } catch (error) { /* storage disabled */ }
        });

        // Task 4: Scroll progress bar.
        function updateScrollProgress() {
            const maxScroll = $(document).height() - $(window).height();
            const percent = maxScroll > 0 ? Math.min(100, window.scrollY / maxScroll * 100) : 100;
            $("#scrollProgressBar").css("width", percent + "%");
        }
        $(window).on("scroll resize", updateScrollProgress);
        updateScrollProgress();

        // Task 7: A notification which disappears after a short time.
        const $toast = $("<div>").addClass("drivenow-toast")
            .attr({ role: "status", "aria-live": "polite" })
            .hide().appendTo("body");
        window.driveNowToast = function (message) {
            $toast.stop(true, true).text(message).fadeIn(180).delay(1700).fadeOut(280);
        };

        // Task 5: Count up the true statistics when they first enter the screen.
        let counterStarted = false;
        function startCounters() {
            if (counterStarted) return;
            counterStarted = true;
            $(".stat-number[data-count]").each(function () {
                const $number = $(this);
                const target = Number($number.attr("data-count"));
                $({ value: 0 }).animate({ value: target }, {
                    duration: 850,
                    step: function (value) { $number.text(Math.floor(value)); },
                    complete: function () { $number.text(target); }
                });
            });
        }
        const stats = document.getElementById("projectStats");
        if (stats) {
            if ("IntersectionObserver" in window) {
                const observer = new IntersectionObserver(function (entries) {
                    if (entries[0].isIntersecting) {
                        startCounters();
                        observer.disconnect();
                    }
                });
                observer.observe(stats);
            } else {
                startCounters();
            }
        }

        // Tasks 1-3: Live search, autocomplete, and safe text highlighting.
        const $search = $("#carSearch");
        if ($search.length) {
            const items = (window.driveNowCatalog || []).map(function (car) {
                return car.name;
            }).concat(["Comfort", "Business", "Premium", "Luxury"]);
            const $suggestions = $("#carSearchSuggestions");

            function highlightText(element, query) {
                const original = element.textContent; // textContent includes old <mark> text.
                element.replaceChildren();
                if (!query) { element.textContent = original; return; }
                const lower = original.toLowerCase();
                let start = 0;
                let position = lower.indexOf(query);
                while (position !== -1) {
                    element.append(document.createTextNode(original.slice(start, position)));
                    const mark = document.createElement("mark");
                    mark.textContent = original.slice(position, position + query.length);
                    element.append(mark);
                    start = position + query.length;
                    position = lower.indexOf(query, start);
                }
                element.append(document.createTextNode(original.slice(start)));
            }

            function filterVisibleCars() {
                const query = String($search.val()).trim().toLowerCase();
                let count = 0;
                $("#finderCars .finder-card").each(function () {
                    const $card = $(this);
                    const text = $card.find(".card-title, .car-category, .card-text").text().toLowerCase();
                    const visible = text.includes(query);
                    $card.parent().toggle(visible);
                    if (visible) count += 1;
                    $card.find(".card-title, .car-category, .card-text").each(function () {
                        highlightText(this, query);
                    });
                });
                $("#availableCarsCount").text(count + (count === 1 ? " car available" : " cars available"));
                $("#finderEmptyMessage").prop("hidden", count !== 0);
            }

            function showSuggestions() {
                const query = String($search.val()).trim().toLowerCase();
                $suggestions.empty();
                if (!query) { $suggestions.prop("hidden", true); return; }
                const matching = items.filter(function (name) {
                    return name.toLowerCase().includes(query);
                }).slice(0, 5);
                matching.forEach(function (name) {
                    const $button = $("<button type='button'>")
                        .addClass("list-group-item list-group-item-action")
                        .text(name).on("click", function () {
                            $search.val(name);
                            $suggestions.prop("hidden", true);
                            filterVisibleCars();
                            $search.trigger("focus");
                        });
                    $("<li>").append($button).appendTo($suggestions);
                });
                $suggestions.prop("hidden", matching.length === 0);
            }

            $search.on("input", function () {
                filterVisibleCars();
                showSuggestions();
            });
            $search.on("keydown", function (event) {
                if (event.key === "Escape") $suggestions.prop("hidden", true);
            });
            // The existing Assignment 5 handler renders the category cards first.
            $("[data-car-filter]").on("click", function () {
                filterVisibleCars();
            });
            $(document).on("click", function (event) {
                if (!$(event.target).closest(".car-search-wrap").length) {
                    $suggestions.prop("hidden", true);
                }
            });
            filterVisibleCars();
        }

        // Task 8: Copy selected car details only after a successful copy.
        $("#copySelectedCar").on("click", async function () {
            const button = this;
            const value = $("#selectedCarInfo").text().trim();
            if (!value || value.startsWith("Choose a car")) {
                window.driveNowToast("Please select a car first.");
                return;
            }
            try {
                if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
                await navigator.clipboard.writeText(value);
                $(button).text("✓ Copied!").attr("title", "Copied to clipboard!");
                window.driveNowToast("Copied to clipboard!");
                window.setTimeout(function () {
                    $(button).text("Copy car information").removeAttr("title");
                }, 1400);
            } catch (error) {
                window.driveNowToast("Could not copy. Please use a secure HTTPS page.");
            }
        });

        // Task 6: The loading spinner is handled in js/script.js after successful
        // Assignment 4 booking validation. Do not register a second submit handler.
    });
}());
