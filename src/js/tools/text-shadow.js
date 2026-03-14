import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

export const setupTextShadowGenerator = () => {
  const inputs = {
    x: getById("textShadowX"),
    y: getById("textShadowY"),
    blur: getById("textShadowBlur"),
    color: getById("textShadowColor"),
    opacity: getById("textShadowOpacity")
  };
  const preview = getById("textShadowPreview");
  const code = getById("textShadowCode");
  const copyBtn = getById("copyTextShadowBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const hexToRgb = (hex) => {
    const normalized = hex.replace("#", "");
    const bigint = Number.parseInt(normalized, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };

  const update = () => {
    const x = Number(inputs.x.value);
    const y = Number(inputs.y.value);
    const blur = Number(inputs.blur.value);
    const opacity = Number(inputs.opacity.value);
    const { r, g, b } = hexToRgb(inputs.color.value);
    const value = `${x}px ${y}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`;

    preview.style.textShadow = value;
    code.textContent = `text-shadow: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
