import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const presets = {
  modern_card: {
    horizontal: { tl: 24, tr: 24, br: 18, bl: 18 },
    vertical: { tl: 24, tr: 24, br: 18, bl: 18 }
  },
  soft_button: {
    horizontal: { tl: 999, tr: 999, br: 999, bl: 999 },
    vertical: { tl: 999, tr: 999, br: 999, bl: 999 }
  },
  media_frame: {
    horizontal: { tl: 28, tr: 12, br: 28, bl: 12 },
    vertical: { tl: 28, tr: 12, br: 28, bl: 12 }
  },
  blob_wave: {
    horizontal: { tl: 58, tr: 42, br: 68, bl: 36 },
    vertical: { tl: 42, tr: 64, br: 34, bl: 58 }
  }
};

const setActive = (buttons, value, attribute) => {
  buttons.forEach((button) => {
    const isActive = button.getAttribute(attribute) === value;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const buildRadiusValue = (horizontal, vertical, mode) => {
  const h = `${horizontal.tl}px ${horizontal.tr}px ${horizontal.br}px ${horizontal.bl}px`;
  const v = `${vertical.tl}px ${vertical.tr}px ${vertical.br}px ${vertical.bl}px`;
  return mode === "elliptical" ? `${h} / ${v}` : h;
};

const formatRadiusCode = (format, value) => {
  if (format === "scss") {
    return `$radius-shape: ${value};

.card {
  border-radius: $radius-shape;
}`;
  }

  if (format === "explained") {
    return `border-radius: ${value};

/* top-left | top-right | bottom-right | bottom-left */`;
  }

  return `border-radius: ${value};`;
};

export const setupBorderRadiusPro = () => {
  const inputs = {
    tl: getById("radiusTl"),
    tr: getById("radiusTr"),
    br: getById("radiusBr"),
    bl: getById("radiusBl"),
    vtl: getById("proRadiusVerticalTl"),
    vtr: getById("proRadiusVerticalTr"),
    vbr: getById("proRadiusVerticalBr"),
    vbl: getById("proRadiusVerticalBl")
  };
  const preview = getById("proRadiusPreview");
  const code = getById("proRadiusCode");
  const copyBtn = getById("copyProRadiusBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  const presetButtons = Array.from(document.querySelectorAll("[data-radius-preset]"));
  const modeButtons = Array.from(document.querySelectorAll("[data-radius-mode]"));
  const targetButtons = Array.from(document.querySelectorAll("[data-radius-target]"));
  const samples = Array.from(document.querySelectorAll("[data-radius-sample]"));

  const state = {
    mode: "standard",
    target: "card"
  };

  const getHorizontal = () => ({
    tl: Number(inputs.tl.value),
    tr: Number(inputs.tr.value),
    br: Number(inputs.br.value),
    bl: Number(inputs.bl.value)
  });

  const getVertical = () => ({
    tl: Number(inputs.vtl.value),
    tr: Number(inputs.vtr.value),
    br: Number(inputs.vbr.value),
    bl: Number(inputs.vbl.value)
  });

  const setValues = ({ horizontal, vertical }) => {
    inputs.tl.value = String(horizontal.tl);
    inputs.tr.value = String(horizontal.tr);
    inputs.br.value = String(horizontal.br);
    inputs.bl.value = String(horizontal.bl);
    inputs.vtl.value = String(vertical.tl);
    inputs.vtr.value = String(vertical.tr);
    inputs.vbr.value = String(vertical.br);
    inputs.vbl.value = String(vertical.bl);
  };

  const update = () => {
    const value = buildRadiusValue(getHorizontal(), getVertical(), state.mode);

    preview.setAttribute("data-theme", state.target === "blob" ? "gradient" : "light");
    samples.forEach((sample) => {
      const isActive = sample.getAttribute("data-radius-sample") === state.target;
      sample.classList.toggle("is-active", isActive);
      sample.style.borderRadius = value;
    });

    code.textContent = formatRadiusCode("css", value);
  };

  setupToolTracking({
    toolName: "border_radius_generator_pro",
    controls: [
      { element: inputs.tl, controlName: "top_left_radius", getValue: () => Number(inputs.tl.value) },
      { element: inputs.tr, controlName: "top_right_radius", getValue: () => Number(inputs.tr.value) },
      { element: inputs.br, controlName: "bottom_right_radius", getValue: () => Number(inputs.br.value) },
      { element: inputs.bl, controlName: "bottom_left_radius", getValue: () => Number(inputs.bl.value) },
      { element: inputs.vtl, controlName: "vertical_top_left_radius", getValue: () => Number(inputs.vtl.value) },
      { element: inputs.vtr, controlName: "vertical_top_right_radius", getValue: () => Number(inputs.vtr.value) },
      { element: inputs.vbr, controlName: "vertical_bottom_right_radius", getValue: () => Number(inputs.vbr.value) },
      { element: inputs.vbl, controlName: "vertical_bottom_left_radius", getValue: () => Number(inputs.vbl.value) }
    ],
    copyButton: copyBtn,
    presetButtons
  });

  Object.values(inputs).forEach((input) => input.addEventListener("input", update));

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preset = presets[button.getAttribute("data-radius-preset")];
      if (!preset) {
        return;
      }

      setValues(preset);
      update();
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.getAttribute("data-radius-mode");
      setActive(modeButtons, state.mode, "data-radius-mode");
      code.textContent = formatRadiusCode("css", buildRadiusValue(getHorizontal(), getVertical(), state.mode));
      update();
    });
  });

  targetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.target = button.getAttribute("data-radius-target");
      setActive(targetButtons, state.target, "data-radius-target");
      update();
    });
  });

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy Pro Code")
  );

  setActive(modeButtons, state.mode, "data-radius-mode");
  setActive(targetButtons, state.target, "data-radius-target");
  update();
};

setupBorderRadiusPro();
