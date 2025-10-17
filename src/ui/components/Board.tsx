import React from "react";
import { Cell } from "./Cell";
import { CellDto } from "@/application/othello/dto/GameStateDto";

type Props = {
  board: CellDto[][];
  onCellClick: (x: number, y: number) => void;
};

export const Board: React.FC<Props> = ({ board, onCellClick }) => {
  return (
    <div className="grid grid-cols-8 gap-0 border-4 border-neutral-900">
      {board.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            x={cell.x}
            y={cell.y}
            color={cell.color}
            isValidMove={cell.isValidMove}
            isFlipping={cell.isFlipping}
            onClick={() => onCellClick(cell.x, cell.y)}
          />
        ))
      )}
    </div>
  );
};