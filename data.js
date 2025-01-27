
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const font_size = 16;
// MAP
const SIZEX = 64;
const SIZEY = 32;
const cell_width = font_size;//font_size/2;
const cell_height = font_size;

const canvas_width = SIZEX*cell_width;
const canvas_height = SIZEY*cell_height;
canvas.style.width = canvas_width+'px';
canvas.style.height = canvas_height+'px';
const canvas_scale = window.devicePixelRatio;
canvas.width = Math.floor(canvas_width*canvas_scale);
canvas.height = Math.floor(canvas_height*canvas_scale);

ctx.scale(canvas_scale, canvas_scale);
ctx.font = font_size+"px 'MS Gothic'";
ctx.fillStyle = "white";
ctx.textBaseline = "top";

const audio_apply = new Audio("sound/apply.wav");
const audio_stair = new Audio("sound/stair.wav");
const audio_portal = new Audio("sound/portal.wav");
const audio_hit = new Audio("sound/hit.wav");
const audio_shot = new Audio("sound/shot.wav");
const audio_fire = new Audio("sound/fire.wav");
const audio_ray = new Audio("sound/ray.wav");

// 日付
const month_list = [
  "Jan.", "Feb", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.", 
];
const now = new Date();
const date = now.getDate();
const month = month_list[now.getMonth()];
const year = now.getFullYear();

// 名前入力用
const hiragana = [
  ["あ","い","う","え","お","は","ひ","ふ","へ","ほ",],
  ["か","き","く","け","こ","ま","み","む","め","も",],
  ["さ","し","す","せ","そ","や","　","ゆ","　","よ",],
  ["た","ち","つ","て","と","ら","り","る","れ","ろ",],
  ["な","に","ぬ","ね","の","わ","　","を","　","ん",],
  ["っ","ゃ","ゅ","ょ","゛","゜","　","消","ｶﾅ","終",],
];
const katakana = [
  ["ア","イ","ウ","エ","オ","ハ","ヒ","フ","ヘ","ホ",],
  ["カ","キ","ク","ケ","コ","マ","ミ","ム","メ","モ",],
  ["サ","シ","ス","セ","ソ","ヤ","　","ユ","　","ヨ",],
  ["タ","チ","ツ","テ","ト","ラ","リ","ル","レ","ロ",],
  ["ナ","ニ","ヌ","ネ","ノ","ワ","　","ヲ","　","ン",],
  ["ッ","ャ","ュ","ョ","゛","゜","　","消","ｶﾅ","終",],
];
let input_name_pos = {x:0, y:0};
let name_max_length = 12;
let input_name_flag = true;
let hiragana_katakana = true;

// キー
let key_input = {
  left: false,
  right: false,
  up: false,
  down: false,
  left_pressed: false,
  right_pressed: false,
  up_pressed: false,
  down_pressed: false,
  up_left: false,
  up_right: false,
  down_left: false,
  down_right: false,
  shift: false,
  ctrl: false,
  apply: false,
  cancel: false,
  sub: false,
  esc: false,
};
const key_direction = {
  up: {x:0,y:-1},
  down: {x:0,y:1},
  left: {x:-1,y:0},
  right: {x:1,y:0},
};
const key_direction_diagonal = {
  up_left: {x:-1,y:-1},
  up_right: {x:1,y:-1},
  down_left: {x:-1,y:1},
  down_right: {x:1,y:1},
};
const key_code={
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp",
  down: "ArrowDown",
  shift: "Shift",
  ctrl: "Control",
  apply: "z",
  cancel: "x",
  sub: "c",
  esc: "Escape",
};

//==================================================MAP==================================================

