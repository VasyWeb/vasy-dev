import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

export const setupFlexboxGenerator = () => {
  const inputs = {
    direction: getById("flexDirection"),
    justifyContent: getById("flexJustifyContent"),
    alignItems: getById("flexAlignItems"),
    gap: getById("flexGap")
  };
  const preview = getById("flexPreview");
  const code = getById("flexCode");
  const copyBtn = getById("copyFlexBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const direction = inputs.direction.value;
    const justifyContent = inputs.justifyContent.value;
    const alignItems = inputs.alignItems.value;
    const gap = Number(inputs.gap.value);

    preview.style.display = "flex";
    preview.style.flexDirection = direction;
    preview.style.justifyContent = justifyContent;
    preview.style.alignItems = alignItems;
    preview.style.gap = `${gap}px`;

    code.textContent = `display: flex;
flex-direction: ${direction};
justify-content: ${justifyContent};
align-items: ${alignItems};
gap: ${gap}px;`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
