
/* =====================================================
   KEYGUARD CONTACT PAGE JAVASCRIPT
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
      // The page continues to work without storage.
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
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("show"));
  }

  /* CONTACT FORM */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("contactFormStatus");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const phone = document.getElementById("contactPhone").value.trim();
      const service = document.getElementById("contactService").value;
      const subject = document.getElementById("contactSubject").value.trim();
      const message = document.getElementById("contactMessage").value.trim();
      const consent = document.getElementById("contactConsent").checked;

      if (!name || !email || !service || !message || !consent) {
        formStatus.className = "contact-form-status visible error";
        formStatus.textContent =
          "Please complete all required fields and accept the contact consent.";
        return;
      }

      /*
        Replace this demo address with the real business email.
        This opens the visitor's email application; it does not send
        or store a message on a server.
      */
      const recipient = "info@yourdomain.com";

      const emailSubject = subject
        ? `KeyGuard Enquiry: ${subject}`
        : `KeyGuard Enquiry: ${service}`;

      const emailBody = [
        "KeyGuard Website Enquiry",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Service: ${service}`,
        `Subject: ${subject || "Not provided"}`,
        "",
        "Message:",
        message
      ].join("\n");

      const mailtoURL =
        `mailto:${recipient}` +
        `?subject=${encodeURIComponent(emailSubject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

      formStatus.className = "contact-form-status visible";
      formStatus.textContent =
        "Your email application should open with the enquiry details. " +
        "Please review and send the email there. If it does not open, " +
        "contact the business directly.";

      window.location.href = mailtoURL;
    });
  }

  /* ESCAPE KEY */
  document.addEventListener("keydown", (event) => {
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

