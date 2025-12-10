// Abre juegos como BLOB cargándolos desde GitHub
async function abrirJuegoBlob(ruta) {
    try {
        // Cargar el archivo HTML del juego
        let respuesta = await fetch(ruta);
        let texto = await respuesta.text();

        // Convertir el HTML en un Blob
        let blob = new Blob([texto], { type: "text/html" });

        // Crear URL tipo blob:
        let blobURL = URL.createObjectURL(blob);

        // Abrir en nueva ventana
        let w = window.open(blobURL, "_blank");
        if (!w) alert("La ventana fue bloqueada.");

    } catch (e) {
        alert("Error cargando el juego: " + e);
    }
}
