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

  // 操作説明
  ctx.fillText("z : 決定　　←↑↓→ : 移動", canvas.width/2, font_size*2*(lang.length+2));

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

      ctx.fillText("z : 決定　　←↑↓→ : 移動", canvas.width/2, font_size*2*(lang.length+2));

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
  player.job = 0xf00;
  backLv();

  player.gold = 15;
  player.weapon = undefined;
  player.ammo = undefined;
  player.armor = undefined;
  player.ring1 = undefined;
  player.ring2 = undefined;
  player.hp_max_offset = 0;
  player.mp_max_offset = 0;
  player.atk_offset = 0;
  player.def_offset = 0;
  player.hung_max_offset = 0;
  player.hung_rate_offset = 0;
  player.hp_regen_rate_offset = 0;
  player.mp_regen_rate_offset = 0;
  player.sight_range_offset = 0;
  player.condition = [];
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
    drawShop();
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
      if(isEnemy(x, y) && canDiagonal(player.x, player.y, kd[k].x, kd[k].y)){
        let enemy = enemy_group.find(v=>(v.x==x && v.y==y));
        attack(player, enemy);
        if(isDead(enemy)) addExp(enemy.exp);
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
      backLv();
      nextFloor();
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
    inv_cursor = 0;
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

// 攻撃
// http://000.la.coocan.jp/torneco/damage.html
function attack(from, to){
  let dmg;
  dmg = (3*from.lv)*(from.atk+from.atk_offset+8)/16*(15/16)**(to.def+to.def_offset);
  let rand = Math.random() * dmg/4 - dmg/8;
  dmg += rand;
  dmg = Math.round(dmg);
    
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
  if(canMove(new_x,new_y) && canDiagonal(who.x, who.y, direction.x, direction.y)){
    who.x = new_x;
    who.y = new_y;
    return true;
  }
  return false;
}

// 高速移動
function sprint(direction){
  if(!canMove(player.x+direction.x, player.y+direction.y) && canDiagonal(player.x, player.y, direction.x, direction.y))
    return;

  if(map_draw[player.y+direction.y][player.x+direction.x] == char_map.door)
    return;

  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++)
      if(isAnyObject(player.x+j, player.y+i))
        return;
  
  move(player, direction);
  eventEnemy();
  eventEnv();
  turn_cnt++;

  // 視界更新
  updateSight();
  updateMapDraw();
  updateMDWall();
  updateMDItem();
  updateMDEnemyGroup();
  updateMDShopGroup();
  updateMDNPCGroup();

  sprint(direction);
}

