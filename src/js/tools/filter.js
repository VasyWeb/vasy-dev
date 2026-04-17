import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

export const setupFilterGenerator = () => {
  const inputs = {
    blur: getById("filterBlur"),
    brightness: getById("filterBrightness"),
    contrast: getById("filterContrast"),
    grayscale: getById("filterGrayscale"),
    saturate: getById("filterSaturate"),
    hueRotate: getById("filterHueRotate")
  };
  const preview = getById("filterPreview");
  const code = getById("filterCode");
  const copyBtn = getById("copyFilterBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "css_filter_generator",
    controls: [
      {
        element: inputs.blur,
        controlName: "blur",
        getValue: () => Number(inputs.blur.value)
      },
      {
        element: inputs.brightness,
        controlName: "brightness",
        getValue: () => Number(inputs.brightness.value)
      },
      {
        element: inputs.contrast,
        controlName: "contrast",
        getValue: () => Number(inputs.contrast.value)
      },
      {
        element: inputs.grayscale,
        controlName: "grayscale",
        getValue: () => Number(inputs.grayscale.value)
      },
      {
        element: inputs.saturate,
        controlName: "saturate",
        getValue: () => Number(inputs.saturate.value)
      },
      {
        element: inputs.hueRotate,
        controlName: "hue_rotate",
        getValue: () => Number(inputs.hueRotate.value)
      }
    ],
    copyButton: copyBtn
  });

  const update = () => {
    const blur = Number(inputs.blur.value);
    const brightness = Number(inputs.brightness.value);
    const contrast = Number(inputs.contrast.value);
    const grayscale = Number(inputs.grayscale.value);
    const saturate = Number(inputs.saturate.value);
    const hueRotate = Number(inputs.hueRotate.value);
    const value = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`;

    preview.style.filter = value;
    code.textContent = `filter: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
