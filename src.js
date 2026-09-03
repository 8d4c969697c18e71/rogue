//==================================================INIT==================================================

window.onload = async function(){
  document.body.addEventListener("keydown", e=>{e.preventDefault()});
  
  if(!isPhone()){
    setCanvasSize();
    await inputName();
  }
  else{
    setButton();
    setCanvasSizePhone();
    player.name = "あなた";
    input_name_flag = false;
    await init();
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
  if(!gameover_flag){
    drawAll();
    drawNote();
  }
});

// ウィンドウサイズ
function setCanvasSize(){
  let canvas_width = window.innerHeight/2;
  let canvas_height = canvas_width;
  const body_width = document.body.clientWidth;

  button.style.display = "none";
  note.style.display = "block";
  note_hidden_flag = false;
  if((canvas_width+NOTE_WIDTH+INFO_WIDTH) > body_width){
    note_hidden_flag = true;
    note.style.display = "none";
  }

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

  const body_padding = document.body.clientHeight-parseInt(window.getComputedStyle(document.body).height)
  log_display_num = Math.floor((window.innerHeight-body_padding-canvas.clientHeight-arrow_size*3)/(FONT_SIZE+5)-1);
  inv_display_num = Math.floor((window.innerHeight-body_padding-288/*FIXME:マジックナンバー*/-arrow_size*3)/(FONT_SIZE+5)-1);
}

// ウィンドウサイズ（スマホ）
function setCanvasSizePhone(){
  canvas_width = screen.width - INFO_WIDTH*12/16;
  canvas_height = canvas_width*1.5;

  canvas.style.width = canvas_width+"px";
  canvas.style.height = canvas_height+"px";
  const canvas_scale = window.devicePixelRatio;
  canvas.width = Math.floor(canvas_width*canvas_scale);
  canvas.height = Math.floor(canvas_height*canvas_scale);
  ctx.scale(canvas_scale, canvas_scale);
  ctx.font = FONT_SIZE+"px "+FONT;
  ctx.fillStyle = "white";
  ctx.textBaseline = "top";
  
  info.style.fontSize = 12+"px";
  log.style.fontSize = 12+"px";
  log.style.width = canvas_width+"px";
  inv.style.fontSize = 12+"px";
  inv.style.width = screen.width-log.clientWidth-5+"px";
  shop.style.display = "none";

  document.body.style.paddingTop = 0+"px";
  log_display_num = Math.floor((window.innerHeight-canvas.clientHeight-arrow_size*3)/FONT_SIZE-1);
  inv_display_num = Math.floor((window.innerHeight-288/*FIXME:マジックナンバー*/-arrow_size*3)/FONT_SIZE-1);
}

// スマホ検出
function isPhone(){
  if(navigator.userAgent.match(/iPhone|Android.+Mobile/))
    return true;

  return false;
}

