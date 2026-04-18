import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const templates = {
  dashboard: {
    columns: 3,
    areas: [
      ["header", "header", "header"],
      ["sidebar", "main", "stats"],
      ["sidebar", "main", "activity"]
    ],
    items: [
      { area: "header", label: "Header" },
      { area: "sidebar", label: "Sidebar" },
      { area: "main", label: "Overview" },
      { area: "stats", label: "Stats" },
      { area: "activity", label: "Activity" }
    ],
    css: (gap, rowHeight) => `display: grid;
grid-template-columns: 240px minmax(240px, 1fr) minmax(240px, 1fr);
grid-template-areas:
  "header header header"
  "sidebar main stats"
  "sidebar main activity";
grid-auto-rows: minmax(${rowHeight}px, auto);
gap: ${gap}px;`,
    html: `<div class="dashboard">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Overview</main>
  <section>Stats</section>
  <section>Activity</section>
</div>`
  },
  gallery: {
    columns: null,
    areas: null,
    items: [
      { label: "Hero" },
      { label: "Tile 1" },
      { label: "Tile 2" },
      { label: "Tile 3" },
      { label: "Tile 4" },
      { label: "Tile 5" }
    ],
    css: (gap, rowHeight, columnCount) => `display: grid;
grid-template-columns: repeat(${columnCount}, minmax(0, 1fr));
grid-auto-rows: ${rowHeight}px;
gap: ${gap}px;`,
    html: `<div class="gallery">
  <figure>Hero</figure>
  <figure>Tile 1</figure>
  <figure>Tile 2</figure>
  <figure>Tile 3</figure>
</div>`
  },
  blog: {
    columns: 2,
    areas: [
      ["lead", "sidebar"],
      ["story1", "sidebar"],
      ["story2", "sidebar"]
    ],
    items: [
      { area: "lead", label: "Lead" },
      { area: "story1", label: "Story One" },
      { area: "story2", label: "Story Two" },
      { area: "sidebar", label: "Newsletter" }
    ],
    css: (gap, rowHeight) => `display: grid;
grid-template-columns: 2fr 1fr;
grid-template-areas:
  "lead sidebar"
  "story1 sidebar"
  "story2 sidebar";
grid-auto-rows: minmax(${rowHeight}px, auto);
gap: ${gap}px;`,
    html: `<div class="blog-layout">
  <header>Lead Story</header>
  <article>Story One</article>
  <article>Story Two</article>
  <aside>Newsletter</aside>
</div>`
  },
  admin: {
    columns: null,
    areas: null,
    items: [
      { label: "Nav" },
      { label: "Traffic" },
      { label: "Revenue" },
      { label: "Tasks" },
      { label: "Users" },
      { label: "Alerts" }
    ],
    css: (gap, rowHeight, columnCount) => `display: grid;
grid-template-columns: repeat(${Math.max(4, columnCount * 2)}, minmax(0, 1fr));
grid-auto-rows: ${rowHeight}px;
gap: ${gap}px;`,
    html: `<div class="admin-grid">
  <nav>Nav</nav>
  <section>Traffic</section>
  <section>Revenue</section>
  <section>Tasks</section>
</div>`
  }
};

const viewportScales = {
  desktop: "min(100%, 720px)",
  tablet: "min(100%, 560px)",
  mobile: "min(100%, 360px)"
};