const ROOMNUM = 10;
const ROOMSIZEMIN = 4;
const ROOMSIZEMAX = 8;
let map = [];
const id_map = {
  none: 0,
  room: 1,
  path: 2,
  stair: 3,
  portal: 4,
  poison: 5,
};
let map_draw = [];  // 描画用
//const char_map = {
//  0: " ",
//  1: ".",
//  2: "#",
//  3: "%",
//  4: "<",
//  5: ".",
//  player: "@",
//  wall_v: "|",
//  wall_h: "—",
//  door: "+",
//  trap: "^",
//  // item
//  gold: "$",
//  consume: "!",
//  food: ":",
//  weapon: ")",
//  armor: "[",
//  ring: "=",
//  scroll: "?",
//  staff: "/",
//  ammo: "\"",
//  unique: "&",
//};
const char_map = {
  0: " ",
  1: "．",
  2: "＃",
  3: "％",
  4: "＜",
  5: "．",
  player: "＠",
  wall_v: "｜",
  wall_h: "―",
  door: "＋",
  trap: "＾",
  // item
  gold: "＄",
  consume: "！",
  food: "：",
  weapon: "）",
  armor: "［",
  ring: "＝",
  scroll: "？",
  staff: "／",
  ammo: "”",
  unique: "＆",
};
let map_shotrange = []; // 射撃・投擲・魔法の範囲
let unique_map = [  // 固有マップ
  {
    id: "test",
    pl_x: 3, pl_y: 3, // プレイヤー位置
    safe_flag: false,
    map: [
  // 0123456789ABCDE
    "000000000000000",//0
    "011111000111110",//1
    "011111000111110",//2
    "011111222111110",//3
    "011111020111110",//4
    "011110020111110",//5
    "000200020002000",//6
    "000222222222000",//7
    "000200020002000",//8
    "011111020111110",//9
    "011111020111110",//A
    "011111222111110",//B
    "011111000111110",//C
    "044444000111110",//D
    "000000000000000",//E
    ],
    func: function(x_offset){
      setItem(0x800,1+x_offset, 1);
      setItem(0xf00,2+x_offset, 1);
      setShop(0x03, 9+x_offset, 1);
      setTrap(0x00, 1+x_offset, 5);
    }
  },
  {
    id: "return", // 帰還ポータル
    pl_x: 4, pl_y: 7,
    safe_flag: true,
    map: [
    "000000000",
    "001131100",
    "001111100",
    "011111110",
    "014111110",
    "011111110",
    "001111100",
    "001111100",
    "000000000",
    ],
    func: function(x_offset){
      setShop(0x03, 6+x_offset, 4);
    }
  },
  {
    id: 0,
    pl_x: 4, pl_y: 11,
    safe_flag: true,
    map: [
    "000000000",
    "000111000",
    "000131000",
    "000111000",
    "000020000",
    "011010110",
    "011212110",
    "011010110",
    "000010000",
    "011111110",
    "011111110",
    "011111110",
    "011111110",
    "011111110",
    "000000000",
    ],
    func: function(x_offset){
      setShop(0x00, 1+x_offset, 7);
      if(player.job == 0xf00) setShop(0x01, 7+x_offset, 6);
      else setNPC(0x01, 7+x_offset, 6);
      setNPC(0x00, 2+x_offset, 9);
      setNPC(0x02, 7+x_offset, 11);
      setNPC(0x03, 1+x_offset, 5);
      setShop(0x02, 1+x_offset, 13);
    }
  },
];

//==================================================INFO==================================================

let room_num;
let turn_cnt = 1;
let floor_cnt = -1;

// 遷移フラグ
let gameover_flag = false;
let ui_flag = false;
let shop_flag = false;
let shot_flag = false;
let throwing_flag = false;
let magic_flag = false;

let turn_flag = false;  // ターン経過
let safe_flag = false;  // 空腹度無効化
let clairvoyance_flag = false;  // 透視
let bow_flag = false;

