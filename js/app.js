"use strict";
// DriveNow Final: a static, localStorage-powered student demo, not real authentication.
(() => {
  const CARS = window.DRIVENOW_CARS || [];
  const WORDS = window.DRIVENOW_TEXT || {};
  const PAGES = ['index.html','cars.html','car-details.html','booking.html','login.html','profile.html','my-bookings.html','compare.html','settings.html','about.html'];
  const page = document.body.dataset.page || 'index';
  const params = new URLSearchParams(location.search);
  const $ = (q,scope=document) => scope.querySelector(q);
  const $$ = (q,scope=document) => [...scope.querySelectorAll(q)];
  const read = (key,fallback) => { try { const v=localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } };
  const save = (key,value) => { try {localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;} };
  const readText = (key,fallback='') => { try {return localStorage.getItem(key)||fallback;}catch{return fallback;} };
  const writeText = (key,value) => { try {localStorage.setItem(key,value);}catch{} };
  let language = readText('dn_lang','en');
  if (!['en','kk','ru'].includes(language)) language='en';
  const langIndex = {en:0,kk:1,ru:2};
  const t = key => WORDS[key]?.[langIndex[language]] || WORDS[key]?.[0] || key;
  const esc = input => String(input ?? '').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const money = val => new Intl.NumberFormat('en-US').format(Number(val)||0);
  const img=(car)=>esc(car.image);
  const fallback=(car)=>esc(car.fallback||'images/hero-car.jpeg');
  const carById=(id)=> CARS.find(c=>c.id===id);
  const session=()=>readText('dn_session','');
  const account=()=> read('dn_users',[]).find(u=>u.email===session()) || null;
  const scopedKey = name => `dn_${name}_${session()}`;
  const favIds=()=>read(scopedKey('favorites'),[]);
  const reviewList=()=>read('dn_reviews',[]);
  const displayRating=car=>{const mine=reviewList().filter(r=>r.car===car.id);return mine.length?(mine.reduce((sum,r)=>sum+Number(r.rating),0)/mine.length).toFixed(1):car.rating;};
  const bookingList=()=>read('dn_bookings',[]);
  const todayLocal=()=> {const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
  const safeNext = input => { try { let u=new URL(input,location.href); const file=u.pathname.split('/').pop(); if (u.origin!==location.origin||!PAGES.includes(file))return ''; return file+u.search; } catch{return '';} };
  const linkToLogin=(next='profile.html',signup=false)=>'login.html?next='+encodeURIComponent(safeNext(next)||'profile.html')+(signup?'&mode=signup':'');
  const toast=msg=>{let e=$('#toast');if(!e)return;e.textContent=msg;e.classList.add('show');clearTimeout(window.__dnToast);window.__dnToast=setTimeout(()=>e.classList.remove('show'),3000)};
  const icons = {
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',car:'<path d="M5 17h14l1-5-3-5H7l-3 5 1 5ZM7 17v2M17 17v2M5 12h14"/><circle cx="8" cy="14" r=".7"/><circle cx="16" cy="14" r=".7"/>',moon:'<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',heart:'<path d="M20.8 8.4C20.8 13.2 12 20 12 20S3.2 13.2 3.2 8.4a4.4 4.4 0 0 1 8.8 0 4.4 4.4 0 0 1 8.8 0Z"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 1-1.7-1.2-2 1.2-2-1-1.7-2.2.2-1.8-1-1-2h-2l-1 2-1.8 1-2.2-.2-1 1.7 1.2 2-1.2 2 1 1.7 2.2-.2 1.8 1 1 2h2l1-2 1.8-1 2.2.2Z"/>',history:'<path d="M4 12a8 8 0 1 0 3-6M4 4v4h4M12 8v5l3 2"/>',compare:'<path d="M8 3v18M16 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-6 6-6 12 0 18M12 3c6 6 6 12 0 18"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',check:'<path d="m5 12 4 4L19 6"/>',pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.7"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',shield:'<path d="M12 2 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-4Z"/><path d="m8 12 3 3 5-6"/>',wallet:'<rect x="2.5" y="5" width="19" height="15" rx="2"/><path d="M3 9h18M16 14h3"/>',spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',star:'<path d="m12 2 3.1 6.5 7.1 1-5.1 5 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5.1-5 7.1-1L12 2Z"/>',logout:'<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M14 7l5 5-5 5m5-5H9"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',filter:'<path d="M4 6h16M7 12h10M10 18h4"/>'
  };
  const icon=(name,cl='')=>`<svg class="icon ${cl}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.car}</svg>`;
  const chip=(s)=>`<span class="chip">${esc(s)}</span>`;
  const price=(n)=>`<span class="price">${money(n)} <span class="price-unit">KZT ${t('day')}</span></span>`;
  const pageTop=(label,title,sub)=>`<section class="page-top"><div class="container"><p class="section-label">${esc(label)}</p><h1>${esc(title)}</h1><p>${esc(sub)}</p></div></section>`;
  const field=(id,label,type='text',placeholder='',value='')=>`<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${id}" type="${type}" placeholder="${esc(placeholder)}" value="${esc(value)}" aria-describedby="${id}-error"><span class="field-error" id="${id}-error" aria-live="polite"></span></div>`;
  const select=(id,label,options)=>`<div class="field"><label for="${id}">${esc(label)}</label><select id="${id}" name="${id}" aria-describedby="${id}-error">${options.map(v=>`<option value="${esc(v.value)}">${esc(v.label)}</option>`).join('')}</select><span class="field-error" id="${id}-error" aria-live="polite"></span></div>`;
  const textarea=(id,label,placeholder='')=>`<div class="field"><label for="${id}">${esc(label)}</label><textarea id="${id}" placeholder="${esc(placeholder)}" aria-describedby="${id}-error"></textarea><span class="field-error" id="${id}-error" aria-live="polite"></span></div>`;
  const status=(id)=>`<p id="${id}" class="status" role="status" aria-live="polite"></p>`;
  const imgTag=(car,cl='car-image')=>`<img class="${cl}" src="${img(car)}" data-fallback="${fallback(car)}" alt="${esc(car.name)}" loading="lazy">`;
  function imgFallbacks(){ $$('img[data-fallback]').forEach(e=>e.addEventListener('error',()=>{const f=e.dataset.fallback;if(e.src.endsWith(f)||e.dataset.fellback)return;e.dataset.fellback='1';e.src=f;})); }
  function renderHeader(){
    const nav=[['index','home'],['cars','cars'],['booking','booking'],['about','about']];
    $('#site-header').innerHTML=`<header class="header"><div class="container header-inner">
     <button id="openMenu" class="icon-btn menu-btn" aria-label="${t('menuOpen')}" aria-controls="sidebar" aria-expanded="false">${icon('menu')}</button>
     <a href="index.html" class="brand" aria-label="DriveNow Home"><span class="brand-mark">${icon('car','icon-lg')}</span><span>Drive<strong>Now</strong></span></a>
     <nav class="desktop-nav" aria-label="Main navigation">${nav.map(([id,k])=>`<a href="${id}.html" class="nav-link ${page===id?'active':''}">${t(k)}</a>`).join('')}</nav>
     <div class="header-actions">
       <div class="language-select"><label class="mini muted" for="globalLanguage" style="position:absolute;clip:rect(0,0,0,0)">${t('language')}</label><select id="globalLanguage" aria-label="${t('language')}"><option value="en" ${language==='en'?'selected':''}>EN</option><option value="kk" ${language==='kk'?'selected':''}>ҚАЗ</option><option value="ru" ${language==='ru'?'selected':''}>РУС</option></select></div>
       <a class="btn btn-sm auth-nav" href="${account()?'profile.html':'login.html'}">${icon('user')} ${account()?t('profile'):t('login')}</a>
       <button id="themeToggle" class="icon-btn theme-toggle" aria-label="${t('theme')}" title="${t('theme')}">${icon(document.documentElement.dataset.theme==='light'?'moon':'sun')}</button>
     </div>
   </div></header>
   <div id="sidebarBackdrop" class="sidebar-backdrop"></div>
   <aside id="sidebar" class="sidebar" aria-label="${t('menu')}" aria-hidden="true">
     <div class="sidebar-head"><a href="index.html" class="brand">Drive<strong>Now</strong></a><button id="closeMenu" class="icon-btn" aria-label="${t('menuClose')}">${icon('close')}</button></div>
     <p class="sidebar-title">${t('menu')}</p>
     <nav class="side-nav">${[['profile','user','profile'],['my-bookings','history','bookings'],['compare','compare','compare'],['settings','settings','settings']].map(([p,i,k])=>`<a href="${p}.html" class="${page===p?'active':''}">${icon(i)}${t(k)}</a>`).join('')}
      <a href="profile.html#favorites">${icon('heart')}${t('favorites')}</a>
      <a href="about.html#contact">${icon('mail')}${t('contact')}</a>
     </nav>
     <p class="sidebar-title">${t('language')}</p><div class="side-nav">${[['en','English'],['kk','Қазақша'],['ru','Русский']].map(([code,name])=>`<a href="#" data-set-language="${code}" ${language===code?'class="active"':''}>${icon('globe')}${name}</a>`).join('')}</div>
     ${account()?`<button class="btn btn-outline" id="logoutBtn">${icon('logout')}${t('logout')}</button>`:`<a href="login.html" class="btn btn-gold">${icon('user')}${t('login')}</a>`}
     <p class="sidebar-note">${t('demoOnly')}</p>
   </aside>`;
    const sidebar=$('#sidebar'), open=$('#openMenu');
    function closeMenu(){document.body.classList.remove('sidebar-open');open.setAttribute('aria-expanded','false');sidebar.setAttribute('aria-hidden','true');open.focus()}
    open.addEventListener('click',()=>{document.body.classList.add('sidebar-open');open.setAttribute('aria-expanded','true');sidebar.setAttribute('aria-hidden','false');$('#closeMenu').focus()});
    $('#closeMenu').addEventListener('click',closeMenu);
    $('#sidebarBackdrop').addEventListener('click',closeMenu);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('sidebar-open'))closeMenu()});
    $('#themeToggle').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;writeText('dn_theme',next);$('#themeToggle').innerHTML=icon(next==='light'?'moon':'sun')});
    $('#globalLanguage').addEventListener('change',e=>updateLanguage(e.target.value));
    $$('[data-set-language]').forEach(e=>e.addEventListener('click',ev=>{ev.preventDefault();updateLanguage(e.dataset.setLanguage)}));
    $('#logoutBtn')?.addEventListener('click',()=>{writeText('dn_session','');location.href='index.html'});
  }
  function updateLanguage(value){if(!['en','kk','ru'].includes(value))return;writeText('dn_lang',value);location.reload()}
  function renderFooter(){ $('#site-footer').innerHTML=`<footer class="footer"><div class="container"><div class="footer-grid"><div><a href="index.html" class="brand">Drive<strong>Now</strong></a><p class="small" style="max-width:340px;margin-top:13px">${t('heroSub')}</p></div><div><strong>${t('cars')}</strong><div class="footer-links" style="margin-top:12px"><a href="cars.html">${t('allCars')}</a><a href="compare.html">${t('compare')}</a><a href="my-bookings.html">${t('bookings')}</a></div></div><div><strong>${t('about')}</strong><div class="footer-links" style="margin-top:12px"><a href="about.html">${t('about')}</a><a href="about.html#contact">${t('contact')}</a><a href="settings.html">${t('settings')}</a></div></div></div><div class="footer-bottom"><span>© 2026 DriveNow • SE-2501 • Amangeldi Sherkhan &amp; Bekzat Abilkhaev</span><span>${t('demoOnly')}</span></div></div></footer>`; }
  function carCard(car){
    const favored=account()&&favIds().includes(car.id);
    const compared=read('dn_compare',[]).includes(car.id);
    return `<article class="car-card"><div class="car-image-wrap"><a href="car-details.html?id=${encodeURIComponent(car.id)}" aria-label="${esc(car.name)}">${imgTag(car)}</a><span class="floating-tag">${esc(car.category)}</span><button class="fav-button ${favored?'is-active':''}" data-fav="${car.id}" aria-label="${t('favorites')} - ${esc(car.name)}" aria-pressed="${!!favored}">${icon('heart')}</button></div><div class="car-body"><div class="split"><span class="section-label" style="margin:0;letter-spacing:.1em">${esc(car.brand)}</span><span class="rating">★ ${displayRating(car)}</span></div><h3><a href="car-details.html?id=${encodeURIComponent(car.id)}">${esc(car.name)}</a></h3><p class="car-desc">${localizedDescription(car)}</p><div class="car-specs">${chip(t('automatic'))}${chip(car.seats+' '+t('seats'))}${chip(t(car.fuel.toLowerCase()))}</div><div class="price-row"><div>${price(car.price)}</div><a href="${bookLink(car.id)}" class="btn btn-gold btn-sm">${t('bookNow')} ${icon('arrow')}</a></div><div class="card-actions"><a class="btn btn-sm" href="car-details.html?id=${encodeURIComponent(car.id)}">${icon('info')}${t('viewDetails')}</a><label class="check-control"><input data-compare="${car.id}" type="checkbox" ${compared?'checked':''} aria-label="${t('addCompare')} ${esc(car.name)}">${t('compare')}</label></div></div></article>`;
  }
  function localizedDescription(car){if(language==='en') return esc(car.description);const desc={kk:{Comfort:'Күнделікті сапарларға ыңғайлы, жайлы көлік.',Business:'Іскерлік сапарларға арналған таңдаулы автомобиль.',Premium:'Жоғары жайлылық пен ерекше басқару сезімі.',Luxury:'Ерекше сапарларға арналған люкс автомобиль.'},ru:{Comfort:'Комфортный автомобиль для повседневных поездок.',Business:'Автомобиль для деловых и дальних поездок.',Premium:'Высокий комфорт и впечатляющая динамика.',Luxury:'Роскошный автомобиль для особенных поездок.'}};return esc(desc[language]?.[car.category]||car.description)}
  function bookLink(id){const next='booking.html?car='+encodeURIComponent(id);return account()?next:linkToLogin(next)}
  function bindCars(scope=document){
    $$('[data-fav]',scope).forEach(b=>b.addEventListener('click',()=>{
      if(!account()){writeText('dn_pending_fav',b.dataset.fav);location.href=linkToLogin('car-details.html?id='+encodeURIComponent(b.dataset.fav));return}
      const key=scopedKey('favorites');let fav=favIds();fav=fav.includes(b.dataset.fav)?fav.filter(id=>id!==b.dataset.fav):[...fav,b.dataset.fav];save(key,fav);toast(t('favoritesChanged'));b.classList.toggle('is-active',fav.includes(b.dataset.fav));b.setAttribute('aria-pressed',String(fav.includes(b.dataset.fav)));
      if(page==='profile')renderProfile();
    }));
    $$('[data-compare]',scope).forEach(input=>input.addEventListener('change',()=>{
      let arr=read('dn_compare',[]);
      if(input.checked){if(arr.length>=2){input.checked=false;toast(t('maxCompare'));return}arr.push(input.dataset.compare)}
      else arr=arr.filter(id=>id!==input.dataset.compare);
      save('dn_compare',[...new Set(arr)]);const count=$('#compareCount');if(count)count.textContent=arr.length;if(page==='compare')renderCompare();
      if(input.checked&&arr.length===2)toast(t('compare')+': 2');
    }));
  }
  function home(){
    $('#app').innerHTML=`<section class="hero"><img class="hero-bg" src="images/hero-car.jpeg" alt="Luxury vehicle"/><div class="container"><div class="hero-content"><p class="section-label">${t('heroEyebrow')}</p><h1>${t('heroTitle')}</h1><p>${t('heroSub')}</p><div class="split wrap" style="justify-content:flex-start;margin-top:30px"><a class="btn btn-gold" href="cars.html">${t('browseCars')} ${icon('arrow')}</a><a class="btn btn-outline" href="about.html">${t('about')}</a></div><div class="hero-stats"><div><strong>20+</strong><small>${t('available')}</small></div><div><strong>04</strong><small>${t('categories')}</small></div><div><strong>03</strong><small>${t('language')}</small></div></div></div></div></section>
      <section class="section"><div class="container"><div class="heading-row"><div><p class="section-label">${t('curated')}</p><h2>${t('featured')}</h2><p class="muted">${t('featuredSub')}</p></div><a class="btn btn-outline" href="cars.html">${t('allCars')} ${icon('arrow')}</a></div><div class="car-grid">${[carById('bmw'),carById('camry'),carById('mercedes')].map(carCard).join('')}</div></div></section>
      <section class="section section-muted"><div class="container"><p class="section-label center">${t('why')}</p><h2 class="center" style="margin-bottom:10px">${t('whyTitle')}</h2><p class="center muted" style="margin-bottom:33px">${t('whySub')}</p><div class="features">${[['car','feature1','f1desc'],['wallet','feature2','f2desc'],['shield','feature3','f3desc'],['calendar','feature4','f4desc']].map(([i,title,d])=>`<article class="feature card-hover"><span class="icon-box">${icon(i)}</span><h3>${t(title)}</h3><p>${t(d)}</p></article>`).join('')}</div></div></section>
      <section class="section center"><div class="container narrow"><p class="section-label">DriveNow</p><h2>${t('ctaTitle')}</h2><p class="muted">${t('ctaSub')}</p><a class="btn btn-gold" href="cars.html">${t('chooseCar')} ${icon('arrow')}</a></div></section>`;
    bindCars();
  }
  function catalog(){
    $('#app').innerHTML=`${pageTop('DRIVENOW / COLLECTION',t('catalogTitle'),t('catalogSub'))}<section class="section" style="padding-top:15px"><div class="container"><div class="panel" style="margin-bottom:20px"><div class="filters">
      <div class="field"><label for="filterSearch">${t('search')}</label><div class="search-field">${icon('search')}<input id="filterSearch" placeholder="Toyota, BMW, Audi…"></div></div>
      ${select('filterCategory',t('category'),[{value:'',label:t('all')},...['Comfort','Business','Premium','Luxury'].map(v=>({value:v,label:v}))])}
      ${select('filterBrand',t('brand'),[{value:'',label:t('all')},...[...new Set(CARS.map(c=>c.brand))].sort().map(v=>({value:v,label:v}))])}
      ${select('filterSort',t('sort'),[{value:'default',label:t('default')},{value:'low',label:t('low')},{value:'high',label:t('high')},{value:'alpha',label:t('alpha')}])}
      </div><div class="filters-bottom" style="margin-bottom:0">${select('filterPrice',t('maxPrice'),[{value:'300000',label:'300,000 KZT'},...['30000','50000','80000','120000','200000'].map(v=>({value:v,label:money(v)+' KZT'}))])}<button class="btn btn-outline btn-sm" id="resetFilters">${icon('filter')}${t('reset')}</button></div></div><div class="filters-bottom"><strong id="carCount"></strong><a class="btn btn-outline btn-sm" href="compare.html">${icon('compare')}${t('compare')} (<span id="compareCount">${read('dn_compare',[]).length}</span>/2)</a></div><div id="carGrid" class="car-grid"></div></div></section>`;
    const saved=read('dn_filters',{});
    for(const [k,v] of Object.entries(saved)){const el=$('#'+k);if(el)el.value=v}
    function update(){
      const q=$('#filterSearch').value.trim().toLowerCase();const cat=$('#filterCategory').value;const brand=$('#filterBrand').value;const sort=$('#filterSort').value;const limit=Number($('#filterPrice').value);
      let list=CARS.filter(c=>(c.name.toLowerCase().includes(q)||c.category.toLowerCase().includes(q))&&(!cat||c.category===cat)&&(!brand||c.brand===brand)&&c.price<=limit);
      if(sort==='low')list.sort((a,b)=>a.price-b.price);else if(sort==='high')list.sort((a,b)=>b.price-a.price);else if(sort==='alpha')list.sort((a,b)=>a.name.localeCompare(b.name));
      $('#carCount').textContent=list.length+' '+t('found');$('#carGrid').innerHTML=list.length?list.map(carCard).join(''):`<div class="empty" style="grid-column:1/-1">${t('noCars')}</div>`;
      save('dn_filters',Object.fromEntries(['filterSearch','filterCategory','filterBrand','filterSort','filterPrice'].map(id=>[id,$('#'+id).value])));
      bindCars($('#carGrid'));imgFallbacks();
    }
    $$('input,select',$('#app')).forEach(e=>e.addEventListener('input',update));
    $('#resetFilters').addEventListener('click',()=>{['filterSearch','filterCategory','filterBrand'].forEach(id=>$('#'+id).value='');$('#filterSort').value='default';$('#filterPrice').value='300000';update()});
    update();
  }
  function details(){
    const car=carById(params.get('id'))||CARS[0];
    $('#app').innerHTML=`${pageTop('DRIVENOW / '+esc(car.category),car.name,t('detailsTitle'))}<section class="section" style="padding-top:10px"><div class="container"><div class="details-layout"><div>${imgTag(car,'details-photo')}<div class="panel" style="margin-top:23px"><h3>${t('specs')}</h3><div class="spec-table">${[[t('brand'),car.brand],[t('category'),car.category],[t('transmission'),t('automatic')],[t('passengers'),car.seats+' '+t('seats')],[t('fuel'),t(car.fuel.toLowerCase())],[t('rating'),'★ '+displayRating(car)]].map(([k,v])=>`<div class="spec-cell"><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`).join('')}</div></div></div><div class="panel"><p class="section-label">${esc(car.category)}</p><h2>${esc(car.name)}</h2><p class="muted">${localizedDescription(car)}</p><hr class="divider"><p class="muted small" style="margin:0">${t('dailyRate')}</p><div style="margin:10px 0 24px">${price(car.price)}</div><div class="stack"><a href="${bookLink(car.id)}" class="btn btn-gold btn-block">${t('requestBooking')} ${icon('arrow')}</a><button class="btn btn-outline btn-block" data-fav="${car.id}">${icon('heart')} ${t('favorites')}</button><label class="check-control"><input type="checkbox" data-compare="${car.id}" ${read('dn_compare',[]).includes(car.id)?'checked':''}>${t('addCompare')} (2 max)</label><a class="btn btn-sm" href="compare.html">${t('compare')} ${icon('arrow')}</a></div><hr class="divider"><p class="form-note">${t('demoBooking')}</p></div></div>
    <div class="grid grid-2" style="margin-top:35px"><div class="panel"><h3>${t('reviews')}</h3><p class="muted small">${t('reviewSub')}</p><div id="reviewsList"></div></div><div class="panel"><h3>${t('leaveReview')}</h3>${account()?`<form id="reviewForm" novalidate><div class="field"><label>${t('yourRating')}</label><div id="reviewStars" class="star-options" role="group" aria-label="${t('yourRating')}">${[1,2,3,4,5].map(n=>`<button type="button" class="star-option" data-star="${n}" aria-label="${n} ${t('rating')}" aria-pressed="false">★</button>`).join('')}</div></div>${textarea('reviewText',t('yourReview'),t('reviewText'))}<button class="btn btn-gold" type="submit" style="margin-top:14px">${t('publish')}</button>${status('reviewStatus')}</form>`:`<p class="muted">${t('reviewLogin')}</p><a class="btn btn-gold" href="${linkToLogin('car-details.html?id='+encodeURIComponent(car.id))}">${t('login')}</a>`}</div></div></div></section>`;
    bindCars();renderReviews(car.id);
    let selectedRating=0;
    $$('[data-star]').forEach(b=>b.addEventListener('click',()=>{selectedRating=Number(b.dataset.star);$$('[data-star]').forEach(e=>{e.classList.toggle('selected',Number(e.dataset.star)<=selectedRating);e.setAttribute('aria-pressed',String(Number(e.dataset.star)===selectedRating))})}));
    $('#reviewForm')?.addEventListener('submit',e=>{e.preventDefault();const value=$('#reviewText').value.trim();if(selectedRating<1||value.length<10){statusMsg('reviewStatus',t('invalidReview'),'error');return}const reviews=reviewList();reviews.unshift({id:Date.now().toString(36),car:car.id,email:session(),name:account().name,rating:selectedRating,text:value,date:todayLocal()});save('dn_reviews',reviews);$('#reviewText').value='';selectedRating=0;$$('[data-star]').forEach(e=>e.classList.remove('selected'));renderReviews(car.id);statusMsg('reviewStatus',t('reviewSaved'),'success')});
  }
  function renderReviews(carId){const list=reviewList().filter(r=>r.car===carId);$('#reviewsList').innerHTML=list.length?list.map(r=>`<div class="review"><div class="split"><strong>${esc(r.name)}</strong><span class="small muted">${esc(r.date)}</span></div><div class="review-stars">${'★'.repeat(Math.min(5,Math.max(1,Number(r.rating))))}</div><p style="white-space:pre-wrap">${esc(r.text)}</p></div>`).join(''):`<p class="muted">${t('noReviews')}</p>`}
  function validation(id,check){const input=$('#'+id);if(!input)return true;const message=check(input.value.trim());const err=$('#'+id+'-error');if(err)err.textContent=message||'';input.classList.toggle('is-invalid',!!message);input.setAttribute('aria-invalid',String(!!message));return !message}
  const checkName=v=>!v?t('fieldRequired'):(v.match(/\p{L}/gu)||[]).length<2?t('invalidName'):'';
  const checkEmail=v=>!v?t('fieldRequired'):!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?t('invalidEmail'):'';
  const checkPass=v=>!v?t('fieldRequired'):!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])^.{8,}$/.test(v)?t('invalidPass'):'';
  const checkPhone=v=>!v?t('fieldRequired'):/^(?:\+?7|8)?[\s()-]*(?:\d[\s()-]*){10}$/.test(v)?'':t('invalidPhone');
  const statusMsg=(id,msg,kind='')=>{const el=$('#'+id);if(el){el.textContent=msg;el.className='status '+kind;}};
  const cleanErrors=(form)=>$$('input,select,textarea',form).forEach(el=>el.addEventListener('input',()=>{const error=$('#'+el.id+'-error');if(error)error.textContent='';el.classList.remove('is-invalid')}));
  function afterLogin(next){
    const pending=readText('dn_pending_fav');if(pending&&carById(pending)){const id=scopedKey('favorites');const favorites=favIds();if(!favorites.includes(pending))save(id,[...favorites,pending]);writeText('dn_pending_fav','');}
    location.href=safeNext(next)||'profile.html';
  }
  function auth(){
    const next=safeNext(params.get('next')||'');
    $('#app').innerHTML=`<section class="auth-card"><p class="section-label">DriveNow / Account</p><div class="auth-tabs"><button id="tabLogin" type="button" data-auth-tab="login">${t('login')}</button><button id="tabSignup" type="button" data-auth-tab="signup">${t('signup')}</button></div>
    <div id="loginPanel"><h1>${t('welcome')}</h1><p class="muted">${t('authSub')}</p><form id="loginForm" class="auth-form" novalidate>${field('loginEmail',t('email'),'text','you@example.com')}${field('loginPassword',t('password'),'password') }<button class="btn btn-gold btn-block" type="submit">${t('login')} ${icon('arrow')}</button>${status('loginStatus')}</form></div>
    <div id="signupPanel" hidden><h1>${t('create')}</h1><p class="muted">${t('authSub')}</p><form id="signupForm" class="auth-form" novalidate>${field('signupName',t('fullName'),'text')}${field('signupEmail',t('email'),'text','you@example.com')}${field('signupPassword',t('password'),'password')}${field('signupConfirm',t('confirmPassword'),'password')}<p class="muted small">${t('passwordTip')}</p><button class="btn btn-gold btn-block" type="submit">${t('signup')} ${icon('arrow')}</button>${status('signupStatus')}</form></div>
    <div class="form-note" style="margin-top:24px">${t('authDemo')}</div></section>`;
    const setTab=mode=>{const signup=mode==='signup';$('#signupPanel').hidden=!signup;$('#loginPanel').hidden=signup;$('#tabLogin').classList.toggle('active',!signup);$('#tabSignup').classList.toggle('active',signup);};
    $$('[data-auth-tab]').forEach(e=>e.addEventListener('click',()=>setTab(e.dataset.authTab)));
    setTab(params.get('mode')==='signup'?'signup':'login');
    cleanErrors($('#loginForm'));cleanErrors($('#signupForm'));
    $('#loginForm').addEventListener('submit',e=>{e.preventDefault();const ok=[validation('loginEmail',checkEmail),validation('loginPassword',v=>v?'':t('fieldRequired'))].every(Boolean);if(!ok)return;const email=$('#loginEmail').value.trim().toLowerCase(),pass=$('#loginPassword').value;const user=read('dn_users',[]).find(u=>u.email===email&&u.password===pass);if(!user){statusMsg('loginStatus',t('loginFailed'),'error');return}writeText('dn_session',email);afterLogin(next)});
    $('#signupForm').addEventListener('submit',e=>{e.preventDefault();const ok=[validation('signupName',checkName),validation('signupEmail',checkEmail),validation('signupPassword',checkPass),validation('signupConfirm',v=>!v?t('fieldRequired'):v!==$('#signupPassword').value?t('passMismatch'):'')].every(Boolean);if(!ok)return;const name=$('#signupName').value.trim(),email=$('#signupEmail').value.trim().toLowerCase(),password=$('#signupPassword').value;const users=read('dn_users',[]);if(users.some(u=>u.email===email)){statusMsg('signupStatus',t('emailExists'),'error');return}users.push({name,email,password,created:todayLocal()});save('dn_users',users);writeText('dn_session',email);afterLogin(next)});
  }
  function requireAuth(next){if(account())return true;location.replace(linkToLogin(next));return false}
  function profile(){if(!requireAuth('profile.html'))return;renderProfile()}
  function renderProfile(){const user=account();if(!user)return;const favCars=favIds().map(carById).filter(Boolean);
    $('#app').innerHTML=`${pageTop('DRIVENOW / ACCOUNT',t('welcomeProfile'),t('profileSub'))}<section class="section" style="padding-top:12px"><div class="container"><div class="grid grid-2"><div class="panel"><div class="split"><h3>${t('accountDetails')}</h3><span class="icon-box">${icon('user')}</span></div>${[[t('fullName'),user.name],[t('email'),user.email],[t('memberSince'),user.created]].map(([label,value])=>`<div class="summary-row"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}<p class="form-note" style="margin-top:20px">${t('privacy')}</p></div><div class="panel"><h3>${t('bookings')}</h3><p class="muted">${bookingList().filter(b=>b.email===user.email).length} ${t('bookings').toLowerCase()}</p><div class="stack"><a class="btn btn-gold" href="my-bookings.html">${t('bookings')} ${icon('arrow')}</a><a class="btn btn-outline" href="settings.html">${t('settings')}</a><button id="profileLogout" class="btn">${t('logout')}</button></div></div></div><div id="favorites" style="margin-top:35px;scroll-margin-top:95px"><div class="heading-row"><div><p class="section-label">DRIVENOW / SAVED</p><h2>${t('saved')}</h2></div><a class="btn btn-outline" href="cars.html">${t('allCars')}</a></div>${favCars.length?`<div class="car-grid">${favCars.map(carCard).join('')}</div>`:`<div class="empty">${t('emptySaved')} <br><br><a class="btn btn-gold" href="cars.html">${t('browseCars')}</a></div>`}</div></div></section>`;
    $('#profileLogout').addEventListener('click',()=>{writeText('dn_session','');location.href='index.html'});bindCars();imgFallbacks();
  }
  function bookings(){if(!requireAuth('my-bookings.html'))return;renderBookings()}
  function renderBookings(){const items=bookingList().filter(b=>b.email===session()).reverse();$('#app').innerHTML=`${pageTop('DRIVENOW / RESERVATIONS',t('bookingHistory'),t('bookingHistorySub'))}<section class="section" style="padding-top:13px"><div class="container"><div class="stack">${items.length?items.map(b=>{const car=carById(b.car)||CARS[0];return `<article class="booking-item">${imgTag(car)}<div><div class="split wrap"><h3 style="margin:0">${esc(car.name)}</h3><span class="badge ${b.status==='cancelled'?'cancelled':''}">${t(b.status==='cancelled'?'cancelled':'pending')}</span></div><p class="muted small" style="margin:5px 0">${esc(b.pickup)} → ${esc(b.return)} · ${esc(b.city)} · ${esc(b.phone)}</p>${price(b.total)}</div><div class="booking-actions">${b.status==='cancelled'?`<span class="muted small">${t('cancelled')}</span>`:`<button class="btn btn-outline btn-sm" data-cancel="${esc(b.id)}">${t('cancel')}</button>`}</div></article>`}).join(''):`<div class="empty"><p>${t('noBookings')}</p><a class="btn btn-gold" href="cars.html">${t('browseCars')}</a></div>`}</div></div></section>`;
    $$('[data-cancel]').forEach(btn=>btn.addEventListener('click',()=>{if(!confirm(t('cancelConfirm')))return;const list=bookingList();const current=list.find(x=>x.id===btn.dataset.cancel&&x.email===session());if(current){current.status='cancelled';save('dn_bookings',list);renderBookings();toast(t('bookingCancelled'))}}));imgFallbacks();
  }
  function compare(){renderCompare()}
  function renderCompare(){const list=read('dn_compare',[]).map(carById).filter(Boolean).slice(0,2);$('#app').innerHTML=`${pageTop('DRIVENOW / COMPARE',t('compareTitle'),t('compareSub'))}<section class="section" style="padding-top:12px"><div class="container">${list.length?`<div class="panel compare-scroll"><table class="compare-table"><tbody><tr><th>${t('model')}</th>${list.map(c=>`<td>${imgTag(c)}<h3 style="margin:12px 0">${esc(c.name)}</h3><button class="btn btn-sm" data-remove-compare="${c.id}">${icon('close')}${t('remove')}</button></td>`).join('')}</tr>${[[t('dailyRate'),'price'],[t('brand'),'brand'],[t('category'),'category'],[t('transmission'),'transmission'],[t('fuel'),'fuel'],[t('passengers'),'seats'],[t('rating'),'rating']].map(([label,key])=>`<tr><th>${esc(label)}</th>${list.map(c=>`<td>${key==='price'?price(c.price):esc(key==='seats'?c.seats+' '+t('seats'):key==='fuel'?t(c.fuel.toLowerCase()):key==='transmission'?t('automatic'):key==='rating'?'★ '+displayRating(c):c[key])}</td>`).join('')}</tr>`).join('')}<tr><th>${t('booking')}</th>${list.map(c=>`<td><a href="${bookLink(c.id)}" class="btn btn-gold btn-sm">${t('bookNow')}</a></td>`).join('')}</tr></tbody></table></div>`:`<div class="empty"><p>${t('noCompare')}</p><a class="btn btn-gold" href="cars.html">${t('browseCars')}</a></div>`}<p style="margin-top:20px"><a class="btn btn-outline" href="cars.html">${t('allCars')} ${icon('arrow')}</a></p></div></section>`;
    $$('[data-remove-compare]').forEach(b=>b.addEventListener('click',()=>{save('dn_compare',read('dn_compare',[]).filter(id=>id!==b.dataset.removeCompare));renderCompare()}));imgFallbacks();
  }
  function booking(){if(!requireAuth('booking.html'+(params.get('car')?'?car='+encodeURIComponent(params.get('car')):'')))return;
    const user=account();const preCar=carById(params.get('car'))||CARS[0];const options=CARS.map(c=>({value:c.id,label:`${c.name} — ${money(c.price)} KZT`}));
    $('#app').innerHTML=`${pageTop('DRIVENOW / CHECKOUT',t('bookingTitle'),t('bookingSub'))}<section class="section" style="padding-top:12px"><div class="container form-layout"><div class="panel"><form id="bookingForm" novalidate class="stack"><h3>${t('contactDetails')}</h3><div class="form-grid">${field('bookingName',t('fullName'),'text','',user.name)}${field('bookingEmail',t('email'),'text','',user.email)}${field('bookingPhone',t('phone'),'tel','+7 700 123 45 67')}${select('bookingCar',t('chooseCar'),options)}${field('bookingPickup',t('pickup'),'date')}${field('bookingReturn',t('return'),'date')}${select('bookingCity',t('pickupCity'),[{value:'Astana',label:'Astana / Астана'},{value:'Almaty',label:'Almaty / Алматы'},{value:'Shymkent',label:'Shymkent / Шымкент'}])}<div class="field"><label for="bookingSpot">${t('pickupSpot')}</label><input id="bookingSpot" type="text" placeholder="Astana, Kazakhstan" aria-describedby="bookingSpot-error"><span class="field-error" id="bookingSpot-error" aria-live="polite"></span></div><div class="full">${textarea('bookingNotes',t('notes'),'')}</div></div><button class="btn btn-gold btn-block" type="submit">${t('submitBooking')} ${icon('arrow')}</button>${status('bookingStatus')}<p class="form-note">${t('demoBooking')}</p></form></div><aside class="stack"><div class="panel"><h3>${t('summary')}</h3><div id="selectedCarPreview"></div><div class="summary-row"><span>${t('dailyRate')}</span><strong id="rateValue"></strong></div><div class="summary-row"><span>${t('days')}</span><strong id="rentalDays">—</strong></div><div class="summary-row"><span>${t('total')}</span><strong id="totalValue"></strong></div></div><div class="panel"><div class="split"><h3 style="margin:0">${t('pickupSpot')}</h3>${icon('pin')}</div><p class="muted small" style="margin-top:10px">${t('mapPrompt')}</p><div class="split wrap" style="margin-bottom:12px"><button class="btn btn-outline btn-sm" type="button" id="findMap">${icon('search')}${t('findMap')}</button><span id="mapStatus" class="muted small" role="status" aria-live="polite"></span></div><div id="map"><div class="map-placeholder">${icon('pin','icon-lg')} ${t('mapPrompt')}</div></div><p class="map-attribution"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">${t('mapCredit')}</a> · <a href="https://operations.osmfoundation.org/policies/nominatim/" target="_blank" rel="noopener noreferrer">Nominatim</a></p></div></aside></div></section>`;
    $('#bookingCar').value=preCar.id;cleanErrors($('#bookingForm'));const picker=$('#bookingCar');
    function summary(){const car=carById(picker.value)||preCar;const a=$('#bookingPickup').value,b=$('#bookingReturn').value;const days=a&&b?Math.max(0,Math.round((Date.parse(b+'T12:00:00')-Date.parse(a+'T12:00:00'))/86400000)):0;
      $('#selectedCarPreview').innerHTML=`<div class="split" style="gap:12px;margin:15px 0"><div>${imgTag(car,'') /* custom thumbnail sized via inline */}</div><strong>${esc(car.name)}</strong></div>`;
      const pic=$('#selectedCarPreview img');if(pic){pic.style.cssText='width:110px;height:76px;object-fit:cover;border-radius:9px';pic.addEventListener('error',()=>{pic.src=car.fallback})}
      $('#rateValue').textContent=money(car.price)+' KZT';$('#rentalDays').textContent=days||'—';$('#totalValue').textContent=money(days*car.price)+' KZT';return {car,days,total:days*car.price};
    }
    ['bookingCar','bookingPickup','bookingReturn'].forEach(id=>$('#'+id).addEventListener('change',summary));summary();
    $('#bookingForm').addEventListener('submit',e=>{
      e.preventDefault();const name=validation('bookingName',checkName),email=validation('bookingEmail',checkEmail),phone=validation('bookingPhone',checkPhone),carOk=validation('bookingCar',v=>carById(v)?'':t('fieldRequired'));
      const a=$('#bookingPickup').value,b=$('#bookingReturn').value;
      const aOk=validation('bookingPickup',v=>!v?t('fieldRequired'):v<todayLocal()?t('invalidDate'):'');
      const bOk=validation('bookingReturn',v=>!v?t('fieldRequired'):v<=a?t('invalidOrder'):'');
      if(!(name&&email&&phone&&carOk&&aOk&&bOk)) {statusMsg('bookingStatus',t('fieldRequired'),'error');return;}
      const amount=summary();const list=bookingList();list.push({id:'DN-'+Date.now().toString(36).toUpperCase(),email:session(),name:$('#bookingName').value.trim(),contactEmail:$('#bookingEmail').value.trim(),phone:$('#bookingPhone').value.trim(),car:amount.car.id,pickup:a,return:b,city:$('#bookingCity').value,spot:$('#bookingSpot').value.trim(),notes:$('#bookingNotes').value.trim(),total:amount.total,status:'pending',created:todayLocal()});save('dn_bookings',list);location.href='my-bookings.html';
    });
    initMap();
  }
  function initMap(){
    let map=null,marker=null,lastRequest=0;const el=$('#map');
    if(typeof window.L!=='undefined'){
      try {map=L.map('map',{scrollWheelZoom:false}).setView([51.1694,71.4491],10);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);}
      catch(e){console.warn('Map unavailable',e)}
    } else {el.innerHTML=`<div class="map-placeholder">${t('mapFail')}</div>`;}
    const find=$('#findMap'),msg=$('#mapStatus');
    find.addEventListener('click',async()=>{
      const address=$('#bookingSpot').value.trim(),city=$('#bookingCity').value;
      if(!address){msg.textContent=t('fieldRequired');$('#bookingSpot').focus();return}
      // Public Nominatim policy: one explicit, non-autocomplete search at a time.
      if(Date.now()-lastRequest<1200)return;lastRequest=Date.now();find.disabled=true;msg.textContent=t('mapLoad');
      const search=address+', '+city+', Kazakhstan';
      const cache=read('dn_geocache',{});
      try {
        let results=cache[search];
        if(!results){const url='https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(search);
          const response=await fetch(url,{headers:{'Accept':'application/json'}});
          if(!response.ok)throw new Error('HTTP '+response.status);
          results=await response.json();cache[search]=results;
          save('dn_geocache',Object.fromEntries(Object.entries(cache).slice(-12)));
        }
        if(!results.length){msg.textContent=t('mapNotFound');return;}
        const lat=Number(results[0].lat),lon=Number(results[0].lon);
        if(!Number.isFinite(lat)||!Number.isFinite(lon))throw new Error('Invalid location');
        if(map){map.setView([lat,lon],14);if(marker)map.removeLayer(marker);marker=L.marker([lat,lon]).addTo(map).bindPopup(esc(results[0].display_name||address)).openPopup();}
        else el.innerHTML=`<div class="map-placeholder"><a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}" rel="noopener noreferrer" target="_blank">${t('mapOk')} ${t('findMap')} ↗</a></div>`;
        msg.textContent=t('mapOk');
      } catch(err){msg.textContent=t('mapFail');if(!map)el.innerHTML=`<div class="map-placeholder">${t('mapFail')}</div>`;console.warn('Geocoding:',err.message)}
      finally{find.disabled=false}
    });
  }
  function settings(){
    $('#app').innerHTML=`${pageTop('DRIVENOW / PERSONALIZE',t('settingsTitle'),t('settingsSub'))}<section class="section" style="padding-top:10px"><div class="container narrow stack"><div class="panel"><h3>${icon('globe')} ${t('language')}</h3>${select('settingsLanguage',t('language'),[{value:'en',label:'English'},{value:'kk',label:'Қазақша'},{value:'ru',label:'Русский'}])}</div><div class="panel"><h3>${icon('sun')} ${t('appearance')}</h3><div class="grid grid-2"><button class="btn btn-outline" data-theme-choice="dark">${icon('moon')}${t('dark')}</button><button class="btn btn-outline" data-theme-choice="light">${icon('sun')}${t('light')}</button></div></div><div class="panel"><h3>${icon('settings')} ${t('storage')}</h3><p class="muted">${t('privacy')}</p><div class="split wrap"><button class="btn" id="clearSavedFilters">${t('clearFilters')}</button><button class="btn btn-outline" id="resetLocalData">${t('resetDemo')}</button></div><p class="muted small" style="margin-top:16px">${t('resetDemoWarn')}</p></div></div></section>`;
    $('#settingsLanguage').value=language;$('#settingsLanguage').addEventListener('change',e=>updateLanguage(e.target.value));
    $$('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{document.documentElement.dataset.theme=b.dataset.themeChoice;writeText('dn_theme',b.dataset.themeChoice);renderHeader();toast(t('appearance'))}));
    $('#clearSavedFilters').addEventListener('click',()=>{try{localStorage.removeItem('dn_filters')}catch{}toast(t('clearFiltersDone'))});
    $('#resetLocalData').addEventListener('click',()=>{if(!confirm(t('resetDemoConfirm')))return;try{Object.keys(localStorage).filter(k=>k.startsWith('dn_')).forEach(k=>localStorage.removeItem(k))}catch{}location.href='index.html'});
  }
  function about(){
    $('#app').innerHTML=`${pageTop('DRIVENOW / OUR STORY',t('aboutTitle'),t('aboutSub'))}<section class="section" style="padding-top:10px"><div class="container"><div class="details-layout"><div class="panel"><p class="section-label">DRIVENOW / SE-2501</p><h2>${t('projectInfo')}</h2><p class="muted">${t('projectDesc')}</p><img src="images/luxury_car.jpg" alt="Premium car" style="border-radius:12px;max-height:280px;width:100%;object-fit:cover"></div><div class="panel"><p class="section-label">DRIVENOW TEAM</p><h2>${t('team')}</h2><div class="stack"><div class="split"><strong>Amangeldi Sherkhan</strong><span class="badge">SE-2501</span></div><div class="split"><strong>Bekzat Abilkhaev</strong><span class="badge">SE-2501</span></div></div><hr class="divider"><p class="muted">${t('whySub')}</p></div></div><div class="panel narrow" id="contact" style="margin:35px auto 0;scroll-margin-top:90px"><p class="section-label">DRIVENOW / CONTACT</p><h2>${t('contactUs')}</h2><form id="contactForm" class="stack" novalidate><div class="grid grid-2">${field('contactName',t('fullName'),'text')}${field('contactEmail',t('email'),'text','you@example.com')}</div>${textarea('contactMessage',t('message'))}<button class="btn btn-gold" type="submit">${t('send')} ${icon('arrow')}</button>${status('contactStatus')}</form></div></div></section>`;
    cleanErrors($('#contactForm'));
    $('#contactForm').addEventListener('submit',e=>{e.preventDefault();const ok=[validation('contactName',checkName),validation('contactEmail',checkEmail),validation('contactMessage',v=>!v?t('fieldRequired'):v.length<10?t('invalidReview'):'')].every(Boolean);if(!ok){statusMsg('contactStatus',t('fieldRequired'),'error');return}statusMsg('contactStatus',t('contactSuccess'),'success');e.target.reset()});
  }
  // Entry point: independent HTML URLs work on GitHub Pages (no server-side routing).
  document.documentElement.lang=language==='kk'?'kk':language;
  renderHeader();renderFooter();
  ({index:home,cars:catalog,'car-details':details,booking,login:auth,profile,'my-bookings':bookings,compare,settings,about}[page]||home)();
  imgFallbacks();
})();
