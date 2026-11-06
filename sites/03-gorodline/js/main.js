const iconPath = "assets/icons/";
const isBus = (route) => route.type === "bus";
const transportName = (route) => (isBus(route) ? "Автобус" : "Трамвай");
const transportIcon = (route) =>
  `${iconPath}${isBus(route) ? "bus" : "tram"}.svg`;

function icon(name, size = 17) {
  return `<img src="${iconPath}${name}.svg" width="${size}" height="${size}" alt="" aria-hidden="true">`;
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  if (!toggle || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
  }

  toggle.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !toggle.contains(event.target))
      closeMenu();
  });
}

function popularCard(route) {
  const tram = route.type === "tram" ? " tram" : "";
  return `<article class="popular-card">
    <div class="popular-card-top">
      <span class="route-number${tram}">${route.number}</span>
      <span class="route-type">${icon(isBus(route) ? "bus" : "tram")}${transportName(route)}</span>
    </div>
    <div class="route-stops"><strong>${route.from}</strong>
      <span class="route-track" aria-hidden="true"><i></i><i></i></span>
      <strong>${route.to}</strong>
    </div>
    <div class="popular-card-bottom"><span>${icon("clock-small", 16)}${route.interval}</span>
      <a href="routes.html?route=${route.number}#route-list" class="mini-arrow" aria-label="Подробнее о маршруте ${route.number}">${icon("arrow-blue", 18)}</a>
    </div>
  </article>`;
}

function setupHome() {
  const list = document.querySelector("#popular-routes");
  if (list) list.innerHTML = routes.slice(0, 4).map(popularCard).join("");
}

function routeCard(route) {
  const tram = route.type === "tram" ? " tram" : "";
  const id = `details-${route.number}`;
  return `<article class="route-row" data-number="${route.number}">
    <div class="route-row-main">
      <div class="number-block"><span class="route-number${tram}">${route.number}</span><span class="route-type">${transportName(route)}</span></div>
      <div class="route-location start"><small class="point-label">Начальная</small><strong>${route.from}</strong></div>
      <div class="route-connector" aria-hidden="true"></div>
      <div class="route-location final"><small class="point-label">Конечная</small><strong>${route.to}</strong></div>
      <div class="route-meta work"><small>${icon("clock", 18)}Время работы</small><strong>${route.hours}</strong></div>
      <div class="route-meta interval"><small>${icon("calendar", 18)}Интервал</small><strong>${route.interval}</strong></div>
      <button class="route-details-btn" type="button" aria-controls="${id}" aria-expanded="false">Подробнее ${icon("chevron", 17)}</button>
    </div>
    <div class="route-details" id="${id}" hidden><p>Основные остановки</p><ul>${route.stops.map((stop) => `<li>${stop}</li>`).join("")}</ul><a href="schedule.html?route=${route.number}">Посмотреть расписание →</a></div>
  </article>`;
}

function setupRoutes() {
  const input = document.querySelector("#route-input");
  const list = document.querySelector("#route-list");
  if (!input || !list) return;

  const buttons = document.querySelectorAll("[data-filter]");
  const count = document.querySelector("#route-count");
  const empty = document.querySelector("#no-routes");
  let activeType = "all";

  function render() {
    const query = input.value.toLocaleLowerCase("ru").trim().replace(/ё/g, "е");
    const found = routes.filter((route) => {
      const matchType = activeType === "all" || route.type === activeType;
      const text =
        `${route.number} ${route.from} ${route.to} ${route.stops.join(" ")}`
          .toLocaleLowerCase("ru")
          .replace(/ё/g, "е");
      return matchType && text.includes(query);
    });
    list.innerHTML = found.map(routeCard).join("");
    count.textContent = `Найдено маршрутов: ${found.length}`;
    empty.hidden = found.length !== 0;
  }

  input.addEventListener("input", render);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeType = button.dataset.filter;
      buttons.forEach((item) => {
        const chosen = item === button;
        item.classList.toggle("is-selected", chosen);
        item.setAttribute("aria-pressed", String(chosen));
      });
      render();
    });
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest(".route-details-btn");
    if (!button) return;
    const details = document.getElementById(
      button.getAttribute("aria-controls"),
    );
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    details.hidden = expanded;
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      input.focus();
      input.select();
    }
  });
  render();

  const requested = new URLSearchParams(location.search).get("route");
  if (requested && routes.some((route) => route.number === requested)) {
    const button = list.querySelector(
      `[data-number="${requested}"] .route-details-btn`,
    );
    if (button) button.click();
  }
}

