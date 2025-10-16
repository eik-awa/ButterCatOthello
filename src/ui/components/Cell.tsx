import React from "react";

type Props = {
  x: number;
  y: number;
  color: "black" | "white" | null;
  isValidMove: boolean;
  onClick: () => void;
};

export const Cell: React.FC<Props> = ({
  x,
  y,
  color,
  isValidMove,
  onClick,
}) => {
  const baseClass =
    "w-20 h-20 border border-gray-600 flex items-center justify-center";
  const bgClass = (x + y) % 2 === 0 ? "bg-green-600" : "bg-green-700";
  const cursor = isValidMove ? "cursor-pointer hover:bg-green-500" : "";

  return (
    <div className={`${baseClass} ${bgClass} ${cursor}`} onClick={onClick}>
      {color && (
        <div
          className={`rounded-full w-12 h-12 ${
            color === "black" ? "bg-black" : "bg-white"
          }`}
        />
      )}
      {!color && isValidMove && (
        <div className="rounded-full w-4 h-4 bg-yellow-300" />
      )}
    </div>
  );
};
