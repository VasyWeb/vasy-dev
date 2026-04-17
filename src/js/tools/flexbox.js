import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

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

  setupToolTracking({
    toolName: "flexbox_generator",
    controls: [
      {
        element: inputs.direction,
        controlName: "flex_direction",
        getValue: () => inputs.direction.value
      },
      {
        element: inputs.justifyContent,
        controlName: "justify_content",
        getValue: () => inputs.justifyContent.value
      },
      {
        element: inputs.alignItems,
        controlName: "align_items",
        getValue: () => inputs.alignItems.value
      },
      {
        element: inputs.gap,
        controlName: "gap",
        getValue: () => Number(inputs.gap.value)
      }
    ],
    copyButton: copyBtn
  });

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
