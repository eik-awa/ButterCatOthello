"use client";

import React, { useState, useEffect, useRef } from "react";
import { Board } from "@/ui/components/Board";
import { Hand } from "@/ui/components/Hand";
import { Game } from "@/domains/othello/aggregates/Game";
import { PlaceMoveUseCase } from "@/application/othello/usecases/PlaceMoveUseCase";
import { GameStateDto } from "@/application/othello/dto/GameStateDto";
import { TEXTS } from "@/constants/texts";
import { STYLES } from "@/constants/styles";
import { SettingsMenu } from "@/ui/components/settings/SettingsMenu";
import { useGameSettings } from "@/contexts/GameSettingsContext";
import { EasyCpuStrategy } from "@/domains/othello/services/EasyCpuStrategy";
import { HardCpuStrategy } from "@/domains/othello/services/HardCpuStrategy";
import { CpuStrategy } from "@/domains/othello/services/CpuStrategy";

/**
 * オセロゲームのメインページコンポーネント
 */
export default function Home() {
  const { settings } = useGameSettings();
  const [useCase, setUseCase] = useState(() => new PlaceMoveUseCase(new Game()));
  const [gameState, setGameState] = useState<GameStateDto>(
    useCase.getGameState()
  );
  const [passNotification, setPassNotification] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const cpuStrategyRef = useRef<CpuStrategy | null>(null);

  /**
   * CPU戦略を初期化
   */
  useEffect(() => {
    if (settings.mode === "cpu-easy") {
      cpuStrategyRef.current = new EasyCpuStrategy();
    } else if (settings.mode === "cpu-hard") {
      cpuStrategyRef.current = new HardCpuStrategy();
    } else {
      cpuStrategyRef.current = null;
    }
  }, [settings.mode]);

  /**
   * 新しいゲームを開始
   */
  const handleNewGame = () => {
    const newUseCase = new PlaceMoveUseCase(new Game());
    setUseCase(newUseCase);
    setGameState(newUseCase.getGameState());
    setPassNotification(null);
  };

  /**
   * パス通知を自動的にクリア
   */
  useEffect(() => {
    if (passNotification) {
      const timer = setTimeout(() => {
        setPassNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [passNotification]);

  /**
   * 有効な手がない場合の自動パス処理
   */
  useEffect(() => {
    if (!gameState.isGameOver && !gameState.isLocked && !gameState.hasValidMoves) {
      // 1秒後に自動パス
      const timer = setTimeout(() => {
        const playerName = gameState.currentTurn === "black" ? TEXTS.BLACK : TEXTS.WHITE;
        setPassNotification(`${playerName}${TEXTS.PASS_MESSAGE}`);
        const newState = useCase.pass();
        setGameState(newState);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, useCase]);

  /**
   * CPUの自動プレイ処理
   */
  useEffect(() => {
    // CPUモードでない、またはCPUのターンでない場合は何もしない
    if (settings.mode === "pvp" || !cpuStrategyRef.current) {
      return;
    }

    // CPUの色と現在のターンが一致するかチェック
    if (gameState.currentTurn !== settings.cpuColor) {
      return;
    }

    // ゲームが終了している、ロックされている、または有効な手がない場合は何もしない
    if (gameState.isGameOver || gameState.isLocked || !gameState.hasValidMoves) {
      return;
    }

    // CPUの手を決定して実行
    const timer = setTimeout(() => {
      const game = useCase.getGame();
      const cpuMove = cpuStrategyRef.current!.decideMove(game);

      if (cpuMove) {
        // 駒を選択
        const selectState = useCase.selectHandDisc(cpuMove.discId);
        setGameState(selectState);

        // 少し待ってから配置
        setTimeout(() => {
          const result = useCase.execute({
            x: cpuMove.position.x,
            y: cpuMove.position.y,
          });

          if (result.success) {
            setGameState(result.gameState);

            // フリップアニメーション終了後に状態を更新
            if (result.flippedPositions.length > 0) {
              setTimeout(() => {
                const newState = useCase.endFlipping();
                setGameState(newState);
              }, 1000);
            }
          }
        }, 500);
      }
    }, 1000); // CPUの思考時間として1秒待機

    return () => clearTimeout(timer);
  }, [gameState, settings, useCase]);

  /**
   * 手札の駒を選択したときのハンドラー
   */
  const handleSelectHandDisc = (discId: number) => {
    // CPUのターンの場合は選択を無効化
    if (settings.mode !== "pvp" && gameState.currentTurn === settings.cpuColor) {
      return;
    }
    const newState = useCase.selectHandDisc(discId);
    setGameState(newState);
  };

  /**
   * ボードのセルをクリックしたときのハンドラー
   */
  const handleCellClick = (x: number, y: number) => {
    // CPUのターンの場合はクリックを無効化
    if (settings.mode !== "pvp" && gameState.currentTurn === settings.cpuColor) {
      return;
    }

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
      {/* 設定ボタン */}
      <button
        className={STYLES.SETTINGS.OPEN_BUTTON}
        onClick={() => setIsSettingsOpen(true)}
      >
        {TEXTS.OPEN_SETTINGS_BUTTON}
      </button>

      {/* 設定メニュー */}
      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onNewGame={handleNewGame}
      />

      <h1 className={STYLES.PAGE.TITLE}>{TEXTS.GAME_TITLE}</h1>

      {/* ターン表示 / パス通知（同じ位置に表示） */}
      {!gameState.isGameOver && (
        <div className={STYLES.PAGE.TURN_DISPLAY}>
          {passNotification || (
            <>
              {TEXTS.CURRENT_TURN_LABEL}{" "}
              {gameState.currentTurn === "black" ? TEXTS.BLACK : TEXTS.WHITE}
            </>
          )}
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
            discCount={gameState.blackDiscCount}
            isCpu={settings.mode !== "pvp" && settings.cpuColor === "black"}
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
            discCount={gameState.whiteDiscCount}
            isCpu={settings.mode !== "pvp" && settings.cpuColor === "white"}
          />
        </div>
      </div>

      {/* ボード */}
      <Board board={gameState.board} onCellClick={handleCellClick} />

      {/* もう一度やるボタン（ゲーム終了時のみ表示） */}
      {gameState.isGameOver && (
        <button
          className={STYLES.PAGE.PLAY_AGAIN_BUTTON}
          onClick={handleNewGame}
        >
          {TEXTS.PLAY_AGAIN_BUTTON}
        </button>
      )}

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
