export const withCopyFeedback = async (button, text, idleLabel) => {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
  } catch {
    button.textContent = "Copy failed";
  } finally {
    setTimeout(() => {
      button.textContent = idleLabel;
    }, 1200);
  }
};
