import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const presets = {
  hero_glow: {
    mode: "linear",
    colors: ["#2563EB", "#7C3AED", "#EC4899", "#F59E0B"],
    angle: 135
  },
  dark_saas: {
    mode: "linear",
    colors: ["#0F172A", "#1D4ED8", "#312E81", "#020617"],
    angle: 155
  },
  vibrant_startup: {
    mode: "conic",
    colors: ["#06B6D4", "#2563EB", "#8B5CF6", "#F43F5E"],
    angle: 180
  },
  pastel_ui: {
    mode: "radial",
    colors: ["#FDE68A", "#F9A8D4", "#BFDBFE", "#C4B5FD"],
    angle: 90
  }
};

const buildStops = (colors) =>
  colors
    .filter(Boolean)
    .map((color, index, list) => `${color} ${Math.round((index / (list.length - 1 || 1)) * 100)}%`)
    .join(", ");

const buildGradient = ({ mode, angle, colors }) => {
  const stops = buildStops(colors);

  if (mode === "radial") {
    return `radial-gradient(circle at top left, ${stops})`;
  }

  if (mode === "conic") {
    return `conic-gradient(from ${angle}deg, ${stops})`;
  }

  return `linear-gradient(${angle}deg, ${stops})`;
};

const formatCode = (format, gradientValue, target) => {
  const property =
    target === "text"
      ? `background: ${gradientValue};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;`
      : `background: ${gradientValue};`;

  if (format === "scss") {
    return `$premium-gradient: ${gradientValue};

.hero {
  ${property}
}`;
  }

  if (format === "tailwind") {
    return `backgroundImage: {
  premium: "${gradientValue}"
}`;
  }

  return property;
};

const setActive = (buttons, value, attribute) => {
  buttons.forEach((button) => {
    const isActive = button.getAttribute(attribute) === value;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

export const setupGradientPro = () => {
  const angle = getById("gradientAngle");
  const color1 = getById("gradientColor1");
  const color2 = getById("gradientColor2");
  const color3 = getById("proGradientColor3");
  const color4 = getById("proGradientColor4");
  const preview = getById("proGradientPreview");
  const code = getById("proGradientCode");
  const copyBtn = getById("copyProGradientBtn");

  if (!angle || !color1 || !color2 || !color3 || !color4 || !preview || !code || !copyBtn) {
    return;
  }

  const presetButtons = Array.from(document.querySelectorAll("[data-gradient-preset]"));
  const modeButtons = Array.from(document.querySelectorAll("[data-gradient-mode]"));
  const targetButtons = Array.from(document.querySelectorAll("[data-gradient-target]"));
  const formatButtons = Array.from(document.querySelectorAll("[data-gradient-format]"));
  const samples = Array.from(document.querySelectorAll("[data-gradient-sample]"));

  const state = {
    mode: "linear",
    target: "hero",
    format: "css"
  };

  const getColors = () => [color1.value, color2.value, color3.value, color4.value];

  const renderTarget = (gradientValue) => {
    samples.forEach((sample) => {
      const isActive = sample.getAttribute("data-gradient-sample") === state.target;
      sample.classList.toggle("is-active", isActive);
      if (!isActive) {
        return;
      }

      if (state.target === "text") {
        sample.style.background = gradientValue;
        sample.style.webkitBackgroundClip = "text";
        sample.style.webkitTextFillColor = "transparent";
      } else {
        sample.style.webkitBackgroundClip = "";
        sample.style.webkitTextFillColor = "";
        sample.style.background = gradientValue;
      }
    });
  };

  const update = () => {
    const gradientValue = buildGradient({
      mode: state.mode,
      angle: Number(angle.value),
      colors: getColors()
    });

    preview.style.background = gradientValue;
    renderTarget(gradientValue);
    code.textContent = formatCode(state.format, gradientValue, state.target);
  };

  setupToolTracking({
    toolName: "gradient_generator_pro",
    controls: [
      { element: angle, controlName: "gradient_angle", getValue: () => Number(angle.value) },
      { element: color1, controlName: "gradient_color_start", getValue: () => color1.value },
      { element: color2, controlName: "gradient_color_end", getValue: () => color2.value },
      { element: color3, controlName: "gradient_color_mid", getValue: () => color3.value },
      { element: color4, controlName: "gradient_color_tail", getValue: () => color4.value }
    ],
    copyButton: copyBtn,
    presetButtons
  });

  [angle, color1, color2, color3, color4].forEach((input) =>
    input.addEventListener("input", update)
  );

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preset = presets[button.getAttribute("data-gradient-preset")];
      if (!preset) {
        return;
      }

      state.mode = preset.mode;
      angle.value = String(preset.angle);
      [color1.value, color2.value, color3.value, color4.value] = preset.colors;
      setActive(modeButtons, state.mode, "data-gradient-mode");
      update();
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.getAttribute("data-gradient-mode");
      setActive(modeButtons, state.mode, "data-gradient-mode");
      update();
    });
  });

  targetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.target = button.getAttribute("data-gradient-target");
      setActive(targetButtons, state.target, "data-gradient-target");
      update();
    });
  });

  formatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.format = button.getAttribute("data-gradient-format");
      setActive(formatButtons, state.format, "data-gradient-format");
      update();
    });
  });

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy Pro Code")
  );

  setActive(modeButtons, state.mode, "data-gradient-mode");
  setActive(targetButtons, state.target, "data-gradient-target");
  setActive(formatButtons, state.format, "data-gradient-format");
  update();
};

setupGradientPro();
