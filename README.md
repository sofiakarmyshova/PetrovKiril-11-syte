# Портфолио — 10 учебных сайтов

Откройте `index.html` в корне архива. Появится страница-портфолио с карточками и ссылками на все десять сайтов. Все сайты находятся в подпапках `sites/`, каждый имеет собственный `index.html`. Ссылки внутри сайтов относительные, поэтому сайты можно разместить как один статический проект, без сервера.

| № | Проект | Папка |
|---|---|---|
| 01 | Ритм Банк | `sites/01-ritm-bank/` |
| 02 | Тёплый угол | `sites/02-teply-ugol/` |
| 03 | ГородЛайн | `sites/03-gorodline/` |
| 04 | Рядом | `sites/04-ryadom/` |
| 05 | Код Академия | `sites/05-kod-academy/` |
| 06 | Медика | `sites/06-medika/` |
| 07 | АРТ.КВАРТАЛ | `sites/07-art-kvartal/` |
| 08 | ИМПУЛЬС | `sites/08-impulse/` |
| 09 | МАРКЕТ+ | `sites/09-market-plus/` |
| 10 | ЧИСТО | `sites/10-chisto/` |


## Исходники кофейни

В папке `sites/02-teply-ugol/` находятся оригинальные исходники из архива `teply-ugol-site-updated(1).zip`: пять страниц, оригинальные фотографии и файлы CSS/JavaScript.

## Дизайн-макеты Figma

У каждой карточки на главной странице есть отдельная кнопка **«Макет в Figma ↗»**. Она открывает оригинальный дизайн в новой вкладке. Все десять адресов также перечислены ниже:

01. Ритм Банк: https://www.figma.com/design/u5F5hNCu7eyUfhZTA8YIiY/Untitled?node-id=0-1
02. Тёплый угол: https://www.figma.com/design/irxVxS94X7M48gZsLvwRZ5/GPT?t=t4S8dKqmavQwTYJ7-0
03. ГородЛайн: https://www.figma.com/design/fxIRLlRHQ1P1or5Bz0uIV9/Untitled?node-id=0-1
04. Рядом: https://www.figma.com/design/ORHd4vFm6SD6Uod5UwNruS/Untitled?node-id=0-1
05. Код Академия: https://www.figma.com/design/KVOCJI7QEmnszRC2WYe0mH/Untitled?node-id=0-1
06. Медика: https://www.figma.com/design/uulFl0qQtRsPlzi51fTruu/Untitled?node-id=0-1
07. АРТ.КВАРТАЛ: https://www.figma.com/design/lTyPnw6e8D04L2hzDk3QTJ/Untitled?node-id=0-1
08. ИМПУЛЬС: https://www.figma.com/design/HySfrOvomqnvmRZJsWHVLq/Untitled?node-id=0-1
09. МАРКЕТ+: https://www.figma.com/design/T6WolrEIAGmVuKnNyP2o3h/Untitled?node-id=0-1
10. ЧИСТО: https://www.figma.com/design/nuuM6pfgCd98mbrOTuSeDV/Untitled?node-id=0-1

## Проверка и публикация

Для размещения загрузите **содержимое** папки `Portfolio_10_Sites` на статический хостинг: `index.html` должен лежать в корне опубликованного сайта. Сайты расположены в `sites/`; у каждого есть ссылка «← К портфолио» в нижней части страниц. HTML, CSS, JS и фотографии сохранены локально. Подключаемые Google Fonts требуют интернета; системные шрифты используются как запасные.

**Перед размещением на хостинге:** заменить `https://example.com` на адрес опубликованного портфолио во всех `sitemap.xml` и `robots.txt` (примерные домены намеренно не выдаются за рабочие). Если портфолио будет размещаться во вложенной папке, добавить префикс пути и в карты сайтов. Отправка форм и оформление заказов работают в учебном режиме без сервера. Тексты с адресами, ценами и событиями демонстрационные.

## GitHub Pages

Портфолио: https://sofiakarmyshova.github.io/PetrovKiril-11-syte/

Публикация: GitHub Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
Файл `.nojekyll` включает публикацию статических файлов без обработки Jekyll.
Изменения в `main` автоматически публикуются на сайте.
