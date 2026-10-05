//=========================INFO=========================

function drawInfo() {
    info.innerHTML = "";

    // マップ情報
    info.insertAdjacentHTML("beforeend", floor_cnt+"F");
    //info.insertAdjacentHTML("beforeend", " POS: ("+player.x+", "+player.y+")<br>");
    info.insertAdjacentHTML("beforeend", " TURN: "+turn_cnt+"<br>");
    info.insertAdjacentHTML("beforeend", "<br>");

    // キー入力
    //info.insertAdjacentHTML("beforeend", "KEY:<br>");
    //for(let k in key_input)
    //    if(key_input[k])
    //        info.insertAdjacentHTML("beforeend", k+"|");
    //info.insertAdjacentHTML("beforeend", "<br>");

    // ステータス
    info.insertAdjacentHTML("beforeend", "STATUS<br>");
    info.insertAdjacentHTML("beforeend", "NAME: "+player.name+"<br>");
    info.insertAdjacentHTML("beforeend", "JOB : "+player.job_name+"<br>");
    info.insertAdjacentHTML("beforeend", "LV&nbsp; : "+player.lv+"<br>");
    info.insertAdjacentHTML("beforeend", "EXP : "+player.exp+"<br>");
    let cond_info = "";
    for(let cond of player.condition) cond_info += cond.name+" "
    info.insertAdjacentHTML("beforeend", "COND: "+cond_info+"<br>");
    info.insertAdjacentHTML("beforeend", "HP&nbsp; : "+player.hp+" / "+(player.hp_max+player.hp_max_offset)+"<br>");
    info.insertAdjacentHTML("beforeend", "FP&nbsp; : "+player.fp+" / "+(player.fp_max+player.fp_max_offset)+"<br>");
    info.insertAdjacentHTML("beforeend", "ATK : "+(player.atk+player.atk_offset)+"<br>");
    info.insertAdjacentHTML("beforeend", "DEF : "+(player.def+player.def_offset)+"<br>");
    info.insertAdjacentHTML("beforeend", "HUNG: "+player.hung+" / "+(player.hung_max+player.hung_max_offset)+"<br>");
    info.insertAdjacentHTML("beforeend", "GOLD: "+player.gold+"<br>");
    info.insertAdjacentHTML("beforeend", "<br>");
}

//=========================INVENTORY=========================

function drawInv() {
    inv.innerHTML = "ロード中";
    if(inventory_flag || storage_IO_flag || skill_flag) inv.style.border = "solid 1px white";
    else inv.style.border = "solid 1px black";

    const body_padding = parseInt(window.getComputedStyle(document.body).paddingTop);
    const body_margin = parseInt(window.getComputedStyle(document.body).marginTop);
    inv_display_num = Math.floor((window.innerHeight-body_padding-body_margin-info.clientHeight-arrow_size*3)/inv.clientHeight) - 2;

    inv.innerHTML = "";
    if(remember_ui == "inventory") {
        if(inv_cursor < inv_start_offset) inv_start_offset = inv_cursor;
        if(inv_cursor >= inv_display_num + inv_start_offset) inv_start_offset = inv_cursor - inv_display_num + 1;

        inv.insertAdjacentHTML("beforeend", " 　 INVENTORY → <br>");
        for(let i=inv_start_offset; i<inv_display_num+inv_start_offset && i<INVENTORY_SIZE; i++) {
            let str = "";
            if(i == inv_cursor)
                str += "＞\u2007";
            else
                str += "　\u2007";
            if(i < inventory.length) {
                if(inventory[i].equip_flag)
                    str += "[E]" + inventory[i].name;
                else
                    str += inventory[i].name;
                if(inventory[i].stack_num)
                    str += " ×" + inventory[i].stack_num;
            }
            else
                str += "　------　";
            inv.insertAdjacentHTML("beforeend", str + "<br>");
        }
    } 
    else if(remember_ui == "skill") {
        skill_display_num = inv_display_num;
        if(skill_cursor < skill_start_offset) skill_start_offset = skill_cursor;
        if(skill_cursor >= skill_display_num + skill_start_offset) skill_start_offset = skill_cursor - skill_display_num + 1;

        inv.insertAdjacentHTML("beforeend", " ← SKILL 　 <br>");
        for(let i=skill_start_offset; i<skill_display_num+skill_start_offset && i<SKILL_SIZE; i++) {
            let str = "";
            if(i == skill_cursor)
                str += "＞\u2007";
            else
                str += "　\u2007";
            if(i == skill_favorite_idx)
                str += "＊";
            if(i < player_skill.length) {
                str += player_skill[i].name;
            }
            else
                str += "　------　";
            inv.insertAdjacentHTML("beforeend", str + "<br>");
        }
    }
}