// UIイベント
function eventUI(){
  // 上下
  if(key_input.up){
    if(inv_cursor > 0)
      inv_cursor--;
    else
      inv_cursor = inventory_size - 1;
    return false;
  }
  if(key_input.down){
    if(inv_cursor < inventory_size - 1)
      inv_cursor++;
    else
      inv_cursor = 0;
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
          
        if(stack_type.includes(item_sell.type)){
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

// ショップ配置
function setShop(id, x, y){
  if(map[y][x] != id_map.room)
    return false;

  let shop = shop_data.find(v=>v.id==id);
  let shop_info = {};
  let item = [];

  if(shop.random_flag){
    if(shop.item_num > shop.item_table.length)
      shop.item_num = shop.item_table.length;

    for(let n=0; n<shop.item_num; n++){
      let i = shop.item_table[Math.floor(Math.random()*shop.item_table.length)];
      if(item.find(v=>v.id==i.id)){
        n--;
        continue;
      }
      let item_info = {};
      Object.assign(item_info, item_data.find(v=>v.id==i.id), {price: i.price});
      item.push(item_info);
    }
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
  let ammo = player.ammo;

  // 十字キー
  let kd;
  if(!key_input.ctrl) kd = key_direction;
  else kd = key_direction_diagonal;
  for(let k in kd)
    if(key_input[k]){
      addLog(player.name+" は "+ammo.name+" を放った");
      audio_shot.play();
      shot(player, ammo, kd[k]);
      if(ammo.stack_num > 0) ammo.stack_num--;
      if(ammo.stack_num <= 0){
        equip(inventory.indexOf(ammo));
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
function shot(who, ammo, direction){
  let dst = straightRecursive(who.x, who.y, direction);
  if(isEnemy(dst.x+direction.x, dst.y+direction.y)){
    let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
    shotDmg(who, enemy, ammo);
    if(who == player){
      enemy.chase_flag = true;
      if(isDead(enemy)) addExp(enemy.exp);
    }
  }
  else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y){
    shotDmg(who, player, ammo);
  }
  else
    addLog("外した");
}

function shotDmg(from, to, ammo){
  let dmg;
  dmg = (3*from.lv)*(ammo.dmg+8)/16*(15/16)**(to.def+to.def_offset);
  let rand = Math.random() * dmg/4 - dmg/8;
  dmg += rand;
  dmg = Math.round(dmg);
  
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
      throwing(player, item, kd[k]);
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
    inv_cursor = -1;
    throwing_flag = false;
    ui_flag = false;
    return false;
  }
}

// 投擲
function throwing(who, item, direction){
  let dst = straightRecursive(who.x, who.y, direction);
  if(isEnemy(dst.x+direction.x, dst.y+direction.y)){
    let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
    throwDmg(enemy, item);
    if(who == player){
      enemy.chase_flag = true;
      if(isDead(enemy)) addExp(enemy.exp);
    }
  }
  else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y){
    throwDmg(player, item);
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
              addLog(item.name+"は床に落ちた");
              return;
            }
    }
  }
}

function throwDmg(to, item){
  let dmg;
  if(item.type=="ammo" || item.type=="weapon")
    dmg = Math.round(Math.random()+1)
  else
    dmg = Math.round(Math.random())
  
  if(dmg < 0) dmg = 0;
  addHP(to, -dmg);
  addLog(to.name+" に "+dmg+" のダメージ");
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
    inv_cursor = -1;
    ui_flag = false;
    return false;
  }
}

// 魔法
function magic(who, value, direction){
  let dst = straightRecursive(who.x, who.y, direction);
  if(isEnemy(dst.x+direction.x, dst.y+direction.y)){
    let enemy = enemy_group.find(v=>(v.x==dst.x+direction.x && v.y==dst.y+direction.y));
    magicDmg(who, enemy, value);
    if(who == player){
      enemy.chase_flag = true;
      if(isDead(enemy)) addExp(enemy.exp);
    }
  }
  else if(dst.x+direction.x == player.x && dst.y+direction.y == player.y){
    magicDmg(who, player, value);
  }
}

function magicDmg(from, to, value){
  let dmg;
  dmg = (3*from.lv)*(value+8)/16*(15/16)**(to.mp_max/2);
  let rand = Math.random() * dmg/4 - dmg/8;
  dmg += rand;
  dmg = Math.round(dmg);
  
  if(dmg < 0) dmg = 0;
  addHP(to, -dmg);
  addLog(to.name+" に "+dmg+" のダメージ");
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

// HP
function addHP(who, value){
  who.hp += value;
  if(who.hp > who.hp_max)
    who.hp = who.hp_max;
  else if(who.hp < 0)
    who.hp = 0;
}

// MP
function addMP(who, value){
  who.mp += value;
  if(who.mp > who.mp_max)
    who.mp = who.mp_max;
  else if(who.mp < 0)
    who.mp = 0;
}

// 空腹度
// PL専用
function addHung(value){
  player.hung += value;
  if(player.hung > player.hung_max)
    player.hung = player.hung_max;
  if(player.hung < 0)
    player.hung = 0;
}

// 経験値
// PL専用
function addExp(value){
  player.exp += value;
  addLog(value+" の経験値を得た");
  lvUp();
}

// レベルアップ
function lvUp(){
  if(player.exp >= player.next_exp){
    player.lv++;
    player.next_exp = Math.floor((player.next_exp * 1.1 + player.lv * 15) / 2);

    player.hp_max += player.lvup.hp_max;
    player.mp_max += player.lvup.mp_max;
    addHP(player, player.lvup.hp_max);
    addMP(player, player.lvup.mp_max)

    addLog(player.name+" はレベルが上がった");
    lvUp();
    return true;
  }
  return false;
}

// lv1に戻す
function backLv(){
  let job = item_data.find(v=>v.id==player.job);

  player.hp = job.hp;
  player.hp_max = job.hp_max;
  player.mp = job.mp;
  player.mp_max = job.mp_max;
  player.atk = job.atk;
  player.def = job.def;
  player.hung_rate = job.hung_rate;
  player.hp_regen_rate = job.hp_regen_rate;
  player.mp_regen_rate = job.mp_regen_rate;
  player.sight_range = job.sight_range;
  player.job_name = job.name;
  player.lvup = job.lvup;

  player.lv = 1;
  player.exp = 0;
  player.next_exp = 10;
  player.hung = 100;
  player.hung_max = 100;
}

// 状態異常
function setCondition(who, id){
  let cond = condition_data.find(v=>v.id==id);
  if(!cond || !('condition' in who)){
    console.warn("setCondition: id or who.condtion not found");
    return false;
  }
  who.condition.push(cond);
  cond.func_be(who);
}

// 全回復
function fullRecovery(who){
  addLog(who.name+" は全快した");
  who.hp = who.hp_max;
  who.mp = who.mp_max;
  if(who == player) player.hung = player.hung_max;
}

// 死亡判定
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
    return equip(index);
  }
  else{
    return inventory[index].func();
  }
}

