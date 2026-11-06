document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle"),
    mobile = document.querySelector(".mobile-menu");
  if (menu && mobile) {
    menu.addEventListener("click", () => {
      let open = mobile.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
    mobile.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobile.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      }),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        mobile.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      }
    });
  }
  const form = document.querySelector("#consultation-form");
  if (form) {
    const date = form.querySelector("input[type=date]");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    date.min = `${yyyy}-${mm}-${dd}`;
    const phone = form.elements.phone;
    phone.addEventListener("input", () => {
      let digits = phone.value.replace(/\D/g, "");
      if (digits.startsWith("8")) digits = "7" + digits.slice(1);
      if (digits.length && digits[0] !== "7") digits = "7" + digits;
      digits = digits.slice(0, 11);
      if (!digits.length) {
        phone.value = "";
        return;
      }
      let v = "+7";
      if (digits.length > 1) v += " (" + digits.slice(1, 4);
      if (digits.length >= 4) v += ")";
      if (digits.length > 4) v += " " + digits.slice(4, 7);
      if (digits.length > 7) v += "-" + digits.slice(7, 9);
      if (digits.length > 9) v += "-" + digits.slice(9, 11);
      phone.value = v;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-feedback");
      status.className = "form-feedback";
      const inputs = [...form.querySelectorAll("input,select,textarea")];
      inputs.forEach((i) => i.removeAttribute("aria-invalid"));
      let bad = [];
      for (const i of inputs) {
        let valid = i.checkValidity();
        if (i.name === "phone" && i.value.replace(/\D/g, "").length !== 11)
          valid = false;
        if (!valid) {
          i.setAttribute("aria-invalid", "true");
          bad.push(i);
        }
      }
      if (bad.length) {
        status.textContent =
          "Проверьте обязательные поля: имя, телефон, услугу, дату и согласие на обработку данных.";
        status.classList.add("error");
        bad[0].focus();
        return;
      }
      status.textContent =
        "Заявка заполнена успешно. Это учебный сайт, поэтому данные никуда не отправляются.";
      status.classList.add("success");
      form.reset();
    });
  }
});