//=========================SHOP=========================

function drawShop() {
    shop.innerHTML = "";
    shop.style.border = "solid 1px black";
    if(shop_flag) {
        shop.innerHTML = "ロード中";
        if(!storage_IO_flag) shop.style.border = "solid 1px white";

        const body_padding = parseInt(window.getComputedStyle(document.body).paddingTop);
        const shop_margin =  parseInt(window.getComputedStyle(document.body).marginTop);
        let content_height = window.innerHeight-body_padding*2-shop_margin-canvas.clientHeight-arrow_size*3;
        if(isPhone()) content_height /= 2;
        shop_display_num = Math.floor(content_height/shop.clientHeight) - 2;

        if(shop_cursor < shop_start_offset) shop_start_offset = shop_cursor;
        if(shop_cursor >= shop_display_num + shop_start_offset) shop_start_offset = shop_cursor - shop_display_num + 1;

        shop.innerHTML = "";
        let header;
        if(upgrade_flag) header = "UPGRADE";
        else if(storage_flag) header = "STORAGE";
        else if(learning_flag) header = "LEARNING";
        else header = "SHOP";
        shop.insertAdjacentHTML("beforeend", header + "<br>");
        for(let i=shop_start_offset; i<shop_using.item.length && i<shop_display_num+shop_start_offset; i++) {
            let str = "";
            if(i == shop_cursor)
                str += "＞\u2007";
            else
                str += "　\u2007";
            if(upgrade_flag) {
                str += shop_using.item[i].name;
                str += " : "+shop_using.item[i].upgrade_cost+"G";
            }
            else if(storage_flag) {
                str += shop_using.item[i].name;
                if(shop_using.item[i].stack_num > 0)
                    str += "×"+shop_using.item[i].stack_num;
            }
            else if(learning_flag) {
                if(player_skill.find(v=>v.id==shop_using.item[i].id))
                    str += "["+shop_using.item[i].name+"]";
                else
                    str += shop_using.item[i].name;
            }
            else if(shop_using.item[i].price>=0) {
                str += shop_using.item[i].name;
                str += " : "+shop_using.item[i].price+"G";
            }
            else{
                str += "(売) "+shop_using.item[i].name;
                str += " : "+(-shop_using.item[i].price)+"G";
            }
            shop.insertAdjacentHTML("beforeend", str + "<br>");
        }
        if(shop_using.item.length <= 0)
            shop.insertAdjacentHTML("beforeend", "--- なし ---");
    }
}

//=========================LOG=========================

function drawLog() {
    log.innerHTML = "ロード中";

    const body_padding = parseInt(window.getComputedStyle(document.body).paddingTop);
    const body_margin = parseInt(window.getComputedStyle(document.body).marginTop);
    let content_height = window.innerHeight-body_padding-body_margin-canvas.clientHeight-arrow_size*3;
    if(isPhone() && shop_flag) content_height /= 2;
    log_display_num = Math.floor(content_height/log.clientHeight) - 2;

    log.innerHTML = "";
    for(let i=(log_reserve.length-log_display_num<0)?0:log_reserve.length-log_display_num; i<log_reserve.length; i++)
        log.insertAdjacentHTML("afterbegin",log_reserve[i]+"<br>");
    log.insertAdjacentHTML("afterbegin","LOG<br>");
}

