import { Game } from "../aggregates/Game";
import { CpuStrategy, CpuMove } from "./CpuStrategy";

/**
 * Easy難易度のCPU戦略
 * 最初の未使用駒を選択し、ランダムに配置する
 */
export class EasyCpuStrategy extends CpuStrategy {
  decideMove(game: Game): CpuMove | null {
    const currentTurn = game.getCurrentTurn();
    const hand = game.getHand(currentTurn);
    const availableDiscs = hand.getDiscs().filter((d) => !d.isUsed);

    if (availableDiscs.length === 0) {
      return null;
    }

    // 最初の駒を選択
    const firstDisc = availableDiscs[0];
    const clonedGame = game.clone();
    clonedGame.selectHandDisc(firstDisc.id);

    // 有効な位置を取得
    const validMoves = clonedGame.getValidMoves(currentTurn);

    if (validMoves.length === 0) {
      return null;
    }

    // ランダムに位置を選択
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    const position = validMoves[randomIndex];

    return {
      discId: firstDisc.id,
      position,
    };
  }
}
