import GuideDotStyles from "./GuideDot.module.css";
import { Disc } from "./Disc";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import { STYLES } from "@/constants/styles";

type Props = {
  x: number;
  y: number;
  color: "black" | "white" | null;
  discType: DiscType | null;
  isValidMove: boolean;
  isFlipping: boolean;
  onClick: () => void;
};

/**
 * ボードのセルを表示するコンポーネント
 */
export const Cell: React.FC<Props> = ({
  x,
  y,
  color,
  discType,
  isValidMove,
  isFlipping,
  onClick,
}) => {
  /**
   * カーソルスタイルを取得
   */
  const getCursorClass = () => {
    return isValidMove ? STYLES.CELL.HOVER : "";
  };

  /**
   * ガイドドットの位置を取得
   */
  const getGuideDotPosition = () => {
    if (x % 4 === 2 && y % 4 === 2) return GuideDotStyles.topLeft;
    if (x % 4 === 1 && y % 4 === 2) return GuideDotStyles.topRight;
    if (x % 4 === 2 && y % 4 === 1) return GuideDotStyles.bottomLeft;
    if (x % 4 === 1 && y % 4 === 1) return GuideDotStyles.bottomRight;
    return null;
  };

  const guideDotPosition = getGuideDotPosition();

  return (
    <div
      className={`${STYLES.CELL.BASE} ${STYLES.CELL.BG} ${getCursorClass()}`}
      onClick={onClick}
    >
      {color && (
        <Disc
          color={color}
          discType={discType || "normal"}
          isFlipping={isFlipping}
        />
      )}
      {!color && isValidMove && (
        <div className={STYLES.CELL.VALID_MOVE_DOT} />
      )}
      {guideDotPosition && (
        <div className={`${GuideDotStyles.guideDot} ${guideDotPosition}`} />
      )}
    </div>
  );
};
