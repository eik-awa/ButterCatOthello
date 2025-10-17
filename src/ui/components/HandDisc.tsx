import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";

type Props = {
  id: number;
  color: Color;
  type: DiscType;
  isUsed: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export const HandDisc: React.FC<Props> = ({
  color,
  type,
  isUsed,
  isSelected,
  onClick,
}) => {
  const baseClass =
    "w-16 h-16 border-2 flex items-center justify-center cursor-pointer transition-all";
  const borderClass = isSelected
    ? "border-yellow-400 bg-yellow-100"
    : "border-gray-400 bg-gray-100 hover:bg-gray-200";
  const disabledClass = isUsed ? "opacity-30 cursor-not-allowed" : "";

  // 駒の色を決定
  const getDiscColor = () => {
    if (type === "buttercat") {
      return "bg-gradient-to-br from-amber-400 to-red-900";
    }
    if (type === "butter") {
      // バター駒は相手の色で表示
      return color === "black" ? "bg-white border border-gray-300" : "bg-black";
    }
    // 通常・猫駒は自分の色
    return color === "black" ? "bg-black" : "bg-white border border-gray-300";
  };

  // 絵文字を決定
  const getEmoji = () => {
    if (type === "butter") return "🧈";
    if (type === "cat") return "🐈";
    return null;
  };

  const discColor = getDiscColor();
  const emoji = getEmoji();

  return (
    <div
      className={`${baseClass} ${borderClass} ${disabledClass}`}
      onClick={!isUsed ? onClick : undefined}
    >
      {!isUsed && (
        <div className={`rounded-full w-10 h-10 ${discColor} relative flex items-center justify-center`}>
          {emoji && <span className="text-xl">{emoji}</span>}
        </div>
      )}
    </div>
  );
};