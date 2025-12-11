async function abrirJuegoBlob(rutaJuego){
  try{
    let contenido;

    // Detectar si estamos en file:// (local)
    if(location.protocol === "file:"){
      contenido = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", rutaJuego);
        xhr.onload = () => xhr.status < 400 ? resolve(xhr.responseText) : reject("No se pudo cargar el juego");
        xhr.onerror = () => reject("Error al cargar el juego");
        xhr.send();
      });
    } else {
      // Servidor/CDN
      const respuesta = await fetch(rutaJuego + "?t=" + Date.now());
      if(!respuesta.ok) throw new Error("No se pudo cargar el juego");
      contenido = await respuesta.text();
    }

    // Crear blob y abrir en nueva ventana
    const blob = new Blob([contenido], { type: "text/html" });
    const urlBlob = URL.createObjectURL(blob);
    const w = window.open(urlBlob, "_blank");
    if(!w) alert("Ventana bloqueada.");
  } catch(e){
    alert("Error cargando el juego: " + e);
  }
}
