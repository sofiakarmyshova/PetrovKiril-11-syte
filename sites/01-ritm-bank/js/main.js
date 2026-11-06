"use strict";

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const opened = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!opened));
    menuButton.setAttribute(
      "aria-label",
      opened ? "Открыть меню" : "Закрыть меню",
    );
    nav.classList.toggle("is-open", !opened);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Открыть меню");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Открыть меню");
    }
  });
}

const phoneInput = document.querySelector("#phone");
if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    let numbers = phoneInput.value.replace(/\D/g, "");
    if (!numbers) {
      phoneInput.value = "";
      return;
    }
    if (numbers[0] === "7" || numbers[0] === "8") numbers = numbers.slice(1);
    numbers = numbers.slice(0, 10);
    let result = "+7";
    if (numbers.length) result += " (" + numbers.slice(0, 3);
    if (numbers.length >= 3) result += ")";
    if (numbers.length > 3) result += " " + numbers.slice(3, 6);
    if (numbers.length > 6) result += "-" + numbers.slice(6, 8);
    if (numbers.length > 8) result += "-" + numbers.slice(8, 10);
    phoneInput.value = result;
  });
}

const form = document.querySelector("#feedback-form");
if (form) {
  const status = document.querySelector("#form-status");
  const errors = {
    name: "Введите имя (не меньше 2 символов).",
    phone: "Введите телефон из 10 цифр после +7.",
    message: "Напишите сообщение (не меньше 10 символов).",
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    const name = form.elements.name;
    const phone = form.elements.phone;
    const message = form.elements.message;
    const check = {
      name: name.value.trim().length >= 2,
      phone: phone.value.replace(/\D/g, "").length === 11,
      message: message.value.trim().length >= 10,
    };

    for (const field of [name, phone, message]) {
      const ok = check[field.name];
      field.classList.toggle("invalid", !ok);
      field.setAttribute("aria-invalid", String(!ok));
      const error = form.querySelector(`[data-for="${field.name}"]`);
      if (error) error.textContent = ok ? "" : errors[field.name];
      if (!ok) valid = false;
    }

    if (!valid) {
      status.hidden = true;
      form.querySelector(".invalid").focus();
      return;
    }

    status.textContent =
      "Форма заполнена правильно! Это учебный сайт: сообщение никуда не отправлено.";
    status.hidden = false;
    form.reset();
    form.querySelectorAll(".invalid").forEach((input) => {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    });
  });
}
