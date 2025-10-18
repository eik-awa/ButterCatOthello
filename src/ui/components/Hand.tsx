import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import { HandDisc } from "./HandDisc";
import { TEXTS } from "@/constants/texts";
import { STYLES } from "@/constants/styles";

type HandDiscData = {
  id: number;
  color: Color;
  type: DiscType;
  isUsed: boolean;
};

type Props = {
  color: Color;
  discs: HandDiscData[];
  selectedDiscId: number | null;
  hasSelection: boolean;
  isCurrent: boolean;
  onSelectDisc: (id: number) => void;
};

/**
 * プレイヤーの手札を表示するコンポーネント
 */
export const Hand: React.FC<Props> = ({
  color,
  discs,
  selectedDiscId,
  hasSelection,
  isCurrent,
  onSelectDisc,
}) => {
  /**
   * コンテナのスタイルを取得
   */
  const getContainerClass = () => {
    const baseClass = STYLES.HAND.CONTAINER_BASE;
    const stateClass =
      isCurrent && !hasSelection
        ? STYLES.HAND.CONTAINER_ACTIVE
        : STYLES.HAND.CONTAINER_INACTIVE;
    return `${baseClass} ${stateClass}`;
  };

  /**
   * 背景のスタイルを取得
   */
  const getBgClass = () => {
    return isCurrent && !hasSelection ? STYLES.HAND.BG_PULSE : "";
  };

  /**
   * プレイヤー名を取得
   */
  const getPlayerName = () => {
    return color === "black" ? TEXTS.BLACK_PLAYER : TEXTS.WHITE_PLAYER;
  };

  return (
    <div className={`${getContainerClass()} ${getBgClass()}`}>
      <div className={STYLES.HAND.TITLE}>
        {getPlayerName()}
        {isCurrent && TEXTS.CURRENT_TURN_SUFFIX}
      </div>
      {/* 固定高さのメッセージエリア */}
      <div className={STYLES.HAND.MESSAGE_CONTAINER}>
        {isCurrent && !hasSelection && (
          <div className={STYLES.HAND.MESSAGE_TEXT}>
            {TEXTS.SELECT_DISC_MESSAGE}
          </div>
        )}
      </div>
      <div className={STYLES.HAND.DISCS_CONTAINER}>
        {discs.map((disc) => (
          <HandDisc
            key={disc.id}
            id={disc.id}
            color={disc.color}
            type={disc.type}
            isUsed={disc.isUsed}
            isSelected={selectedDiscId === disc.id}
            isDisabled={!isCurrent}
            onClick={() => onSelectDisc(disc.id)}
          />
        ))}
      </div>
    </div>
  );
};