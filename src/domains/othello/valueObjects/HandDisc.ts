import { Color } from "./Color";
import { DiscType } from "./DiscType";

/**
 * 手札の駒（駒）を表す値オブジェクト
 * 各プレイヤーは4つの駒を手札として持つ
 */
export class HandDisc {
  constructor(
    public readonly id: number, // 黒:0-3, 白:4-7の識別子
    public readonly color: Color,
    public readonly type: DiscType = "normal",
    public readonly isUsed: boolean = false
  ) {
    if (id < 0 || id > 7) {
      throw new Error("HandDisc id must be between 0 and 7");
    }
  }

  /**
   * 駒を使用済みにする
   */
  use(): HandDisc {
    return new HandDisc(this.id, this.color, this.type, true);
  }

  /**
   * 駒をリセットする（未使用状態に戻す）
   */
  reset(): HandDisc {
    return new HandDisc(this.id, this.color, this.type, false);
  }

  /**
   * 通常の駒かどうか
   */
  isNormal(): boolean {
    return this.type === "normal";
  }

  /**
   * 特殊駒かどうか
   */
  isSpecial(): boolean {
    return this.type !== "normal";
  }
}
