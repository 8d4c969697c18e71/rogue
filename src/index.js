window.addEventListener("load", loadCanvas);
window.addEventListener("resize", loadCanvas);

async function loadCanvas() {
    if(isPhone()) {
        note.style.display = "none";
        info.style.display = "none";
        inv.style.display = "none";
        setCanvasSizePhone(false);
    }
    drawTitle();
}

async function events() {
    if(key_input.apply) {
        window.location.replace("./name.html");
    }
    else if(key_input.cancel) {
        window.location.replace("./main.html");
    }
}

function drawTitle() {
    const nodata_flg = new URLSearchParams(location.search).get("nodata");
    const title_fig = [
        "",
        "Rogueっぽいやつ",
        "",
        "",
        "z: New Game",
        "x: Continue",
        "",
    ];

    // 描画
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    for(let i=0; i<title_fig.length-1; i++) {
        ctx.fillText(title_fig[i], canvas.clientWidth/2, CELL_HEIGHT*i);
    }

    if(nodata_flg !== null) {
        ctx.fillStyle = "yellow";
        ctx.fillText("データがありません", canvas.clientWidth/2, CELL_HEIGHT*title_fig.length);
    }
}