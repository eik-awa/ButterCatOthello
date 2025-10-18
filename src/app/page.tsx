"use client";

import React, { useState } from "react";
import { Board } from "@/ui/components/Board";
import { Hand } from "@/ui/components/Hand";
import { Game } from "@/domains/othello/aggregates/Game";
import { PlaceMoveUseCase } from "@/application/othello/usecases/PlaceMoveUseCase";
import { GameStateDto } from "@/application/othello/dto/GameStateDto";
import { TEXTS } from "@/constants/texts";
import { STYLES } from "@/constants/styles";

/**
 * オセロゲームのメインページコンポーネント
 */
export default function Home() {
  const [useCase] = useState(() => new PlaceMoveUseCase(new Game()));
  const [gameState, setGameState] = useState<GameStateDto>(
    useCase.getGameState()
  );

  /**
   * 手札の駒を選択したときのハンドラー
   */
  const handleSelectHandDisc = (discId: number) => {
    const newState = useCase.selectHandDisc(discId);
    setGameState(newState);
  };

  /**
   * ボードのセルをクリックしたときのハンドラー
   */
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
    <main className={STYLES.PAGE.MAIN}>
      <h1 className={STYLES.PAGE.TITLE}>{TEXTS.GAME_TITLE}</h1>

      {/* 駒数表示 */}
      <div className={STYLES.PAGE.DISC_COUNT_CONTAINER}>
        <div className={STYLES.PAGE.DISC_COUNT_TITLE}>
          {TEXTS.DISC_COUNT_LABEL}
        </div>
        <div className={STYLES.PAGE.DISC_COUNT_ROW}>
          <div className={STYLES.PAGE.DISC_COUNT_ITEM}>
            <span>{TEXTS.BLACK_DISC_COUNT}</span>
            <span className="font-bold">{gameState.blackDiscCount}</span>
          </div>
          <div className={STYLES.PAGE.DISC_COUNT_ITEM}>
            <span>{TEXTS.WHITE_DISC_COUNT}</span>
            <span className="font-bold">{gameState.whiteDiscCount}</span>
          </div>
        </div>
      </div>

      {/* ターン表示 */}
      {!gameState.isGameOver && (
        <div className={STYLES.PAGE.TURN_DISPLAY}>
          {TEXTS.CURRENT_TURN_LABEL}{" "}
          {gameState.currentTurn === "black" ? TEXTS.BLACK : TEXTS.WHITE}
        </div>
      )}

      {/* ゲーム終了と勝者表示 */}
      {gameState.isGameOver && (
        <>
          <p className={STYLES.PAGE.GAME_OVER}>{TEXTS.GAME_OVER}</p>
          {gameState.winner === "black" && (
            <p className={STYLES.PAGE.WINNER_MESSAGE}>{TEXTS.BLACK_WINS}</p>
          )}
          {gameState.winner === "white" && (
            <p className={STYLES.PAGE.WINNER_MESSAGE}>{TEXTS.WHITE_WINS}</p>
          )}
          {gameState.winner === "draw" && (
            <p className={STYLES.PAGE.WINNER_MESSAGE}>{TEXTS.DRAW}</p>
          )}
        </>
      )}

      {/* 手札表示エリア */}
      <div className={STYLES.PAGE.HANDS_CONTAINER}>
        <div className={STYLES.PAGE.HANDS_ITEM}>
          <Hand
            color="black"
            discs={gameState.blackHand.discs}
            selectedDiscId={gameState.blackHand.selectedDiscId}
            hasSelection={gameState.blackHand.hasSelection}
            isCurrent={gameState.currentTurn === "black"}
            onSelectDisc={handleSelectHandDisc}
          />
        </div>
        <div className={STYLES.PAGE.HANDS_ITEM}>
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

      {/* 特殊駒の説明 */}
      <div className={STYLES.SPECIAL_DISCS.CONTAINER}>
        <h2 className={STYLES.SPECIAL_DISCS.TITLE}>
          {TEXTS.SPECIAL_DISCS_TITLE}
        </h2>
        <div className={STYLES.SPECIAL_DISCS.GRID}>
          <div className={`${STYLES.SPECIAL_DISCS.CARD_BASE} ${STYLES.SPECIAL_DISCS.CARD_BUTTER}`}>
            <div className={STYLES.SPECIAL_DISCS.CARD_HEADER}>
              <span className={STYLES.SPECIAL_DISCS.CARD_EMOJI}>
                {TEXTS.BUTTER_EMOJI}
              </span>
              <h3 className={STYLES.SPECIAL_DISCS.CARD_TITLE}>
                {TEXTS.BUTTER_DISC_TITLE}
              </h3>
            </div>
            <p className={STYLES.SPECIAL_DISCS.CARD_TEXT}>
              {TEXTS.BUTTER_DISC_DESCRIPTION}
            </p>
          </div>

          <div className={`${STYLES.SPECIAL_DISCS.CARD_BASE} ${STYLES.SPECIAL_DISCS.CARD_CAT}`}>
            <div className={STYLES.SPECIAL_DISCS.CARD_HEADER}>
              <span className={STYLES.SPECIAL_DISCS.CARD_EMOJI}>
                {TEXTS.CAT_EMOJI}
              </span>
              <h3 className={STYLES.SPECIAL_DISCS.CARD_TITLE}>
                {TEXTS.CAT_DISC_TITLE}
              </h3>
            </div>
            <p className={STYLES.SPECIAL_DISCS.CARD_TEXT}>
              {TEXTS.CAT_DISC_DESCRIPTION}
            </p>
          </div>

          <div className={`${STYLES.SPECIAL_DISCS.CARD_BASE} ${STYLES.SPECIAL_DISCS.CARD_BUTTERCAT}`}>
            <div className={STYLES.SPECIAL_DISCS.CARD_HEADER}>
              <span className={STYLES.SPECIAL_DISCS.CARD_EMOJI}>
                {TEXTS.BUTTERCAT_EMOJI}
              </span>
              <h3 className={STYLES.SPECIAL_DISCS.CARD_TITLE}>
                {TEXTS.BUTTERCAT_DISC_TITLE}
              </h3>
            </div>
            <p className={STYLES.SPECIAL_DISCS.CARD_TEXT}>
              {TEXTS.BUTTERCAT_DISC_DESCRIPTION}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
