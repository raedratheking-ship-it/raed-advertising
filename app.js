(function(){
'use strict';

var LANG = window.RAED_LANG || 'en';
var UI = window.RAED_UI || {};
var DEFAULT_DATA = window.RAED_DATA || {};
var CFG = window.RAED_CONFIG || {};

var $ = function(s,r){ return (r||document).querySelector(s); };
var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var LOGO = "الشعار2.png";

function L(k){ return UI[k] || k; }
function T(o){
  if(!o) return '';
  if(typeof o === 'string') return o;
  var v = o[LANG];
  if(v && String(v).trim()) return v;
  if(LANG === 'ar' && o.en) return o.en;
  if(LANG === 'en' && o.ar) return o.ar;
  return o.en || o.ar || '';
}

function ph(label,h,seed){
  h = h||760; seed = seed||0;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="'+h+'" viewBox="0 0 600 '+h+'"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1f47"/><stop offset="1" stop-color="#04091c"/></linearGradient><linearGradient id="ac" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#00eeea"/><stop offset="1" stop-color="#2b6bff"/></linearGradient></defs><rect width="600" height="'+h+'" fill="url(#bg)"/><circle cx="'+(470-seed*40)+'" cy="'+(150+seed*50)+'" r="195" fill="url(#ac)" opacity="0.17"/><text x="60" y="'+(h-95)+'" font-family="Arial" font-size="27" font-weight="700" fill="#e9f3ff" opacity="0.92">'+label+'</text><text x="60" y="'+(h-62)+'" font-family="Arial" font-size="14" letter-spacing="3" fill="#00eeea" opacity="0.85">RAED ADVERTISING</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g,' '));
}
var HEIGHTS = [760,920,640,840,700,880];
function seedPhotos(data){
  data.groups.forEach(function(g,gi){
    if(g.photos && g.photos.length) return;
    g.photos = [];
    var count = 3 + (gi % 2);
    for(var i = 0; i < count; i++){
      var h = HEIGHTS[(gi+i) % HEIGHTS.length];
      var nm = (g.name && (g.name.en || g.name)) || ('Item '+(i+1));
      g.photos.push(ph(nm, h, (gi+i) % 3));
    }
  });
}

function fillBilingual(target, reference){
  if(!target) return reference ? clone(reference) : {en:'',ar:''};
  if(typeof target === 'string') target = {en:target, ar:target};
  var ref = (!reference) ? {en:'',ar:''} : (typeof reference === 'string' ? {en:reference,ar:reference} : reference);
  if(!target.ar || (target.ar === target.en && ref.ar && ref.ar !== ref.en)){ if(ref.ar) target.ar = ref.ar; }
  if(!target.en && ref.en) target.en = ref.en;
  if(!target.en && !target.ar && (ref.en || ref.ar)){ target.en = ref.en||''; target.ar = ref.ar||''; }
  if(!target.en && target.ar) target.en = target.ar;
  if(!target.ar && target.en) target.ar = target.en;
  return target;
}

function migrate(d, defaults){
  if(!d || !d.hero) return d;
  defaults = defaults || {};
  d.hero = {
    eyebrow: fillBilingual(typeof d.hero.eyebrow === 'string' ? {en:d.hero.eyebrow,ar:''} : d.hero.eyebrow, defaults.hero && defaults.hero.eyebrow),
    title: fillBilingual(typeof d.hero.title === 'string' ? {en:d.hero.title,ar:''} : d.hero.title, defaults.hero && defaults.hero.title),
    sub: fillBilingual(typeof d.hero.sub === 'string' ? {en:d.hero.sub,ar:''} : d.hero.sub, defaults.hero && defaults.hero.sub)
  };
  d.about = {
    title: fillBilingual(typeof d.about.title === 'string' ? {en:d.about.title,ar:''} : d.about.title, defaults.about && defaults.about.title),
    text: fillBilingual(typeof d.about.text === 'string' ? {en:d.about.text,ar:''} : d.about.text, defaults.about && defaults.about.text)
  };
  if(d.services && d.services.length){
    d.services = d.services.map(function(s,i){
      var def = null;
      if(defaults.services){
        var sEn = (typeof s.t === 'string' ? s.t : (s.t && s.t.en) || '').trim().toLowerCase();
        def = defaults.services.find(function(dd){
          var ddEn = (typeof dd.t === 'string' ? dd.t : (dd.t && dd.t.en) || '').trim().toLowerCase();
          return ddEn && ddEn === sEn;
        });
        if(!def) def = defaults.services[i];
      }
      return { icon: s.icon || (def && def.icon) || 'logo', t: fillBilingual(s.t, def && def.t), d: fillBilingual(s.d, def && def.d) };
    });
  }
  if(d.groups && d.groups.length){
    d.groups = d.groups.map(function(g,i){
      var def = null;
      if(defaults.groups){
        var gEn = (typeof g.name === 'string' ? g.name : (g.name && g.name.en) || '').trim().toLowerCase();
        def = defaults.groups.find(function(dd){
          var ddEn = (typeof dd.name === 'string' ? dd.name : (dd.name && dd.name.en) || '').trim().toLowerCase();
          return ddEn && ddEn === gEn;
        });
        if(!def) def = defaults.groups[i];
      }
      return { id: g.id, name: fillBilingual(g.name, def && def.name), photos: g.photos || [] };
    });
  }
  if(d.contact){
    d.contact.msg = fillBilingual(typeof d.contact.msg === 'string' ? {en:d.contact.msg,ar:''} : d.contact.msg, defaults.contact && defaults.contact.msg);
    if(!d.contact.cv) d.contact.cv = '';
    if(!d.contact.cmbot && CFG.cmbot) d.contact.cmbot = CFG.cmbot;
    if(!d.contact.wa && CFG.whatsapp) d.contact.wa = CFG.whatsapp;
    if(!d.contact.email && CFG.email) d.contact.email = CFG.email;
  }
  return d;
}

var DKEY = 'raed.site.v10', AKEY = 'raed.admin.v3', CKEY = 'raed.cloud.v5';

var CLOUD = {
  name:        (CFG.cloudinary && CFG.cloudinary.name)        || '',
  folder:      (CFG.cloudinary && CFG.cloudinary.folder)      || 'raed-advertising',
  imagePreset: (CFG.cloudinary && CFG.cloudinary.imagePreset) || '',
  dataPreset:  (CFG.cloudinary && CFG.cloudinary.dataPreset)  || '',
  apiKey:      (CFG.cloudinary && CFG.cloudinary.apiKey)      || '',
  apiSecret:   (CFG.cloudinary && CFG.cloudinary.apiSecret)   || ''
};

try {
  var scv = JSON.parse(localStorage.getItem(CKEY) || 'null');
  if(scv && scv.name && scv.imagePreset) CLOUD = scv;
} catch(e){}

var S = (function(){
  var st = null;
  try { st = JSON.parse(localStorage.getItem(DKEY) || 'null'); } catch(e){}
  if(!st){
    try {
      var old = JSON.parse(localStorage.getItem('raed.site.v9') || 'null')
        || JSON.parse(localStorage.getItem('raed.site.v8') || 'null')
        || JSON.parse(localStorage.getItem('raed.site.v7') || 'null')
        || JSON.parse(localStorage.getItem('raed.site.v6') || 'null');
      if(old && old.hero) st = old;
    } catch(e){}
  }
  if(st && st.hero && st.groups) return migrate(st, DEFAULT_DATA);
  var inline = clone(DEFAULT_DATA);
  if(!inline || !inline.hero) inline = { hero:{title:{en:'RAED Advertising',ar:'رائد للإعلان'},sub:{en:'',ar:''}}, about:{title:{en:'',ar:''},text:{en:'',ar:''}}, services:[], groups:[], contact:{msg:{en:'',ar:''},cv:'',cmbot:''} };
  inline = migrate(inline, DEFAULT_DATA);
  if(inline.groups.every(function(g){ return !g.photos || !g.photos.length; })) seedPhotos(inline);
  return inline;
})();

if(S && S.contact){
  if(!S.contact.cmbot && CFG.cmbot) S.contact.cmbot = CFG.cmbot;
  if(!S.contact.wa && CFG.whatsapp) S.contact.wa = CFG.whatsapp;
  if(!S.contact.email && CFG.email) S.contact.email = CFG.email;
}

function saveLocal(){ try { localStorage.setItem(DKEY, JSON.stringify(S)); return true; } catch(e){ return false; } }

var ICONS = {
  social:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1"/>',
  logo:'<path d="M12 2.5 14.7 9l6.8 2.7-6.8 2.8L12 21.5l-2.7-7L2.5 11.7 9.3 9z"/>',
  identity:'<path d="M12 3l8.5 4.6v8.8L12 21l-8.5-4.6V7.6z"/><path d="M12 12l8.5-4.4M12 12v9M12 12 3.5 7.6"/>',
  print:'<path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  banner:'<path d="M3 10.5v3l9 4.5v-12z"/><path d="M12 8.2a4.2 4.2 0 0 1 0 7.6"/><path d="M6 18.5 7 21"/>',
  web:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9.2h18"/><circle cx="6.6" cy="6.6" r=".9"/><path d="M10 13h7"/>'
};
function svgIcon(n){ var b = ICONS[n] || ICONS.logo; return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+b+'</svg>'; }

var activeFilter = 'all', lbItems = [], lbIndex = 0;
function waHref(){ var num = String(S.contact.wa || '').replace(/\D/g,''); return 'https://wa.me/'+num+'?text='+encodeURIComponent(LANG === 'ar' ? 'مرحباً رائد للإعلان' : 'Hello RAED Advertising'); }
function prettyPhone(n){ n = String(n || '').replace(/\D/g,''); return '+'+n.replace(/^(\d{3})(\d{3})(\d{3})(\d+)$/,'$1 $2 $3 $4'); }

function applyI18n(){
  $$('[data-t]').forEach(function(el){ var k = el.getAttribute('data-t'); var v = L(k); if(v) el.textContent = v; });
  var ct = $('#cfTitle'); if(ct) ct.textContent = L('formTitle');
  var cs = $('#cfSub'); if(cs) cs.textContent = L('formSub');
}

function applyData(){
  applyI18n();
  $('#heroEyebrow').textContent = T(S.hero.eyebrow);
  $('#heroTitle').textContent = T(S.hero.title);
  $('#heroSub').textContent = T(S.hero.sub);
  $('#aboutTitle').textContent = T(S.about.title);
  $('#aboutText').innerHTML = String(T(S.about.text) || '').split(/\n\s*\n/).map(function(p){ return '<p>'+esc(p).replace(/\n/g,'<br>')+'</p>'; }).join('');
  $('#servicesGrid').innerHTML = (S.services || []).map(function(s,i){
    return '<article class="card reveal"><span class="card-num">'+String(i+1).padStart(2,'0')+'</span><div class="card-ico">'+svgIcon(s.icon)+'</div><h3>'+esc(T(s.t))+'</h3><p>'+esc(T(s.d))+'</p></article>';
  }).join('');
  $('#contactMsg').textContent = T(S.contact.msg);
  var em = S.contact.email || '';
  $('#contactEmail').textContent = em;
  $('#contactWa').textContent = prettyPhone(S.contact.wa);
  $$('.wa-link').forEach(function(a){ a.href = waHref(); a.target = '_blank'; a.rel = 'noopener'; });
  $('#footerEmail').textContent = em;
  $('#footerWa').textContent = prettyPhone(S.contact.wa);
  var cvBtn = $('#contactCvBtn');
  if(cvBtn){ if(S.contact.cv && String(S.contact.cv).trim()){ cvBtn.href = S.contact.cv; cvBtn.style.display = ''; } else { cvBtn.style.display = 'none'; } }
  renderFilters(); renderGallery(); observeReveals(document);
}

function galleryItems(){ var o = []; (S.groups || []).forEach(function(g){ if(activeFilter !== 'all' && g.id !== activeFilter) return; (g.photos || []).forEach(function(s){ o.push({src:s, group:T(g.name)}); }); }); return o; }

function renderFilters(){
  var gs = (S.groups || []).filter(function(g){ return (g.photos || []).length; });
  var h = '<button class="filter" data-filter="all" aria-pressed="'+(activeFilter === 'all')+'" type="button">'+esc(L('allWork'))+'</button>';
  h += gs.map(function(g){ return '<button class="filter" data-filter="'+esc(g.id)+'" aria-pressed="'+(activeFilter === g.id)+'" type="button">'+esc(T(g.name))+'</button>'; }).join('');
  $('#filters').innerHTML = h;
}

function renderGallery(){
  var items = galleryItems(), grid = $('#galleryGrid');
  if(!items.length){ grid.innerHTML = '<div class="empty">'+esc(L('noImages'))+'</div>'; return; }
  grid.innerHTML = items.map(function(it,i){ return '<figure class="gitem reveal" data-index="'+i+'" tabindex="0" role="button"><img src="'+esc(it.src)+'" alt="'+esc(it.group)+'" loading="lazy" decoding="async"><figcaption>'+esc(it.group)+'</figcaption></figure>'; }).join('');
  observeReveals(grid);
}

var lightbox = $('#lightbox'), lastFocus = null;
function openLightbox(i){ lbItems = galleryItems(); if(!lbItems.length) return; lbIndex = (i + lbItems.length) % lbItems.length; updateLightbox(); lastFocus = document.activeElement; lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; var c = $('.lb-close'); if(c) c.focus(); }
function updateLightbox(){ var it = lbItems[lbIndex]; $('#lbImg').src = it.src; $('#lbImg').alt = it.group; $('#lbCaption').textContent = it.group + ' · ' + (lbIndex+1) + '/' + lbItems.length; }
function closeLightbox(){ lightbox.classList.remove('open'); document.body.style.overflow = ''; if(lastFocus && lastFocus.focus) lastFocus.focus(); }

$$('[data-logo]').forEach(function(img){
  img.src = LOGO;
  img.addEventListener('error', function(){ var sp = document.createElement('span'); sp.className = 'wordmark'; sp.innerHTML = 'RAED<span>.</span>'; if(img.parentNode) img.parentNode.replaceChild(sp, img); });
});
$('#year').textContent = new Date().getFullYear();

var nav = $('#nav');
function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 24); }
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
var navToggle = $('#navToggle'), navLinks = $('#navLinks');
navToggle.addEventListener('click', function(){ var o = navLinks.classList.toggle('open'); navToggle.setAttribute('aria-expanded', String(o)); });
navLinks.addEventListener('click', function(e){ if(e.target.tagName === 'A'){ navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); } });

