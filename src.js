window.onload = function(){
  inputName();
}

// 名前入力
function inputName(){
  ctx.textAlign = "center";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText("名前を入力してください", canvas.width/2, 0);
  
  // 入力
  if(key_input.left){
    if(input_name_pos.x > 0){
      input_name_pos.x--;
      if(hiragana[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.x--;
    }
    else
      input_name_pos.x = hiragana[0].length-1;
  }
  else if(key_input.right){
    if(input_name_pos.x < hiragana[0].length-1){
      input_name_pos.x++;
      if(hiragana[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.x++;
    }
    else
      input_name_pos.x = 0;
  }
  else if(key_input.up){
    if(input_name_pos.y > 0){
      input_name_pos.y--;
      if(hiragana[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.y--;
    }
    else
      input_name_pos.y = hiragana.length-1;
  }
  else if(key_input.down){
    if(input_name_pos.y < hiragana.length-1){
      input_name_pos.y++;
      if(hiragana[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.y++;
    }
    else
    input_name_pos.y = 0;
  }
  else if(key_input.cancel)
    player.name = player.name.slice(0, -1);
  
  // 一覧
  let lang;
  if(hiragana_katakana) lang = hiragana;
  else lang = katakana;

  for(let i=0; i<lang.length; i++)
    for(let j=0; j<lang[i].length; j++){
      if(input_name_pos.x == j && input_name_pos.y == i)
        ctx.fillText(">"+lang[i][j], canvas.width/2-font_size*9+font_size*2*j, font_size*2*(i+2));
      else
      ctx.fillText(" "+lang[i][j], canvas.width/2-font_size*9+font_size*2*j, font_size*2*(i+2));
    }

  // 決定キー
  if(key_input.apply){
    audio_apply.play();
    if(lang[input_name_pos.y][input_name_pos.x]=="消")
      player.name = player.name.slice(0, -1);

    else if(lang[input_name_pos.y][input_name_pos.x]=="ｶﾅ"){
      hiragana_katakana = !hiragana_katakana;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText("名前を入力してください", canvas.width/2, 0);

      if(hiragana_katakana) lang = hiragana;
      else lang = katakana;

      for(let i=0; i<lang.length; i++)
        for(let j=0; j<lang[i].length; j++){
          if(input_name_pos.x == j && input_name_pos.y == i)
            ctx.fillText(">"+lang[i][j], canvas.width/2-font_size*9+font_size*2*j, font_size*2*(i+2));
          else
          ctx.fillText(" "+lang[i][j], canvas.width/2-font_size*9+font_size*2*j, font_size*2*(i+2));
        }
    }

    else if(lang[input_name_pos.y][input_name_pos.x]=="終"){
      ctx.textAlign = "start";
      input_name_flag = false;
      init();
      return;
    }
    else
      player.name += lang[input_name_pos.y][input_name_pos.x];
  }

  // 文字数制限
  let name_length = 0;
  for(let c of player.name){
    if(c.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) name_length += 2;
    else name_length++;
  }
  if(name_length > name_max_length) player.name = player.name.slice(0, -1);

  // 名前描画
  let space = "";
  for(let i=0; i<name_max_length-name_length; i++)
    space += "_";
  ctx.fillText(player.name+space, canvas.width/2, font_size*3/2);
}

// 初期化
function init(){
  initStatus();
  nextFloor();
  
  updateMap();
  drawMap();

  drawInfo();
  log_reserve = [];
  drawLog();

  drawNote();
}

// ステ初期化
function initStatus(){
  player.hp = 10;
  player.hp_max = 10;
  player.mp = 0;
  player.mp_max = 0;
  player.atk = 1;
  player.atk_offset = 0;
  player.def = 1;
  player.def_offset = 0;

  player_info.job = "持たざる者";
  player_info.hung = 100;
  player_info.hung_max = 100;
  player_info.hunger_rate = 5;
  player_info.hp_regen_rate = 10;
  player_info.mp_regen_rate = 10;
  player_info.sight_range = 1;
  player_info.gold = 0;
  player_info.weapon = undefined;
  player_info.ammo = undefined;
  player_info.armor = undefined;
  player_info.ring1 = undefined;
  player_info.ring2 = undefined;
  player_info.bow = false;
  
  inventory = [];
}

function initGroups(){
  item_group = [];
  enemy_group = [];
  shop_group = [];
  npc_group = [];
}

//==================================================KEY==================================================

// 操作、各イベント
document.addEventListener("keydown", e =>{
  toggleKeyInput(e);
  // 名前入力
  if(input_name_flag) {
    key_input.key = e.key;
    inputName();
    return;
  }
  // ゲームオーバー
  else if(gameover_flag){
    turn_flag = gameoverEvent();
    drawGameover();
  }
  // ショップ
  else if(shop_flag){
    turn_flag = eventShop();
  }
  // 射撃
  else if(shot_flag){
    turn_flag = eventShot();
  }
  // 投擲
  else if(throwing_flag){
    turn_flag = eventThrowing();
  }
  // 魔法
  else if(magic_flag){
    turn_flag = eventMagic();
  }
  // UI
  else if(ui_flag){
    turn_flag = eventUI();
  }
  // マップ
  else{
    turn_flag = eventPlayer();
  }

  // ターン経過
  if(turn_flag){
    eventEnemy();
    eventEnv()
    turn_cnt++;
  }

  // 描画
  if(!gameover_flag){
    updateMap();
    drawMap();
    drawInfo();
    drawLog();
  }
});

function toggleKeyInput(e){
  if(e.key==key_code.left) key_input.left = true;
  if(e.key==key_code.right) key_input.right = true;
  if(e.key==key_code.up) key_input.up = true;
  if(e.key==key_code.down) key_input.down = true;
  if(key_input.left && key_input.up) key_input.up_left = true;
  if(key_input.right && key_input.up) key_input.up_right = true;
  if(key_input.left && key_input.down) key_input.down_left = true;
  if(key_input.right && key_input.down) key_input.down_right = true;
  if(e.key==key_code.shift) key_input.shift = true;
  if(e.key==key_code.ctrl) key_input.ctrl = true;
  if(e.key==key_code.apply) key_input.apply = true;
  if(e.key==key_code.cancel) key_input.cancel = true;
  if(e.key==key_code.sub) key_input.sub = true;
  if(e.key==key_code.esc) key_input.esc = true;
}

document.addEventListener("keyup", e=>{
  if(e.key==key_code.left) key_input.left = false;
  if(e.key==key_code.right) key_input.right = false;
  if(e.key==key_code.up) key_input.up = false;
  if(e.key==key_code.down) key_input.down = false;
  if(!key_input.left || !key_input.up) key_input.up_left = false;
  if(!key_input.right || !key_input.up) key_input.up_right = false;
  if(!key_input.left || !key_input.down) key_input.down_left = false;
  if(!key_input.right || !key_input.down) key_input.down_right = false;
  if(e.key==key_code.shift) key_input.shift = false;
  if(e.key==key_code.ctrl) key_input.ctrl = false;
  if(e.key==key_code.apply) key_input.apply = false;
  if(e.key==key_code.cancel) key_input.cancel = false;
  if(e.key==key_code.sub) key_input.sub = false;
  if(e.key==key_code.esc) key_input.esc = false;
});

//==================================================EVENT==================================================

// プレイヤーイベント
// @return: true: ターン経過
function eventPlayer(){
  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = key_direction;
  else kd = key_direction_diagonal;
  for(let k in kd)
    if(key_input[k]){
      let x = player.x + kd[k].x;
      let y = player.y + kd[k].y;
      if(isEnemy(x, y)){
        let enemy = enemy_group.find(v=>(v.x==x && v.y==y));
        attack(player, enemy);
        isDead(enemy);
        return true;
      }
      else if(isShop(x, y)){
        shop_using = shop_group.find(v=>v.x==x && v.y==y);
        addLog(shop_using.name+"「"+shop_using.dialogue_intro+"」");
        audio_apply.play();
        shop_using.func_before();
        shop_cursor = 0;
        shop_flag = true;
        return false;
      }
      else if(isNPC(x, y)){
        let npc = npc_group.find(v=>v.x==x && v.y==y);
        addLog(npc.name+"「"+npc.dialogue[npc.dialogue_cnt]+"」");
        audio_apply.play();
        if(npc.dialogue_cnt<npc.dialogue.length-1) npc.dialogue_cnt++;
        npc.func();
        return true;
      }
      if(!key_input.shift)
        return move(player, kd[k]);
      else{
        sprint(kd[k]);
        return false;
      }
    }
  
  // apply
  if(key_input.apply){
    if(map[player.y][player.x] == id_map.stair){
      audio_stair.play();
      nextFloor();
    }
    else if(map[player.y][player.x] == id_map.portal){
      audio_portal.play();
      floor_cnt = -1;
      nextFloor();
    }
    else{
      addLog("待機した");
      audio_apply.play();
      return true;
    }
  }
  // cancel
  if(key_input.cancel){
    audio_apply.play();
    inv_cursor = 0;
    ui_flag = true;
    return false;
  }
  // sub
  if(key_input.sub){
    if(!player_info.bow){
      addLog("弓を装備していない");
      return false;
    }
    else if(!player_info.ammo){
      addLog("矢を装備していない");
      return false;
    }
    addLog("弓を構えた");
    audio_apply.play();
    shot_flag = true;
    return false;
  }
}

// 攻撃
function attack(from, to){
  let dmg = (from.atk + from.atk_offset) -(to.def + to.def_offset);
  if(dmg<0) dmg = 0;
  addHP(to, -dmg);
  
  addLog(from.name+" の攻撃　"+to.name+" に "+dmg+" のダメージ");
  audio_hit.play();

  return dmg;
}

// 移動
function move(who, direction){
  let new_x = who.x + direction.x;
  let new_y = who.y + direction.y;
  if(canMove(new_x,new_y)){
    who.x = new_x;
    who.y = new_y;
    return true;
  }
  return false;
}

// 高速移動
function sprint(direction){
  if(!canMove(player.x+direction.x, player.y+direction.y))
    return;
  for(let i=-2; i<=2; i++)
    for(let j=-2; j<=2; j++)
      if(isEnemy(player.x+j, player.y+i))
        return;
  if(isItem(player.x+direction.x, player.y+direction.y))
    return;
  
  move(player, direction);
  eventEnemy();
  eventEnv();
  turn_cnt++;

  // 視界更新
  updateSight();
  updateMapDraw();
  updateMDWall();

  sprint(direction);
}

// UIイベント
function eventUI(){
  // 上下
  if(key_input.up && inv_cursor > 0){
    inv_cursor--;
    return false;
  }
  if(key_input.down && inv_cursor < inventory_size - 1){
    inv_cursor++;
    return false;
  }
  // apply
  if(key_input.apply)
    if(useItem(inv_cursor)){
      audio_apply.play();
      inv_cursor = -1;
      ui_flag = false;
      return true;
    }
  // cancel
  if(key_input.cancel){
    inv_cursor = -1;
    ui_flag = false;
    return false;
  }
  // sub
  if(key_input.sub){
    if(checkThrowing(inv_cursor)){
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
  if(key_input.up && shop_cursor > 0){
    shop_cursor--;
    return false;
  }
  if(key_input.down && shop_cursor < shop_using.item.length - 1){
    shop_cursor++;
    return false;
  }
  // apply
  if(key_input.apply){
    if(player_info.gold >= shop_using.item[shop_cursor].price){
      if(addItem(shop_using.item[shop_cursor].id)){
        audio_apply.play();
        player_info.gold -= shop_using.item[shop_cursor].price;
        shop_using.item.splice(shop_cursor, 1);
        shop_using.func_buy();
      }
    }
    else
      addLog("金貨が足りない");
    return false;
  }
  // cancel
  if(key_input.cancel){
    addLog(shop_using.name+"「"+shop_using.dialogue_outro+"」");
    shop_using.func_after();
    shop_using = undefined;
    shop_cursor = -1;
    shop_flag = false;
    return true;
  }
}

// ショップ配置
function setShop(id, x, y){
  if(map[y][x] != id_map.room)
    return false;

  let shop = shop_data.find(v=>v.id==id);
  let shop_info = {};
  let item = [];

  if(shop.random_flag)
    for(let n=0; n<shop.item_num; n++){
      let i = shop.item_table[Math.floor(Math.random()*shop.item_table.length)];
      let item_info = {};
      Object.assign(item_info, item_data.find(v=>v.id==i.id), {price: i.price});
      item.push(item_info);
    }
  else
    for(let i of shop.item_table){
      let item_info = {};
      Object.assign(item_info, item_data.find(v=>v.id==i.id), {price: i.price});
      item.push(item_info);
    }
  Object.assign(shop_info, shop, {x: x, y: y, item: item});
  
  shop_group.push(shop_info);
  return true;
}

function isShop(x, y){
  for(let s in shop_group)
    if(shop_group[s].x == x && shop_group[s].y == y)
      return true;

  return false;
}

// NPC配置
function setNPC(id, x, y){
  let npc = npc_data.find(v=>v.id==id);
  let npc_info = {};
  Object.assign(npc_info, npc, {x: x, y: y});
  
  npc_group.push(npc_info);
}

function isNPC(x, y){
  for(let n in npc_group)
    if(npc_group[n].x == x && npc_group[n].y == y)
      return true;

  return false;
}

// 射撃イベント
function eventShot(){
  let ammo = player_info.ammo;

  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = key_direction;
  else kd = key_direction_diagonal;
  for(let k in kd)
    if(key_input[k]){
      addLog(player.name+" は "+ammo.name+" を放った");
      audio_shot.play();
      shot(player, ammo, kd[k], ammo.dmg);
      if(ammo.stack_num > 0) ammo.stack_num--;
      if(ammo.stack_num <= 0){
        equipPlayer(inventory.indexOf(ammo));
        log_reserve.pop();
        inventory.splice(inventory.indexOf(ammo), 1);
      }
      shot_flag = false;
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
function shot(who, item, direction, throwing_dmg){
  let dst = straightRecursive(who.x, who.y, direction);
  if(isEnemy(dst.x+direction.x, dst.y+direction.y)){
      let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
      shotDmg(who, enemy, throwing_dmg);
      if(who == player) enemy.chase_flag = true;
  }
  else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y){
      shotDmg(who, player, throwing_dmg);
  }
  else if(item){  // 外した矢のアイテム化
    if(!isItem(dst.x, dst.y))
      setItem(item.id, dst.x, dst.y);
    else{
      for(let s=1; s<SIZEX; s++)
        for(let i=-s; i<=s; i++)
          for(let j=-s; j<=s; j++)
            if(canMove(dst.x+j, dst.y+i) && !isItem(dst.x+j, dst.y+i)){
              setItem(item.id, dst.x+j, dst.y+i);
              return;
            }
    }
  }
}

function shotDmg(from, to, throwing_dmg){
  let dmg = Math.floor(from.atk/2)-(to.def+to.def_offset)+throwing_dmg;
  if(dmg < 0) dmg = 0;
  addHP(to, -dmg);
  addLog(to.name+" に "+dmg+" のダメージ");
}

function straightRecursive(x, y, direction){
  if(!canMove(x+direction.x, y+direction.y))
    return {x:x, y:y};
  let dst = straightRecursive(x+direction.x, y+direction.y, direction);
  return dst;
}

// 投擲イベント
function eventThrowing(){
  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = key_direction;
  else kd = key_direction_diagonal;
  for(let k in kd)
    if(key_input[k]){
      addLog(player.name+" は "+inventory[inv_cursor].name+" を投擲した");
      audio_shot.play();

      let item = inventory[inv_cursor]
      shot(player, item, kd[k], 0);
      // インベントリから削除
      if(stack_type.includes(item.type)){
        if(item.stack_num > 0) item.stack_num--;
        if(inventory[inv_cursor].stack_num <= 0){
          inventory.splice(inv_cursor, 1);
        }
      }
      else
        inventory.splice(inv_cursor, 1);

      inv_cursor = -1;
      throwing_flag = false;
      ui_flag = false;
      return true;
    }
  
  // cancel
  if(key_input.cancel){
    addLog("投擲をやめた");
    throwing_flag = false;
    ui_flag = false;
    return false;
  }
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
function eventMagic(){
  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = key_direction;
  else kd = key_direction_diagonal;
  for(let k in kd)
    if(key_input[k]){
      magic_using.func_cast(kd[k]);
      
      magic_flag = false;
      magic_using = undefined;
      ui_flag = false;
      inv_cursor = -1;
      return true;
    }
  
  // cancel
  if(key_input.cancel){
    addLog("構えを解いた");
    magic_flag = false;
    magic_using = undefined;
    return false;
  }
}

// ゲームオーバー
function gameoverEvent(){
  if(key_input.esc){
    turn_cnt = 1;
    floor_cnt = -1;
    gameover_flag = false;
    init();
  }
  return false;
}

function gameover(){
  addLog("ゲームオーバー");
  drawGameover();
  drawLog();
  drawInfo();
  gameover_flag = true;
}

function drawGameover(){
  let gameover_fig = [
    "       ______       ",
    "     ／      ＼     ",
    "   ／          ＼   ",
    "  |     REST     |  ",
    "  |      IN      |  ",
    "  |    PEACE     |  ",
    "  |              |  ",
    "  |              |  ",
    "  |              |  ",
    "  |              |  ",
    "  |              |  ",
    "  |              |  ",
    "＼(//))＼/(_/)＼))//",
  ];

  // 描画
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  for(let i=0; i<gameover_fig.length-1; i++){
    ctx.fillText(gameover_fig[i], canvas.width/2, font_size*i);
  }

  ctx.fillText(player.name, canvas.width/2, font_size*7);
  ctx.fillText(date+" "+month, canvas.width/2, font_size*9);
  ctx.fillText(year, canvas.width/2, font_size*10);

  ctx.fillStyle = "green";
  ctx.fillText(gameover_fig[gameover_fig.length-1], canvas.width/2, font_size*(gameover_fig.length-1));

  //Press Esc Key
  ctx.textAlign = "start";
  ctx.fillStyle = "white";
  ctx.fillText("Press Esc key", canvas.width/2 + gameover_fig.length/2, font_size*(gameover_fig.length));
}

//==================================================STATUS==================================================

// HP増減
function addHP(who, value){
  who.hp += value;
  if(who.hp > who.hp_max)
    who.hp = who.hp_max;
  else if(who.hp < 0)
    who.hp = 0;
}

// MP増減
function addMP(who, value){
  who.mp += value;
  if(who.mp > who.mp_max)
    who.mp = who.mp_max;
  else if(who.mp < 0)
    who.mp = 0;
}

// Hunger増減
// プレイヤー専用
function addHung(value){
  player_info.hung += value;
  if(player_info.hung > player_info.hung_max)
    player_info.hung = player_info.hung_max;
  if(player_info.hung < 0)
    player_info.hung = 0;
}

// 全回復
function fullRecovery(who){
  addLog(who.name+" は全快した");
  who.hp = who.hp_max;
  who.mp = who.mp_max;
  if(who == player) player_info.hung = player_info.hung_max;
}

function isDead(who){
  if(who.hp <= 0){
    if(who == player)
      gameover();
    else
      removeEnemy(who);
    return true;
  }
  return false;
}

//==================================================ITEM==================================================

// アイテム使用
function useItem(index){
  if(equip_type.includes(inventory[index].type)){
    return equipPlayer(index);
  }
  else{
    return inventory[index].func();
  }
}

// プレイヤー装備切り替え
function equipPlayer(index){
  let equip_item = inventory[index];
  // 装備する
  if(!(equip_item.equip_flag)){
    // 装備欄チェック
    if(player_info[equip_item.type]){
      addLog("装備スロットが埋まっている");
      return false;
    }
    // 指輪
    else if(player_info[equip_item.type+"1"]
      && player_info[equip_item.type+"2"]){
      addLog("装備スロットが埋まっている");
      return false;
    }

    // 装備スロット更新
    equip_item.equip_flag = true;
    if(multiple_slot.includes(equip_item.type)){
      if(!player_info[equip_item.type+"1"]
        && player_info[equip_item.type+"2"])
        player_info[equip_item.type+"1"] = equip_item;
      else if(player_info[equip_item.type+"1"]
        && !player_info[equip_item.type+"2"])
        player_info[equip_item.type+"2"] = equip_item;
      else
        player_info[equip_item.type+"1"] = equip_item;
    }
    else
      player_info[equip_item.type] = equip_item;
    
    equip_item.func_equip(player);

    addLog(equip_item.name+" を装備した");
    return true;
  }
  // 外す
  else{
    // 装備スロット更新
    equip_item.equip_flag = false;
    if(multiple_slot.includes(equip_item.type)){
      if(player_info[equip_item.type+"1"] == equip_item)
        player_info[equip_item.type+"1"] = undefined;
      else if(player_info[equip_item.type+"2"] == equip_item)
        player_info[equip_item.type+"2"] = undefined;
    }
    else
      player_info[equip_item.type] = undefined;
    
    equip_item.func_unequip(player);

    addLog(equip_item.name+" を外した");
    return true;
  }
}

// アイテム取得
function addItem(id){
  let item = item_data.find(v=>v.id==id);
  // スタックアイテム
  if(item.type=="stack"){
    if(inventory.length < inventory_size){
      for(let i=0; i<item.num; i++){
        addItem(item.item_id);
        log_reserve.pop();
      }
      addLog(item.name+" を入手");
      return true;
    }
    for(let i of inventory){
      if(i.id == item.item_id && i.stack_num < stack_max){
        if(i.stack_num + item.num <= stack_max){
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

  let item_info = {};
  Object.assign(item_info, item);
  // 装備品
  if(equip_type.includes(item.type)){
    Object.assign(item_info, {equip_flag: false});
  }
  // スタック可能アイテム
  if(stack_type.includes(item.type)){
    let index = getStackIndex(item);
    if(!(index===undefined)){
      inventory[index].stack_num++;
      addLog(item.name+" を入手");
      return true;
    }
    Object.assign(item_info, {stack_num: 1});
  }
  
  if(inventory.length >= inventory_size){
    addLog("持ちきれない");
    return false;
  }
  
  inventory.push(item_info);
  addLog(item.name+" を入手");
  return true;
}

// スタックアイテム加算
function getStackIndex(item){
  for(let i of inventory)
    if(i.id==item.id && i.stack_num < stack_max){
      return inventory.indexOf(i);  // スタックできるアイテムがある
    }
  return undefined;
}

// アイテム設置
function setItem(id, x, y){
  if(!canMove(x, y)
    || map[y][x] == id_map.path
    || item_group.find(v=>(v.x==x && v.y==y)))
    return false;

  let item_info = {};
  Object.assign(item_info, item_data.find(v=>v.id==id), {x: x, y: y});
  
  item_group.push(item_info);
  return true;
}

// フィールドアイテム
function setItemField(){
  let num = Math.floor(Math.random() * (room_num*1 - room_num*0) + room_num*0);
  let table = [];
  
  if(Math.floor(floor_cnt/5) in item_group_table)
    table = item_group_table[Math.floor(floor_cnt/5)];
  else
    table = item_group_table[0];

  for(let i=0; i<num; i++){
    const x = Math.floor(Math.random() * (SIZEX-1 - 1) + 1);
    const y = Math.floor(Math.random() * (SIZEY-1 - 1) + 1);
    const item = Math.floor(Math.random() * table.length);
    
    if(!setItem(table[item], x, y))
      i--;
  }
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
function eventEnv(){
  // 自然回復
  if(turn_cnt % player_info.hp_regen_rate == 0)
    addHP(player, 1);
  if(turn_cnt % player_info.mp_regen_rate == 0)
    addMP(player, 1);

  // 空腹度
  if(!safe_flag && turn_cnt % player_info.hunger_rate == 0){
    if(player_info.hung > 0){
      addHung(-1);
      if(player_info.hung == 25)
        addLog("空腹を感じる");
      if(player_info.hung == 10)
        addLog("耐え難い空腹");
    }
    else{
      addHP(player, -1);
      addLog("空腹で 1 のダメージ");
      audio_hit.play();
    }
  }

  // 毒沼
  if(map[player.y][player.x] == id_map.poison){
    let dmg = Math.floor(Math.random() * (3 - 1) + 1);
    addHP(player, -dmg);
    addLog("毒沼だ　"+dmg+" のダメージ");
    audio_hit.play();
  }

  // 死亡判定
  isDead(player);

  // 階段に乗ってる
  if(map[player.y][player.x] == id_map.stair){
    addLog("階段 (降りる:z)");
  }
  // ポータルに乗ってる
  if(map[player.y][player.x] == id_map.portal){
    addLog("帰還ポータル (入る:z)");
  }
  
  // アイテム取得
  for(let i of item_group)
    if(i.x == player.x && i.y == player.y){
      if(i.id==0x000){
        player_info.gold += 5;
        audio_apply.play();
        addLog("金貨5枚 を入手")
        item_group.splice(item_group.indexOf(i), 1);
      }
      else if(addItem(i.id)){
        audio_apply.play();
        item_group.splice(item_group.indexOf(i), 1);
      }
    }
}

// 階層移動
function nextFloor(){
  addLog("次の階層へ移動した");

  initMaps();
  initGroups();

  turn_cnt = 1;
  floor_cnt++;
  clairvoyance_flag = false;

  if(um = unique_map.find(v=>v.id==floor_cnt)){
    generateUniqueMap(um);
    
    if(um.safe_flag) safe_flag = true;
    else safe_flag = false;
  }
  else if(floor_cnt%5 == 0){  // 帰還ポータル階
    generateUniqueMap(unique_map.find(v=>v.id=="return"));
    safe_flag = true;
  }
  else{
    generateMap();

    setStair();
    setPoisonFloor();
    setItemField();
    setEnemyGroup();
    setPlayerPos();

    safe_flag = false;
  }
}

//==================================================ENEMY==================================================

// エネミーイベント
function eventEnemy(){
  for(let e in enemy_group){
    let enemy = enemy_group[e];
    if(isDead(enemy)) continue;
    // 攻撃
    if(!enemy.throwing){
      for(let d in key_direction){
        let x = enemy.x + key_direction[d].x;
        let y = enemy.y + key_direction[d].y;
        if(x == player.x && y == player.y){
          attack(enemy, player);
          continue;
        }
      }
      for(let d in key_direction_diagonal){
        let x = enemy.x + key_direction_diagonal[d].x;
        let y = enemy.y + key_direction_diagonal[d].y;
        if(x == player.x && y == player.y){
          attack(enemy, player);
          continue;
        }
      }
    }
    // 射撃
    else if(isSameRoom(enemy.x, enemy.y, player.x, player.y)){
      for(let d in key_direction){
        let xy = straightRecursive(enemy.x, enemy.y, key_direction[d]);
        if(xy.x+key_direction[d].x == player.x && xy.y+key_direction[d].y == player.y){
          let ammo = item_data.find(v=>v.id==enemy.throwing);
          addLog(enemy.name+" は "+ammo.name+" を射出した");
          audio_shot.play();
          shot(enemy, undefined, key_direction[d], ammo.dmg);
          continue;
        }
      }
      for(let d in key_direction_diagonal){
        let xy = straightRecursive(enemy.x, enemy.y, key_direction_diagonal[d]);
        if(xy.x+key_direction_diagonal[d].x == player.x && xy.y+key_direction_diagonal[d].y == player.y){
          let ammo = item_data.find(v=>v.id==enemy.throwing);
          addLog(enemy.name+" は "+ammo.name+" を射出した");
          audio_shot.play();
          shot(enemy, undefined, key_direction_diagonal[d], ammo.dmg);
          continue;
        }
      }
    }

    // 移動
    for(let cnt=0; cnt<enemy.speed; cnt++)
      if(isSameRoom(enemy.x, enemy.y, player.x, player.y) || enemy.chase_flag){
        enemy.chase_flag = true;
        moveEnemyChase(enemy);
      }
      else
        moveEnemyRand(enemy);
      
    // 毒沼
    if(map[enemy.y][enemy.x] == id_map.poison){
      let dmg = Math.floor(Math.random() * (3 - 1) + 1);
      addHP(enemy, -dmg);
      if(isDead(enemy)) continue;
    }
  }
}

// エネミー移動(追跡)
function moveEnemyChase(enemy){
  let route
  route = astar(enemy.x, enemy.y, player.x, player.y);
  
  let dir = {
    x: route[route.length-1].x - enemy.x,
    y: route[route.length-1].y - enemy.y
  };

  return move(enemy, dir);
}

// A-star
function astar(start_x, start_y, dst_x, dst_y){
  let node = [];

  // 初期コスト計算
  let actual_cost = 0;
  let heuristic_cost = Math.max(Math.abs(dst_x-start_x), Math.abs(dst_y-start_y));
  node.push({x:start_x, y:start_y, status:"open", a_cost:actual_cost, h_cost:heuristic_cost, parent:undefined});
  
  asterRecursiveEight(node, start_x, start_y, dst_x, dst_y);

  let dst_node = node[node.length-1];
  let route = [];
  getRoute(route, node, dst_node);
  return route;
}

function asterRecursiveEight(node, x, y, dst_x, dst_y){
  // close
  node.find(v=>(v.x==x && v.y==y)).status = "closed";

  // open
  let movement_cost;
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++){
      // 目的地到達判定
      if(x+j == dst_x && y+i == dst_y){
        node.push({x:x+j, y:y+i, status:"dst", parent:{x:x, y:y}});
        return;
      }
      // 探索
      else if(canMove(x+j, y+i) 
        && !(node.find(v=>(v.x==x+j && v.y==y+i)))){
        // 移動コスト
        if(map[y+i][x+j] == id_map.poison)
          movement_cost = 3;
        else
          movement_cost = 1;
        let a_cost = node.find(v=>(v.x==x && v.y==y)).a_cost + movement_cost;
        let h_cost = Math.max(Math.abs(dst_x-(x+j)), Math.abs(dst_y-(y+i)));
        node.push({x:x+j, y:y+i, status:"open", a_cost:a_cost, h_cost:h_cost, parent:{x:x,y:y}});
      }
    }

  // 基準ノード選出
  let next_node = {cost: SIZEX+SIZEY};
  for(let n of node)
    if(n.status == "open" 
      && (n.a_cost + n.h_cost) < next_node.cost){
      next_node.x = n.x;
      next_node.y = n.y;
      next_node.cost = n.a_cost + n.h_cost;
    }
  if(next_node.x == undefined || next_node.y == undefined){
    console.warn("aster: cannot reach");
    return;
  }
  
  asterRecursiveEight(node, next_node.x, next_node.y, dst_x, dst_y);
  return;
}

function getRoute(route, node, n){
  if(n.parent == undefined)
    return route;
  route.push(n);
  route = getRoute(route, node, node.find(v=>(v.x==n.parent.x && v.y==n.parent.y)));
}

// エネミー移動(ランダム)
function moveEnemyRand(enemy){
  let rand_diagonal = Math.floor( Math.random() * 2);
  let rand_dir = Math.floor( Math.random() * 4);
  let dir_array = ["left", "right", "up", "down"];
  let dir_array_diagonal = ["up_left", "up_right", "down_left", "down_right"];

  // 垂直水平
  if(map[enemy.y][enemy.x] != id_map.path || rand_diagonal){
    let dir = key_direction[dir_array[rand_dir]];
    return move(enemy, dir);
  }
  // 斜め
  else{
    let dir = key_direction_diagonal[dir_array_diagonal[rand_dir]];
    return move(enemy, dir);
  }
}

// エネミー追加
function setEnemy(id, x, y){
  if(map[y][x] != id_map.room || isEnemy(x,y))
    return false;

  let enemy = enemy_data.find(v=>v.id==id);
  let enemy_info = {};
  if(enemy.equip_flag)
    Object.assign(enemy_info, enemy, {x: x, y: y, atk_offset: 0, def_offset:0, chase_flag: false, equip_id:undefined});
  else
    Object.assign(enemy_info, enemy, {x: x, y: y, atk_offset: 0, def_offset:0, chase_flag: false});
  
  enemy_group.push(enemy_info);
  return true;
}

// エネミーグループ
// 5階層毎にテーブル変更
function setEnemyGroup(){
  let num = Math.floor(Math.random() * (room_num*1.5 - room_num*1) + room_num*1);
  let table = [];

  if(Math.floor(floor_cnt/5) in enemy_table)
    table = enemy_table[Math.floor(floor_cnt/5)];
  else{
    table = enemy_table[0];
    console.warn("setEnemyGroup: enemy_table of this floor not found");
  }

  for(let i=0; i<num; i++){
    const x = Math.floor(Math.random() * (SIZEX-1 - 1) + 1);
    const y = Math.floor(Math.random() * (SIZEY-1 - 1) + 1);
    const enemy = Math.floor(Math.random() * table.length);
    
    if(!setEnemy(table[enemy], x, y))
      i--;
  }
}

// エネミーがいるか
function isEnemy(x, y){
  for(let e in enemy_group)
    if(enemy_group[e].x == x && enemy_group[e].y == y)
      return true;

  return false;
}

// エネミーの死亡判定
function removeEnemy(enemy){
  addLog(enemy.name+" は倒れた");
  enemy_group.splice(enemy_group.indexOf(enemy), 1);
  return true;
}

//==================================================MAP==================================================

// 描画
function drawMap(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i=0; i<SIZEY; i++){
    for(let j=0; j<SIZEX; j++){
      if(!map_sight[i][j]){
        ctx.fillStyle = "gray"
        ctx.fillText(map_draw[i][j], font_size/2*j, font_size*i);
      }
      else if(map[i][j] == id_map.poison){
        ctx.fillStyle = "purple";
        ctx.fillText(map_draw[i][j], font_size/2*j, font_size*i);
      }
      else{
        if(map_draw[i][j].match(/[a-zA-Z]/))
          ctx.fillStyle = "red";
        else if(map_draw[i][j].match(/#|\.|\+|\||\-/))
          ctx.fillStyle = "white";
        else if(map_draw[i][j].match(/\%|\<|\^/))
          ctx.fillStyle = "blue";
        else
          ctx.fillStyle = "yellow";
        ctx.fillText(map_draw[i][j], font_size/2*j, font_size*i);
      }
    }
  }
}

// 描画マップ更新
function updateMap(){
  // 視界更新
  updateSight();
  // 描画マップ更新
  updateMapDraw();
  // 壁追加
  updateMDWall();
  // 毒沼
  updateMDPoison();

  // アイテム
  updateMDItem();
  // エネミー
  updateMDEnemyGroup();
  // ショップ
  updateMDShopGroup();
  // NPC
  updateMDNPCGroup();
  // プレイヤー
  map_draw[player.y][player.x] = char_map.player;
}

// 視界更新
function updateSight(){
  if(!clairvoyance_flag){
    map_sight = initMap(map_sight, false);
    updateSightRoom(player.x, player.y);
    updateSightPath(player.x, player.y, player_info.sight_range);
  }
}

function updateSightRoom(x, y){
  for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]])
    if(isRoom(x+j, y+i)){
      let map_room = [];
      getRoomXY(x+j, y+i, map_room);
      for(let r of map_room)
        map_sight[r.y][r.x] = true;
    }
}

// ちょっと雑
function updateSightPath(x, y, sight_range){
  map_sight[y][x] = true;
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++)
      if(isInMap(x+j,y+i) && map[y+i][x+j] != id_map.none
      && !map_sight[y+i][x+j] && sight_range > 0){
        if(isRoom(x+j, y+i)) return;
        map_sight[y+i][x+j] = true;
        updateSightPath(x+j, y+i, sight_range-1);
      }
}

// 描画マップ更新
function updateMapDraw(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++)
      if(map_sight[i][j])
        map_draw[i][j] = char_map[map[i][j]];
      else if(map[i][j] != id_map.none
        && map_draw[i][j] != char_map[0])
        map_draw[i][j] = char_map[map[i][j]];
}

// 壁更新
function updateMDWall(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++){
      if(map_sight[i][j] && map[i][j] == id_map.none){
        // 横線
        if((isInMap(j, i-1) && ![id_map.none, id_map.path].includes(map[i-1][j]))
          || (isInMap(j, i+1) && ![id_map.none, id_map.path].includes(map[i+1][j]))){
          map_draw[i][j] = char_map.wall_h;
          continue;
        }
        // 縦線
        if((isInMap(j-1, i) && ![id_map.none, id_map.path].includes(map[i][j-1]))
          || (isInMap(j+1, i) && ![id_map.none, id_map.path].includes(map[i][j+1]))){
          map_draw[i][j] = char_map.wall_v;
          continue;
        }
        // 角
        if(map_draw[i][j] != char_map.wall_v && map_draw[i][j] != char_map.wall_h)
          for(let n of [-1, 1])
            for(let m of [-1, 1])
              if(isInMap(j+m, i+n) && ![id_map.none, id_map.path].includes(map[i+n][j+m]))
                map_draw[i][j] = char_map.wall_h;
      }
      // 扉
      else if(map_draw[i][j] == char_map[2]){
        for(let n of [-1, 1])
          for(let m of [-1, 1])
            if(isInMap(j+m, i+n) && ![id_map.none, id_map.path].includes(map[i+n][j+m]))
              map_draw[i][j] = char_map.door;
      }
    }
}

// 毒沼
function updateMDPoison(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++){
      if(map_draw[i][j] == id_map.poison)
        map_draw[i][j] = id_map.room;
    }
}

// エネミー描画
function updateMDEnemyGroup(){
  for(let e of enemy_group)
    if(map_sight[e.y][e.x])
      map_draw[e.y][e.x] = e.char;
}

// ショップ描画
function updateMDShopGroup(){
  for(let s of shop_group)
    if(map_sight[s.y][s.x])
      map_draw[s.y][s.x] = char_map.npc;
}

// NPC描画
function updateMDNPCGroup(){
  for(let s of npc_group)
    if(map_sight[s.y][s.x])
      map_draw[s.y][s.x] = char_map.npc;
}

// アイテム描画
function updateMDItem(){
  for(let i of item_group)
    if(map_sight[i.y][i.x])
      map_draw[i.y][i.x] = i.char;
}

function isInMap(x, y){
  if(0 <= x && x < SIZEX && 0 <= y && y < SIZEY)
    return true;
  return false;
}

function isRoom(x, y){
  if(![id_map.path, id_map.none].includes(map[y][x]))
    return true;
  return false;
}

function isSameRoom(a_x, a_y, b_x, b_y){
  let checked_map = [];
  getRoomXY(a_x, a_y, checked_map);

  for(let i of checked_map)
    if(i.x==b_x && i.y==b_y)
      return true;
  return false;
}

function getRoomXY(x, y, checked_map){
  checked_map.push({x:x, y:y});
  if(!isRoom(x, y)) return;
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++){
      if(!(checked_map.find(v=>v.x==x+j && v.y==y+i)))
        getRoomXY(x+j, y+i, checked_map);
    }
}

function canMove(x, y){
  if(isInMap(x,y) 
    && !(map[y][x] == id_map.none)
    && !isEnemy(x,y)
    && !isShop(x,y)
    && !isNPC(x,y)
    && !(x==player.x && y==player.y)
  )
    return true;
  return false;
}

// 千里眼
function clairvoyance(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++)
      map_sight[i][j] = true;
}

//==================================================MAP GEN==================================================

// プレイヤー位置設定
function setPlayerPos(){
  let x = Math.floor( Math.random() * (SIZEX - 1) + 1);
  let y = Math.floor( Math.random() * (SIZEY - 1) + 1);

  if(canMove(x, y)){
    player.x = x;
    player.y = y;
    return;
  }
  setPlayerPos();
}

function setPlayerPosManual(x, y){
  player.x = x;
  player.y = y;
}

// 階段設置
function setStair(){
  let x = Math.floor( Math.random() * (SIZEX-1 - 1) + 1);
  let y = Math.floor( Math.random() * (SIZEY-1 - 1) + 1);
  
  if(map[y][x] == id_map.room){
    map[y][x] = id_map.stair;
    return;
  }
  setStair();
}

// 毒沼設置
function setPoisonFloor(){
  let num = Math.floor( Math.random() * room_num);
  for(let n=0; n<num; n++){
    let x = Math.floor( Math.random() * (SIZEX-2 - 2) + 2);
    let y = Math.floor( Math.random() * (SIZEY-2 - 2) + 2);
    
    for(let i=-1; i<=1; i++)
      for(let j=-1; j<=1; j++)
        if(map[y+i][x+j] == id_map.room)
          map[y+i][x+j] = id_map.poison;
  }
}

// マップ自動生成
function generateMap(){
  let path_anchor = [];
  room_num = 0;

  // 部屋生成
  for(let i=0; i<ROOMNUM; i++)
    if(genRoom(path_anchor))
      room_num++;

  // 通路生成
  genPath(path_anchor);

  // DEBUG: マップ全表示
  //clairvoyance();
}

// 部屋生成
function genRoom(path_anchor){
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
      && map[anchor_y+j][anchor_x+k] == id_map.room)
        return false;
  
  // 生成
  for(let j=0; j<room_h; j++)
    for(let k=0; k<room_w; k++)
      map[anchor_y+j][anchor_x+k] = id_map.room;
  
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
function genPath(path_anchor){
  let result_couple = [];

  // アンカー間が最短のペア
  for(let i of path_anchor){
    let min_distance = SIZEX*SIZEX + SIZEY*SIZEY;
    let result_i;
    let result_j;

    for(let j of path_anchor){
      if(i==j) 
        continue;
      
      let dis_x = i.x - j.x;
      let dis_y = i.y - j.y;

      if(min_distance > dis_x*dis_x + dis_y*dis_y){
        result_i = i;
        result_j = j;
      }
    }
    result_couple.push({i: result_i, j: result_j});
  }
  
  // 生成
  for(let n of result_couple){
    let array_xy;

    if(n.i.y < n.j.y && n.i.x < n.j.x)
      array_xy = {low_y: n.i.y, high_y: n.j.y, low_x: n.i.x, high_x: n.j.x};
    else if(n.i.y >= n.j.y && n.i.x < n.j.x)
      array_xy = {low_y: n.j.y, high_y: n.i.y, low_x: n.i.x, high_x: n.j.x};
    else if(n.i.y >= n.j.y && n.i.x >= n.j.x)
      array_xy = {low_y: n.j.y, high_y: n.i.y, low_x: n.j.x, high_x: n.i.x};
    else if(n.i.y < n.j.y && n.i.x >= n.j.x)
      array_xy = {low_y: n.i.y, high_y: n.j.y, low_x: n.j.x, high_x: n.i.x};

    for(let m=array_xy.low_y; m<array_xy.high_y+1; m++){
      if(map[m][n.i.x] == id_map.none)
        map[m][n.i.x] = id_map.path;
    }
    for(let m=array_xy.low_x; m<array_xy.high_x+1; m++){
      if(map[n.j.y][m] == id_map.none)
        map[n.j.y][m] = id_map.path;
    }
  }
}

// 固有マップ生成
function generateUniqueMap(um){
  let x_offset = Math.floor(SIZEX/2-um.map[0].length/2);
  for(let i=0; i<um.map.length; i++){
    let s = um.map[i].split("");
    for(let j=x_offset; j<s.length+x_offset; j++)
      map[i][j] = Number(s[j-x_offset]);
  }

  setPlayerPosManual(um.pl_x+x_offset, um.pl_y);
  um.func(x_offset);
}

function initMaps(){
  // 地形マップ
  map = initMap(map, id_map.none);
  // 描画マップ
  map_draw = initMap(map_draw, char_map[0]);
  // 視界マップ
  map_sight = initMap(map_sight, false);
}

function initMap(m, v){
  m = [];
  for(let i=0; i<SIZEY; i++){
    m[i] = [];
    for(let j=0; j<SIZEX; j++){
      m[i][j] = v;
    }
  }
  return m;
}
