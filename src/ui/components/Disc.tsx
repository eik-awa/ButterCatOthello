import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import DiscStyles from "./Disc.module.css";
import Image from "next/image";

type Props = {
  color: Color;
  discType: DiscType;
  isFlipping: boolean;
};

/**
 * ボード上の駒を3D表示するコンポーネント
 */
export const Disc: React.FC<Props> = ({ color, discType, isFlipping }) => {
  /**
   * 駒の色クラスを決定
   */
  const getDiscColorClass = () => {
    if (discType === "buttercat") {
      return DiscStyles.buttercat;
    }
    // 通常・バター・猫駒はすべて白黒
    return color === "black" ? DiscStyles.black : DiscStyles.white;
  };

  /**
   * 画像のパスを決定
   */
  const getImagePath = () => {
    if (discType === "butter") return "/butter.svg";
    if (discType === "cat") {
      // 白駒の場合は黒猫、黒駒の場合は白猫を表示（視認性のため）
      return color === "white" ? "/cat.svg" : "/whitecat.svg";
    }
    if (discType === "buttercat") return "/buttercat.svg";
    return null;
  };

  const colorClass = getDiscColorClass();
  const buttercatAnimation =
    discType === "buttercat" ? DiscStyles.buttercatRotate : "";
  const imagePath = getImagePath();

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
        {imagePath && (
          <Image
            src={imagePath}
            alt={discType}
            width={32}
            height={32}
            className={DiscStyles.emoji}
            priority
          />
        )}
      </div>
      {/* 側面 */}
      <div className={DiscStyles.side}></div>
      {/* 下面 */}
      <div className={DiscStyles.bottom}>
        {imagePath && (
          <Image
            src={imagePath}
            alt={discType}
            width={32}
            height={32}
            className={DiscStyles.emoji}
            priority
          />
        )}
      </div>
    </div>
  );
};
