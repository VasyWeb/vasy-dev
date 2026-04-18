import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

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

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
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
    copyButton: copyBtn
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
  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy CSS")
  );
  update();
};
