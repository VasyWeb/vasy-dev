import { getById } from "../utils/dom.js";

export const setupNav = () => {
  const toggleButton = getById("siteNavToggle");
  const navList = getById("siteNavList");
  const openClass = "site-nav__list--open";

  if (!toggleButton || !navList) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle(openClass);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  navList.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link || !navList.classList.contains(openClass)) {
      return;
    }

    navList.classList.remove(openClass);
    toggleButton.setAttribute("aria-expanded", "false");
  });
};
