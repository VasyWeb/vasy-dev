const ACCESS_STORAGE_KEY = "vasy_pro_access";
const PRO_ACCESS_CODE = "REPLACE_WITH_MY_ACCESS_CODE";
const GUMROAD_URL = "REPLACE_WITH_MY_GUMROAD_LINK";

const isProPage = () => window.location.pathname.startsWith("/tools/pro/");

const hasProAccess = () => localStorage.getItem(ACCESS_STORAGE_KEY) === "unlocked";

const createPaywall = () => {
  const section = document.createElement("section");
  section.className = "pro-paywall section-block section-slice section-slice--a";
  section.setAttribute("aria-labelledby", "proPaywallTitle");
  section.innerHTML = `
    <div class="pro-paywall__container l-container">
      <div class="pro-paywall__card">
        <p class="pro-paywall__eyebrow">Premium Access</p>
        <h1 id="proPaywallTitle">Unlock Pro Tools</h1>
        <p class="pro-paywall__lead">
          Get presets, better exports, real UI previews and faster workflows for the premium CSS tools.
        </p>
        <div class="pro-paywall__actions">
          <a class="button service-card__action--pro" href="${GUMROAD_URL}" target="_blank" rel="noopener noreferrer" data-cta>
            Buy Access
          </a>
        </div>
        <form class="pro-paywall__form" id="proPaywallForm">
          <label class="pro-paywall__label" for="proAccessCode">
            Access code
          </label>
          <div class="pro-paywall__unlock-row">
            <input id="proAccessCode" class="pro-paywall__input" type="text" autocomplete="off" placeholder="Enter your access code" />
            <button class="button" type="submit">Unlock</button>
          </div>
          <p class="pro-paywall__message" id="proPaywallMessage" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;

  return section;
};

export const setupProPaywall = () => {
  if (!isProPage() || hasProAccess()) {
    return;
  }

  const main = document.querySelector(".site-main");
  if (!main) {
    return;
  }

  const paywall = createPaywall();
  document.body.classList.add("page--pro-locked");
  main.prepend(paywall);

  const form = paywall.querySelector("#proPaywallForm");
  const input = paywall.querySelector("#proAccessCode");
  const message = paywall.querySelector("#proPaywallMessage");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const submittedCode = input?.value.trim() || "";

    if (submittedCode === PRO_ACCESS_CODE) {
      localStorage.setItem(ACCESS_STORAGE_KEY, "unlocked");
      message.textContent = "Access unlocked. Reloading...";
      window.location.reload();
      return;
    }

    message.textContent = "Invalid access code. Please check your Gumroad purchase email.";
    input?.focus();
  });
};
