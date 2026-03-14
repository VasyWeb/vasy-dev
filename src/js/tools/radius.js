import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

export const setupRadiusGenerator = () => {
  const inputs = {
    tl: getById("radiusTl"),
    tr: getById("radiusTr"),
    br: getById("radiusBr"),
    bl: getById("radiusBl")
  };
  const preview = getById("radiusPreview");
  const code = getById("radiusCode");
  const copyBtn = getById("copyRadiusBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const tl = Number(inputs.tl.value);
    const tr = Number(inputs.tr.value);
    const br = Number(inputs.br.value);
    const bl = Number(inputs.bl.value);
    const value = `${tl}px ${tr}px ${br}px ${bl}px`;

    preview.style.borderRadius = value;
    code.textContent = `border-radius: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
