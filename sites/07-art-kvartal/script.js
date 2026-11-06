"use strict";
const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("siteNav");
if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Закрыть меню" : "Открыть меню",
    );
    siteNav.classList.toggle("open", open);
  });
  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      siteNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Открыть меню");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      siteNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll(".detail-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const content = document.getElementById(
      button.getAttribute("aria-controls"),
    );
    if (!content) return;
    const opened = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!opened));
    content.hidden = opened;
    button.firstChild.textContent = opened
      ? button.closest(".studio-card")
        ? "Узнать больше "
        : "Подробнее "
      : "Свернуть ";
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const eventCards = document.querySelectorAll(".event-card-list");
const filterStatus = document.getElementById("filterStatus");
function filterEvents(category) {
  if (!eventCards.length) return;
  let shown = 0;
  eventCards.forEach((card) => {
    const visible = category === "Все" || card.dataset.category === category;
    card.hidden = !visible;
    if (visible) shown++;
  });
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (filterStatus) filterStatus.textContent = `Показано мероприятий: ${shown}`;
  const empty = document.getElementById("noResults");
  if (empty) empty.hidden = shown > 0;
}
filterButtons.forEach((button) =>
  button.addEventListener("click", () => filterEvents(button.dataset.filter)),
);
const url = new URL(window.location.href);
const category = url.searchParams.get("category");
if (
  category &&
  [...filterButtons].some((button) => button.dataset.filter === category)
)
  filterEvents(category);

const choice = document.getElementById("choice");
if (choice) {
  const selected = url.searchParams.get("choice");
  if (
    selected &&
    [...choice.options].some((option) => option.value === selected)
  )
    choice.value = selected;
}

const form = document.getElementById("bookingForm");
if (form) {
  const feedback = document.getElementById("formFeedback");
  const requiredIds = [
    "clientName",
    "clientPhone",
    "clientEmail",
    "choice",
    "people",
    "consent",
  ];
  const setError = (message) => {
    feedback.className = "form-feedback error";
    feedback.textContent = message;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form
      .querySelectorAll(".invalid")
      .forEach((element) => element.classList.remove("invalid"));
    const name = document.getElementById("clientName");
    const phone = document.getElementById("clientPhone");
    const email = document.getElementById("clientEmail");
    const count = document.getElementById("people");
    const consent = document.getElementById("consent");
    const digits = phone.value.replace(/\D/g, "");
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (name.value.trim().length < 2) {
      name.classList.add("invalid");
      setError("Введите имя не короче двух символов.");
      name.focus();
      return;
    }
    if (digits.length < 10 || digits.length > 11) {
      phone.classList.add("invalid");
      setError("Введите номер телефона из 10–11 цифр.");
      phone.focus();
      return;
    }
    if (!emailValid) {
      email.classList.add("invalid");
      setError("Укажите корректный адрес электронной почты.");
      email.focus();
      return;
    }
    if (!choice.value) {
      choice.classList.add("invalid");
      setError("Выберите событие или студию.");
      choice.focus();
      return;
    }
    if (
      !Number.isInteger(Number(count.value)) ||
      Number(count.value) < 1 ||
      Number(count.value) > 20
    ) {
      count.classList.add("invalid");
      setError("Укажите количество участников от 1 до 20.");
      count.focus();
      return;
    }
    if (!consent.checked) {
      setError(
        "Подтвердите согласие на обработку данных для демонстрационной формы.",
      );
      consent.focus();
      return;
    }
    feedback.className = "form-feedback success";
    feedback.textContent =
      "Форма заполнена успешно. Это учебная демонстрация, заявка не отправлена.";
    form.reset();
    count.value = "1";
  });
  for (const id of requiredIds) {
    const input = document.getElementById(id);
    if (input)
      input.addEventListener("input", () => input.classList.remove("invalid"));
  }
}
