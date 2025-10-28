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

    // 角の位置かどうかを判定
    const isCorner = (x: number, y: number): boolean => {
      return (
        (x === 0 && y === 0) ||
        (x === 7 && y === 0) ||
        (x === 0 && y === 7) ||
        (x === 7 && y === 7)
      );
    };

    // 猫駒以外を優先して選択、なければ猫駒も使う
    let selectedDisc = availableDiscs.find((d) => d.type !== "cat");
    if (!selectedDisc) {
      selectedDisc = availableDiscs[0];
    }

    const clonedGame = game.clone();
    clonedGame.selectHandDisc(selectedDisc.id);

    // 有効な位置を取得
    const validMoves = clonedGame.getValidMoves(currentTurn);

    if (validMoves.length === 0) {
      return null;
    }

    // 猫駒の場合、角以外から選択
    if (selectedDisc.type === "cat") {
      const nonCornerMoves = validMoves.filter(
        (pos) => !isCorner(pos.x, pos.y)
      );
      if (nonCornerMoves.length > 0) {
        // ランダムに角以外の位置を選択
        const randomIndex = Math.floor(Math.random() * nonCornerMoves.length);
        return {
          discId: selectedDisc.id,
          position: nonCornerMoves[randomIndex],
        };
      }
    }

    // 通常駒または角しか置けない場合、ランダムに位置を選択
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    const position = validMoves[randomIndex];

    return {
      discId: selectedDisc.id,
      position,
    };
  }
}
