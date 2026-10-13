
/* =====================================================
   KEYGUARD GALLERY PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  refreshIcons();

  /* CURRENT YEAR */
  const currentYear = document.getElementById("currentYear");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* SAFE LOCAL STORAGE */
  function getSavedValue(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function saveValue(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Page continues to work if storage is unavailable.
    }
  }

  /* STICKY HEADER */
  const header = document.getElementById("siteHeader");

  function handleHeaderScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
  }

  handleHeaderScroll();

  window.addEventListener("scroll", handleHeaderScroll, {
    passive: true
  });

  /* DARK / LIGHT MODE */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  document.body.classList.toggle(
    "dark-mode",
    getSavedValue("keyGuardTheme") === "dark"
  );

  function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");

    if (themeIcon) {
      themeIcon.setAttribute(
        "data-lucide",
        isDark ? "sun" : "moon"
      );
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

      saveValue("keyGuardTheme", isDark ? "dark" : "light");
      updateThemeButton();
    });
  }

  /* RTL / LTR */
  const rtlToggle = document.getElementById("rtlToggle");

  function applyDirection(isRTL) {
    document.body.classList.toggle("rtl", isRTL);

    document.documentElement.setAttribute(
      "dir",
      isRTL ? "rtl" : "ltr"
    );

    if (rtlToggle) {
      rtlToggle.setAttribute(
        "aria-label",
        isRTL
          ? "Switch to left-to-right"
          : "Switch to right-to-left"
      );

      rtlToggle.setAttribute(
        "title",
        isRTL ? "LTR direction" : "RTL direction"
      );
    }
  }

  applyDirection(getSavedValue("keyGuardDirection") === "rtl");

  if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
      const isRTL = !document.body.classList.contains("rtl");

      applyDirection(isRTL);
      saveValue("keyGuardDirection", isRTL ? "rtl" : "ltr");
    });
  }

  /* MOBILE NAVIGATION */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");

  function closeMobileMenu() {
    if (mainNav) mainNav.classList.remove("mobile-open");

    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      mobileMenuBtn.setAttribute("aria-label", "Open menu");
      mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
      refreshIcons();
    }
  }

  if (mobileMenuBtn && mainNav) {
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

  /* ACTIVE NAV LINK */
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const target = href.split("/").pop().toLowerCase();

    link.classList.toggle(
      "active",
      target === currentPage ||
      (currentPage === "" && target === "index.html")
    );

    link.addEventListener("click", closeMobileMenu);
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

  /* GALLERY FILTERS */
  const filterButtons = document.querySelectorAll(".gallery-filter");
  const galleryCards = document.querySelectorAll(".gallery-card");
  const galleryEmpty = document.getElementById("galleryEmpty");

  let activeFilter = "all";

  function applyGalleryFilter(filter) {
    activeFilter = filter;
    let visibleCount = 0;

    galleryCards.forEach((card) => {
      const matches =
        filter === "all" || card.dataset.category === filter;

      card.hidden = !matches;

      if (matches) {
        visibleCount++;
        card.classList.add("show");
      }
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (galleryEmpty) {
      galleryEmpty.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyGalleryFilter(button.dataset.filter || "all");
    });
  });

  /* IMAGE LIGHTBOX */
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDescription = document.getElementById("lightboxDescription");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const imageButtons = Array.from(
    document.querySelectorAll(".gallery-image-button")
  );

  let currentImageIndex = 0;
  let lastFocusedElement = null;

  function getVisibleImageButtons() {
    return imageButtons.filter((button) => {
      const card = button.closest(".gallery-card");

      return card && !card.hidden;
    });
  }

  function showLightboxImage(button) {
    if (!button || !lightboxImage) return;

    const fullImage = button.dataset.full ||
      button.querySelector("img")?.src || "";

    const thumbnail = button.querySelector("img");

    lightboxImage.src = fullImage;
    lightboxImage.alt = thumbnail ? thumbnail.alt : "Gallery image";

    if (lightboxTitle) {
      lightboxTitle.textContent = button.dataset.title || "KeyGuard Gallery";
    }

    if (lightboxDescription) {
      lightboxDescription.textContent =
        button.dataset.description || "";
    }
  }

  function openLightbox(button) {
    if (!lightbox) return;

    lastFocusedElement = button;

    const visibleButtons = getVisibleImageButtons();
    currentImageIndex = visibleButtons.indexOf(button);

    if (currentImageIndex < 0) currentImageIndex = 0;

    showLightboxImage(visibleButtons[currentImageIndex]);

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-lightbox-open");

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-lightbox-open");

    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
    }

    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function moveLightbox(step) {
    const visibleButtons = getVisibleImageButtons();
    if (!visibleButtons.length) return;

    currentImageIndex =
      (currentImageIndex + step + visibleButtons.length) %
      visibleButtons.length;

    showLightboxImage(visibleButtons[currentImageIndex]);
  }

  imageButtons.forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => moveLightbox(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => moveLightbox(1));
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  /* KEYBOARD CONTROLS */
  document.addEventListener("keydown", (event) => {
    if (lightbox && lightbox.classList.contains("open")) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
      return;
    }

    if (event.key === "Escape") {
      if (navDropdown) navDropdown.classList.remove("open");

      if (dropdownToggle) {
        dropdownToggle.setAttribute("aria-expanded", "false");
      }

      closeMobileMenu();
    }
  });

  refreshIcons();
});