var sections = $$('main section[id]');
if('IntersectionObserver' in window){
  var navObs = new IntersectionObserver(function(es){ es.forEach(function(en){ if(!en.isIntersecting) return; var id = en.target.id; $$('#navLinks a').forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#'+id && !a.classList.contains('btn')); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function(s){ navObs.observe(s); });
}

var revObs = null;
function observeReveals(root){
  if(REDUCE || !('IntersectionObserver' in window)){ $$('.reveal', root).forEach(function(el){ el.classList.add('in'); }); return; }
  if(!revObs){ revObs = new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); revObs.unobserve(en.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }); }
  $$('.reveal', root).forEach(function(el){ if(!el.classList.contains('in')) revObs.observe(el); });
}

$('#filters').addEventListener('click', function(e){ var b = e.target.closest('[data-filter]'); if(!b) return; activeFilter = b.dataset.filter; renderFilters(); renderGallery(); });
$('#galleryGrid').addEventListener('click', function(e){ var f = e.target.closest('.gitem'); if(f) openLightbox(Number(f.dataset.index)); });
$('#galleryGrid').addEventListener('keydown', function(e){ if(e.key !== 'Enter' && e.key !== ' ') return; var f = e.target.closest('.gitem'); if(f){ e.preventDefault(); openLightbox(Number(f.dataset.index)); } });
lightbox.addEventListener('click', function(e){ var b = e.target.closest('[data-lb]'); if(b){ var a = b.dataset.lb; if(a === 'close') closeLightbox(); if(a === 'prev'){ lbIndex = (lbIndex-1+lbItems.length) % lbItems.length; updateLightbox(); } if(a === 'next'){ lbIndex = (lbIndex+1) % lbItems.length; updateLightbox(); } return; } if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', function(e){ if(!lightbox.classList.contains('open')) return; if(e.key === 'Escape') closeLightbox(); if(e.key === 'ArrowLeft'){ lbIndex = (lbIndex-1+lbItems.length) % lbItems.length; updateLightbox(); } if(e.key === 'ArrowRight'){ lbIndex = (lbIndex+1) % lbItems.length; updateLightbox(); } });

if(!REDUCE && window.matchMedia('(hover:hover)').matches){
  var plate = $('#plate'), stage = $('#stage');
  if(stage){
    stage.addEventListener('pointermove', function(e){ var r = stage.getBoundingClientRect(); plate.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 32).toFixed(2) + 'deg'); plate.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 22).toFixed(2) + 'deg'); });
    stage.addEventListener('pointerleave', function(){ plate.style.setProperty('--ry','-15deg'); plate.style.setProperty('--rx','9deg'); });
  }
}

