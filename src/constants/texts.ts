/**
 * アプリケーション内で使用するテキスト定数
 */

export const TEXTS = {
  // ゲームタイトル
  GAME_TITLE: "オセロゲーム",

  // プレイヤー表示
  BLACK_PLAYER: "黒プレイヤー",
  WHITE_PLAYER: "白プレイヤー",
  CURRENT_TURN_SUFFIX: " (現在のターン)",

  // ターン表示
  CURRENT_TURN_LABEL: "現在のターン:",
  BLACK: "黒",
  WHITE: "白",

  // メッセージ
  GAME_OVER: "ゲーム終了！",
  SELECT_DISC_MESSAGE: "手札からディスクを選択してください",

  // 駒数表示
  DISC_COUNT_LABEL: "駒数:",
  BLACK_DISC_COUNT: "黒:",
  WHITE_DISC_COUNT: "白:",

  // 勝利メッセージ
  BLACK_WINS: "黒の勝利！",
  WHITE_WINS: "白の勝利！",
  DRAW: "引き分け！",

  // 特殊駒の説明
  SPECIAL_DISCS_TITLE: "特殊駒の説明",
  BUTTER_DISC_TITLE: "バター駒",
  BUTTER_DISC_DESCRIPTION:
    "配置すると相手の色になります。挟まれても色は変わりません。中央16マスには置けません。",
  CAT_DISC_TITLE: "猫駒",
  CAT_DISC_DESCRIPTION:
    "配置すると自分の色になります。挟まれても色は変わりません。中央16マスには置けません。",
  BUTTERCAT_DISC_TITLE: "バター猫駒",
  BUTTERCAT_DISC_DESCRIPTION:
    "常に回転し続けます。挟むことができませんが、挟まれることもありません。中央16マスには置けません。",

  // 絵文字
  BUTTER_EMOJI: "🧈",
  CAT_EMOJI: "🐈",
  BUTTERCAT_EMOJI: "🧈🐈",
} as const;