function minutes(time) {
  const parts = time.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

function formatTime(value) {
  const minutesInDay = 1440;
  const time = ((value % minutesInDay) + minutesInDay) % minutesInDay;
  return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;
}

function setupSchedule() {
  const select = document.querySelector("#schedule-route");
  if (!select) return;
  const buttons = document.querySelectorAll("[data-day]");
  const number = document.querySelector("#selected-route-number");
  const tableNumber = document.querySelector("#table-number");
  const transport = document.querySelector("#table-transport");
  const title = document.querySelector("#table-name");
  const body = document.querySelector("#schedule-body");
  const intervalText = document.querySelector("#schedule-interval");
  let day = "weekday";

  select.innerHTML = routes
    .map(
      (route) =>
        `<option value="${route.number}">Маршрут ${route.number} — ${route.from} → ${route.to}</option>`,
    )
    .join("");
  const requested = new URLSearchParams(location.search).get("route");
  if (routes.some((route) => route.number === requested))
    select.value = requested;

  function render() {
    const route =
      routes.find((item) => item.number === select.value) || routes[0];
    const isTram = !isBus(route);
    number.textContent = route.number;
    tableNumber.textContent = route.number;
    number.classList.toggle("tram", isTram);
    tableNumber.classList.toggle("tram", isTram);
    transport.textContent = transportName(route);
    title.textContent = `${route.from} — ${route.to}`;
    intervalText.textContent = route.interval;

    const start =
      day === "weekday"
        ? minutes(route.firstDeparture)
        : Math.max(7 * 60, minutes(route.firstDeparture) + 40);
    const departureGap =
      day === "weekday" ? (route.number === "12" ? 20 : 15) : 25;
    body.innerHTML = route.stops
      .map((stop, index) => {
        const stopOffset = 8 * index;
        const times = [0, 1, 2, 3]
          .map(
            (trip) =>
              `<td>${formatTime(start + trip * departureGap + stopOffset)}</td>`,
          )
          .join("");
        return `<tr><td><span class="stop-id">${index + 1}</span>${stop}</td>${times}</tr>`;
      })
      .join("");
  }

  select.addEventListener("change", render);
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      day = button.dataset.day;
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      render();
    }),
  );
  render();
}

function setupForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const status = document.querySelector("#form-result");

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => field.classList.remove("invalid"));
    field.addEventListener("change", () => field.classList.remove("invalid"));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll("[required]")];
    const invalid = fields.filter((field) => !field.checkValidity());
    fields.forEach((field) =>
      field.classList.toggle("invalid", invalid.includes(field)),
    );
    if (invalid.length) {
      status.classList.add("error");
      status.textContent =
        "Пожалуйста, правильно заполните все обязательные поля.";
      invalid[0].focus();
      return;
    }
    status.classList.remove("error");
    status.textContent =
      "Форма заполнена правильно! Это учебный сайт: сообщение не отправляется на сервер.";
    form.reset();
  });
}

function setupDialogs() {
  document.querySelectorAll("[data-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(
        `${button.dataset.dialogOpen}-dialog`,
      );
      if (dialog) dialog.showModal();
    });
  });
  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

setupMenu();
setupHome();
setupRoutes();
setupSchedule();
setupForm();
setupDialogs();