// プレイヤー装備切り替え
function equip(index){
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
    if(multiple_slot.includes(equip_item.type)){
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
    
    equip_item.func_equip(player);

    addLog(equip_item.name+" を装備した");
    return true;
  }
  // 外す
  else{
    // 装備スロット更新
    equip_item.equip_flag = false;
    if(multiple_slot.includes(equip_item.type)){
      if(player[equip_item.type+"1"] == equip_item)
        player[equip_item.type+"1"] = undefined;
      else if(player[equip_item.type+"2"] == equip_item)
        player[equip_item.type+"2"] = undefined;
    }
    else
      player[equip_item.type] = undefined;
    
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
  //if(equip_type.includes(item.type)){
  //  Object.assign(item_info, {equip_flag: false});
  //}
  
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
    || item_group.find(v=>(v.x==x && v.y==y))
    || isTrap(x, y))
    return false;

  let item_info = {};
  Object.assign(item_info, item_data.find(v=>v.id==id), {x: x, y: y});
  
  item_group.push(item_info);
  return true;
}

// マップ内アイテム
function setItemGroup(){
  let num = Math.floor(Math.random() * (room_num*2 - room_num*1) + room_num*1);
  let table = [];
  
  if(Math.floor(floor_cnt/3) in item_table)
    table = item_table[Math.floor(floor_cnt/3)];
  else
    table = item_table[0];
  if(table.length==0) return;

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
  if(turn_cnt % player.hp_regen_rate == 0)
    addHP(player, 1);
  if(turn_cnt % player.mp_regen_rate == 0)
    addMP(player, 1);

  // 空腹度
  if(!safe_flag && turn_cnt % player.hung_rate == 0){
    if(player.hung > 0){
      addHung(-1);
      if(player.hung == 25)
        addLog("空腹を感じる");
      if(player.hung == 10)
        addLog("耐え難い空腹");
    }
    else{
      addHP(player, -1);
      addLog("空腹で 1 のダメージ");
      audio_hit.play();
    }
  }

  // 状態異常
  for(let cond of player.condition){
    cond.func_during(player);
    cond.turn--;
    if(cond.turn<=0){
      player.condition.splice(player.condition.indexOf(cond), 1);
      cond.func_heal(player);
    }
  }

  // 罠
  for(let t of trap_group)
    if(t.x == player.x && t.y == player.y){
        t.func(player);
        trap_group.splice(trap_group.indexOf(t), 1);
      }

  // エネミー
  for(let enemy of enemy_group){
    // 状態異常
    for(let cond of enemy.condition){
      cond.func_during(enemy);
      cond.turn--;
      if(cond.turn<=0){
        enemy.condition.splice(enemy.condition.indexOf(cond), 1);
        cond.func_heal(enemy);
      }
    }
    isDead(enemy)
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
        player.gold += 5;
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

  // テスト用
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

    setStair();
    setTrapGroup();
    setItemGroup();

    setPlayerPos();
    setEnemyGroup();

    safe_flag = false;
  }
}

