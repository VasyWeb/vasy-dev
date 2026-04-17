import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const formatRemValue = (value) => {
  const rounded = Number(value.toFixed(4));
  return `${rounded}rem`;
};

export const setupPxToRemConverter = () => {
  const pxInput = getById("pxValue");
  const baseInput = getById("baseFontSize");
  const output = getById("remResult");
  const preview = getById("pxRemPreview");
  const code = getById("pxRemCode");
  const copyBtn = getById("copyPxRemBtn");

  if (!pxInput || !baseInput || !output || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "px_to_rem_converter",
    controls: [
      {
        element: pxInput,
        controlName: "px_value",
        getValue: () => Number(pxInput.value)
      },
      {
        element: baseInput,
        controlName: "base_font_size",
        getValue: () => Number(baseInput.value)
      }
    ],
    copyButton: copyBtn
  });

  const update = () => {
    const px = Number(pxInput.value) || 0;
    const base = Number(baseInput.value) || 16;
    const safeBase = base > 0 ? base : 16;
    const remValue = formatRemValue(px / safeBase);

    output.value = remValue;
    code.textContent = remValue;
    preview.textContent = `${px}px / ${safeBase}px = ${remValue}`;
  };

  [pxInput, baseInput].forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy REM"));
  update();
};
