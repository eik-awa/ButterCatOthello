import { Game } from "../aggregates/Game";
import { Position } from "../valueObjects/Position";

/**
 * CPU戦略のインターフェース
 */
export interface CpuMove {
  discId: number;
  position: Position;
}

/**
 * CPU戦略の基底クラス
 */
export abstract class CpuStrategy {
  /**
   * 次の手を決定する
   * @param game 現在のゲーム状態
   * @returns 選択する駒IDと配置位置
   */
  abstract decideMove(game: Game): CpuMove | null;

  /**
   * 指定されたゲームの全ての有効な手を取得
   */
  protected getAllValidMoves(game: Game): CpuMove[] {
    const moves: CpuMove[] = [];
    const currentTurn = game.getCurrentTurn();
    const hand = game.getHand(currentTurn);
    const discs = hand.getDiscs().filter((d) => !d.isUsed);

    for (const disc of discs) {
      // 駒を一時的に選択
      const clonedGame = game.clone();
      clonedGame.selectHandDisc(disc.id);

      // この駒で置ける位置を取得
      const validPositions = clonedGame.getValidMoves(currentTurn);

      for (const pos of validPositions) {
        moves.push({
          discId: disc.id,
          position: pos,
        });
      }
    }

    return moves;
  }
}
