import { Game } from "../aggregates/Game";
import { CpuStrategy, CpuMove } from "./CpuStrategy";
import { Position } from "../valueObjects/Position";
import { oppositeColor, Color } from "../valueObjects/Color";

/**
 * Hard難易度のCPU戦略
 * ミニマックス法（深さ5）で最適な手を選択
 * - 猫駒を積極的に使用
 * - バター駒は慎重に評価（相手に有利にならない場合のみ使用）
 * - 位置評価、機動性、確定石などを総合的に判断
 */
export class HardCpuStrategy extends CpuStrategy {
  private readonly MAX_DEPTH = 5; // 探索深さを5に増加
  private cpuColor: Color | null = null;

  decideMove(game: Game): CpuMove | null {
    this.cpuColor = game.getCurrentTurn();
    const allMoves = this.getAllValidMoves(game);

    if (allMoves.length === 0) {
      return null;
    }

    let bestMove: CpuMove | null = null;
    let bestScore = -Infinity;

    // 各手を詳細に評価
    for (const move of allMoves) {
      const clonedGame = game.clone();

      // 駒を選択して配置
      clonedGame.selectHandDisc(move.discId);
      const flippedPositions = clonedGame.placeDisk(move.position, clonedGame.getCurrentTurn());

      if (!flippedPositions) continue;

      // ミニマックス評価
      const score = this.minimax(
        clonedGame,
        this.MAX_DEPTH - 1,
        -Infinity,
        Infinity,
        false
      );

      // 駒タイプと配置位置による総合評価
      const disc = game.getHand(game.getCurrentTurn()).getDiscs().find(d => d.id === move.discId);
      let adjustedScore = score;

      if (disc) {
        // バター駒の評価を改善
        if (disc.type === "butter") {
          // バター駒は相手の色になるため、慎重に評価
          // 相手にとって悪い位置（角の隣など）に置く場合のみボーナス
          const positionValue = this.getPositionValue(move.position.x, move.position.y);

          if (positionValue < -10) {
            // 相手にとって悪い位置（角の隣など）ならボーナス
            adjustedScore += 30;
          } else if (positionValue > 50) {
            // 相手にとって良い位置（角など）なら大きなペナルティ
            adjustedScore -= 100;
          } else {
            // 通常の位置では少しペナルティ
            adjustedScore -= 15;
          }
        } else if (disc.type === "cat") {
          // 猫駒は裏返されないため、重要な位置に置くことで有利
          const positionValue = this.getPositionValue(move.position.x, move.position.y);

          if (positionValue > 50) {
            // 良い位置（角など）なら大きなボーナス
            adjustedScore += 40;
          } else if (positionValue > 0) {
            // まあまあの位置でもボーナス
            adjustedScore += 20;
          } else {
            // 悪い位置でも通常駒よりはマシ
            adjustedScore += 10;
          }
        } else if (disc.type === "buttercat") {
          // バター猫駒は挟めないが挟まれもしない
          // 戦略的な位置に置く
          adjustedScore += 15;
        }

        // 序盤は特殊駒を温存、中盤以降に使う
        const totalDiscs = game.getDiscCount("black") + game.getDiscCount("white");
        if (totalDiscs < 20 && disc.type !== "normal") {
          adjustedScore -= 10; // 序盤は特殊駒を使いにくくする
        }
      }

      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestMove = move;
      }
    }

