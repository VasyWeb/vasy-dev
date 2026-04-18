import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const presets = {
  glass_card: { blur: 18, bgOpacity: 0.22, radius: 24, borderOpacity: 0.3 },
  navbar_glass: { blur: 12, bgOpacity: 0.14, radius: 999, borderOpacity: 0.22 },
  modal_glass: { blur: 22, bgOpacity: 0.2, radius: 28, borderOpacity: 0.28 },
  dark_glass: { blur: 16, bgOpacity: 0.18, radius: 20, borderOpacity: 0.18 },
  colorful_glass: { blur: 20, bgOpacity: 0.24, radius: 26, borderOpacity: 0.34 }
};

const setActive = (buttons, value, attribute) => {
  buttons.forEach((button) => {
    const isActive = button.getAttribute(attribute) === value;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const getGlassCode = (values, includeNoise) => {
  const background = `rgba(255, 255, 255, ${values.bgOpacity})`;
  const border = `1px solid rgba(255, 255, 255, ${values.borderOpacity})`;
  const shadow = "0 18px 38px rgba(15, 23, 42, 0.18)";

  return `${includeNoise ? "position: relative;\n" : ""}backdrop-filter: blur(${values.blur}px);
-webkit-backdrop-filter: blur(${values.blur}px);
background: ${background};
border: ${border};
border-radius: ${values.radius}px;
box-shadow: ${shadow};`;
};

export const setupGlassPro = () => {
  const inputs = {
    blur: getById("glassBlur"),
    bgOpacity: getById("glassBgOpacity"),
    radius: getById("glassRadius"),
    borderOpacity: getById("glassBorderOpacity")
  };
  const preview = getById("proGlassPreview");
  const code = getById("proGlassCode");
  const copyBtn = getById("copyProGlassBtn");
  const noiseToggle = getById("proGlassNoise");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn || !noiseToggle) {
    return;
  }

  const presetButtons = Array.from(document.querySelectorAll("[data-glass-preset]"));
  const themeButtons = Array.from(document.querySelectorAll("[data-glass-theme]"));
  const componentButtons = Array.from(document.querySelectorAll("[data-glass-component]"));
  const samples = Array.from(document.querySelectorAll("[data-glass-sample]"));

  const state = {
    theme: "light",
    component: "card"
  };

  const readValues = () => ({
    blur: Number(inputs.blur.value),
    bgOpacity: Number(inputs.bgOpacity.value),
    radius: Number(inputs.radius.value),
    borderOpacity: Number(inputs.borderOpacity.value)
  });

  const setValues = (values) => {
    Object.entries(values).forEach(([key, value]) => {
      if (inputs[key]) {
        inputs[key].value = String(value);
      }
    });
  };

  const update = () => {
    const values = readValues();
    const background = `rgba(255, 255, 255, ${values.bgOpacity})`;
    const border = `1px solid rgba(255, 255, 255, ${values.borderOpacity})`;
    const shadow = "0 18px 38px rgba(15, 23, 42, 0.18)";

    preview.setAttribute("data-theme", state.theme);
    preview.toggleAttribute("data-noise", noiseToggle.checked);

    samples.forEach((sample) => {
      const isActive = sample.getAttribute("data-glass-sample") === state.component;
      sample.classList.toggle("is-active", isActive);
      sample.style.backdropFilter = `blur(${values.blur}px)`;
      sample.style.webkitBackdropFilter = `blur(${values.blur}px)`;
      sample.style.background = background;
      sample.style.border = border;
      sample.style.borderRadius = `${values.radius}px`;
      sample.style.boxShadow = shadow;
    });

    code.textContent = getGlassCode(values, noiseToggle.checked);
  };

  setupToolTracking({
    toolName: "glassmorphism_generator_pro",
    controls: [
      { element: inputs.blur, controlName: "blur", getValue: () => Number(inputs.blur.value) },
      {
        element: inputs.bgOpacity,
        controlName: "background_opacity",
        getValue: () => Number(inputs.bgOpacity.value)
      },
      { element: inputs.radius, controlName: "border_radius", getValue: () => Number(inputs.radius.value) },
      {
        element: inputs.borderOpacity,
        controlName: "border_opacity",
        getValue: () => Number(inputs.borderOpacity.value)
      }
    ],
    copyButton: copyBtn,
    presetButtons
  });

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));
  noiseToggle.addEventListener("change", update);

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-glass-preset");
      const preset = presets[presetName];
      if (!preset) {
        return;
      }

      setValues(preset);
      update();
    });
  });

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = button.getAttribute("data-glass-theme");
      setActive(themeButtons, state.theme, "data-glass-theme");
      update();
    });
  });

  componentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.component = button.getAttribute("data-glass-component");
      setActive(componentButtons, state.component, "data-glass-component");
      update();
    });
  });

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy Pro Code")
  );

  setActive(themeButtons, state.theme, "data-glass-theme");
  setActive(componentButtons, state.component, "data-glass-component");
  update();
};

setupGlassPro();