// 罠
function setTrap(id, x, y){
  if(!canMove(x, y)
    || map[y][x] == id_map.path
    || trap_group.find(v=>(v.x==x && v.y==y)))
    return false;

  let trap_info = {};
  Object.assign(trap_info, trap_data.find(v=>v.id==id), {x: x, y: y, visible: false});
  
  trap_group.push(trap_info);
  return true;
}

// マップ内罠
function setTrapGroup(){
  let num = Math.floor(Math.random() * (room_num*1 - 1) + 1);
  let table = [];
  
  if(Math.floor(floor_cnt/3) in trap_table)
    table = trap_table[Math.floor(floor_cnt/3)];
  else
    table = trap_table[0];
  if(table.length==0) return;

  for(let i=0; i<num; i++){
    const x = Math.floor(Math.random() * (SIZEX-1 - 1) + 1);
    const y = Math.floor(Math.random() * (SIZEY-1 - 1) + 1);
    const item = Math.floor(Math.random() * table.length);
    
    if(!setTrap(table[item], x, y))
      i--;
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
function eventEnemy(){
  for(let enemy of enemy_group){
    // 死亡判定
    if(isDead(enemy)) continue;
    if(enemy.chase_flag){
      // 攻撃
      if(!enemy.shot){
        for(let d in key_direction){
          let x = enemy.x + key_direction[d].x;
          let y = enemy.y + key_direction[d].y;
          if(x == player.x && y == player.y && canDiagonal(enemy.x, enemy.y, key_direction[d].x, key_direction[d].y)){
            attack(enemy, player);
            continue;
          }
        }
        for(let d in key_direction_diagonal){
          let x = enemy.x + key_direction_diagonal[d].x;
          let y = enemy.y + key_direction_diagonal[d].y;
          if(x == player.x && y == player.y && canDiagonal(enemy.x, enemy.y, key_direction_diagonal[d].x, key_direction_diagonal[d].y)){
            attack(enemy, player);
            continue;
          }
        }
      }
      // 射撃
      else{
        for(let d in key_direction){
          let xy = straightRecursive(enemy.x, enemy.y, key_direction[d]);
          if(xy.x+key_direction[d].x == player.x
            && xy.y+key_direction[d].y == player.y
            && isInSight(enemy, player.x, player.y)){
            let ammo = item_data.find(v=>v.id==enemy.shot);
            addLog(enemy.name+" は "+ammo.name+" を放った");
            audio_shot.play();
            shot(enemy, ammo, key_direction[d]);
            continue;
          }
        }
        for(let d in key_direction_diagonal){
          let xy = straightRecursive(enemy.x, enemy.y, key_direction_diagonal[d]);
          if(xy.x+key_direction_diagonal[d].x == player.x
            && xy.y+key_direction_diagonal[d].y == player.y
            && isInSight(enemy, player.x, player.y)){
            let ammo = item_data.find(v=>v.id==enemy.shot);
            addLog(enemy.name+" は "+ammo.name+" を放った");
            audio_shot.play();
            shot(enemy, ammo, key_direction_diagonal[d]);
            continue;
          }
        }
      }
    }

    // 発見
    enemy.map_sight = initMap(enemy.map_sight, false);
    getSight(enemy);
    if(isInSight(enemy, player.x, player.y)){
      enemy.chase_flag = true;
      enemy.chase_count = chase_count_init;
    }
    else
      enemy.chase_count--;
    if(enemy.chase_count < 0)
      enemy.chase_flag = false;

    // 移動
    for(let cnt=0; cnt<enemy.speed; cnt++){
      if(enemy.chase_flag)
        moveEnemyChase(enemy);
      else
        moveEnemyTravel(enemy);
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
    getSightPath(who.x, who.y, who.sight_range, who.map_sight);
  }
}

// 通路の視界
function getSightPath(x, y, sight_range, map_sight){
  map_sight[y][x] = true;
  for(let [i, j] of [[-1, 0], [1, 0], [0, -1], [0, 1]]){
    if(isInMap(x+j,y+i) 
      && map[y+i][x+j] != id_map.none 
      && !map_sight[y+i][x+j] 
      && sight_range > 0
      && !isRoom(x, y)
      && !isRoom(x+j, y+i)){
      map_sight[y+i][x+j] = true;
      getSightPath(x+j, y+i, sight_range-1, map_sight);
    }
  }
}

// 視界内のtarget有無
function isInSight(who, target_x, target_y){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++){
      if(who.map_sight[i][j] && j==target_x && i==target_y)
        return true;
    }
  return false;
}

// エネミー移動（追跡）
function moveEnemyChase(enemy){
  let route
  route = astar(enemy.x, enemy.y, player.x, player.y, enemy.escape_flag);  
  let dir = {
    x: route[route.length-1].x - enemy.x,
    y: route[route.length-1].y - enemy.y
  };
  // debug
  //for(let r of route)
  //  map_draw[r.y][r.x] = "√";

  return move(enemy, dir);
}

// A-star
function astar(start_x, start_y, dst_x, dst_y, escape_flag){
  let node = [];

  // 初期コスト計算
  let actual_cost = 0;
  let heuristic_cost = Math.max(Math.abs(dst_x-start_x), Math.abs(dst_y-start_y));
  node.push({x:start_x, y:start_y, status:"open", a_cost:actual_cost, h_cost:heuristic_cost, parent:undefined});
  
  asterRecursiveEight(node, start_x, start_y, dst_x, dst_y, escape_flag);

  let dst_node = node[node.length-1];
  let route = [];
  getRoute(route, node, dst_node);
  return route;
}

function asterRecursiveEight(node, x, y, dst_x, dst_y, escape_flag){
  // close
  node.find(v=>(v.x==x && v.y==y)).status = "closed";

  // open
  let movement_cost;
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++){
      // 目的地到達判定
      if(x+j == dst_x && y+i == dst_y && canDiagonal(x, y, j, i)){
        node.push({x:x+j, y:y+i, status:"dst", parent:{x:x, y:y}});
        return;
      }
      // 探索
      else if(canMove(x+j, y+i) && canDiagonal(x, y, j, i)
        && !(node.find(v=>(v.x==x+j && v.y==y+i)))){
        // 移動コスト
        movement_cost = 1;

        let a_cost = node.find(v=>(v.x==x && v.y==y)).a_cost + movement_cost;
        let h_cost = Math.max(Math.abs(dst_x-(x+j)), Math.abs(dst_y-(y+i)));
        node.push({x:x+j, y:y+i, status:"open", a_cost:a_cost, h_cost:h_cost, parent:{x:x,y:y}});
      }
    }

  // 基準ノード選出
  let next_node = {cost: SIZEX+SIZEY};
  for(let n of node){
    if(!escape_flag){ // 追跡
      if(n.status == "open" 
        && (n.a_cost + n.h_cost) < next_node.cost){
        next_node.x = n.x;
        next_node.y = n.y;
        next_node.cost = n.a_cost + n.h_cost;
      }
    }
    else{ // 逃亡
      if(n.status == "open" 
        && (n.a_cost + n.h_cost) > next_node.cost){
        next_node.x = n.x;
        next_node.y = n.y;
        next_node.cost = n.a_cost + n.h_cost;
      }
    }
  }
    
  if(next_node.x == undefined || next_node.y == undefined){
    console.warn("aster: cannot reach");
    return;
  }
  
  asterRecursiveEight(node, next_node.x, next_node.y, dst_x, dst_y, escape_flag);
  return;
}

function getRoute(route, node, n){
  if(n.parent == undefined)
    return route;
  route.push(n);
  route = getRoute(route, node, node.find(v=>(v.x==n.parent.x && v.y==n.parent.y)));
}

// エネミー移動（巡回）
function moveEnemyTravel(enemy){
  // 新規目的地
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++)
      if(enemy.x+j==enemy.travel_x && enemy.y+i==enemy.travel_y){
        setNextTravelRoom(enemy);
        return;
      }

  let route;
  route = astar(enemy.x, enemy.y, enemy.travel_x, enemy.travel_y, false);
  let dir = {
    x: route[route.length-1].x - enemy.x,
    y: route[route.length-1].y - enemy.y
  };
  // debug
  //for(let r of route)
  //  map_draw[r.y][r.x] = "√";

  return move(enemy, dir);
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
      if(next_room_x==xy.x && next_room_y==xy.y){
        break_flag = false;
        break;
      }
    if(break_flag) break;
  }
  enemy.travel_x = next_room_x;
  enemy.travel_y = next_room_y;

  // debug
  //map_draw[enemy.travel_y][enemy.travel_x] = "㊦";
}

