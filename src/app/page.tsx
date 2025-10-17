"use client";

import React, { useState } from "react";
import { Board } from "@/ui/components/Board";
import { Hand } from "@/ui/components/Hand";
import { Game } from "@/domains/othello/aggregates/Game";
import { PlaceMoveUseCase } from "@/application/othello/usecases/PlaceMoveUseCase";
import { GameStateDto } from "@/application/othello/dto/GameStateDto";

export default function Home() {
  const [useCase] = useState(() => new PlaceMoveUseCase(new Game()));
  const [gameState, setGameState] = useState<GameStateDto>(
    useCase.getGameState()
  );

  const handleSelectHandDisc = (discId: number) => {
    const newState = useCase.selectHandDisc(discId);
    setGameState(newState);
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameState.isGameOver || gameState.isLocked) return;

    const result = useCase.execute({ x, y });
    if (result.success) {
      setGameState(result.gameState);

      // フリップアニメーション終了後に状態を更新
      if (result.flippedPositions.length > 0) {
        setTimeout(() => {
          const newState = useCase.endFlipping();
          setGameState(newState);
        }, 1000); // 1秒後（アニメーションの長さと同じ）
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-orange-200 p-8">
      <h1 className="text-3xl text-neutral-900 font-bold mb-4">
        オセロゲーム
      </h1>

      <div className="mb-4 text-xl text-neutral-900">
        現在のターン: {gameState.currentTurn === "black" ? "黒" : "白"}
      </div>

      {gameState.isGameOver && (
        <p className="mb-4 text-2xl text-red-600 font-bold">ゲーム終了！</p>
      )}

      {/* 手札表示エリア */}
      <div className="flex gap-8 mb-8 w-full max-w-4xl">
        <div className="flex-1">
          <Hand
            color="black"
            discs={gameState.blackHand.discs}
            selectedDiscId={gameState.blackHand.selectedDiscId}
            hasSelection={gameState.blackHand.hasSelection}
            isCurrent={gameState.currentTurn === "black"}
            onSelectDisc={handleSelectHandDisc}
          />
        </div>
        <div className="flex-1">
          <Hand
            color="white"
            discs={gameState.whiteHand.discs}
            selectedDiscId={gameState.whiteHand.selectedDiscId}
            hasSelection={gameState.whiteHand.hasSelection}
            isCurrent={gameState.currentTurn === "white"}
            onSelectDisc={handleSelectHandDisc}
          />
        </div>
      </div>

      {/* ボード */}
      <Board board={gameState.board} onCellClick={handleCellClick} />
    </main>
  );
}
