// 描画
function drawAll() {
  updateMap();
  drawMap();
  drawInfo();
  drawInv();
  drawLog();
  drawShop();
}

// PL中心
function drawMap(){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  for(let i=-player.y; i<SIZEY-player.y; i++)
    for(let j=-player.x; j<SIZEX-player.x; j++){
      if(!player.map_sight[player.y+i][player.x+j]){
        ctx.fillStyle = "gray";
      }
      else if(map_shotrange[player.y+i][player.x+j]){
        ctx.fillStyle = "green";
      }
      else{
        if(map_draw[player.y+i][player.x+j]==CHAR_MAP[ID_MAP.path]
          || map_draw[player.y+i][player.x+j]==CHAR_MAP[ID_MAP.room]
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.door
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.wall_h
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.wall_v)
          ctx.fillStyle = "white";
        else if(map_draw[player.y+i][player.x+j]==CHAR_MAP.stair
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.portal
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.trap)
          ctx.fillStyle = "blue";
        else if(map_draw[player.y+i][player.x+j]==CHAR_MAP.player
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.gold
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.consume
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.food
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.weapon
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.armor
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.ring
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.scroll
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.staff
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.ammo
          || map_draw[player.y+i][player.x+j]==CHAR_MAP.unique)
          ctx.fillStyle = "yellow";
        else if(map_draw[player.y+i][player.x+j]==CHAR_MAP.ray)
          ctx.fillStyle = "skyblue";
        else{
          ctx.fillStyle = "red";

          for(let n of npc_group)
            if((player.x+j)==n.x && (player.y+i)==n.y)
              ctx.fillStyle = "yellow";
          for(let s of shop_group)
            if((player.x+j)==s.x && (player.y+i)==s.y)
              ctx.fillStyle = "yellow";
        }
      }
      ctx.fillText(map_draw[player.y+i][player.x+j], CELL_WIDTH*j+canvas.clientWidth/2, CELL_HEIGHT*i+canvas.clientHeight/2);
    }
}

// すべて描画
function drawMapAll(){
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  for(let i=0; i<SIZEY; i++){
    for(let j=0; j<SIZEX; j++){
      if(!player.map_sight[i][j]){
        ctx.fillStyle = "gray";
      }
      else if(map_shotrange[i][j]){
        ctx.fillStyle = "green";
      }
      else{
        if(map_draw[i][j]==CHAR_MAP[ID_MAP.path]
          || map_draw[i][j]==CHAR_MAP[ID_MAP.room]
          || map_draw[i][j]==CHAR_MAP.door
          || map_draw[i][j]==CHAR_MAP.wall_h
          || map_draw[i][j]==CHAR_MAP.wall_v)
          ctx.fillStyle = "white";
        else if(map_draw[i][j]==CHAR_MAP.stair
          || map_draw[i][j]==CHAR_MAP.portal
          || map_draw[i][j]==CHAR_MAP.trap)
          ctx.fillStyle = "blue";
        else if(map_draw[i][j]==CHAR_MAP.player
          || map_draw[i][j]==CHAR_MAP.gold
          || map_draw[i][j]==CHAR_MAP.consume
          || map_draw[i][j]==CHAR_MAP.food
          || map_draw[i][j]==CHAR_MAP.weapon
          || map_draw[i][j]==CHAR_MAP.armor
          || map_draw[i][j]==CHAR_MAP.ring
          || map_draw[i][j]==CHAR_MAP.scroll
          || map_draw[i][j]==CHAR_MAP.staff
          || map_draw[i][j]==CHAR_MAP.ammo
          || map_draw[i][j]==CHAR_MAP.unique)
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
      ctx.fillText(map_draw[i][j], CELL_WIDTH*j, CELL_HEIGHT*i);
    }
  }
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
    ctx.fillText(gameover_fig[i], canvas.width/2, FONT_SIZE*i);
  }

  ctx.fillText(player.name, canvas.width/2, FONT_SIZE*7);
  ctx.fillText(DATE+" "+MONTH, canvas.width/2, FONT_SIZE*9);
  ctx.fillText(YEAR, canvas.width/2, FONT_SIZE*10);

  ctx.fillStyle = "green";
  ctx.fillText(gameover_fig[gameover_fig.length-1], canvas.width/2, FONT_SIZE*(gameover_fig.length-1));

  //Press Esc Key
  ctx.textAlign = "start";
  ctx.fillStyle = "white";
  ctx.fillText("Press z/x/c key", canvas.width/2 + gameover_fig.length/2, FONT_SIZE*(gameover_fig.length));
}

// 描画マップ更新
function updateMap(){
  // 視界更新
  updateSight();
  // 描画マップ更新
  updateMapDraw();
  // 壁追加
  updateMDWall();
  // 階段・ポータル
  updateMDStairPortal();
  // 罠
  updateMDTrap();
  // 射撃・投擲・魔法
  if(shot_flag || throwing_flag|| magic_flag)
    updateShotRange();
  else
    initMap(map_shotrange, false);

  // アイテム
  updateMDItem();
  // エネミー
  updateMDEnemyGroup();
  // ショップ
  updateMDShopGroup();
  // NPC
  updateMDNPCGroup();
  // プレイヤー
  map_draw[player.y][player.x] = CHAR_MAP.player;
}

// 視界更新
function updateSight(){
  if(!clairvoyance_flag){
    initMap(player.map_sight, false);
    getSight(player);
  }
}

// 描画マップ更新
function updateMapDraw(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++)
      if(map_draw[i][j]=="√" || map_draw[i][j]=="㊦") continue;// debug
      else if(player.map_sight[i][j])
        map_draw[i][j] = CHAR_MAP[map[i][j]];
      else if(map[i][j] != ID_MAP.none
        && map_draw[i][j] != CHAR_MAP[ID_MAP.none])
        map_draw[i][j] = CHAR_MAP[map[i][j]];
}

