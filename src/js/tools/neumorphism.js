import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

const DEFAULTS = {
  background: "#e6edf5",
  radius: 24,
  distance: 14,
  blur: 28,
  intensity: 0.18,
  mode: "raised"
};

const PRESETS = {
  softCard: {
    background: "#e7eef8",
    radius: 24,
    distance: 14,
    blur: 28,
    intensity: 0.18,
    mode: "raised"
  },
  deepButton: {
    background: "#dfe7f2",
    radius: 18,
    distance: 18,
    blur: 36,
    intensity: 0.24,
    mode: "raised"
  },
  insetPanel: {
    background: "#e4ebf5",
    radius: 22,
    distance: 12,
    blur: 24,
    intensity: 0.17,
    mode: "inset"
  }
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : value;

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();

const mixColors = (base, target, amount) => ({
  r: base.r + (target.r - base.r) * amount,
  g: base.g + (target.g - base.g) * amount,
  b: base.b + (target.b - base.b) * amount
});

const formatShadowColor = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

export const setupNeumorphismGenerator = () => {
  const controls = {
    background: getById("neuroBackground"),
    radius: getById("neuroRadius"),
    radiusNumber: getById("neuroRadiusNumber"),
    distance: getById("neuroDistance"),
    distanceNumber: getById("neuroDistanceNumber"),
    blur: getById("neuroBlur"),
    blurNumber: getById("neuroBlurNumber"),
    intensity: getById("neuroIntensity"),
    intensityNumber: getById("neuroIntensityNumber"),
    mode: getById("neuroMode")
  };

  const previewSurface = getById("neuroPreviewSurface");
  const previewCard = getById("neuroPreviewCard");
  const code = getById("neuroCode");
  const copyBtn = getById("copyNeuroBtn");
  const resetBtn = getById("resetNeuroBtn");
  const presetButtons = document.querySelectorAll("[data-neuro-preset]");

  if (
    !Object.values(controls).every(Boolean) ||
    !previewSurface ||
    !previewCard ||
    !code ||
    !copyBtn ||
    !resetBtn
  ) {
    return;
  }

  const syncPair = (rangeInput, numberInput) => {
    const updateNumber = () => {
      numberInput.value = rangeInput.value;
    };

    const updateRange = () => {
      rangeInput.value = numberInput.value;
    };

    rangeInput.addEventListener("input", updateNumber);
    numberInput.addEventListener("input", updateRange);
    updateNumber();
  };

  syncPair(controls.radius, controls.radiusNumber);
  syncPair(controls.distance, controls.distanceNumber);
  syncPair(controls.blur, controls.blurNumber);
  syncPair(controls.intensity, controls.intensityNumber);

  const applyValues = (values) => {
    controls.background.value = values.background;
    controls.radius.value = String(values.radius);
    controls.radiusNumber.value = String(values.radius);
    controls.distance.value = String(values.distance);
    controls.distanceNumber.value = String(values.distance);
    controls.blur.value = String(values.blur);
    controls.blurNumber.value = String(values.blur);
    controls.intensity.value = String(values.intensity);
    controls.intensityNumber.value = String(values.intensity);
    controls.mode.value = values.mode;
  };

  const update = () => {
    const backgroundHex = controls.background.value.toUpperCase();
    const radius = Number(controls.radiusNumber.value);
    const distance = Number(controls.distanceNumber.value);
    const blur = Number(controls.blurNumber.value);
    const intensity = Number(controls.intensityNumber.value);
    const mode = controls.mode.value;

    const base = hexToRgb(backgroundHex);
    const darkColor = mixColors(base, { r: 0, g: 0, b: 0 }, intensity);
    const lightColor = mixColors(base, { r: 255, g: 255, b: 255 }, intensity);
    const darkValue = formatShadowColor(darkColor);
    const lightValue = formatShadowColor(lightColor);
    const shadowPrefix = mode === "inset" ? "inset " : "";
    const shadowValue = `${shadowPrefix}${distance}px ${distance}px ${blur}px ${darkValue}, ${shadowPrefix}-${distance}px -${distance}px ${blur}px ${lightValue}`;

    previewSurface.style.background = backgroundHex;
    previewCard.style.background = backgroundHex;
    previewCard.style.borderRadius = `${radius}px`;
    previewCard.style.boxShadow = shadowValue;
    previewCard.dataset.mode = mode;

    code.textContent = `.neumorphism-card {
  background: ${backgroundHex};
  border-radius: ${radius}px;
  box-shadow: ${shadowValue};
}`;
  };

  const registerInput = (input) => {
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  };

  Object.values(controls).forEach(registerInput);

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy CSS")
  );

  resetBtn.addEventListener("click", () => {
    applyValues(DEFAULTS);
    update();
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-neuro-preset");
      const preset = PRESETS[presetName];
      if (!preset) {
        return;
      }

      applyValues(preset);
      update();
    });
  });

  applyValues(DEFAULTS);
  update();
};
