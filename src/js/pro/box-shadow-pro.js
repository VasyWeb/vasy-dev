import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const presets = {
  soft_card: { x: 0, y: 18, blur: 42, spread: -14, opacity: 0.18, theme: "light" },
  button_depth: { x: 0, y: 10, blur: 24, spread: -10, opacity: 0.22, theme: "light" },
  floating_card: { x: 0, y: 26, blur: 50, spread: -18, opacity: 0.24, theme: "light" },
  dark_ui: { x: 0, y: 18, blur: 36, spread: -12, opacity: 0.48, theme: "dark" },
  neumorphic_soft: { x: 12, y: 12, blur: 24, spread: -8, opacity: 0.15, theme: "light" }
};

const readValues = (inputs) => ({
  x: Number(inputs.x.value),
  y: Number(inputs.y.value),
  blur: Number(inputs.blur.value),
  spread: Number(inputs.spread.value),
  opacity: Number(inputs.opacity.value)
});

const setValues = (inputs, values) => {
  Object.entries(values).forEach(([key, value]) => {
    if (key !== "theme" && inputs[key]) {
      inputs[key].value = String(value);
    }
  });
};

const toShadowValue = ({ x, y, blur, spread, opacity }) =>
  `${x}px ${y}px ${blur}px ${spread}px rgba(15, 23, 42, ${opacity})`;

const formatShadowCode = (format, shadowValue) => {
  if (format === "scss") {
    return `$box-shadow-pro: ${shadowValue};

.card {
  box-shadow: $box-shadow-pro;
}`;
  }

  if (format === "tailwind") {
    return `boxShadow: {
  pro: "${shadowValue}"
}`;
  }

  return `box-shadow: ${shadowValue};`;
};

const setActiveButton = (buttons, activeValue, attribute) => {
  buttons.forEach((button) => {
    const isActive = button.getAttribute(attribute) === activeValue;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const applyShadowToSample = (sample, shadowValue, component) => {
  if (!sample) {
    return;
  }

  sample.style.boxShadow = shadowValue;
  if (component === "button") {
    sample.style.transform = "translateY(-1px)";
  } else {
    sample.style.transform = "none";
  }
};

const createVariation = (values, index) => ({
  x: Math.max(-32, Math.min(32, values.x + index * 2)),
  y: Math.max(6, values.y + 4 + index * 2),
  blur: Math.max(14, values.blur + 8 + index * 2),
  spread: Math.max(-18, values.spread - 2),
  opacity: Math.min(0.55, Number((values.opacity + 0.03 * index).toFixed(2)))
});

export const setupBoxShadowPro = () => {
  const inputs = {
    x: getById("shadowX"),
    y: getById("shadowY"),
    blur: getById("shadowBlur"),
    spread: getById("shadowSpread"),
    opacity: getById("shadowOpacity")
  };
  const preview = getById("proShadowPreview");
  const code = getById("proShadowCode");
  const copyBtn = getById("copyProShadowBtn");
  const generateBtn = getById("generateShadowVariantsBtn");
  const historyRoot = getById("proShadowHistory");
  const variantsRoot = getById("proShadowVariants");

  if (
    !Object.values(inputs).every(Boolean) ||
    !preview ||
    !code ||
    !copyBtn ||
    !generateBtn ||
    !historyRoot ||
    !variantsRoot
  ) {
    return;
  }

  const componentButtons = Array.from(
    document.querySelectorAll("[data-shadow-component]")
  );
  const formatButtons = Array.from(
    document.querySelectorAll("[data-shadow-format]")
  );
  const presetButtons = Array.from(
    document.querySelectorAll("[data-shadow-preset]")
  );
  const samples = Array.from(document.querySelectorAll("[data-shadow-sample]"));

  const state = {
    component: "card",
    format: "css",
    theme: "light",
    history: []
  };

  const syncSamples = () => {
    samples.forEach((sample) => {
      const isActive = sample.getAttribute("data-shadow-sample") === state.component;
      sample.classList.toggle("is-active", isActive);
    });
  };

  const renderHistory = () => {
    historyRoot.innerHTML = "";

    if (!state.history.length) {
      historyRoot.innerHTML =
        '<p class="shadow-generator__empty">Your last applied premium shadows show up here.</p>';
      return;
    }

    state.history.forEach((entry, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "shadow-generator__history-chip";
      button.textContent = entry.label;
      button.addEventListener("click", () => {
        setValues(inputs, entry.values);
        state.theme = entry.theme || "light";
        update();
      });
      historyRoot.append(button);

      if (index === 4) {
        return;
      }
    });
  };

  const remember = (label, values) => {
    state.history = [
      { label, values: { ...values }, theme: state.theme },
      ...state.history.filter((entry) => entry.label !== label)
    ].slice(0, 5);
    renderHistory();
  };

  const renderVariants = () => {
    variantsRoot.innerHTML = "";
    const baseValues = readValues(inputs);

    Array.from({ length: 6 }, (_, index) => createVariation(baseValues, index)).forEach(
      (variation, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "shadow-generator__variant";
        button.textContent = `Variant ${index + 1}`;
        button.addEventListener("click", () => {
          setValues(inputs, variation);
          remember(`Variant ${index + 1}`, variation);
          update();
        });
        variantsRoot.append(button);
      }
    );
  };

  const update = () => {
    const values = readValues(inputs);
    const shadowValue = toShadowValue(values);

    preview.setAttribute("data-shadow-theme", state.theme);
    samples.forEach((sample) => applyShadowToSample(sample, shadowValue, state.component));
    code.textContent = formatShadowCode(state.format, shadowValue);
    syncSamples();
  };

  setupToolTracking({
    toolName: "box_shadow_generator_pro",
    controls: [
      {
        element: inputs.x,
        controlName: "horizontal_offset",
        getValue: () => Number(inputs.x.value)
      },
      {
        element: inputs.y,
        controlName: "vertical_offset",
        getValue: () => Number(inputs.y.value)
      },
      {
        element: inputs.blur,
        controlName: "blur_radius",
        getValue: () => Number(inputs.blur.value)
      },
      {
        element: inputs.spread,
        controlName: "spread_radius",
        getValue: () => Number(inputs.spread.value)
      },
      {
        element: inputs.opacity,
        controlName: "shadow_opacity",
        getValue: () => Number(inputs.opacity.value)
      }
    ],
    copyButton: copyBtn,
    presetButtons
  });

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));

  componentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.component = button.getAttribute("data-shadow-component");
      setActiveButton(componentButtons, state.component, "data-shadow-component");
      update();
    });
  });

  formatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.format = button.getAttribute("data-shadow-format");
      setActiveButton(formatButtons, state.format, "data-shadow-format");
      update();
    });
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-shadow-preset");
      const values = presets[presetName];
      if (!values) {
        return;
      }

      setValues(inputs, values);
      state.theme = values.theme || "light";
      remember(button.textContent.trim(), values);
      update();
      renderVariants();
    });
  });

  generateBtn.addEventListener("click", () => {
    renderVariants();
    remember("Generated set", readValues(inputs));
  });

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy Pro Code")
  );

  setActiveButton(componentButtons, state.component, "data-shadow-component");
  setActiveButton(formatButtons, state.format, "data-shadow-format");
  renderHistory();
  renderVariants();
  update();
};

setupBoxShadowPro();
