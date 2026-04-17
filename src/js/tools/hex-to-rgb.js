import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const normalizeHex = (value) => {
  const trimmed = value.trim().replace(/^#/, "");

  if (trimmed.length === 3) {
    return trimmed
      .split("")
      .map((char) => char + char)
      .join("");
  }

  return trimmed;
};

const isValidHex = (value) => /^[\da-fA-F]{6}$/.test(value);

const hexToRgb = (value) => {
  const normalized = normalizeHex(value);

  if (!isValidHex(normalized)) {
    return null;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgb(${red},${green},${blue})`;
};

export const setupHexToRgbConverter = () => {
  const colorInput = getById("hexColorPicker");
  const hexInput = getById("hexValue");
  const output = getById("rgbResult");
  const preview = getById("hexRgbPreview");
  const code = getById("hexRgbCode");
  const copyBtn = getById("copyHexRgbBtn");

  if (!colorInput || !hexInput || !output || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "hex_to_rgb_converter",
    controls: [
      {
        element: colorInput,
        controlName: "color_picker",
        getValue: () => colorInput.value
      },
      {
        element: hexInput,
        controlName: "hex_value",
        getValue: () => hexInput.value,
        throttleMs: 900
      }
    ],
    copyButton: copyBtn
  });

  const updateFromHex = (hexValue) => {
    const rgbValue = hexToRgb(hexValue);

    if (!rgbValue) {
      output.value = "Invalid HEX";
      code.textContent = "Invalid HEX";
      preview.textContent = "Enter a valid HEX color";
      preview.style.background = "linear-gradient(135deg, #b91c1c, #7f1d1d)";
      return;
    }

    const normalized = `#${normalizeHex(hexValue).toLowerCase()}`;
    colorInput.value = normalized;
    output.value = rgbValue;
    code.textContent = rgbValue;
    preview.textContent = `${normalized} -> ${rgbValue}`;
    preview.style.background = normalized;
  };

  colorInput.addEventListener("input", () => {
    hexInput.value = colorInput.value;
    updateFromHex(colorInput.value);
  });

  hexInput.addEventListener("input", () => updateFromHex(hexInput.value));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy RGB"));
  updateFromHex(hexInput.value);
};
