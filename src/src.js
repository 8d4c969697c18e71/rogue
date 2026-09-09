//==================================================INIT==================================================

window.onload = async function() {
    document.body.addEventListener("keydown", e=>{e.preventDefault()});

    // 画面サイズ
    if(!isPhone()) {
        setCanvasSize();
    }
    else{
        dispButton();
        setCanvasSizePhone();
    }

    // データロード
    if(await loadCookie()) {
        input_name_flag = false;
        floor_cnt = -1;
        await init();
    }
    else {
        if(!isPhone()) {
            input_name_flag = true;
            await inputName();
        }
        else {
            player.name = "あなた";
            input_name_flag = false;
            await initFirst();
        }
    }
}

window.addEventListener("resize", async () =>{
    if(!isPhone())
        setCanvasSize();
    else{
        setButton();
        setCanvasSizePhone();
    }
    if(input_name_flag) {
        await inputName();
        return;
    }
    if(!gameover_flag) {
        drawAll();
        drawNote();
    }
});

// スマホ検出
function isPhone() {
    if(navigator.userAgent.match(/iPhone|Android.+Mobile/))
        return true;
    return false;
}

// cookie
async function setCookie() {
    for(let key in player) {
        if(key != "map_sight")
            document.cookie = "player_" + key + "=" + encodeURIComponent(JSON.stringify(player[key])) + "; max-age=31536000";
    }
    for(let i=0; i<inventory.length; i++) {
        document.cookie = "inventory_" + i + "=" + encodeURIComponent(JSON.stringify(inventory[i])) + "; max-age=31536000";
    }
    cookie_date = DATE + " " + MONTH + " " + YEAR;
    document.cookie = "date=" + encodeURIComponent(JSON.stringify(cookie_date)) + "; max-age=31536000";
}

async function loadCookie() {
    const cookie = document.cookie;
    if(cookie.match(/player_.+=/)) {
        const data = decodeURIComponent(cookie).split("; ");
        let read_flg = {player: false, inventory: false};
        for(let idx in data) {
            let [key, val] = data[idx].split("=");

            try{
                if(val !== "undefined") val = JSON.parse(val);
                else val = undefined;
            }catch(err) {
                console.log("error: JSON.parse: "+val);
                return false;
            }
            
            if(key.match(/player_(.+)/)) {
                let pl_key = key.match(/player_(.+)/)[1];
                player[pl_key] = val;
                player.condition = [];
                read_flg.player = true;
            }
            else if(key.match(/inventory_([0-9]*)/)) {
                let inv_idx = key.match(/inventory_([0-9]*)/)[1];
                inventory[inv_idx] = Object.assign({}, val, ITEM_DATA.find(v=>v.id==val.id));
                read_flg.inventory = true;
            }
            else if(key == "date") {
                cookie_date = val;
            }
        }
        if(read_flg.player) return true;
        else return false;
    }
    return false;
}

// 初期化
async function initFirst() {
    initStatusAll();
    floor_cnt = -2;
    await init();
}

async function init() {
    await nextFloor();
    
    updateMap();
    drawMap();

    drawInfo();
    drawInv();
    log_reserve = [];
    drawLog();

    drawNote();
}

function initGroups() {
    item_group = [];
    enemy_group = [];
    trap_group = [];
    shop_group = [];
    npc_group = [];
}

//==================================================KEY==================================================

// 操作、各イベント
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
btn_z.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.apply = true;
        events();
    }
});
btn_z.addEventListener("touchend", () =>{
    key_input.apply = false;
});
btn_x.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.cancel = true;
        events();
    }
});
btn_x.addEventListener("touchend", () =>{
    key_input.cancel = false;
});
btn_c.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.sub = true;
        events();
    }
});
btn_c.addEventListener("touchend", () =>{
    key_input.sub = false;
});
btn_left.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.left = true;
        events();
    }
});
btn_left.addEventListener("touchend", () =>{
    key_input.left = false;
});
btn_up.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.up = true;
        events();
    }
});
btn_up.addEventListener("touchend", () =>{
    key_input.up = false;
});
btn_down.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.down = true;
        events();
    }
});
btn_down.addEventListener("touchend", () =>{
    key_input.down = false;
});
btn_right.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.right = true;
        events();
    }
});
btn_right.addEventListener("touchend", () =>{
    key_input.right = false;
});
btn_upleft.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.up_left = true;
        events();
    }
});
btn_upleft.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.up_left = false;
});
btn_downleft.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.down_left = true;
        events();
    }
});
btn_downleft.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.down_left = false;
});
btn_upright.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.up_right = true;
        events();
    }
});
btn_upright.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.up_right = false;
});
btn_downright.addEventListener("touchstart", () =>{
    if(!exeEventsFlg) {
        key_input.ctrl = true;
        key_input.down_right = true;
        events();
    }
});
btn_downright.addEventListener("touchend", () =>{
    key_input.ctrl = false;
    key_input.down_right = false;
});

const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

//==================================================EVENT==================================================

// イベント
async function events() {
    exeEventsFlg = true;
    // 名前入力
    if(input_name_flag) {
        await inputName();
        exeEventsFlg = false;
        return;
    }
    // ゲームオーバー
    else if(gameover_flag) {
        await gameoverEvent();
        turn_flag = false;
        drawGameover();
    }
    // 行動不能
    else if(player.cannot_action_flag) {
        turn_flag = true;
    }
    // 射撃
    else if(shot_flag) {
        turn_flag = await eventShot();
    }
    // 投擲
    else if(throwing_flag) {
        turn_flag = await eventThrowing();
    }
    // 魔法
    else if(magic_flag) {
        turn_flag = await eventMagic();
    }
    // UI
    else if(ui_flag) {
        turn_flag = await eventUI();
    }
    // ショップ
    else if(shop_flag) {
        turn_flag = eventShop();
    }
    // マップ
    else{
        turn_flag = await eventPlayer();
    }

    // 描画
    if(!gameover_flag) drawAll();

    // ターン経過
    if(turn_flag) {
        await eventEnemies();
        await eventEnv()
        turn_cnt++;
    }

    // 描画
    if(!gameover_flag) drawAll();

    exeEventsFlg = false;
}

// プレイヤーイベント
// @return: true: ターン経過
async function eventPlayer() {
    // 十字キー
    let kd;
    if(!key_input.ctrl) kd = KEY_DIRECTION;
    else kd = KEY_DIRECTION_DIAGONAL;
    for(let k in kd)
        if(key_input[k]) {
            let x = player.x + kd[k].x;
            let y = player.y + kd[k].y;
            if(isEnemy(x, y) && canDiagonal(player.x, player.y, kd[k].x, kd[k].y)) {
                let enemy = enemy_group.find(v=>(v.x==x && v.y==y));
                await attack(player, enemy);
                if(await isDead(enemy)) addExp(player, enemy.exp);
                return true;
            }
            else if(isShop(x, y)) {
                shop_using = shop_group.find(v=>v.x==x && v.y==y);
                let dialog = shop_using.dialogue_intro;
                if(dialog != "") {
                    if(shop_using.name != "") addLog(shop_using.name+"「"+dialog+"」");
                    else addLog(dialog);
                }
                audio_apply.play();
                shop_cursor = 0;
                shop_flag = true;
                shop_using.func_before();
                return true;
            }
            else if(isNPC(x, y)) {
                let npc = npc_group.find(v=>v.x==x && v.y==y);
                npc.func_before();
                let dialog = npc.dialogue[npc.dialogue_cnt];
                if(dialog != "") {
                    if(npc.name != "") addLog(npc.name+"「"+dialog+"」");
                    else addLog(dialog);
                }
                audio_apply.play();
                if(npc.dialogue_cnt<npc.dialogue.length-1)
                    npc.dialogue_cnt++;
                else if(npc.loop && npc.dialogue_cnt>=npc.dialogue.length-1)
                    npc.dialogue_cnt = 0;
                npc.func_after();
                return true;
            }
            else if(!player.cannot_move_flag) {
                if(!key_input.shift)
                    return await move(player, kd[k]);
                else{
                    await sprint(kd[k], kd == KEY_DIRECTION);
                    return false;
                }
            }
        }
    
    // apply
    if(key_input.apply) {
        if(isStair(player.x, player.y)) {
            audio_stair.play();
            await nextFloor();
        }
        else if(isPortal(player.x, player.y)) {
            audio_portal.play();
            floor_cnt = -1;
            backLv();
            await nextFloor();
        }
        else{
            if(checkTrap(player.x, player.y))
                addLog("罠を発見した");
            else
                addLog("待機した");
            audio_apply.play();
            return true;
        }
    }
    // cancel
    if(key_input.cancel) {
        audio_apply.play();
        //inv_cursor = 0;
        ui_flag = true;
        return false;
    }
    // sub
    if(key_input.sub) {
        if(!player.ammo) addLog("弾薬を装備していない");
        else if(bow_flag) {
            addLog(player.name+" は "+getItemData(player.weapon).name+" を構えた");
            audio_apply.play();
            shot_flag = true;
        }
        else{
            addLog(player.name+" は "+getItemData(player.ammo).name+" を振り被った")
            audio_apply.play();
            throwing_flag = true;
        }
        return false;
    }
}

