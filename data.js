const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const inv = document.getElementById("inv");
const log = document.getElementById("log");
const note = document.getElementById("note");
const shop = document.getElementById("shop");
const button = document.getElementById("button");
const btn_z = document.getElementById("btn_z");
const btn_x = document.getElementById("btn_x");
const btn_c = document.getElementById("btn_c");
const arrow = document.getElementById("arrow");
const btn_left = document.getElementById("btn_left");
const btn_up = document.getElementById("btn_up");
const btn_down = document.getElementById("btn_down");
const btn_right = document.getElementById("btn_right");
const btn_upleft = document.getElementById("btn_upleft");
const btn_downleft = document.getElementById("btn_downleft");
const btn_upright = document.getElementById("btn_upright");
const btn_downright = document.getElementById("btn_downright");
const btn = document.getElementsByClassName("btn");
const btn_arrow = document.getElementsByClassName("btn_arrow");



const FONT_SIZE = 16;
const FONT = "'MS Gothic'";
// MAP
const SIZEX = 64;
const SIZEY = 64;
const CELL_WIDTH = FONT_SIZE;//FONT_SIZE/2;
const CELL_HEIGHT = FONT_SIZE;

let log_reserve = [];
const LOG_RESERVE_SIZE = 10;

const PADDING = 5;
const MARGIN = 25;
const NOTE_WIDTH = 150;
const INFO_WIDTH = 175;

// スマホ用
button.style.visibility = "hidden";//"visible";
let zxc_size = 0;
let arrow_size = 0;
let log_display_num = 5;
let inv_display_num = 15;
let inv_start_offset = 0;
let shop_start_offset = 0;



const audio_apply = new Audio("sound/apply.wav");
const audio_fire = new Audio("sound/fire.wav");
const audio_heal = new Audio("sound/heal.wav");
const audio_attack = new Audio("sound/attack.wav");
const audio_hit = new Audio("sound/hit.wav");
const audio_jump = new Audio("sound/jump.wav");
const audio_poison = new Audio("sound/poison.wav");
const audio_portal = new Audio("sound/portal.wav");
const audio_ray = new Audio("sound/ray.wav");
const audio_shot = new Audio("sound/shot.wav");
const audio_stair = new Audio("sound/stair.wav");
const audio_lvup = new Audio("sound/lvup.wav");
const audio_death = new Audio("sound/death.wav");

//====================================================================================================

// 日付
const MONTH_LIST = [
  "Jan.", "Feb", "Mar.", "Apr.", "May", "Jun.",
  "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.", 
];
const NOW = new Date();
const DATE = NOW.getDate();
const MONTH = MONTH_LIST[NOW.getMonth()];
const YEAR = NOW.getFullYear();

