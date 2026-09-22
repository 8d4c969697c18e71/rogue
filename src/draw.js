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
function drawMap() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for(let i=-player.y; i<SIZEY-player.y; i++)
        for(let j=-player.x; j<SIZEX-player.x; j++) {
            if(!player.map_sight[player.y+i][player.x+j]) {
                ctx.fillStyle = "gray";
            }
            else if(map_shotrange[player.y+i][player.x+j]) {
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
                else if(map_draw[player.y+i][player.x+j]=="魂")
                    ctx.fillStyle = "skyblue";
                else if(map_draw[player.y+i][player.x+j]=="火")
                    ctx.fillStyle = "orange";
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
            ctx.fillText(map_draw[player.y+i][player.x+j], FONT_SIZE*j+canvas.clientWidth/2, FONT_SIZE*i+canvas.clientHeight/2);
        }
}

// すべて描画
function drawMapAll() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for(let i=0; i<SIZEY; i++) {
        for(let j=0; j<SIZEX; j++) {
            if(!player.map_sight[i][j]) {
                ctx.fillStyle = "gray";
            }
            else if(map_shotrange[i][j]) {
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
            ctx.fillText(map_draw[i][j], FONT_SIZE*j, FONT_SIZE*i);
        }
    }
}

function drawGameover() {
    const gameover_fig = [
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
    ctx.clearRect(0, 0, canvas.clientWidth/2, canvas.clientHeight/2);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    for(let i=0; i<gameover_fig.length-1; i++) {
        ctx.fillText(gameover_fig[i], canvas.clientWidth/2, FONT_SIZE*i);
    }

    ctx.fillText(player.name, canvas.clientWidth/2, FONT_SIZE*7);
    ctx.fillText(DATE+" "+MONTH, canvas.clientWidth/2, FONT_SIZE*9);
    ctx.fillText(YEAR, canvas.clientWidth/2, FONT_SIZE*10);

    ctx.fillStyle = "green";
    ctx.fillText(gameover_fig[gameover_fig.length-1], canvas.clientWidth/2, FONT_SIZE*(gameover_fig.length-1));

    //Press Esc Key
    ctx.textAlign = "start";
    ctx.fillStyle = "white";
    ctx.fillText("Press z/x/c key", canvas.clientWidth/2 + gameover_fig.length/2, FONT_SIZE*(gameover_fig.length));
}

// 描画マップ更新
function updateMap() {
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
function updateSight() {
    if(!clairvoyance_flag) {
        initMap(player.map_sight, false);
        getSight(player);
    }
}

// 描画マップ更新
function updateMapDraw() {
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
function updateMDStairPortal() {
    if(!(stair_pos.x === undefined) && !(stair_pos.y === undefined) && player.map_sight[stair_pos.y][stair_pos.x])
        map_draw[stair_pos.y][stair_pos.x] = CHAR_MAP.stair;
    if(!(portal_pos.x === undefined) && !(portal_pos.y === undefined) && player.map_sight[portal_pos.y][portal_pos.x])
        map_draw[portal_pos.y][portal_pos.x] = CHAR_MAP.portal;
}

// 壁更新
function updateMDWall() {
    for(let i=0; i<SIZEY; i++)
        for(let j=0; j<SIZEX; j++) {
            // 壁
            if(player.map_sight[i][j] && (map[i][j] == ID_MAP.room || isStair(j, i) || isPortal(j, i))) {
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
            else if(map_draw[i][j] == CHAR_MAP[ID_MAP.path] && isDoor(j, i))
                map_draw[i][j] = CHAR_MAP.door;
        }
}

// 罠
function updateMDTrap() {
    for(let t of trap_group)
        if(player.map_sight[t.y][t.x] && t.visible)
            map_draw[t.y][t.x] = CHAR_MAP.trap;
}

// エネミー描画
function updateMDEnemyGroup() {
    for(let e of enemy_group)
        if(player.map_sight[e.y][e.x])
            map_draw[e.y][e.x] = e.char;
}

// ショップ描画
function updateMDShopGroup() {
    for(let s of shop_group)
        if(player.map_sight[s.y][s.x])
            map_draw[s.y][s.x] = s.char;
}

// NPC描画
function updateMDNPCGroup() {
    for(let n of npc_group)
        if(player.map_sight[n.y][n.x])
            map_draw[n.y][n.x] = n.char;
}

// アイテム描画
function updateMDItem() {
    for(let i of item_group)
        if(player.map_sight[i.y][i.x]) {
            if(i.type=="stack")
                map_draw[i.y][i.x] = CHAR_MAP[ITEM_DATA.find(v=>v.id==i.item_id).type];
            else
                map_draw[i.y][i.x] = CHAR_MAP[i.type];
        }
}