// 移動
async function move(who, direction) {
    let new_x = who.x + direction.x;
    let new_y = who.y + direction.y;
    if(canMove(new_x,new_y) && canDiagonal(who.x, who.y, direction.x, direction.y)) {
        who.x = new_x;
        who.y = new_y;
        return true;
    }
    return false;
}

// 高速移動
async function sprint(direction, not_diagonal) {
    let log_before = log_reserve[log_reserve.length-1];

    // 移動
    await move(player, direction);
    await eventEnemies();
    await eventEnv();
    turn_cnt++;

    // 視界更新
    await wait(20);
    drawAll();

    // 停止
    if(log_reserve[log_reserve.length-1] != log_before)
        return;
    if(not_diagonal && !canMove(player.x+direction.x, player.y+direction.y))
        return;
    if(!not_diagonal && !canDiagonal(player.x, player.y, direction.x, direction.y))
        return;
    if(isDoor(player.x+direction.x, player.y+direction.y))
        return;
    if(isFrontObj(player, direction))
        return;
    if(isCrossing(player.x, player.y))
        return;

    await sprint(direction, not_diagonal);
}

// 進行方向調査
// 前方（斜め含む3マス）に何かあったらtrue
function isFrontObj(who, direction) {
    // 上下
    if(direction.x == 0) {
        for(let i=-1; i<=1; i++)
            if(isAnyObj(who.x+i, who.y+direction.y))
                return true;
    }
    // 左右
    else if(direction.y == 0) {
        for(let i=-1; i<=1; i++)
            if(isAnyObj(who.x+direction.x, who.y+i))
                return true;
    }
    // 斜め
    else{
        if(isAnyObj(who.x, who.y+direction.y))
            return true;
        if(isAnyObj(who.x+direction.x, who.y))
            return true;
    }
    return false;
}

function isAnyObj(x, y) {
    if(isItem(x, y) || isEnemy(x, y) || isNPC(x, y) || isShop(x, y))
        return true;
    return false;
}

// 交差点
function isCrossing(x, y) {
    if(map[y][x] != ID_MAP.path) return false;
    let path_cnt = 0;
    for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]])
        if(map[y+i][x+j] == ID_MAP.path) path_cnt++;
    if(path_cnt > 2) return true;
    return false;
}

//ジャンプ
function jump(who, direction, distance) {
    if(!canMove(who.x+direction.x*distance, who.y+direction.y*distance))
        return false;
    who.x = who.x+direction.x*distance;
    who.y = who.y+direction.y*distance;
    
    addLog(who.name+" は跳び退いた");
    audio_jump.play();
    return true;
}

// 攻撃
async function attack(from, to) {
    addLog(from.name+" の攻撃");

    let dmg;
    dmg = (from.atk+from.atk_offset)*(100-to.def-to.def_offset)/100;
    let rand = Math.random() * dmg/4 - dmg/8;
    dmg += rand;
    dmg = Math.floor(dmg);
    if(dmg<0) dmg = 0;

    // 受け流し
    for(let cond of to.condition)
        if(cond.id == 0x80) {
            to.condition.splice(to.condition.indexOf(cond), 1);
            to.cannot_action_flag = false;
            addLog(to.name+" は攻撃を受け流し 反撃した");
            await dealDmg(to, from, dmg);
            return;
        }

    await dealDmg(from, to, dmg);
    if("weapon" in from && from.weapon) await getItemData(from.weapon).func_attack(to);
    if("armor" in to && to.armor) await getItemData(to.armor).func_attacked(from);

    return;
}

// 射撃イベント
async function eventShot() {
    let ammo = getItemInventory(player.ammo);

    // 十字キー
    let kd;
    if(!key_input.ctrl) kd = KEY_DIRECTION;
    else kd = KEY_DIRECTION_DIAGONAL;
    for(let k in kd)
        if(key_input[k]) {
            shot_flag = false;
            let enemy = await shot(player, ammo, kd[k]);
            if(!(enemy===undefined) && await isDead(enemy)) addExp(player, enemy.exp);
            if(ammo.stack_num > 0) ammo.stack_num--;
            if(ammo.stack_num <= 0) {
                await equip(inventory.indexOf(ammo));
                log_reserve.pop();
                inventory.splice(inventory.indexOf(ammo), 1);
            }
            return true;
        }
    
    // cancel
    if(key_input.cancel) {
        addLog("構えを解いた");
        audio_cancel.play();
        shot_flag = false;
        return false;
    }
}

// 射撃
async function shot(who, ammo, direction) {
    let dst = straightRecursive(who.x, who.y, direction, ammo.range);

    addLog(who.name+" は "+ammo.name+" を放った");
    audio_shot.play();
    await animShot(who, dst, direction);

    if(isEnemy(dst.x+direction.x, dst.y+direction.y)) {
        let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
        await shotDmg(who, enemy, ammo);
        if("weapon" in who && who.weapon) await getItemData(who.weapon).func_attack(enemy);
        if("armor" in enemy && enemy.armor) await getItemData(enemy.armor).func_attacked(who);
        if(who == player) findPl(enemy);
        return enemy;
    }
    else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y) {
        await shotDmg(who, player, ammo);
        if("weapon" in who && who.weapon) await getItemData(who.weapon).func_attack(player);
        if("armor" in player && player.armor) await getItemData(player.armor).func_attacked(who);
        return player;
    }
    else{// 外した
        if(who == player) {
            if(!isItem(dst.x, dst.y))
                setItem(ammo.id, dst.x, dst.y);
            else{
                for(let s=1; s<SIZEX; s++)
                    for(let i=-s; i<=s; i++)
                        for(let j=-s; j<=s; j++)
                            if(canMove(dst.x+j, dst.y+i) && !isItem(dst.x+j, dst.y+i)) {
                                setItem(ammo.id, dst.x+j, dst.y+i);
                                addLog(ammo.name+" は床に落ちた");
                                return undefined;
                            }
            }
        }
    }
}

async function shotDmg(from, to, ammo) {
    let dmg;
    dmg = ((from.atk+from.atk_offset)/2+ammo.dmg)*(100-to.def-to.def_offset)/100;;
    let rand = Math.random() * dmg/4 - dmg/8;
    dmg += rand;
    dmg = Math.floor(dmg);
    if(dmg < 0) dmg = 0;

    await dealDmg(from, to, dmg);
}

// 投擲イベント
async function eventThrowing() {
    let item;
    if(ui_flag) item = inventory[inv_cursor];
    else item = getItemInventory(player.ammo);

    // 十字キー
    let kd;
    if(!key_input.ctrl) kd = KEY_DIRECTION;
    else kd = KEY_DIRECTION_DIAGONAL;
    for(let k in kd)
        if(key_input[k]) {
            throwing_flag = false;
            let enemy = await throwing(player, item, kd[k]);
            if(!(enemy===undefined) && await isDead(enemy)) addExp(player, enemy.exp);
            // インベントリから削除
            if(STACK_TYPE.includes(item.type)) {
                if(item.stack_num > 0) item.stack_num--;
                if(item.stack_num <= 0) {
                    if(isEquiped(item)) equip(inventory.findIndex(v=>v.id==player.ammo && v.equip_flag));
                    inventory.splice(inv_cursor, 1);
                }
            }
            else
                inventory.splice(inv_cursor, 1);

            //inv_cursor = -1;
            ui_flag = false;
            return true;
        }
    
    // cancel
    if(key_input.cancel) {
        addLog("投擲をやめた");
        audio_cancel.play();
        //inv_cursor = -1;
        throwing_flag = false;
        ui_flag = false;
        return false;
    }
}

