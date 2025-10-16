import React from "react";
import { Cell } from "./Cell";

type Props = {
  board: (string | null)[][];
  validMoves: { x: number; y: number }[];
  onCellClick: (x: number, y: number) => void;
};

export const Board: React.FC<Props> = ({ board, validMoves, onCellClick }) => {
  const isValidMove = (x: number, y: number) =>
    validMoves.some((pos) => pos.x === x && pos.y === y);

  return (
    <div className="grid grid-cols-8 gap-0 w-[640px] h-[640px]">
      {board.map((row, y) =>
        row.map((color, x) => (
          <Cell
            key={`${x}-${y}`}
            x={x}
            y={y}
            color={color as "black" | "white" | null}
            isValidMove={isValidMove(x, y)}
            onClick={() => onCellClick(x, y)}
          />
        ))
      )}
    </div>
  );
};
