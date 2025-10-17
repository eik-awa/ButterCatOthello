import { Color } from "../valueObjects/Color";
import { DiscType } from "../valueObjects/DiscType";

export class Disk {
  constructor(
    public readonly color: Color,
    public readonly type: DiscType = "normal"
  ) {}

  /**
   * 通常の駒かどうか
   */
  isNormal(): boolean {
    return this.type === "normal";
  }

  /**
   * バター駒かどうか
   */
  isButter(): boolean {
    return this.type === "butter";
  }

  /**
   * 猫駒かどうか
   */
  isCat(): boolean {
    return this.type === "cat";
  }

  /**
   * バター猫駒かどうか
   */
  isButterCat(): boolean {
    return this.type === "buttercat";
  }
}