/* ===== CONTACT FORM ===== */
var cfModal = $('#cfModal');
function openCf(){ cfModal.classList.add('open'); document.body.style.overflow = 'hidden'; $('#cfStatus').className = 'cf-status'; $('#cfStatus').textContent = ''; $('#cfForm').reset(); setTimeout(function(){ var el = $('#cfName'); if(el) el.focus(); }, 80); }
function closeCf(){ cfModal.classList.remove('open'); document.body.style.overflow = ''; }
$('#contactEmailBtn').addEventListener('click', openCf);
$('#tileEmail').addEventListener('click', openCf);
$('#footerEmail').addEventListener('click', openCf);
$('#cfClose').addEventListener('click', closeCf);
$('#cfCancel').addEventListener('click', closeCf);
cfModal.addEventListener('click', function(e){ if(e.target === cfModal) closeCf(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && cfModal.classList.contains('open')) closeCf(); });

async function sendViaCallMeBot(name, email, msg){
  var phone = String(S.contact.wa || '').replace(/\D/g,'');
  var key = String(S.contact.cmbot || '').trim();
  if(!key || !phone) return { ok:false, reason:'not_configured' };
  var text = '📩 رسالة جديدة من موقع RAED Advertising\n\n👤 الاسم: ' + name + '\n📧 البريد: ' + email + '\n💬 الرسالة:\n' + msg;
  var url = 'https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(phone) + '&text=' + encodeURIComponent(text) + '&apikey=' + encodeURIComponent(key);
  try { await fetch(url, { mode:'no-cors' }); return { ok:true }; } catch(e){ return { ok:false, reason:e.message || 'network' }; }
}

$('#cfForm').addEventListener('submit', async function(e){
  e.preventDefault();
  var name = $('#cfName').value.trim();
  var email = $('#cfEmail').value.trim();
  var msg = $('#cfMsg').value.trim();
  var st = $('#cfStatus');
  if(!name || !email || !msg){ st.className = 'cf-status err'; st.textContent = L('formRequired'); return; }
  st.className = 'cf-status load';
  st.innerHTML = '<span class="cf-spinner"></span>' + esc(L('formSending'));
  var btn = $('#cfSubmit'); btn.disabled = true;
  var hasCmbot = !!(S.contact.cmbot && String(S.contact.cmbot).trim());
  if(hasCmbot){
    var r = await sendViaCallMeBot(name, email, msg);
    btn.disabled = false;
    if(r.ok){ st.className = 'cf-status ok'; st.textContent = L('formOk'); $('#cfForm').reset(); setTimeout(closeCf, 2500); }
    else { st.className = 'cf-status err'; st.textContent = L('formErr'); }
    return;
  }
  var num = String(S.contact.wa || '').replace(/\D/g,'');
  var text = LANG === 'ar' ? '👤 الاسم: '+name+'\n📧 البريد: '+email+'\n\n💬 '+msg : '👤 Name: '+name+'\n📧 Email: '+email+'\n\n💬 '+msg;
  var waUrl = 'https://wa.me/'+num+'?text=' + encodeURIComponent(text);
  window.open(waUrl, '_blank');
  btn.disabled = false;
  st.className = 'cf-status ok'; st.textContent = L('formOk');
  $('#cfForm').reset(); setTimeout(closeCf, 1800);
});

/* ===== ADMIN ===== */
var DEFAULT_CRED = { u:'raed', p:'200311200311raed' };
var CRED = DEFAULT_CRED;
try { var svc = JSON.parse(localStorage.getItem(AKEY) || 'null'); if(svc && svc.u && svc.p) CRED = svc; } catch(e){}
var adminEl = $('#admin'), admBody = $('#admBody'), admStatusEl = $('#admStatus');
var AUTH = false, TAB = 'content', W = null, pendingUrlGroup = null;
function status(m){ if(admStatusEl) admStatusEl.textContent = m || ''; }
function cloudReady(){ return !!(CLOUD.name && CLOUD.imagePreset); }
function cloudSignedReady(){ return !!(CLOUD.name && CLOUD.dataPreset && CLOUD.apiKey && CLOUD.apiSecret); }
function cloudinaryUrl(){ return 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(CLOUD.name) + '/image/upload'; }
function cloudinaryRawUrl(){ return 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(CLOUD.name) + '/raw/upload'; }
function cloudJsonUrl(){ return 'https://res.cloudinary.com/' + CLOUD.name + '/raw/upload/raed-site-data.json'; }
var CLOUD_JSON_ID = 'raed-site-data';

async function generateSignature(params, secret){
  var keys = Object.keys(params).sort();
  var str = keys.map(function(k){ return k+'='+params[k]; }).join('&');
  var buf = new TextEncoder().encode(str + secret);
  var h = await crypto.subtle.digest('SHA-1', buf);
  return Array.from(new Uint8Array(h)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
}

async function uploadToCloudinary(file, onProgress){
  if(!cloudReady()) throw new Error('Cloudinary not enabled');
  var fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUD.imagePreset);
  if(CLOUD.folder) fd.append('folder', CLOUD.folder);
  return new Promise(function(res, rej){
    var x = new XMLHttpRequest(); x.open('POST', cloudinaryUrl(), true);
    x.upload.onprogress = function(e){ if(e.lengthComputable && onProgress) onProgress(Math.round((e.loaded/e.total)*100)); };
    x.onload = function(){ if(x.status >= 200 && x.status < 300){ try { var r = JSON.parse(x.responseText); res(r.secure_url || r.url); } catch(e){ rej(new Error('Invalid response')); } } else { var m = 'Upload failed ('+x.status+')'; try { var er = JSON.parse(x.responseText); if(er.error && er.error.message) m = er.error.message; } catch(e){} rej(new Error(m)); } };
    x.onerror = function(){ rej(new Error('Network error')); };
    x.send(fd);
  });
}