// プレイヤー
let player = {
  x: 0, y: 0,

  name: "",
  lv: 1,
  job: 0xf00,
  job_name: "持たざる者",
  exp:0, next_exp:100,
  hp:10, hp_max:10, hp_max_offset:0,
  mp:0, mp_max:0, mp_max_offset:0,
  atk:1, atk_offset:0,
  def:1, def_offset:0,

  hung:100, hung_max:100, hung_max_offset: 0,
  hung_rate: 5, hung_rate_offset: 0, // 空腹度の減り具合 /turn
  hp_regen_rate: 10, hp_regen_rate_offset: 0,
  mp_regen_rate: 10, mp_regen_rate_offset: 0,
  sight_range: 1, sight_range_offset: 0, // 視界距離

  // 成長率
  lvup: {hp_max: 3, mp_max: 3},

  gold: 0,
  weapon: undefined,
  ammo: undefined,
  armor: undefined,
  ring1: undefined,
  ring2: undefined,
  
  map_sight: [], // 視界 //TODO: 全域のt/fを保存するのは非効率
};
const multiple_slot = ["ring"];
let magic_using = undefined;

//==================================================ITEM==================================================

const item_data = [
  // 消費アイテム
  {
    id: 0x000,
    name: "金貨",
    type: "gold"
  },
  {
    id: 0x010,
    name: "三日月草",
    type: "consume",
    func: function(){
      if(player.hp >= player.hp_max){
        addLog("使う必要はない");
        return false;
      }
      let value = 10;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x011,
    name: "半月草",
    type: "consume",
    func: function(){
      if(player.hp >= player.hp_max){
        addLog("使う必要はない");
        return false;
      }
      let value = 20;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x012,
    name: "後月草",
    type: "consume",
    func: function(){
      if(player.hp >= player.hp_max){
        addLog("使う必要はない");
        return false;
      }
      let value = 30;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x020,
    name: "香料",
    type: "consume",
    func: function(){
      if(player.mp >= player.mp_max){
        addLog("使う必要はない");
        return false;
      }
      let value = 15;
      addMP(player, value);
      addLog(this.name+" を嗅いだ　MP が "+value+" 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x021,
    name: "芳しい香料",
    type: "consume",
    func: function(){
      if(player.mp >= player.mp_max){
        addLog("使う必要はない");
        return false;
      }
      let value = 30;
      addMP(player, value);
      addLog(this.name+" を嗅いだ　MP が "+value+" 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x030,
    name: "糧食",
    type: "food",
    func: function(){
      if(player.hung >= player.hung_max){
        addLog("満腹だ");
        return false;
      }
      let value = 30;
      addHung(value);
      addLog(this.name+" を食べた　空腹度 が "+value+" 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  // 装備
  // 武器 0x1XX
  {
    id: 0x100,
    name: "ショートソード",
    type: "weapon",
    equip_flag: false,
    func_equip: function(){
      player.atk_offset += 2;
    },
    func_unequip: function(){
      player.atk_offset -= 2;
    },
  },
  // 射撃武器 0x2XX
  {
    id: 0x200,
    name: "狩猟弓",
    type: "weapon",
    equip_flag: false,
    func_equip: function(){
      player.atk_offset -= 2;
      bow_flag = true;
      if(!player.ammo)
        for(let i of inventory){
          if(i.type=="ammo"){
            equip(inventory.indexOf(i));
            break;
          }
        }
    },
    func_unequip: function(){
      player.atk_offset += 2;
      bow_flag = false;
    },
  },
  // 鎧 0x3XX
  {
    id: 0x300,
    name: "レザーアーマー",
    type: "armor",
    equip_flag: false,
    func_equip: function(){
      player.def_offset += 1;
    },
    func_unequip: function(){
      player.def_offset -= 1;
    },
  },
  {
    id: 0x380,
    name: "レアルのローブ",
    type: "armor",
    equip_flag: false,
    func_equip: function(){
      player.mp_max += 3;
    },
    func_unequip: function(){
      player.mp_max -= 3;
    },
  },
  // 指輪 0x4XX
  {
    id: 0x400,
    name: "生命の指輪",
    type: "ring",
    equip_flag: false,
    func_equip: function(){
      player.hp_max += 10;
    },
    func_unequip: function(){
      player.hp_max -= 10;
      if(player.hp > player.hp_max) player.hp = player.hp_max;
    },
  },
  // 巻物 0x5XX
  {
    id: 0x500,
    name: "千里眼の巻物",
    type: "scroll",
    func: function(){
      clairvoyance();
      clairvoyance_flag = true;
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  // 杖 0x6XX
  {
    id: 0x600,
    name: "ソウルの杖",
    type: "staff",
    func: function(){
      if(player.mp < 5){
        addLog("MP が足りない");
        return false;
      }
      addLog(this.name+" を構えた");
      magic_flag = true;
      magic_using = this;
      return false;
    },
    func_cast: function(dir){
      player.mp -= 5;
      addLog(player.name+" はソウルの光を放った");
      audio_ray.play();
      magic(player, player.mp_max/3, dir);
    }
  },
  // 弾薬 0x7XX
  {
    id: 0x700,
    name: "木の矢",
    type: "ammo",
    equip_flag: false,
    dmg: 4,
    func_equip: function(){},
    func_unequip: function(){},
  },
  {
    id: 0x7f0,
    name: "胞子",
    type: "ammo",
    dmg: 4,
    func_equip: function(){},
    func_unequip: function(){},
  },
  // スタックアイテム 0x8XX
  {
    id: 0x800,
    name: "木の矢の束",
    type: "stack",
    item_id: 0x700,
    num: 8,
  },
  // ユニーク 0xfXX
  {
    id: 0xf00,
    name: "持たざる者",
    type: "unique",
    hp: 10,
    hp_max: 10,
    mp: 5,
    mp_max: 5,
    atk: 1,
    def: 1,
    hung_rate: 20,
    hp_regen_rate: 10,
    mp_regen_rate: 10,
    sight_range: 1,
    lvup: {hp_max: 3, mp_max: 3},
    func: function(){
      player.job = this.id;
      backLv();

      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0xf01,
    name: "戦士",
    type: "unique",
    hp: 20,
    hp_max: 20,
    mp: 0,
    mp_max: 0,
    atk: 4,
    def: 3,
    hung_rate: 5,
    hp_regen_rate: 10,
    mp_regen_rate: 10,
    sight_range: 1,
    lvup: {hp_max: 5, mp_max: 0},
    func: function(){
      if(inventory_size-inventory.length >= 3){
        player.job = this.id;
        backLv();

        addItem(0x100);
        addItem(0x300);
        addItem(0x011);
        inventory.splice(inventory.indexOf(this), 1);
        return true;
      }
      else{
        addLog("持ちきれない");
        return false;
      }
    },
  },
  {
    id: 0xf02,
    name: "弓兵",
    type: "unique",
    hp: 15,
    hp_max: 15,
    mp: 10,
    mp_max: 10,
    atk: 3,
    def: 1,
    hung_rate: 5,
    hp_regen_rate: 10,
    mp_regen_rate: 10,
    sight_range: 5,
    lvup: {hp_max: 3, mp_max: 2},
    func: function(){
      if(inventory_size-inventory.length >= 3){
        player.job = this.id;
        backLv();

        addItem(0x200);
        for(let i=0; i<8; i++)
          addItem(0x800);
        addItem(0x010);
        inventory.splice(inventory.indexOf(this), 1);
        return true;
      }
      else{
        addLog("持ちきれない");
        return false;
      }
    },
  },
  {
    id: 0xf03,
    name: "魔法使い",
    type: "unique",
    lv: 1,
    hp: 10,
    hp_max: 10,
    mp: 20,
    mp_max: 20,
    atk: 2,
    def: 0,
    exp: 0,
    next_exp: 100,
    hung_rate: 5,
    hp_regen_rate: 10,
    mp_regen_rate: 7,
    sight_range: 3,
    lvup: {hp_max: 1, mp_max: 4},
    func: function(){
      if(inventory_size-inventory.length >= 3){
        player.job = this.id;
        backLv();

        addItem(0x600);
        addItem(0x380);
        addItem(0x020);
        inventory.splice(inventory.indexOf(this), 1);
        return true;
      }
      else{
        addLog("持ちきれない");
        return false;
      }
    },
  },
];
const equip_type = ["weapon", "armor", "ring", "ammo"];
const stack_type = ["ammo"];
const stack_max = 64;
let inventory = [];
const inventory_size = 15;
let inv_cursor = -1;

// 落ちてるアイテム
const item_table = [
  [
    0x000, 0x000, 0x000,
    0x010, 0x020, 0x030,
    0x500, 0x800,
  ],
];
let item_group = [];

//==================================================ENEMY==================================================

const enemy_data = [
  {
    id: 0x000,
    name: "亡者",
    char: "亡",
    lv:1,
    hp:5, hp_max:5, 
    mp:0, mp_max:0, 
    atk:4, def:2,
    speed:1,
    escape_flag: false,
    sight_range:5,
    throwing: undefined,
    exp:2,
  },
  {
    id: 0x001,
    name: "ミランダフラワー",
    char: "ミ",
    lv:1,
    hp:1, hp_max:1, 
    mp:0, mp_max:0, 
    atk:6, def:0,
    speed:0,
    escape_flag: false,
    sight_range:10,
    throwing: 0x7f0,
    exp:1,
  },
  {
    id: 0x002,
    name: "亡者兵士",
    char: "兵",
    lv:2,
    hp:15, hp_max:15,
    mp:0, mp_max:0,
    atk:7, def:7,
    speed:1,
    escape_flag: false,
    sight_range:4,
    throwing: undefined,
    exp:4,
  },
  {
    id: 0x003,
    name: "白人",
    char: "白",
    lv:3,
    hp:12, hp_max:12, 
    mp:15, mp_max:15,
    atk:4, def:2,
    speed:1,
    escape_flag: true,
    sight_range:7,
    throwing: 0x700,
    exp:4,
  },
  {
    id: 0x004,
    name: "スケルトン",
    char: "ス",
    lv:3,
    hp:9, hp_max:9,
    mp:5, mp_max:5,
    atk:10, def:4,
    speed:1,
    escape_flag: false,
    sight_range:3,
    throwing: undefined,
    exp:6,
  },
];
const enemy_table = [
  [
    0x000, 0x000, 0x000, 0x000, 0x001,
  ],
  [
    0x001, 0x002, 0x002, 0x003,
  ],
  [
    0x002, 0x003, 0x004,
  ],
];
let enemy_group = [];
const chase_count_init = 5;

//==================================================TRAP==================================================
const trap_data = [
  {
    id:0x00,
    name: "トラばさみ",
    func: function(who){
      let dmg = 5;
      addHP(who, -dmg);
      addLog(who.name+" はトラばさみにかかった　"+dmg+" のダメージ");
      audio_hit.play();
    },
  },
];
const trap_table = [
  [],
  [
    0x00,
  ],
  [
    0x00,
  ],
  [
    0x00,
  ],
  [
    0x00,
  ],
];
let trap_group = [];

//==================================================NPC==================================================

// NPC
const npc_data = [
  {
    id: 0x00,
    name: "案内人",
    char: "案",
    dialogue: [
      "左が薬屋、右が職安、正面がダンジョンだ",
      "薬屋には治癒士もいるぞ",
      "",
    ],
    dialogue_cnt: 0,
    func: function(){
      if(this.dialogue_cnt >= this.dialogue.length-1)
        this.dialogue_cnt = 0;
    },
  },
  {
    id: 0x01,
    name: "職安",
    char: "職",
    dialogue: [
      "頑張れよ",
    ],
    dialogue_cnt: 0,
    func: function(){},
  },
  {
    id: 0x02,
    name: "助言者",
    char: "助",
    dialogue: [
      "助言するよ",
      // ダンジョン
      "待機すると周りにある罠を看破できるよ",
      "モンスターは君が見えなくなってしばらくすると追跡を諦めるよ",
      // 職業
      "戦士は基礎ステータスが高いよ",
      "弓兵は視界が広いよ",
      "魔法使いはMPの自然回復が速いよ",
      "職業毎にHPとMPの成長率が違うよ",
      "指輪は2つ装備できるよ",
      "弓を装備すると、一番上の矢が自動的に装備されるよ",
      "弓は近距離戦闘が苦手だよ",
      "基本的に杖の威力は最大MP依存だよ",
      "職業で装備できるものに差はないよ",
      // 拠点
      "10階層毎にここに戻れるよ",
      "戻ってくるとレベルは1に戻るよ",
      "メレンは物を買ってくれるよ",
      "このメッセージは表示されないはずだよ",
    ],
    dialogue_cnt: 0,
    func: function(){
      if(this.dialogue_cnt >= this.dialogue.length-1)
        this.dialogue_cnt = 0;
    },
  },
  {
    id: 0x03,
    name: "治癒士",
    char: "癒",
    dialogue: [
      "回復します",
    ],
    dialogue_cnt: 0,
    func: function(){
      fullRecovery(player);
    },
  },
];
let npc_group = [];

// ショップ
const shop_data = [
  {
    id: 0x00,
    name: "薬屋",
    char: "薬",
    dialogue_intro: "いらっしゃい",
    dialogue_outro: "またどうぞ",
    random_flag: false,
    item_table: [
      {id: 0x010, price: 5,},
      {id: 0x011, price: 10,},
      {id: 0x020, price: 5,},
      {id: 0x030, price: 5,},
    ],
    func_before: function(){},
    func_buy: function(){},
    func_after: function(){},
  },
  {
    id: 0x01,
    name: "職安",
    char: "職",
    dialogue_intro: "3つから選んでくれ",
    dialogue_outro: "頑張れよ",
    random_flag: false,
    item_table: [
      {id: 0xf01, price: 0,},
      {id: 0xf02, price: 0,},
      {id: 0xf03, price: 0,},
    ],
    func_before: function(){
      if(inventory_size-inventory.length < 4){
        addLog(shop_using.name+"「...持ちきれないぞ」");
        shop_using = undefined;
        shop_cursor = -1;
        shop_flag = false;
      }
    },
    func_buy: function(){
      addLog(shop_using.name+"「"+shop_using.dialogue_outro+"」");
      shop_using = undefined;
      shop_cursor = -1;
      shop_flag = false;
      setNPC(0x01, this.x, this.y);
      shop_group.splice(shop_group.indexOf(this),1);
      useItem([inventory.length-1]);
    },
    func_after: function(){},
  },
  {
    id: 0x02,
    name: "行商メレン",
    char: "メ",
    dialogue_intro: "売っておくれ...　何か売っておくれよ...",
    dialogue_outro: "すまないねぇ...　ヒヒヒッ... ",
    random_flag: false,
    item_table: [
      {id: 0x010, price: -3,},
      {id: 0x011, price: -6,},
      {id: 0x012, price: -9,},
      {id: 0x020, price: -4,},
      {id: 0x021, price: -8,},
      {id: 0x030, price: -3,},
      {id: 0x100, price: -30,},
      {id: 0x200, price: -30,},
      {id: 0x300, price: -30,},
      {id: 0x400, price: -100,},
      {id: 0x500, price: -20,},
      {id: 0x700, price: -1,},
    ],
    func_before: function(){},
    func_buy: function(){},
    func_after: function(){},
  },
  {
    id: 0x03,
    name: "孤高なガヴァ",
    char: "ガ",
    dialogue_intro: "オマエ　ガヴァ　ショウダイ？　...ショウバイ！",
    dialogue_outro: "マイダ...　マイドアリ！",
    random_flag: true,
    item_num: 5,  // 販売品の個数(テーブルからランダム)
    item_table: [
      {id: 0x011, price: 5,},
      {id: 0x021, price: 15,},
      {id: 0x100, price: 50,},
      {id: 0x200, price: 50,},
      {id: 0x300, price: 50,},
      {id: 0x400, price: 150,},
      {id: 0x800, price: 20,},
      {id: 0x030, price: -15,},
    ],
    func_before: function(){},
    func_buy: function(){},
    func_after: function(){},
  },
];
let shop_group = [];
let shop_cursor = -1;
let shop_using = undefined; // 利用中のショップ
