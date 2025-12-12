const container = document.getElementById('container');
const featuredContainer = document.getElementById('featuredZones');
const zoneViewer = document.getElementById('zoneViewer');
let zoneFrame = document.getElementById('zoneFrame');
let zones = [];
let popularityData = {};

// Rutas CDN correctas
let zonesURL = 'https://cdn.jsdelivr.net/gh/chistorrita/im-chistorrita@main/zones.json';
const htmlURL = 'https://cdn.jsdelivr.net/gh/chistorrita/im-chistorrita@main/assets/html';
const coverURL = 'https://cdn.jsdelivr.net/gh/chistorrita/im-chistorrita@main/assets/covers';

// ---------------------
// Cargar zonas
// ---------------------
async function listZones(){
  try{
    const resp = await fetch(zonesURL + '?t=' + Date.now());
    const json = await resp.json();
    zones = json;
    if(zones[0]) zones[0].featured = true;
    sortZones();
    populateFilters(json);
  }catch(e){
    container.innerHTML = 'Error loading zones: ' + e;
  }
}

// ---------------------
// Ordenar zonas
// ---------------------
function sortZones(){
  const sortBy = document.getElementById('sortOptions').value;
  if (sortBy === 'name') zones.sort((a,b)=>a.name.localeCompare(b.name));
  else if (sortBy === 'id') zones.sort((a,b)=>a.id - b.id);
  else if (sortBy === 'popular') zones.sort((a,b)=>(popularityData[b.id]||0)-(popularityData[a.id]||0));

  displayFeaturedZones(zones.filter(z=>z.featured));
  displayZones(zones);
}

// ---------------------
// Mostrar zonas
// ---------------------
function displayFeaturedZones(list){ 
  featuredContainer.innerHTML=''; 
  if(!list.length){ 
    featuredContainer.innerText='No featured zones.'; 
    return; 
  }

  list.forEach(f=>{
    const d=document.createElement('div'); 
    d.className='zone-item'; 
    d.onclick=()=>openZone(f);

    const img=document.createElement('img'); 
    img.dataset.src = f.cover.replace('{COVER_URL}', coverURL); 
    img.loading='lazy'; 
    d.appendChild(img);

    const btn=document.createElement('button'); 
    btn.textContent=f.name; 
    btn.onclick=(e)=>{e.stopPropagation(); openZone(f)}; 
    d.appendChild(btn); 
    
    featuredContainer.appendChild(d); 
  });

  lazyLoadImages();
}

function displayZones(list){ 
  container.innerHTML=''; 
  if(!list.length){
    container.innerText='No zones found.';
    return;
  }

  list.forEach(file=>{
    const d=document.createElement('div');
    d.className='zone-item'; 
    d.onclick=()=>openZone(file);

    const img=document.createElement('img'); 
    img.dataset.src = file.cover.replace('{COVER_URL}', coverURL); 
    img.loading='lazy';
    d.appendChild(img);

    const btn=document.createElement('button'); 
    btn.textContent=file.name; 
    btn.onclick=(e)=>{e.stopPropagation(); openZone(file)}; 
    d.appendChild(btn);

    container.appendChild(d);
  });

  lazyLoadImages(); 
  document.getElementById('allSummary').textContent = `All Zones (${list.length})`;
}

function lazyLoadImages(){ 
  const lazyImages = document.querySelectorAll('img[data-src]'); 
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ 
        const img=en.target; 
        img.src=img.dataset.src; 
        img.removeAttribute('data-src'); 
        obs.unobserve(img); 
      } 
    })
  }, {rootMargin:'100px', threshold:0.1}); 
  
  lazyImages.forEach(i=>io.observe(i));
}