async function uploadCvToCloudinary(file){
  if(!cloudSignedReady()) throw new Error('Signed mode not configured — check Settings');
  var ts = Math.floor(Date.now()/1000);
  var publicId = 'raed-cv';
  var params = { public_id: publicId, timestamp: ts, overwrite: 'true', invalidate: 'true' };
  if(CLOUD.folder) params.folder = CLOUD.folder;
  var sig = await generateSignature(params, CLOUD.apiSecret);
  var fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', CLOUD.apiKey);
  fd.append('timestamp', ts);
  fd.append('signature', sig);
  fd.append('public_id', publicId);
  fd.append('overwrite', 'true');
  fd.append('invalidate', 'true');
  if(CLOUD.folder) fd.append('folder', CLOUD.folder);
  return new Promise(function(res, rej){
    var x = new XMLHttpRequest(); x.open('POST', cloudinaryRawUrl(), true);
    x.onload = function(){ if(x.status >= 200 && x.status < 300){ try { var r = JSON.parse(x.responseText); res(r.secure_url || r.url); } catch(e){ rej(new Error('Invalid response')); } } else { var m = 'Upload failed ('+x.status+')'; try { var er = JSON.parse(x.responseText); if(er.error && er.error.message) m = er.error.message; } catch(e){} rej(new Error(m)); } };
    x.onerror = function(){ rej(new Error('Network error')); };
    x.send(fd);
  });
}

async function saveCloudJson(data){
  if(!cloudSignedReady()) throw new Error('Signed mode not configured — check Settings');
  var ts = Math.floor(Date.now()/1000);
  var params = { public_id: CLOUD_JSON_ID, timestamp: ts, overwrite: 'true', invalidate: 'true' };
  if(CLOUD.folder) params.folder = CLOUD.folder;
  var sig = await generateSignature(params, CLOUD.apiSecret);
  var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  var fd = new FormData();
  fd.append('file', blob, CLOUD_JSON_ID + '.json');
  fd.append('api_key', CLOUD.apiKey);
  fd.append('timestamp', ts);
  fd.append('signature', sig);
  fd.append('public_id', CLOUD_JSON_ID);
  fd.append('overwrite', 'true');
  fd.append('invalidate', 'true');
  if(CLOUD.folder) fd.append('folder', CLOUD.folder);
  return new Promise(function(res, rej){
    var x = new XMLHttpRequest(); x.open('POST', cloudinaryRawUrl(), true);
    x.onload = function(){ if(x.status >= 200 && x.status < 300){ try { var r = JSON.parse(x.responseText); res(r.secure_url || cloudJsonUrl()); } catch(e){ rej(new Error('Invalid response')); } } else { var m = 'Save failed ('+x.status+')'; try { var er = JSON.parse(x.responseText); if(er.error && er.error.message) m = er.error.message; } catch(e){} rej(new Error(m)); } };
    x.onerror = function(){ rej(new Error('Network error')); };
    x.send(fd);
  });
}

async function loadCloudJson(){
  if(!cloudReady()) return null;
  try { var r = await fetch(cloudJsonUrl() + '?t=' + Date.now(), { cache: 'no-store' }); if(!r.ok) return null; var d = await r.json(); if(d && d.hero && d.groups) return migrate(d, DEFAULT_DATA); } catch(e){}
  return null;
}

function openAdmin(){ adminEl.hidden = false; document.body.style.overflow = 'hidden'; status(''); if(AUTH) renderDash(); else renderLogin(); adminEl.scrollTop = 0; }
function closeAdmin(){ adminEl.hidden = true; document.body.style.overflow = ''; if(location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search); }

function renderLogin(){
  admBody.innerHTML = '<form id="loginForm" class="panel login-wrap"><img class="brand-logo login-logo" data-logo alt=""><h3 style="font-size:1.15rem;margin-bottom:18px">' + esc(L('signIn')) + '</h3><div class="field"><label for="lu">' + esc(L('username')) + '</label><input id="lu" autocomplete="username" spellcheck="false"></div><div class="field"><label for="lp">' + esc(L('password')) + '</label><input id="lp" type="password"></div><p class="hint" id="loginErr" style="color:#ff9d9d;min-height:1.3em"></p><button class="btn btn-primary" type="submit" style="width:100%">' + esc(L('signIn')) + '</button></form>';
  $$('[data-logo]', admBody).forEach(function(i){ i.src = LOGO; });
  $('#loginForm').addEventListener('submit', function(e){ e.preventDefault(); var u = $('#lu').value.trim(), p = $('#lp').value; if(u === CRED.u && p === CRED.p){ AUTH = true; status(''); renderDash(); } else { $('#loginErr').textContent = LANG === 'ar' ? 'بيانات خاطئة' : 'Incorrect credentials'; } });
  setTimeout(function(){ var el = $('#lu'); if(el) el.focus(); }, 40);
}

function renderDash(){
  var tabs = [['content',L('tabContent')],['services',L('tabServices')],['gallery',L('tabGallery')],['contact',L('tabContact')],['settings',L('tabSettings')]];
  admBody.innerHTML = '<div class="adm-tabs">' + tabs.map(function(t){ return '<button class="tabbtn ' + (TAB === t[0] ? 'on' : '') + '" data-tab="' + t[0] + '" type="button">' + esc(t[1]) + '</button>'; }).join('') + '</div><div id="tabPanel"></div>';
  renderTab();
}

function biField(label, obj, bind, opts){
  opts = opts || {};
  obj = obj || { en:'', ar:'' };
  if(typeof obj === 'string') obj = { en: obj, ar: obj };
  var id = bind.replace(/[^\w]/g,'_'), enId = 'f_'+id+'_en', arId = 'f_'+id+'_ar';
  var enInput = opts.textarea ? '<textarea id="'+enId+'" data-bind="'+bind+'.en" rows="'+(opts.rows||5)+'">'+esc(obj.en||'')+'</textarea>' : '<input id="'+enId+'" data-bind="'+bind+'.en" value="'+esc(obj.en||'')+'" spellcheck="false">';
  var arInput = opts.textarea ? '<textarea id="'+arId+'" data-bind="'+bind+'.ar" rows="'+(opts.rows||5)+'" dir="rtl">'+esc(obj.ar||'')+'</textarea>' : '<input id="'+arId+'" data-bind="'+bind+'.ar" value="'+esc(obj.ar||'')+'" dir="rtl" spellcheck="false">';
  return '<div class="bi-group"><label>'+esc(label)+'</label><div class="bi-inputs"><div class="bi-input"><span class="bi-tag">EN</span>'+enInput+'</div><div class="bi-input"><span class="bi-tag">ع</span>'+arInput+'</div></div></div>';
}
function singleField(label, val, bind, opts){
  opts = opts || {};
  var id = 'f_' + bind.replace(/[^\w]/g,'_');
  var i = opts.textarea ? '<textarea id="'+id+'" data-bind="'+bind+'" rows="'+(opts.rows||5)+'">'+esc(val)+'</textarea>' : '<input id="'+id+'" data-bind="'+bind+'" value="'+esc(val)+'" spellcheck="false">';
  return '<div class="field"><label for="'+id+'">'+esc(label)+'</label>'+i+'</div>';
}