// エネミー移動（ランダム）
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
  if(isEnemy(x,y))
    return false;

  let enemy = enemy_data.find(v=>v.id==id);
  let enemy_info = {};
  Object.assign(enemy_info, enemy, 
    {x: x, y: y, map_sight: [], condition: [],
    chase_flag: false, chase_count: 5, travel_x:x, travel_y:y, 
    hp_max_offset: 0, mp_max_offset: 0, atk_offset: 0, def_offset: 0, sight_range_offset: 0,}
  );

  // 特殊情報の付与
  if(!('shot' in enemy_info))
    Object.assign(enemy_info, {shot: undefined});
  if(!('escape_flag' in enemy_info))
    Object.assign(enemy_info, {escape_flag: false});

  enemy_group.push(enemy_info);
  return true;
}

// エネミーグループ
// 5階層毎にテーブル変更
function setEnemyGroup(){
  let num = Math.floor(Math.random() * (room_num*1.5 - room_num*1) + room_num*1);
  let table = [];

  if(Math.floor(floor_cnt/3) in enemy_table)
    table = enemy_table[Math.floor(floor_cnt/3)];
  else{
    table = enemy_table[0];
    console.warn("setEnemyGroup: enemy_table of this floor not found");
  }
  if(table.length==0) return;

  for(let i=0; i<num; i++){
    const x = Math.floor(Math.random() * (SIZEX-1 - 1) + 1);
    const y = Math.floor(Math.random() * (SIZEY-1 - 1) + 1);
    const enemy = Math.floor(Math.random() * table.length);

    // 配置制限
    // 部屋の中
    if(map[y][x] != id_map.room){
      i--;
      continue;
    }
    // PLの視界外
    if(isInSight(player, x, y)){
      i--;
      continue;
    }
    // 壁が隣に無い
    let next_wall_flag = false;
    for(let i=-1; i<=1; i++)
      for(let j=-1; j<=1; j++)
        if(map[y+i][x+j] == id_map.none)
          next_wall_flag = true;
    if(next_wall_flag){
      i--;
      continue;
    }
    
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
      if(!player.map_sight[i][j]){
        ctx.fillStyle = "gray";
      }
      else if(map_shotrange[i][j]){
        ctx.fillStyle = "green";
      }
      else{
        if(map_draw[i][j]==char_map[id_map.path]
          || map_draw[i][j]==char_map[id_map.room]
          || map_draw[i][j]==char_map.door
          || map_draw[i][j]==char_map.wall_h
          || map_draw[i][j]==char_map.wall_v)
          ctx.fillStyle = "white";
        else if(map_draw[i][j]==char_map[id_map.stair]
          || map_draw[i][j]==char_map[id_map.portal]
          || map_draw[i][j]==char_map.trap)
          ctx.fillStyle = "blue";
        else if(map_draw[i][j]==char_map.player
          || map_draw[i][j]==char_map.gold
          || map_draw[i][j]==char_map.consume
          || map_draw[i][j]==char_map.food
          || map_draw[i][j]==char_map.weapon
          || map_draw[i][j]==char_map.armor
          || map_draw[i][j]==char_map.ring
          || map_draw[i][j]==char_map.scroll
          || map_draw[i][j]==char_map.staff
          || map_draw[i][j]==char_map.ammo
          || map_draw[i][j]==char_map.unique)
          ctx.fillStyle = "yellow";
        else{
          ctx.fillStyle = "red";

          for(let n of npc_group)
            if(j==n.x && i==n.y)
              ctx.fillStyle = "yellow";
          for(let s of shop_group)
            if(j==s.x && i==s.y)
              ctx.fillStyle = "yellow";
        }
      }
      ctx.fillText(map_draw[i][j], cell_width*j, cell_height*i);
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
  // 罠
  updateMDTrap();
  // 射撃・投擲・魔法
  if(shot_flag || throwing_flag|| magic_flag)
    updateShotRange();
  else
    map_shotrange = initMap(map_shotrange, false);

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
    player.map_sight = initMap(player.map_sight, false);
    getSight(player);
  }
}

