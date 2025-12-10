<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Cargando...</title>

<style>
body {
    background: #111;
    color: white;
    text-align: center;
    font-family: Arial;
    padding-top: 40px;
}
</style>

</head>
<body>

<h2>Cargando juego...</h2>

<script>
async function loadGame() {
    const params = new URLSearchParams(window.location.search);
    const gameURL = params.get("juego");

    if (!gameURL) {
        document.body.innerHTML = "<h3>Error: Falta parámetro 'juego'</h3>";
        return;
    }

    try {
        const response = await fetch(gameURL);
        const text = await response.text();

        const blob = new Blob([text], { type: "text/html" });
        const blobURL = URL.createObjectURL(blob);

        window.location.href = blobURL;

    } catch (error) {
        document.body.innerHTML = "<h3>Error cargando el juego</h3><br>" + error;
    }
}

loadGame();
</script>

</body>
</html>
