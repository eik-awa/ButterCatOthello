import { Color } from "@/domains/othello/valueObjects/Color";

type Props = {
  id: number;
  color: Color;
  isUsed: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export const HandDisc: React.FC<Props> = ({
  color,
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

  return (
    <div
      className={`${baseClass} ${borderClass} ${disabledClass}`}
      onClick={!isUsed ? onClick : undefined}
    >
      {!isUsed && (
        <div
          className={`rounded-full w-10 h-10 ${
            color === "black" ? "bg-black" : "bg-white border border-gray-300"
          }`}
        />
      )}
    </div>
  );
};