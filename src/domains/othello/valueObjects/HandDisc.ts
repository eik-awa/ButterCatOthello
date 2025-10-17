import { Color } from "./Color";

/**
 * 手札の駒を表す値オブジェクト
 * 各プレイヤーは4つの駒を手札として持つ
 */
export class HandDisc {
  constructor(
    public readonly id: number, // 0-3の識別子
    public readonly color: Color,
    public readonly isUsed: boolean = false
  ) {
    if (id < 0 || id > 3) {
      throw new Error("HandDisc id must be between 0 and 3");
    }
  }

  /**
   * 駒を使用済みにする
   */
  use(): HandDisc {
    return new HandDisc(this.id, this.color, true);
  }

  /**
   * 駒をリセットする（未使用状態に戻す）
   */
  reset(): HandDisc {
    return new HandDisc(this.id, this.color, false);
  }
}
