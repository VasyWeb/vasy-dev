import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const freePresets = {
  soft_card: { x: 0, y: 14, blur: 32, spread: -12, opacity: 0.16 },
  clean_button: { x: 0, y: 8, blur: 18, spread: -8, opacity: 0.22 },
  floating_panel: { x: 0, y: 24, blur: 48, spread: -18, opacity: 0.24 },
  subtle_depth: { x: 0, y: 6, blur: 16, spread: -6, opacity: 0.14 }
};

const setInputValues = (inputs, values) => {
  Object.entries(values).forEach(([key, value]) => {
    if (inputs[key]) {
      inputs[key].value = String(value);
    }
  });
};

export const setupShadowGenerator = () => {
  const inputs = {
    x: getById("shadowX"),
    y: getById("shadowY"),
    blur: getById("shadowBlur"),
    spread: getById("shadowSpread"),
    opacity: getById("shadowOpacity")
  };
  const preview = getById("shadowPreview");
  const code = getById("shadowCode");
  const copyBtn = getById("copyShadowBtn");
  const feedback = getById("shadowFeedback");
  const proPrompt = getById("shadowProPrompt");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const presetButtons = Array.from(
    document.querySelectorAll("[data-shadow-free-preset]")
  );
  let presetInteractions = 0;

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
    presetButtons
  });

  const update = () => {
    const x = Number(inputs.x.value);
    const y = Number(inputs.y.value);
    const blur = Number(inputs.blur.value);
    const spread = Number(inputs.spread.value);
    const opacity = Number(inputs.opacity.value);
    const value = `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;

    preview.style.boxShadow = value;
    code.textContent = `box-shadow: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-shadow-free-preset");
      const preset = freePresets[presetName];

      if (!preset) {
        return;
      }

      setInputValues(inputs, preset);
      update();
      presetInteractions += 1;

      if (feedback) {
        feedback.textContent = "Ready to use. Copy below.";
      }

      if (proPrompt && presetInteractions >= 3) {
        proPrompt.hidden = false;
      }
    });
  });

  copyBtn.addEventListener("click", () => {
    withCopyFeedback(copyBtn, code.textContent, "Copy Ready-to-use CSS");

    if (feedback) {
      feedback.textContent = "Copied. Paste it into your project.";
    }
  });
  update();
};
