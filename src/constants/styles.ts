/**
 * アプリケーション内で使用するスタイル定数
 */

export const STYLES = {
  // HandDiscコンポーネント
  HAND_DISC: {
    BASE: "w-16 h-16 border-2 flex items-center justify-center transition-all",
    CURSOR_DISABLED: "cursor-not-allowed",
    CURSOR_POINTER: "cursor-pointer",
    BORDER_SELECTED: "border-yellow-400 bg-yellow-100",
    BORDER_DEFAULT: "border-gray-400 bg-gray-100",
    HOVER: "hover:bg-gray-200",
    DISABLED: "opacity-30",
    DISC_CONTAINER: "rounded-full w-10 h-10 relative flex items-center justify-center",
    EMOJI: "text-xl",
  },

  // Handコンポーネント
  HAND: {
    CONTAINER_BASE: "p-4 rounded-lg border-2",
    CONTAINER_ACTIVE: "border-gray-300",
    CONTAINER_INACTIVE: "bg-gray-50 border-gray-300",
    BG_PULSE: "animate-pulse bg-yellow-200",
    TITLE: "mb-2 font-bold text-lg h-7",
    MESSAGE_CONTAINER: "mb-2 h-5",
    MESSAGE_TEXT: "text-sm text-red-600",
    DISCS_CONTAINER: "flex gap-2",
  },

  // Cellコンポーネント
  CELL: {
    BASE: "w-20 h-20 border border-neutral-900 flex items-center justify-center relative",
    BG: "bg-emerald-700",
    HOVER: "cursor-pointer hover:bg-emerald-600",
    VALID_MOVE_DOT: "rounded-full w-4 h-4 bg-yellow-300",
  },

  // Boardコンポーネント
  BOARD: {
    GRID: "grid grid-cols-8 gap-0 border-4 border-neutral-900",
  },

  // ページレイアウト
  PAGE: {
    MAIN: "min-h-screen flex flex-col items-center justify-center bg-orange-200 p-8",
    TITLE: "text-3xl text-neutral-900 font-bold mb-4",
    TURN_DISPLAY: "mb-4 text-xl text-neutral-900",
    GAME_OVER: "mb-4 text-2xl text-red-600 font-bold",
    HANDS_CONTAINER: "flex gap-8 mb-8 w-full max-w-4xl",
    HANDS_ITEM: "flex-1",
    DISC_COUNT_CONTAINER: "mb-4 p-4 bg-white rounded-lg shadow-md",
    DISC_COUNT_TITLE: "text-lg font-bold mb-2 text-neutral-900",
    DISC_COUNT_ROW: "flex gap-6 justify-center text-lg",
    DISC_COUNT_ITEM: "flex items-center gap-2",
    WINNER_MESSAGE: "mb-4 text-3xl font-bold text-green-600",
  },

  // 特殊駒説明セクション
  SPECIAL_DISCS: {
    CONTAINER: "mt-8 p-6 bg-white rounded-lg shadow-lg max-w-4xl",
    TITLE: "text-2xl font-bold mb-4 text-neutral-900",
    GRID: "grid grid-cols-1 md:grid-cols-3 gap-4",
    CARD_BASE: "p-4 rounded-lg",
    CARD_BUTTER: "border-2 border-amber-400",
    CARD_CAT: "border-2 border-blue-400",
    CARD_BUTTERCAT: "border-2 border-gradient-to-br from-amber-400 to-red-900",
    CARD_HEADER: "flex items-center mb-2",
    CARD_EMOJI: "text-3xl mr-2",
    CARD_TITLE: "text-lg font-bold text-neutral-900",
    CARD_TEXT: "text-sm text-neutral-700",
  },

  // ディスクの色
  DISC_COLORS: {
    BLACK: "bg-black",
    WHITE: "bg-white border border-gray-300",
    BUTTERCAT: "bg-gradient-to-br from-amber-400 to-red-900",
  },
} as const;