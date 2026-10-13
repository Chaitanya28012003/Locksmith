/* =====================================================
   KEYGUARD ABOUT PAGE JAVASCRIPT
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

  /* STICKY HEADER */
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
      // The page still works if browser storage is unavailable.
    }
  }

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

  /* RTL / LTR TOGGLE */
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

  /* CLOSE MENU AFTER NAVIGATION */
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

  /* ACTIVE NAV LINK */
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const target = href.split("/").pop().toLowerCase();

    const isCurrentPage =
      target === currentPage ||
      (currentPage === "" && target === "index.html");

    link.classList.toggle("active", isCurrentPage);
  });

  /* FAQ ACCORDION */
  const faqItems = document.querySelectorAll(".about-faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".about-faq-question");
    const answer = item.querySelector(".about-faq-answer");

    if (!question || !answer) return;

    const initiallyOpen = item.classList.contains("open");

    question.setAttribute(
      "aria-expanded",
      String(initiallyOpen)
    );

    answer.style.display = initiallyOpen ? "block" : "none";

    function updateFaqIcon(open) {
      const icon = question.querySelector("i, svg");

      if (icon) {
        icon.setAttribute(
          "data-lucide",
          open ? "minus" : "plus"
        );
      }
    }

    updateFaqIcon(initiallyOpen);

    question.addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");

      // Close all FAQ items first.
      faqItems.forEach((otherItem) => {
        const otherQuestion =
          otherItem.querySelector(".about-faq-question");

        const otherAnswer =
          otherItem.querySelector(".about-faq-answer");

        otherItem.classList.remove("open");

        if (otherQuestion) {
          otherQuestion.setAttribute(
            "aria-expanded",
            "false"
          );

          const otherIcon = otherQuestion.querySelector("i, svg");

          if (otherIcon) {
            otherIcon.setAttribute("data-lucide", "plus");
          }
        }

        if (otherAnswer) {
          otherAnswer.style.display = "none";
        }
      });

      // Open the selected item.
      if (willOpen) {
        item.classList.add("open");

        question.setAttribute("aria-expanded", "true");
        answer.style.display = "block";

        updateFaqIcon(true);
      }

      refreshIcons();
    });
  });

  /* SCROLL REVEAL ANIMATION */
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

  /* HERO IMAGE PARALLAX */
  const hero = document.querySelector(".about-hero");

  const heroImage = document.querySelector(
    ".about-hero .services-hero-image img"
  );

  const floatingCard = document.querySelector(
    ".about-hero .hero-floating-card"
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

  /* CARD MOUSE EFFECT */
  const cards = document.querySelectorAll(
    ".about-value-card, .about-why-card"
  );

  cards.forEach((card) => {
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

  refreshIcons();
});