function renderTab(){
  var p = $('#tabPanel'); if(!p || !W) return;
  if(TAB === 'content'){
    p.innerHTML = '<div class="panel"><h3>'+esc(L('heroSection'))+'</h3>'+biField(L('eyebrow'),W.hero.eyebrow,'hero.eyebrow')+biField(L('headline'),W.hero.title,'hero.title')+biField(L('description'),W.hero.sub,'hero.sub',{textarea:true,rows:3})+'</div><div class="panel"><h3>'+esc(L('aboutSection'))+'</h3>'+biField(L('title'),W.about.title,'about.title')+biField(L('text'),W.about.text,'about.text',{textarea:true,rows:7})+'</div>';
    return;
  }
  if(TAB === 'services'){
    p.innerHTML = '<div class="panel"><h3>'+esc(L('tabServices'))+' <span class="pill-note">'+((W.services||[]).length)+' '+esc(L('servicesCount'))+'</span></h3>'+(W.services||[]).map(function(s,i){
      return '<div class="group-panel"><div class="rowline" style="margin-bottom:10px"><div class="field" style="flex:1"><label>Icon</label><select data-bind="services.'+i+'.icon">'+Object.keys(ICONS).map(function(k){ return '<option value="'+k+'"'+(s.icon===k?' selected':'')+'>'+k+'</option>'; }).join('')+'</select></div></div>'+biField(L('title'),s.t,'services.'+i+'.t')+biField(L('description'),s.d,'services.'+i+'.d',{textarea:true,rows:3})+'<div class="rowline"><button class="btn btn-ghost btn-sm" data-act="sup" data-i="'+i+'" type="button">↑</button><button class="btn btn-ghost btn-sm" data-act="sdown" data-i="'+i+'" type="button">↓</button><button class="btn btn-danger btn-sm" data-act="sdel" data-i="'+i+'" type="button">'+esc(L('delete'))+'</button></div></div>';
    }).join('')+'<button class="btn btn-ghost btn-sm" data-act="sadd" type="button">'+esc(L('addService'))+'</button></div>';
    return;
  }
  if(TAB === 'gallery'){
    var badge = cloudReady() ? '<span class="cloud-status on">☁️ '+esc(CLOUD.name)+'</span>' : '<span class="cloud-status off">☁️ '+esc(LANG==='ar'?'غير مُفعَّل':'Not enabled')+'</span>';
    /* ✅ نص dropzone ديناميكي حسب توفر Cloudinary */
    var dropLabel = cloudReady()
      ? (LANG === 'ar' ? '☁️ اسحب وأفلت هنا (رفع مباشر إلى Cloudinary)' : '☁️ Drag & drop here (uploads to Cloudinary)')
      : L('dragDrop');
    p.innerHTML = '<div class="panel" style="background:rgba(0,238,234,.05)"><div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between"><h3 style="margin:0">'+esc(L('tabGallery'))+'</h3>'+badge+'</div></div>'+(W.groups||[]).map(function(g,gi){
      return '<div class="panel"><div class="group-head"><div class="field" style="flex:1"><label>'+esc(L('categoryName'))+'</label><input data-bind="groups.'+gi+'.name.en" value="'+esc(g.name.en||'')+'" spellcheck="false"><input data-bind="groups.'+gi+'.name.ar" value="'+esc(g.name.ar||'')+'" dir="rtl" spellcheck="false" style="margin-top:6px"></div><button class="btn btn-ghost btn-sm" data-act="gup" data-i="'+gi+'" type="button">↑</button><button class="btn btn-ghost btn-sm" data-act="gdown" data-i="'+gi+'" type="button">↓</button><button class="btn btn-danger btn-sm" data-act="gdel" data-i="'+gi+'" type="button">'+esc(L('delete'))+'</button></div><div class="upload-methods"><button class="btn btn-xs btn-cloud" data-act="ucloud" data-i="'+gi+'" type="button">'+esc(L('uploadCloud'))+'</button><button class="btn btn-xs btn-url" data-act="uurl" data-i="'+gi+'" type="button">'+esc(L('fromUrl'))+'</button><button class="btn btn-xs btn-ghost" data-act="ulocal" data-i="'+gi+'" type="button">'+esc(L('local'))+'</button></div><div class="dropzone" data-drop="'+gi+'">'+esc(dropLabel)+'<input type="file" accept="image/*" multiple hidden data-file="'+gi+'" data-method="local"><input type="file" accept="image/*" multiple hidden data-file="'+gi+'" data-method="cloud"></div><div class="progress-bar" id="prog-'+gi+'" style="display:none"><span style="width:0%"></span></div>'+((g.photos||[]).length?'<div class="thumbs">'+g.photos.map(function(src,pi){ var t = src.indexOf('http')===0 ? (src.indexOf('cloudinary')>-1?'cloud':'url') : 'local'; return '<div class="thumb"><img src="'+esc(src)+'" alt="" loading="lazy"><span class="thumb-badge '+t+'">'+t+'</span><div class="thumb-actions"><button data-act="pleft" data-i="'+gi+'" data-p="'+pi+'" type="button">←</button><button data-act="pcover" data-i="'+gi+'" data-p="'+pi+'" type="button">★</button><button data-act="pdel" data-i="'+gi+'" data-p="'+pi+'" type="button">✕</button><button data-act="pright" data-i="'+gi+'" data-p="'+pi+'" type="button">→</button></div></div>'; }).join('')+'</div>':'<p class="hint">'+esc(L('noImagesCat'))+'</p>')+'</div>';
    }).join('')+'<div class="panel"><button class="btn btn-ghost btn-sm" data-act="gadd" type="button">'+esc(L('addCategory'))+'</button></div>';
    return;
  }
  if(TAB === 'contact'){
    var cvHtml = (W.contact.cv && String(W.contact.cv).trim()) ? '<div class="cv-box"><span style="flex:1"><a href="'+esc(W.contact.cv)+'" target="_blank" rel="noopener">'+esc(L('cvCurrent'))+'</a></span><button class="btn btn-danger btn-xs" data-act="cvdel" type="button">'+esc(L('cvDelete'))+'</button></div>' : '<div class="cv-box empty">'+esc(L('cvNone'))+'</div>';
    var hasCmbot = !!(W.contact.cmbot && String(W.contact.cmbot).trim());
    var cmBanner = hasCmbot ? '<div class="cm-banner ok">✓ '+esc(L('cmbotStatus'))+'</div>' : '<div class="cm-banner warn">'+esc(L('cmbotNotSet'))+'</div>';
    p.innerHTML = '<div class="panel"><h3>'+esc(L('contactTitle2'))+'</h3><div class="grid2">'+singleField('Email',W.contact.email,'contact.email')+singleField('WhatsApp',W.contact.wa,'contact.wa')+'</div>'+biField(L('message'),W.contact.msg,'contact.msg',{textarea:true,rows:3})+'</div>'+'<div class="panel"><h3>'+esc(L('cmbotSection'))+'</h3>'+cmBanner+'<p class="hint" style="margin:12px 0">'+esc(L('cmbotHelp'))+'</p>'+'<div class="field"><label>'+esc(L('cmbotLabel'))+'</label><input id="f_contact_cmbot" data-bind="contact.cmbot" value="'+esc(W.contact.cmbot||'')+'" spellcheck="false" placeholder="1234567"></div>'+'<div class="rowline"><button class="btn btn-primary btn-sm" data-act="savecmbot" type="button">'+esc(L('cmbotSave'))+'</button>'+(hasCmbot?'<button class="btn btn-cloud btn-sm" data-act="testcbmot" type="button">'+esc(L('cmbotTest'))+'</button>':'')+'</div>'+'<p class="hint" style="margin-top:12px;color:#ffd966">'+esc(L('cmbotImportant'))+'</p>'+'</div>'+'<div class="panel"><h3>'+esc(L('cvSection'))+'</h3><p class="hint" style="margin-bottom:14px">'+esc(L('cvHelp'))+'</p>'+cvHtml+'<div class="upload-methods" style="margin-top:14px"><button class="btn btn-xs btn-cloud" data-act="cvcloud" type="button">'+esc(L('cvUpload'))+'</button><button class="btn btn-xs btn-url" data-act="cvurl" type="button">'+esc(L('cvUrl'))+'</button><input type="file" accept=".pdf,.doc,.docx,application/pdf" hidden id="cvFileInput"></div><div class="field" style="margin-top:14px"><label>'+esc(L('cvManual'))+'</label><input id="cvUrlManual" value="'+esc(W.contact.cv||'')+'" placeholder="https://example.com/cv.pdf" spellcheck="false"></div><button class="btn btn-primary btn-sm" data-act="cvsave" type="button">'+esc(L('cvSaveUrl'))+'</button></div>';
    return;
  }
  if(TAB === 'settings'){
    var cs = cloudReady() ? '<span class="cloud-status on">✓ '+esc(LANG==='ar'?'مُفعَّل':'Enabled')+'</span>' : '<span class="cloud-status off">✗ '+esc(LANG==='ar'?'غير مُفعَّل':'Not enabled')+'</span>';
    var signedBadge = cloudSignedReady() ? '<span class="cloud-status on">✓ Signed</span>' : '<span class="cloud-status off">✗ Signed</span>';
    p.innerHTML = '<div class="panel"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px"><h3 style="margin:0">☁️ Cloudinary</h3><div style="display:flex;gap:8px;flex-wrap:wrap">'+cs+signedBadge+'</div></div>'+'<p class="hint" style="margin-bottom:16px">'+esc(L('cloudHelp'))+'</p><div class="grid2">'+singleField(L('cloudName'),CLOUD.name,'cloud.name')+singleField(L('folder'),CLOUD.folder||'','cloud.folder')+'</div><div class="grid2">'+singleField(L('imagePreset'),CLOUD.imagePreset||'','cloud.imagePreset')+singleField(L('dataPreset'),CLOUD.dataPreset||'','cloud.dataPreset')+'</div><div class="grid2">'+singleField(L('apiKey'),CLOUD.apiKey||'','cloud.apiKey')+singleField(L('apiSecret'),CLOUD.apiSecret||'','cloud.apiSecret')+'</div><div class="rowline"><button class="btn btn-primary btn-sm" data-act="savecloud" type="button">'+esc(L('saveBtn'))+'</button><button class="btn btn-ghost btn-sm" data-act="testcloud" type="button">'+esc(L('testBtn'))+'</button><button class="btn btn-danger btn-sm" data-act="clearcloud" type="button">'+esc(L('clearBtn'))+'</button></div></div>'+'<div class="panel"><h3>'+esc(L('credsSection'))+'</h3><div class="grid2">'+singleField(L('username'),CRED.u,'cred.u')+singleField(L('password'),CRED.p,'cred.p')+'</div><button class="btn btn-primary btn-sm" data-act="savecred" type="button">'+esc(L('updateBtn'))+'</button></div>'+'<div class="panel"><h3>'+esc(L('backupSection'))+'</h3><div class="rowline"><button class="btn btn-ghost btn-sm" data-act="export" type="button">'+esc(L('exportJson'))+'</button><button class="btn btn-ghost btn-sm" data-act="import" type="button">'+esc(L('importJson'))+'</button><input type="file" accept="application/json" hidden id="importFile"><button class="btn btn-danger btn-sm" data-act="reset" type="button">'+esc(L('resetBtn'))+'</button></div><p class="hint">'+esc(cloudReady()?L('autoPublish'):L('noCloud'))+'</p></div>';
    return;
  }
}

