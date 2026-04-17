import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

export const setupGridGenerator = () => {
  const inputs = {
    columns: getById("gridColumns"),
    rows: getById("gridRows"),
    gap: getById("gridGap"),
    templateColumns: getById("gridTemplateColumns")
  };
  const preview = getById("gridPreview");
  const code = getById("gridCode");
  const copyBtn = getById("copyGridBtn");

  if (!Object.values(inputs).every(Boolean) || !preview || !code || !copyBtn) {
    return;
  }

  setupToolTracking({
    toolName: "css_grid_generator",
    controls: [
      {
        element: inputs.columns,
        controlName: "columns",
        getValue: () => Number(inputs.columns.value)
      },
      {
        element: inputs.rows,
        controlName: "rows",
        getValue: () => Number(inputs.rows.value)
      },
      {
        element: inputs.gap,
        controlName: "gap",
        getValue: () => Number(inputs.gap.value)
      },
      {
        element: inputs.templateColumns,
        controlName: "template_columns",
        getValue: () => inputs.templateColumns.value,
        throttleMs: 900
      }
    ],
    copyButton: copyBtn
  });

  const syncTemplateColumns = () => {
    inputs.templateColumns.value = `repeat(${Number(inputs.columns.value)}, 1fr)`;
  };

  const renderItems = () => {
    const total = Number(inputs.columns.value) * Number(inputs.rows.value);
    preview.innerHTML = Array.from({ length: total }, (_, index) => `<div>${index + 1}</div>`).join("");
  };

  const update = ({ preserveTemplate = false } = {}) => {
    if (!preserveTemplate) {
      syncTemplateColumns();
    }

    const rows = Number(inputs.rows.value);
    const gap = Number(inputs.gap.value);
    const templateColumns = inputs.templateColumns.value.trim() || `repeat(${Number(inputs.columns.value)}, 1fr)`;

    renderItems();
    preview.style.gridTemplateColumns = templateColumns;
    preview.style.gridTemplateRows = `repeat(${rows}, auto)`;
    preview.style.gap = `${gap}px`;
    code.textContent = `display: grid;
grid-template-columns: ${templateColumns};
grid-template-rows: repeat(${rows}, auto);
gap: ${gap}px;`;
  };

  inputs.columns.addEventListener("input", () => update());
  inputs.rows.addEventListener("input", () => update({ preserveTemplate: true }));
  inputs.gap.addEventListener("input", () => update({ preserveTemplate: true }));
  inputs.templateColumns.addEventListener("input", () => update({ preserveTemplate: true }));
  copyBtn.addEventListener("click", () => withCopyFeedback(copyBtn, code.textContent, "Copy CSS"));
  update();
};