// 投擲
async function throwing(who, item, direction) {
    let dst = straightRecursive(who.x, who.y, direction, THROWING_RANGE);

    addLog(who.name+" は "+item.name+" を投擲した");
    audio_shot.play();
    await animThrow(who, dst, direction, item);

    if(isEnemy(dst.x+direction.x, dst.y+direction.y)) {
        let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
        await throwDmg(who, enemy, item);
        if(who == player) findPl(enemy);
        return enemy;
    }
    else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y) {
        await throwDmg(who, player, item);
        return player;
    }
    else{    // アイテム化
        if(!isItem(dst.x, dst.y))
            setItem(item.id, dst.x, dst.y);
        else{
            for(let s=1; s<SIZEX; s++)
                for(let i=-s; i<=s; i++)
                    for(let j=-s; j<=s; j++)
                        if(canMove(dst.x+j, dst.y+i) && !isItem(dst.x+j, dst.y+i)) {
                            setItem(item.id, dst.x+j, dst.y+i);
                            addLog(item.name+" は床に落ちた");
                            return undefined;
                        }
        }
    }
}

async function throwDmg(from, to, item) {
    let dmg;
    if(item.type=="ammo" )
        dmg = Math.floor((item.dmg/3 + item.dmg * Math.random()) * (100-to.def-to.def_offset) / 100);
    else if(item.type=="weapon")
        dmg = Math.floor((item.base_dmg/5) * (100-to.def-to.def_offset) / 100);
    else
        dmg = Math.round(Math.random()) + 10;
    if(dmg < 0) dmg = 0;

    await dealDmg(from, to, dmg);
}

// 魔法イベント
async function eventMagic() {
    // 十字キー
    let kd;
    if(!key_input.ctrl) kd = KEY_DIRECTION;
    else kd = KEY_DIRECTION_DIAGONAL;
    for(let k in kd)
        if(key_input[k]) {
            magic_flag = false;
            let enemy = await getItemData(player.magic_using).func_cast(kd[k]);
            if(!(enemy===undefined) && await isDead(enemy)) addExp(player, enemy.exp);
            
            player.magic_using = undefined;
            ui_flag = false;
            //inv_cursor = -1;
            return true;
        }
    
    // cancel
    if(key_input.cancel) {
        addLog("構えを解いた");
        audio_cancel.play();
        magic_flag = false;
        player.magic_using = undefined;
        //inv_cursor = -1;
        ui_flag = false;
        return false;
    }
}

// 魔法
async function magic(who, value, direction) {
    let dst = straightRecursive(who.x, who.y, direction, MAGIC_RANGE);
    if(isEnemy(dst.x+direction.x, dst.y+direction.y)) {
        let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
        await magicDmg(who, enemy, value);
        if(who == player) findPl(enemy);
        return enemy;
    }
    else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y) {
        await magicDmg(who, player, value);
        return player;
    }
}

async function magicDmg(from, to, value) {
    let dmg;
    dmg = value;
    let rand = Math.random() * dmg/4 - dmg/8;
    dmg += rand;
    dmg = Math.round(dmg);
    if(dmg < 0) dmg = 0;
    
    await dealDmg(from, to, dmg);
}

// ダメージ
async function dealDmg(from, to, dmg) {
    addHP(to, -dmg);
    addLogSameLine(to.name+" に "+dmg+" のダメージ");
    audio_hit.play();
    await animBlink(to);

    // 状態異常
    for(let cond of to.condition) {
        // 睡眠
        if(cond.id == 0x01 && dmg > 0) {
            removeCondition(to, cond);
        }
        // 受け流し失敗
        if(cond.id == 0x80) {
            removeCondition(to, cond);
            log_reserve.pop();
            addLog(to.name+" は受け流しに失敗した");
            await dealDmg(from, to, Math.round(dmg*1.5));
            return;
        }
    }

    drawInfo();

    // fromへの処理
    if(from === undefined) return;
}

function straightRecursive(x, y, direction, range) {
    if(!canMove(x+direction.x, y+direction.y)
        || range <= 0
        || isDoor(x+direction.x, y+direction.y))
        return {x:x, y:y};
    return straightRecursive(x+direction.x, y+direction.y, direction, --range);
}

function straightRecursiveDiagonal(x, y, direction, range) {
    if(!canMove(x+direction.x, y+direction.y)
        || !canDiagonal(x, y, direction.x, direction.y)
        || range <= 0
        || isDoor(x+direction.x, y+direction.y))
        return {x:x, y:y};
    return straightRecursive(x+direction.x, y+direction.y, direction, --range);
}

function straightRecursiveAllMap(x, y, direction) {
    if(!canMove(x+direction.x, y+direction.y))
        return {x:x, y:y};
    return straightRecursiveAllMap(x+direction.x, y+direction.y, direction);
}

// UIイベント
async function eventUI() {
    // 上下
    if(key_input.up) {
        if(inv_cursor > 0)
            inv_cursor--;
        else
            inv_cursor = INVENTORY_SIZE - 1;
        return false;
    }
    if(key_input.down) {
        if(inv_cursor < INVENTORY_SIZE - 1)
            inv_cursor++;
        else
            inv_cursor = 0;
        return false;
    }
    // apply
    if(key_input.apply)
        if(inv_cursor<inventory.length && await useItem(inv_cursor)) {
            audio_apply.play();
            //inv_cursor = -1;
            ui_flag = false;
            return true;
        }
    // cancel
    if(key_input.cancel) {
        //inv_cursor = -1;
        ui_flag = false;
        return false;
    }
    // sub
    if(key_input.sub) {
        if(inv_cursor<inventory.length) {
            if(!isEquiped(inventory[inv_cursor])) {
                addLog(player.name+" は "+inventory[inv_cursor].name+" を振り被った");
                audio_apply.play();
                throwing_flag = true;
            }
            else addLog(inventory[inv_cursor].name+" は投擲できない");
        }
        return false;
    }
}

// ショップイベント
function eventShop() {
    // 上下
    if(key_input.up ) {
        if(shop_cursor > 0)
            shop_cursor--;
        else
            shop_cursor = shop_using.item.length - 1;
        return false;
    }
    if(key_input.down ) {
        if(shop_cursor < shop_using.item.length - 1)
            shop_cursor++;
        else
            shop_cursor = 0;
        return false;
    }
    // apply
    if(key_input.apply) {
        // buy
        if(shop_using.item[shop_cursor].price >= 0) {
            if(player.gold >= shop_using.item[shop_cursor].price) {
                if(addItem(shop_using.item[shop_cursor].id)) {
                    player.gold -= shop_using.item[shop_cursor].price;
                    shop_using.func_buy();
                    audio_coin.play();
                    return true;
                }
            }
            else addLog("金貨が足りない");
            return false;
        }
        // sell
        else{
            if(getItemInventory(shop_using.item[shop_cursor].id)) {
                let item_sell = getItemInventory(shop_using.item[shop_cursor].id);
                if(item_sell.equip_flag) {
                    addLog("装備中だ");
                    return false;
                }
                
                // 売った分削除
                if(STACK_TYPE.includes(item_sell.type)) {
                    if(item_sell.stack_num > 0) item_sell.stack_num--;
                    if(item_sell.stack_num <= 0) inventory.splice(inventory.indexOf(item_sell), 1);
                }
                else inventory.splice(inventory.indexOf(item_sell), 1);

                player.gold += -shop_using.item[shop_cursor].price;
                shop_using.func_buy();
                if(shop_using !== undefined && shop_using.item.length > 0
                && shop_cursor !== 0 && shop_using.item[shop_cursor] === undefined)
                    shop_cursor--;
                audio_coin.play();
                addLog(item_sell.name+" を売った");
                return true;
            }
            else
                addLog("持っていない");
            return false;
        }
    }
    // cancel
    if(key_input.cancel) {
        let dialog = shop_using.dialogue_outro;
        if(dialog != "") {
            if(shop_using.name != "") addLog(shop_using.name+"「"+dialog+"」");
            else addLog(dialog);
        }
        shop_using.func_after();
        setNotUseShop();
        
        return false;
    }
}

function setNotUseShop() {
    shop_using = undefined;
    shop_cursor = -1;
    shop_flag = false;
}

