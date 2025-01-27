const info = document.getElementById("info");
const log = document.getElementById("log");
const note = document.getElementById("note");
const shop = document.getElementById("shop");

info.style.width = '175px';
info.style.paddingLeft = '5px';

let log_reserve = [];
const log_reserve_size = 10;
log.style.height = font_size*(log_reserve_size+1)+'px';
log.style.paddingTop = '25px';
log.style.paddingLeft = '50px';
log.style.paddingRight = '5px';

note.style.paddingRight = '5px';

shop.style.width = '250px';
shop.style.paddingTop = '25px';
shop.style.paddingLeft = '5px';
shop.style.paddingRight = '50px';

//=========================INFO=========================

function drawInfo(){
  info.innerHTML = "";

  // マップ情報
  info.insertAdjacentHTML("beforeend", floor_cnt+"F");
  //info.insertAdjacentHTML("beforeend", " POS: ("+player.x+", "+player.y+")<br>");
  info.insertAdjacentHTML("beforeend", " TURN: "+turn_cnt+"<br>");
  info.insertAdjacentHTML("beforeend", "<br>");

  // キー
  //info.insertAdjacentHTML("beforeend", "KEY:<br>");
  //for(let k in key_input)
  //  if(key_input[k])
  //    info.insertAdjacentHTML("beforeend", k+"|");
  //info.insertAdjacentHTML("beforeend", "<br>");

  // ステータス
  info.insertAdjacentHTML("beforeend", "STATUS<br>");
  info.insertAdjacentHTML("beforeend", "NAME: "+player.name+"<br>");
  info.insertAdjacentHTML("beforeend", "JOB : "+player.job_name+"<br>");
  info.insertAdjacentHTML("beforeend", "LV&nbsp; : "+player.lv+"<br>");
  info.insertAdjacentHTML("beforeend", "EXP : "+player.exp+"<br>");
  info.insertAdjacentHTML("beforeend", "HP&nbsp; : "+player.hp+" / "+player.hp_max+"<br>");
  info.insertAdjacentHTML("beforeend", "MP&nbsp; : "+player.mp+" / "+player.mp_max+"<br>");
  info.insertAdjacentHTML("beforeend", "ATK : "+player.atk);
  if(player.atk_offset >= 0)
    info.insertAdjacentHTML("beforeend", " + "+player.atk_offset+"<br>");
  else
    info.insertAdjacentHTML("beforeend", " - "+Math.abs(player.atk_offset)+"<br>");
  info.insertAdjacentHTML("beforeend", "DEF : "+player.def);
  if(player.def_offset >= 0)
    info.insertAdjacentHTML("beforeend", " + "+player.def_offset+"<br>");
  else
    info.insertAdjacentHTML("beforeend", " - "+Math.abs(player.def_offset)+"<br>");
  info.insertAdjacentHTML("beforeend", "HUNG: "+player.hung+" / "+player.hung_max+"<br>");
  info.insertAdjacentHTML("beforeend", "GOLD: "+player.gold+"<br>");
  info.insertAdjacentHTML("beforeend", "<br>");

  // インベントリ
  info.insertAdjacentHTML("beforeend", "INVENTORY<br>");
  for(let i=0; i<inventory_size; i++){
    if(i == inv_cursor)
      info.insertAdjacentHTML("beforeend", ">&nbsp;&nbsp; ");
    else if(i<9)
      info.insertAdjacentHTML("beforeend", (i+1)+":&nbsp; ");
    else
      info.insertAdjacentHTML("beforeend", (i+1)+": ");
    if(i < inventory.length){
      if(inventory[i].equip_flag)
        info.insertAdjacentHTML("beforeend", "[E]"+inventory[i].name);
      else
        info.insertAdjacentHTML("beforeend", inventory[i].name);
      if(inventory[i].stack_num)
        info.insertAdjacentHTML("beforeend", " ×"+inventory[i].stack_num)
    }
    else
      info.insertAdjacentHTML("beforeend", "------");
    info.insertAdjacentHTML("beforeend", "<br>");
  }
  info.insertAdjacentHTML("beforeend", "<br>");
}

//=========================SHOP=========================

function drawShop(){
  shop.innerHTML = "";
  if(shop_flag){
    shop.insertAdjacentHTML("beforeend", "SHOP<br>");
    for(let i=0; i<shop_using.item.length; i++){
      if(i == shop_cursor)
        shop.insertAdjacentHTML("beforeend", ">&nbsp;&nbsp; ");
      else if(i<9)
        shop.insertAdjacentHTML("beforeend", (i+1)+":&nbsp; ");
      else
        shop.insertAdjacentHTML("beforeend", (i+1)+": ");
      if(shop_using.item[i].price>=0){
        shop.insertAdjacentHTML("beforeend", shop_using.item[i].name);
        shop.insertAdjacentHTML("beforeend", " : "+shop_using.item[i].price+"G");
      }
      else{
        shop.insertAdjacentHTML("beforeend", "(売) "+shop_using.item[i].name);
        shop.insertAdjacentHTML("beforeend", " : "+(-shop_using.item[i].price)+"G");
      }
      shop.insertAdjacentHTML("beforeend", "<br>");
    }
    shop.insertAdjacentHTML("beforeend", "<br>");
  }
}

