import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import DiscStyles from "./Disc.module.css";
import { getAssetPath } from "@/utils/getAssetPath";

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
    if (discType === "butter") return getAssetPath("/butter.svg");
    if (discType === "cat") {
      // 猫駒は黒猫・白猫の画像を使用
      return color === "black" ? getAssetPath("/cat.svg") : getAssetPath("/whitecat.svg");
    }
    if (discType === "buttercat") return getAssetPath("/buttercat.svg");
    return null;
  };

  /**
   * 画像の枠スタイルを決定
   */
  const getImageBorderClass = () => {
    if (discType === "butter") return DiscStyles.blackBorder;
    if (discType === "cat") {
      // 黒駒の場合は黒枠、白駒の場合は白枠
      return color === "black"
        ? DiscStyles.blackBorder
        : DiscStyles.whiteBorder;
    }
    if (discType === "buttercat") return DiscStyles.whiteBorder;
    return "";
  };

  /**
   * 猫駒の反対側の画像パスを取得（フリップアニメーション用）
   */
  const getAlternateImagePath = () => {
    // 猫駒はフリップ時に画像切り替えしない
    return null;
  };

  const colorClass = getDiscColorClass();
  const buttercatAnimation =
    discType === "buttercat" ? DiscStyles.buttercatRotate : "";
  const imagePath = getImagePath();
  const alternateImagePath = getAlternateImagePath();
  const imageBorderClass = getImageBorderClass();

  // 特殊駒の場合は背景を透明にする
  const isSpecialDisc = discType !== "normal";

  return (
    <div
      className={`${DiscStyles.disc} ${!isSpecialDisc ? colorClass : ""} ${
        isFlipping ? DiscStyles.flipping : ""
      } ${buttercatAnimation}`}
      data-flipping-to={
        isFlipping ? (color === "black" ? "black" : "white") : undefined
      }
      data-disc-type={discType}
      data-color={color}
    >
      {/* 特殊駒は3D画像表示 */}
      {isSpecialDisc ? (
        <>
          {/* 前面 */}
          <div className={DiscStyles.imageFront}>
            <img
              src={imagePath!}
              alt={discType}
              width={48}
              height={48}
              className={`${DiscStyles.flatImage} ${imageBorderClass} ${
                discType === "cat" && isFlipping ? DiscStyles.primaryImage : ""
              }`}
            />
            {alternateImagePath && isFlipping && (
              <img
                src={alternateImagePath}
                alt={discType}
                width={48}
                height={48}
                className={`${DiscStyles.flatImage} ${imageBorderClass} ${DiscStyles.alternateImage}`}
              />
            )}
          </div>
          {/* 背面 */}
          <div className={DiscStyles.imageBack}>
            <img
              src={imagePath!}
              alt={discType}
              width={48}
              height={48}
              className={`${DiscStyles.flatImage} ${imageBorderClass}`}
            />
          </div>
        </>
      ) : (
        <>
          {/* 通常駒は3D表示 */}
          {/* 上面 */}
          <div className={DiscStyles.top}></div>
          {/* 側面 */}
          <div className={DiscStyles.side}></div>
          {/* 下面 */}
          <div className={DiscStyles.bottom}></div>
        </>
      )}
    </div>
  );
};