// ---------------------------------------
// ABRIR JUEGO SINGLEFILE (ESTILO GN-MATH)
// ---------------------------------------
function openZone(file){

  const url = `${htmlURL}/${file.url}?t=${Date.now()}`;

  fetch(url)
    .then(r => r.text())
    .then(html => {

      if(zoneFrame && zoneFrame.parentNode) 
        zoneFrame.parentNode.removeChild(zoneFrame);

      zoneFrame = document.createElement('iframe'); 
      zoneFrame.id='zoneFrame'; 
      zoneViewer.appendChild(zoneFrame);

      zoneFrame.contentDocument.open(); 
      zoneFrame.contentDocument.write(html); 
      zoneFrame.contentDocument.close();

      document.getElementById('zoneName').textContent = file.name; 
      document.getElementById('zoneId').textContent = file.id; 
      document.getElementById('zoneAuthor').textContent = 'by ' + (file.author||'Unknown'); 

      if(file.authorLink) 
        document.getElementById('zoneAuthor').href = file.authorLink;

      zoneViewer.style.display = 'block'; 

      const urlo = new URL(window.location); 
      urlo.searchParams.set('id', file.id); 
      history.pushState(null,'', urlo.toString());
      
    })
    .catch(e => alert('Failed to load zone: ' + e));
}

// ---------------------
// ABRIR COMO ABOUT:BLANK
// ---------------------
function aboutBlank(){ 
  const id = document.getElementById('zoneId').textContent; 
  const zone = zones.find(z=>String(z.id)===String(id)); 
  if(!zone) return; 

  const url = `${htmlURL}/${zone.url}?t=${Date.now()}`;

  fetch(url)
    .then(r => r.text())
    .then(t => { 
      const w = window.open('about:blank','_blank'); 
      if(w){ 
        w.document.open(); 
        w.document.write(t); 
        w.document.close(); 
      }
    });
}

// ---------------------
function closeZone(){ 
  zoneViewer.style.display='none'; 
  if(zoneFrame && zoneFrame.parentNode) 
    zoneFrame.parentNode.removeChild(zoneFrame); 

  const url = new URL(window.location); 
  url.searchParams.delete('id'); 
  history.pushState(null,'',url.toString());
}

// ---------------------
function populateFilters(json){ 
  let alltags = []; 
  json.forEach(o=>{ if(Array.isArray(o.special)) alltags.push(...o.special); }); 
  alltags = [...new Set(alltags)]; 
  
  const opt = document.getElementById('filterOptions'); 
  
  while(opt.children.length>1) 
    opt.removeChild(opt.lastElementChild); 

  alltags.forEach(tag=>{
    const el = document.createElement('option'); 
    el.value = tag; 
    el.textContent = tag.charAt(0).toUpperCase()+tag.slice(1); 
    opt.appendChild(el); 
  });
}

// ---------------------
// SETTINGS
// ---------------------
const settings = document.getElementById('settings'); 
settings.addEventListener('click', ()=>{
  document.getElementById('popupTitle').textContent='Settings'; 
  const b=document.getElementById('popupBody'); 
  b.innerHTML = `<button onclick="darkMode()">Toggle Dark Mode</button><br><button onclick="tabCloak()">Tab Cloak</button>`; 
  document.getElementById('popupOverlay').style.display='flex'; 
});

function closePopup(){ document.getElementById('popupOverlay').style.display='none'; }
function darkMode(){ document.body.classList.toggle('dark-mode'); }

function tabCloak(){ 
  closePopup(); 
  
  document.getElementById('popupTitle').textContent='Tab Cloak'; 
  
  document.getElementById('popupBody').innerHTML = `
      <label>Set tab title:</label><br>
      <input oninput="document.title=this.value" placeholder="Enter new tab name"><br><br>
      <label>Set tab icon URL:</label><br>
      <input oninput="(function(u){const l=document.querySelector('link[rel~=icon]')||document.createElement('link'); l.rel='icon'; l.href=u; document.head.appendChild(l);})(this.value)" placeholder="Icon URL">
    `;
  
  document.getElementById('popupOverlay').style.display='flex'; 
}

// Init
listZones();
