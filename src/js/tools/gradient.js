import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

export const setupGradientGenerator = () => {
  const angle = getById("gradientAngle");
  const color1 = getById("gradientColor1");
  const color2 = getById("gradientColor2");
  const preview = getById("gradientPreview");
  const code = getById("gradientCode");
  const copyBtn = getById("copyGradientBtn");

  if (!angle || !color1 || !color2 || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "gradient_generator",
    controls: [
      {
        element: angle,
        controlName: "gradient_angle",
        getValue: () => Number(angle.value)
      },
      {
        element: color1,
        controlName: "gradient_color_start",
        getValue: () => color1.value
      },
      {
        element: color2,
        controlName: "gradient_color_end",
        getValue: () => color2.value
      }
    ],
    copyButton: copyBtn
  });

  const update = () => {
    const value = `linear-gradient(${Number(angle.value)}deg, ${color1.value}, ${color2.value})`;
    preview.style.background = value;
    code.textContent = `background: ${value};`;
  };

  [angle, color1, color2].forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
