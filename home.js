
/* =========================================================
   KEYGUARD HOME JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       LUCIDE ICONS
    ===================================================== */

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    refreshIcons();


    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    const header = document.getElementById("siteHeader");

    function handleHeaderScroll() {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    handleHeaderScroll();
    window.addEventListener("scroll", handleHeaderScroll);


    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const savedTheme = localStorage.getItem("keyGuardTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    function updateThemeButton() {
        const darkMode = document.body.classList.contains("dark-mode");

        if (themeIcon) {
            themeIcon.setAttribute(
                "data-lucide",
                darkMode ? "sun" : "moon"
            );
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                darkMode ? "Switch to light mode" : "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                darkMode ? "Light mode" : "Dark mode"
            );
        }

        refreshIcons();
    }

    updateThemeButton();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "keyGuardTheme",
                isDark ? "dark" : "light"
            );

            updateThemeButton();
        });
    }


    /* =====================================================
       RTL
    ===================================================== */

    const rtlToggle = document.getElementById("rtlToggle");
    const savedDirection = localStorage.getItem("keyGuardDirection");

    function applyDirection(isRTL) {
        document.body.classList.toggle("rtl", isRTL);

        document.documentElement.setAttribute(
            "dir",
            isRTL ? "rtl" : "ltr"
        );

        if (rtlToggle) {
            rtlToggle.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right" : "Switch to right-to-left"
            );

            rtlToggle.setAttribute(
                "title",
                isRTL ? "LTR direction" : "RTL direction"
            );
        }
    }

    applyDirection(savedDirection === "rtl");

    if (rtlToggle) {
        rtlToggle.addEventListener("click", () => {
            const isRTL = !document.body.classList.contains("rtl");

            applyDirection(isRTL);

            localStorage.setItem(
                "keyGuardDirection",
                isRTL ? "rtl" : "ltr"
            );
        });
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");

    function closeMobileMenu() {
        if (mainNav) {
            mainNav.classList.remove("mobile-open");
        }

        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute("aria-expanded", "false");
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
            refreshIcons();
        }
    }

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.setAttribute("aria-expanded", "false");

        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("mobile-open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileMenuBtn.innerHTML = isOpen
                ? '<i data-lucide="x"></i>'
                : '<i data-lucide="menu"></i>';

            refreshIcons();
        });
    }


    /* =====================================================
       HOME DROPDOWN
    ===================================================== */

    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const navDropdown = document.querySelector(".nav-dropdown");

    if (dropdownToggle && navDropdown) {
        dropdownToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            navDropdown.classList.toggle("open");
        });

        document.addEventListener("click", (event) => {
            if (!navDropdown.contains(event.target)) {
                navDropdown.classList.remove("open");
            }
        });
    }


    /* =====================================================
       CLOSE MOBILE MENU WHEN LINK CLICKED
    ===================================================== */

    document.querySelectorAll(".main-nav a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();

            if (navDropdown && !link.classList.contains("dropdown-toggle")) {
                navDropdown.classList.remove("open");
            }
        });
    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("show");
        });
    }


    /* =====================================================
       HERO PARALLAX / MOUSE MOVEMENT
    ===================================================== */

    const hero = document.querySelector(".hero");
    const heroImage = document.querySelector(".hero-background img");
    const heroFloating = document.querySelector(".hero-floating-card");

    if (hero && heroImage) {
        hero.addEventListener("mousemove", (event) => {
            if (window.innerWidth < 801) return;

            const rect = hero.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroImage.style.transform =
                `scale(1.06) translate(${x * -8}px, ${y * -5}px)`;

            if (heroFloating) {
                heroFloating.style.transform =
                    `translate(${x * -16}px, ${y * -12}px)`;
            }
        });

        hero.addEventListener("mouseleave", () => {
            heroImage.style.transform = "scale(1)";

            if (heroFloating) {
                heroFloating.style.transform = "translate(0, 0)";
            }
        });
    }


    /* =====================================================
       IMAGE TILT EFFECT
    ===================================================== */

    const hoverImages = document.querySelectorAll(".image-hover");

    hoverImages.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            if (window.innerWidth < 801) return;

            const rect = card.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            card.style.transform =
                `perspective(800px) rotateY(${x * 2}deg) rotateX(${y * -2}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform =
                "perspective(800px) rotateY(0deg) rotateX(0deg)";
        });
    });


    /* =====================================================
       ACTIVE NAV LINK
    ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".main-nav a").forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) return;

        const target = href.split("/").pop().toLowerCase();

        if (
            target === currentPage ||
            (currentPage === "" && target === "index.html")
        ) {
            link.classList.add("active");
        }
    });


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (navDropdown) {
                navDropdown.classList.remove("open");
            }

            closeMobileMenu();
        }
    });

});