// ゲームオーバー
async function gameoverEvent() {
    if(key_input.apply || key_input.cancel || key_input.sub) {
        turn_cnt = 1;
        floor_cnt = -1;
        gameover_flag = false;
        initStatus();
        await nextFloor();
    }
}

function gameover() {
    log_reserve = [];
    addLog("ゲームオーバー");
    audio_death.play();
    drawGameover();
    drawInfo();
    drawInv();
    drawLog();
    gameover_flag = true;
}

//==================================================STATUS==================================================

// HP
function addHP(who, value) {
    who.hp += value;
    if(who.hp > (who.hp_max + who.hp_max_offset))
        who.hp = who.hp_max + who.hp_max_offset;
    else if(who.hp < 0)
        who.hp = 0;
}

// MP
function addMP(who, value) {
    who.mp += value;
    if(who.mp > (who.mp_max + who.mp_max_offset))
        who.mp = who.mp_max + who.mp_max_offset;
    else if(who.mp < 0)
        who.mp = 0;
}

// 空腹度
// PL専用
function addHung(value) {
    player.hung += value;
    if(player.hung > (player.hung_max + player.hung_max_offset))
        player.hung = player.hung_max + player.hung_max_offset;
    if(player.hung < 0)
        player.hung = 0;
}

// 経験値獲得
function addExp(who, value) {
    who.exp += value;
    addLogSameLine(value+" の経験値を得た");
    lvUp(who);
}

// 全回復
function fullRecovery(who) {
    removeCondition(who);
    who.hp = who.hp_max + who.hp_max_offset;
    who.mp = who.mp_max + who.mp_max_offset;
    if(who == player) player.hung = player.hung_max + player.hung_max_offset;
}

// レベルアップ
function lvUp(who) {
    if(who.exp >= who.next_exp) {
        who.lv++;
        who.next_exp = who.next_exp + who.lv * 15;

        for(let st in who.lvup) who[st] += who.lvup[st];
        
        // atk再計算
        if(who == player) recalcStatus(who);

        addLog(who.name+" はレベルが上がった");
        audio_lvup.play();
        lvUp(who);

        drawInfo();

        return true;
    }
    return false;
}

// ステータスからatk計算
async function calcAtkFromStatus(status, rate, offset = 0) {
    player.atk += Math.floor(Math.sqrt(100 * player[status]) / Math.sqrt(100 * 100) * rate * offset);
}

// atk再計算
async function recalcStatus(who) {
    who.atk = getItemData(who.job).atk;
    const EQ_TYPE = [...EQUIP_TYPE, ...["ring1", "ring2"]];
    for(let idx in EQ_TYPE) {
        const eq_id = who[EQ_TYPE[idx]];
        if(eq_id !== undefined && getItemData(eq_id).func_recalc !== undefined) getItemData(eq_id).func_recalc();
    }
}

// lv1に戻す
function backLv() {
    let job = getItemData(player.job);

    player.hp = job.hp;
    player.hp_max = job.hp_max;
    player.mp = job.mp;
    player.mp_max = job.mp_max;
    player.str = job.str;
    player.dex = job.dex;
    player.int = job.int;
    player.fth = job.fth;
    player.atk = job.atk;
    //player.def = job.def;
    player.hung_rate = job.hung_rate;
    player.hp_regen_rate = job.hp_regen_rate;
    player.mp_regen_rate = job.mp_regen_rate;
    player.sight_range = job.sight_range;
    player.job_name = job.name.substring(0, job.name.length-3);
    player.lvup = job.lvup;

    player.lv = 1;
    player.exp = 0;
    player.next_exp = 20;
    player.hung = 100;
    player.hung_max = 100;

    recalcStatus(player);
}

// 全ステ初期化
function initStatusAll() {
    player.hp_max_offset = 0;
    player.mp_max_offset = 0;
    player.hung_max_offset = 0;
    player.hung_rate_offset = 0;
    player.hp_regen_rate_offset = 0;
    player.mp_regen_rate_offset = 0;
    player.sight_range_offset = 0;
    player.condition = [];
    player.weapon = undefined;
    player.ammo = undefined;
    player.armor = undefined;
    player.ring1 = undefined;
    player.ring2 = undefined;
    inventory = [];
    player.gold = 15;

    player.job = 0xf00;
    backLv();
    
    player.def = getItemData(player.job).def;
}

// 初期化（死亡時用）
function initStatus() {
    player.condition = [];
    player.weapon = undefined;
    player.ammo = undefined;
    player.armor = undefined;
    player.ring1 = undefined;
    player.ring2 = undefined;
    inventory = [];

    backLv();
}

// 状態異常追加
async function setCondition(who, id) {
    let cond = CONDITION_DATA.find(v=>v.id==id);
    
    if(!cond || !("condition" in who)) {
        console.warn("setCondition: id or who.condtion not found");
        return false;
    }
    for(let c of who.condition)
        if(c.id == id) {
            console.log("setCondition: already have "+cond.name+".")
            return false;
        }

    let c = Object.assign({}, cond);
    who.condition.push(c);
    await who.condition[who.condition.length-1].func_be(who);
    return true;
}

// 状態異常除外
async function removeCondition(who, cond = "all") {
    if(cond != "all") {
        await cond.func_recovery(who);
        who.condition.splice(who.condition.indexOf(cond), 1);
    }
    else {
        while(who.condition.length > 0) {
            await who.condition[0].func_recovery(who);
            log_reserve.pop();
            who.condition.shift();
        }
    }
}

// ターン数指定
async function setConditionTurn(who, id, turn) {
    if(!await setCondition(who, id)) return false;
    who.condition[who.condition.length-1].turn = turn;
    return true;
}

// 状態異常経過
async function progressCondition(who) {
    for(let cond of who.condition) {
        if(cond.turn<=0) {
            await removeCondition(who, cond);
        }
        else{
            await cond.func_during(who);
            cond.turn--;
        }
    }
}

// 死亡判定
async function isDead(who) {
    if(who.hp <= 0) {
        if(who == player)
            gameover();
        else{
            await who.func_died();
            await removeEnemy(who);
        }
        return true;
    }
    return false;
}

//==================================================ITEM==================================================

function getItemData(id) {
    return ITEM_DATA.find(v=>v.id == id);
}

function getItemInventory(id) {
    return inventory.find(v=>v.id == id);
}

// アイテム使用
async function useItem(index) {
    if(EQUIP_TYPE.includes(inventory[index].type)) {
        return await equip(index);
    }
    else{
        return await inventory[index].func();
    }
}

// プレイヤー装備切り替え
async function equip(index) {
    let equip_item = inventory[index];
    // 装備する
    if(!(equip_item.equip_flag)) {
        // 装備欄チェック
        if(player[equip_item.type]) {
            addLog("装備スロットが埋まっている");
            return false;
        }
        // 指輪
        else if(player.ring1 && player.ring2) {
            addLog("装備スロットが埋まっている");
            return false;
        }

        // 装備スロット更新
        equip_item.equip_flag = true;
        if(equip_item.type == "ring") {
            if(!player.ring1 && player.ring2)
                player.ring1 = equip_item.id;
            else if(player.ring1 && !player.ring2)
                player.ring2 = equip_item.id;
            else
                player.ring1 = equip_item.id;
        }
        else
            player[equip_item.type] = equip_item.id;
        
        await equip_item.func_recalc();
        await equip_item.func_equip(player);

        addLog(equip_item.name+" を装備した");

        return true;
    }
    // 外す
    else{
        // 装備スロット更新
        equip_item.equip_flag = false;
        if(equip_item.type == "ring") {
            if(player.ring1 == equip_item)
                player.ring1 = undefined;
            else if(player.ring2 == equip_item)
                player.ring2 = undefined;
        }
        else
            player[equip_item.type] = undefined;
        
        await recalcStatus(player);
        await equip_item.func_unequip(player);

        addLog(equip_item.name+" を外した");
        return true;
    }
}