function addSpaceAfterBreak(str) {
    if(str.match(/<br>/)) {
        let index = [0];
        let br_num = str.match(/<br>/g).length;
        for(let i=0; i<br_num; i++) {
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
        for(let i=0; i<str_slice.length-1; i++) {
            str_slice[i].replace("<br>", "");
            str_slice[i] += "<br>";
            for(let n=0; n<space_num; n++)
                str_slice[i] += "&nbsp;";
        }
        return str_slice.join("");
    }
    return str;
}

function addLog(text) {
    log_reserve.push(addSpaceAfterBreak(turn_cnt + ": " + text));
    if(log_reserve.length>LOG_RESERVE_SIZE)
        log_reserve.shift();
    drawLog();
}

function addLogSameLine(text) {
    log_reserve[log_reserve.length-1] += "　" + text;
    drawLog();
}

//=========================NOTE=========================

function drawNote() {
    if(isPhone()) return;

    note.innerHTML = "NOTE<br>";
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.player+"&nbsp;", color_yellow)+": "+player.name+"<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;赤 ", color_red)+": 敵<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;黄 ", color_yellow)+": NPC<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.stair+"&nbsp;", color_green)+": 階段<br>");;
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.portal+"&nbsp;", color_green)+": 帰還ゲート<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.trap+"&nbsp;", color_green)+": 罠<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.gold+"&nbsp;", color_yellow)+": 金貨<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.weapon+"&nbsp;", color_yellow)+": 武器<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.armor+"&nbsp;", color_yellow)+": 鎧<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.ring+"&nbsp;", color_yellow)+": 指輪<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.potion+"&nbsp;", color_yellow)+": 回復<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.food+"&nbsp;", color_yellow)+": 食料<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.consume+"&nbsp;", color_yellow)+": 消耗品<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.scroll+"&nbsp;", color_yellow)+": 巻物<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.staff+"&nbsp;", color_yellow)+": 杖<br>");
    note.insertAdjacentHTML("beforeend", 
        colorUI("&nbsp;"+CHAR_MAP.ammo+"&nbsp;", color_yellow)+": 弾薬<br>");
    note.insertAdjacentHTML("beforeend", "<br>");
    note.insertAdjacentHTML("beforeend", "CONTROL<br>");
    note.insertAdjacentHTML("beforeend", "- 移動<br>&nbsp; ←↑↓→<br>");
    note.insertAdjacentHTML("beforeend", "- 斜め移動<br>&nbsp; ←↑↓→ + CTRL<br>");
    note.insertAdjacentHTML("beforeend", "- 高速移動<br>&nbsp; ←↑↓→ + SHIFT<br>");
    note.insertAdjacentHTML("beforeend", "- 攻撃<br>&nbsp; ←↑↓→ TO "+colorUI("赤字", color_red)+"<br>");
    note.insertAdjacentHTML("beforeend", "- 待機: Z<br>");
    note.insertAdjacentHTML("beforeend", "- インベントリ: X<br>");
    note.insertAdjacentHTML("beforeend", "- 登録スキル: C<br>");
    note.insertAdjacentHTML("beforeend", "<br>");
    note.insertAdjacentHTML("beforeend", "INVENTORY<br>");
    note.insertAdjacentHTML("beforeend", "- 使う/装備: Z<br>");
    note.insertAdjacentHTML("beforeend", "- 戻る: X<br>");
    note.insertAdjacentHTML("beforeend", "- 投擲: C<br>");
    note.insertAdjacentHTML("beforeend", "- 項目切替: ← →<br>");
    note.insertAdjacentHTML("beforeend", "<br>");
    note.insertAdjacentHTML("beforeend", "SKILL<br>");
    note.insertAdjacentHTML("beforeend", "- 使う: Z<br>");
    note.insertAdjacentHTML("beforeend", "- 戻る: X<br>");
    note.insertAdjacentHTML("beforeend", "- スキル登録: C<br>");
}

// UI色
function colorUI(char, color) {
    return '<span style="color:'+color+';">'+char+'</span>';
}
