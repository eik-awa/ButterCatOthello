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
import { getAssetPath } from "@/utils/getAssetPath";

/**
 * オセロゲームのメインページコンポーネント
 */
export default function Home() {
  const { settings } = useGameSettings();
  const [useCase, setUseCase] = useState(
    () => new PlaceMoveUseCase(new Game())
  );
  const [gameState, setGameState] = useState<GameStateDto>(
    useCase.getGameState()
  );
  const [passNotification, setPassNotification] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const cpuStrategyRef = useRef<CpuStrategy | null>(null);

  /**
   * 背景画像を設定
   */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      body::before {
        background-image: url('${getAssetPath("/butter.svg")}');
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    if (
      !gameState.isGameOver &&
      !gameState.isLocked &&
      !gameState.hasValidMoves &&
      !gameState.hasValidMovesWithNormalDiscs // 通常駒で置ける場所がない場合のみパス
    ) {
      // 1秒後に自動パス
      const timer = setTimeout(() => {
        const playerName =
          gameState.currentTurn === "black" ? TEXTS.BLACK : TEXTS.WHITE;
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
    if (
      gameState.isGameOver ||
      gameState.isLocked ||
      !gameState.hasValidMoves
    ) {
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
    if (
      settings.mode !== "pvp" &&
      gameState.currentTurn === settings.cpuColor
    ) {
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
    if (
      settings.mode !== "pvp" &&
      gameState.currentTurn === settings.cpuColor
    ) {
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
        aria-label="設定"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <path
            fillRule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* 設定メニュー */}
      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onNewGame={handleNewGame}
      />

      <h1 className={STYLES.PAGE.TITLE}>
        {TEXTS.GAME_TITLE}
        <img
          src={getAssetPath("/buttercat.svg")}
          alt="buttercat"
          width={48}
          height={48}
          style={{
            display: "inline-block",
            marginLeft: "0.5rem",
            verticalAlign: "middle",
          }}
        />
      </h1>

      {/* パス通知のみ表示 */}
      {!gameState.isGameOver && passNotification && (
        <div className={STYLES.PAGE.TURN_DISPLAY}>{passNotification}</div>
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
          <div
            className={`${STYLES.SPECIAL_DISCS.CARD_BASE} ${STYLES.SPECIAL_DISCS.CARD_BUTTER}`}
          >
            <div className={STYLES.SPECIAL_DISCS.CARD_HEADER}>
              <span className={STYLES.SPECIAL_DISCS.CARD_EMOJI}>
                <img
                  src={getAssetPath("/butter.svg")}
                  alt="butter"
                  width={64}
                  height={64}
                />
              </span>
              <h3 className={STYLES.SPECIAL_DISCS.CARD_TITLE}>
                {TEXTS.BUTTER_DISC_TITLE}
              </h3>
            </div>
            <p className={STYLES.SPECIAL_DISCS.CARD_TEXT}>
              {TEXTS.BUTTER_DISC_DESCRIPTION}
            </p>
          </div>

          <div
            className={`${STYLES.SPECIAL_DISCS.CARD_BASE} ${STYLES.SPECIAL_DISCS.CARD_CAT}`}
          >
            <div className={STYLES.SPECIAL_DISCS.CARD_HEADER}>
              <span className={STYLES.SPECIAL_DISCS.CARD_EMOJI}>
                <img
                  src={getAssetPath("/cat.svg")}
                  alt="cat"
                  width={64}
                  height={64}
                />
              </span>
              <h3 className={STYLES.SPECIAL_DISCS.CARD_TITLE}>
                {TEXTS.CAT_DISC_TITLE}
              </h3>
            </div>
            <p className={STYLES.SPECIAL_DISCS.CARD_TEXT}>
              {TEXTS.CAT_DISC_DESCRIPTION}
            </p>
          </div>

          <div
            className={`${STYLES.SPECIAL_DISCS.CARD_BASE} ${STYLES.SPECIAL_DISCS.CARD_BUTTERCAT}`}
          >
            <div className={STYLES.SPECIAL_DISCS.CARD_HEADER}>
              <span className={STYLES.SPECIAL_DISCS.CARD_EMOJI}>
                <img
                  src={getAssetPath("/buttercat.svg")}
                  alt="buttercat"
                  width={64}
                  height={64}
                />
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