// アイテム取得
function addItem(id) {
    let item = getItemData(id);
    // スタックアイテム
    if(item.type=="stack") {
        if(inventory.length < INVENTORY_SIZE) {
            for(let i=0; i<item.num; i++) {
                addItem(item.item_id);
                log_reserve.pop();
            }
            addLog(item.name+" を入手");
            return true;
        }
        for(let i of inventory) {
            if(i.id == item.item_id && i.stack_num < STACK_MAX) {
                if(i.stack_num + item.num <= STACK_MAX) {
                    for(let i=0; i<item.num; i++) {
                        addItem(item.item_id);
                        log_reserve.pop();
                    }
                    addLog(item.name+" を入手");
                    return true;
                }
                else{
                    addLog("持ちきれない");
                    return false;
                }
            }
        }
    }

    let it = Object.assign({}, item);

    // スタック可能アイテム
    if(STACK_TYPE.includes(item.type)) {
        let index = getStackIndex(item);
        if(!(index===undefined)) {
            inventory[index].stack_num++;
            addLog(item.name+" を入手");
            return true;
        }
        Object.assign(it, {stack_num: 1});
    }

    // 所持数オーバー
    if(inventory.length >= INVENTORY_SIZE) {
        addLog("持ちきれない");
        return false;
    }

    // 装備品
    if(EQUIP_TYPE.includes(item.type))
        Object.assign(it, {equip_flag: false});
    
    inventory.push(it);
    addLog(item.name+" を入手");
    return true;
}

// スタックアイテム加算
function getStackIndex(item) {
    for(let i of inventory)
        if(i.id==item.id && i.stack_num < STACK_MAX) {
            return inventory.indexOf(i);    // スタックできるアイテムがある
        }
    return undefined;
}

// アイテム設置
function setItem(id, x, y) {
    let item = Object.assign({}, getItemData(id), {x: x, y: y});
    item_group.push(item);
}

// マップ内アイテム
function setItemGroup() {
    let num = Math.floor(Math.random() * (room_num*1.5 - room_num*1) + room_num*1);
    let table = [];
    
    if(Math.floor((floor_cnt-1)/3) in ITEM_TABLE)
        table = ITEM_TABLE[Math.floor((floor_cnt-1)/3)];
    else
        table = ITEM_TABLE[0];
    if(table.length==0) return;

    for(let i=0; i<num; i++) {
        const item_id = Math.floor(Math.random() * table.length);
        const [x, y] = setRandomXY();
        
        setItem(table[item_id], x, y);
    }
}

function setRandomXY() {
    const x = Math.floor(Math.random() * (SIZEX-1 - 1) + 1);
    const y = Math.floor(Math.random() * (SIZEY-1 - 1) + 1);

    if(!canMove(x, y)
        || map[y][x] != ID_MAP.room
        || isItem(x, y)
        || isTrap(x, y)
        || isEnemy(x, y))
        return setRandomXY();
    return [x, y];
}

// アイテムの有無
function isItem(x, y) {
    for(let i in item_group)
        if(x==item_group[i].x && y==item_group[i].y)
            return true;
    return false;
}

// 装備中
function isEquiped(item) {
    if(item.equip_flag) {
        return true;
    }
    return false;
}

function getSkillData(id) {
    return SKILL_DATA.find(v=>v.id == id);
}

//==================================================ENVIRONMENT==================================================

// 環境イベント
async function eventEnv() {
    // 自然回復
    if(turn_cnt % (player.hp_regen_rate + player.hp_regen_rate_offset) == 0)
        addHP(player, 10);
    if(turn_cnt % (player.mp_regen_rate + player.mp_regen_rate_offset) == 0)
        addMP(player, 2);

    // 空腹度
    if(player.hung <= 0) {
        addLog("飢えが "+player.name+" を蝕む");
        await dealDmg(undefined, player, -15);
        audio_hit.play();
    }
    if(!safe_flag && turn_cnt % player.hung_rate == 0) {
        if(player.hung > 0) {
            addHung(-1);
            if(player.hung == 25)
                addLog("空腹を感じる");
            if(player.hung == 10)
                addLog("耐え難い空腹");
        }
    }

    // 罠
    for(let t of trap_group)
        if(t.x == player.x && t.y == player.y) {
                await t.func(player);
                trap_group.splice(trap_group.indexOf(t), 1);
            }

    // 状態異常
    await progressCondition(player);

    // 死亡判定
    await isDead(player)

    // エネミー
    for(let enemy of enemy_group) {
        // 状態異常
        await progressCondition(enemy);

        // 死亡判定
        await isDead(enemy);
    }

    await isDead(player);

    // 階段に乗ってる
    if(isStair(player.x, player.y)) {
        addLog("階段 (降りる:z)");
    }
    // ポータルに乗ってる
    if(isPortal(player.x, player.y)) {
        addLog("帰還ポータル (入る:z)");
    }
    
    // アイテム取得
    for(let i of item_group)
        if(i.x == player.x && i.y == player.y) {
            if(i.id==0x000) {
                player.gold += 5;
                audio_apply.play();
                addLog("金貨5枚 を入手");
                item_group.splice(item_group.indexOf(i), 1);
            }
            else if(addItem(i.id)) {
                audio_apply.play();
                item_group.splice(item_group.indexOf(i), 1);
            }
        }
}

// 階層移動
async function nextFloor() {
    addLog("次の階層へ移動した");

    initMaps();
    initGroups();

    stair_pos.x = undefined;
    stair_pos.y = undefined;
    portal_pos.x = undefined;
    portal_pos.y = undefined;

    turn_cnt = 1;
    floor_cnt++;
    clairvoyance_flag = false;

    // TODO: テスト用
    //generateUniqueMap(unique_map.find(v=>v.id=="test"));return;

    if(um = unique_map.find(v=>v.id==floor_cnt)) { // 固有マップ
        generateUniqueMap(um);
        
        if(um.safe_flag) safe_flag = true;
        else safe_flag = false;
    }
    else if(floor_cnt%10 == 0) {    // 帰還ポータル階
        generateUniqueMap(unique_map.find(v=>v.id=="return"));
        safe_flag = true;
    }
    else{
        generateMap();

        let [x,y] = setRandomXY();
        setStair(x, y);
        setTrapGroup();
        setItemGroup();

        setPlayerPos();
        await setEnemyGroup();

        safe_flag = false;
    }
}

// 階段
function setStair(x, y) {
    stair_pos.x = x;
    stair_pos.y = y;
}

function isStair(x, y) {
    if(stair_pos.x==x && stair_pos.y==y)
        return true;
    return false;
}

// ポータル
function setPortal(x, y) {
    portal_pos.x = x;
    portal_pos.y = y;
}

function isPortal(x, y) {
    if(portal_pos.x==x && portal_pos.y==y)
        return true;
    return false;
}

// ショップ配置
function setShop(id, x, y) {
    let shop = SHOP_DATA.find(v=>v.id==id);
    let items = [];

    if(shop.random_flag) {
        if(shop.item_num > shop.item_table.length)
            shop.item_num = shop.item_table.length;

        for(let n=0; n<shop.item_num; n++) {
            let i = shop.item_table[Math.floor(Math.random()*shop.item_table.length)];
            if(items.find(v=>v.id==i.id)) {
                n--;
                continue;
            }
            items.push(getItemData(i.id));
        }
    }
    else
        for(let i of shop.item_table) {
            items.push(getItemData(i.id));
        }

    let s = Object.assign({}, shop, {x: x, y: y, item: items});
    shop_group.push(s);
}

function isShop(x, y) {
    for(let s in shop_group)
        if(shop_group[s].x == x && shop_group[s].y == y)
            return true;

    return false;
}

function setSellList(item_list) {
    for(let idx in inventory) {
        if(item_list.length == 0 || item_list.find(v=>v.id==inventory[idx].id) === undefined) {
            let item = inventory[idx];
            item_list.push(Object.assign({}, item, {price: -(inventory[idx].price)}));
        }
    }
}

// NPC配置
function setNPC(id, x, y) {
    let npc = Object.assign({}, NPC_DATA.find(v=>v.id==id), {x: x, y: y});
    npc_group.push(npc);
}

function isNPC(x, y) {
    for(let n in npc_group)
        if(npc_group[n].x == x && npc_group[n].y == y)
            return true;

    return false;
}

// 罠
function setTrap(id, x, y) {
    let trap = Object.assign({}, TRAP_DATA.find(v=>v.id==id), {x: x, y: y, visible: false});
    trap_group.push(trap);
}

// マップ内罠
function setTrapGroup() {
    let num = Math.floor(Math.random() * (room_num*2 - 1) + 1);
    let table = [];
    
    if(Math.floor((floor_cnt-1)/3) in TRAP_TABLE)
        table = TRAP_TABLE[Math.floor((floor_cnt-1)/3)];
    else
        table = TRAP_TABLE[0];
    if(table.length==0) return;

    for(let i=0; i<num; i++) {
        const item = Math.floor(Math.random() * table.length);
        const [x,y] = setRandomXY();
        
        setTrap(table[item], x, y)
    }
}

