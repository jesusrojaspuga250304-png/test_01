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
const storeKey = 'aplivanta.selection.v1';
let selection = [];
try { const saved = JSON.parse(localStorage.getItem(storeKey) || '[]'); if(Array.isArray(saved)) selection = [...new Set(saved.filter(id => ids.has(id)))]; } catch { /* Private browsing or invalid stored data. */ }
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
  const term = normalize($('#search').value.trim());
  const category = $('#category').value;
  const list = products.filter(p => (audience === 'all' || p.audience.includes(audience)) && (category === 'all' || p.category === category) && normalize(`${p.name} ${p.category} ${p.description} ${p.platform}`).includes(term));
  if($('#sort').value === 'name') list.sort((a,b) => a.name.localeCompare(b.name,'es'));
  $('#products').innerHTML = list.map(p => `<article class="product"><div class="product-art ${p.color}" aria-hidden="true"><div class="app-symbol">${p.symbol}</div><span class="art-caption">${p.art}</span></div><div class="product-info"><div class="product-meta"><span>${p.category}</span><span>${p.audience.length === 2 ? 'Personal y empresas' : p.audience[0] === 'business' ? 'Para empresas' : 'Para ti'}</span></div><h3>${p.name}</h3><p>${p.description}</p><div class="product-spec"><span>${p.platform}</span><span>${p.license}</span></div><div class="product-action"><small>Precio por definir</small><button class="details-button" data-detail="${p.id}" aria-label="Ver detalles de ${p.name}">Ver solución ↗</button></div><label class="compare-check"><input type="checkbox" data-compare="${p.id}" ${compared.has(p.id) ? 'checked' : ''}>Comparar<span class="sr-label"> ${p.name}</span></label></div></article>`).join('');
  $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'solución' : 'soluciones'}`;
  $('#empty').hidden = list.length > 0;
}
function renderCompareBar(){ $('#compare-bar').hidden = compared.size === 0; $('#compare-count').textContent = compared.size; $('#compare-open').disabled = compared.size < 2; }
function resetFilters(){ audience = 'all'; $('#search').value = ''; $('#category').value = 'all'; $('#sort').value = 'featured'; updateAudience(); renderProducts(); }
function updateAudience(){ document.querySelectorAll('[data-audience]').forEach(b => { const selected = b.dataset.audience === audience; b.classList.toggle('active', selected); b.setAttribute('aria-pressed', String(selected)); }); }
$('#search').addEventListener('input',renderProducts);
$('#category').addEventListener('change',renderProducts);
$('#sort').addEventListener('change',renderProducts);
$('#reset').addEventListener('click',resetFilters);
document.querySelectorAll('[data-audience]').forEach(b => b.addEventListener('click', () => {audience = b.dataset.audience; updateAudience(); renderProducts();}));
document.querySelectorAll('[data-category]').forEach(b => b.addEventListener('click', () => {resetFilters(); $('#category').value = b.dataset.category; renderProducts(); $('#catalogo').scrollIntoView();}));
$('#products').addEventListener('click', event => {const b = event.target.closest('[data-detail]'); if(b) showDetail(b.dataset.detail);});
$('#products').addEventListener('change', event => {
  const id = event.target.dataset.compare; if(!id) return;
  if(event.target.checked && compared.size >= 3){event.target.checked = false; toast('Puedes comparar hasta 3 soluciones a la vez.'); return;}
  event.target.checked ? compared.add(id) : compared.delete(id); renderCompareBar();
});
$('#compare-clear').addEventListener('click', () => {compared.clear(); renderProducts(); renderCompareBar();});
$('#compare-open').addEventListener('click', () => {
  const list = products.filter(p => compared.has(p.id));
  const rows = [['Categoría','category'],['Plataforma ilustrativa','platform'],['Licencia ilustrativa','license'],['Usuarios','users']];
  openModal(`<h2 id="modal-title">Encuentra tu mejor opción.</h2><p>Comparación de ejemplos conceptuales, no de productos comerciales.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Tabla comparativa desplazable"><table><thead><tr><th scope="col">Característica</th>${list.map(p=>`<th scope="col">${p.name}</th>`).join('')}</tr></thead><tbody>${rows.map(([title,key])=>`<tr><th scope="row">${title}</th>${list.map(p=>`<td>${p[key]}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">Precio</th>${list.map(()=>'<td>Por definir</td>').join('')}</tr></tbody></table></div>`);
});

function showDetail(id){
  const p = products.find(p => p.id === id); if(!p) return;
  openModal(`<h2 id="modal-title">${p.name}</h2><p>${p.description}</p><div class="detail-specs"><div><strong>PLATAFORMA</strong>${p.platform}</div><div><strong>MODALIDAD</strong>${p.license}</div><div><strong>USUARIOS</strong>${p.users}</div><div><strong>PRECIO</strong>Por definir</div></div><h3>Funciones ilustrativas</h3><ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul><p class="form-disclaimer">Ejemplo de catálogo. Funciones, compatibilidad y licencia pendientes de sustituir por información comercial verificada.</p><div class="modal-actions"><button class="button dark" id="add-selection">${selection.includes(id) ? 'Ya está en tu selección ✓' : 'Añadir a mi selección +'}</button><button class="button outline" id="view-selection">Ver mi selección</button></div>`);
  $('#add-selection').disabled = selection.includes(id);
  $('#add-selection').addEventListener('click', () => {if(!selection.includes(id)){selection.push(id);saveSelection();toast('Solución añadida a tu selección.');} $('#add-selection').textContent = 'Añadida a tu selección ✓'; $('#add-selection').disabled = true;});
  $('#view-selection').addEventListener('click', showSelection);
}
function showSelection(){
  const list = selection.map(id => products.find(p => p.id === id));
  openModal(`<h2 id="modal-title">Tu selección de software.</h2><p>${list.length ? 'Reúne tus opciones y prepara una consulta. Esto no es un carrito de pago.' : 'Todavía no has elegido herramientas. Abre una ficha y añádela a tu selección.'}</p>${list.map(p=>`<div class="selection-row"><div>${p.name}<small>${p.category} · Precio por definir</small></div><button data-remove="${p.id}" aria-label="Quitar ${p.name}">Quitar</button></div>`).join('')}<div class="modal-actions">${list.length ? '<button class="button dark" id="prepare-selection">Preparar consulta →</button>' : ''}<button class="button outline" id="continue">Seguir explorando</button></div>`);
  document.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {selection = selection.filter(id => id !== b.dataset.remove); saveSelection(); showSelection();}));
  $('#continue').addEventListener('click', () => {modal.close(); $('#catalogo').scrollIntoView();});
  $('#prepare-selection')?.addEventListener('click', () => showInquiry(false));
}
$('#selection-open').addEventListener('click',showSelection);
$('#business-quote').addEventListener('click',() => showInquiry(true));
function showInquiry(business){
  openModal(`<h2 id="modal-title">Prepara tu consulta.</h2><p>Genera un resumen para compartir cuando se configure el canal comercial.</p><form id="inquiry"><div class="form-row"><label class="field">Tipo de cliente<select name="type"><option${business ? '' : ' selected'}>Particular</option><option${business ? ' selected' : ''}>Empresa</option></select></label><label class="field">Número de usuarios<input name="users" type="number" min="1" max="10000" step="1" value="1" required></label></div><label class="field">¿Qué necesitas resolver?<textarea name="needs" maxlength="2000" required placeholder="Por ejemplo: organizar proyectos de un equipo de 5 personas."></textarea></label><p class="form-disclaimer">No ingreses información sensible. Este formulario no envía datos: el resumen se genera en tu dispositivo y no crea una compra.</p><button type="submit" class="button dark">Generar resumen →</button></form>`);
  $('#inquiry').addEventListener('submit', event => {
    event.preventDefault(); const form = new FormData(event.target);
    const summary = `CONSULTA DE SOFTWARE — APLIVANTA\nDemostración · No enviada · No constituye un pedido\n\nTipo: ${form.get('type')}\nUsuarios: ${form.get('users')}\n\nSoluciones seleccionadas:\n${selection.length ? selection.map(id => '• ' + products.find(p=>p.id===id).name).join('\n') : 'Por definir'}\n\nNecesidad:\n${form.get('needs')}\n\nPrecios, licencias y disponibilidad: pendientes de confirmar.`;
    openModal(`<h2 id="modal-title">Tu resumen está listo.</h2><p>No se ha enviado. Puedes descargarlo y compartirlo por el canal que prefieras.</p><pre class="summary-text">${esc(summary)}</pre><button id="download-summary" class="button dark">Descargar resumen .txt ↓</button>`);
    $('#download-summary').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([summary],{type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href=url; a.download='consulta-aplivanta.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); });
  });
}
$('#privacy-open').addEventListener('click', () => openModal('<h2 id="modal-title">Privacidad de esta demo.</h2><p>La aplicación no incorpora analítica, pagos ni formularios conectados a un servidor. Tu selección se guarda en el almacenamiento local de este navegador y se puede quitar desde «Mi selección». El proveedor que aloje la web puede registrar solicitudes técnicas.</p><p>El texto de las consultas solo se usa para generar una descarga local. No se guarda tras cerrar la consulta. Antes de una venta real deben configurarse los canales comerciales y las condiciones de privacidad aplicables.</p>'));
$('#menu-toggle').addEventListener('click', () => {const open = $('#navigation').classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded',String(open)); $('#menu-toggle').setAttribute('aria-label',open ? 'Cerrar menú' : 'Abrir menú');});
$('#navigation').addEventListener('click', event => {if(event.target.closest('a')){$('#navigation').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded','false'); $('#menu-toggle').setAttribute('aria-label','Abrir menú');}});
$('#year').textContent = new Date().getFullYear();
saveSelection(); renderProducts(); renderCompareBar();
