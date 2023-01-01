// src/utils/theme.js

export function getPreferredTheme() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function setTheme(theme) {
  if (
    theme === "auto" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }
}

export function setupThemeSwitcher() {
  const showActiveTheme = (theme) => {
    const activeThemeIcon = document.querySelector(".theme-icon-active use");
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );
    const svgOfActiveBtn = btnToActive
      ?.querySelector(".mode-switch use")
      ?.getAttribute("href");

    document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
      element.classList.remove("active");
    });

    if (btnToActive && activeThemeIcon && svgOfActiveBtn) {
      btnToActive.classList.add("active");
      activeThemeIcon.setAttribute("href", svgOfActiveBtn);
    }
  };

  // Appliquer thème préféré
  setTheme(getPreferredTheme());
  showActiveTheme(getPreferredTheme());

  // Changement OS
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme !== "light" && storedTheme !== "dark") {
        setTheme(getPreferredTheme());
        showActiveTheme(getPreferredTheme());
      }
    });

  // Ecoute sur les boutons de switch
  document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const theme = toggle.getAttribute("data-bs-theme-value");
      localStorage.setItem("theme", theme);
      setTheme(theme);
      showActiveTheme(theme);
    });
  });
}
