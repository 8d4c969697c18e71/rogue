// 点滅
async function animBlink(obj, ms = 200, fps = 60) {
    // 視界外
    if(!player.map_sight[obj.y][obj.x]) {
        return false;
    }

    // 描画
    let visible = true;
    for(let i=0; i<ms; i+=fps) {
        if(visible) {
            map_draw[obj.y][obj.x] = CHAR_MAP[map[obj.y][obj.x]];
            visible = false;
        }
        else if(obj.id === undefined){
            map_draw[obj.y][obj.x] = CHAR_MAP.player;
            visible = true;
        }
        else {
            map_draw[obj.y][obj.x] = obj.char;
            visible = true;
        }
        drawMap();
        await wait(fps);
    }
    return true;
}

// 射撃物描画
async function animShot(from, dst, direction, char = CHAR_MAP.ammo, fps = 60) {
    // 描画座標を先に取得
    let draw_pos_list = [];
    for(let i=1; i<SIZEX && i<SIZEY; i++) {
        let tmp_dst = straightRecursive(from.x, from.y, direction, i);
        if(!player.map_sight[tmp_dst.y][tmp_dst.x] || (tmp_dst.x == dst.x && tmp_dst.y == dst.y)) break;
        draw_pos_list.push(tmp_dst);
    }

    // 描画
    for(let draw_pos in draw_pos_list) {
        updateMap();
        map_draw[draw_pos_list[draw_pos].y][draw_pos_list[draw_pos].x] = char;
        drawMap();
        await wait(fps);
    }
    updateMap();
    drawMap();
}

// 投射物描画
async function animThrow(from, dst, direction, item, fps = 100) {
    // 描画文字取得
    let char;
    if(item.type == "consume") char = CHAR_MAP.consume;
    else if(item.type == "food") char = CHAR_MAP.food;
    else if(item.type == "weapon") char = CHAR_MAP.weapon;
    else if(item.type == "armor") char = CHAR_MAP.armor;
    else if(item.type == "ring") char = CHAR_MAP.ring;
    else if(item.type == "scroll") char = CHAR_MAP.scroll;
    else if(item.type == "staff") char = CHAR_MAP.staff;
    else if(item.type == "unique") char = CHAR_MAP.unique;
    else char = CHAR_MAP.ammo;

    // 描画
    await animShot(from, dst, direction, char, fps);
}