// ボタン表示
function setButton(){
  zxc_size = screen.width/6;
  arrow_size = zxc_size;
  
  // 全体
  button.style.visibility = "visible";
  button.style.position = "fixed";
  button.style.top = window.innerHeight-arrow_size*2+"px";

  // デザイン
  const font_color = "white";
  const back_color = "black";
  const line_color = "white";
  for(let b of btn){
    b.style.backgroundColor = back_color;
    b.style.border = "solid 1px "+line_color;
    b.style.color = font_color;
    b.style.width = zxc_size+"px";
    b.style.height = zxc_size+"px";
  }
  for(let ab of btn_arrow){
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

// 初期化
async function init(){
  initAll();
  await nextFloor();
  
  updateMap();
  drawMap();

  drawInfo();
  drawInv();
  log_reserve = [];
  drawLog();

  drawNote();
}

function initGroups(){
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
  if(!exeEventsFlg) {
    await events();
  }
});

function toggleKeyInput(e){
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
btn_z.addEventListener("click", () =>{
  key_input.apply = true;
  events();
  key_input.apply = false;
});
btn_x.addEventListener("click", () =>{
  key_input.cancel = true;
  events();
  key_input.cancel = false;
});
btn_c.addEventListener("click", () =>{
  key_input.sub = true;
  events();
  key_input.sub = false;
});
btn_left.addEventListener("click", () =>{
  key_input.left = true;
  events();
  key_input.left = false;
});
btn_up.addEventListener("click", () =>{
  key_input.up = true;
  events();
  key_input.up = false;
});
btn_down.addEventListener("click", () =>{
  key_input.down = true;
  events();
  key_input.down = false;
});
btn_right.addEventListener("click", () =>{
  key_input.right = true;
  events();
  key_input.right = false;
});
btn_upleft.addEventListener("click", () =>{
  key_input.ctrl = true;
  key_input.up_left = true;
  events();
  key_input.ctrl = false;
  key_input.up_left = false;
});
btn_downleft.addEventListener("click", () =>{
  key_input.ctrl = true;
  key_input.down_left = true;
  events();
  key_input.ctrl = false;
  key_input.down_left = false;
});
btn_upright.addEventListener("click", () =>{
  key_input.ctrl = true;
  key_input.up_right = true;
  events();
  key_input.ctrl = false;
  key_input.up_right = false;
});
btn_downright.addEventListener("click", () =>{
  key_input.ctrl = true;
  key_input.down_right = true;
  events();
  key_input.ctrl = false;
  key_input.down_right = false;
});

const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

//==================================================EVENT==================================================

// イベント
async function events(){
  exeEventsFlg = true;
  // 名前入力
  if(input_name_flag) {
    await inputName();
    exeEventsFlg = false;
    return;
  }
  // ゲームオーバー
  else if(gameover_flag){
    await gameoverEvent();
    turn_flag = false;
    drawGameover();
  }
  // 行動不能
  else if(player.cannot_action_flag){
    turn_flag = true;
  }
  // 射撃
  else if(shot_flag){
    turn_flag = await eventShot();
  }
  // 投擲
  else if(throwing_flag){
    turn_flag = await eventThrowing();
  }
  // 魔法
  else if(magic_flag){
    turn_flag = await eventMagic();
  }
  // UI
  else if(ui_flag){
    turn_flag = await eventUI();
  }
  // ショップ
  else if(shop_flag){
    turn_flag = eventShop();
  }
  // マップ
  else{
    turn_flag = await eventPlayer();
  }

    // 描画
  if(!gameover_flag) drawAll();

  // ターン経過
  if(turn_flag){
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
async function eventPlayer(){
  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = KEY_DIRECTION;
  else kd = KEY_DIRECTION_DIAGONAL;
  for(let k in kd)
    if(key_input[k]){
      let x = player.x + kd[k].x;
      let y = player.y + kd[k].y;
      if(isEnemy(x, y) && canDiagonal(player.x, player.y, kd[k].x, kd[k].y)){
        let enemy = enemy_group.find(v=>(v.x==x && v.y==y));
        await attack(player, enemy);
        if(await isDead(enemy)) addExp(player, enemy.exp);
        return true;
      }
      else if(isShop(x, y)){
        shop_using = shop_group.find(v=>v.x==x && v.y==y);
        addLog(shop_using.name+"「"+shop_using.dialogue_intro+"」");
        audio_apply.play();
        shop_cursor = 0;
        shop_flag = true;
        shop_using.func_before();
        return false;
      }
      else if(isNPC(x, y)){
        let npc = npc_group.find(v=>v.x==x && v.y==y);
        addLog(npc.name+"「"+npc.dialogue[npc.dialogue_cnt]+"」");
        audio_apply.play();
        if(npc.dialogue_cnt<npc.dialogue.length-1)
          npc.dialogue_cnt++;
        else if(npc.loop && npc.dialogue_cnt>=npc.dialogue.length-1)
          npc.dialogue_cnt = 0;
        npc.func();
        return true;
      }
      else if(!player.cannot_move_flag){
        if(!key_input.shift)
          return await move(player, kd[k]);
        else{
          await sprint(kd[k])
          return false;
        }
      }
    }
  
  // apply
  if(key_input.apply){
    if(isStair(player.x, player.y)){
      audio_stair.play();
      await nextFloor();
    }
    else if(isPortal(player.x, player.y)){
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
  if(key_input.cancel){
    audio_apply.play();
    //inv_cursor = 0;
    ui_flag = true;
    return false;
  }
  // sub
  if(key_input.sub){
    if(!bow_flag){
      addLog("射撃武器を装備していない");
      return false;
    }
    else if(!player.ammo){
      addLog("弾薬を装備していない");
      return false;
    }
    addLog(player.weapon.name+" を構えた");
    audio_apply.play();
    shot_flag = true;
    return false;
  }
}

// 移動
async function move(who, direction){
  let new_x = who.x + direction.x;
  let new_y = who.y + direction.y;
  if(canMove(new_x,new_y) && canDiagonal(who.x, who.y, direction.x, direction.y)){
    who.x = new_x;
    who.y = new_y;
    return true;
  }
  return false;
}

// 高速移動
async function sprint(direction){
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
  if(!canMove(player.x+direction.x, player.y+direction.y) && canDiagonal(player.x, player.y, direction.x, direction.y))
    return;
  if(map[player.y][player.x] == ID_MAP.path && map[player.y+direction.y][player.x+direction.x] == ID_MAP.room
    || map[player.y][player.x] == ID_MAP.room && map[player.y+direction.y][player.x+direction.x] == ID_MAP.path)
    return;
  if(isFrontObj(player, direction))
    return;
  if(isCrossing(player.x, player.y))
    return;

  await sprint(direction);
}

// 進行方向調査
// 前方（斜め含む3マス）に何かあったらtrue
function isFrontObj(who, direction){
  // 上下
  if(direction.x == 0){
    for(let i=-1; i<=1; i++)
      if(isAnyObj(who.x+i, who.y+direction.y))
        return true;
  }
  // 左右
  else if(direction.y == 0){
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

function isAnyObj(x, y){
  if(isItem(x, y) || isEnemy(x, y) || isNPC(x, y) || isShop(x, y))
    return true;
  return false;
}

// 交差点
function isCrossing(x, y){
  if(map[y][x] != ID_MAP.path) return false;
  let path_cnt = 0;
  for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]])
    if(map[y+i][x+j] == ID_MAP.path) path_cnt++;
  if(path_cnt > 2) return true;
  return false;
}

//ジャンプ
function jump(who, direction, distance){
  if(!canMove(who.x+direction.x*distance, who.y+direction.y*distance))
    return false;
  who.x = who.x+direction.x*distance;
  who.y = who.y+direction.y*distance;
  return true;
}

// 攻撃
async function attack(from, to){
  addLog(from.name+" の攻撃");

  let dmg;
  dmg = (from.atk)*(100-to.def)/100;
  let rand = Math.random() * dmg/4 - dmg/8;
  dmg += rand;
  dmg = Math.floor(dmg);
  if(dmg<0) dmg = 0;

  // 受け流し
  for(let cond of to.condition)
    if(cond.id == 0x80){
      to.condition.splice(to.condition.indexOf(cond), 1);
      to.cannot_action_flag = false;
      addLog(to.name+" は攻撃を受け流し 反撃した");
      await dealDmg(to, from, dmg);
      return;
    }

  await dealDmg(from, to, dmg);
  if("weapon" in from && from.weapon) await from.weapon.func_attack(to);
  if("armor" in to && to.armor) await to.armor.func_attacked(from);

  return;
}

// 射撃イベント
async function eventShot(){
  let ammo = player.ammo;

  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = KEY_DIRECTION;
  else kd = KEY_DIRECTION_DIAGONAL;
  for(let k in kd)
    if(key_input[k]){
      shot_flag = false;
      let enemy = await shot(player, ammo, kd[k]);
      if(!(enemy===undefined) && await isDead(enemy)) addExp(player, enemy.exp);
      if(ammo.stack_num > 0) ammo.stack_num--;
      if(ammo.stack_num <= 0){
        await equip(inventory.indexOf(ammo));
        log_reserve.pop();
        inventory.splice(inventory.indexOf(ammo), 1);
      }
      return true;
    }
  
  // cancel
  if(key_input.cancel){
    addLog("構えを解いた");
    shot_flag = false;
    return false;
  }
}

// 射撃
async function shot(who, ammo, direction){
  let dst = straightRecursive(who.x, who.y, direction, ammo.range);

  addLog(who.name+" は "+ammo.name+" を放った");
  audio_shot.play();
  await animShot(who, dst, direction);

  if(isEnemy(dst.x+direction.x, dst.y+direction.y)){
    let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
    await shotDmg(who, enemy, ammo);
    if("weapon" in who && who.weapon) await who.weapon.func_attack(enemy);
    if("armor" in enemy && enemy.armor) await enemy.armor.func_attacked(who);
    if(who == player) findPl(enemy);
    return enemy;
  }
  else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y){
    await shotDmg(who, player, ammo);
    if("weapon" in who && who.weapon) await who.weapon.func_attack(player);
    if("armor" in player && player.armor) await player.armor.func_attacked(who);
    return player;
  }
  else{// 外した
    if(who == player){
      if(!isItem(dst.x, dst.y))
        setItem(ammo.id, dst.x, dst.y);
      else{
        for(let s=1; s<SIZEX; s++)
          for(let i=-s; i<=s; i++)
            for(let j=-s; j<=s; j++)
              if(canMove(dst.x+j, dst.y+i) && !isItem(dst.x+j, dst.y+i)){
                setItem(ammo.id, dst.x+j, dst.y+i);
                addLog(ammo.name+" は床に落ちた");
                return undefined;
              }
      }
    }
  }
}

async function shotDmg(from, to, ammo){
  let dmg;
  dmg = (from.atk/2+ammo.dmg)*(100-to.def)/100;;
  let rand = Math.random() * dmg/4 - dmg/8;
  dmg += rand;
  dmg = Math.floor(dmg);
  if(dmg < 0) dmg = 0;

  await dealDmg(from, to, dmg);
}

// 投擲イベント
async function eventThrowing(){
  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = KEY_DIRECTION;
  else kd = KEY_DIRECTION_DIAGONAL;
  for(let k in kd)
    if(key_input[k]){
      throwing_flag = false;
      let item = inventory[inv_cursor]
      let enemy = await throwing(player, item, kd[k]);
      if(!(enemy===undefined) && await isDead(enemy)) addExp(player, enemy.exp);
      // インベントリから削除
      if(STACK_TYPE.includes(item.type)){
        if(item.stack_num > 0) item.stack_num--;
        if(inventory[inv_cursor].stack_num <= 0){
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
  if(key_input.cancel){
    addLog("投擲をやめた");
    //inv_cursor = -1;
    throwing_flag = false;
    ui_flag = false;
    return false;
  }
}

// 投擲
async function throwing(who, item, direction){
  let dst = straightRecursive(who.x, who.y, direction, THROWING_RANGE);

  addLog(who.name+" は "+item.name+" を投擲した");
  audio_shot.play();
  await animThrow(who, dst, direction, item);

  if(isEnemy(dst.x+direction.x, dst.y+direction.y)){
    let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
    await throwDmg(who, enemy, item);
    if(who == player) findPl(enemy);
    return enemy;
  }
  else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y){
    await throwDmg(who, player, item);
    return player;
  }
  else{  // アイテム化
    if(!isItem(dst.x, dst.y))
      setItem(item.id, dst.x, dst.y);
    else{
      for(let s=1; s<SIZEX; s++)
        for(let i=-s; i<=s; i++)
          for(let j=-s; j<=s; j++)
            if(canMove(dst.x+j, dst.y+i) && !isItem(dst.x+j, dst.y+i)){
              setItem(item.id, dst.x+j, dst.y+i);
              addLog(item.name+" は床に落ちた");
              return undefined;
            }
    }
  }
}

async function throwDmg(from, to, item){
  let dmg;
  if(item.type=="ammo" )
    dmg = Math.floor((item.dmg/3 + item.dmg * Math.random()) * (100-to.def) / 100);
  else if(item.type=="weapon")
    dmg = Math.floor((item.base_dmg/5) * (100-to.def) / 100);
  else
    dmg = Math.round(Math.random()) + 10;
  if(dmg < 0) dmg = 0;

  await dealDmg(from, to, dmg);
}

// 投擲物選択
function checkThrowing(index){
  if(inventory[index].equip_flag){
    addLog(inventory[index].name+" は投擲できない");
    return false;
  }
  return true;
}

// 魔法イベント
async function eventMagic(){
  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = KEY_DIRECTION;
  else kd = KEY_DIRECTION_DIAGONAL;
  for(let k in kd)
    if(key_input[k]){
      magic_flag = false;
      let enemy = await player.magic_using.func_cast(kd[k]);
      if(!(enemy===undefined) && await isDead(enemy)) addExp(player, enemy.exp);
      
      player.magic_using = undefined;
      ui_flag = false;
      //inv_cursor = -1;
      return true;
    }
  
  // cancel
  if(key_input.cancel){
    addLog("構えを解いた");
    magic_flag = false;
    player.magic_using = undefined;
    //inv_cursor = -1;
    ui_flag = false;
    return false;
  }
}

// 魔法
function magic(who, value, direction){
  let dst = straightRecursive(who.x, who.y, direction, MAGIC_RANGE);
  if(isEnemy(dst.x+direction.x, dst.y+direction.y)){
    let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
    magicDmg(who, enemy, value);
    if(who == player) findPl(enemy);
    return enemy;
  }
  else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y){
    magicDmg(who, player, value);
    return player;
  }
}

async function magicDmg(from, to, value){
  let dmg;
  dmg = value;
  let rand = Math.random() * dmg/4 - dmg/8;
  dmg += rand;
  dmg = Math.round(dmg);
  if(dmg < 0) dmg = 0;
  
  await dealDmg(from, to, dmg);
}

// ダメージ
async function dealDmg(from, to, dmg){
  addHP(to, -dmg);
  addLogSameLine(to.name+" に "+dmg+" のダメージ");
  audio_hit.play();
  await animBlink(to);

  // 状態異常
  for(let cond of to.condition){
    // 睡眠
    if(cond.id == 0x01 && dmg > 0){
      to.condition.splice(to.condition.indexOf(cond), 1);
      await cond.func_recovery(to);
    }
    // 受け流し失敗
    if(cond.id == 0x80){
      to.condition.splice(to.condition.indexOf(cond), 1);
      to.cannot_action_flag = false;
      addLog(to.name+" は受け流しに失敗した");
      await dealDmg(from, to, Math.round(dmg*1.5));
      return;
    }
  }

  drawInfo();

  // fromへの処理
  if(from === undefined) return;
}

function straightRecursive(x, y, direction, range){
  if(!canMove(x+direction.x, y+direction.y)
    || range <= 0
    || map_draw[y+direction.y][x+direction.x] == CHAR_MAP.door)
    return {x:x, y:y};
  return straightRecursive(x+direction.x, y+direction.y, direction, --range);
}

function straightRecursiveDiagonal(x, y, direction, range){
  if(!canMove(x+direction.x, y+direction.y)
    || !canDiagonal(x, y, direction.x, direction.y)
    || range <= 0
    || map_draw[y+direction.y][x+direction.x] == CHAR_MAP.door)
    return {x:x, y:y};
  return straightRecursive(x+direction.x, y+direction.y, direction, --range);
}

function straightRecursiveAllMap(x, y, direction){
  if(!canMove(x+direction.x, y+direction.y))
    return {x:x, y:y};
  return straightRecursiveAllMap(x+direction.x, y+direction.y, direction);
}

// UIイベント
async function eventUI(){
  // 上下
  if(key_input.up){
    if(inv_cursor > 0)
      inv_cursor--;
    else
      inv_cursor = INVENTORY_SIZE - 1;
    return false;
  }
  if(key_input.down){
    if(inv_cursor < INVENTORY_SIZE - 1)
      inv_cursor++;
    else
      inv_cursor = 0;
    return false;
  }
  // apply
  if(key_input.apply)
    if(inv_cursor<inventory.length && await useItem(inv_cursor)){
      audio_apply.play();
      //inv_cursor = -1;
      ui_flag = false;
      return true;
    }
  // cancel
  if(key_input.cancel){
    //inv_cursor = -1;
    ui_flag = false;
    return false;
  }
  // sub
  if(key_input.sub){
    if(inv_cursor<inventory.length && checkThrowing(inv_cursor)){
      addLog(inventory[inv_cursor].name+" を振り被った")
      audio_apply.play();
      throwing_flag = true;
      return false;
    }
  }
}

// ショップイベント
function eventShop(){
  // 上下
  if(key_input.up ){
    if(shop_cursor > 0)
      shop_cursor--;
    else
      shop_cursor = shop_using.item.length - 1;
    return false;
  }
  if(key_input.down ){
    if(shop_cursor < shop_using.item.length - 1)
      shop_cursor++;
    else
      shop_cursor = 0;
    return false;
  }
  // apply
  if(key_input.apply){
    // buy
    if(shop_using.item[shop_cursor].price >= 0){
      if(player.gold >= shop_using.item[shop_cursor].price){
        if(addItem(shop_using.item[shop_cursor].id)){
          player.gold -= shop_using.item[shop_cursor].price;
          //shop_using.item.splice(shop_cursor, 1);
          shop_using.func_buy();
        }
        audio_apply.play();
        return true;
      }
      else
        addLog("金貨が足りない");
      return false;
    }
    // sell
    else{
      if(inventory.find(v=>v.id==shop_using.item[shop_cursor].id)){
        let item_sell = inventory[inventory.indexOf(inventory.find(v=>v.id==shop_using.item[shop_cursor].id))]
        if(item_sell.equip_flag){
          addLog("装備中だ");
          return false;
        }
          
        if(STACK_TYPE.includes(item_sell.type)){
          if(item_sell.stack_num > 0) item_sell.stack_num--;
          if(item_sell.stack_num <= 0){
            inventory.splice(inventory.indexOf(item_sell), 1);
          }
          player.gold += -shop_using.item[shop_cursor].price;
        }
        else{
          inventory.splice(inventory.indexOf(item_sell), 1);
          player.gold += -shop_using.item[shop_cursor].price;
        }
        audio_apply.play();
        addLog(item_sell.name+" を売った");
        return true;
      }
      else
        addLog("持っていない");
      return false;
    }
  }
  // cancel
  if(key_input.cancel){
    addLog(shop_using.name+"「"+shop_using.dialogue_outro+"」");
    shop_using.func_after();
    shop_using = undefined;
    shop_cursor = -1;
    shop_flag = false;
    return false;
  }
}

// ゲームオーバー
async function gameoverEvent(){
  if(key_input.apply || key_input.cancel || key_input.sub){
    turn_cnt = 1;
    floor_cnt = -1;
    gameover_flag = false;
    await init();
  }
}

function gameover(){
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
function addHP(who, value){
  who.hp += value;
  if(who.hp > (who.hp_max + who.hp_max_offset))
    who.hp = who.hp_max + who.hp_max_offset;
  else if(who.hp < 0)
    who.hp = 0;
}

// MP
function addMP(who, value){
  who.mp += value;
  if(who.mp > (who.mp_max + who.mp_max_offset))
    who.mp = who.mp_max + who.mp_max_offset;
  else if(who.mp < 0)
    who.mp = 0;
}

// 空腹度
// PL専用
function addHung(value){
  player.hung += value;
  if(player.hung > (player.hung_max + player.hung_max_offset))
    player.hung = player.hung_max + player.hung_max_offset;
  if(player.hung < 0)
    player.hung = 0;
}

// 経験値獲得
function addExp(who, value){
  who.exp += value;
  addLogSameLine(value+" の経験値を得た");
  lvUp(who);
}

// 全回復
function fullRecovery(who){
  addLog(who.name+" は全快した");
  who.hp = who.hp_max + who.hp_max_offset;
  who.mp = who.mp_max + who.mp_max_offset;
  if(who == player) player.hung = player.hung_max + player.hung_max_offset;
  who.condition = [];
}

// レベルアップ
function lvUp(who){
  if(who.exp >= who.next_exp){
    who.lv++;
    who.next_exp = who.next_exp + who.lv * 15;

    for(let st in who.lvup) who[st] += who.lvup[st];
    
    // atk再計算
    if(who == player) {
      who.atk = ATK_BASE;
      for(let idx in player.recalc)
        player.recalc[idx].obj[player.recalc[idx].func_name]();
    }

    addLog(who.name+" はレベルが上がった");
    audio_lvup.play();
    lvUp(who);
    return true;
  }
  return false;
}

// lv1に戻す
function backLv(){
  let job = ITEM_DATA.find(v=>v.id==player.job);

  player.hp = job.hp;
  player.hp_max = job.hp_max;
  player.mp = job.mp;
  player.mp_max = job.mp_max;
  player.str = job.str;
  player.dex = job.dex;
  player.int = job.int;
  player.fth = job.fth;
  player.def = job.def;
  player.hung_rate = job.hung_rate;
  player.hp_regen_rate = job.hp_regen_rate;
  player.mp_regen_rate = job.mp_regen_rate;
  player.sight_range = job.sight_range;
  player.job_name = job.name;
  player.lvup = job.lvup;

  player.lv = 1;
  player.exp = 0;
  player.next_exp = 20;
  player.hung = 100;
  player.hung_max = 100;
}

// ステ初期化
function initAll(){
  player.job = 0xf00;
  backLv();

  player.hp_max_offset = 0;
  player.mp_max_offset = 0;
  player.atk = ATK_BASE;
  player.def = DEF_BASE;
  player.hung_max_offset = 0;
  player.hung_rate_offset = 0;
  player.hp_regen_rate_offset = 0;
  player.mp_regen_rate_offset = 0;
  player.sight_range_offset = 0;
  player.condition = [];
  player.gold = 15;
  player.weapon = undefined;
  player.ammo = undefined;
  player.armor = undefined;
  player.ring1 = undefined;
  player.ring2 = undefined;
  player.magic_using = undefined;
  inventory = [];
}

// ステータスからatk計算
async function calcAtkFromStatus(status, rate, add_flg, offset = 0) {
  let val = Math.floor(Math.sqrt(100 * player[status]) / Math.sqrt(100 * 100) * rate * offset);
  if(add_flg) player.atk += val;
  else player.atk -= val;
}

async function pushRecalc(obj, func) {
  player.recalc.push({obj: obj, func_name: func.name});
}

async function removeRecalc(obj, func) {
  for(let e in player.recalc)
    if(player.recalc[e].obj === obj && player.recalc[e].func_name === func.name)
      player.recalc.splice(e, 1);
}

// 状態異常追加
async function setCondition(who, id){
  let cond = CONDITION_DATA.find(v=>v.id==id);
  
  if(!cond || !("condition" in who)){
    console.warn("setCondition: id or who.condtion not found");
    return false;
  }
  for(let c of who.condition)
    if(c.id == id){
      console.log("setCondition: already have "+cond.name+".")
      return false;
    }

  let c = Object.assign({}, cond);
  who.condition.push(c);
  await who.condition[who.condition.length-1].func_be(who);
  return true;
}

// 状態異常除外
async function removeCondition(who, cond) {
  who.condition.splice(who.condition.indexOf(cond), 1);
  await cond.func_recovery(who);
}

// ターン数指定
async function setConditionTurn(who, id, turn){
  if(!await setCondition(who, id)) return false;
  who.condition[who.condition.length-1].turn = turn;
  return true;
}

// 状態異常経過
async function progressCondition(who){
  for(let cond of who.condition){
    if(cond.turn<=0){
      await removeCondition(who, cond);
    }
    else{
      await cond.func_during(who);
      cond.turn--;
    }
  }
}

// 死亡判定
async function isDead(who){
  if(who.hp <= 0){
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

// アイテム使用
async function useItem(index){
  if(EQUIP_TYPE.includes(inventory[index].type)){
    return await equip(index);
  }
  else{
    return await inventory[index].func();
  }
}

// プレイヤー装備切り替え
async function equip(index){
  let equip_item = inventory[index];
  // 装備する
  if(!(equip_item.equip_flag)){
    // 装備欄チェック
    if(player[equip_item.type]){
      addLog("装備スロットが埋まっている");
      return false;
    }
    // 指輪
    else if(player[equip_item.type+"1"]
      && player[equip_item.type+"2"]){
      addLog("装備スロットが埋まっている");
      return false;
    }

    // 装備スロット更新
    equip_item.equip_flag = true;
    if(MULTIPLE_SLOT.includes(equip_item.type)){
      if(!player[equip_item.type+"1"]
        && player[equip_item.type+"2"])
        player[equip_item.type+"1"] = equip_item;
      else if(player[equip_item.type+"1"]
        && !player[equip_item.type+"2"])
        player[equip_item.type+"2"] = equip_item;
      else
        player[equip_item.type+"1"] = equip_item;
    }
    else
      player[equip_item.type] = equip_item;
    
    await equip_item.func_equip(player);

    addLog(equip_item.name+" を装備した");

    return true;
  }
  // 外す
  else{
    // 装備スロット更新
    equip_item.equip_flag = false;
    if(MULTIPLE_SLOT.includes(equip_item.type)){
      if(player[equip_item.type+"1"] == equip_item)
        player[equip_item.type+"1"] = undefined;
      else if(player[equip_item.type+"2"] == equip_item)
        player[equip_item.type+"2"] = undefined;
    }
    else
      player[equip_item.type] = undefined;
    
    await equip_item.func_unequip(player);

    addLog(equip_item.name+" を外した");
    return true;
  }
}

// アイテム取得
function addItem(id){
  let item = ITEM_DATA.find(v=>v.id==id);
  // スタックアイテム
  if(item.type=="stack"){
    if(inventory.length < INVENTORY_SIZE){
      for(let i=0; i<item.num; i++){
        addItem(item.item_id);
        log_reserve.pop();
      }
      addLog(item.name+" を入手");
      return true;
    }
    for(let i of inventory){
      if(i.id == item.item_id && i.stack_num < STACK_MAX){
        if(i.stack_num + item.num <= STACK_MAX){
          for(let i=0; i<item.num; i++){
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
  if(STACK_TYPE.includes(item.type)){
    let index = getStackIndex(item);
    if(!(index===undefined)){
      inventory[index].stack_num++;
      addLog(item.name+" を入手");
      return true;
    }
    Object.assign(it, {stack_num: 1});
  }

  // 所持数オーバー
  if(inventory.length >= INVENTORY_SIZE){
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
function getStackIndex(item){
  for(let i of inventory)
    if(i.id==item.id && i.stack_num < STACK_MAX){
      return inventory.indexOf(i);  // スタックできるアイテムがある
    }
  return undefined;
}

// アイテム設置
function setItem(id, x, y){
  let item = Object.assign({}, ITEM_DATA.find(v=>v.id==id), {x: x, y: y});
  item_group.push(item);
}

// マップ内アイテム
function setItemGroup(){
  let num = Math.floor(Math.random() * (room_num*1.5 - room_num*1) + room_num*1);
  let table = [];
  
  if(Math.floor((floor_cnt-1)/3) in ITEM_TABLE)
    table = ITEM_TABLE[Math.floor((floor_cnt-1)/3)];
  else
    table = ITEM_TABLE[0];
  if(table.length==0) return;

  for(let i=0; i<num; i++){
    const item_id = Math.floor(Math.random() * table.length);
    const [x, y] = setRandomXY();
    
    setItem(table[item_id], x, y);
  }
}

function setRandomXY(){
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
function isItem(x, y){
  for(let i in item_group)
    if(x==item_group[i].x && y==item_group[i].y)
      return true;
  return false;
}

//==================================================ENVIRONMENT==================================================

// 環境イベント
async function eventEnv(){
  // 自然回復
  if(turn_cnt % (player.hp_regen_rate + player.hp_regen_rate_offset) == 0)
    addHP(player, 8);
  if(turn_cnt % (player.mp_regen_rate + player.mp_regen_rate_offset) == 0)
    addMP(player, 2);

  // 空腹度
  if(player.hung <= 0){
    addLog("飢えが "+player.name+" を蝕む");
    await dealDmg(undefined, player, -30);
    audio_hit.play();
  }
  if(!safe_flag && turn_cnt % player.hung_rate == 0){
    if(player.hung > 0){
      addHung(-1);
      if(player.hung == 25)
        addLog("空腹を感じる");
      if(player.hung == 10)
        addLog("耐え難い空腹");
    }
  }

  // 罠
  for(let t of trap_group)
    if(t.x == player.x && t.y == player.y){
        await t.func(player);
        trap_group.splice(trap_group.indexOf(t), 1);
      }

  // 状態異常
  await progressCondition(player);

  // 死亡判定
  await isDead(player)

  // エネミー
  for(let enemy of enemy_group){
    // 状態異常
    await progressCondition(enemy);

    // 死亡判定
    await isDead(enemy);
  }

  await isDead(player);

  // 階段に乗ってる
  if(isStair(player.x, player.y)){
    addLog("階段 (降りる:z)");
  }
  // ポータルに乗ってる
  if(isPortal(player.x, player.y)){
    addLog("帰還ポータル (入る:z)");
  }
  
  // アイテム取得
  for(let i of item_group)
    if(i.x == player.x && i.y == player.y){
      if(i.id==0x000){
        player.gold += 5;
        audio_apply.play();
        addLog("金貨5枚 を入手");
        item_group.splice(item_group.indexOf(i), 1);
      }
      else if(addItem(i.id)){
        audio_apply.play();
        item_group.splice(item_group.indexOf(i), 1);
      }
    }
}

// 階層移動
async function nextFloor(){
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

  // テスト用//FIXME
  //generateUniqueMap(unique_map.find(v=>v.id=="test"));return;

  if(um = unique_map.find(v=>v.id==floor_cnt)){ // 固有マップ
    generateUniqueMap(um);
    
    if(um.safe_flag) safe_flag = true;
    else safe_flag = false;
  }
  else if(floor_cnt%10 == 0){  // 帰還ポータル階
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
function setStair(x, y){
  stair_pos.x = x;
  stair_pos.y = y;
}

function isStair(x, y){
  if(stair_pos.x==x && stair_pos.y==y)
    return true;
  return false;
}

// ポータル
function setPortal(x, y){
  portal_pos.x = x;
  portal_pos.y = y;
}

function isPortal(x, y){
  if(portal_pos.x==x && portal_pos.y==y)
    return true;
  return false;
}

// ショップ配置
function setShop(id, x, y){
  let shop = SHOP_DATA.find(v=>v.id==id);
  let items = [];

  if(shop.random_flag){
    if(shop.item_num > shop.item_table.length)
      shop.item_num = shop.item_table.length;

    for(let n=0; n<shop.item_num; n++){
      let i = shop.item_table[Math.floor(Math.random()*shop.item_table.length)];
      if(items.find(v=>v.id==i.id)){
        n--;
        continue;
      }
      let item = Object.assign({}, ITEM_DATA.find(v=>v.id==i.id), {price: i.price});
      items.push(item);
    }
  }
  else
    for(let i of shop.item_table){
      let item = Object.assign({}, ITEM_DATA.find(v=>v.id==i.id), {price: i.price});
      items.push(item);
    }

  let s = Object.assign({}, shop, {x: x, y: y, item: items});
  shop_group.push(s);
}

function isShop(x, y){
  for(let s in shop_group)
    if(shop_group[s].x == x && shop_group[s].y == y)
      return true;

  return false;
}

// NPC配置
function setNPC(id, x, y){
  let npc = Object.assign({}, NPC_DATA.find(v=>v.id==id), {x: x, y: y});
  npc_group.push(npc);
}

function isNPC(x, y){
  for(let n in npc_group)
    if(npc_group[n].x == x && npc_group[n].y == y)
      return true;

  return false;
}

// 罠
function setTrap(id, x, y){
  let trap = Object.assign({}, TRAP_DATA.find(v=>v.id==id), {x: x, y: y, visible: false});
  trap_group.push(trap);
}

// マップ内罠
function setTrapGroup(){
  let num = Math.floor(Math.random() * (room_num*1 - 1) + 1);
  let table = [];
  
  if(Math.floor((floor_cnt-1)/3) in TRAP_TABLE)
    table = TRAP_TABLE[Math.floor((floor_cnt-1)/3)];
  else
    table = TRAP_TABLE[0];
  if(table.length==0) return;

  for(let i=0; i<num; i++){
    const item = Math.floor(Math.random() * table.length);
    const [x,y] = setRandomXY();
    
    setTrap(table[item], x, y)
  }
}

// 罠の有無
function isTrap(x, y){
  for(let t of trap_group)
    if(x==t.x && y==t.y)
      return t;
  return undefined;
}

// 罠の看破
function checkTrap(x, y){
  let ret = false;
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++)
      if(t = isTrap(x+j, y+i)){
        t.visible = true;
        ret = true;
      }
  return ret;
}

//==================================================ENEMY==================================================

// エネミーイベント
async function eventEnemies(){
  for(let enemy of enemy_group){
    // 死亡判定
    if(await isDead(enemy)) continue;

    // 行動不能
    if(enemy.cannot_action_flag) continue;
    
    // speed回行動
    for(let cnt=0; cnt<enemy.speed; cnt++){
      await eventEnemy(enemy);
      drawAll();
    }
    await isDead(player);
  }
}

async function eventEnemy(enemy){
  // 発見
  initMap(enemy.map_sight, false);
  getSight(enemy);
  if(enemy.map_sight[player.y][player.x])
    findPl(enemy);
  else if(enemy.berserk_flag && !enemy.chase_flag) {
    for(let other_enemy of enemy_group){
      if(enemy.map_sight[other_enemy.y][other_enemy.x])
        findBerserk(enemy);
    }
  }
  else
    enemy.chase_count--;
  if(enemy.chase_count < 0) {
    enemy.chase_flag = false;
    enemy.berserk_chase_flag = false;
  }

  // 発見済み
  if(enemy.chase_flag){
    // スキル
    for(let skill of enemy.skill){
      if(!(Math.floor(Math.random()+skill.chance))) continue;
      if(await skill.func(enemy, player)) return;
    }

    // プレイヤーへ攻撃
    for(let d in KEY_DIRECTION){
      let x = enemy.x + KEY_DIRECTION[d].x;
      let y = enemy.y + KEY_DIRECTION[d].y;
      if(x == player.x && y == player.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION[d].x, KEY_DIRECTION[d].y)){
        await attack(enemy, player);
        return;
      }
    }
    for(let d in KEY_DIRECTION_DIAGONAL){
      let x = enemy.x + KEY_DIRECTION_DIAGONAL[d].x;
      let y = enemy.y + KEY_DIRECTION_DIAGONAL[d].y;
      if(x == player.x && y == player.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION_DIAGONAL[d].x, KEY_DIRECTION_DIAGONAL[d].y)){
        await attack(enemy, player);
        return;
      }
    }

    // プレイヤー追跡
    if(!enemy.cannot_move_flag){
      await moveEnemyChase(enemy, player);
      return;
    }
  }
  // 発見済み(くびかりぞく)
  else if(enemy.berserk_chase_flag) {
    for(let other_enemy of enemy_group){
      // スキル
      for(let skill of enemy.skill){
        if(!(Math.floor(Math.random()+skill.chance))) continue;
        if(await skill.func(enemy, other_enemy)) return;
      }

      if(enemy.berserk_flag) {
        if(other_enemy === enemy) continue; // 保険

        for(let d in KEY_DIRECTION){
          let x = enemy.x + KEY_DIRECTION[d].x;
          let y = enemy.y + KEY_DIRECTION[d].y;
          if(x == other_enemy.x && y == other_enemy.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION[d].x, KEY_DIRECTION[d].y)){
            await attack(enemy, other_enemy);
            if(await isDead(other_enemy)) addExp(enemy, other_enemy.exp);
            return;
          }
        }
        for(let d in KEY_DIRECTION_DIAGONAL){
          let x = enemy.x + KEY_DIRECTION_DIAGONAL[d].x;
          let y = enemy.y + KEY_DIRECTION_DIAGONAL[d].y;
          if(x == other_enemy.x && y == other_enemy.y && canDiagonal(enemy.x, enemy.y, KEY_DIRECTION_DIAGONAL[d].x, KEY_DIRECTION_DIAGONAL[d].y)){
            await attack(enemy, other_enemy);
            if(await isDead(other_enemy)) addExp(enemy, other_enemy.exp);
            return;
          }
        }
      }

      // プレイヤー追跡
      if(!enemy.cannot_move_flag){
        await moveEnemyChase(enemy, other_enemy);
        return;
      }
    }
  }
  // 未発見
  else{
    // 移動
    if(!enemy.cannot_move_flag){
      // 巡回
      await moveEnemyTravel(enemy);
    }
  }
}

// 視界取得
function getSight(who){
  for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]]){
    // 部屋
    if(isRoom(who.x+j, who.y+i)){
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
function getSightPath(x, y, sight_range, map_sight){
  map_sight[y][x] = true;
  for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]]){
    if(isInMap(x+j,y+i) 
      && map[y+i][x+j] != ID_MAP.none 
      && !map_sight[y+i][x+j] 
      && sight_range > 0
      && !isRoom(x, y)
      && !isRoom(x+j, y+i)){
      map_sight[y+i][x+j] = true;
      getSightPath(x+j, y+i, sight_range-1, map_sight);
    }
  }
}

function findPl(who){
  who.chase_flag = true;
  who.berserk_chase_flag = false;
  who.chase_count = who.chase_limit;
}

function findBerserk(who){
  who.berserk_chase_flag = true;
  who.chase_count = who.chase_limit;
}

// エネミー移動（追跡）
async function moveEnemyChase(who, to){
  let route
  route = astar(who.x, who.y, to.x, to.y, who.distance, who.escape_flag);  
  let dir = {
    x: route[route.length-1].x - who.x,
    y: route[route.length-1].y - who.y
  };
  // debug
  //for(let r of route)
  //  map_draw[r.y][r.x] = "√";

  return await move(who, dir);
}

// A-star
function astar(start_x, start_y, dst_x, dst_y, distance, escape_flag){
  let node = [];

  // 初期コスト計算
  let actual_cost = 0;
  let heuristic_cost = Math.max(Math.abs(dst_x-start_x), Math.abs(dst_y-start_y));
  node.push({x:start_x, y:start_y, status:"open", a_cost:actual_cost, h_cost:heuristic_cost, parent:undefined});
  
  asterRecursive(node, start_x, start_y, dst_x, dst_y, distance, escape_flag);

  let dst_node = node[node.length-1];
  let route = [];
  getRoute(route, node, dst_node);
  return route;
}

function asterRecursive(node, x, y, dst_x, dst_y, distance, escape_flag){
  // close
  node.find(v=>(v.x==x && v.y==y)).status = "closed";

  // open
  let movement_cost;
  for(let [i, j] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,-1],[-1,1]]){
    // 目的地到達判定
    if(x+j == dst_x && y+i == dst_y && canDiagonal(x, y, j, i)){
      node.push({x:x+j, y:y+i, status:"dst", parent:{x:x, y:y}});
      return;
    }
    // 探索
    else if(canMove(x+j, y+i) && canDiagonal(x, y, j, i)
      && !(node.find(v=>(v.x==x+j && v.y==y+i)))){
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
  for(let n of node){
    // 追跡
    if(!escape_flag){
      if(n.status == "open" 
        && (n.a_cost + n.h_cost) < next_node.cost){
        next_node.x = n.x;
        next_node.y = n.y;
        next_node.cost = n.a_cost + n.h_cost;
      }
    }
    // 逃亡
    else{
      if(n.status == "open" 
        && (n.a_cost + n.h_cost) > next_node.cost){
        next_node.x = n.x;
        next_node.y = n.y;
        next_node.cost = n.a_cost + n.h_cost;
      }
    }
  }
    
  if(next_node.x === undefined || next_node.y === undefined){
    // debug
    //console.log("aster: cannot reach");
    return;
  }
  
  asterRecursive(node, next_node.x, next_node.y, dst_x, dst_y, escape_flag);
  return;
}

function getRoute(route, node, n){
  if(n.parent === undefined)
    return route;
  route.push(n);
  route = getRoute(route, node, node.find(v=>(v.x==n.parent.x && v.y==n.parent.y)));
}

// エネミー移動（巡回）
async function moveEnemyTravel(enemy){
  // 新規目的地
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++)
      if(enemy.x+j==enemy.travel_x && enemy.y+i==enemy.travel_y){
        setNextTravelRoom(enemy);
        return;
      }

  let route;
  route = astar(enemy.x, enemy.y, enemy.travel_x, enemy.travel_y, 0, false);
  let dir = {
    x: route[route.length-1].x - enemy.x,
    y: route[route.length-1].y - enemy.y
  };
  // debug
  //for(let r of route)
  //  map_draw[r.y][r.x] = "√";

  return await move(enemy, dir);
}

function setNextTravelRoom(enemy){
  let room_xy = [];
  getRoomXY(enemy.x, enemy.y, room_xy);

  let next_room_x;
  let next_room_y;
  while(1){
    next_room_x = Math.floor(Math.random()*SIZEX);
    next_room_y = Math.floor(Math.random()*SIZEY);
    let break_flag = true;
    for(let xy of room_xy)
      if(next_room_x==xy.x && next_room_y==xy.y
        || !canMove(next_room_x, next_room_y) || map[next_room_y][next_room_x]!=ID_MAP.room){
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
async function moveEnemyRand(enemy){
  let rand_diagonal = Math.floor( Math.random() * 2);
  let rand_dir = Math.floor( Math.random() * 4);
  let dir_array = ["left", "right", "up", "down"];
  let dir_array_diagonal = ["up_left", "up_right", "down_left", "down_right"];

  // 垂直水平
  if(map[enemy.y][enemy.x] != ID_MAP.path || rand_diagonal){
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
function setEnemy(id, x, y){
  let enemy = ENEMY_DATA.find(v=>v.id==id);
  let e = Object.assign({}, enemy,
    {x: x, y: y, travel_x:x, travel_y:y, map_sight: [], condition: [], },
    OTHER_ENEMY_INFO);

  // スキル
  for(let s of e.skill){
    let skill = Object.assign({}, SKILL_DATA.find(v=>v.id==s.id), {chance: 0}, s);
    Object.assign(s, skill);

    // プロパティチェック
    for(let key in s)
      if(s[key] === undefined){
        console.warn("setEnemy: undefined property. ("+s.name+")");
        e.skill.splice(e.skill.indexOf(s), 1);
        break;
      }
  }
  enemy_group.push(e);
}

// エネミーグループ
// 5階層毎にテーブル変更
async function setEnemyGroup(){
  let num = Math.floor(Math.random() * (room_num*1.5 - room_num*1) + room_num*1);
  let table = [];

  if(Math.floor((floor_cnt-1)/3) in ENEMY_TABLE)
    table = ENEMY_TABLE[Math.floor((floor_cnt-1)/3)];
  else{
    table = ENEMY_TABLE[0];
    console.warn("setEnemyGroup: enemy_table of this floor not found");
  }
  if(table.length==0) return;

  for(let i=0; i<num; i++){
    const enemy_id = table[Math.floor(Math.random() * table.length)];
    const enemy = ENEMY_DATA.find(v=>v.id==enemy_id);
    let spawn_cnt = enemy.group_spawn_flag ? 2 : 1;

    for(let j=0; j<spawn_cnt; j++){
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
function setSpawnXY(priority, group_spawn_flag, id){
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
  if(group_spawn_flag && priority < 100){
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
function isEnemy(x, y){
  for(let e in enemy_group)
    if(enemy_group[e].x == x && enemy_group[e].y == y)
      return true;
  return false;
}

// エネミーの死亡判定
async function removeEnemy(enemy){
  addLog(enemy.name+" は倒れた");
  enemy_group.splice(enemy_group.indexOf(enemy), 1);
  await wait(300);
  return true;
}
