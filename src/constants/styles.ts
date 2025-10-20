/**
 * アプリケーション内で使用するスタイル定数
 */

export const STYLES = {
  // HandDiscコンポーネント
  HAND_DISC: {
    BASE: "w-12 h-12 sm:w-16 sm:h-16 border-2 flex items-center justify-center transition-all",
    CURSOR_DISABLED: "cursor-not-allowed",
    CURSOR_POINTER: "cursor-pointer",
    BORDER_SELECTED: "border-yellow-400 bg-yellow-100",
    BORDER_DEFAULT: "border-gray-400 bg-gray-100",
    HOVER: "hover:bg-gray-200",
    DISABLED: "opacity-30",
    DISC_CONTAINER:
      "rounded-full w-8 h-8 sm:w-10 sm:h-10 relative flex items-center justify-center",
    EMOJI: "text-base sm:text-xl",
  },

  // Handコンポーネント
  HAND: {
    CONTAINER_BASE: "p-3 sm:p-4 rounded-lg border-2",
    CONTAINER_ACTIVE: "border-gray-300",
    CONTAINER_INACTIVE: "bg-gray-50 border-gray-300",
    BG_PULSE: "animate-pulse bg-yellow-200",
    TITLE: "mb-2 font-bold text-base sm:text-lg h-6 sm:h-7",
    MESSAGE_CONTAINER: "mb-2 h-4 sm:h-5",
    MESSAGE_TEXT: "text-xs sm:text-sm text-red-600",
    DISCS_CONTAINER: "flex gap-1 sm:gap-2 flex-wrap justify-center",
    DISC_COUNT:
      "text-sm sm:text-base font-semibold mt-2 pt-2 border-t border-gray-300",
  },

  // Cellコンポーネント
  CELL: {
    BASE: "w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 border border-neutral-900 flex items-center justify-center relative",
    BG: "bg-emerald-700",
    HOVER: "cursor-pointer hover:bg-emerald-600",
    VALID_MOVE_DOT:
      "rounded-full w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-yellow-300",
  },

  // Boardコンポーネント
  BOARD: {
    GRID: "grid grid-cols-8 gap-0 border-2 sm:border-4 border-neutral-900 max-w-[320px] sm:max-w-none mx-auto",
  },

  // ページレイアウト
  PAGE: {
    MAIN: "min-h-screen flex flex-col items-center justify-center bg-orange-200 p-4 sm:p-4 md:p-8 overflow-x-hidden",
    TITLE:
      "text-xl sm:text-2xl md:text-3xl text-neutral-900 font-bold mb-2 sm:mb-4 flex items-center justify-center",
    TURN_DISPLAY:
      "mb-2 sm:mb-4 text-base sm:text-lg md:text-xl text-neutral-900 font-semibold",
    GAME_OVER:
      "mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl text-red-600 font-bold",
    HANDS_CONTAINER:
      "flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-8 mb-4 sm:mb-8 w-full max-w-[min(100vw-2rem,64rem)] px-2",
    HANDS_ITEM: "flex-1",
    WINNER_MESSAGE:
      "mb-2 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold text-green-600",
    PLAY_AGAIN_BUTTON:
      "mt-4 sm:mt-6 md:mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg transition-colors text-base sm:text-lg md:text-xl",
  },

  // 特殊駒説明セクション
  SPECIAL_DISCS: {
    CONTAINER:
      "mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-lg max-w-4xl w-full",
    TITLE:
      "text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-neutral-900",
    GRID: "grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4",
    CARD_BASE: "p-2 sm:p-3 md:p-4 rounded-lg",
    CARD_BUTTER: "border-2 border-amber-400",
    CARD_CAT: "border-2 border-blue-400",
    CARD_BUTTERCAT: "border-2 border-gradient-to-br from-amber-400 to-red-900",
    CARD_HEADER: "flex items-center mb-1 sm:mb-2",
    CARD_EMOJI: "text-xl sm:text-2xl md:text-3xl mr-1 sm:mr-2",
    CARD_TITLE: "text-sm sm:text-base md:text-lg font-bold text-neutral-900",
    CARD_TEXT: "text-xs sm:text-sm text-neutral-700",
  },

  // ディスクの色
  DISC_COLORS: {
    BLACK: "bg-black",
    WHITE: "bg-white border border-gray-300",
    BUTTERCAT: "bg-gradient-to-br from-amber-400 to-red-900",
  },

  // 設定メニュー
  SETTINGS: {
    OVERLAY:
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
    MODAL:
      "bg-yellow-50 rounded-lg shadow-xl p-4 sm:p-6 md:p-8 max-w-md w-full border-4 border-amber-800",
    TITLE: "text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-900",
    SECTION: "mb-4 sm:mb-6",
    LABEL: "block text-sm sm:text-base font-semibold mb-2 text-amber-900",
    SELECT:
      "w-full p-2 border-2 border-amber-600 rounded-lg text-sm sm:text-base bg-white hover:border-amber-700 focus:border-amber-800 focus:ring-2 focus:ring-amber-300 outline-none transition-colors",
    BUTTON_PRIMARY:
      "w-full px-4 py-2 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base shadow-md",
    BUTTON_SECONDARY:
      "w-full px-4 py-2 sm:py-3 bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold rounded-lg transition-colors mt-2 text-sm sm:text-base",
    OPEN_BUTTON:
      "fixed top-2 sm:top-4 right-2 sm:right-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg transition-colors text-sm sm:text-base z-10",
  },
} as const;