// 罠の有無
function isTrap(x, y) {
    for(let t of trap_group)
        if(x==t.x && y==t.y)
            return t;
    return undefined;
}

// 罠の看破
function checkTrap(x, y) {
    let ret = false;
    for(let i=-1; i<=1; i++)
        for(let j=-1; j<=1; j++)
            if(t = isTrap(x+j, y+i)) {
                t.visible = true;
                ret = true;
            }
    return ret;
}

// 千里眼
function clairvoyance() {
    clairvoyance_flag = true;
    for(let i=0; i<SIZEY; i++)
        for(let j=0; j<SIZEX; j++)
            player.map_sight[i][j] = true;
}

//==================================================ENEMY==================================================

function getEnemyData(id) {
    return ENEMY_DATA.find(v=>v.id == id);
}

// エネミーイベント
async function eventEnemies() {
    for(let enemy of enemy_group) {
        // 死亡判定
        if(await isDead(enemy)) continue;

        // 行動不能
        if(enemy.cannot_action_flag) continue;
        
        // speed回行動
        for(let cnt=0; cnt<enemy.speed; cnt++) {
            await eventEnemy(enemy);
            drawAll();
        }
        await isDead(player);
    }
}

async function eventEnemy(enemy) {
    // 発見
    initMap(enemy.map_sight, false);
    getSight(enemy);
    if(enemy.map_sight[player.y][player.x])
        findPl(enemy);
    else if(enemy.berserk_flag && !enemy.chase_flag) {
        for(let other_enemy of enemy_group) {
            if(enemy.map_sight[other_enemy.y][other_enemy.x])
                findBerserk(enemy);
        }
    }
    else
        enemy.chase_count--;

    // 追跡終了
    if(enemy.chase_count < 0) {
        enemy.chase_flag = false;
        enemy.berserk_chase_flag = false;
    }

    // 発見済み
    if(enemy.chase_flag) {
        // スキル
        for(let skill of enemy.skill) {
            if(!(Math.floor(Math.random()+skill.chance))) continue;
            if(await skill.func(enemy, player)) return;
        }

        // プレイヤーへ攻撃
        for(let d in KEY_DIRECTION) {
            let x = enemy.x + KEY_DIRECTION[d].x;
            let y = enemy.y + KEY_DIRECTION[d].y;
            if(x == player.x && y == player.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION[d].x, KEY_DIRECTION[d].y)) {
                await attack(enemy, player);
                return;
            }
        }
        for(let d in KEY_DIRECTION_DIAGONAL) {
            let x = enemy.x + KEY_DIRECTION_DIAGONAL[d].x;
            let y = enemy.y + KEY_DIRECTION_DIAGONAL[d].y;
            if(x == player.x && y == player.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION_DIAGONAL[d].x, KEY_DIRECTION_DIAGONAL[d].y)) {
                await attack(enemy, player);
                return;
            }
        }

        // プレイヤー追跡
        if(!enemy.cannot_move_flag) {
            await moveEnemyChase(enemy, player);
            return;
        }
    }
    // 発見済み(くびかりぞく)
    else if(enemy.berserk_chase_flag) {
        for(let other_enemy of enemy_group) {
            // スキル
            for(let skill of enemy.skill) {
                if(!(Math.floor(Math.random()+skill.chance))) continue;
                if(await skill.func(enemy, other_enemy)) return;
            }

            if(enemy.berserk_flag) {
                if(other_enemy === enemy) continue; // 保険

                for(let d in KEY_DIRECTION) {
                    let x = enemy.x + KEY_DIRECTION[d].x;
                    let y = enemy.y + KEY_DIRECTION[d].y;
                    if(x == other_enemy.x && y == other_enemy.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION[d].x, KEY_DIRECTION[d].y)) {
                        await attack(enemy, other_enemy);
                        if(await isDead(other_enemy)) addExp(enemy, other_enemy.exp);
                        return;
                    }
                }
                for(let d in KEY_DIRECTION_DIAGONAL) {
                    let x = enemy.x + KEY_DIRECTION_DIAGONAL[d].x;
                    let y = enemy.y + KEY_DIRECTION_DIAGONAL[d].y;
                    if(x == other_enemy.x && y == other_enemy.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION_DIAGONAL[d].x, KEY_DIRECTION_DIAGONAL[d].y)) {
                        await attack(enemy, other_enemy);
                        if(await isDead(other_enemy)) addExp(enemy, other_enemy.exp);
                        return;
                    }
                }
            }

            // プレイヤー追跡
            if(!enemy.cannot_move_flag) {
                await moveEnemyChase(enemy, other_enemy);
                return;
            }
        }
    }
    // 未発見
    else{
        // 移動
        if(!enemy.cannot_move_flag) {
            // 巡回
            await moveEnemyTravel(enemy);
        }
    }
}

// 視界取得
function getSight(who) {
    for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        // 部屋
        if(isRoom(who.x+j, who.y+i)) {
            let room_xy = [];
            getRoomXY(who.x+j, who.y+i, room_xy);
            for(let xy of room_xy)
                who.map_sight[xy.y][xy.x] = true;
        }
        // 通路
        getSightPath(who.x, who.y, (who.sight_range+who.sight_range_offset), who.map_sight);
    }
}

// 通路の視界
function getSightPath(x, y, sight_range, map_sight) {
    map_sight[y][x] = true;
    for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        if(isInMap(x+j,y+i) 
            && map[y+i][x+j] != ID_MAP.none 
            && !map_sight[y+i][x+j] 
            && sight_range > 0
            && !isRoom(x, y)
            && !isRoom(x+j, y+i)) {
            map_sight[y+i][x+j] = true;
            getSightPath(x+j, y+i, sight_range-1, map_sight);
        }
    }
}

function findPl(who) {
    who.chase_flag = true;
    who.berserk_chase_flag = false;
    who.chase_count = who.chase_limit;
}

function findBerserk(who) {
    who.berserk_chase_flag = true;
    who.chase_count = who.chase_limit;
}

// エネミー移動（追跡）
async function moveEnemyChase(who, to) {
    let route
    route = astar(who.x, who.y, to.x, to.y, who.distance, who.escape_flag);    
    let dir = {
        x: route[route.length-1].x - who.x,
        y: route[route.length-1].y - who.y
    };
    // debug
    //for(let r of route)
    //    map_draw[r.y][r.x] = "√";

    return await move(who, dir);
}

// A-star
function astar(start_x, start_y, dst_x, dst_y, distance, escape_flag) {
    let node = [];

    // 初期コスト計算
    let actual_cost = 0;
    let heuristic_cost = Math.max(Math.abs(dst_x-start_x), Math.abs(dst_y-start_y));
    node.push({x:start_x, y:start_y, status:"open", a_cost:actual_cost, h_cost:heuristic_cost, parent:undefined});
    
    astarRecursive(node, start_x, start_y, dst_x, dst_y, distance, escape_flag);

    let dst_node = node[node.length-1];
    let route = [];
    getRoute(route, node, dst_node);
    return route;
}

