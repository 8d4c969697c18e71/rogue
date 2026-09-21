document.body.addEventListener("keydown", e=>{e.preventDefault()});
document.addEventListener("keydown", async (e) =>{
    toggleKeyInput(e);
    if(!exeEventsFlg) await events();
});

function toggleKeyInput(e) {
    if(!exeEventsFlg) {
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

// ボタン
btn_z.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.apply = true;
        await events();
    }
});
btn_z.addEventListener("touchend", () =>{
    key_input.apply = false;
    setButtonNotPressed(btn_z);
});
btn_x.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.cancel = true;
        await events();
    }
});
btn_x.addEventListener("touchend", () =>{
    key_input.cancel = false;
    setButtonNotPressed(btn_x);
});
btn_c.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.sub = true;
        await events();
    }
});
btn_c.addEventListener("touchend", () =>{
    key_input.sub = false;
    setButtonNotPressed(btn_c);
});
btn_left.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.left = true;
        await events();
    }
});
btn_left.addEventListener("touchend", () =>{
    key_input.left = false;
    setButtonNotPressed(btn_left);
});
btn_up.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.up = true;
        await events();
    }
});
btn_up.addEventListener("touchend", () =>{
    key_input.up = false;
    setButtonNotPressed(btn_up);
});
btn_down.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.down = true;
        await events();
    }
});
btn_down.addEventListener("touchend", () =>{
    key_input.down = false;
    setButtonNotPressed(btn_down);
});
btn_right.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.right = true;
        await events();
    }
});
btn_right.addEventListener("touchend", () =>{
    key_input.right = false;
    setButtonNotPressed(btn_right);
});
btn_upleft.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.up_left = true;
        await events();
    }
});
btn_upleft.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.up_left = false;
    setButtonNotPressed(btn_upleft);
});
btn_downleft.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.down_left = true;
        await events();
    }
});
btn_downleft.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.down_left = false;
    setButtonNotPressed(btn_downleft);
});
btn_upright.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.up_right = true;
        await events();
    }
});
btn_upright.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.up_right = false;
    setButtonNotPressed(btn_upright);
});
btn_downright.addEventListener("touchstart", async () =>{
    setButtonPressed(btn_downright);
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.down_right = true;
        await events();
    }
});
btn_downright.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.down_right = false;
    setButtonNotPressed(btn_downright);
});

// wait
const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    ctx.font = FONT_SIZE+"px 'MS Gothic'";
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";

    // note
    note.style.width = NOTE_WIDTH+"px";
    note.style.paddingRight = PADDING+"px";
    // info
    info.style.width = INFO_WIDTH+"px";
    info.style.paddingLeft = PADDING+"px";
    // inv
    inv.style.paddingLeft = PADDING+"px"; 
    // log
    log.style.width = canvas_width+"px";
    log.style.height = FONT_SIZE*(LOG_RESERVE_SIZE+1)+"px";
    log.style.marginTop = MARGIN+"px";
    log.style.marginLeft = MARGIN+"px";
    // shop
    shop.style.width = canvas_width+"px";
    shop.style.marginTop = MARGIN+"px";
    shop.style.paddingLeft = PADDING+"px";
    shop.style.marginRight = MARGIN+"px";
}

// ウィンドウサイズ（スマホ）
function setCanvasSizePhone(info_disp_flg = true) {
    let canvas_width = window.innerWidth;
    if(info_disp_flg) canvas_width = window.innerWidth * 2 / 3;
    const canvas_height = canvas_width;
    const canvas_scale = window.devicePixelRatio;
    FONT_SIZE = 12;

    canvas.style.width = canvas_width+"px";
    canvas.style.height = canvas_height+"px";
    canvas.width = Math.floor(canvas_width*canvas_scale);
    canvas.height = Math.floor(canvas_height*canvas_scale);
    ctx.scale(canvas_scale, canvas_scale);
    ctx.font = FONT_SIZE+"px "+FONT;
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    
    info.style.fontSize = FONT_SIZE+"px";
    log.style.fontSize = FONT_SIZE+"px";
    inv.style.fontSize = FONT_SIZE+"px";
    info.style.width = screen.width-canvas_width-5+"px";
    log.style.width = canvas_width+"px";
    shop.style.display = "none";

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

function setButtonNotPressed(button) {
    button.style.backgroundColor = "black";
    button.style.border = "solid 1px "+"white";
    button.style.color = "white";
}

function setButtonPressed(button) {
    button.style.backgroundColor = "white";
    button.style.border = "solid 1px "+"black";
    button.style.color = "black";
}
