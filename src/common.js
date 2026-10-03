// キーボード
document.body.addEventListener("keydown", e=>{e.preventDefault()});
document.addEventListener("keydown", async (e) =>{
    toggleKeyInput(e);
    if(!exe_event_flag) await events();
});
function toggleKeyInput(e) {
    if(!exe_event_flag) {
        if(e.key==KEY_CODE.left) key_input.left = true;
        if(e.key==KEY_CODE.right) key_input.right = true;
        if(e.key==KEY_CODE.up) key_input.up = true;
        if(e.key==KEY_CODE.down) key_input.down = true;
        if(key_input.left && key_input.up) key_input.up_left = true;
        if(key_input.right && key_input.up) key_input.up_right = true;
        if(key_input.left && key_input.down) key_input.down_left = true;
        if(key_input.right && key_input.down) key_input.down_right = true;
        if(e.key==KEY_CODE.apply) key_input.apply = true;
        if(e.key==KEY_CODE.cancel) key_input.cancel = true;
        if(e.key==KEY_CODE.sub) key_input.sub = true;
        if(e.key==KEY_CODE.esc) key_input.esc = true;
    }
    if(e.key==KEY_CODE.shift) key_input.shift = true;
    if(e.key==KEY_CODE.ctrl) key_input.ctrl = true;
}
document.addEventListener("keyup", e=>{
    if(e.key==KEY_CODE.left) key_input.left = false;
    if(e.key==KEY_CODE.right) key_input.right = false;
    if(e.key==KEY_CODE.up) key_input.up = false;
    if(e.key==KEY_CODE.down) key_input.down = false;
    if(!key_input.left || !key_input.up) key_input.up_left = false;
    if(!key_input.right || !key_input.up) key_input.up_right = false;
    if(!key_input.left || !key_input.down) key_input.down_left = false;
    if(!key_input.right || !key_input.down) key_input.down_right = false;
    if(e.key==KEY_CODE.shift) key_input.shift = false;
    if(e.key==KEY_CODE.ctrl) key_input.ctrl = false;
    if(e.key==KEY_CODE.apply) key_input.apply = false;
    if(e.key==KEY_CODE.cancel) key_input.cancel = false;
    if(e.key==KEY_CODE.sub) key_input.sub = false;
    if(e.key==KEY_CODE.esc) key_input.esc = false;
});

