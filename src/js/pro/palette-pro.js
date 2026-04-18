import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const presets = {
  saas: ["#2563EB", "#38BDF8", "#0F172A", "#E2E8F0", "#F8FAFC"],
  dark_ui: ["#8B5CF6", "#38BDF8", "#0F172A", "#1E293B", "#E2E8F0"],
  pastel: ["#F9A8D4", "#C4B5FD", "#BFDBFE", "#FDE68A", "#FFF7ED"],
  bold_startup: ["#FB7185", "#F59E0B", "#0EA5E9", "#111827", "#F8FAFC"],
  editorial: ["#1F2937", "#6B7280", "#F9FAFB", "#D97706", "#B91C1C"]
};

const toRgb = (hex) => {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((part) => part + part)
          .join("")
      : value;

  const int = Number.parseInt(normalized, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
};

const mixColor = (hex, target, amount) => {
  const from = toRgb(hex);
  const to = toRgb(target);
  const mix = (start, end) => Math.round(start + (end - start) * amount);

  return `#${[mix(from.r, to.r), mix(from.g, to.g), mix(from.b, to.b)]
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
};

const formatExport = (format, colors) => {
  if (format === "scss") {
    return colors
      .map((color, index) => `$palette-${index + 1}: ${color};`)
      .join("\n");
  }

  if (format === "json") {
    const payload = colors.reduce((accumulator, color, index) => {
      accumulator[`color${index + 1}`] = color;
      return accumulator;
    }, {});
    return JSON.stringify(payload, null, 2);
  }

  return `:root {\n${colors
    .map((color, index) => `  --color-${index + 1}: ${color};`)
    .join("\n")}\n}`;
};

export const setupPalettePro = () => {
  const swatchesRoot = getById("paletteSwatches");
  const code = getById("proPaletteCode");
  const copyBtn = getById("copyProPaletteBtn");
  const demo = getById("proPaletteDemo");
  const scaleRoot = getById("proPaletteScale");
  const contrastNote = getById("proPaletteContrast");

  if (!swatchesRoot || !code || !copyBtn || !demo || !scaleRoot || !contrastNote) {
    return;
  }

  const swatches = Array.from(swatchesRoot.querySelectorAll(".swatch"));
  const presetButtons = Array.from(document.querySelectorAll("[data-palette-preset]"));
  const formatButtons = Array.from(document.querySelectorAll("[data-palette-format]"));
  const state = { format: "css" };

  const getColors = () =>
    swatches.map((swatch) => swatch.querySelector(".swatch__hex").textContent.trim());

  const setColors = (colors) => {
    swatches.forEach((swatch, index) => {
      const color = colors[index];
      swatch.querySelector(".swatch__color").style.background = color;
      swatch.querySelector(".swatch__hex").textContent = color;
    });
  };

  const renderScale = (baseColor) => {
    scaleRoot.innerHTML = "";
    [0.14, 0.3, 0.48, 0.68].forEach((amount, index) => {
      const chip = document.createElement("span");
      chip.className = "pro-tool__chip";
      chip.textContent = `Shade ${index + 1}`;
      chip.style.background = mixColor(baseColor, "#0F172A", amount);
      chip.style.color = "#F8FAFC";
      scaleRoot.append(chip);
    });
  };

  const renderDemo = (colors) => {
    const [primary, secondary, surface, accent, background] = colors;
    demo.style.setProperty("--demo-primary", primary);
    demo.style.setProperty("--demo-secondary", secondary);
    demo.style.setProperty("--demo-surface", surface);
    demo.style.setProperty("--demo-accent", accent);
    demo.style.setProperty("--demo-background", background);

    demo.querySelector("[data-demo-card]").style.background = surface;
    demo.querySelector("[data-demo-card]").style.color = primary;
    demo.querySelector("[data-demo-button]").style.background = primary;
    demo.querySelector("[data-demo-button]").style.color = background;
    demo.querySelector("[data-demo-badge]").style.background = accent;
    demo.querySelector("[data-demo-badge]").style.color = background;

    const contrastPrimary = toRgb(primary);
    const contrastBackground = toRgb(background);
    const delta =
      Math.abs(contrastPrimary.r - contrastBackground.r) +
      Math.abs(contrastPrimary.g - contrastBackground.g) +
      Math.abs(contrastPrimary.b - contrastBackground.b);
    contrastNote.textContent =
      delta > 320
        ? "Contrast looks strong enough for headline and button use."
        : "Try a darker primary or lighter surface for stronger contrast.";
  };

  const update = () => {
    const colors = getColors();
    code.textContent = formatExport(state.format, colors);
    renderScale(colors[0]);
    renderDemo(colors);
  };

  setupToolTracking({
    toolName: "color_palette_generator_pro",
    copyButton: copyBtn,
    copyButtonName: "export_premium_palette",
    presetButtons
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-palette-preset");
      const colors = presets[presetName];
      if (!colors) {
        return;
      }

      setColors(colors);
      update();
    });
  });

  formatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.format = button.getAttribute("data-palette-format");
      formatButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      update();
    });
  });

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy Pro Export")
  );

  formatButtons[0]?.classList.add("is-active");
  formatButtons[0]?.setAttribute("aria-pressed", "true");
  update();
};

setupPalettePro();
