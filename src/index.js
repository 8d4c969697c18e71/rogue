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
        audio_apply(audio_apply);
        window.location.replace("./name.html");
    }
    else if(key_input.cancel) {
        audio_apply(audio_apply);
        window.location.replace("./main.html");
    }
}

function drawTitle() {
    const nodata_flg = new URLSearchParams(location.search).get("nodata") !== null
    const title_fig = [
        "",
        "Ｒｏｇｕｅっぽいやつ",
        "",
        "",
        "ｚ：はじめから　　　　　　　　　　",
        "ｘ：つづきから",
        "",
        "",
        "* セーブデータを保存するためにCookieを使用しています",
    ];
    if(nodata_flg) title_fig[5] += "　データがありません";
    else title_fig[5] += "　　　　　　　　　　";

    // 描画
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.textAlign = "center";
    for(let i=0; i<title_fig.length; i++) {
        if(i == 5 && nodata_flg) ctx.fillStyle = "gray";
        else ctx.fillStyle = "white";
        ctx.fillText(title_fig[i], canvas.clientWidth/2, FONT_SIZE*i);
    }
}