// スマホ用ボタン
let timeout_id_btn = undefined;
let interval_id_btn = undefined;
const LONGPRESS_START_MS = 300;
const LONGPRESS_INTERVAL_MS = 50;
document.body.addEventListener("touchstart", e => {e.preventDefault();});
document.body.addEventListener("touchend", e => {e.preventDefault();});
document.body.addEventListener("touchmove", e => {e.preventDefault();});
document.body.addEventListener("touchcancel", e => {e.preventDefault();});
btn_left.addEventListener("touchstart", async () => {
    await touchstartEL(btn_left, "left");
});
btn_left.addEventListener("touchend", async () => {
    await touchendEL(btn_left, "left");
});
btn_left.addEventListener("touchcancel", async () => {
    await touchendEL(btn_left, "left");
});
btn_right.addEventListener("touchstart", async () => {
    await touchstartEL(btn_right, "right");
});
btn_right.addEventListener("touchend", async () => {
    await touchendEL(btn_right, "right");
});
btn_right.addEventListener("touchcancel", async () => {
    await touchendEL(btn_right, "right");
});
btn_up.addEventListener("touchstart", async () => {
    await touchstartEL(btn_up, "up");
});
btn_up.addEventListener("touchend", async () => {
    await touchendEL(btn_up, "up");
});
btn_up.addEventListener("touchcancel", async () => {
    await touchendEL(btn_up, "up");
});
btn_down.addEventListener("touchstart", async () => {
    await touchstartEL(btn_down, "down");
});
btn_down.addEventListener("touchend", async () => {
    await touchendEL(btn_down, "down");
});
btn_down.addEventListener("touchcancel", async () => {
    await touchendEL(btn_down, "down");
});
btn_upleft.addEventListener("touchstart", async () => {
    await touchstartEL(btn_upleft, "up_left");
});
btn_upleft.addEventListener("touchend", async () => {
    await touchendEL(btn_upleft, "up_left");
});
btn_upleft.addEventListener("touchcancel", async () => {
    await touchendEL(btn_upleft, "up_left");
});
btn_upright.addEventListener("touchstart", async () => {
    await touchstartEL(btn_upright, "up_right");
});
btn_upright.addEventListener("touchend", async () => {
    await touchendEL(btn_upright, "up_right");
});
btn_upright.addEventListener("touchcancel", async () => {
    await touchendEL(btn_upright, "up_right");
});
btn_downleft.addEventListener("touchstart", async () => {
    await touchstartEL(btn_downleft, "down_left");
});
btn_downleft.addEventListener("touchend", async () => {
    await touchendEL(btn_downleft, "down_left");
});
btn_downleft.addEventListener("touchcancel", async () => {
    await touchendEL(btn_downleft, "down_left");
});
btn_downright.addEventListener("touchstart", async () => {
    await touchstartEL(btn_downright, "down_right");
});
btn_downright.addEventListener("touchend", async () => {
    await touchendEL(btn_downright, "down_right");
});
btn_downright.addEventListener("touchcancel", async () => {
    await touchendEL(btn_downright, "down_right");
});
btn_apply.addEventListener("touchstart", async () => {
    await touchstartEL(btn_apply, "apply");
});
btn_apply.addEventListener("touchend", async () => {
    await touchendEL(btn_apply, "apply");
});
btn_apply.addEventListener("touchcancel", async () => {
    await touchendEL(btn_apply, "apply");
});
btn_cancel.addEventListener("touchstart", async () => {
    await touchstartEL(btn_cancel, "cancel");
});
btn_cancel.addEventListener("touchend", async () => {
    await touchendEL(btn_cancel, "cancel");
});
btn_cancel.addEventListener("touchcancel", async () => {
    await touchendEL(btn_cancel, "cancel");
});
btn_sub.addEventListener("touchstart", async () => {
    await touchstartEL(btn_sub, "sub");
});
btn_sub.addEventListener("touchend", async () => {
    await touchendEL(btn_sub, "sub");
});
btn_sub.addEventListener("touchcancel", async () => {
    await touchendEL(btn_sub, "sub");
});
// イベントリスナー
async function touchstartEL(btn, input) {
    setButtonPressed(btn);
    await exeEventButton(input);

    clearButtonTI();
    timeout_id_btn = setTimeout(async () => {
        interval_id_btn = setInterval(async () => {
            await exeEventButton(input);
        }, LONGPRESS_INTERVAL_MS);
    }, LONGPRESS_START_MS);
}
async function touchendEL(btn, input) {
    setButtonNotPressed(btn);
    if(["up_left", "up_right", "down_left", "down_right"].includes(input))
        key_input.ctrl = false;
    key_input[input] = false;
    clearButtonTI();
}
async function exeEventButton(input) {
    if(!exe_event_flag) {
        if(["up_left", "up_right", "down_left", "down_right"].includes(input))
            key_input.ctrl = true;
        key_input[input] = true;
        await events();
    }
}
function clearButtonTI() {
    clearTimeout(timeout_id_btn);
    clearInterval(interval_id_btn);
    timeout_id_btn = undefined;
    interval_id_btn = undefined;
}
function setButtonNotPressed(button) {
    button.style.backgroundColor = "black";
    button.style.border = "solid 1px "+color_white;
    button.style.color = color_white;
}
function setButtonPressed(button) {
    button.style.backgroundColor = color_white;
    button.style.border = "solid 1px "+"black";
    button.style.color = "black";
}

// wait
const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

// SE再生
prevent_audio_flg = false;
function play_audio(audio) {
    if(prevent_audio_flg) return;
    audio.play();
}

// スマホ検出
function isPhone() {
    if(navigator.userAgent.match(/iPhone|Android.+Mobile/))
        return true;
    return false;
}

// ウィンドウサイズ
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
    if(!isPhone()) {
        setCanvasSizePC();
    }
    else{
        dispButton();
        setCanvasSizePhone();
    }
}

