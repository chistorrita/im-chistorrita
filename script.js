const htmlURL = 'https://cdn.jsdelivr.net/gh/chistorrita/im-chistorrita@main/assets/html';

function openZone(file) {
  // Solo usamos el nombre de archivo de zones.json
  if (!file.url) {
    alert("File URL missing");
    return;
  }

  const url = `${htmlURL}/${file.url}?t=${Date.now()}`; // URL final
  fetch(url)
    .then(resp => {
      if (!resp.ok) throw new Error("HTTP error " + resp.status);
      return resp.text();
    })
    .then(html => {
      // eliminamos iframe viejo si existe
      if (zoneFrame && zoneFrame.parentNode) zoneFrame.parentNode.removeChild(zoneFrame);

      // creamos iframe nuevo
      zoneFrame = document.createElement('iframe');
      zoneFrame.id = 'zoneFrame';
      zoneViewer.appendChild(zoneFrame);

      // cargamos el HTML dentro del iframe
      zoneFrame.contentDocument.open();
      zoneFrame.contentDocument.write(html);
      zoneFrame.contentDocument.close();

      // Actualizamos UI
      document.getElementById('zoneName').textContent = file.name;
      document.getElementById('zoneId').textContent = file.id;
      document.getElementById('zoneAuthor').textContent = 'by ' + (file.author || 'Unknown');
      if (file.authorLink) document.getElementById('zoneAuthor').href = file.authorLink;

      zoneViewer.style.display = 'block';
      const urlo = new URL(window.location);
      urlo.searchParams.set('id', file.id);
      history.pushState(null, '', urlo.toString());
    })
    .catch(e => alert('Failed to load zone: ' + e));
}

function aboutBlank() {
  const id = document.getElementById('zoneId').textContent;
  const zone = zones.find(z => String(z.id) === String(id));
  if (!zone) return;

  // Usamos la misma lógica que openZone
  const url = `${htmlURL}/${zone.url}?t=${Date.now()}`;
  fetch(url)
    .then(resp => {
      if (!resp.ok) throw new Error("HTTP error " + resp.status);
      return resp.text();
    })
    .then(html => {
      const w = window.open('about:blank', '_blank');
      if (w) {
        w.document.open();
        w.document.write(html);
        w.document.close();
      } else {
        alert('Popup blocked');
      }
    })
    .catch(e => alert('Failed to open in new tab: ' + e));
}
