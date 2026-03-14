import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

export const setupPaletteGenerator = () => {
  const swatchesRoot = getById("paletteSwatches");
  const randomBtn = getById("paletteRandomBtn");
  const exportBtn = getById("paletteExportBtn");
  const code = getById("paletteCode");

  if (!swatchesRoot || !randomBtn || !exportBtn || !code) {
    return;
  }

  const swatches = Array.from(swatchesRoot.querySelectorAll(".swatch"));
  const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;

  const updateCode = () => {
    const vars = swatches
      .map((swatch, index) => {
        const hex = swatch.querySelector(".swatch__hex").textContent;
        return `--color-${index + 1}: ${hex};`;
      })
      .join(" ");

    code.textContent = `:root { ${vars} }`;
  };

  swatchesRoot.addEventListener("click", (event) => {
    const lockBtn = event.target.closest(".swatch__lock");
    if (!lockBtn) {
      return;
    }

    const nextState = lockBtn.getAttribute("aria-pressed") !== "true";
    lockBtn.setAttribute("aria-pressed", String(nextState));
    lockBtn.textContent = nextState ? "Locked" : "Lock";
  });

  randomBtn.addEventListener("click", () => {
    swatches.forEach((swatch) => {
      const lockBtn = swatch.querySelector(".swatch__lock");
      const isLocked = lockBtn.getAttribute("aria-pressed") === "true";
      if (isLocked) {
        return;
      }

      const color = randomHex();
      swatch.querySelector(".swatch__color").style.background = color;
      swatch.querySelector(".swatch__hex").textContent = color;
    });
    updateCode();
  });

  exportBtn.addEventListener("click", () =>
    withCopyFeedback(exportBtn, code.textContent, "Export CSS Variables")
  );

  updateCode();
};
