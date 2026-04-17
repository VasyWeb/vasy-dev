import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const formatPxValue = (value) => {
  const rounded = Number(value.toFixed(4));
  return `${rounded}px`;
};

export const setupRemToPxConverter = () => {
  const remInput = getById("remValue");
  const baseInput = getById("remBaseFontSize");
  const output = getById("pxResult");
  const preview = getById("remPxPreview");
  const code = getById("remPxCode");
  const copyBtn = getById("copyRemPxBtn");

  if (!remInput || !baseInput || !output || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "rem_to_px_converter",
    controls: [
      {
        element: remInput,
        controlName: "rem_value",
        getValue: () => Number(remInput.value)
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
    const rem = Number(remInput.value) || 0;
    const base = Number(baseInput.value) || 16;
    const safeBase = base > 0 ? base : 16;
    const pxValue = formatPxValue(rem * safeBase);

    output.value = pxValue;
    code.textContent = pxValue;
    preview.textContent = `${rem}rem -> ${pxValue} (base ${safeBase}px)`;
  };

  [remInput, baseInput].forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy PX"));
  update();
};
