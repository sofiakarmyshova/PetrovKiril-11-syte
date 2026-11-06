'use strict';

const PRODUCTS = [
  {id:'tomatoes',name:'Томаты розовые',category:'fruits',price:249,unit:'кг',image:'tomatoes.webp'},
  {id:'apples',name:'Яблоки сезонные',category:'fruits',price:139,unit:'кг',image:'apples.webp'},
  {id:'avocado',name:'Авокадо спелое',category:'fruits',price:119,unit:'шт',image:'avocado.webp'},
  {id:'milk',name:'Молоко фермерское',category:'dairy',price:109,unit:'900 мл',image:'milk.webp'},
  {id:'yogurt',name:'Йогурт натуральный',category:'dairy',price:89,unit:'180 г',image:'yogurt.webp'},
  {id:'cheese',name:'Сыр сливочный',category:'dairy',price:329,unit:'250 г',image:'cheese.webp'},
  {id:'croissant',name:'Круассан классический',category:'bakery',price:79,unit:'шт',image:'croissant.webp'},
  {id:'bread',name:'Хлеб зерновой',category:'bakery',price:99,unit:'400 г',image:'bread.webp'},
  {id:'juice',name:'Сок апельсиновый',category:'drinks',price:169,unit:'1 л',image:'juice.webp'},
  {id:'water',name:'Вода минеральная',category:'drinks',price:59,unit:'1,5 л',image:'water.webp'},
  {id:'pasta',name:'Макароны из твёрдых сортов',category:'grocery',price:129,unit:'450 г',image:'pasta.webp'},
  {id:'oats',name:'Хлопья овсяные',category:'grocery',price:119,unit:'500 г',image:'oats.webp'}
];
const CATEGORIES = {fruits:'Овощи и фрукты',dairy:'Молочные продукты',bakery:'Выпечка',drinks:'Напитки',grocery:'Бакалея'};
const KEY = 'marketplus_cart_v1';
const byId = id => PRODUCTS.find(item => item.id === id);
const rubles = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    const clean = {};
    for (const [id, qty] of Object.entries(data)) {
      if (byId(id) && Number.isInteger(qty) && qty > 0 && qty <= 99) clean[id] = qty;
    }
    return clean;
  } catch { return {}; }
}
let cart = getCart();
function saveCart() {
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {  }
  refreshCounter();
}
function refreshCounter() {
  const total = Object.values(cart).reduce((sum, n) => sum + n, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => {el.textContent = String(total);});
  document.querySelectorAll('.cart-link').forEach(a => a.setAttribute('aria-label', `Корзина, товаров: ${total}`));
}
let toastTimeout;
function toast(message) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 2100);
}
function updateQty(id, delta) {
  if (!byId(id)) return;
  const next = Math.min(99,Math.max(0,(cart[id] || 0) + delta));
  if (next) cart[id] = next; else delete cart[id];
  saveCart();
  if (document.body.dataset.page === 'cart.html') renderCart();
}
function productImage(item) {
  return `<img class="product-image" src="assets/img/${item.image}" alt="${item.name}" loading="lazy" width="420" height="260">`;
}
function productCard(item) {
  return `<article class="product-card">${productImage(item)}<div class="product-body"><span class="product-category">${CATEGORIES[item.category]}</span><h3>${item.name}</h3><div class="product-bottom"><div class="product-price"><strong>${rubles(item.price)}</strong><small>/ ${item.unit}</small></div><button class="btn-square" data-add="${item.id}" type="button" aria-label="Добавить в корзину: ${item.name}" title="Добавить в корзину">+</button></div></div></article>`;
}
function renderHome() {
  const root=document.querySelector('#featured-products');
  if(root) root.innerHTML=PRODUCTS.slice(0,6).map(productCard).join('');
}
let filterValue = 'all';
function renderCatalog() {
  const root = document.querySelector('#catalog-products');
  if (!root) return;
  const search=document.querySelector('#search').value.trim().toLocaleLowerCase('ru');
  const sort=document.querySelector('#sort').value;
  const filtered=PRODUCTS.filter(p => (filterValue==='all'||p.category===filterValue) && p.name.toLocaleLowerCase('ru').includes(search));
  if(sort==='asc') filtered.sort((a,b)=>a.price-b.price);
  if(sort==='desc') filtered.sort((a,b)=>b.price-a.price);
  root.innerHTML=filtered.length?filtered.map(productCard).join(''):'<p class="no-results">Ничего не найдено. Попробуйте другую категорию или запрос.</p>';
  document.querySelector('#catalog-count').textContent=`Найдено: ${filtered.length}`;
  document.querySelectorAll('[data-filter]').forEach(button => {const active=button.dataset.filter===filterValue;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
function initCatalog() {
  if(!document.querySelector('#catalog-products'))return;
  const fromUrl = new URLSearchParams(location.search).get('category');
  if (fromUrl && (CATEGORIES[fromUrl] || fromUrl === 'all')) filterValue=fromUrl;
  document.querySelector('#search').addEventListener('input',renderCatalog);
  document.querySelector('#sort').addEventListener('change',renderCatalog);
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filterValue=b.dataset.filter;renderCatalog();}));
  renderCatalog();
}
const CART_SYMBOL = '<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13h12l2.4-9H6"/></svg>';
function cartItem(item,quantity) {
  return `<article class="cart-item"><img src="assets/img/${item.image}" alt="${item.name}" width="100" height="89"><div><h3>${item.name}</h3><p>${rubles(item.price)} / ${item.unit}</p><div class="quantity" role="group" aria-label="Количество товара ${item.name}"><button class="qty-btn" type="button" data-qty="-1" data-id="${item.id}" aria-label="Уменьшить количество ${item.name}">−</button><strong>${quantity}</strong><button class="qty-btn" type="button" data-qty="1" data-id="${item.id}" aria-label="Увеличить количество ${item.name}">+</button></div></div><div><strong class="price-sum">${rubles(item.price*quantity)}</strong><button class="remove-btn" type="button" data-remove="${item.id}">Удалить</button></div></article>`;
}
function checkoutMarkup(){
  return `<section class="checkout" id="checkout"><h2>Оформление заказа</h2><p class="muted small">Заполните форму, чтобы проверить оформление учебного заказа. Данные никуда не отправляются.</p><form id="order-form" novalidate><div class="checkout-grid"><div class="form-field"><label for="buyer-name">Имя *</label><input id="buyer-name" class="form-control" name="name" placeholder="Как к вам обращаться" autocomplete="name" maxlength="60" required></div><div class="form-field"><label for="buyer-phone">Телефон *</label><input id="buyer-phone" class="form-control" name="phone" inputmode="tel" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel" maxlength="20" required></div><div class="form-field full"><label>Способ получения *</label><div class="radio-choice"><label><input type="radio" name="delivery" value="pickup" checked> Самовывоз</label><label><input type="radio" name="delivery" value="courier"> Доставка</label></div></div><div class="form-field full" id="address-field" hidden><label for="buyer-address">Адрес доставки *</label><input id="buyer-address" class="form-control" name="address" placeholder="Улица, дом, квартира"></div><div class="form-field full"><label for="buyer-comment">Комментарий</label><textarea id="buyer-comment" class="form-control" name="comment" placeholder="Дополнительные пожелания (необязательно)"></textarea></div></div><label class="check-control"><input id="consent" type="checkbox" required><span>Я согласен(на) на обработку персональных данных в рамках учебной демонстрации *</span></label><button class="btn btn-primary checkout-submit" type="submit">Оформить заказ →</button><div id="order-status" class="status-message" role="status" aria-live="polite"></div></form></section>`;
}
function renderCart() {
  const root=document.querySelector('#cart-content');if(!root)return;
  const items=Object.entries(cart).map(([id,quantity])=>({item:byId(id),quantity})).filter(x=>x.item);
  if(!items.length){root.innerHTML=`<div class="empty-cart">${CART_SYMBOL}<h2>Корзина пока пуста</h2><p>Загляните в каталог — там много свежих продуктов.</p><a class="btn btn-primary" href="catalog.html">Перейти в каталог</a></div>`;return;}
  const sum=items.reduce((n,{item,quantity})=>n+item.price*quantity,0);
  const qty=items.reduce((n,x)=>n+x.quantity,0);
  root.innerHTML=`<div class="cart-layout"><div><div class="cart-list">${items.map(x=>cartItem(x.item,x.quantity)).join('')}</div>${checkoutMarkup()}</div><aside class="summary-card"><h2>Ваш заказ</h2><div class="summary-row"><span>Товаров</span><strong>${qty}</strong></div><div class="summary-row"><span>Стоимость товаров</span><strong>${rubles(sum)}</strong></div><div class="summary-row"><span>Доставка</span><span>Уточняется</span></div><div class="summary-row total"><span>Итого</span><strong>${rubles(sum)}</strong></div><a href="#checkout" class="btn btn-primary btn-block">Перейти к оформлению</a><button class="clear-cart" id="clear-cart" type="button">Очистить корзину</button><p class="small muted">Демонстрационная корзина. Оплата и доставка не осуществляются.</p></aside></div>`;
  initCheckout();
}
function initCheckout() {
  const form=document.querySelector('#order-form');if(!form)return;
  const address=document.querySelector('#address-field');
  const addressInput=document.querySelector('#buyer-address');
  form.querySelectorAll('input[name="delivery"]').forEach(radio=>radio.addEventListener('change',()=>{
    const delivery=form.elements.delivery.value==='courier';
    address.hidden=!delivery;addressInput.required=delivery;
  }));
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const status=document.querySelector('#order-status');
    status.className='status-message';status.textContent='';
    const phone=form.elements.phone.value.replace(/\D/g,'');
    if(!form.checkValidity()){
      status.classList.add('error');status.textContent='Заполните все обязательные поля и отметьте согласие.';
      form.reportValidity();return;
    }
    if(phone.length<10 || phone.length>11){
      status.classList.add('error');status.textContent='Проверьте номер телефона: нужно 10 или 11 цифр.';
      form.elements.phone.focus();return;
    }
    status.classList.add('success');status.textContent='Заказ оформлен в демонстрационном режиме. Данные никуда не отправлены.';
    form.querySelector('button[type="submit"]').disabled=true;
    cart={}; saveCart();
    document.querySelectorAll('.summary-card .btn-primary').forEach(a=>a.remove());
    toast('Демонстрационный заказ оформлен');
  });
}
function initMenu(){
  const toggle=document.querySelector('#mobile-toggle'),menu=document.querySelector('#mobile-nav');if(!toggle||!menu)return;
  toggle.addEventListener('click',()=>{
    const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');toggle.textContent=open?'×':'☰';
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';}});
  document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!toggle.contains(e.target)){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';}});
}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');
  if(add){updateQty(add.dataset.add,1);const item=byId(add.dataset.add);toast(`${item.name} добавлен в корзину`);}
  const qty=event.target.closest('[data-qty]');
  if(qty)updateQty(qty.dataset.id,Number(qty.dataset.qty));
  const remove=event.target.closest('[data-remove]');
  if(remove)updateQty(remove.dataset.remove,-(cart[remove.dataset.remove]||0));
  if(event.target.closest('#clear-cart')){cart={};saveCart();renderCart();}
});
initMenu();refreshCounter();renderHome();initCatalog();renderCart();
