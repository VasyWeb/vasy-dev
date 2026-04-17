import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

export const setupGlassGenerator = () => {
  const inputs = {
    blur: getById("glassBlur"),
    bgOpacity: getById("glassBgOpacity"),
    radius: getById("glassRadius"),
    borderOpacity: getById("glassBorderOpacity")
  };
  const preview = getById("glassPreview");
  const code = getById("glassCode");
  const copyBtn = getById("copyGlassBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "glassmorphism_generator",
    controls: [
      {
        element: inputs.blur,
        controlName: "blur",
        getValue: () => Number(inputs.blur.value)
      },
      {
        element: inputs.bgOpacity,
        controlName: "background_opacity",
        getValue: () => Number(inputs.bgOpacity.value)
      },
      {
        element: inputs.radius,
        controlName: "border_radius",
        getValue: () => Number(inputs.radius.value)
      },
      {
        element: inputs.borderOpacity,
        controlName: "border_opacity",
        getValue: () => Number(inputs.borderOpacity.value)
      }
    ],
    copyButton: copyBtn
  });

  const update = () => {
    const blur = Number(inputs.blur.value);
    const bgOpacity = Number(inputs.bgOpacity.value);
    const radius = Number(inputs.radius.value);
    const borderOpacity = Number(inputs.borderOpacity.value);
    const background = `rgba(255, 255, 255, ${bgOpacity})`;
    const border = `1px solid rgba(255, 255, 255, ${borderOpacity})`;

    preview.style.backdropFilter = `blur(${blur}px)`;
    preview.style.webkitBackdropFilter = `blur(${blur}px)`;
    preview.style.background = background;
    preview.style.border = border;
    preview.style.borderRadius = `${radius}px`;

    code.textContent = `backdrop-filter: blur(${blur}px);
background: ${background};
border: ${border};
border-radius: ${radius}px;`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