    return bestMove;
  }

  /**
   * ミニマックス法による評価
   */
  private minimax(
    game: Game,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    // 終了条件
    if (depth === 0 || game.isGameOver()) {
      return this.evaluatePosition(game);
    }

    const currentTurn = game.getCurrentTurn();
    const allMoves = this.getAllValidMoves(game);

    // 有効な手がない場合はパス
    if (allMoves.length === 0) {
      const clonedGame = game.clone();
      clonedGame.pass();
      return this.minimax(clonedGame, depth - 1, alpha, beta, !isMaximizing);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of allMoves) {
        const clonedGame = game.clone();
        clonedGame.selectHandDisc(move.discId);
        clonedGame.placeDisk(move.position, currentTurn);

        const evaluation = this.minimax(
          clonedGame,
          depth - 1,
          alpha,
          beta,
          false
        );
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);

        if (beta <= alpha) {
          break; // ベータカット
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of allMoves) {
        const clonedGame = game.clone();
        clonedGame.selectHandDisc(move.discId);
        clonedGame.placeDisk(move.position, currentTurn);

        const evaluation = this.minimax(
          clonedGame,
          depth - 1,
          alpha,
          beta,
          true
        );
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);

        if (beta <= alpha) {
          break; // アルファカット
        }
      }
      return minEval;
    }
  }

  /**
   * 盤面を評価する（改善版）
   */
  private evaluatePosition(game: Game): number {
    if (!this.cpuColor) return 0;

    const cpuColor = this.cpuColor;
    const opponentColor = oppositeColor(cpuColor);

    // ゲーム終了時の評価
    if (game.isGameOver()) {
      const winner = game.getWinner();
      if (winner === cpuColor) return 100000;
      if (winner === opponentColor) return -100000;
      return 0;
    }

    let score = 0;

    const cpuDiscs = game.getDiscCount(cpuColor);
    const opponentDiscs = game.getDiscCount(opponentColor);
    const totalDiscs = cpuDiscs + opponentDiscs;

    // 1. 位置の重み（最重要）
    const cpuPosScore = this.evaluatePositionWeights(game, cpuColor);
    const opponentPosScore = this.evaluatePositionWeights(game, opponentColor);
    score += (cpuPosScore - opponentPosScore) * 2;

    // 2. 機動性（有効な手の数）
    const cpuMobility = game.getValidMoves(cpuColor).length;
    const opponentMobility = game.getValidMoves(opponentColor).length;
    score += (cpuMobility - opponentMobility) * 10;

    // 3. 確定石（角とその周辺の取れない石）
    const cpuStableDiscs = this.countStableDiscs(game, cpuColor);
    const opponentStableDiscs = this.countStableDiscs(game, opponentColor);
    score += (cpuStableDiscs - opponentStableDiscs) * 25;

    // 4. 駒数の差（序盤は逆に少ない方が良い場合がある）
    if (totalDiscs < 40) {
      // 序盤〜中盤: 駒数は少し不利でも良い位置を取る方が重要
      score += (cpuDiscs - opponentDiscs) * 2;
    } else {
      // 終盤: 駒数が重要
      score += (cpuDiscs - opponentDiscs) * 15;
    }

    // 5. 角の周辺（C打ち、X打ち）を避ける
    const cpuDangerousPos = this.countDangerousPositions(game, cpuColor);
    const opponentDangerousPos = this.countDangerousPositions(game, opponentColor);
    score -= cpuDangerousPos * 30;
    score += opponentDangerousPos * 30;

    // 6. 辺の確保
    const cpuEdges = this.countEdgeControl(game, cpuColor);
    const opponentEdges = this.countEdgeControl(game, opponentColor);
    score += (cpuEdges - opponentEdges) * 5;

    return score;
  }

  /**
   * 位置の価値を取得
   */
  private getPositionValue(x: number, y: number): number {
    const weights = [
      [100, -20, 10, 5, 5, 10, -20, 100],
      [-20, -50, -2, -2, -2, -2, -50, -20],
      [10, -2, 5, 1, 1, 5, -2, 10],
      [5, -2, 1, 0, 0, 1, -2, 5],
      [5, -2, 1, 0, 0, 1, -2, 5],
      [10, -2, 5, 1, 1, 5, -2, 10],
      [-20, -50, -2, -2, -2, -2, -50, -20],
      [100, -20, 10, 5, 5, 10, -20, 100],
    ];
    return weights[y][x];
  }

  /**
   * 位置の重みによる評価
   */
  private evaluatePositionWeights(game: Game, color: string): number {
    const weights = [
      [100, -20, 10, 5, 5, 10, -20, 100],
      [-20, -50, -2, -2, -2, -2, -50, -20],
      [10, -2, 5, 1, 1, 5, -2, 10],
      [5, -2, 1, 0, 0, 1, -2, 5],
      [5, -2, 1, 0, 0, 1, -2, 5],
      [10, -2, 5, 1, 1, 5, -2, 10],
      [-20, -50, -2, -2, -2, -2, -50, -20],
      [100, -20, 10, 5, 5, 10, -20, 100],
    ];

    let score = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const pos = new Position(x, y);
        const disk = game.getBoard().getDisk(pos);
        if (disk && disk.color === color) {
          score += weights[y][x];
        }
      }
    }

    return score;
  }

  /**
   * 確定石の数をカウント
   */
  private countStableDiscs(game: Game, color: string): number {
    let count = 0;
    const corners = [
      { x: 0, y: 0 },
      { x: 7, y: 0 },
      { x: 0, y: 7 },
      { x: 7, y: 7 },
    ];

    // 角を持っている場合、その周辺も確定石になる
    for (const corner of corners) {
      const pos = new Position(corner.x, corner.y);
      const disk = game.getBoard().getDisk(pos);
      if (disk && disk.color === color) {
        count++;
        // 角から伸びる確定石をカウント
        count += this.countStableFromCorner(game, color, corner.x, corner.y);
      }
    }

    return count;
  }

  /**
   * 角から伸びる確定石をカウント
   */
  private countStableFromCorner(game: Game, color: string, cornerX: number, cornerY: number): number {
    let count = 0;
    const directions = [
      { dx: cornerX === 0 ? 1 : -1, dy: 0 }, // 横方向
      { dx: 0, dy: cornerY === 0 ? 1 : -1 }, // 縦方向
    ];

    for (const dir of directions) {
      let x = cornerX + dir.dx;
      let y = cornerY + dir.dy;

      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const pos = new Position(x, y);
        const disk = game.getBoard().getDisk(pos);
        if (disk && disk.color === color) {
          count++;
        } else {
          break;
        }
        x += dir.dx;
        y += dir.dy;
      }
    }

    return count;
  }

  /**
   * 危険な位置（角の隣）の数をカウント
   */
  private countDangerousPositions(game: Game, color: string): number {
    let count = 0;
    const dangerousPositions = [
      { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, // 左上の角の周辺
      { x: 6, y: 0 }, { x: 7, y: 1 }, { x: 6, y: 1 }, // 右上の角の周辺
      { x: 0, y: 6 }, { x: 1, y: 7 }, { x: 1, y: 6 }, // 左下の角の周辺
      { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 7 }, // 右下の角の周辺
    ];

    for (const dangerousPos of dangerousPositions) {
      const pos = new Position(dangerousPos.x, dangerousPos.y);
      const disk = game.getBoard().getDisk(pos);
      if (disk && disk.color === color) {
        // 対応する角が空いている場合のみペナルティ
        const corner = this.getCornerForDangerousPosition(dangerousPos.x, dangerousPos.y);
        const cornerDisk = game.getBoard().getDisk(new Position(corner.x, corner.y));
        if (!cornerDisk) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * 危険な位置に対応する角を取得
   */
  private getCornerForDangerousPosition(x: number, y: number): { x: number; y: number } {
    if (x <= 1 && y <= 1) return { x: 0, y: 0 };
    if (x >= 6 && y <= 1) return { x: 7, y: 0 };
    if (x <= 1 && y >= 6) return { x: 0, y: 7 };
    return { x: 7, y: 7 };
  }

  /**
   * 辺の支配度をカウント
   */
  private countEdgeControl(game: Game, color: string): number {
    let count = 0;

    // 上下の辺
    for (let x = 0; x < 8; x++) {
      const topDisk = game.getBoard().getDisk(new Position(x, 0));
      const bottomDisk = game.getBoard().getDisk(new Position(x, 7));
      if (topDisk && topDisk.color === color) count++;
      if (bottomDisk && bottomDisk.color === color) count++;
    }

    // 左右の辺
    for (let y = 1; y < 7; y++) {
      const leftDisk = game.getBoard().getDisk(new Position(0, y));
      const rightDisk = game.getBoard().getDisk(new Position(7, y));
      if (leftDisk && leftDisk.color === color) count++;
      if (rightDisk && rightDisk.color === color) count++;
    }

    return count;
  }
}
