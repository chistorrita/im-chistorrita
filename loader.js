async function abrirJuegoCDN(juego){
  try{
    const url=`https://cdn.jsdelivr.net/gh/chistorrita/im-chistorrita@main/games/${juego}/index.html?t=${Date.now()}`;
    const respuesta=await fetch(url);
    if(!respuesta.ok) throw new Error("No se pudo cargar el juego");
    const texto=await respuesta.text();
    const w=window.open("about:blank","_blank");
    if(w){
      w.document.open();
      w.document.write(texto);
      w.document.close();
    } else { alert("La ventana fue bloqueada."); }
  }catch(e){
    alert("Error cargando el juego: "+e);
  }
}
