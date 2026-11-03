"use strict";
(function () {
  const themeKey = "sadikshya-theme";
  const themes = ["light", "dark", "floral"];
  const themeButtons = Array.from(document.querySelectorAll("[data-set-theme]"));
  const navButtons = Array.from(document.querySelectorAll("[data-tab]"));
  const pages = Array.from(document.querySelectorAll("[data-page]"));
  const announcement = document.getElementById("announcement");

  function setTheme(theme, remember) {
    const chosen = themes.includes(theme) ? theme : "light";
    document.documentElement.dataset.theme = chosen;
    themeButtons.forEach(function (button) {
      const selected = button.dataset.setTheme === chosen;
      button.setAttribute("aria-pressed", String(selected));
    });
    if (remember) {
      try { localStorage.setItem(themeKey, chosen); } catch (error) {}
      if (announcement) announcement.textContent = chosen.charAt(0).toUpperCase() + chosen.slice(1) + " theme selected";
    }
  }

  function showPage(name, updateUrl) {
    const target = pages.find(function (page) { return page.dataset.page === name; });
    if (!target) return;
    pages.forEach(function (page) {
      const selected = page === target;
      page.hidden = !selected;
      page.classList.toggle("is-active", selected);
    });
    navButtons.forEach(function (button) {
      const selected = button.dataset.tab === name;
      button.classList.toggle("is-active", selected);
      if (selected) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (updateUrl && window.location.hash !== "#" + name) {
      history.replaceState(null, "", "#" + name);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () { setTheme(button.dataset.setTheme, true); });
  });
  navButtons.forEach(function (button) {
    button.addEventListener("click", function () { showPage(button.dataset.tab, true); });
  });
  document.querySelectorAll("[data-goto]").forEach(function (button) {
    button.addEventListener("click", function () { showPage(button.dataset.goto, true); });
  });
  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      const category = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(function (other) {
        const selected = other === button;
        other.classList.toggle("is-active", selected);
        other.setAttribute("aria-pressed", String(selected));
      });
      document.querySelectorAll(".project-card[data-category]").forEach(function (card) {
        card.hidden = category !== "all" && card.dataset.category !== category;
      });
    });
  });
  window.addEventListener("hashchange", function () {
    showPage(window.location.hash.slice(1), false);
  });
  const currentTheme = document.documentElement.dataset.theme;
  setTheme(currentTheme, false);
  showPage(window.location.hash.slice(1) || "about", false);
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
