import { getById } from "../utils/dom.js";
import { withCopyFeedback } from "../utils/copy.js";
import { setupToolTracking } from "../utils/analytics.js";

const templates = {
  dashboard: {
    html: `<div class="dashboard">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Overview</main>
  <section>Stats</section>
  <section>Activity</section>
</div>`,
    css: `display: grid;
grid-template-columns: 240px 1fr 1fr;
grid-template-areas:
  "header header header"
  "sidebar main stats"
  "sidebar main activity";
gap: 20px;`,
    items: ["Header", "Sidebar", "Overview", "Stats", "Activity"],
    columns: "240px minmax(240px, 1fr) minmax(240px, 1fr)"
  },
  gallery: {
    html: `<div class="gallery">
  <figure>Hero</figure>
  <figure>1</figure>
  <figure>2</figure>
  <figure>3</figure>
  <figure>4</figure>
</div>`,
    css: `display: grid;
grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
grid-auto-rows: 140px;
gap: 18px;`,
    items: ["Hero", "Tile 1", "Tile 2", "Tile 3", "Tile 4"],
    columns: "repeat(auto-fit, minmax(160px, 1fr))"
  },
  blog: {
    html: `<div class="blog-layout">
  <header>Lead Story</header>
  <article>Story One</article>
  <article>Story Two</article>
  <aside>Newsletter</aside>
</div>`,
    css: `display: grid;
grid-template-columns: 2fr 1fr;
grid-template-areas:
  "lead sidebar"
  "story1 sidebar"
  "story2 sidebar";
gap: 22px;`,
    items: ["Lead", "Story One", "Story Two", "Newsletter"],
    columns: "2fr 1fr"
  },
  admin: {
    html: `<div class="admin-grid">
  <nav>Nav</nav>
  <section>Traffic</section>
  <section>Revenue</section>
  <section>Tasks</section>
  <section>Users</section>
</div>`,
    css: `display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 16px;`,
    items: ["Nav", "Traffic", "Revenue", "Tasks", "Users"],
    columns: "repeat(12, 1fr)"
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

  const renderPreview = () => {
    const template = templates[state.template];
    preview.style.width = viewportScales[state.viewport];
    preview.style.gridTemplateColumns = template.columns;
    preview.style.gap = `${Number(gapInput.value)}px`;
    preview.innerHTML = template.items
      .map((item) => `<div>${item}</div>`)
      .join("");
  };

  const renderCode = () => {
    const template = templates[state.template];
    const baseCss = template.css.replace(/gap: .*?;/, `gap: ${Number(gapInput.value)}px;`);

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
