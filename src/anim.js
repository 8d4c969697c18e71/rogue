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
        else if(obj == player) {
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

// 射撃
async function animShot(from, dst, direction, char = CHAR_MAP.ammo, fps = 60) {
    for(let i=1; i<SIZEX && i<SIZEY; i++) {
        updateMap();

        // 描画座標
        const dx = from.x + direction.x * i;
        const dy = from.y + direction.y * i;
        
        // 非表示条件
        if(dx == dst.x && dy == dst.y) break;
        if(dx < 0 || dx >= SIZEX) continue;
        if(dy < 0 || dy >= SIZEY) continue;
        if(!player.map_sight[dy][dx]) continue;
        
        // 描画
        map_draw[dy][dx] = char;
        drawMap();
        await wait(fps);
    }

    // 描画リセット
    updateMap();
    drawMap();
}

// 伝播
async function animSpread(x, y, radius, char, on_wall_flag = false, fps = 60) {
    // 伝播
    for(let k=0; k<=radius; k++) {
        updateMap();
        for(let i=-k; i<=k; i++) {
            const dy = y + i;
            if(dy < 0 || dy >= SIZEY) continue;

            for(let j=-k; j<=k; j++) {
                const dx = x + j;
                if(dx < 0 || dx >= SIZEX) continue;
                if(!player.map_sight[dy][dx]) continue;
                if(!on_wall_flag && map[dy][dx] == ID_MAP.none) continue;

                map_draw[dy][dx] = char;
            }
        }
        drawMap();
        await wait(fps);
    }

    // 消失
    for(let k=0; k<=radius; k++) {
        updateMap();
        for(let i=-radius; i<=radius; i++) {
            const dy = y + i;
            if(dy < 0 || dy >= SIZEY) continue;

            for(let j=-radius; j<=radius; j++) {
                const dx = x + j;
                if(dx < 0 || dx >= SIZEX) continue;
                if(!player.map_sight[dy][dx]) continue;
                if(!on_wall_flag && map[dy][dx] == ID_MAP.none) continue;
                if(Math.abs(i) < k && Math.abs(j) < k) continue;
                
                map_draw[dy][dx] = char;
            }
        }
        drawMap();
        await wait(fps);
    }

    updateMap();
    drawMap();
}

// 直線
async function animLine(x, y, dir, range, width, char, on_wall_flag = false, fps = 60) {
    const dst = getStraightRecursive(x, y, dir, range);
    // 方向に対する法線ベクトル
    const vertical_dir = getVerticalDirection(dir);
    if(!vertical_dir) return;

    for(let k=1; k<range; k++) {
        updateMap();
        for(let i=1; i<=k; i++) {
            for(let j=0; j<width; j++) {
                for(let vxy of vertical_dir) {
                    const dx = x + dir.x * i + vxy.x * j;
                    const dy = y + dir.y * i + vxy.y * j;
                    if(dx < 0 || dx >= SIZEX) continue;
                    if(dy < 0 || dy >= SIZEY) continue;
                    if(!player.map_sight[dy][dx]) continue;
                    if(!on_wall_flag && map[dy][dx] == ID_MAP.none) continue;

                    map_draw[dy][dx] = char;
                }
            }
            if(x + dir.x * i == dst.x && y + dir.y * i == dst.y) break;
        }
        drawMap();
        await wait(fps);
    }

    for(let k=1; k<range; k++) {
        updateMap();
        for(let i=1; i<=range; i++) {
            for(let j=0; j<width; j++) {
                for(let vxy of vertical_dir) {
                    const dx = x + dir.x * i + vxy.x * j;
                    const dy = y + dir.y * i + vxy.y * j;
                    if(dx < 0 || dx >= SIZEX) continue;
                    if(dy < 0 || dy >= SIZEY) continue;
                    if(!player.map_sight[dy][dx]) continue;
                    if(!on_wall_flag && map[dy][dx] == ID_MAP.none) continue;
                    if(Math.abs(i) < k && Math.abs(j) < k) continue;

                    map_draw[dy][dx] = char;
                }
            }
            if(x + dir.x * i == dst.x && y + dir.y * i == dst.y) break;
        }
        drawMap();
        await wait(fps);
    }

    updateMap();
    drawMap();
}
