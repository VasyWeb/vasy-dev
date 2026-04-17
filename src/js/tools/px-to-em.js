import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const formatEmValue = (value) => {
  const rounded = Number(value.toFixed(4));
  return `${rounded}em`;
};

export const setupPxToEmConverter = () => {
  const pxInput = getById("pxToEmValue");
  const baseInput = getById("emBaseFontSize");
  const output = getById("emResult");
  const preview = getById("pxEmPreview");
  const code = getById("pxEmCode");
  const copyBtn = getById("copyPxEmBtn");

  if (!pxInput || !baseInput || !output || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "px_to_em_converter",
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
    const emValue = formatEmValue(px / safeBase);

    output.value = emValue;
    code.textContent = emValue;
    preview.textContent = `${px}px / ${safeBase}px = ${emValue}`;
  };

  [pxInput, baseInput].forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy EM"));
  update();
};
