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
const LONGPRESS_START_MS = 300;
const LONGPRESS_INTERVAL_MS = 50;
const repeatTimers = new Map();
document.body.addEventListener("pointerdown", e => {e.preventDefault();});
document.body.addEventListener("pointerup", e => {e.preventDefault();});
document.body.addEventListener("pointercancel", e => {e.preventDefault();});
document.body.addEventListener("pointerleave", e => {e.preventDefault();});
setupKeyRepeat(btn_left, "left");
setupKeyRepeat(btn_right, "right");
setupKeyRepeat(btn_up, "up");
setupKeyRepeat(btn_down, "down");
setupKeyRepeat(btn_upleft, "up_left");
setupKeyRepeat(btn_upright, "up_right");
setupKeyRepeat(btn_downleft, "down_left");
setupKeyRepeat(btn_downright, "down_right");
setupKeyRepeat(btn_apply, "apply");
setupKeyRepeat(btn_cancel, "cancel");
setupKeyRepeat(btn_sub, "sub");
// イベントリスナー
function setupKeyRepeat(button, input) {
    let stopped = false;

    const stop = () => {
        stopped = true;
        disableKeyInput(input);

        const timer = repeatTimers.get(button);
        if (timer !== undefined) {
            clearTimeout(timer);
            repeatTimers.delete(button);
        }
    };

    button.addEventListener("pointerdown", async () => {
        stop();
        stopped = false;

        // 押した瞬間に1回実行
        await exeEventButton(input);

        if (stopped) return;

        // 長押し開始
        const startTimer = setTimeout(async function repeat() {
            if (stopped) return;

            await exeEventButton(input);

            if (stopped) return;

            const timer = setTimeout(repeat, LONGPRESS_INTERVAL_MS);
            repeatTimers.set(button, timer);
        }, LONGPRESS_START_MS);

        repeatTimers.set(button, startTimer);
    });

    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
}
async function exeEventButton(input) {
    if(!exe_event_flag) {
        if(["up_left", "up_right", "down_left", "down_right"].includes(input))
            key_input.ctrl = true;
        key_input[input] = true;
        await events();
    }
}
async function disableKeyInput(input) {
    if(["up_left", "up_right", "down_left", "down_right"].includes(input))
        key_input.ctrl = false;
    key_input[input] = false;
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
