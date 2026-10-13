
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const rtlToggle = document.getElementById("rtlToggle");

    // Restore saved theme
    const savedTheme = localStorage.getItem("keyGuardTheme");
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
    }

    // Restore saved direction
    const savedDirection = localStorage.getItem("keyGuardDirection");
    if (savedDirection === "rtl") {
        body.classList.add("rtl");
        document.documentElement.setAttribute("dir", "rtl");
    } else {
        document.documentElement.setAttribute("dir", "ltr");
    }

    // Refresh Lucide icons safely
    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Update theme icon
    function updateThemeIcon() {
        if (!themeToggle) return;

        themeToggle.innerHTML = body.classList.contains("dark-mode")
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';

        refreshIcons();
    }

    // Dark mode button
    themeToggle?.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        const isDark = body.classList.contains("dark-mode");
        localStorage.setItem("keyGuardTheme", isDark ? "dark" : "light");

        updateThemeIcon();
    });

    // RTL button
    rtlToggle?.addEventListener("click", () => {
        const isRTL = body.classList.toggle("rtl");

        document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
        localStorage.setItem("keyGuardDirection", isRTL ? "rtl" : "ltr");

        refreshIcons();
    });

    // Initialize icons
    updateThemeIcon();
    refreshIcons();

    // Emergency form validation and demo response
    const emergencyForm = document.getElementById("emergencyForm");
    const formMessage = document.getElementById("formMessage");

    emergencyForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!emergencyForm.checkValidity()) {
            emergencyForm.reportValidity();
            return;
        }

        if (formMessage) {
            formMessage.textContent =
                "Your form details are valid. Connect this form to your email or backend to send the emergency request.";
            formMessage.classList.add("show");
            formMessage.classList.remove("error");
        }
    });
});