function astarRecursive(node, x, y, dst_x, dst_y, distance, escape_flag) {
    // close
    node.find(v=>(v.x==x && v.y==y)).status = "closed";

    // open
    let movement_cost;
    for(let [i, j] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,-1],[-1,1]]) {
        // 目的地到達判定
        if(x+j == dst_x && y+i == dst_y && canDiagonal(x, y, j, i)) {
            node.push({x:x+j, y:y+i, status:"dst", parent:{x:x, y:y}});
            return;
        }
        // 探索
        else if((canMove(x+j, y+i) || !canMove(x+j, y+i) && isEnemy(x+j, y+i))
            && (canDiagonal(x, y, j, i))
            && !(node.find(v=>(v.x==x+j && v.y==y+i)))) {
            // 移動コスト
            if(Math.floor(((x+j-dst_x)**2+(y+i-dst_y)**2)/2) < distance)
                movement_cost = 64;
            else if(x+j == dst_x || y+i == dst_y)
                movement_cost = 1;
            else if({x:dst_x, y:dst_y} == straightRecursiveAllMap(x, y, {x:j, y:i}))
                movement_cost = 1;
            else
                movement_cost = 3;

            let a_cost = node.find(v=>(v.x==x && v.y==y)).a_cost + movement_cost;
            let h_cost = Math.max(Math.abs(dst_x-(x+j)), Math.abs(dst_y-(y+i)));
            node.push({x:x+j, y:y+i, status:"open", a_cost:a_cost, h_cost:h_cost, parent:{x:x,y:y}});
        }
    }

    // 基準ノード選出
    let next_node = {cost: SIZEX+SIZEY};
    for(let n of node) {
        // 追跡
        if(!escape_flag) {
            if(n.status == "open" 
                && (n.a_cost + n.h_cost) < next_node.cost) {
                next_node.x = n.x;
                next_node.y = n.y;
                next_node.cost = n.a_cost + n.h_cost;
            }
        }
        // 逃亡
        else{
            if(n.status == "open" 
                && (n.a_cost + n.h_cost) > next_node.cost) {
                next_node.x = n.x;
                next_node.y = n.y;
                next_node.cost = n.a_cost + n.h_cost;
            }
        }
    }
        
    if(next_node.x === undefined || next_node.y === undefined) {
        // debug
        //console.log("aster: cannot reach");
        return;
    }
    
    astarRecursive(node, next_node.x, next_node.y, dst_x, dst_y, escape_flag);
    return;
}

function getRoute(route, node, n) {
    if(n.parent === undefined)
        return route;
    route.push(n);
    route = getRoute(route, node, node.find(v=>(v.x==n.parent.x && v.y==n.parent.y)));
}

// エネミー移動（巡回）
async function moveEnemyTravel(enemy) {
    if(enemy.travel_route.length < 1    // ルート未設定
    || (enemy.x==enemy.travel_x && enemy.y==enemy.travel_y)) {    // 目的地到達
        setNextTravelRoom(enemy);
        enemy.travel_route = astar(enemy.x, enemy.y, enemy.travel_x, enemy.travel_y, 0, false);
    }
    let next_xy = enemy.travel_route[enemy.travel_route.length-1];

    // ルート閉塞
    if(!canMove(next_xy.x, next_xy.y)) {
        setNextTravelRoom(enemy);
        enemy.travel_route = astar(enemy.x, enemy.y, enemy.travel_x, enemy.travel_y, 0, false);
        next_xy = enemy.travel_route[enemy.travel_route.length-1];
    }

    let dir = {
        x: next_xy.x - enemy.x,
        y: next_xy.y - enemy.y
    };
    enemy.travel_route.pop();

    // debug
    //for(let r of route)
    //    map_draw[r.y][r.x] = "√";

    return await move(enemy, dir);
}

function setNextTravelRoom(enemy) {
    let room_xy = [];
    getRoomXY(enemy.x, enemy.y, room_xy);

    let next_room_x;
    let next_room_y;
    while(1) {
        next_room_x = Math.floor(Math.random()*SIZEX);
        next_room_y = Math.floor(Math.random()*SIZEY);
        let break_flag = true;
        for(let xy of room_xy)
            if(next_room_x==xy.x && next_room_y==xy.y
                || !canMove(next_room_x, next_room_y) || map[next_room_y][next_room_x]!=ID_MAP.room) {
                break_flag = false;
                break;
            }
        if(break_flag) break;
    }
    enemy.travel_x = next_room_x;
    enemy.travel_y = next_room_y;

    // debug
    //console.log("setNextTravelRoom: "+enemy.name+" set next travel point.");
    //map_draw[enemy.travel_y][enemy.travel_x] = "㊦";
}

// エネミー移動（ランダム）
async function moveEnemyRand(enemy) {
    let rand_diagonal = Math.floor( Math.random() * 2);
    let rand_dir = Math.floor( Math.random() * 4);
    let dir_array = ["left", "right", "up", "down"];
    let dir_array_diagonal = ["up_left", "up_right", "down_left", "down_right"];

    // 垂直水平
    if(map[enemy.y][enemy.x] != ID_MAP.path || rand_diagonal) {
        let dir = KEY_DIRECTION[dir_array[rand_dir]];
        return await move(enemy, dir);
    }
    // 斜め
    else{
        let dir = KEY_DIRECTION_DIAGONAL[dir_array_diagonal[rand_dir]];
        return await move(enemy, dir);
    }
}

// エネミー追加
function setEnemy(id, x, y) {
    let enemy = getEnemyData(id);

    // 共通
    const OTHER_ENEMY_INFO = {
    x: x, y: y, travel_x:x, travel_y:y,
    map_sight: [], condition: [], travel_route: [],
    cannot_action_flag: false, cannot_move_flag: false,
    chase_flag: false, chase_count: 0, chase_limit: 5,
    berserk_flag: false, berserk_chase_flag: false,
    hp_max_offset: 0, mp_max_offset: 0, sight_range_offset: 0,
    atk_offset:0, def_offset:0,
    next_exp: 10, lvup: {},
    };
    let e = Object.assign({}, enemy, OTHER_ENEMY_INFO);

    // スキル
    for(let s of e.skill) {
        let skill = Object.assign({}, getSkillData(s.id), {chance: 0}, s);
        Object.assign(s, skill);

        // プロパティチェック
        for(let key in s)
            if(s[key] === undefined) {
                console.warn("setEnemy: undefined property. ("+s.name+")");
                e.skill.splice(e.skill.indexOf(s), 1);
                break;
            }
    }
    enemy_group.push(e);
}

// エネミーグループ
// 5階層毎にテーブル変更
async function setEnemyGroup() {
    let num = Math.floor(Math.random() * (room_num*1.5 - room_num*1) + room_num*1);
    let table = [];

    if(Math.floor((floor_cnt-1)/3) in ENEMY_TABLE)
        table = ENEMY_TABLE[Math.floor((floor_cnt-1)/3)];
    else{
        table = ENEMY_TABLE[0];
        console.warn("setEnemyGroup: enemy_table of this floor not found");
    }
    if(table.length==0) return;

    for(let i=0; i<num; i++) {
        const enemy_id = table[Math.floor(Math.random() * table.length)];
        const enemy = getEnemyData(enemy_id);
        let spawn_cnt = enemy.group_spawn_flag ? 2 : 1;

        for(let j=0; j<spawn_cnt; j++) {
            // 位置
            const [x, y] = setSpawnXY(0, enemy.group_spawn_flag, enemy.id);
            // 設置
            setEnemy(enemy_id, x, y);
            let e = enemy_group[enemy_group.length-1];
            await e.func_spawn(e);
        }
    }
}

// priority: ifで比較する値が高いほどそのifは優先される
function setSpawnXY(priority, group_spawn_flag, id) {
    const [x,y] = setRandomXY();

    // 配置制限
    // PLの視界外
    if(player.map_sight[y][x] && priority < 300)
        return setSpawnXY(++priority, group_spawn_flag, id);
    // 壁が隣
    let next_wall_flag = false;
    for(let i=-1; i<=1; i++)
        for(let j=-1; j<=1; j++)
            if(map[y+i][x+j] == ID_MAP.none)
                next_wall_flag = true;
    if(!next_wall_flag && priority < 200)
        return setSpawnXY(++priority, group_spawn_flag, id);
    // グループ湧き
    if(group_spawn_flag && priority < 100) {
        let next_e_flag = false;
        for(let e of enemy_group)
            for(let i=-1; i<=1; i++)
                for(let j=-1; j<=1; j++)
                    if(x+j == e.x && y+i == e.y && e.id == id)
                        next_e_flag = true;
        if(!next_e_flag)
            return setSpawnXY(++priority, group_spawn_flag, id);
    }
    return [x, y];
}

// エネミーがいるか
function isEnemy(x, y) {
    for(let e in enemy_group)
        if(enemy_group[e].x == x && enemy_group[e].y == y)
            return true;
    return false;
}

// エネミーの死亡判定
async function removeEnemy(enemy) {
    addLog(enemy.name+" は倒れた");
    enemy_group.splice(enemy_group.indexOf(enemy), 1);
    await wait(300);
    return true;
}

//==================================================MAP GEN==================================================

// プレイヤー位置
function setPlayerPos() {
    let [x,y] = setRandomXY();

    player.x = x;
    player.y = y;
    updateSight();
}

function setPlayerPosManual(x, y) {
    player.x = x;
    player.y = y;
    updateSight();
}

