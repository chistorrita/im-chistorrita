// script.js (minimal, adapted from GN-Math snippets)
let popularityData = {};


// Replace repo paths if you host assets in your repo
const coverURL = 'https://cdn.jsdelivr.net/gh/gn-math/covers@main';
const htmlURL = 'https://cdn.jsdelivr.net/gh/gn-math/html@main';
let zonesURL = 'https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json';


async function listZones(){
try{
const resp = await fetch(zonesURL + '?t=' + Date.now());
const json = await resp.json();
zones = json;
// mark first as featured (same behavior)
if (zones[0]) zones[0].featured = true;
await fetchPopularity();
sortZones();
populateFilters(json);
}catch(e){container.innerHTML = 'Error loading zones: ' + e}
}


async function fetchPopularity(){
try{
const resp = await fetch('https://data.jsdelivr.com/v1/stats/packages/gh/gn-math/html@main/files?period=year');
const data = await resp.json();
data.forEach(file => {
const m = file.name.match(/\/(\d+)\.html$/);
if (m) popularityData[parseInt(m[1])] = file.hits.total;
});
}catch(e){ /* ignore */ }
}


function sortZones(){
const sortBy = document.getElementById('sortOptions').value;
if (sortBy === 'name') zones.sort((a,b)=>a.name.localeCompare(b.name));
else if (sortBy === 'id') zones.sort((a,b)=>a.id - b.id);
else if (sortBy === 'popular') zones.sort((a,b)=>(popularityData[b.id]||0)-(popularityData[a.id]||0));
displayFeaturedZones(zones.filter(z=>z.featured));
displayZones(zones);
}


function displayFeaturedZones(list){ featuredContainer.innerHTML=''; if(!list.length) {featuredContainer.innerText='No featured zones.';return;} list.forEach(f=>{const d=document.createElement('div');d.className='zone-item'; d.onclick=()=>openZone(f); const img=document.createElement('img'); img.dataset.src=f.cover.replace('{COVER_URL}', coverURL).replace('{HTML_URL}', htmlURL); img.loading='lazy'; d.appendChild(img); const btn=document.createElement('button'); btn.textContent=f.name; btn.onclick=(e)=>{e.stopPropagation(); openZone(f)}; d.appendChild(btn); featuredContainer.appendChild(d) }); lazyLoadImages();}


function displayZones(list){ container.innerHTML=''; if(!list.length){container.innerText='No zones found.'; return;} list.forEach(file=>{const d=document.createElement('div');d.className='zone-item'; d.onclick=()=>openZone(file); const img=document.createElement('img'); img.dataset.src=file.cover.replace('{COVER_URL}', coverURL).replace('{HTML_URL}', htmlURL); img.loading='lazy'; d.appendChild(img); const btn=document.createElement('button'); btn.textContent=file.name; btn.onclick=(e)=>{e.stopPropagation(); openZone(file)}; d.appendChild(btn); container.appendChild(d)}); lazyLoadImages(); document.getElementById('allSummary').textContent = `All Zones (${list.length})`;}


function lazyLoadImages(){ const lazyImages = document.querySelectorAll('img[data-src]'); const io = new IntersectionObserver((entries, obs)=>{ entries.forEach(en=>{ if(en.isIntersecting){ const img=en.target; img.src=img.dataset.src; img.removeAttribute('data-src'); obs.unobserve(img); } })}, {rootMargin:'100px', threshold:0.1}); lazyImages.forEach(i=>io.observe(i));}


function filterZones(){ const q=document.getElementById('searchBar').value.toLowerCase(); const filtered = zones.filter(z=>z.name.toLowerCase().includes(q)); displayZones(filtered);}
function filterZones2(){ const q=document.getElementById('filterOptions').value; if(q==='none') displayZones(zones); else displayZones(zones.filter(z=>z.special && z.special.includes(q))); }


function openZone(file){ if(file.url.startsWith('http')){ window.open(file.url,'_blank'); return;} const url = file.url.replace('{COVER_URL}', coverURL).replace('{HTML_URL}', htmlURL);
fetch(url+'?t='+Date.now()).then(r=>r.text()).then(html=>{
if(zoneFrame && zoneFrame.parentNode) zoneFrame.parentNode.removeChild(zoneFrame);
zoneFrame = document.createElement('iframe'); zoneFrame.id='zoneFrame'; zoneViewer.appendChild(zoneFrame);
zoneFrame.contentDocument.open(); zoneFrame.contentDocument.write(html); zoneFrame.contentDocume