// 階段・ポータル更新
function updateMDStairPortal(){
  if(!(stair_pos.x === undefined) && !(stair_pos.y === undefined) && player.map_sight[stair_pos.y][stair_pos.x])
    map_draw[stair_pos.y][stair_pos.x] = CHAR_MAP.stair;
  if(!(portal_pos.x === undefined) && !(portal_pos.y === undefined) && player.map_sight[portal_pos.y][portal_pos.x])
    map_draw[portal_pos.y][portal_pos.x] = CHAR_MAP.portal;
}

// 壁更新
function updateMDWall(){
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++){
      // 壁
      if(player.map_sight[i][j] && (map[i][j] == ID_MAP.room || isStair(j, i) || isPortal(j, i))){
        // 縦
        for(let k=-1; k<=1; k++)
          if(map[i][j+k] == ID_MAP.none)
            map_draw[i][j+k] = CHAR_MAP.wall_v;
        // 横
        for(let k=-1; k<=1; k++)
          if(map[i+k][j] == ID_MAP.none)
            map_draw[i+k][j] = CHAR_MAP.wall_h;
        // 角
        for(let [k, l] of [[1,1],[1,-1],[-1,1],[-1,-1]])
          if(map_draw[i+k][j+l] == CHAR_MAP[ID_MAP.none])
            map_draw[i+k][j+l] = CHAR_MAP.wall_h;
      }
      // 扉
      else if(map_draw[i][j] == CHAR_MAP[ID_MAP.path]){
        for(let n of [-1, 1])
          for(let m of [-1, 1])
            if(isInMap(j+m, i+n) && ![ID_MAP.none, ID_MAP.path].includes(map[i+n][j+m]))
              map_draw[i][j] = CHAR_MAP.door;
      }
    }
}

// 罠
function updateMDTrap(){
  for(let t of trap_group)
    if(player.map_sight[t.y][t.x] && t.visible)
      map_draw[t.y][t.x] = CHAR_MAP.trap;
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
        map_draw[i.y][i.x] = CHAR_MAP[ITEM_DATA.find(v=>v.id==i.item_id).type];
      else
        map_draw[i.y][i.x] = CHAR_MAP[i.type];
    }
}

// 射撃・投擲・魔法の射程
function updateShotRange(){
  initMap(map_shotrange, false);

  // 左上
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y-cnt][player.x-cnt]==ID_MAP.none)
      break;
    map_shotrange[player.y-cnt][player.x-cnt] = true;
  }
  // 上
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y-cnt][player.x]==ID_MAP.none)
      break;
    map_shotrange[player.y-cnt][player.x] = true;
  }
  // 右上
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y-cnt][player.x+cnt]==ID_MAP.none)
      break;
    map_shotrange[player.y-cnt][player.x+cnt] = true;
  }
  // 左
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y][player.x-cnt]==ID_MAP.none)
      break;
    map_shotrange[player.y][player.x-cnt] = true;
  }
  // 右
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y][player.x+cnt]==ID_MAP.none)
      break;
    map_shotrange[player.y][player.x+cnt] = true;
  }
  // 左下
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y+cnt][player.x-cnt]==ID_MAP.none)
      break;
    map_shotrange[player.y+cnt][player.x-cnt] = true;
  }
  // 下
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y+cnt][player.x]==ID_MAP.none)
      break;
    map_shotrange[player.y+cnt][player.x] = true;
  }
  // 右下
  for(let cnt = 1; cnt<=10; cnt++){
    if(map[player.y+cnt][player.x+cnt]==ID_MAP.none)
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
  if(![ID_MAP.path, ID_MAP.none].includes(map[y][x]))
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

// [x,y]に位置する部屋の座標取得
// checked_map: {x, y}
function getRoomXY(x, y, map){
  if(!isRoom(x, y)) return;
  for(let i=-1; i<=1; i++)
    for(let j=-1; j<=1; j++)
      if(!(map.find(v=>v.x==x+j && v.y==y+i))){
        map.push({x:x+j, y:y+i});
        getRoomXY(x+j, y+i, map);
      }
}

function canMove(x, y){
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
function canDiagonal(x, y, dir_x, dir_y){
  if(dir_x==0 || dir_y==0)
    return true;

  if(map[y+dir_y][x]==ID_MAP.none || map[y][x+dir_x]==ID_MAP.none)
    return false;

  return true;
}

// 千里眼
function clairvoyance(){
  clairvoyance_flag = true;
  for(let i=0; i<SIZEY; i++)
    for(let j=0; j<SIZEX; j++)
      player.map_sight[i][j] = true;
}

//==================================================MAP GEN==================================================

// プレイヤー位置
function setPlayerPos(){
  let [x,y] = setRandomXY();

  player.x = x;
  player.y = y;
  updateSight();
}

function setPlayerPosManual(x, y){
  player.x = x;
  player.y = y;
  updateSight();
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
      if(map[m][n.i.x] == ID_MAP.none)
        map[m][n.i.x] = ID_MAP.path;
    }
    for(let m=array_xy.low_x; m<array_xy.high_x+1; m++){
      if(map[n.j.y][m] == ID_MAP.none)
        map[n.j.y][m] = ID_MAP.path;
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
  initMap(map, ID_MAP.none);
  // 描画マップ
  initMap(map_draw, CHAR_MAP[0]);
}

function initMap(m, v){
  m.splice(0);
  for(let i=0; i<SIZEY; i++){
    m.push([]);
    for(let j=0; j<SIZEX; j++){
      m[i].push(v);
    }
  }
}
