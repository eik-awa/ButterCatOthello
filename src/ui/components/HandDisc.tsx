import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import { STYLES } from "@/constants/styles";
import Image from "next/image";

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
    if (type === "butter") return "/butter.svg";
    if (type === "cat") {
      // 白駒の場合は黒猫、黒駒の場合は白猫を表示（視認性のため）
      // 手札の背景色を考慮: 黒プレイヤーの猫駒は白背景上に配置される
      const discColor = getDiscColor();
      // 黒背景（黒プレイヤーの猫駒）には白猫、白背景（白プレイヤーの猫駒）には黒猫
      return discColor === STYLES.DISC_COLORS.BLACK ? "/whitecat.svg" : "/cat.svg";
    }
    if (type === "buttercat") return "/buttercat.svg";
    return null;
  };

  const discColor = getDiscColor();
  const imagePath = getImagePath();

  return (
    <div
      className={`${STYLES.HAND_DISC.BASE} ${getCursorClass()} ${getBorderClass()} ${getHoverClass()} ${getDisabledClass()}`}
      onClick={!isUsed && !isDisabled ? onClick : undefined}
    >
      {!isUsed && (
        <div className={`${STYLES.HAND_DISC.DISC_CONTAINER} ${discColor}`}>
          {imagePath && (
            <Image
              src={imagePath}
              alt={type}
              width={32}
              height={32}
              className={STYLES.HAND_DISC.EMOJI}
            />
          )}
        </div>
      )}
    </div>
  );
};