function setCanvasSizePC() {
    const canvas_width = window.innerHeight/2;
    const canvas_height = canvas_width;
    const body_width = document.body.clientWidth;

    button.style.display = "none";
    note.style.display = "block";
    note_hidden_flag = false;
    if((canvas_width+NOTE_WIDTH+INFO_WIDTH) > body_width) {
        note_hidden_flag = true;
        note.style.display = "none";
    }

    // canvas
    canvas.style.width = canvas_width+"px";
    canvas.style.height = canvas_height+"px";
    const canvas_scale = window.devicePixelRatio;
    canvas.width = Math.floor(canvas_width*canvas_scale);
    canvas.height = Math.floor(canvas_height*canvas_scale);
    ctx.scale(canvas_scale, canvas_scale);
    ctx.font = FONT_SIZE+"px "+FONT;
    ctx.fillStyle = color_white;
    ctx.textBaseline = "top";

    // note
    note.style.fontSize = FONT_SIZE*0.75+"px";
    note.style.width = NOTE_WIDTH+"px";
    note.style.paddingRight = PADDING+"px";
    // info
    info.style.fontSize = FONT_SIZE+"px";
    info.style.width = INFO_WIDTH+"px";
    info.style.paddingLeft = PADDING+"px";
    // inv
    inv.style.fontSize = FONT_SIZE+"px";
    inv.style.width = INFO_WIDTH+"px";
    inv.style.paddingLeft = PADDING+"px"; 
    inv.style.border = "solid 1px black";
    // log
    log.style.fontSize = FONT_SIZE+"px";
    log.style.width = canvas_width+"px";
    log.style.marginTop = MARGIN+"px";
    log.style.marginLeft = MARGIN+"px";
    // shop
    shop.style.fontSize = FONT_SIZE+"px";
    shop.style.width = canvas_width+"px";
    shop.style.marginTop = MARGIN+"px";
    shop.style.paddingLeft = PADDING+"px";
    shop.style.marginRight = MARGIN+"px";
    shop.style.border = "solid 1px black";
}

// ウィンドウサイズ（スマホ）
function setCanvasSizePhone(info_disp_flg = true) {
    let canvas_width = window.innerWidth;
    if(info_disp_flg) canvas_width = window.innerWidth * 2 / 3;
    const canvas_height = canvas_width;
    const canvas_scale = window.devicePixelRatio;
    FONT_SIZE = Math.floor(FONT_SIZE * 3 / 4);

    // canvas
    canvas.style.width = canvas_width+"px";
    canvas.style.height = canvas_height+"px";
    canvas.width = Math.floor(canvas_width*canvas_scale);
    canvas.height = Math.floor(canvas_height*canvas_scale);
    ctx.scale(canvas_scale, canvas_scale);
    ctx.font = FONT_SIZE+"px "+FONT;
    ctx.fillStyle = color_white;
    ctx.textBaseline = "top";
    
    // info
    info.style.fontSize = FONT_SIZE+"px";
    info.style.width = screen.width-canvas_width-5+"px";
    // inv
    inv.style.fontSize = FONT_SIZE+"px";
    info.style.width = screen.width-canvas_width-5+"px";
    inv.style.border = "solid 1px black";
    // sub3 (parent log,shop)
    sub3.style.flexDirection = "column";
    // log
    log.style.fontSize = FONT_SIZE+"px";
    log.style.width = canvas_width+"px";
    // shop
    shop.style.fontSize = FONT_SIZE+"px";
    shop.style.width = canvas_width+"px";
    shop.style.border = "solid 1px black";

    document.body.style.paddingTop = 0+"px";
}

// ボタン表示
function dispButton() {
    arrow_size = screen.width/6;
    
    // 全体
    button.style.visibility = "visible";
    button.style.position = "fixed";
    button.style.top = window.innerHeight-arrow_size*2+"px";

    // デザイン
    for(let b of btn) {
        setButtonNotPressed(b);
        b.style.width = arrow_size+"px";
        b.style.height = arrow_size+"px";
    }
    for(let ab of btn_arrow) {
        ab.style.width = arrow_size+"px";
        ab.style.height = arrow_size+"px";
        ab.style.minWidth = arrow_size+"px";
        ab.style.minHeight = arrow_size+"px";
    }
    
    // 方向位置
    arrow.style.width = arrow_size*3+"px";
    btn_left.style.position = "relative";
    btn_up.style.position = "relative";
    btn_down.style.position = "relative";
    btn_right.style.position = "relative";
    btn_upleft.style.position = "relative";
    btn_downleft.style.position = "relative";
    btn_upright.style.position = "relative";
    btn_downright.style.position = "relative";

    btn_up.style.bottom = arrow_size+"px";
    btn_down.style.top = arrow_size+"px";
    btn_down.style.right = arrow_size+"px";
    btn_right.style.right = arrow_size+"px";

    btn_upleft.style.bottom = arrow_size+"px";
    btn_upleft.style.right = arrow_size*4+"px";
    btn_downleft.style.top = arrow_size+"px";
    btn_downleft.style.right = arrow_size*5+"px";
    btn_upright.style.bottom = arrow_size+"px";
    btn_upright.style.right = arrow_size*4+"px";
    btn_downright.style.top = arrow_size+"px";
    btn_downright.style.right = arrow_size*5+"px";
}
