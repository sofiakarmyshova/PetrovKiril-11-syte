
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuButton && nav) {
    const setMenu = (opened) => {
      nav.classList.toggle('open', opened);
      menuButton.setAttribute('aria-expanded', String(opened));
      menuButton.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
      document.body.classList.toggle('menu-open', opened && window.innerWidth <= 1000);
    };
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1000) setMenu(false); });
  }

  document.querySelectorAll('.expand-trigger').forEach(button => {
    const content = document.getElementById(button.getAttribute('aria-controls'));
    if (!content) return;
    button.addEventListener('click', () => {
      const opened = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(opened));
      button.querySelector('.expand-sign').textContent = opened ? '−' : '+';
      content.hidden = !opened;
    });
  });

  const timetable = [
    [ ['07:30', 'Йога и растяжка', 'Елена Андреева', 60, 'yoga'], ['10:00', 'Функциональный тренинг', 'Марина Соколова', 55, 'functional'], ['18:30', 'Бокс', 'Денис Волков', 60, 'boxing'], ['20:00', 'Групповые тренировки', 'Марина Соколова', 50, 'groups'] ],
    [ ['08:00', 'Тренажёрный зал', 'Алексей Крылов', 60, 'gym'], ['12:00', 'Йога и растяжка', 'Елена Андреева', 60, 'yoga'], ['19:00', 'Групповые тренировки', 'Марина Соколова', 50, 'groups'] ],
    [ ['07:30', 'Функциональный тренинг', 'Марина Соколова', 55, 'functional'], ['11:00', 'Персональные тренировки', 'Алексей Крылов', 60, 'personal'], ['18:00', 'Бокс', 'Денис Волков', 60, 'boxing'], ['20:00', 'Йога и растяжка', 'Елена Андреева', 60, 'yoga'] ],
    [ ['08:30', 'Йога и растяжка', 'Елена Андреева', 60, 'yoga'], ['17:30', 'Функциональный тренинг', 'Марина Соколова', 55, 'functional'], ['19:30', 'Групповые тренировки', 'Марина Соколова', 50, 'groups'] ],
    [ ['07:00', 'Тренажёрный зал', 'Алексей Крылов', 60, 'gym'], ['10:30', 'Йога и растяжка', 'Елена Андреева', 60, 'yoga'], ['18:30', 'Бокс', 'Денис Волков', 60, 'boxing'], ['20:00', 'Функциональный тренинг', 'Марина Соколова', 55, 'functional'] ],
    [ ['09:00', 'Групповые тренировки', 'Марина Соколова', 50, 'groups'], ['11:00', 'Йога и растяжка', 'Елена Андреева', 60, 'yoga'], ['13:00', 'Персональные тренировки', 'Алексей Крылов', 60, 'personal'] ],
    [ ['10:00', 'Йога и растяжка', 'Елена Андреева', 60, 'yoga'], ['12:00', 'Функциональный тренинг', 'Марина Соколова', 55, 'functional'] ]
  ];
  const weekdays = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
  const sessions = document.getElementById('sessions');
  const selectDirection = document.getElementById('client-direction');
  const formName = document.getElementById('client-name');
  const formPhone = document.getElementById('client-phone');
  const formDate = document.getElementById('client-date');
  const form = document.querySelector('.booking-form');
  const validDirections = new Set(['gym','functional','groups','yoga','boxing','personal']);

  if (sessions) {
    const makeRow = ([time, activity, trainer, length, direction]) => {
      const row = document.createElement('article');
      row.className = 'session-row';
      const timeBox = document.createElement('time');
      timeBox.className = 'session-time'; timeBox.textContent = time;
      const info = document.createElement('div'); info.className = 'session-info';
      const heading = document.createElement('h3'); heading.textContent = activity;
      const by = document.createElement('p'); by.textContent = trainer;
      const duration = document.createElement('small'); duration.className = 'session-length'; duration.textContent = length + ' мин';
      info.append(heading, by, duration);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'btn btn-border'; button.textContent = 'Записаться';
      button.addEventListener('click', () => {
        if (selectDirection) selectDirection.value = direction;
        document.getElementById('registration')?.scrollIntoView({behavior:'smooth',block:'start'});
        if (form) {form.querySelector('.form-feedback').textContent = '';form.querySelector('.form-feedback').className = 'form-feedback';}
        window.setTimeout(() => formName?.focus({preventScroll:true}), 350);
      });
      row.append(timeBox,info,button);return row;
    };
    const renderDay = (day) => {
      document.querySelectorAll('.day').forEach(button => {
        const selected = Number(button.dataset.day) === day;
        button.classList.toggle('active',selected);
        button.setAttribute('aria-selected',String(selected));
      });
      document.getElementById('day-title').textContent = weekdays[day];
      const count = timetable[day].length;
      document.getElementById('session-count').textContent = count + (count===1 ? ' занятие' : count>=2 && count<=4 ? ' занятия' : ' занятий');
      sessions.replaceChildren(...timetable[day].map(makeRow));
      sessions.setAttribute('aria-labelledby','day-'+day);
    };
    document.querySelectorAll('.day').forEach(button => button.addEventListener('click',()=>renderDay(Number(button.dataset.day))));
    renderDay(0);
  }

  if (selectDirection) {
    const selected = new URLSearchParams(window.location.search).get('direction');
    if (validDirections.has(selected)) selectDirection.value = selected;
  }
  if (formDate) {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset()*60000).toISOString().slice(0,10);
    formDate.min = local;
  }

  if (form) {
    const feedback = form.querySelector('.form-feedback');
    const phoneError = document.getElementById('phone-error');
    form.addEventListener('submit', event => {
      event.preventDefault();
      feedback.textContent = '';feedback.className='form-feedback';
      if (phoneError) phoneError.textContent='';
      if (!form.reportValidity()) return;
      const digits = formPhone.value.replace(/\D/g,'');
      if (digits.length < 10 || digits.length > 11) {
        if (phoneError) phoneError.textContent = 'Введите номер телефона из 10–11 цифр.';
        formPhone.focus();return;
      }
      if (formDate.value && formDate.value < formDate.min) {
        feedback.classList.add('error');feedback.textContent='Выберите сегодняшнюю или будущую дату.';formDate.focus();return;
      }
      feedback.classList.add('success');
      feedback.textContent='Форма заполнена успешно. Это учебная демонстрация, заявка не отправлена.';
    });
  }
});