// 名前入力用
const HIRAGANA = [
  ["あ","い","う","え","お","は","ひ","ふ","へ","ほ",],
  ["か","き","く","け","こ","ま","み","む","め","も",],
  ["さ","し","す","せ","そ","や","　","ゆ","　","よ",],
  ["た","ち","つ","て","と","ら","り","る","れ","ろ",],
  ["な","に","ぬ","ね","の","わ","　","を","　","ん",],
  ["っ","ゃ","ゅ","ょ","゛","゜","　","消","ｶﾅ","終",],
];
const KATAKANA = [
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
let syllabary = HIRAGANA;

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
const KEY_DIRECTION = {
  up: {x:0,y:-1},
  down: {x:0,y:1},
  left: {x:-1,y:0},
  right: {x:1,y:0},
};
const KEY_DIRECTION_DIAGONAL = {
  up_left: {x:-1,y:-1},
  up_right: {x:1,y:-1},
  down_left: {x:-1,y:1},
  down_right: {x:1,y:1},
};
const KEY_CODE={
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
const ROOMSIZEMIN = 6;
const ROOMSIZEMAX = 10;
let map = [];
const ID_MAP = {
  none: 0,
  room: 1,
  path: 2,
};
let map_draw = [];  // 描画用
//const char_map = {
//  0: " ",
//  1: ".",
//  2: "#",
//  player: "@",
//  wall_v: "|",
//  wall_h: "—",
//  stair: "%",
//  portal: "<",
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
const CHAR_MAP = {
  0: " ",
  1: "．",
  2: "＃",
  player: "＠",
  wall_v: "｜",
  wall_h: "―",
  stair: "％",
  portal: "＜",
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
  ray: "＊",
};
let map_shotrange = []; // 射撃・投擲・魔法の範囲
let stair_pos = {x:undefined, y:undefined};
let portal_pos = {x:undefined, y:undefined};

//==================================================INFO==================================================

let room_num;
let turn_cnt = 1;
let floor_cnt = -1;

// 遷移フラグ
let exeEventsFlg = false;
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

const STATUS_LIST= ["str", "dex", "int", "fth"];
const MULTIPLE_SLOT = ["ring"];
const THROWING_RANGE = 5;
const MAGIC_RANGE = 10;
const ATK_BASE = 25;
const DEF_BASE = 0;

// プレイヤー
let player = {
  x: 0, y: 0,

  name: "",
  lv: 0,
  job: undefined,
  job_name: "",
  exp:0, next_exp:0,
  hp:0, hp_max:0, hp_max_offset:0,
  mp:0, mp_max:0, mp_max_offset:0,
  
  str:0,
  dex:0,
  int:0,
  fth:0,
  
  // 外的要因で変わるやつ
  atk:0,
  def:0,

  // st変更時再計算用関数保持
  recalc: [],

  hung:0, hung_max:0, hung_max_offset: 0,
  hung_rate: 0, hung_rate_offset: 0, // 空腹度の減り具合 /turn
  hp_regen_rate: 0, hp_regen_rate_offset: 0,
  mp_regen_rate: 0, mp_regen_rate_offset: 0,
  sight_range: 0, sight_range_offset: 0, // 視界距離
  condition: [], // 状態異常
  cannot_action_flag: false, // 行動不能
  cannot_move_flag: false, // 移動不能

  // 成長率
  lvup: {},

  gold: 0,
  weapon: undefined,
  ammo: undefined,
  armor: undefined,
  ring1: undefined,
  ring2: undefined,
  magic_using: undefined,
  
  // 視界
  map_sight: [], //TODO: 全域のt/fを保存するのは非効率
};

// 状態異常
const CONDITION_DATA = [//TODO
  // デバフ 0x00~
  {
    id: 0x00,
    name: "毒",
    turn: 5,
    func_be: async function(who){
      addLog(who.name+" は毒に侵された");
    },
    func_during: async function(who){
      let dmg = 20;
      addHP(who, -dmg);
      addLog("毒が "+who.name+" の体を蝕む　"+dmg+" のダメージ");
    },
    func_recovery: async function(who){
      addLog(who.name+" の毒は取り除かれた");
    },
  },
  {
    id: 0x01,
    name: "眠",
    turn: 5,
    func_be: async function(who){
      addLog(who.name+" は眠りに落ちた");
      who.cannot_action_flag = true;
    },
    func_during: async function(who){
      addLog(who.name+" は眠っている");
      who.cannot_action_flag = true;
    },
    func_recovery: async function(who){
      addLog(who.name+" は目を覚ました");
      who.cannot_action_flag = false;
    },
  },
  {
    id: 0x02,
    name: "盲",
    turn: 10,
    func_be: async function(who){
      addLog(who.name+" は前が見えない");
      who.sight_range_offset = -who.sight_range;
    },
    func_during: async function(who){
    },
    func_recovery: async function(who){
      addLog(who.name+" の視力は回復した");
      who.sight_range_offset = 0;
    },
  },
  {
    id: 0x03,
    name: "縛",
    turn: 10,
    func_be: async function(who){
      addLog(who.name+" は身動きがとれない");
      who.cannot_move_flag = true;
    },
    func_during: async function(who){
      who.cannot_move_flag = true;
    },
    func_recovery: async function(who){
      addLog(who.name+" は動けるようになった");
      who.cannot_move_flag = false;
    },
  },
  // バフ 0x80~
  {
    id: 0x80,
    name: "受",
    turn: 2,
    func_be: async function(who){
      addLog(who.name+" は受け流しの構えをとった");
      who.cannot_action_flag = true;
      if(who == player) turn--;
    },
    func_during: async function(who){
      who.cannot_action_flag = true;
    },
    func_recovery: async function(who){
      addLog(who.name+" は受け流しの構えを解いた");
      who.cannot_action_flag = false;
    },
  },
];

//==================================================TRAP==================================================

const TRAP_DATA = [//TODO
  {
    id: 0x00,
    name: "毒床",
    func: async function(who){
      await setCondition(who, 0x00);
      addLog(who.name+" は毒の床を踏んだ");
      audio_poison.play();
    },
  },
  {
    id: 0x01,
    name: "睡眠ガス",
    func: async function(who){
      await setCondition(who, 0x01);
      addLog(who.name+" は睡眠ガスに包まれた");
      audio_poison.play();
    },
  },
  {
    id: 0x02,
    name: "黒い霧",
    func: async function(who){
      await setCondition(who, 0x02);
      addLog(who.name+" の周囲が黒い霧に包まれた");
      audio_poison.play();
    },
  },
  {
    id: 0x03,
    name: "トラばさみ",
    func: async function(who){
      await setCondition(who, 0x03);
      addLog(who.name+" はトラばさみにかかった");
      audio_hit.play();
    },
  },
  {
    id: 0x04,
    name: "転送罠",
    func: async function(who){
      let [x,y] = [];
      while(1){
        [x,y] = setRandomXY();
        if(!isSameRoom(who.x, who.y, x, y))
          break;
      }
      who.x = x;
      who.y = y;
      addLog(who.name+" は転送罠にかかった");
      audio_portal.play();
    },
  },
];
const TRAP_TABLE = [
  [],
  [
    0x00,
  ],
  [
    0x00, 0x01, 0x04,
  ],
  [
    0x00, 0x02, 0x04,
  ],
  [
    0x01, 0x02, 0x03, 0x04,
  ],
  [
    0x01, 0x02, 0x03, 0x04,
  ],
];
let trap_group = [];

//==================================================ITEM==================================================

const ITEM_DATA = [//TODO
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
    func: async function(){
      let value = 50;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x011,
    name: "半月草",
    type: "consume",
    func: async function(){
      let value = 100;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x012,
    name: "後月草",
    type: "consume",
    func: async function(){
      let value = 200;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x013,
    name: "満月草",
    type: "consume",
    func: async function(){
      let value = 400;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x014,
    name: "新月草",
    type: "consume",
    func: async function(){
      let value = player.hp_max;
      addHP(player, value);
      addHung(5);
      addLog(this.name+" を飲んだ　HP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x020,
    name: "香料",
    type: "consume",
    func: async function(){
      let value = 15;
      addMP(player, value);
      addLog(this.name+" を嗅いだ　MP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x021,
    name: "芳しい香料",
    type: "consume",
    func: async function(){
      let value = 30;
      addMP(player, value);
      addLog(this.name+" を嗅いだ　MP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x022,
    name: "祝福された香料",
    type: "consume",
    func: async function(){
      let value = player.mp_max;
      addMP(player, value);
      addLog(this.name+" を嗅いだ　MP が "+value+" 回復した");
      audio_heal.play();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  {
    id: 0x030,
    name: "糧食",
    type: "food",
    func: async function(){
      let value = 30;
      addHung(value);
      addLog(this.name+" を食べた　空腹度 が "+value+" 回復した");
      audio_heal.play();
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
    base_dmg: 25,
    func_equip: async function(){
      player.atk += this.base_dmg;
      calcAtkFromStatus("str", 1.25, true, this.base_dmg);
      calcAtkFromStatus("dex", 1.25, true, this.base_dmg);
      pushRecalc(this, this.func_equip);
    },
    func_unequip: async function(){
      player.atk -= this.base_dmg;
      calcAtkFromStatus("str", 1.25, false, this.base_dmg);
      calcAtkFromStatus("dex", 1.25, false, this.base_dmg);
      removeRecalc(this, this.func_equip);
    },
    func_attack: async function(to){},
  },
  {
    id: 0x101,
    name: "ブロードソード",
    type: "weapon",
    base_dmg: 40,
    func_equip: async function(){
      player.atk += this.base_dmg;
      calcAtkFromStatus("str", 1.3, true, this.base_dmg);
      calcAtkFromStatus("dex", 1.25, true, this.base_dmg);
      pushRecalc(this, this.func_equip);
    },
    func_unequip: async function(){
      player.atk -= this.base_dmg;
      calcAtkFromStatus("str", 1.3, false, this.base_dmg);
      calcAtkFromStatus("dex", 1.25, false, this.base_dmg);
      removeRecalc(this, this.func_equip);
    },
    func_attack: async function(to){},
  },
  // 射撃武器 0x2XX
  {
    id: 0x200,
    name: "狩猟弓",
    type: "weapon",
    base_dmg: 25,
    func_equip: async function(){
      bow_flag = true;
      player.atk += this.base_dmg;
      calcAtkFromStatus("dex", 1.1, true, this.base_dmg);
      pushRecalc(this, this.func_equip);
    },
    func_unequip: async function(){
      bow_flag = false;
      player.atk -= this.base_dmg;
      calcAtkFromStatus("dex", 1.1, false, this.base_dmg);
      removeRecalc(this, this.func_equip);
    },
    func_attack: async function(to){},
  },
  // 鎧 0x3XX
  {
    id: 0x300,
    name: "レザーアーマー",
    type: "armor",
    func_equip: async function(){
      player.def += 10;
    },
    func_unequip: async function(){
      player.def -= 10;
    },
    func_attacked: async function(from){},
  },
  {
    id: 0x301,
    name: "チェインメイル",
    type: "armor",
    func_equip: async function(){
      player.def += 12;
    },
    func_unequip: async function(){
      player.def -= 12;
    },
    func_attacked: async function(from){},
  },
  {
    id: 0x302,
    name: "無名騎士の鎧",
    type: "armor",
    func_equip: async function(){
      player.def += 14;
    },
    func_unequip: async function(){
      player.def -= 14;
    },
    func_attacked: async function(from){},
  },
  {
    id: 0x380,
    name: "レアルのローブ",
    type: "armor",
    func_equip: async function(){
      player.mp_max_offset += 3;
    },
    func_unequip: async function(){
      player.mp_max_offset -= 3;
    },
    func_attacked: async function(from){},
  },
  // 指輪 0x4XX
  {
    id: 0x400,
    name: "小生命の指輪",
    type: "ring",
    func_equip: async function(){
      player.hp_max_offset += 25;
    },
    func_unequip: async function(){
      player.hp_max_offset -= 25;
      addHP(player, 0);
    },
  },
  {
    id: 0x401,
    name: "蛇印の指輪",
    type: "ring",
    func_equip: async function(){
      player.mp_max_offset += 20;
    },
    func_unequip: async function(){
      player.mp_max_offset -= 20;
      addMP(player, 0);
    },
  },
  {
    id: 0x402,
    name: "飽食の指輪",
    type: "ring",
    func_equip: async function(){
      player.hung_rate_offset += 5;
    },
    func_unequip: async function(){
      player.hung_rate_offset -= 5;
    },
  },
  {
    id: 0x403,
    name: "生命の指輪",
    type: "ring",
    func_equip: async function(){
      player.hp_max_offset += 75;
    },
    func_unequip: async function(){
      player.hp_max_offset -= 75;
      addHP(player, 0);
    },
  },
  // 巻物 0x5XX
  {
    id: 0x500,
    name: "千里眼の巻物",
    type: "scroll",
    func: async function(){
      clairvoyance();
      inventory.splice(inventory.indexOf(this), 1);
      return true;
    },
  },
  // 杖 0x6XX
  {
    id: 0x600,
    name: "ソウルの杖",
    type: "staff",
    func: async function(){
      if(player.mp < 8){
        addLog("MP が足りない");
        return false;
      }
      addLog(player.name+" は "+this.name+" を構えた");
      magic_flag = true;
      player.magic_using = this;
      return false;
    },
    func_cast: async function(dir){
      addMP(player, -8);
      addLog(player.name+" はソウルの光を放った");
      audio_ray.play();
      await animShot(player, straightRecursive(player.x, player.y, dir, MAGIC_RANGE), dir, CHAR_MAP.ray);
      return magic(player, 70+player.int*2, dir);
    }
  },
  {
    id: 0x601,
    name: "回復の聖鈴",
    type: "staff",
    func: async function(){
      if(player.mp < 8){
        addLog("MP が足りない");
        return false;
      }
      addMP(player, -8);
      let value = 30 + player.fth * 2;
      addHP(player, value);
      addLog("淡い光が "+player.name+" を包む　HPが "+value+" 回復した");
      audio_heal.play();
      return undefined;
    },
    func_cast: async function(dir){}
  },
  {
    id: 0x602,
    name: "跳躍の杖",
    type: "staff",
    func: async function(){
      if(player.mp < 7){
        addLog("MP が足りない");
        return false;
      }
      addLog(this.name+" を構えた");
      magic_flag = true;
      player.magic_using = this;
      return false;
    },
    func_cast: async function(dir){
      addMP(player, -7);
      if(jump(player, dir, 3)){
        addLog(player.name+" は跳んだ");
        audio_jump.play();
      }
      else
        addLog("跳躍に失敗した");
      return undefined;
    }
  },
  // 弾薬 0x7XX
  {
    id: 0x700,
    name: "木の矢",
    type: "ammo",
    dmg: 20,
    range: 10,
    func_equip: async function(){},
    func_unequip: async function(){},
  },
  {
    id: 0x701,
    name: "鉄の矢",
    type: "ammo",
    dmg: 30,
    range: 8,
    func_equip: async function(){},
    func_unequip: async function(){},
  },
  {
    id: 0x7f0,
    name: "胞子",
    type: "ammo",
    dmg: 10,
    range: 2,
    func_equip: async function(){},
    func_unequip: async function(){},
  },
  // スタックアイテム 0x8XX
  {
    id: 0x800,
    name: "木の矢の束",
    type: "stack",
    item_id: 0x700,
    num: 8,
  },
  {
    id: 0x801,
    name: "鉄の矢の束",
    type: "stack",
    item_id: 0x701,
    num: 8,
  },
  // ユニーク 0xfXX
  {
    id: 0xf00,
    name: "持たざる者",
    type: "unique",
    hp: 100,
    hp_max: 100,
    mp: 10,
    mp_max: 10,
    str: 2,
    dex: 2,
    int: 2,
    fth: 4,
    def: 5,
    hung_rate: 30,
    hp_regen_rate: 10,
    mp_regen_rate: 10,
    sight_range: 3,
    lvup: {hp_max: 30, mp_max: 3, str: 2, dex: 2, fth: 3},
    func: async function(){
      log_reserve.pop();
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
    hp: 200,
    hp_max: 200,
    mp: 0,
    mp_max: 0,
    str: 4,
    dex: 2,
    int: 1,
    fth: 3,
    def: 10,
    hung_rate: 10,
    hp_regen_rate: 10,
    mp_regen_rate: 10,
    sight_range: 3,
    lvup: {hp_max: 40, mp_max: 1, str: 3, dex: 2},
    func: async function(){
      if(INVENTORY_SIZE-inventory.length >= 3){
        log_reserve.pop();
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
    hp: 150,
    hp_max: 150,
    mp: 10,
    mp_max: 10,
    str: 2,
    dex: 4,
    int: 3,
    fth: 1,
    def: 7,
    hung_rate: 10,
    hp_regen_rate: 10,
    mp_regen_rate: 10,
    sight_range: 9,
    lvup: {hp_max: 25, mp_max: 2, dex: 4, int: 1},
    func: async function(){
      if(INVENTORY_SIZE-inventory.length >= 5){
        log_reserve.pop();
        player.job = this.id;
        backLv();

        addItem(0x200);
        for(let i=0; i<8; i++)
          addItem(0x800);
        addItem(0x010);
        addItem(0x602);
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
    hp: 100,
    hp_max: 100,
    mp: 20,
    mp_max: 20,
    str: 1,
    dex: 2,
    int: 6,
    fth: 1,
    def: 2,
    hung_rate: 10,
    hp_regen_rate: 10,
    mp_regen_rate: 7,
    sight_range: 6,
    lvup: {hp_max: 10, mp_max: 4, int: 4, fth: 1},
    func: async function(){
      if(INVENTORY_SIZE-inventory.length >= 3){
        log_reserve.pop();
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
const EQUIP_TYPE = ["weapon", "armor", "ring", "ammo"];
const STACK_TYPE = ["ammo"];
const STACK_MAX = 32;
let inventory = [];
const INVENTORY_SIZE = 20;
let inv_cursor = 0;

// 落ちてるアイテム
const ITEM_TABLE = [
  [
    0x000, 0x000, 0x000,
    0x010, 0x020, 0x030,
    0x800,
  ],
  [
    0x000, 0x000, 0x000,
    0x010, 0x020, 0x030,
    0x500, 0x800,
  ],
  [
    0x000, 0x000, 0x000,
    0x010, 0x020, 0x030,
    0x500, 0x800,
  ],
  [
    0x000, 0x000, 0x000, 0x000, 0x000, 0x000,
    0x010, 0x010, 0x020, 0x020, 0x030, 0x030, 
    0x011, 0x011,
    0x100, 0x300, 0x400, 
    0x500, 0x800, 0x800,
  ],
  [
    0x000, 0x000, 0x000, 0x000, 0x000, 0x000,
    0x010, 0x010, 0x020, 0x020, 0x030, 0x030, 
    0x011, 0x011,
    0x100, 0x300, 0x400, 
    0x500, 0x800, 0x800,
  ],
  [
    0x000, 0x000, 0x000, 0x000, 0x000, 0x000,
    0x010, 0x010, 0x020, 0x020, 0x030, 0x030, 
    0x011, 0x011,
    0x100, 0x300, 0x400, 
    0x500, 0x800, 0x800,
  ],
  [
    0x000, 0x000, 0x000, 0x000, 0x000, 0x000,
    0x010, 0x010, 0x020, 0x020, 0x030, 0x030, 
    0x011, 0x011,
    0x100, 0x101, 0x300, 0x301, 0x400, 
    0x500, 0x800, 0x800,
  ],
];
let item_group = [];

//==================================================ENEMY==================================================

const ENEMY_DATA = [//TODO
  {
    id: 0x000,
    name: "亡者",
    char: "亡",
    lv:1,
    hp:120, hp_max:120, 
    mp:0, mp_max:0, 
    atk:30, def:10,
    speed:1,
    sight_range:5,
    escape_flag: false,
    distance: 0,
    group_spawn_flag: false,
    exp:3,
    func_spawn: async function(me){},
    func_died: async function(){},
    skill: [],
  },
  {
    id: 0x001,
    name: "ミランダフラワー",
    char: "花",
    lv:1,
    hp:50, hp_max:50, 
    mp:0, mp_max:0, 
    atk:20, def:5,
    speed:1,
    sight_range:2,
    escape_flag: false,
    distance: 0,
    group_spawn_flag: true,
    exp:2,
    func_spawn: async function(me){
      await setConditionTurn(me, 0x03, 1000);
      log_reserve.splice(log_reserve.length-1, 1);
    },
    func_died: async function(){},
    skill: [
      {
        id: 0x000,
        chance: 1,
        ammo: 0x7f0,
      },
    ],
  },
  {
    id: 0x002,
    name: "亡者兵士",
    char: "兵",
    lv:2,
    hp:150, hp_max:150,
    mp:0, mp_max:0,
    atk:50, def:15,
    speed:1,
    sight_range:4,
    escape_flag: false,
    distance: 0,
    group_spawn_flag: false,
    exp:5,
    func_spawn: async function(me){},
    func_died: async function(){},
    skill: [],
  },
  {
    id: 0x003,
    name: "白人",
    char: "白",
    lv:1,
    hp:100, hp_max:100, 
    mp:15, mp_max:15,
    atk:40, def:6,
    speed:1,
    sight_range:6,
    escape_flag: false,
    distance:3,
    group_spawn_flag: false,
    exp:7,
    func_spawn: async function(me){
      this.lv = Math.floor(floor_cnt/2);
      this.hp_max = Math.floor(10*floor_cnt/3);
      this.hp = this.hp_max;
      this.mp_max = Math.floor(15*floor_cnt/3);
      this.mp = this.mp_max;
    },
    func_died: async function(){},
    skill: [
      {
        id: 0x000,
        chance: 0.75,
        ammo: 0x700,
      },
    ],
  },
  {
    id: 0x004,
    name: "スケルトン",
    char: "骨",
    lv:3,
    hp:150, hp_max:150,
    mp:5, mp_max:5,
    atk:60, def:5,
    speed:1,
    sight_range:5,
    escape_flag: false,
    distance: 0,
    group_spawn_flag: false,
    exp:7,
    func_spawn: async function(me){},
    func_died: async function(){},
    skill: [
      {
        id:0x001,
        chance: 0.33,
      },
    ],
  },
  {
    id: 0x005,
    name: "ネズミ",
    char: "鼠",
    lv:3,
    hp:110, hp_max:110,
    mp:3, mp_max:3,
    atk:20, def:5,
    speed:2,
    sight_range:8,
    escape_flag: false,
    distance: 0,
    group_spawn_flag: true,
    exp:5,
    func_spawn: async function(me){},
    func_died: async function(){},
    skill: [
      {
        id: 0x003,
        chance: 0.5,
      }
    ],
  },
  {
    id: 0x006,
    name: "車輪骸骨",
    char: "車",
    lv:4,
    hp:200, hp_max:200,
    mp:5, mp_max:5,
    atk:40, def:10,
    speed:1,
    sight_range:5,
    escape_flag: false,
    distance: 0,
    group_spawn_flag: false,
    exp:8,
    func_spawn: async function(me){},
    func_died: async function(){},
    skill: [
      {
        id: 0x004,
        chance: 1,
      }
    ],
  },
];
const OTHER_ENEMY_INFO = {
  //x: x, y: y, travel_x:x, travel_y:y, map_sight: [], condition: [], 
  cannot_action_flag: false, cannot_move_flag: false,
  chase_flag: false, chase_count: 0, chase_limit: 5,
  berserk_flag: false, berserk_chase_flag: false,
  hp_max_offset: 0, mp_max_offset: 0, sight_range_offset: 0,
  next_exp: 10, lvup: {},
};
const ENEMY_TABLE = [
  [
    0x000, 0x000, 0x001,
  ],
  [
    0x000, 0x000, 0x002, 0x003,
  ],
  [
    0x002, 0x002, 0x002, 0x003, 0x004,
  ],
  [
    0x002, 0x004, 0x005,
  ],
  [
    0x002, 0x004, 0x005, 0x006,
  ],
  [
    0x002, 0x003, 0x004, 0x005, 0x006,
  ],
];
let enemy_group = [];

//==================================================SKILL==================================================

const SKILL_DATA = [//TODO
  {
    id: 0x000,
    name: "射撃",
    ammo: undefined,
    func: async function(from, to){
      for(let d in KEY_DIRECTION){
        let ammo = Object.assign({}, ITEM_DATA.find(v=>v.id==this.ammo));
        let xy = straightRecursive(from.x, from.y, KEY_DIRECTION[d], ammo.range-1);
        if(xy.x+KEY_DIRECTION[d].x == to.x && xy.y+KEY_DIRECTION[d].y == to.y && from.map_sight[to.y][to.x]){
          await shot(from, ammo, KEY_DIRECTION[d]);
          return true;
        }
      }
      for(let d in KEY_DIRECTION_DIAGONAL){
        let ammo = Object.assign({}, ITEM_DATA.find(v=>v.id==this.ammo));
        let xy = straightRecursive(from.x, from.y, KEY_DIRECTION_DIAGONAL[d], ammo.range-1);
        if(xy.x+KEY_DIRECTION_DIAGONAL[d].x == to.x && xy.y+KEY_DIRECTION_DIAGONAL[d].y == to.y && from.map_sight[to.y][to.x]){
          await shot(from, ammo, KEY_DIRECTION_DIAGONAL[d]);
          return true;
        }
      }
      return false;
    },
  },
  {
    id: 0x001,
    name: "受け流し",
    func: async function(from, to){
      await setCondition(from, 0x80);
      return true;
    }
  },
  {
    id: 0x002,
    name: "クイックステップ",
    direction: undefined,
    distance: undefined,
    func: async function(from, to){
      return jump(from, this.direction, this.distance);
    }
  },
  {
    id: 0x003,
    name: "毒攻撃",
    func: async function(from, to){
      for(let d in KEY_DIRECTION){
        let x = from.x + KEY_DIRECTION[d].x;
        let y = from.y + KEY_DIRECTION[d].y;
        if(x == to.x && y == to.y && canDiagonal(from.x, from.y, KEY_DIRECTION[d].x, KEY_DIRECTION[d].y)){
          await attack(from, to);
          if(Math.floor(Math.random()+0.33))
            await setCondition(to, 0x00);
          return true;
        }
      }
      for(let d in KEY_DIRECTION_DIAGONAL){
        let x = from.x + KEY_DIRECTION_DIAGONAL[d].x;
        let y = from.y + KEY_DIRECTION_DIAGONAL[d].y;
        if(x == to.x && y == to.y && canDiagonal(from.x, from.y, KEY_DIRECTION_DIAGONAL[d].x, KEY_DIRECTION_DIAGONAL[d].y)){
          await attack(from, to);
          if(Math.floor(Math.random()+0.33))
            await setCondition(to, 0x00);
          return true;
        }
      }
      return false;
    }
  },
  {
    id: 0x004,
    name: "突撃",
    func: async function(from, to){
      for(let d in KEY_DIRECTION){
        let xy = straightRecursiveDiagonal(from.x, from.y, KEY_DIRECTION[d], SIZEX+SIZEY);
        if(xy.x+KEY_DIRECTION[d].x == to.x && xy.y+KEY_DIRECTION[d].y == to.y && canDiagonal(from.x, from.y, KEY_DIRECTION[d].x, KEY_DIRECTION[d].y) && from.map_sight[to.y][to.x]){
          addLog(from.name+" は "+to.name+" に突撃した");
          await attack(from, to);
          while(await move(from, KEY_DIRECTION[d])){
            updateMap();
            drawMap();
          }
          return true;
        }
      }
      for(let d in KEY_DIRECTION_DIAGONAL){
        let xy = straightRecursiveDiagonal(from.x, from.y, KEY_DIRECTION_DIAGONAL[d], SIZEX+SIZEY);
        if(xy.x+KEY_DIRECTION_DIAGONAL[d].x == to.x && xy.y+KEY_DIRECTION_DIAGONAL[d].y == to.y && canDiagonal(from.x, from.y, KEY_DIRECTION_DIAGONAL[d].x, KEY_DIRECTION_DIAGONAL[d].y) && from.map_sight[to.y][to.x]){
          addLog(from.name+" は "+to.name+" に突撃した");
          await attack(from, to);
          while(await move(from, KEY_DIRECTION_DIAGONAL[d])){
            updateMap();
            drawMap();
          }
          return true;
        }
      }
      return false;
    }
  },
];

//==================================================NPC==================================================

// NPC
const NPC_DATA = [
  {
    id: 0x00,
    name: "案内人",
    char: "案",
    loop: true,
    dialogue: [
      "左が商店、右が職安、正面がダンジョンだ",
      "ダンジョンの入り口には治癒士もいるぞ",
    ],
    dialogue_cnt: 0,
    func: async function(){},
  },
  {
    id: 0x01,
    name: "職安",
    char: "職",
    loop: true,
    dialogue: [
      "今のお前のステータスを教えてやろう",
      "",
    ],
    dialogue_cnt: 0,
    func: async function(){
      this.dialogue[1] = "STR: "+player.str+", DEX: "+player.dex+", INT: "+player.int+", FTH: "+player.fth;
    },
  },
  {
    id: 0x02,
    name: "助言者",
    char: "助",
    loop: true,
    dialogue: [
      "助言するよ",
      // ダンジョン
      "射撃で届く距離は弾によって変わるよ",
      "投擲は5マス先まで投げられるよ",
      "4階以降は罠があるよ",
      "待機すると周りにある罠を看破できるよ",
      "モンスターは君が見えなくなってしばらくすると追跡を諦めるよ",
      // 職業
      "戦士は基礎ステータスが高いよ",
      "弓兵は視界が広いよ",
      "魔法使いはMPの自然回復が速いよ",
      "職業毎にHP・MP・ステータス値の成長率が違うよ",
      "指輪は2つ装備できるよ",
      //"弓を装備すると、一番上の矢が自動的に装備されるよ",
      //"基本的に杖の威力は最大MP依存だよ",
      "職業で装備できるものに差はないよ",
      // 拠点
      "10階層毎にここに戻れるよ",
      "戻ってくるとレベルは1に戻るよ",
      "メレンは物を買ってくれるよ",
      "職安はステータス値を教えてくれるよ",
    ],
    dialogue_cnt: 0,
    func: async function(){},
  },
  {
    id: 0x03,
    name: "治癒士",
    char: "癒",
    loop: false,
    dialogue: [
      "回復します",
    ],
    dialogue_cnt: 0,
    func: async function(){
      fullRecovery(player);
      audio_heal.play();
    },
  },
];
let npc_group = [];

// ショップ
const SHOP_DATA = [//TODO
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
    func_before: async function(){},
    func_buy: async function(){},
    func_after: async function(){},
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
    func_before: async function(){
      if(INVENTORY_SIZE-inventory.length < 4){
        addLog(shop_using.name+"「...持ちきれないぞ」");
        shop_using = undefined;
        shop_cursor = -1;
        shop_flag = false;
      }
    },
    func_buy: async function(){
      shop_group.splice(shop_group.indexOf(this),1);
      await useItem([inventory.length-1]);
      addLog(shop_using.name+"「"+shop_using.dialogue_outro+"」");
      shop_using = undefined;
      shop_cursor = -1;
      shop_flag = false;
      setNPC(0x01, this.x, this.y);
    },
    func_after: async function(){},
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
    func_before: async function(){},
    func_buy: async function(){},
    func_after: async function(){},
  },
  {
    id: 0x03,
    name: "商人カレ",
    char: "商",
    dialogue_intro: "何か買っていかないか？",
    dialogue_outro: "よい商いだったよ",
    random_flag: false,
    item_table: [
      {id: 0x010, price: 5,},
      {id: 0x011, price: 10,},
      {id: 0x020, price: 5,},
      {id: 0x030, price: 5,},
      {id: 0x800, price: 15,},
      {id: 0x500, price: 50,},
      {id: 0x101, price: 150,},
      {id: 0x301, price: 250,},
      {id: 0x403, price: 300,},
      {id: 0x401, price: 400,},
      {id: 0x601, price: 500,},
    ],
    func_before: async function(){},
    func_buy: async function(){},
    func_after: async function(){},
  },
  {
    id: 0x05,
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
    func_before: async function(){},
    func_buy: async function(){},
    func_after: async function(){},
  },
];
let shop_group = [];
let shop_cursor = -1;
let shop_using = undefined; // 利用中のショップ

// 
//==================================================UNIQUE MAP==================================================

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
    "011111000111110",//D
    "000000000000000",//E
    ],
    func: async function(x_offset){
      setItem(0x800,1+x_offset, 1);
      setItem(0xf01,2+x_offset, 1);
      setShop(0x05, 9+x_offset, 1);
      setTrap(0x00, 1+x_offset, 5);
      setTrap(0x02, 2+x_offset, 5);
      //setEnemy(0x006, 11+x_offset, 3);
    }
  },
  {
    id: "return", // 帰還ポータル
    pl_x: 4, pl_y: 7,
    safe_flag: true,
    map: [
    "000000000",
    "001111100",
    "001111100",
    "011111110",
    "011111110",
    "011111110",
    "001111100",
    "001111100",
    "000000000",
    ],
    func: async function(x_offset){
      setShop(0x05, 6+x_offset, 4);
      setStair(4+x_offset, 1);
      setPortal(2+x_offset, 4);
    }
  },
  {
    id: 0,
    pl_x: 5, pl_y: 11,
    safe_flag: true,
    map: [
    "00000000000",
    "00001110000",
    "00001110000",
    "00001110000",
    "00000200000",
    "01101110110",
    "01121112110",
    "01101110110",
    "00001110000",
    "01111111110",
    "01111111110",
    "01111111110",
    "01111111110",
    "01111111110",
    "00000000000",
    ],
    func: async function(x_offset){
      setStair(5+x_offset, 2);
      //setNPC(0x00, 7+x_offset, 9);
      setNPC(0x02, 8+x_offset, 9);
      setNPC(0x03, 4+x_offset, 5);
      //setShop(0x00, 1+x_offset, 7);
      if(player.job == 0xf00) setShop(0x01, 9+x_offset, 6);
      else setNPC(0x01, 9+x_offset, 6);
      setShop(0x02, 1+x_offset, 9);
      setShop(0x03, 1+x_offset, 6);
    }
  },
];
