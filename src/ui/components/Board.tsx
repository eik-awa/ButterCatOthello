import React from "react";
import { Cell } from "./Cell";
import { CellDto } from "@/application/othello/dto/GameStateDto";
import { STYLES } from "@/constants/styles";

type Props = {
  board: CellDto[][];
  onCellClick: (x: number, y: number) => void;
};

/**
 * オセロボードを表示するコンポーネント
 */
export const Board: React.FC<Props> = ({ board, onCellClick }) => {
  return (
    <div className="mb-4 sm:mb-6 w-full flex justify-center px-2">
      <div className={STYLES.BOARD.GRID}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              x={cell.x}
              y={cell.y}
              color={cell.color}
              discType={cell.discType}
              isValidMove={cell.isValidMove}
              isFlipping={cell.isFlipping}
              onClick={() => onCellClick(cell.x, cell.y)}
            />
          ))
        )}
      </div>
    </div>
  );
};