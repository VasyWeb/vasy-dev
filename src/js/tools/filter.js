import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

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
