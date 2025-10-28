/**
 * アプリケーション内で使用するテキスト定数
 */

export const TEXTS = {
  // ゲームタイトル
  GAME_TITLE: "ButterCatOthello",

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
  SELECT_DISC_MESSAGE: "手札から駒を選択してください",
  CPU_THINKING_MESSAGE: "思考中です...",
  NO_VALID_MOVES: "置ける場所がありません",
  PASS_MESSAGE: "がパスしました",
  PLAY_AGAIN_BUTTON: "もう一度やる",

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

  // 設定メニュー
  SETTINGS_TITLE: "ゲーム設定",
  GAME_MODE_LABEL: "ゲームモード:",
  MODE_PVP: "対戦モード",
  MODE_CPU_EASY: "CPU (Easy)",
  MODE_CPU_HARD: "CPU (Hard)",
  CPU_COLOR_LABEL: "CPUの色:",
  NEW_GAME_BUTTON: "新しいゲームを開始",
  CLOSE_SETTINGS_BUTTON: "閉じる",
  OPEN_SETTINGS_BUTTON: "設定",
} as const;
