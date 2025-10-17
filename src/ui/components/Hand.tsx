import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";
import { HandDisc } from "./HandDisc";

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

export const Hand: React.FC<Props> = ({
  color,
  discs,
  selectedDiscId,
  hasSelection,
  isCurrent,
  onSelectDisc,
}) => {
  const containerClass = `p-4 rounded-lg border-2 ${
    isCurrent && !hasSelection
      ? "border-gray-300"
      : "bg-gray-50 border-gray-300"
  }`;

  const bgClass = isCurrent && !hasSelection ? "animate-pulse bg-yellow-200" : "";

  return (
    <div className={`${containerClass} ${bgClass}`}>
      <div className="mb-2 font-bold text-lg h-7">
        {color === "black" ? "黒プレイヤー" : "白プレイヤー"}
        {isCurrent && " (現在のターン)"}
      </div>
      {/* 固定高さのメッセージエリア */}
      <div className="mb-2 h-5">
        {isCurrent && !hasSelection && (
          <div className="text-sm text-red-600">手札からディスクを選択してください</div>
        )}
      </div>
      <div className="flex gap-2">
        {discs.map((disc) => (
          <HandDisc
            key={disc.id}
            id={disc.id}
            color={disc.color}
            type={disc.type}
            isUsed={disc.isUsed}
            isSelected={selectedDiscId === disc.id}
            onClick={() => onSelectDisc(disc.id)}
          />
        ))}
      </div>
    </div>
  );
};