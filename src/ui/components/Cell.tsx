import GuideDotStyles from "./GuideDot.module.css";
import { Disc } from "./Disc";

type Props = {
  x: number;
  y: number;
  color: "black" | "white" | null;
  isValidMove: boolean;
  isFlipping: boolean;
  onClick: () => void;
};

export const Cell: React.FC<Props> = ({
  x,
  y,
  color,
  isValidMove,
  isFlipping,
  onClick,
}) => {
  const baseClass =
    "w-20 h-20 border border-neutral-900 flex items-center justify-center relative";
  const bgClass = "bg-emerald-700";
  const cursor = isValidMove ? "cursor-pointer hover:bg-emerald-600" : "";

  const guideDotPosition = (() => {
    if (x % 4 === 2 && y % 4 === 2) return GuideDotStyles.topLeft;
    if (x % 4 === 1 && y % 4 === 2) return GuideDotStyles.topRight;
    if (x % 4 === 2 && y % 4 === 1) return GuideDotStyles.bottomLeft;
    if (x % 4 === 1 && y % 4 === 1) return GuideDotStyles.bottomRight;
    return null;
  })();

  return (
    <div className={`${baseClass} ${bgClass} ${cursor}`} onClick={onClick}>
      {color && <Disc color={color} isFlipping={isFlipping} />}
      {!color && isValidMove && (
        <div className="rounded-full w-4 h-4 bg-yellow-300" />
      )}
      {guideDotPosition && (
        <div className={`${GuideDotStyles.guideDot} ${guideDotPosition}`} />
      )}
    </div>
  );
};
