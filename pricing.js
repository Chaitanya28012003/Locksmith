/* =====================================================
   KEYGUARD PRICING PAGE JS
   BASED ON HOME 2 SHARED DESIGN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* LUCIDE ICONS */
  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  refreshIcons();

  /* CURRENT YEAR */
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* HEADER SCROLL */
  const header = document.getElementById("siteHeader");

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  handleHeaderScroll();

  window.addEventListener("scroll", handleHeaderScroll, {
    passive: true
  });

  /* DARK / LIGHT MODE */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("keyGuardTheme");
  } catch (error) {
    savedTheme = null;
  }

  document.body.classList.toggle(
    "dark-mode",
    savedTheme === "dark"
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

      try {
        localStorage.setItem(
          "keyGuardTheme",
          isDark ? "dark" : "light"
        );
      } catch (error) {
        // Theme still works for the current page.
      }

      updateThemeButton();
    });
  }

  /* RTL / LTR */
  const rtlToggle = document.getElementById("rtlToggle");

  let savedDirection = null;

  try {
    savedDirection = localStorage.getItem("keyGuardDirection");
  } catch (error) {
    savedDirection = null;
  }

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

  applyDirection(savedDirection === "rtl");

  if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
      const isRTL = !document.body.classList.contains("rtl");

      applyDirection(isRTL);

      try {
        localStorage.setItem(
          "keyGuardDirection",
          isRTL ? "rtl" : "ltr"
        );
      } catch (error) {
        // Direction still works for the current page.
      }
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

      mobileMenuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

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

      dropdownToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    document.addEventListener("click", (event) => {
      if (!navDropdown.contains(event.target)) {
        navDropdown.classList.remove("open");

        dropdownToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }

  /* CLOSE MOBILE MENU AFTER NAVIGATION */
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();

      if (navDropdown) {
        navDropdown.classList.remove("open");
      }

      if (dropdownToggle) {
        dropdownToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  });

  /* FAQ ACCORDION */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = question
      ? question.querySelector("i, svg")
      : null;

    if (!question || !answer) return;

    // Sync the initial HTML state.
    const initiallyOpen = item.classList.contains("open");

    question.setAttribute(
      "aria-expanded",
      String(initiallyOpen)
    );

    answer.style.display = initiallyOpen ? "block" : "none";

    if (icon) {
      icon.setAttribute(
        "data-lucide",
        initiallyOpen ? "minus" : "plus"
      );
    }

    question.addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");

      // Keep one FAQ open at a time.
      faqItems.forEach((otherItem) => {
        const otherQuestion =
          otherItem.querySelector(".faq-question");

        const otherAnswer =
          otherItem.querySelector(".faq-answer");

        const otherIcon = otherQuestion
          ? otherQuestion.querySelector("i, svg")
          : null;

        otherItem.classList.remove("open");

        if (otherQuestion) {
          otherQuestion.setAttribute(
            "aria-expanded",
            "false"
          );
        }

        if (otherAnswer) {
          otherAnswer.style.display = "none";
        }

        if (otherIcon) {
          otherIcon.setAttribute(
            "data-lucide",
            "plus"
          );
        }
      });

      if (willOpen) {
        item.classList.add("open");

        question.setAttribute("aria-expanded", "true");
        answer.style.display = "block";

        if (icon) {
          icon.setAttribute("data-lucide", "minus");
        }
      }

      refreshIcons();
    });
  });

  refreshIcons();

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

  /* HERO MOUSE PARALLAX */
  const hero = document.querySelector(".pricing-hero");
  const heroImage = document.querySelector(
    ".pricing-hero .services-hero-image img"
  );

  const floatingCard = document.querySelector(
    ".pricing-hero .hero-floating-card"
  );

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

  /* PRICING CARD HOVER EFFECT */
  const pricingCards = document.querySelectorAll(
    ".pricing-service-card, .comparison-card, .process-card"
  );

  pricingCards.forEach((card) => {
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

    const target = href
      .split("/")
      .pop()
      .toLowerCase();

    const isCurrentPage =
      target === currentPage ||
      (currentPage === "" && target === "index.html");

    link.classList.toggle("active", isCurrentPage);
  });

  /* ESCAPE KEY */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (navDropdown) {
        navDropdown.classList.remove("open");
      }

      if (dropdownToggle) {
        dropdownToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      }

      closeMobileMenu();
    }
  });

});