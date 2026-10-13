
/* =========================================================
   KEYGUARD SERVICES PAGE JS
   BASED ON HOME 2
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* LUCIDE ICONS */
  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  refreshIcons();

  /* HEADER SCROLL */
  const header = document.getElementById("siteHeader");

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  /* DARK / LIGHT MODE */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const savedTheme = localStorage.getItem("keyGuardTheme");

  document.body.classList.toggle("dark-mode", savedTheme === "dark");

  function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");

    if (themeIcon) {
      themeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );

      themeToggle.setAttribute(
        "title",
        isDark ? "Light mode" : "Dark mode"
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

  /* RTL */
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

  /* MOBILE MENU */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");

  function closeMobileMenu() {
    if (mainNav) {
      mainNav.classList.remove("mobile-open");
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      mobileMenuBtn.setAttribute("aria-label", "Open menu");
      mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
      refreshIcons();
    }
  }

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.setAttribute("aria-expanded", "false");

    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("mobile-open");

      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

      mobileMenuBtn.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );

      mobileMenuBtn.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';

      refreshIcons();
    });
  }

  /* HOME DROPDOWN */
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const navDropdown = document.querySelector(".nav-dropdown");

  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = navDropdown.classList.toggle("open");

      dropdownToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!navDropdown.contains(event.target)) {
        navDropdown.classList.remove("open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* CLOSE MENU AFTER NAVIGATION */
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();

      if (navDropdown) {
        navDropdown.classList.remove("open");
      }

      if (dropdownToggle) {
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* SCROLL REVEAL */
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
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("show");
    });
  }

  /* HERO MOUSE PARALLAX */
  const hero = document.querySelector(".services-hero");
  const heroImage = document.querySelector(".services-hero-image img");
  const floatingCard = document.querySelector(".hero-floating-card");

  if (hero && heroImage) {
    hero.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 801) return;

      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroImage.style.transform =
        `scale(1.06) translate(${x * -8}px, ${y * -5}px)`;

      if (floatingCard) {
        floatingCard.style.transform =
          `translate(${x * -8}px, ${y * -5}px)`;
      }
    });

    hero.addEventListener("mouseleave", () => {
      heroImage.style.transform = "";

      if (floatingCard) {
        floatingCard.style.transform = "";
      }
    });
  }

  /* SERVICE IMAGE HOVER */
  const imageCards = document.querySelectorAll(
    ".category-card, .feature-visual, .installation-visual, .specialist-card"
  );

  imageCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 801) return;

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--mouse-x", `${x * 2}deg`);
      card.style.setProperty("--mouse-y", `${y * -2}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });

  /* ACTIVE NAV LINK */
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
    } else {
      link.classList.remove("active");
    }
  });

  /* ESCAPE KEY */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (navDropdown) {
        navDropdown.classList.remove("open");
      }

      if (dropdownToggle) {
        dropdownToggle.setAttribute("aria-expanded", "false");
      }

      closeMobileMenu();
    }
  });

});

