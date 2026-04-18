import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import {
  setupToolTracking,
  trackToolInteraction
} from "../utils/analytics.js";

const PRESETS = {
  "soft-card": {
    values: { x: 14, y: 18, blur: 36, spread: -12, opacity: 0.18 },
    theme: "light"
  },
  "button-depth": {
    values: { x: 0, y: 10, blur: 24, spread: -10, opacity: 0.24 },
    theme: "light"
  },
  "floating-card": {
    shadowValue:
      "0 18px 38px -16px rgba(15, 23, 42, 0.28), 0 10px 18px -14px rgba(59, 130, 246, 0.26)",
    theme: "light"
  },
  "dark-ui": {
    shadowValue:
      "0 24px 60px -24px rgba(0, 0, 0, 0.72), 0 10px 24px -18px rgba(15, 23, 42, 0.8)",
    theme: "dark"
  },
  "neumorphic-soft": {
    shadowValue:
      "18px 18px 34px rgb(201, 209, 219), -18px -18px 34px rgb(255, 255, 255)",
    theme: "light"
  }
};

const HISTORY_LIMIT = 6;

const formatShadowValue = ({ x, y, blur, spread, opacity }) =>
  `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;

const getCssSnippet = (shadowValue) => `box-shadow: ${shadowValue};`;

const getScssSnippet = (shadowValue) => `$shadow-elevated: ${shadowValue};`;

const getTailwindSnippet = (shadowValue) => `boxShadow: {
  elevated: "${shadowValue}"
}`;

export const setupShadowGenerator = () => {
  const inputs = {
    x: getById("shadowX"),
    y: getById("shadowY"),
    blur: getById("shadowBlur"),
    spread: getById("shadowSpread"),
    opacity: getById("shadowOpacity")
  };
  const preview = getById("shadowPreview");
  const previewTargets = {
    card: getById("shadowPreviewCard"),
    button: getById("shadowPreviewButton"),
    input: getById("shadowPreviewInput"),
    modal: getById("shadowPreviewModal")
  };
  const previewPanels = document.querySelectorAll("[data-shadow-panel]");
  const componentTabs = document.querySelectorAll("[data-shadow-component]");
  const formatTabs = document.querySelectorAll("[data-shadow-format]");
  const presetButtons = document.querySelectorAll("[data-shadow-preset]");
  const variantsRoot = getById("shadowVariants");
  const historyRoot = getById("shadowHistory");
  const generateVariantsBtn = getById("generateShadowVariantsBtn");
  const code = getById("shadowCode");
  const copyBtn = getById("copyShadowBtn");

  if (
    !Object.values(inputs).every(Boolean) ||
    !preview ||
    !Object.values(previewTargets).every(Boolean) ||
    !variantsRoot ||
    !historyRoot ||
    !generateVariantsBtn ||
    !code ||
    !copyBtn
  ) {
    return;
  }

  setupToolTracking({
    toolName: "box_shadow_generator",
    controls: [
      {
        element: inputs.x,
        controlName: "horizontal_offset",
        getValue: () => Number(inputs.x.value)
      },
      {
        element: inputs.y,
        controlName: "vertical_offset",
        getValue: () => Number(inputs.y.value)
      },
      {
        element: inputs.blur,
        controlName: "blur_radius",
        getValue: () => Number(inputs.blur.value)
      },
      {
        element: inputs.spread,
        controlName: "spread_radius",
        getValue: () => Number(inputs.spread.value)
      },
      {
        element: inputs.opacity,
        controlName: "shadow_opacity",
        getValue: () => Number(inputs.opacity.value)
      }
    ],
    copyButton: copyBtn,
    presetButtons: Array.from(presetButtons)
  });

  const state = {
    component: "card",
    format: "css",
    theme: "light",
    customShadow: "",
    history: []
  };

  const setActiveState = (elements, activeValue, attribute) => {
    elements.forEach((element) => {
      const isActive = element.getAttribute(attribute) === activeValue;
      element.classList.toggle("is-active", isActive);
    });
  };

  const applyShadowToActivePreview = (shadowValue) => {
    Object.entries(previewTargets).forEach(([key, element]) => {
      element.style.boxShadow = key === state.component ? shadowValue : "none";
    });
  };

  const getCurrentShadowValue = () =>
    state.customShadow ||
    formatShadowValue({
      x: Number(inputs.x.value),
      y: Number(inputs.y.value),
      blur: Number(inputs.blur.value),
      spread: Number(inputs.spread.value),
      opacity: Number(inputs.opacity.value)
    });

  const getFormattedCode = (shadowValue) => {
    if (state.format === "scss") {
      return getScssSnippet(shadowValue);
    }

    if (state.format === "tailwind") {
      return getTailwindSnippet(shadowValue);
    }

    return getCssSnippet(shadowValue);
  };

  const pushHistory = (label, shadowValue, theme = state.theme) => {
    const nextEntry = { label, shadowValue, theme };
    state.history = [
      nextEntry,
      ...state.history.filter((entry) => entry.shadowValue !== shadowValue)
    ].slice(0, HISTORY_LIMIT);
    renderHistory();
  };

  const renderHistory = () => {
    if (!state.history.length) {
      historyRoot.innerHTML =
        '<p class="shadow-generator__empty">Apply a preset or a generated variation to keep it here.</p>';
      return;
    }

    historyRoot.innerHTML = "";
    state.history.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "shadow-generator__history-chip";
      button.textContent = entry.label;
      button.addEventListener("click", () => {
        state.customShadow = entry.shadowValue;
        state.theme = entry.theme || "light";
        trackToolInteraction(
          "box_shadow_generator",
          "apply_history",
          entry.label
        );
        render("history");
      });
      historyRoot.appendChild(button);
    });
  };

  const createVariants = () => {
    const x = Number(inputs.x.value);
    const y = Number(inputs.y.value);
    const blur = Number(inputs.blur.value);
    const spread = Number(inputs.spread.value);
    const opacity = Number(inputs.opacity.value);

    return [
      {
        label: "Soft Lift",
        shadowValue: `${x}px ${y + 6}px ${blur + 16}px ${spread - 10}px rgba(15, 23, 42, ${Math.min(
          opacity + 0.06,
          0.5
        )})`
      },
      {
        label: "Product Card",
        shadowValue: `${x}px ${y + 12}px ${blur + 22}px ${spread - 14}px rgba(15, 23, 42, ${Math.min(
          opacity + 0.12,
          0.56
        )}), 0 8px 18px -14px rgba(59, 130, 246, 0.2)`
      },
      {
        label: "Button Hover",
        shadowValue: `0 ${Math.max(y, 8)}px ${blur + 8}px ${Math.min(
          spread,
          0
        )}px rgba(37, 99, 235, ${Math.min(opacity + 0.08, 0.44)})`
      },
      {
        label: "Modal Depth",
        shadowValue: `0 22px 60px -28px rgba(15, 23, 42, ${Math.min(
          opacity + 0.18,
          0.62
        )}), 0 14px 24px -18px rgba(15, 23, 42, 0.18)`
      },
      {
        label: "Dark Surface",
        shadowValue:
          "0 24px 50px -28px rgba(0, 0, 0, 0.78), 0 10px 20px -16px rgba(15, 23, 42, 0.62)",
        theme: "dark"
      },
      {
        label: "Layered Soft",
        shadowValue: `${x}px ${y + 4}px ${blur + 10}px ${spread - 6}px rgba(15, 23, 42, ${Math.min(
          opacity + 0.08,
          0.46
        )}), ${Math.round(x / 2)}px ${Math.round(y / 2)}px ${Math.round(
          blur / 2
        )}px ${spread}px rgba(15, 23, 42, ${Math.min(opacity * 0.7, 0.24)})`
      }
    ];
  };

  const renderVariants = (variants = []) => {
    if (!variants.length) {
      variantsRoot.innerHTML =
        '<p class="shadow-generator__empty">Generate pro variations to compare modern shadow directions.</p>';
      return;
    }

    variantsRoot.innerHTML = "";
    variants.forEach((variant) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "shadow-generator__variant";
      button.textContent = variant.label;
      button.addEventListener("click", () => {
        state.customShadow = variant.shadowValue;
        state.theme = variant.theme || state.theme;
        pushHistory(variant.label, variant.shadowValue, state.theme);
        trackToolInteraction(
          "box_shadow_generator",
          "apply_variant",
          variant.label
        );
        render("variant");
      });
      variantsRoot.appendChild(button);
    });
  };

  const render = (source = "manual") => {
    if (source === "manual") {
      state.customShadow = "";
      state.theme = "light";
    }

    const shadowValue = getCurrentShadowValue();
    preview.dataset.shadowTheme = state.theme;
    setActiveState(componentTabs, state.component, "data-shadow-component");
    setActiveState(previewPanels, state.component, "data-shadow-panel");
    setActiveState(formatTabs, state.format, "data-shadow-format");
    applyShadowToActivePreview(shadowValue);
    copyBtn.textContent = `Copy ${state.format.toUpperCase()}`;
    code.textContent = getFormattedCode(shadowValue);
  };

  Object.values(inputs).forEach((input) =>
    input.addEventListener("input", () => render("manual"))
  );

  componentTabs.forEach((button) => {
    button.addEventListener("click", () => {
      state.component = button.getAttribute("data-shadow-component");
      trackToolInteraction(
        "box_shadow_generator",
        "preview_component",
        state.component
      );
      render("component");
    });
  });

  formatTabs.forEach((button) => {
    button.addEventListener("click", () => {
      state.format = button.getAttribute("data-shadow-format");
      trackToolInteraction(
        "box_shadow_generator",
        "export_format",
        state.format
      );
      render("format");
    });
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-shadow-preset");
      const preset = PRESETS[presetName];
      if (!preset) {
        return;
      }

      if (preset.values) {
        inputs.x.value = String(preset.values.x);
        inputs.y.value = String(preset.values.y);
        inputs.blur.value = String(preset.values.blur);
        inputs.spread.value = String(preset.values.spread);
        inputs.opacity.value = String(preset.values.opacity);
        state.customShadow = "";
      } else {
        state.customShadow = preset.shadowValue;
      }

      state.theme = preset.theme || "light";
      pushHistory(button.textContent.trim(), getCurrentShadowValue(), state.theme);
      render("preset");
    });
  });

  generateVariantsBtn.addEventListener("click", () => {
    renderVariants(createVariants());
    trackToolInteraction("box_shadow_generator", "generate_variants", "clicked");
  });

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, `Copy ${state.format.toUpperCase()}`)
  );

  renderVariants();
  renderHistory();
  render();
};
