import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

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

  setupToolTracking({
    toolName: "text_shadow_generator",
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
        element: inputs.color,
        controlName: "shadow_color",
        getValue: () => inputs.color.value
      },
      {
        element: inputs.opacity,
        controlName: "shadow_opacity",
        getValue: () => Number(inputs.opacity.value)
      }
    ],
    copyButton: copyBtn
  });

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