var urlModal = $('#urlModal'), urlTimer = null, resolvedUrl = null;
function tryLoad(url){ return new Promise(function(res){ var i = new Image(); var d = false; var t = setTimeout(function(){ if(!d){ d = true; res(null); } }, 12000); i.onload = function(){ if(d) return; d = true; clearTimeout(t); if(i.naturalWidth < 20 || i.naturalHeight < 20){ res(null); return; } res(url); }; i.onerror = function(){ if(d) return; d = true; clearTimeout(t); res(null); }; i.src = url; }); }
async function extractImg(pageUrl){
  var pr = ['https://api.codetabs.com/v1/proxy?quest=','https://api.allorigins.win/raw?url='];
  var html = null;
  for(var i=0;i<pr.length;i++){ try { var r = await fetch(pr[i]+encodeURIComponent(pageUrl), { credentials:'omit' }); if(r.ok){ var t = await r.text(); if(t && t.length > 200){ html = t; break; } } } catch(e){} }
  if(!html) return null;
  var pin = html.match(/https:\/\/i\.pinimg\.com\/originals\/[a-zA-Z0-9\/._-]+\.(?:jpg|jpeg|png|gif|webp)/i);
  if(pin){ var ok = await tryLoad(pin[0]); if(ok) return pin[0]; }
  var pats = [/<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i, /<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/i, /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i];
  for(var j=0;j<pats.length;j++){ var m = html.match(pats[j]); if(m && m[1]){ var u = m[1].replace(/\\\//g,'/').replace(/&amp;/g,'&'); if(u.indexOf('//')===0) u = 'https:'+u; else if(u.indexOf('/')===0){ try { u = new URL(pageUrl).origin + u; } catch(e){ continue; } } else if(u.indexOf('http')!==0){ try { u = new URL(u, pageUrl).href; } catch(e){ continue; } } var k = await tryLoad(u); if(k) return u; } }
  return null;
}
async function resolveUrl(raw){ var u = String(raw||'').trim(); if(!u) return {error:L('enterUrl')}; if(!/^https?:\/\//i.test(u)){ if(/^[\w-]+\.[\w.-]+/.test(u)) u = 'https://'+u; else return {error:L('badUrl')}; } var d = await tryLoad(u); if(d) return {url:d, method:'direct'}; var f = await extractImg(u); if(f) return {url:f, method:'page'}; return {error:L('notFound')}; }
function openUrlModal(gi){ pendingUrlGroup = gi; resolvedUrl = null; $('#urlInput').value = ''; $('#urlError').textContent = ''; $('#urlPreviewInfo').textContent = ''; $('#urlPreviewWrap').style.display = 'none'; $('#urlPreviewWrap').querySelector('.url-preview').innerHTML = ''; $('#urlAdd').disabled = true; urlModal.classList.add('open'); setTimeout(function(){ $('#urlInput').focus(); }, 60); }
function closeUrlModal(){ urlModal.classList.remove('open'); pendingUrlGroup = null; resolvedUrl = null; clearTimeout(urlTimer); }
$('#urlCancel').addEventListener('click', closeUrlModal);
urlModal.addEventListener('click', function(e){ if(e.target === urlModal) closeUrlModal(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && urlModal.classList.contains('open')) closeUrlModal(); });
$('#urlInput').addEventListener('input', function(){
  var v = this.value.trim(); clearTimeout(urlTimer); resolvedUrl = null; $('#urlAdd').disabled = true; $('#urlError').textContent = '';
  if(v.length < 5){ $('#urlPreviewWrap').style.display = 'none'; return; }
  $('#urlPreviewWrap').style.display = 'block';
  $('#urlPreviewWrap').querySelector('.url-preview').innerHTML = '<div class="url-loading"><div class="spinner"></div>'+esc(L('searching'))+'</div>';
  $('#urlPreviewInfo').textContent = '';
  urlTimer = setTimeout(async function(){
    if(!urlModal.classList.contains('open') || $('#urlInput').value.trim() !== v) return;
    var r = await resolveUrl(v);
    if(!urlModal.classList.contains('open') || $('#urlInput').value.trim() !== v) return;
    var pb = $('#urlPreviewWrap').querySelector('.url-preview');
    if(r.error){ pb.innerHTML = '<div class="url-loading" style="color:#ff9d9d">✗ '+esc(r.error)+'</div>'; $('#urlError').textContent = r.error; $('#urlAdd').disabled = true; return; }
    resolvedUrl = r.url; pb.innerHTML = '<img src="'+esc(r.url)+'" alt="">';
    $('#urlPreviewInfo').textContent = r.method === 'page' ? L('extractedFromPage') : L('directLink');
    $('#urlError').textContent = ''; $('#urlAdd').disabled = false;
  }, 600);
});
$('#urlAdd').addEventListener('click', function(){ if(!resolvedUrl || pendingUrlGroup === null) return; W.groups[pendingUrlGroup].photos.push(resolvedUrl); closeUrlModal(); renderTab(); status('✓'); setTimeout(function(){ status(''); }, 2400); });

function resize(file){ return new Promise(function(res){ var img = new Image(), u = URL.createObjectURL(file); img.onload = function(){ var m = 1500, k = Math.min(1, m/Math.max(img.width,img.height)); var c = document.createElement('canvas'); c.width = Math.round(img.width*k); c.height = Math.round(img.height*k); var x = c.getContext('2d'); x.fillStyle = '#06122b'; x.fillRect(0,0,c.width,c.height); x.drawImage(img,0,0,c.width,c.height); URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg',.82)); }; img.onerror = function(){ URL.revokeObjectURL(u); res(null); }; img.src = u; }); }

async function uploadCloudFiles(gi, files){
  var t = W.groups[gi]; if(!t) return;
  var bar = $('#prog-'+gi), bs = bar ? bar.querySelector('span') : null;
  if(bar) bar.style.display = 'block';
  var imgs = files.filter(function(f){ return /^image\//.test(f.type); });
  var done = 0, ok = 0, errs = [];
  for(var i=0;i<imgs.length;i++){
    status('☁️ '+(i+1)+'/'+imgs.length+'…');
    try { var u = await uploadToCloudinary(imgs[i], function(p){ if(bs) bs.style.width = Math.round(((done+p/100)/imgs.length)*100)+'%'; }); t.photos.push(u); ok++; }
    catch(e){ errs.push(imgs[i].name+': '+e.message); }
    done++; if(bs) bs.style.width = Math.round((done/imgs.length)*100)+'%';
  }
  renderTab();
  if(errs.length){ alert('Errors:\n\n'+errs.join('\n')); status('⚠️ '+ok+'/'+imgs.length); } else status('✓ '+ok);
  setTimeout(function(){ status(''); }, 3000);
}
async function uploadLocalFiles(gi, files){
  status('📁 ...'); var t = W.groups[gi]; if(!t) return; var a = 0;
  for(var i=0;i<files.length;i++){ if(!/^image\//.test(files[i].type)) continue; var d = await resize(files[i]); if(d){ t.photos.push(d); a++; } }
  renderTab(); status('✓ '+a); setTimeout(function(){ status(''); }, 3000);
}

adminEl.addEventListener('click', function(e){
  var tab = e.target.closest('[data-tab]'); if(tab){ TAB = tab.dataset.tab; renderDash(); return; }
  /* ✅ النقر على dropzone → يرفع لـ Cloudinary تلقائياً إذا كان مفعّلاً */
  var dz = e.target.closest('[data-drop]');
  if(dz && !e.target.closest('.upload-methods')){
    var method = cloudReady() ? 'cloud' : 'local';
    var inp = $$('input[type=file]', dz).find(function(x){ return x.dataset.method === method; });
    if(inp) inp.click();
    return;
  }
  var b = e.target.closest('[data-act]'); if(!b) return;
  var a = b.dataset.act, i = Number(b.dataset.i), p = Number(b.dataset.p);
  if(a === 'save'){ saveAll(); return; }
  if(a === 'close'){ closeAdmin(); return; }
  if(a === 'ucloud'){ if(!cloudReady()){ alert('Cloudinary not enabled'); return; } var ci = $$('input[type=file]', adminEl).find(function(x){ return x.dataset.file == i && x.dataset.method === 'cloud'; }); if(ci) ci.click(); return; }
  if(a === 'uurl'){ openUrlModal(i); return; }
  if(a === 'ulocal'){ var li = $$('input[type=file]', adminEl).find(function(x){ return x.dataset.file == i && x.dataset.method === 'local'; }); if(li) li.click(); return; }
  if(a === 'sadd'){ W.services.push({icon:'logo',t:{en:'New service',ar:'خدمة جديدة'},d:{en:'Description',ar:'الوصف'}}); renderTab(); status('•'); return; }
  if(a === 'sdel'){ if(!confirm(L('confirmDelete'))) return; W.services.splice(i,1); renderTab(); status('•'); return; }
  if(a === 'sup' && i > 0){ W.services.splice(i-1, 0, W.services.splice(i,1)[0]); renderTab(); status('•'); return; }
  if(a === 'sdown' && i < W.services.length-1){ W.services.splice(i+1, 0, W.services.splice(i,1)[0]); renderTab(); status('•'); return; }
  if(a === 'gadd'){ W.groups.push({id:'g'+Date.now(), name:{en:'New category',ar:'قسم جديد'}, photos:[]}); renderTab(); status('•'); return; }
  if(a === 'gdel'){ if(!confirm(L('confirmDeleteCategory'))) return; W.groups.splice(i,1); renderTab(); status('•'); return; }
  if(a === 'gup' && i > 0){ W.groups.splice(i-1, 0, W.groups.splice(i,1)[0]); renderTab(); status('•'); return; }
  if(a === 'gdown' && i < W.groups.length-1){ W.groups.splice(i+1, 0, W.groups.splice(i,1)[0]); renderTab(); status('•'); return; }
  if(a === 'pdel'){ W.groups[i].photos.splice(p,1); renderTab(); status('•'); return; }
  if(a === 'pcover'){ W.groups[i].photos.unshift(W.groups[i].photos.splice(p,1)[0]); renderTab(); status('•'); return; }
  if(a === 'pleft' && p > 0){ var ar = W.groups[i].photos; ar.splice(p-1, 0, ar.splice(p,1)[0]); renderTab(); status('•'); return; }
  if(a === 'pright' && p < W.groups[i].photos.length-1){ var ar2 = W.groups[i].photos; ar2.splice(p+1, 0, ar2.splice(p,1)[0]); renderTab(); status('•'); return; }
  if(a === 'cvcloud'){ if(!cloudSignedReady()){ alert('Signed mode not configured — check Settings'); return; } var fi = $('#cvFileInput'); if(fi) fi.click(); return; }
  if(a === 'cvurl'){ var uu = prompt(LANG === 'ar' ? 'الصق رابط السيرة (PDF):' : 'Paste resume URL (PDF):'); if(!uu) return; W.contact.cv = uu.trim(); renderTab(); status('•'); return; }
  if(a === 'cvsave'){ var mv = $('#cvUrlManual'); if(!mv) return; W.contact.cv = mv.value.trim(); renderTab(); status('✓'); setTimeout(function(){ status(''); }, 2500); return; }
  if(a === 'cvdel'){ if(!confirm(L('confirmDeleteResume'))) return; W.contact.cv = ''; renderTab(); status('•'); return; }
  if(a === 'savecmbot'){ var ck = $('#f_contact_cmbot'); if(!ck) return; var key = ck.value.trim(); if(!key){ alert('Enter the API key first'); return; } W.contact.cmbot = key; S = clone(W); saveLocal(); applyData(); status('✓ API key saved — Click Save changes to sync'); renderTab(); setTimeout(function(){ status(''); }, 4000); return; }
  if(a === 'testcbmot'){
    var testKey = String(W.contact.cmbot || '').trim(); if(!testKey){ alert('Save the API key first'); return; }
    var testNum = String(S.contact.wa || '').replace(/\D/g,''); if(!testNum){ alert('WhatsApp number missing'); return; }
    status('⏳ Sending test...');
    var testUrl = 'https://api.callmebot.com/whatsapp.php?phone='+encodeURIComponent(testNum)+'&text='+encodeURIComponent('✅ Test from RAED Advertising — CallMeBot works!')+'&apikey='+encodeURIComponent(testKey);
    fetch(testUrl, { mode:'no-cors' }).then(function(){ status('✓ Test sent — check your WhatsApp'); setTimeout(function(){ status(''); }, 4000); }).catch(function(err){ status('✗ Failed: '+err.message); setTimeout(function(){ status(''); }, 5000); });
    return;
  }
  if(a === 'savecred'){ var u = $('#f_cred_u').value.trim(), pw = $('#f_cred_p').value; if(!u || !pw){ alert('Fill both fields'); return; } CRED = {u:u, p:pw}; try { localStorage.setItem(AKEY, JSON.stringify(CRED)); } catch(e){} status('✓'); setTimeout(function(){ status(''); }, 2000); return; }
  if(a === 'savecloud'){
    var n  = $('#f_cloud_name').value.trim();
    var fo = $('#f_cloud_folder').value.trim();
    var ip = $('#f_cloud_imagePreset').value.trim();
    var dp = $('#f_cloud_dataPreset').value.trim();
    var ak = $('#f_cloud_apiKey').value.trim();
    var as = $('#f_cloud_apiSecret').value.trim();
    if(!n || !ip){ alert('Fill Cloud Name and Image Preset'); return; }
    CLOUD = {name:n, folder:fo, imagePreset:ip, dataPreset:dp, apiKey:ak, apiSecret:as};
    try { localStorage.setItem(CKEY, JSON.stringify(CLOUD)); } catch(e){}
    status('✓'); renderTab(); setTimeout(function(){ status(''); }, 2400);
    return;
  }
  if(a === 'testcloud'){
    var tn  = $('#f_cloud_name').value.trim();
    var tf  = $('#f_cloud_folder').value.trim();
    var tip = $('#f_cloud_imagePreset').value.trim();
    var tdp = $('#f_cloud_dataPreset').value.trim();
    var tak = $('#f_cloud_apiKey').value.trim();
    var tas = $('#f_cloud_apiSecret').value.trim();
    if(!tn || !tip){ alert('Fill Cloud Name and Image Preset'); return; }
    status('⏳ Testing...');
    var cv = document.createElement('canvas'); cv.width = 200; cv.height = 200;
    var cx = cv.getContext('2d'); var gr = cx.createLinearGradient(0,0,200,200); gr.addColorStop(0,'#04091c'); gr.addColorStop(1,'#00eeea'); cx.fillStyle = gr; cx.fillRect(0,0,200,200);
    cx.fillStyle = '#fff'; cx.font = 'bold 28px Arial'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('RAED', 100, 100);
    cv.toBlob(async function(blob){
      if(!blob){ status('✗'); return; }
      var f = new File([blob], 'test.jpg', { type:'image/jpeg' });
      var oc = CLOUD;
      CLOUD = {name:tn, folder:tf, imagePreset:tip, dataPreset:tdp, apiKey:tak, apiSecret:tas};
      var results = [];
      try { var u = await uploadToCloudinary(f); results.push('✅ Images: OK'); }
      catch(err){ results.push('❌ Images: ' + err.message); }
      if(tdp && tak && tas){
        try { await saveCloudJson({test:true,hero:{},groups:[]}); results.push('✅ Data: OK'); }
        catch(err){ results.push('❌ Data: ' + err.message); }
      } else { results.push('⚠️ Data: skipped (missing keys)'); }
      alert(results.join('\n'));
      status(results[0].indexOf('✅') === 0 ? '✓ Images OK' : '✗ Failed');
      CLOUD = oc; setTimeout(function(){ status(''); }, 4000);
    }, 'image/jpeg', .9);
    return;
  }
  if(a === 'clearcloud'){ if(!confirm(L('confirmClearCloud'))) return; CLOUD = {name:'',folder:'raed-advertising',imagePreset:'',dataPreset:'',apiKey:'',apiSecret:''}; try { localStorage.removeItem(CKEY); } catch(e){} renderTab(); status('✓'); setTimeout(function(){ status(''); }, 2000); return; }
  if(a === 'export'){ var bl = new Blob([JSON.stringify(W,null,2)],{type:'application/json'}); var lk = document.createElement('a'); lk.href = URL.createObjectURL(bl); lk.download = 'raed-data.json'; document.body.appendChild(lk); lk.click(); lk.remove(); setTimeout(function(){ URL.revokeObjectURL(lk.href); }, 5000); return; }
  if(a === 'import'){ $('#importFile').click(); return; }
  if(a === 'reset'){ if(!confirm(L('confirmReset'))) return; localStorage.removeItem(DKEY); location.reload(); return; }
});

adminEl.addEventListener('input', function(e){ var b = e.target.dataset.bind; if(!b || !W) return; var k = b.split('.'); var o = W; for(var ii=0;ii<k.length-1;ii++) o = o[k[ii]]; o[k[k.length-1]] = e.target.value; status(LANG === 'ar' ? 'تغييرات غير محفوظة' : 'Unsaved changes'); });

adminEl.addEventListener('change', function(e){
  if(e.target.id === 'cvFileInput'){
    var cf = e.target.files[0]; e.target.value = ''; if(!cf) return;
    if(!cloudSignedReady()){ alert('Signed mode not configured — check Settings'); return; }
    status('☁️ Uploading CV...');
    uploadCvToCloudinary(cf).then(function(url){ W.contact.cv = url; renderTab(); status('✓ '+L('cv')); setTimeout(function(){ status(''); }, 3500); }).catch(function(err){ status('✗ '+err.message); alert('Failed:\n\n'+err.message); });
    return;
  }
  var fi = e.target.dataset.file;
  if(fi !== undefined){ var m = e.target.dataset.method || 'local', fs = Array.prototype.slice.call(e.target.files || []); e.target.value = ''; if(!fs.length) return; if(m === 'cloud') uploadCloudFiles(Number(fi), fs); else uploadLocalFiles(Number(fi), fs); return; }
  if(e.target.id === 'importFile'){ var f = e.target.files[0]; e.target.value = ''; if(!f) return; var r = new FileReader(); r.onload = function(){ try { var d = JSON.parse(r.result); if(!d.hero || !d.groups) throw 0; W = migrate(d, DEFAULT_DATA); renderTab(); status('✓'); } catch(err){ alert('Invalid file'); } }; r.readAsText(f); }
});

/* ✅ السحب والإفلات → يرفع لـ Cloudinary تلقائياً إذا كان مفعّلاً */
['dragover','dragleave','drop'].forEach(function(ev){ adminEl.addEventListener(ev, function(e){ var dz = e.target.closest && e.target.closest('[data-drop]'); if(!dz) return; e.preventDefault(); dz.classList.toggle('ov', ev === 'dragover'); if(ev === 'drop'){ var fs = Array.prototype.slice.call(e.dataTransfer.files || []); if(fs.length){ if(cloudReady()) uploadCloudFiles(Number(dz.dataset.drop), fs); else uploadLocalFiles(Number(dz.dataset.drop), fs); } } }); });
window.addEventListener('dragover', function(e){ e.preventDefault(); });
window.addEventListener('drop', function(e){ e.preventDefault(); });

async function saveAll(){
  if(!W) return; S = clone(W); saveLocal(); applyData();
  if(cloudSignedReady()){
    status('☁️ Saving to cloud...');
    try { await saveCloudJson(S); status('✓ '+L('saveChanges')); setTimeout(function(){ status(''); }, 3500); }
    catch(e){ status('⚠️ '+e.message); setTimeout(function(){ status(''); }, 5000); }
  }
  else { status('✓ ('+(LANG === 'ar' ? 'محلي' : 'local')+')'); setTimeout(function(){ status(''); }, 3500); }
}

var lc = 0, lt = null;
$('#footerLogo').addEventListener('click', function(e){ e.preventDefault(); lc++; clearTimeout(lt); lt = setTimeout(function(){ lc = 0; }, 1200); if(lc >= 3){ lc = 0; clearTimeout(lt); W = clone(S); openAdmin(); } });
$('#footerBrand').addEventListener('click', function(e){ if(lc > 0) e.preventDefault(); });

if(location.hash === '#admin'){ W = clone(S); openAdmin(); }
window.addEventListener('hashchange', function(){ if(location.hash === '#admin' && adminEl.hidden){ W = clone(S); openAdmin(); } });

async function boot(){
  if(cloudReady()){
    var cloudData = await loadCloudJson();
    if(cloudData){ S = cloudData; try { localStorage.setItem(DKEY, JSON.stringify(S)); } catch(e){} }
  }
  applyData();
  observeReveals(document);
}
boot();

})();