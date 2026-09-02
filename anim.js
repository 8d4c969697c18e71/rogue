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
            map_draw[obj.y][obj.x] = char_map[map[obj.y][obj.x]];
            visible = false;
        }
        else if(obj.id === undefined){
            map_draw[obj.y][obj.x] = char_map.player;
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
async function animShot(from, dst, direction, char = char_map.ammo, fps = 60) {
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
    if(item.type == "consume") char = char_map.consume;
    else if(item.type == "food") char = char_map.food;
    else if(item.type == "weapon") char = char_map.weapon;
    else if(item.type == "armor") char = char_map.armor;
    else if(item.type == "ring") char = char_map.ring;
    else if(item.type == "scroll") char = char_map.scroll;
    else if(item.type == "staff") char = char_map.staff;
    else if(item.type == "unique") char = char_map.unique;
    else char = char_map.ammo;

    // 描画
    await animShot(from, dst, direction, char, fps);
}