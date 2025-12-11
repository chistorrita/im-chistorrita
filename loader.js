async function abrirJuegoBlob(ruta) {
    try {
        if(ruta.endsWith('/')) ruta += 'index.html';
        let respuesta = await fetch(ruta);
        let texto = await respuesta.text();
        let blob = new Blob([texto], { type: "text/html" });
        let blobURL = URL.createObjectURL(blob);
        let w = window.open(blobURL, "_blank");
        if(!w) alert("La ventana fue bloqueada.");
    } catch(e) {
        alert("Error cargando el juego: " + e);
    }
}
