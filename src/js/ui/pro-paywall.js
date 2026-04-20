const ACCESS_STORAGE_KEY = "vasy_pro_access";
const PRO_ACCESS_CODE = "VASY-PRO-2026";
const GUMROAD_URL = "https://milanjakub.gumroad.com/l/vasy-pro-tools";

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
        <h1 id="proPaywallTitle">Stop wasting time tweaking CSS by hand.</h1>
        <p class="pro-paywall__lead">
          Unlock Pro Tools for presets, better exports, real UI previews and faster frontend workflows.
        </p>
        <div class="pro-paywall__actions">
          <a class="button service-card__action--pro" href="${GUMROAD_URL}" target="_blank" rel="noopener noreferrer" data-cta>
            Buy Pro Access
          </a>
        </div>
        <ul class="pro-paywall__proof-list" aria-label="Premium access benefits">
          <li>Instant access after purchase</li>
          <li>One-time payment</li>
          <li>No subscription</li>
          <li>All current Pro tools included</li>
        </ul>
        <div class="pro-paywall__preview" aria-label="Locked premium preview">
          <div class="pro-paywall__preview-copy">
            <p class="pro-paywall__eyebrow">Premium Preview</p>
            <h2>See the workflow before you unlock it.</h2>
            <p>
              Pro tools are built for reusable presets, export-ready code and real UI components.
            </p>
          </div>
          <div class="pro-paywall__chips">
            <span>Shadow presets</span>
            <span>SCSS/Tailwind exports</span>
            <span>Real UI previews</span>
          </div>
          <div class="pro-paywall__locked-demo">
            <article>
              <strong>Premium preview locked</strong>
              <span>Unlock to use the full Pro workflow.</span>
            </article>
          </div>
        </div>
        <form class="pro-paywall__form" id="proPaywallForm">
          <p class="pro-paywall__helper">Enter your Gumroad access code below after purchase.</p>
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
