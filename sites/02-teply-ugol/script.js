const toggle = document.querySelector(".hamburger"),
  nav = document.querySelector(".nav");
toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "×" : "☰";
});
const modal = document.querySelector(".modal");
document.querySelectorAll("[data-book]").forEach((el) =>
  el.addEventListener("click", () => {
    modal.classList.add("open");
    modal.querySelector("input")?.focus();
  }),
);
document
  .querySelector(".close")
  ?.addEventListener("click", () => modal.classList.remove("open"));
modal?.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("open");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal?.classList.remove("open");
});
document.getElementById("book-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    "Это учебный проект. Заявка не отправлена. Для бронирования свяжитесь с кофейней по указанному номеру.",
  );
  modal.classList.remove("open");
});
const filters = document.querySelectorAll("[data-filter]"),
  search = document.querySelector("#menu-search");
let category = "Все";
function applyMenu() {
  let count = 0;
  document.querySelectorAll(".menu-item").forEach((item) => {
    const visible =
      (category === "Все" || item.dataset.category === category) &&
      item.textContent
        .toLowerCase()
        .includes((search?.value || "").trim().toLowerCase());
    item.hidden = !visible;
    if (visible) count++;
  });
  const output = document.querySelector("#menu-count");
  if (output) output.textContent = "Найдено: " + count;
}
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    category = btn.dataset.filter;
    filters.forEach((b) => b.classList.toggle("selected", b === btn));
    applyMenu();
  }),
);
search?.addEventListener("input", applyMenu);
