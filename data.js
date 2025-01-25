
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
let name_max_length = 10;
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
  key: "",
};
const key_direction = {
  left: {x:-1,y:0},
  right: {x:1,y:0},
  up: {x:0,y:-1},
  down: {x:0,y:1},
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
  trap: 6,
};
let map_draw = [];  // 描画用
//const char_map = {
//  0: " ",
//  1: ".",
//  2: "#",
//  3: "%",
//  4: "<",
//  5: ".",
//  6: "^",
//  player: "@",
//  npc: "0",
//  wall_v: "|",
//  wall_h: "—",
//  door: "+",
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
  6: "＾",
  player: "＠",
  npc: "Ｃ",
  wall_v: "｜",
  wall_h: "―",
  door: "＋",
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
let map_sight = []; // 視界
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
      if(player_info.job == "持たざる者") setShop(0x01, 7+x_offset, 6);
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

// プレイヤー
let player = {
  name: "",
  x: 0, y: 0,
  hp:0, hp_max:0,
  mp:0, mp_max:0,
  atk:0, atk_offset:0,
  def:0, def_offset:0,
};
let player_info = {
  job: "持たざる者",
  hung:0, hung_max:0,
  hunger_rate: 5, // 空腹度の減り具合 /turn
  hp_regen_rate: 10,
  mp_regen_rate: 10,
  sight_range: 1, // 視界距離
  gold: 0,
  weapon: undefined,
  ammo: undefined,
  armor: undefined,
  ring1: undefined,
  ring2: undefined,
  bow: false,
};
const multiple_slot = ["ring"];

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
      addHP(player, 10);
      addLog(this.name+" を飲んだ　HP が 10 回復した");
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
      addHP(player, 20);
      addLog(this.name+" を飲んだ　HP が 20 回復した");
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
      addHP(player, 30);
      addLog(this.name+" を飲んだ　HP が 30 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x020,
    name: "新鮮な香料",
    type: "consume",
    func: function(){
      if(player.mp >= player.mp_max){
        addLog("使う必要はない");
        return false;
      }
      addMP(player, 10);
      addLog(this.name+" を嗅いだ　MP が 10 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x021,
    name: "古びた香料",
    type: "consume",
    func: function(){
      if(player.mp >= player.mp_max){
        addLog("使う必要はない");
        return false;
      }
      addMP(player, 20);
      addLog(this.name+" を嗅いだ　MP が 20 回復した");
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x030,
    name: "パン",
    type: "food",
    func: function(){
      if(player_info.hung >= player_info.hung_max){
        addLog("満腹だ");
        return false;
      }
      addHung(20);
      addLog(this.name+" を食べた　空腹度 が 20 回復した");
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
    func_equip: function(){
      player.atk_offset -= 2;
      player_info.bow = true;
      if(!player_info.ammo)
        for(let i of inventory){
          if(i.type=="ammo"){
            equipPlayer(inventory.indexOf(i));
            break;
          }
        }
    },
    func_unequip: function(){
      player.atk_offset += 2;
      player_info.bow = false;
    },
  },
  // 鎧 0x3XX
  {
    id: 0x300,
    name: "レザーアーマー",
    type: "armor",
    func_equip: function(){
      player.def_offset += 1;
    },
    func_unequip: function(){
      player.def_offset -= 1;
    },
  },
  // 指輪 0x4XX
  {
    id: 0x400,
    name: "生命の指輪",
    type: "ring",
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
    name: "火球の杖",
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
      addLog(player.name+" は 火球 を放った");
      audio_fire.play();
      shot(player, undefined, dir, player.mp_max/2);
    }
  },
  // 弾薬 0x7XX
  {
    id: 0x700,
    name: "木の矢",
    type: "ammo",
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
    name: "戦士キット",
    type: "unique",
    func: function(){
      if(inventory_size-inventory.length >= 4){
        player_info.job = "戦士";
        player.hp_max += 20;
        player.hp += 20;
        player.mp_max += 0;
        player.mp += 0;
        player.atk += 5;
        player.def += 5;
        addItem(0x100);
        addItem(0x300);
        addItem(0x400);
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
    id: 0xf01,
    name: "弓兵キット",
    type: "unique",
    func: function(){
      if(inventory_size-inventory.length >= 5){
        player_info.job = "弓兵";
        player.hp_max += 10;
        player.hp += 10;
        player.mp_max += 10;
        player.mp += 10;
        player.atk += 3;
        player.def += 3;
        player_info.sight_range += 4;
        addItem(0x200);
        addItem(0x300);
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
    id: 0xf02,
    name: "魔法キット",
    type: "unique",
    func: function(){
      if(inventory_size-inventory.length >= 4){
        player_info.job = "魔法使い";
        player.hp_max += 5;
        player.hp += 5;
        player.mp_max += 20;
        player.mp += 20;
        player.atk += 1;
        player.def += 2;
        player_info.mp_regen_rate += 4;
        addItem(0x600);
        addItem(0x010);
        addItem(0x021);
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
let inventory = [];  // 所持アイテム
const inventory_size = 10;
let inv_cursor = -1;
let magic_using = undefined;

// 落ちてるアイテム
let item_group = [];
const item_group_table = [
  [
    0x000,
    0x010, 0x020, 0x030,
    0x500, 0x800,
  ],
];

//==================================================ENEMY==================================================

const enemy_data = [
  {
    id: 0x00,
    name: "",
    char: "A",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x01,
    name: "",
    char: "B",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x02,
    name: "",
    char: "C",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x03,
    name: "",
    char: "D",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x04,
    name: "",
    char: "E",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x05,
    name: "ミランダフラワー",
    char: "花",//"F",
    hp:3, hp_max:3, 
    mp:0, mp_max:0, 
    atk:6, def:0,
    speed:0,
    throwing: 0x7f0,
  },
  {
    id: 0x06,
    name: "ゴブリン",
    char: "ゴ",//"G",
    hp:8, hp_max:8, 
    mp:0, mp_max:0, 
    atk:8, def:2,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x07,
    name: "",
    char: "H",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x08,
    name: "",
    char: "I",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x09,
    name: "",
    char: "J",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x0A,
    name: "",
    char: "K",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x0B,
    name: "",
    char: "L",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x0C,
    name: "",
    char: "M",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:0,
    throwing: undefined,
  },
  {
    id: 0x0D,
    name: "",
    char: "N",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x0E,
    name: "",
    char: "O",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x0F,
    name: "",
    char: "P",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x10,
    name: "",
    char: "Q",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x11,
    name: "リリパット",
    char: "リ",//"R",
    hp:4, hp_max:4, 
    mp:0, mp_max:0, 
    atk:4, def:0,
    speed:1,
    throwing: 0x700,
  },
  {
    id: 0x12,
    name: "",
    char: "S",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x13,
    name: "",
    char: "T",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x14,
    name: "",
    char: "U",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x15,
    name: "",
    char: "V",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x16,
    name: "",
    char: "W",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x17,
    name: "",
    char: "X",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x18,
    name: "",
    char: "Y",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
  {
    id: 0x19,
    name: "",
    char: "Z",
    hp:0, hp_max:0, 
    mp:0, mp_max:0, 
    atk:0, def:0,
    speed:1,
    throwing: undefined,
  },
];
let enemy_group = [];
const enemy_table = [
  [
    0x06, 0x06, 0x06, 0x06, 0x05,
  ],
];

//==================================================NPC==================================================

// NPC
const npc_data = [
  {
    id: 0x00,
    name: "案内人",
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
    dialogue: [
      "頑張れよ",
    ],
    dialogue_cnt: 0,
    func: function(){},
  },
  {
    id: 0x02,
    name: "助言者",
    dialogue: [
      "5階層毎にここに戻れるよ",
      "指輪は2つ装備できるよ",
      "弓を装備すると、一番上の矢が自動的に装備されるよ",
      "弓は近距離戦闘が苦手だよ",
      "基本的に杖の威力は最大MP依存だよ",
      "戦士は基礎ステータスが高いよ",
      "弓兵は弓を持ってて、視界が広いよ",
      "魔法使いはMPの自然回復が速いよ",
      "職業で装備できるものに差はないよ",
      "一部の敵は武器とか防具を装備するよ",
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
    name: "ちゆし",
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
    dialogue_intro: "いらっしゃい",
    dialogue_outro: "またどうぞ",
    random_flag: false,
    item_table: [
      {id: 0x010, price: 10,},
      {id: 0x011, price: 20,},
      {id: 0x020, price: 20,},
      {id: 0x030, price: 10,},
    ],
    func_before: function(){},
    func_buy: function(){},
    func_after: function(){},
  },
  {
    id: 0x01,
    name: "職安",
    dialogue_intro: "3つから選んでくれ",
    dialogue_outro: "頑張れよ",
    random_flag: false,
    item_table: [
      {id: 0xf00, price: 0,},
      {id: 0xf01, price: 0,},
      {id: 0xf02, price: 0,},
    ],
    func_before: function(){},
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
    dialogue_intro: "買っておくれ...　何か買っておくれよ...",
    dialogue_outro: "すまないねぇ...　ヒヒヒッ... ",
    random_flag: true,
    item_num: 5,  // 販売品の個数(テーブルからランダム)
    item_table: [
      {id: 0x500, price: 30,},
      {id: 0x100, price: 50,},
      {id: 0x200, price: 50,},
      {id: 0x300, price: 50,},
      {id: 0x400, price: 150,},
      {id: 0x800, price: 20,},
    ],
    func_before: function(){},
    func_buy: function(){},
    func_after: function(){},
  },
  {
    id: 0x03,
    name: "孤高なガヴァラン",
    dialogue_intro: "オマエ　ガヴァラン　ショウダイ？　...ショウバイ！",
    dialogue_outro: "マイダ...　マイドアリ！",
    random_flag: false,
    item_table: [
      {id: 0x011, price: 20,},
      {id: 0x021, price: 20,},
      {id: 0x030, price: 10,},

      {id: 0x010, price: -2,},
      {id: 0x011, price: -6,},
      {id: 0x012, price: -15,},
      {id: 0x020, price: -5,},
      {id: 0x021, price: -10,},
      {id: 0x030, price: -2,},
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
];
let shop_group = [];
let shop_cursor = -1;
let shop_using = undefined; // 利用中のショップ