"use client";

import React, { useEffect, useState } from "react";
import { Board } from "@/ui/components/Board";
import { GameService } from "@/application/othello/gameService";

const game = new GameService();

export default function Home() {
  const [board, setBoard] = useState<(string | null)[][]>(game.getBoard());
  const [validMoves, setValidMoves] = useState<{ x: number; y: number }[]>([]);
  const [turn, setTurn] = useState(game.getCurrentTurn());
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setValidMoves(game.getValidMoves().map((p) => ({ x: p.x, y: p.y })));
    setBoard(game.getBoard());
    setTurn(game.getCurrentTurn());
    setGameOver(game.isGameOver());
  }, []);

  const handleClick = (x: number, y: number) => {
    if (gameOver) return;

    const success = game.playMove(x, y);
    if (success) {
      setBoard(game.getBoard());
      setValidMoves(game.getValidMoves().map((p) => ({ x: p.x, y: p.y })));
      setTurn(game.getCurrentTurn());
      setGameOver(game.isGameOver());
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-800 text-white">
      <h1 className="text-3xl font-bold mb-4">オセロゲーム</h1>
      <p className="mb-2">現在のターン: {turn === "black" ? "黒" : "白"}</p>
      {gameOver && <p className="mb-2 text-red-400">ゲーム終了！</p>}
      <Board board={board} validMoves={validMoves} onCellClick={handleClick} />
    </main>
  );
}
