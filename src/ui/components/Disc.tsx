import { Color } from "@/domains/othello/valueObjects/Color";
import DiscStyles from "./Disc.module.css";

type Props = {
  color: Color;
  isFlipping: boolean;
};

export const Disc: React.FC<Props> = ({ color, isFlipping }) => {
  return (
    <div
      className={`${DiscStyles.disc} ${
        color === "black" ? DiscStyles.black : DiscStyles.white
      } ${isFlipping ? DiscStyles.flipping : ""}`}
      data-flipping-to={isFlipping ? (color === "black" ? "black" : "white") : undefined}
    >
      {/* 上面 */}
      <div className={DiscStyles.top}></div>
      {/* 側面 */}
      <div className={DiscStyles.side}></div>
      {/* 下面 */}
      <div className={DiscStyles.bottom}></div>
    </div>
  );
};