// 描画マップ更新
function updateMapDraw(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++)
      if(map_draw[i][j]=="√" || map_draw[i][j]=="㊦") continue;// debug
      else if(player.map_sight[i][j])
        map_draw[i][j] = char_map[map[i][j]];
      else if(map[i][j] != id_map.none
        && map_draw[i][j] != char_map[id_map.none])
        map_draw[i][j] = char_map[map[i][j]];
}

// 壁更新
function updateMDWall(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++){
      if(player.map_sight[i][j] && map[i][j] == id_map.none){
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
      else if(map_draw[i][j] == char_map[id_map.path]){
        for(let n of [-1, 1])
          for(let m of [-1, 1])
            if(isInMap(j+m, i+n) && ![id_map.none, id_map.path].includes(map[i+n][j+m]))
              map_draw[i][j] = char_map.door;
      }
    }
}

// 罠
function updateMDTrap(){
  for(let t of trap_group)
    if(player.map_sight[t.y][t.x] && t.visible)
      map_draw[t.y][t.x] = char_map.trap;
}

// エネミー描画
function updateMDEnemyGroup(){
  for(let e of enemy_group)
    if(player.map_sight[e.y][e.x])
      map_draw[e.y][e.x] = e.char;
}

// ショップ描画
function updateMDShopGroup(){
  for(let s of shop_group)
    if(player.map_sight[s.y][s.x])
      map_draw[s.y][s.x] = s.char;
}

