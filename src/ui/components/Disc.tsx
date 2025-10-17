import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import DiscStyles from "./Disc.module.css";

type Props = {
  color: Color;
  discType: DiscType;
  isFlipping: boolean;
};

export const Disc: React.FC<Props> = ({ color, discType, isFlipping }) => {
  // 駒の色クラスを決定
  const getDiscColorClass = () => {
    if (discType === "buttercat") {
      return DiscStyles.buttercat;
    }
    // 通常・バター・猫駒はすべて白黒
    return color === "black" ? DiscStyles.black : DiscStyles.white;
  };

  // 絵文字を決定
  const getEmoji = () => {
    if (discType === "butter") return "🧈";
    if (discType === "cat") return "🐈";
    return null;
  };

  const colorClass = getDiscColorClass();
  const buttercatAnimation = discType === "buttercat" ? DiscStyles.buttercatRotate : "";
  const emoji = getEmoji();

  return (
    <div
      className={`${DiscStyles.disc} ${colorClass} ${
        isFlipping ? DiscStyles.flipping : ""
      } ${buttercatAnimation}`}
      data-flipping-to={isFlipping ? (color === "black" ? "black" : "white") : undefined}
      data-disc-type={discType}
    >
      {/* 上面 */}
      <div className={DiscStyles.top}>
        {emoji && <span className={DiscStyles.emoji}>{emoji}</span>}
      </div>
      {/* 側面 */}
      <div className={DiscStyles.side}></div>
      {/* 下面 */}
      <div className={DiscStyles.bottom}>
        {emoji && <span className={DiscStyles.emoji}>{emoji}</span>}
      </div>
    </div>
  );
};