// マップ自動生成
function generateMap() {
    let path_anchor = [];
    room_num = 0;

    // 部屋生成
    for(let i=0; i<ROOMNUM; i++)
        if(genRoom(path_anchor))
            room_num++;

    // 通路生成
    genPath(path_anchor);

    // debug
    //clairvoyance();
}

// 部屋生成
function genRoom(path_anchor) {
    let room_h = Math.floor(Math.random()*(ROOMSIZEMAX-ROOMSIZEMIN+1)+ROOMSIZEMIN+1);
    let room_w = Math.floor(Math.random()*(ROOMSIZEMAX-ROOMSIZEMIN+1)+ROOMSIZEMIN+1);
    let anchor_y = Math.floor(Math.random()*(SIZEY-room_h-1-2)+2);
    let anchor_x = Math.floor(Math.random()*(SIZEX-room_w-1-2)+2);
    if(room_h % 2 == 0) room_h--;
    if(room_w % 2 == 0) room_w--;
    if(anchor_y % 2 != 0) anchor_y--;
    if(anchor_x % 2 != 0) anchor_x--;

    // 他の部屋の重複判定
    for(let j=-3; j<room_h+3; j++)
        for(let k=-3; k<room_w+3; k++)
            if(isInMap(anchor_x+k, anchor_y+j)
            && map[anchor_y+j][anchor_x+k] == ID_MAP.room)
                return false;
    
    // 生成
    for(let j=0; j<room_h; j++)
        for(let k=0; k<room_w; k++)
            map[anchor_y+j][anchor_x+k] = ID_MAP.room;
    
    // アンカー生成
    let path_anchor_x = Math.floor(Math.random()*(anchor_x+room_w-1-anchor_x)+anchor_x);
    let path_anchor_y = Math.floor(Math.random()*(anchor_y+room_h-1-anchor_y)+anchor_y);
    if(path_anchor_y % 2 != 0) path_anchor_y--;
    if(path_anchor_x % 2 != 0) path_anchor_x--;
    path_anchor.push({x:path_anchor_x, y:path_anchor_y});

    // DEBUG: 経路アンカー表示
    //map[path_anchor.at(-1).y][path_anchor.at(-1).x] = "A";

    return true;
}

// 通路生成
function genPath(path_anchor) {
    let result_couple = [];

    // アンカー間が最短のペア
    for(let i of path_anchor) {
        let min_distance = SIZEX*SIZEX + SIZEY*SIZEY;
        let result_i;
        let result_j;

        for(let j of path_anchor) {
            if(i==j) 
                continue;
            
            let dis_x = i.x - j.x;
            let dis_y = i.y - j.y;

            if(min_distance > dis_x*dis_x + dis_y*dis_y) {
                result_i = i;
                result_j = j;
            }
        }
        result_couple.push({i: result_i, j: result_j});
    }
    
    // 生成
    for(let n of result_couple) {
        let array_xy;

        if(n.i.y < n.j.y && n.i.x < n.j.x)
            array_xy = {low_y: n.i.y, high_y: n.j.y, low_x: n.i.x, high_x: n.j.x};
        else if(n.i.y >= n.j.y && n.i.x < n.j.x)
            array_xy = {low_y: n.j.y, high_y: n.i.y, low_x: n.i.x, high_x: n.j.x};
        else if(n.i.y >= n.j.y && n.i.x >= n.j.x)
            array_xy = {low_y: n.j.y, high_y: n.i.y, low_x: n.j.x, high_x: n.i.x};
        else if(n.i.y < n.j.y && n.i.x >= n.j.x)
            array_xy = {low_y: n.i.y, high_y: n.j.y, low_x: n.j.x, high_x: n.i.x};

        for(let m=array_xy.low_y; m<array_xy.high_y+1; m++) {
            if(map[m][n.i.x] == ID_MAP.none)
                map[m][n.i.x] = ID_MAP.path;
        }
        for(let m=array_xy.low_x; m<array_xy.high_x+1; m++) {
            if(map[n.j.y][m] == ID_MAP.none)
                map[n.j.y][m] = ID_MAP.path;
        }
    }
}

// 固有マップ生成
function generateUniqueMap(um) {
    let x_offset = Math.floor(SIZEX/2-um.map[0].length/2);
    for(let i=0; i<um.map.length; i++) {
        let s = um.map[i].split("");
        for(let j=x_offset; j<s.length+x_offset; j++)
            map[i][j] = Number(s[j-x_offset]);
    }

    setPlayerPosManual(um.pl_x+x_offset, um.pl_y);
    um.func(x_offset);
}

function initMaps() {
    // 地形マップ
    initMap(map, ID_MAP.none);
    // 描画マップ
    initMap(map_draw, CHAR_MAP[0]);
}

function initMap(m, v) {
    m.splice(0);
    for(let i=0; i<SIZEY; i++) {
        m.push([]);
        for(let j=0; j<SIZEX; j++) {
            m[i].push(v);
        }
    }
}

// 射撃・投擲・魔法の射程
function updateShotRange() {
    initMap(map_shotrange, false);

    // 左上
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y-cnt][player.x-cnt]==ID_MAP.none)
            break;
        map_shotrange[player.y-cnt][player.x-cnt] = true;
    }
    // 上
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y-cnt][player.x]==ID_MAP.none)
            break;
        map_shotrange[player.y-cnt][player.x] = true;
    }
    // 右上
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y-cnt][player.x+cnt]==ID_MAP.none)
            break;
        map_shotrange[player.y-cnt][player.x+cnt] = true;
    }
    // 左
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y][player.x-cnt]==ID_MAP.none)
            break;
        map_shotrange[player.y][player.x-cnt] = true;
    }
    // 右
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y][player.x+cnt]==ID_MAP.none)
            break;
        map_shotrange[player.y][player.x+cnt] = true;
    }
    // 左下
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y+cnt][player.x-cnt]==ID_MAP.none)
            break;
        map_shotrange[player.y+cnt][player.x-cnt] = true;
    }
    // 下
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y+cnt][player.x]==ID_MAP.none)
            break;
        map_shotrange[player.y+cnt][player.x] = true;
    }
    // 右下
    for(let cnt = 1; cnt<=10; cnt++) {
        if(map[player.y+cnt][player.x+cnt]==ID_MAP.none)
            break;
        map_shotrange[player.y+cnt][player.x+cnt] = true;
    }
}

function isInMap(x, y) {
    if(0 <= x && x < SIZEX && 0 <= y && y < SIZEY)
        return true;
    return false;
}

function isRoom(x, y) {
    if(![ID_MAP.path, ID_MAP.none].includes(map[y][x]))
        return true;
    return false;
}

function isSameRoom(a_x, a_y, b_x, b_y) {
    let checked_map = [];
    getRoomXY(a_x, a_y, checked_map);

    for(let i of checked_map)
        if(i.x==b_x && i.y==b_y)
            return true;
    return false;
}

function isDoor(x, y) {
    if(!(map[y][x] == ID_MAP.path))
        return false;
    for(let i of [-1, 1]) {
        if(isInMap(x+i, y) && ![ID_MAP.none, ID_MAP.path].includes(map[y][x+i]))
            return true;
        else if(isInMap(x, y+i) && ![ID_MAP.none, ID_MAP.path].includes(map[y+i][x]))
            return true;
    }
    return false;
}

// [x,y]に位置する部屋の座標取得
// checked_map: {x, y}
function getRoomXY(x, y, map) {
    if(!isRoom(x, y)) return;
    for(let i=-1; i<=1; i++)
        for(let j=-1; j<=1; j++)
            if(!(map.find(v=>v.x==x+j && v.y==y+i))) {
                map.push({x:x+j, y:y+i});
                getRoomXY(x+j, y+i, map);
            }
}

function canMove(x, y) {
    if(!isInMap(x,y) 
        || map[y][x] == ID_MAP.none
        || isEnemy(x,y)
        || isShop(x,y)
        || isNPC(x,y)
        || (x==player.x && y==player.y)
    )
        return false;
    return true;
}

// 斜め移動の判定
function canDiagonal(x, y, dir_x, dir_y) {
    if(dir_x==0 || dir_y==0)
        return true;

    if(map[y+dir_y][x]==ID_MAP.none || map[y][x+dir_x]==ID_MAP.none)
        return false;

    return true;
}