const setActive = (buttons, value, attribute) => {
  buttons.forEach((button) => {
    const isActive = button.getAttribute(attribute) === value;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const renderAreas = (areas) =>
  areas.map((row) => `"${row.join(" ")}"`).join("\n");

export const setupGridPro = () => {
  const preview = getById("proGridPreview");
  const code = getById("proGridCode");
  const copyBtn = getById("copyProGridBtn");
  const columnsInput = getById("gridColumns");
  const rowsInput = getById("gridRows");
  const gapInput = getById("gridGap");

  if (!preview || !code || !copyBtn || !columnsInput || !rowsInput || !gapInput) {
    return;
  }

  const templateButtons = Array.from(document.querySelectorAll("[data-grid-template]"));
  const viewportButtons = Array.from(document.querySelectorAll("[data-grid-viewport]"));
  const exportButtons = Array.from(document.querySelectorAll("[data-grid-export]"));

  const state = {
    template: "dashboard",
    viewport: "desktop",
    exportFormat: "css"
  };

  const getGap = () => Number(gapInput.value);
  const getColumnCount = () => Math.max(2, Number(columnsInput.value));
  const getRowHeight = () => Math.max(80, Number(rowsInput.value) * 38);

  const renderPreview = () => {
    const template = templates[state.template];
    const gap = getGap();
    const rowHeight = getRowHeight();
    const columnCount = getColumnCount();

    preview.style.width = viewportScales[state.viewport];
    preview.style.gap = `${gap}px`;
    preview.style.gridTemplateAreas = "";
    preview.style.gridTemplateColumns = "";
    preview.style.gridAutoRows = `${rowHeight}px`;

    if (template.areas) {
      preview.style.gridTemplateAreas = renderAreas(template.areas);
      preview.style.gridTemplateColumns = `repeat(${template.columns}, minmax(0, 1fr))`;
    } else if (state.template === "gallery") {
      preview.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;
    } else {
      preview.style.gridTemplateColumns = `repeat(${Math.max(4, columnCount * 2)}, minmax(0, 1fr))`;
    }

    preview.innerHTML = template.items
      .map((item, index) => {
        const style = [];
        if (item.area) {
          style.push(`grid-area:${item.area}`);
        }
        if (state.template === "gallery" && index === 0) {
          style.push(`grid-column:span ${Math.min(columnCount, 2)}`);
          style.push("grid-row:span 2");
        }
        if (state.template === "admin" && index === 0) {
          style.push("grid-column:span 4");
        }
        if (state.template === "admin" && index > 0) {
          style.push("grid-column:span 2");
        }
        return `<div style="${style.join(";")}">${item.label}</div>`;
      })
      .join("");
  };

  const renderCode = () => {
    const template = templates[state.template];
    const gap = getGap();
    const rowHeight = getRowHeight();
    const columnCount = getColumnCount();
    const baseCss = template.css(gap, rowHeight, columnCount);

    code.textContent =
      state.exportFormat === "html"
        ? `${template.html}\n\n/* CSS */\n${baseCss}`
        : baseCss;
  };

  const update = () => {
    renderPreview();
    renderCode();
  };

  setupToolTracking({
    toolName: "css_grid_generator_pro",
    controls: [
      { element: columnsInput, controlName: "columns", getValue: () => Number(columnsInput.value) },
      { element: rowsInput, controlName: "rows", getValue: () => Number(rowsInput.value) },
      { element: gapInput, controlName: "gap", getValue: () => Number(gapInput.value) }
    ],
    copyButton: copyBtn,
    presetButtons: templateButtons
  });

  templateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.template = button.getAttribute("data-grid-template");
      setActive(templateButtons, state.template, "data-grid-template");
      update();
    });
  });

  viewportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.viewport = button.getAttribute("data-grid-viewport");
      setActive(viewportButtons, state.viewport, "data-grid-viewport");
      update();
    });
  });

  exportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.exportFormat = button.getAttribute("data-grid-export");
      setActive(exportButtons, state.exportFormat, "data-grid-export");
      update();
    });
  });

  columnsInput.addEventListener("input", update);
  rowsInput.addEventListener("input", update);
  gapInput.addEventListener("input", update);

  copyBtn.addEventListener("click", () =>
    withCopyFeedback(copyBtn, code.textContent, "Copy Pro Code")
  );

  setActive(templateButtons, state.template, "data-grid-template");
  setActive(viewportButtons, state.viewport, "data-grid-viewport");
  setActive(exportButtons, state.exportFormat, "data-grid-export");
  update();
};

setupGridPro();
