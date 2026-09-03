// 名前入力
async function inputName(){
  ctx.textAlign = "center";
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  let y_offset = FONT_SIZE*2;
  ctx.fillText("名前を入力してください", canvas.clientWidth/2, y_offset);
  
  // 十字
  if(key_input.left){
    if(input_name_pos.x > 0){
      input_name_pos.x--;
      if(HIRAGANA[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.x--;
    }
    else
      input_name_pos.x = HIRAGANA[0].length-1;
  }
  else if(key_input.right){
    if(input_name_pos.x < HIRAGANA[0].length-1){
      input_name_pos.x++;
      if(HIRAGANA[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.x++;
    }
    else
      input_name_pos.x = 0;
  }
  else if(key_input.up){
    if(input_name_pos.y > 0){
      input_name_pos.y--;
      if(HIRAGANA[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.y--;
    }
    else
      input_name_pos.y = HIRAGANA.length-1;
  }
  else if(key_input.down){
    if(input_name_pos.y < HIRAGANA.length-1){
      input_name_pos.y++;
      if(HIRAGANA[input_name_pos.y][input_name_pos.x]=="　")
        input_name_pos.y++;
    }
    else
    input_name_pos.y = 0;
  }
  // apply
  if(key_input.apply){
    audio_apply.play();
    if(syllabary[input_name_pos.y][input_name_pos.x]=="消")
      player.name = player.name.slice(0, -1);

    else if(syllabary[input_name_pos.y][input_name_pos.x]=="ｶﾅ"){
      if(syllabary == KATAKANA) syllabary = HIRAGANA;
      else syllabary = KATAKANA;

      // 一覧
      displaySyllabary(y_offset+FONT_SIZE*4);
    }

    else if(syllabary[input_name_pos.y][input_name_pos.x]=="終"){
      ctx.textAlign = "start";
      input_name_flag = false;
      await init();
      return;
    }
    else
      player.name += syllabary[input_name_pos.y][input_name_pos.x];
  }
  // cancel
  if(key_input.cancel)
    player.name = player.name.slice(0, -1);

  // 一覧
  displaySyllabary(y_offset+FONT_SIZE*4);

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
  ctx.fillText(player.name+space, canvas.clientWidth/2-name_max_length/2, FONT_SIZE*3/2+y_offset);
  
  // 操作説明
  ctx.fillText("z : 決定　　←↑↓→ : 移動", canvas.clientWidth/2, FONT_SIZE*2*(syllabary.length+2)+y_offset);
}

// 五十音表示
function displaySyllabary(y_offset){
  let x_offset = canvas.clientWidth/2-(syllabary[0].length*2-1)*FONT_SIZE/2;
  for(let i=0; i<syllabary.length; i++)
    for(let j=0; j<syllabary[i].length; j++){
      if(input_name_pos.x == j && input_name_pos.y == i)
        ctx.fillText(">"+syllabary[i][j], x_offset+FONT_SIZE*2*j, FONT_SIZE*2*i+y_offset);
      else
      ctx.fillText(" "+syllabary[i][j], x_offset+FONT_SIZE*2*j, FONT_SIZE*2*i+y_offset);
    }
}
