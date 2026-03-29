const interactiveSelector = "a, button, input, select, textarea";

const setExpandedState = (card, expanded) => {
  card.classList.toggle("card--flipped", expanded);
  card.setAttribute("aria-expanded", String(expanded));
};

export const setupProjectCards = () => {
  const cards = Array.from(document.querySelectorAll(".card"));

  if (!cards.length) {
    return;
  }

  const closeOtherCards = (activeCard) => {
    cards.forEach((card) => {
      if (card !== activeCard) {
        setExpandedState(card, false);
      }
    });
  };

  const toggleCard = (card) => {
    const nextExpanded = card.getAttribute("aria-expanded") !== "true";

    closeOtherCards(card);
    setExpandedState(card, nextExpanded);
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(interactiveSelector)) {
        return;
      }

      toggleCard(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.target.closest(interactiveSelector)) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard(card);
      }

      if (event.key === "Escape") {
        setExpandedState(card, false);
      }
    });
  });
};
