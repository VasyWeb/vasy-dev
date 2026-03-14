import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";

export const setupTransformGenerator = () => {
  const inputs = {
    rotate: getById("transformRotate"),
    scale: getById("transformScale"),
    translateX: getById("transformTranslateX"),
    translateY: getById("transformTranslateY")
  };
  const preview = getById("transformPreview");
  const code = getById("transformCode");
  const copyBtn = getById("copyTransformBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const update = () => {
    const rotate = Number(inputs.rotate.value);
    const scale = Number(inputs.scale.value);
    const translateX = Number(inputs.translateX.value);
    const translateY = Number(inputs.translateY.value);
    const value = `rotate(${rotate}deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;

    preview.style.transform = value;
    code.textContent = `transform: ${value};`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