// NPC描画
function updateMDNPCGroup(){
  for(let n of npc_group)
    if(player.map_sight[n.y][n.x])
      map_draw[n.y][n.x] = n.char;
}

// アイテム描画
function updateMDItem(){
  for(let i of item_group)
    if(player.map_sight[i.y][i.x]){
      if(i.type=="stack")
        map_draw[i.y][i.x] = char_map[item_data.find(v=>v.id==i.item_id).type];
      else
        map_draw[i.y][i.x] = char_map[i.type];
    }
}

// 射撃・投擲・魔法の射程
function updateShotRange(){
  map_shotrange = initMap(map_shotrange, false);

  // 左上
  for(let cnt = 1;; cnt++){
    if(map[player.y-cnt][player.x-cnt]==id_map.none)
      break;
    map_shotrange[player.y-cnt][player.x-cnt] = true;
  }
  // 上
  for(let cnt = 1;; cnt++){
    if(map[player.y-cnt][player.x]==id_map.none)
      break;
    map_shotrange[player.y-cnt][player.x] = true;
  }
  // 右上
  for(let cnt = 1;; cnt++){
    if(map[player.y-cnt][player.x+cnt]==id_map.none)
      break;
    map_shotrange[player.y-cnt][player.x+cnt] = true;
  }
  // 左
  for(let cnt = 1;; cnt++){
    if(map[player.y][player.x-cnt]==id_map.none)
      break;
    map_shotrange[player.y][player.x-cnt] = true;
  }
  // 右
  for(let cnt = 1;; cnt++){
    if(map[player.y][player.x+cnt]==id_map.none)
      break;
    map_shotrange[player.y][player.x+cnt] = true;
  }
  // 左下
  for(let cnt = 1;; cnt++){
    if(map[player.y+cnt][player.x-cnt]==id_map.none)
      break;
    map_shotrange[player.y+cnt][player.x-cnt] = true;
  }
  // 下
  for(let cnt = 1;; cnt++){
    if(map[player.y+cnt][player.x]==id_map.none)
      break;
    map_shotrange[player.y+cnt][player.x] = true;
  }
  // 右下
  for(let cnt = 1;; cnt++){
    if(map[player.y+cnt][player.x+cnt]==id_map.none)
      break;
    map_shotrange[player.y+cnt][player.x+cnt] = true;
  }
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

// [x,y]に位置する部屋のroomマスと1マス周りのnone,pathマスの座標取得
// checked_map: {x, y}
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

// 斜め移動の判定
function canDiagonal(x, y, dir_x, dir_y){
  if(dir_x==0 || dir_y==0)
    return true;

  if(map[y+dir_y][x]==id_map.none || map[y][x+dir_x]==id_map.none)
    return false;

  return true;
}

function isAnyObject(x, y){
  if(map_draw[y][x] == char_map[id_map.none]
    || map_draw[y][x] == char_map[id_map.room]
    || map_draw[y][x] == char_map[id_map.path]
    || map_draw[y][x] == char_map.player
    || map_draw[y][x] == char_map.wall_h
    || map_draw[y][x] == char_map.wall_v
    || map_draw[y][x] == char_map.door)
    return false;
  return true;
}

// 千里眼
function clairvoyance(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++)
      player.map_sight[i][j] = true;
}

//==================================================MAP GEN==================================================

// プレイヤー位置
function setPlayerPos(){
  let x = Math.floor( Math.random() * (SIZEX - 1) + 1);
  let y = Math.floor( Math.random() * (SIZEY - 1) + 1);

  if(canMove(x, y)
    && map[y][x]==id_map.room
    && map[y][x]!=id_map.stair
    && !isItem(x, y)
    && !isTrap(x, y)){
    player.x = x;
    player.y = y;
    updateSight();
    return;
  }
  setPlayerPos();
}

function setPlayerPosManual(x, y){
  player.x = x;
  player.y = y;
  updateSight();
}

// 階段
function setStair(){
  let x = Math.floor( Math.random() * (SIZEX-1 - 1) + 1);
  let y = Math.floor( Math.random() * (SIZEY-1 - 1) + 1);
  
  if(map[y][x] == id_map.room){
    map[y][x] = id_map.stair;
    return;
  }
  setStair();
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

  // debug
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
