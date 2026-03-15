import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

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