//=========================LOG=========================

function drawLog(){
  log.innerHTML = "";
  for(let i=0; i<log_reserve.length; i++)
    log.insertAdjacentHTML("afterbegin",log_reserve[i]+"<br>");
  log.insertAdjacentHTML("afterbegin","LOG<br>");
}

function addSpaceAfterBreak(str){
  if(str.match(/<br>/)){
    let index = [0];
    let br_num = str.match(/<br>/g).length;
    for(let i=0; i<br_num; i++){
      index.push(str.indexOf("<br>", index[i]+1));
    }
    
    let str_slice = [];
    for(let i=0; i<br_num; i++)
      str_slice.push(str.slice(index[i],index[i+1]));
    str_slice.push(str.slice(index[index.length-1]));

    for(let i in str_slice)
      str_slice[i] = str_slice[i].replace(/<br>/, "");

    let space_num;
    space_num = str.indexOf(":") + 2;
    for(let i=0; i<str_slice.length-1; i++){
      str_slice[i].replace("<br>", "");
      str_slice[i] += "<br>";
      for(let n=0; n<space_num; n++)
        str_slice[i] += "&nbsp;";
    }
    return str_slice.join("");
  }
  return str;
}

function addLog(text){
  log_reserve.push(addSpaceAfterBreak(turn_cnt + ": " + text));
  if(log_reserve.length>log_reserve_size)
    log_reserve.shift();
}

//=========================NOTE=========================

function drawNote(){
  note.innerHTML = "NOTE<br>";
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.player+"&nbsp;", "yellow")+": "+player.name+"<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;赤 ", "red")+": エネミー<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;黄 ", "yellow")+": NPC<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map[id_map.stair]+"&nbsp;", "blue")+": 階段<br>");;
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map[id_map.portal]+"&nbsp;", "blue")+": 帰還ゲート<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.trap+"&nbsp;", "blue")+": 罠<br>");
  //note.insertAdjacentHTML("beforeend", 
  //  colorUI("&nbsp;"+char_map[id_map.poison]+"&nbsp;", "purple")+": 毒沼<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.gold+"&nbsp;", "yellow")+": 金貨<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.weapon+"&nbsp;", "yellow")+": 武器<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.armor+"&nbsp;", "yellow")+": 鎧<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.ring+"&nbsp;", "yellow")+": 指輪<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.consume+"&nbsp;", "yellow")+": 消耗品<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.food+"&nbsp;", "yellow")+": 食料<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.scroll+"&nbsp;", "yellow")+": 巻物<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.staff+"&nbsp;", "yellow")+": 杖<br>");
  note.insertAdjacentHTML("beforeend", 
    colorUI("&nbsp;"+char_map.ammo+"&nbsp;", "yellow")+": 弾薬<br>");
  note.insertAdjacentHTML("beforeend", "<br>");
  note.insertAdjacentHTML("beforeend", "CONTROL<br>");
  note.insertAdjacentHTML("beforeend", "- 移動<br>&nbsp; ←↑↓→<br>");
  note.insertAdjacentHTML("beforeend", "- 斜め移動<br>&nbsp; ←↑↓→ + CTRL<br>");
  note.insertAdjacentHTML("beforeend", "- 高速移動<br>&nbsp; ←↑↓→ + SHIFT<br>");
  note.insertAdjacentHTML("beforeend", "- 攻撃<br>&nbsp; ←↑↓→ TO "+colorUI("赤字", "red")+"<br>");
  note.insertAdjacentHTML("beforeend", "- 待機: Z<br>");
  note.insertAdjacentHTML("beforeend", "- インベントリ: X<br>");
  note.insertAdjacentHTML("beforeend", "- 射撃: C<br>");
  note.insertAdjacentHTML("beforeend", "<br>");
  note.insertAdjacentHTML("beforeend", "INVENTORY<br>");
  note.insertAdjacentHTML("beforeend", "- 使う/装備: Z<br>");
  note.insertAdjacentHTML("beforeend", "- 戻る: X<br>");
  note.insertAdjacentHTML("beforeend", "- 投擲: C<br>");
  note.insertAdjacentHTML("beforeend", "<br>");
}

// UI色
function colorUI(char, color){
  return '<span style="color:'+color+';">'+char+'</span>';
}
