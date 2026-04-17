import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const animationDefinitions = {
  fadeIn: {
    label: "fade-in",
    keyframes: `@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}`
  },
  slideUp: {
    label: "slide-up",
    keyframes: `@keyframes slideUp {
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
}`
  },
  scaleIn: {
    label: "scale-in",
    keyframes: `@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.75); }
  100% { opacity: 1; transform: scale(1); }
}`
  },
  rotateIn: {
    label: "rotate",
    keyframes: `@keyframes rotateIn {
  0% { opacity: 0; transform: rotate(-20deg) scale(0.9); }
  100% { opacity: 1; transform: rotate(0deg) scale(1); }
}`
  }
};

export const setupAnimationGenerator = () => {
  const inputs = {
    name: getById("animationName"),
    duration: getById("animationDuration"),
    timingFunction: getById("animationTimingFunction"),
    iterationCount: getById("animationIterationCount")
  };
  const preview = getById("animationPreview");
  const code = getById("animationCode");
  const copyBtn = getById("copyAnimationBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "css_animation_generator",
    controls: [
      {
        element: inputs.name,
        controlName: "animation_name",
        getValue: () => inputs.name.value
      },
      {
        element: inputs.duration,
        controlName: "duration_seconds",
        getValue: () => Number(inputs.duration.value)
      },
      {
        element: inputs.timingFunction,
        controlName: "timing_function",
        getValue: () => inputs.timingFunction.value
      },
      {
        element: inputs.iterationCount,
        controlName: "iteration_count",
        getValue: () => inputs.iterationCount.value
      }
    ],
    copyButton: copyBtn
  });

  const update = () => {
    const name = inputs.name.value;
    const duration = Number(inputs.duration.value).toFixed(1).replace(".0", "");
    const timingFunction = inputs.timingFunction.value;
    const iterationCount = inputs.iterationCount.value;
    const keyframes = animationDefinitions[name].keyframes;

    preview.style.animation = "none";
    void preview.offsetWidth;
    preview.style.animation = `${name} ${duration}s ${timingFunction} ${iterationCount}`;

    code.textContent = `${keyframes}

.element {
  animation: ${name} ${duration}s ${timingFunction} ${iterationCount};
}`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
