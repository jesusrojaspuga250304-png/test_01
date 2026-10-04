'use strict';

// Example catalog only. Replace with validated commercial products before launch.
const products = [
  {id:'creative',name:'Suite creativa',category:'Diseño',audience:['personal','business'],symbol:'✳',color:'lavender',art:'DALE FORMA A TUS IDEAS',description:'Un espacio para diseñar, editar imágenes y dar vida a tus proyectos visuales.',platform:'Windows / macOS',license:'Suscripción',users:'Individual o equipo',features:['Edición y composición visual','Recursos para proyectos creativos','Opciones para trabajo en equipo']},
  {id:'office',name:'Suite de productividad',category:'Productividad',audience:['personal','business'],symbol:'▤',color:'peach',art:'TODO LISTO PARA AVANZAR',description:'Documentos, hojas de cálculo y presentaciones para trabajar con más orden.',platform:'Web / escritorio',license:'Suscripción',users:'Individual o equipo',features:['Documentos y presentaciones','Organización de archivos','Colaboración en proyectos']},
  {id:'security',name:'Protección digital',category:'Seguridad',audience:['personal','business'],symbol:'◇',color:'lime',art:'CUIDA TU MUNDO DIGITAL',description:'Explora herramientas para proteger tus dispositivos y tu información.',platform:'Multiplataforma',license:'Anual',users:'Por dispositivo',features:['Seguridad de dispositivos','Opciones de navegación segura','Administración de protección']},
  {id:'business',name:'Gestión de negocio',category:'Gestión',audience:['business'],symbol:'▥',color:'sand',art:'UNA VISIÓN MÁS COMPLETA',description:'Organiza clientes, oportunidades y procesos en un mismo espacio de trabajo.',platform:'Web',license:'Suscripción',users:'Por usuario',features:['Seguimiento comercial','Organización de clientes','Reportes de operación']},
  {id:'dev',name:'Herramientas de desarrollo',category:'Desarrollo',audience:['personal','business'],symbol:'⌘',color:'blue',art:'DE LA IDEA AL CÓDIGO',description:'Un entorno para escribir código, construir soluciones y colaborar en proyectos.',platform:'Windows / macOS / Linux',license:'Por definir',users:'Individual o equipo',features:['Edición de código','Organización de proyectos','Herramientas de colaboración']},
  {id:'personal',name:'Organizador personal',category:'Productividad',audience:['personal'],symbol:'◈',color:'mint',art:'ESPACIO PARA LO IMPORTANTE',description:'Reúne notas, pendientes e ideas para darle estructura a tu día a día.',platform:'Web / móvil',license:'Suscripción',users:'Individual',features:['Notas y listas','Organización de pendientes','Planificación personal']}
];
const $ = selector => document.querySelector(selector);
const ids = new Set(products.map(p => p.id));
const storeKey = 'codalvia.selection.v1';
let selection = [];
try { const saved = JSON.parse(localStorage.getItem(storeKey) || localStorage.getItem('aplivanta.selection.v1') || '[]'); if(Array.isArray(saved)) selection = [...new Set(saved.filter(id => ids.has(id)))]; } catch { /* Private browsing or invalid stored data. */ }
let audience = 'all';
let compared = new Set();
let toastTimer;
const modal = $('#modal');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function toast(message){ $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3500); }
function saveSelection(){ try {localStorage.setItem(storeKey, JSON.stringify(selection));} catch {toast('Selección guardada solo para esta sesión.');} $('#selection-count').textContent = selection.length; }
function openModal(content){ $('#modal-body').innerHTML = content; if(!modal.open) modal.showModal(); modal.scrollTop = 0; $('#modal-close').focus(); }
$('#modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if(event.target === modal){ const r = modal.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close(); } });

function renderProducts(){
  if (!$('#products')) return;
  const term = normalize($('#search').value.trim());
  const category = $('#category').value;
  const list = products.filter(p => (audience === 'all' || p.audience.includes(audience)) && (category === 'all' || p.category === category) && normalize(`${p.name} ${p.category} ${p.description} ${p.platform}`).includes(term));
  if($('#sort').value === 'name') list.sort((a,b) => a.name.localeCompare(b.name,'es'));
  $('#products').innerHTML = list.map(p => `<article class="product"><div class="product-art ${p.color}" aria-hidden="true"><div class="app-symbol">${p.symbol}</div><span class="art-caption">${p.art}</span></div><div class="product-info"><div class="product-meta"><span>${p.category}</span><span>${p.audience.length === 2 ? 'Personal y empresas' : p.audience[0] === 'business' ? 'Para empresas' : 'Para ti'}</span></div><h3>${p.name}</h3><p>${p.description}</p><div class="product-spec"><span>${p.platform}</span><span>${p.license}</span></div><div class="product-action"><small>Precio por definir</small><a class="details-button" href="producto.html?id=${p.id}" data-detail="${p.id}" aria-label="Ver detalles de ${p.name}">Ver solución ↗</a></div><label class="compare-check"><input type="checkbox" data-compare="${p.id}" ${compared.has(p.id) ? 'checked' : ''}>Comparar<span class="sr-label"> ${p.name}</span></label></div></article>`).join('');
  $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'solución' : 'soluciones'}`;
  $('#empty').hidden = list.length > 0;
}
function renderCompareBar(){ if (!$('#compare-bar')) return; $('#compare-bar').hidden = compared.size === 0; $('#compare-count').textContent = compared.size; $('#compare-open').disabled = compared.size < 2; }
function resetFilters(){ audience = 'all'; $('#search').value = ''; $('#category').value = 'all'; $('#sort').value = 'featured'; updateAudience(); renderProducts(); }
function updateAudience(){ document.querySelectorAll('[data-audience]').forEach(b => { const selected = b.dataset.audience === audience; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); }); }
$('#search')?.addEventListener('input',renderProducts);
$('#category')?.addEventListener('change',renderProducts);
$('#sort')?.addEventListener('change',renderProducts);
$('#reset')?.addEventListener('click',resetFilters);
document.querySelectorAll('[data-audience]').forEach(b => b.addEventListener('click', () => {audience = b.dataset.audience; updateAudience(); renderProducts();}));
document.querySelectorAll('[data-category]').forEach(b => b.addEventListener('click', () => {resetFilters(); $('#category').value = b.dataset.category; renderProducts(); $('#catalogo').scrollIntoView();}));
$('#products')?.addEventListener('change', event => {
  const id = event.target.dataset.compare; if(!id) return;
  if(event.target.checked && compared.size >= 3){event.target.checked = false; toast('Puedes comparar hasta 3 soluciones a la vez.'); return;}
  event.target.checked ? compared.add(id) : compared.delete(id); renderCompareBar();
});
$('#compare-clear')?.addEventListener('click', () => {compared.clear(); renderProducts(); renderCompareBar();});
$('#compare-open')?.addEventListener('click', () => {
  const list = products.filter(p => compared.has(p.id));
  const rows = [['Categoría','category'],['Plataforma ilustrativa','platform'],['Licencia ilustrativa','license'],['Usuarios','users']];
  openModal(`<h2 id="modal-title">Encuentra tu mejor opción.</h2><p>Comparación de ejemplos conceptuales, no de productos comerciales.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabla comparativa desplazable"><table><thead><tr><th scope="col">Característica</th>${list.map(p=>`<th scope="col">${p.name}</th>`).join('')}</tr></thead><tbody>${rows.map(([title,key])=>`<tr><th scope="row">${title}</th>${list.map(p=>`<td>${p[key]}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">Precio</th>${list.map(()=>'<td>Por definir</td>').join('')}</tr></tbody></table></div>`);
});

function renderDetail(){
  const host = $('#product-detail'); if(!host) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = products.find(p => p.id === id);
  if(!p){ host.innerHTML='<div class="empty"><h1 class="page-title">No encontramos esa solución.</h1><p>Vuelve al catálogo para explorar las opciones disponibles.</p><a href="catalogo.html" class="button dark">Volver al catálogo →</a></div>'; return; }
  document.title = p.name + ' | Codalvia';
  const contexts = {
    creative:['Diseño, comunicación y proyectos personales','Prepara piezas visuales, organiza recursos y revisa resultados antes de compartirlos.','Formatos de archivo, herramientas de edición y colaboración que necesitas.'],
    office:['Estudio, trabajo individual y colaboración','Crea documentos, organiza datos y prepara presentaciones para tu actividad diaria.','Trabajo sin conexión, formatos existentes y opciones para compartir archivos.'],
    security:['Personas y equipos con varios dispositivos','Identifica qué equipos debes proteger y cómo quieres administrar sus configuraciones.','Sistemas compatibles, número de dispositivos y funciones incluidas en cada plan.'],
    business:['Ventas, atención al cliente y operaciones','Centraliza el seguimiento comercial y define un proceso común para registrar oportunidades.','Importación de datos, permisos de usuario y reportes necesarios para la operación.'],
    dev:['Aprendizaje, proyectos propios y equipos técnicos','Organiza el código y las tareas que forman parte de tu proceso de desarrollo.','Lenguajes, extensiones, repositorios e integración con tus herramientas actuales.'],
    personal:['Organización personal y estudio','Reúne ideas, pendientes y notas para planificar tus próximos pasos.','Acceso desde tus dispositivos, exportación de notas y funcionamiento sin conexión.']
  };
  const c = contexts[p.id];
  host.innerHTML = `<a class="back-link" href="catalogo.html">← Volver al catálogo</a><div class="detail-hero"><div class="detail-visual product-art ${p.color}" aria-hidden="true"><div class="app-symbol">${p.symbol}</div><span class="art-caption">${p.art}</span></div><div><div class="eyebrow">${p.category.toUpperCase()} / SOLUCIÓN CONCEPTUAL</div><h1 class="page-title">${p.name}</h1><p>${p.description}</p><div class="product-spec"><span>${p.platform}</span><span>${p.license}</span></div><div class="modal-actions"><button class="button dark" id="add-selection">Añadir a mi selección +</button><button class="button outline" id="view-selection">Ver mi selección</button></div><p class="detail-disclaimer">Ejemplo genérico · Precio y disponibilidad por definir.</p></div></div><div class="detail-layout"><div><h2>Una herramienta para tu forma de trabajar.</h2><p>${c[1]}</p><h3>Funciones ilustrativas</h3><ul class="feature-list">${p.features.map(f=>`<li><span aria-hidden="true">✓</span>${f}</li>`).join('')}</ul><h3>¿Para quién está pensada?</h3><p>${c[0]}.</p><h3>Qué revisar antes de elegir</h3><p>${c[2]}</p><a class="text-link" href="guia-compatibilidad.html">Revisar la guía de compatibilidad →</a></div><aside class="spec-panel"><div class="eyebrow">FICHA ORIENTATIVA</div><dl><dt>Plataforma</dt><dd>${p.platform}</dd><dt>Modalidad</dt><dd>${p.license}</dd><dt>Usuarios</dt><dd>${p.users}</dd><dt>Precio</dt><dd>Por definir</dd></dl><p>Las especificaciones son ilustrativas. Se confirmarán con el producto comercial definitivo.</p><a class="button dark" href="contacto.html">Preparar consulta ↗</a></aside></div>`;
  updateDetailSelection();
  $('#add-selection').addEventListener('click', () => {if(!selection.includes(id)){selection.push(id);saveSelection();toast('Solución añadida a tu selección.');} updateDetailSelection();});
  $('#view-selection').addEventListener('click',showSelection);
}
function updateDetailSelection(){
  const button = $('#add-selection'); if(!button) return;
  const selected = selection.includes(new URLSearchParams(location.search).get('id'));
  button.disabled = selected; button.textContent = selected ? 'Ya está en tu selección ✓' : 'Añadir a mi selección +';
}
function renderContactSelection(){
  if(!$('#contact-selection')) return;
  $('#contact-selection').innerHTML = '<h3>Tu selección</h3>' + (selection.length ? '<ul>'+selection.map(id=>'<li>'+products.find(p=>p.id===id).name+'</li>').join('')+'</ul>' : '<p>Aún no has seleccionado herramientas. También puedes preparar una consulta sin elegir un producto.</p>');
}
function showSelection(){
  const list = selection.map(id => products.find(p => p.id === id));
  openModal(`<h2 id="modal-title">Tu selección de software.</h2><p>${list.length ? 'Reúne tus opciones y prepara una consulta. Esto no es un carrito de pago.' : 'Todavía no has elegido herramientas. Abre una ficha y añádela a tu selección.'}</p>${list.map(p=>`<div class="selection-row"><div>${p.name}<small>${p.category} · Precio por definir</small></div><button data-remove="${p.id}" aria-label="Quitar ${p.name}">Quitar</button></div>`).join('')}<div class="modal-actions">${list.length ? '<button class="button dark" id="prepare-selection">Preparar consulta →</button>' : ''}<button class="button outline" id="continue">Seguir explorando</button></div>`);
  document.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {selection = selection.filter(id => id !== b.dataset.remove); saveSelection(); updateDetailSelection(); renderContactSelection(); showSelection();}));
  $('#continue').addEventListener('click', () => {modal.close(); location.href='catalogo.html';});
  $('#prepare-selection')?.addEventListener('click', () => showInquiry(false));
}
$('#selection-open').addEventListener('click',showSelection);

function showInquiry(business){ location.href = 'contacto.html' + (business ? '?tipo=empresa' : ''); }
function renderInquiry(){
  const host = $('#inquiry-host'); if(!host) return;
  const business = new URLSearchParams(location.search).get('tipo') === 'empresa';
  host.innerHTML = `<h2>Prepara tu consulta.</h2><p>Genera un resumen para compartir cuando se configure el canal comercial.</p><form id="inquiry"><div class="form-row"><label class="field">Tipo de cliente<select name="type"><option${business ? '' : ' selected'}>Particular</option><option${business ? ' selected' : ''}>Empresa</option></select></label><label class="field">Número de usuarios<input name="users" type="number" min="1" max="10000" step="1" value="1" required></label></div><label class="field">¿Qué necesitas resolver?<textarea name="needs" maxlength="2000" required placeholder="Por ejemplo: organizar proyectos de un equipo de 5 personas."></textarea></label><p class="form-disclaimer">No ingreses información sensible. Este formulario no envía datos: el resumen se genera en tu dispositivo y no crea una compra.</p><button type="submit" class="button dark">Generar resumen →</button></form>`;
  $('#inquiry').addEventListener('submit', event => {
    event.preventDefault(); const form = new FormData(event.target);
    const summary = `CONSULTA DE SOFTWARE — CODALVIA\nDemostración · No enviada · No constituye un pedido\n\nTipo: ${form.get('type')}\nUsuarios: ${form.get('users')}\n\nSoluciones seleccionadas:\n${selection.length ? selection.map(id => '• ' + products.find(p=>p.id===id).name).join('\n') : 'Por definir'}\n\nNecesidad:\n${form.get('needs')}\n\nPrecios, licencias y disponibilidad: pendientes de confirmar.`;
    openModal(`<h2 id="modal-title">Tu resumen está listo.</h2><p>No se ha enviado. Puedes descargarlo y compartirlo por el canal que prefieras.</p><pre class="summary-text">${esc(summary)}</pre><button id="download-summary" class="button dark">Descargar resumen .txt ↓</button>`);
    $('#download-summary').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([summary],{type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href=url; a.download='consulta-codalvia.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); });
  });
}
$('#privacy-open').addEventListener('click', () => openModal('<h2 id="modal-title">Privacidad de esta demo.</h2><p>La aplicación no incorpora analítica, pagos ni formularios conectados a un servidor. Tu selección se guarda en el almacenamiento local de este navegador y se puede quitar desde «Mi selección». El proveedor que aloje la web puede registrar solicitudes técnicas.</p><p>El texto de las consultas solo se usa para generar una descarga local. No se almacena de forma persistente; el formulario permanece visible mientras estés en esta página. Antes de una venta real deben configurarse los canales comerciales y las condiciones de privacidad aplicables.</p>'));
$('#menu-toggle').addEventListener('click', () => {const open = $('#navigation').classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded',String(open)); $('#menu-toggle').setAttribute('aria-label',open ? 'Cerrar menú' : 'Abrir menú');});
$('#navigation').addEventListener('click', event => {if(event.target.closest('a')){$('#navigation').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded','false'); $('#menu-toggle').setAttribute('aria-label','Abrir menú');}});
$('#year').textContent = new Date().getFullYear();
const query = new URLSearchParams(location.search);
if($('#products')){
  const incomingAudience = query.get('publico');
  audience = ['personal','business'].includes(incomingAudience) ? incomingAudience : 'all';
  const category = query.get('categoria');
  if([...$('#category').options].some(o=>o.value===category)) $('#category').value=category;
  $('#search').value = query.get('q') || '';
  updateAudience();
}
saveSelection(); renderProducts(); renderCompareBar(); renderDetail(); renderInquiry(); renderContactSelection();

// Motion is progressive enhancement: content stays visible without JS or observer support.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if(!reducedMotion.matches && 'IntersectionObserver' in window){
  const targets = document.querySelectorAll('.path-card,.info-card,.resource-card,.reading-body section,.split-panel,.detail-layout');
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:0.08});
  targets.forEach((el,index)=>{if(el.getBoundingClientRect().top > innerHeight){el.classList.add('reveal');el.style.setProperty('--reveal-delay', (index%3)*70+'ms');observer.observe(el);}});
  reducedMotion.addEventListener('change',event=>{if(event.matches){targets.forEach(el=>el.classList.add('is-visible'));observer.disconnect();}});
}
window.addEventListener('storage',event=>{
  if(event.key!==storeKey) return;
  try {const value=JSON.parse(event.newValue||'[]');selection=Array.isArray(value)?[...new Set(value.filter(id=>ids.has(id)))]:[];}catch{selection=[];}
  $('#selection-count').textContent=selection.length;updateDetailSelection();renderContactSelection();
  if(modal.open && $('#continue')) showSelection();
});
