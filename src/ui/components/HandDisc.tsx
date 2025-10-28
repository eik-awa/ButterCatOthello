import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import { STYLES } from "@/constants/styles";
import { getAssetPath } from "@/utils/getAssetPath";

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
   * 画像のパスを決定
   */
  const getImagePath = () => {
    if (type === "butter") return getAssetPath("/butter.svg");
    if (type === "cat") {
      // 猫駒は黒猫・白猫の画像を使用
      return color === "black" ? getAssetPath("/cat.svg") : getAssetPath("/whitecat.svg");
    }
    if (type === "buttercat") return getAssetPath("/buttercat.svg");
    return null;
  };

  const discColor = getDiscColor();
  const imagePath = getImagePath();
  const imageClass =
    type === "butter"
      ? (color === "white" ? STYLES.HAND_DISC.EMOJI_BUTTER_WHITE : STYLES.HAND_DISC.EMOJI_BUTTER_BLACK)
      : STYLES.HAND_DISC.EMOJI;

  const isSpecialDisc = type !== "normal";

  return (
    <div
      className={`${STYLES.HAND_DISC.BASE} ${getCursorClass()} ${getBorderClass()} ${getHoverClass()} ${getDisabledClass()}`}
      onClick={!isUsed && !isDisabled ? onClick : undefined}
    >
      {!isUsed && (
        <>
          {/* 通常駒は背景の丸を表示 */}
          {!isSpecialDisc && (
            <div className={`${STYLES.HAND_DISC.DISC_CONTAINER} ${discColor}`} />
          )}
          {/* 特殊駒は画像のみ表示 */}
          {imagePath && (
            <img
              src={imagePath}
              alt={type}
              width={32}
              height={32}
              className={imageClass}
            />
          )}
        </>
      )}
    </div>
  );
};