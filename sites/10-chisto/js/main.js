"use strict";

const priceItems = [
  { name: "Куртка", price: 900 },
  { name: "Пальто", price: 1400 },
  { name: "Пуховик", price: 1600 },
  { name: "Рубашка", price: 350 },
  { name: "Брюки", price: 450 },
  { name: "Платье", price: 800 },
  { name: "Постельное бельё", price: 600 },
  { name: "Кроссовки", price: 1000 },
];
const rubles = (number) => new Intl.NumberFormat("ru-RU").format(number) + " ₽";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute(
      "aria-label",
      expanded ? "Открыть меню" : "Закрыть меню",
    );
    navigation.classList.toggle("is-open", !expanded);
  });
  navigation.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }),
  );
}

document.querySelectorAll("[data-expand]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.expand);
    if (!panel) return;
    panel.hidden = !panel.hidden;
    button.setAttribute("aria-expanded", String(!panel.hidden));
    button.innerHTML = panel.hidden ? "Подробнее →" : "Свернуть ↑";
  });
});

const calcService = document.getElementById("calc-service");
const quantity = document.getElementById("calc-qty");
if (calcService && quantity) {
  const priceOutput = document.getElementById("calc-total");
  const bookingLink = document.getElementById("calc-book");
  const update = () => {
    const itemIndex = Number(calcService.value);
    const count = Number(quantity.textContent);
    priceOutput.textContent = rubles(priceItems[itemIndex].price * count);
    bookingLink.href = `contacts.html?item=${itemIndex}&qty=${count}#request`;
  };
  document.getElementById("qty-minus").addEventListener("click", () => {
    quantity.textContent = String(
      Math.max(1, Number(quantity.textContent) - 1),
    );
    update();
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    quantity.textContent = String(
      Math.min(20, Number(quantity.textContent) + 1),
    );
    update();
  });
  calcService.addEventListener("change", update);
  update();
}

const requestForm = document.getElementById("request-form");
if (requestForm) {
  const params = new URLSearchParams(location.search);
  const service = document.getElementById("request-service");
  const qty = document.getElementById("request-qty");
  const date = document.getElementById("request-date");
  const alertBox = document.getElementById("form-alert");
  const item = Number(params.get("item"));
  if (
    params.has("item") &&
    Number.isInteger(item) &&
    item >= 0 &&
    item < priceItems.length
  ) {
    service.value = priceItems[item].name;
  }
  if (params.has("service")) {
    const serviceNum = Number(params.get("service"));
    const otherServices = [
      "Химчистка верхней одежды",
      "Чистка деликатных тканей",
      "Стирка повседневной одежды",
      "Чистка домашнего текстиля",
      "Глажка и отпаривание",
      "Чистка обуви",
    ];
    if (Number.isInteger(serviceNum) && otherServices[serviceNum])
      service.value = otherServices[serviceNum];
  }
  if (params.has("qty")) {
    const selectedQty = Number(params.get("qty"));
    if (Number.isInteger(selectedQty) && selectedQty >= 1 && selectedQty <= 20)
      qty.value = String(selectedQty);
  }
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  date.min = `${year}-${month}-${day}`;
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("client-name").value.trim();
    const phone = document
      .getElementById("client-phone")
      .value.replace(/\D/g, "");
    const count = Number(qty.value);
    const consent = document.getElementById("request-consent").checked;
    const validPhone =
      (phone.length === 11 && /^[78]/.test(phone)) || phone.length === 10;
    const validDate = date.value && date.value >= date.min;
    alertBox.hidden = false;
    if (
      name.length < 2 ||
      !validPhone ||
      !service.value ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 20 ||
      !validDate ||
      !consent
    ) {
      alertBox.className = "form-alert error";
      alertBox.textContent =
        "Проверьте имя, номер телефона, услугу, количество (1–20), дату и согласие на обработку данных.";
      alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    alertBox.className = "form-alert success";
    alertBox.textContent =
      "Форма заполнена успешно. Это учебная демонстрация, заявка не отправлена.";
    requestForm.reset();
    qty.value = "1";
    alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
