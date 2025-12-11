// Abre juegos igual que GN-Math (cargando el index y convirtiéndolo en blob)
async function abrirJuegoBlob(carpeta){
    try {
        // ruta del index dentro de la carpeta
        const ruta = "games/" + carpeta + "/index.html";

        // obtener contenido del index
        const res = await fetch(ruta);
        if(!res.ok) throw new Error("No se pudo cargar el index.html");

        const html = await res.text();

        // crear blob
        const blob = new Blob([html], { type: "text/html" });
        const urlBlob = URL.createObjectURL(blob);

        // abrir como blob:xxxx igual que GN-Math
        const w = window.open(urlBlob, "_blank");
        if (!w) alert("Pop-up bloqueado");
    } catch(err){
        alert("Error cargando el juego: " + err.message);
    }
}
