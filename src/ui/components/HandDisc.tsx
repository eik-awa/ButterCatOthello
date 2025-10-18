import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import { TEXTS } from "@/constants/texts";
import { STYLES } from "@/constants/styles";

type Props = {
  id: number;
  color: Color;
  type: DiscType;
  isUsed: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

/**
 * 手札の駒を表示するコンポーネント
 */
export const HandDisc: React.FC<Props> = ({
  color,
  type,
  isUsed,
  isSelected,
  isDisabled,
  onClick,
}) => {
  /**
   * カーソルのスタイルを取得
   */
  const getCursorClass = () => {
    return isUsed || isDisabled
      ? STYLES.HAND_DISC.CURSOR_DISABLED
      : STYLES.HAND_DISC.CURSOR_POINTER;
  };

  /**
   * ボーダーのスタイルを取得
   */
  const getBorderClass = () => {
    return isSelected
      ? STYLES.HAND_DISC.BORDER_SELECTED
      : STYLES.HAND_DISC.BORDER_DEFAULT;
  };

  /**
   * ホバーのスタイルを取得
   */
  const getHoverClass = () => {
    return !isUsed && !isDisabled ? STYLES.HAND_DISC.HOVER : "";
  };

  /**
   * 無効状態のスタイルを取得
   */
  const getDisabledClass = () => {
    return isUsed || isDisabled ? STYLES.HAND_DISC.DISABLED : "";
  };

  /**
   * 駒の色を決定
   */
  const getDiscColor = () => {
    if (type === "buttercat") {
      return STYLES.DISC_COLORS.BUTTERCAT;
    }
    if (type === "butter") {
      // バター駒は相手の色で表示
      return color === "black"
        ? STYLES.DISC_COLORS.WHITE
        : STYLES.DISC_COLORS.BLACK;
    }
    // 通常・猫駒は自分の色
    return color === "black"
      ? STYLES.DISC_COLORS.BLACK
      : STYLES.DISC_COLORS.WHITE;
  };

  /**
   * 絵文字を決定
   */
  const getEmoji = () => {
    if (type === "butter") return TEXTS.BUTTER_EMOJI;
    if (type === "cat") return TEXTS.CAT_EMOJI;
    return null;
  };

  const discColor = getDiscColor();
  const emoji = getEmoji();

  return (
    <div
      className={`${STYLES.HAND_DISC.BASE} ${getCursorClass()} ${getBorderClass()} ${getHoverClass()} ${getDisabledClass()}`}
      onClick={!isUsed && !isDisabled ? onClick : undefined}
    >
      {!isUsed && (
        <div className={`${STYLES.HAND_DISC.DISC_CONTAINER} ${discColor}`}>
          {emoji && <span className={STYLES.HAND_DISC.EMOJI}>{emoji}</span>}
        </div>
      )}
    </div>
  );
};