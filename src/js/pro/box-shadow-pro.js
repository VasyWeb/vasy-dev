import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const presets = {
  soft_card: { x: 0, y: 16, blur: 32, spread: -12, opacity: 0.16, theme: "light", inset: false },
  floating_card: { x: 0, y: 26, blur: 52, spread: -18, opacity: 0.22, theme: "light", inset: false },
  button_depth: { x: 0, y: 10, blur: 22, spread: -10, opacity: 0.24, theme: "light", inset: false },
  dark_ui: { x: 0, y: 18, blur: 38, spread: -14, opacity: 0.48, theme: "dark", inset: false },
  modal_depth: { x: 0, y: 30, blur: 60, spread: -22, opacity: 0.26, theme: "light", inset: false },
  subtle_inset: { x: 0, y: 2, blur: 10, spread: 0, opacity: 0.18, theme: "light", inset: true },
  glass_card: { x: 0, y: 18, blur: 40, spread: -20, opacity: 0.14, theme: "light", inset: false },
  dashboard_card: { x: 0, y: 12, blur: 28, spread: -16, opacity: 0.18, theme: "light", inset: false },
  soft_input: { x: 0, y: 8, blur: 20, spread: -12, opacity: 0.14, theme: "light", inset: false },
  neumorphic_soft: { x: 10, y: 10, blur: 24, spread: -10, opacity: 0.16, theme: "light", inset: false }
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

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const toShadowValue = ({ x, y, blur, spread, opacity, inset = false }) =>
  `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(15, 23, 42, ${opacity})`;

const formatShadowCode = (format, shadowValue, values) => {
  if (format === "scss") {
    return `$shadow-x: ${values.x}px;
$shadow-y: ${values.y}px;
$shadow-blur: ${values.blur}px;
$shadow-spread: ${values.spread}px;
$shadow-opacity: ${values.opacity};
$box-shadow-pro: ${shadowValue};

.card {
  box-shadow: $box-shadow-pro;
}`;
  }

  if (format === "tailwind") {
    return `boxShadow: {
  pro: "${shadowValue}"
},
extend: {
  boxShadow: {
    pro: "${shadowValue}"
  }
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
  } else if (component === "modal") {
    sample.style.transform = "translateY(-4px)";
  } else {
    sample.style.transform = "none";
  }
};

const variationBlueprints = [
  {
    label: "Soft Lift",
    getValues: (values) => ({
      x: 0,
      y: clamp(values.y + 4, 10, 26),
      blur: clamp(values.blur + 12, 24, 56),
      spread: clamp(values.spread - 4, -20, 8),
      opacity: clamp(Number((values.opacity + 0.02).toFixed(2)), 0.12, 0.32),
      inset: false
    })
  },
  {
    label: "Product Card",
    getValues: (values) => ({
      x: 0,
      y: clamp(values.y + 8, 12, 30),
      blur: clamp(values.blur + 20, 28, 64),
      spread: clamp(values.spread - 10, -22, 4),
      opacity: clamp(Number((values.opacity + 0.04).toFixed(2)), 0.14, 0.38),
      inset: false
    })
  },
  {
    label: "Quiet Button",
    getValues: (values) => ({
      x: 0,
      y: clamp(values.y - 2, 4, 14),
      blur: clamp(values.blur - 2, 16, 28),
      spread: clamp(values.spread - 8, -18, 0),
      opacity: clamp(Number((values.opacity - 0.04).toFixed(2)), 0.1, 0.22),
      inset: false
    })
  },
  {
    label: "Inset Surface",
    getValues: (values) => ({
      x: 0,
      y: 2,
      blur: clamp(values.blur - 8, 10, 24),
      spread: clamp(values.spread + 2, -4, 6),
      opacity: clamp(Number((values.opacity - 0.08).toFixed(2)), 0.08, 0.2),
      inset: true
    })
  },
  {
    label: "Dark Panel",
    getValues: (values) => ({
      x: 0,
      y: clamp(values.y + 6, 12, 22),
      blur: clamp(values.blur + 8, 20, 42),
      spread: clamp(values.spread - 6, -18, 2),
      opacity: clamp(Number((values.opacity + 0.12).toFixed(2)), 0.28, 0.5),
      inset: false,
      theme: "dark"
    })
  },
  {
    label: "Modal Depth",
    getValues: (values) => ({
      x: 0,
      y: clamp(values.y + 12, 18, 34),
      blur: clamp(values.blur + 24, 34, 70),
      spread: clamp(values.spread - 16, -26, -6),
      opacity: clamp(Number((values.opacity + 0.06).toFixed(2)), 0.16, 0.34),
      inset: false
    })
  }
];

const formatLabel = (format) => {
  if (format === "scss") {
    return "SCSS variables";
  }

  if (format === "tailwind") {
    return "Tailwind config";
  }

  return "CSS";
};

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
  const formatLabelElement = getById("proShadowFormatLabel");

  if (
    !Object.values(inputs).every(Boolean) ||
    !preview ||
    !code ||
    !copyBtn ||
    !generateBtn ||
    !historyRoot ||
    !variantsRoot ||
    !formatLabelElement
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
    inset: false,
    history: []
  };

  const syncSamples = () => {
    samples.forEach((sample) => {
      const isActive = sample.getAttribute("data-shadow-sample") === state.component;
      sample.classList.toggle("is-active", isActive);
      sample.closest(".shadow-generator__component")?.classList.toggle("is-active", isActive);
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
        state.inset = Boolean(entry.inset);
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
      { label, values: { ...values }, theme: state.theme, inset: state.inset },
      ...state.history.filter((entry) => entry.label !== label)
    ].slice(0, 5);
    renderHistory();
  };

  const renderVariants = () => {
    variantsRoot.innerHTML = "";
    const baseValues = readValues(inputs);

    variationBlueprints.forEach((blueprint) => {
      const variation = blueprint.getValues(baseValues);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "shadow-generator__variant";
        button.textContent = blueprint.label;
        button.addEventListener("click", () => {
          setValues(inputs, variation);
          state.theme = variation.theme || "light";
          state.inset = Boolean(variation.inset);
          remember(blueprint.label, variation);
          update();
        });
        variantsRoot.append(button);
      });
  };

  const update = () => {
    const values = readValues(inputs);
    const shadowValue = toShadowValue({ ...values, inset: state.inset });

    preview.setAttribute("data-shadow-theme", state.theme);
    samples.forEach((sample) => applyShadowToSample(sample, shadowValue, state.component));
    code.textContent = formatShadowCode(state.format, shadowValue, values);
    formatLabelElement.textContent = `Active format: ${formatLabel(state.format)}`;
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
      state.inset = Boolean(values.inset);
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
