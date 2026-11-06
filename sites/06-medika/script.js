document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('#menu-toggle'),nav=document.querySelector('#nav');if(menu&&nav){menu.addEventListener('click',()=>{let open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});}
 document.querySelectorAll('.faq-toggle').forEach(b=>b.addEventListener('click',()=>{const p=b.closest('.faq-item'),answer=p.querySelector('.faq-answer'),open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));p.classList.toggle('open',!open);answer.hidden=open;}));
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{const value=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('.service-card[data-category]').forEach(x=>x.hidden=value!=='all'&&x.dataset.category!==value);}));
 document.querySelectorAll('.service-expand').forEach(btn=>btn.addEventListener('click',()=>{const ex=btn.closest('.service-card').querySelector('.extra-text');let open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!open));ex.hidden=open;btn.innerHTML=(!open?'Свернуть':'Подробнее')+' <span aria-hidden="true">⌄</span>';}));
 document.querySelectorAll('[data-doctor]').forEach(a=>a.addEventListener('click',()=>{
  const doctor=a.dataset.doctor;
  try{sessionStorage.setItem('medika-doctor',doctor);}catch{
   const url=new URL(a.getAttribute('href'),location.href);url.searchParams.set('doctor',doctor);a.href=url.href;
  }
 }));
 const form=document.getElementById('booking-form');if(form){
  let selected=new URLSearchParams(location.search).get('doctor');
  try{selected=selected||sessionStorage.getItem('medika-doctor');if(selected)sessionStorage.removeItem('medika-doctor');}catch{}
  if(selected)form.elements.specialist.value=selected;const date=form.elements.date;if(date)date.min=new Date().toISOString().slice(0,10);
 form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form),errors={};const name=String(data.get('name')||'').trim(),phone=String(data.get('phone')||'').trim();if(name.length<2)errors.name='Укажите имя пациента';if(!/^\+?[0-9\s()-]{10,18}$/.test(phone)||phone.replace(/\D/g,'').length<10)errors.phone='Введите телефон в формате +7 (999) 000-00-00';if(!data.get('specialist'))errors.specialist='Выберите специалиста';if(!data.get('date'))errors.date='Выберите дату';if(!data.get('time'))errors.time='Выберите время';if(!data.get('agreement'))errors.agreement='Необходимо согласие';Object.keys(errors).concat(['name','phone','specialist','date','time','agreement']).forEach(key=>{const el=form.querySelector('[data-error="'+key+'"]');if(el)el.textContent=errors[key]||'';const inp=form.elements[key];if(inp)inp.classList.toggle('invalid',!!errors[key]);});let ok=!Object.keys(errors).length;const notice=document.getElementById('form-success');notice.classList.toggle('show',ok);if(ok)notice.scrollIntoView({behavior:'smooth',block:'center'});});}
});