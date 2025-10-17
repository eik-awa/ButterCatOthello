/**
 * 駒の種類
 */
export type DiscType =
  | "normal" // 通常の駒
  | "butter" // バター駒（置くと相手の色、360度回転で戻る）
  | "cat" // 猫駒（置くと自分の色、360度回転で戻る）
  | "buttercat"; // バター猫駒（Y軸回転し続ける、挟めない）

/**
 * 特殊駒かどうかを判定
 */
export function isSpecialDisc(type: DiscType): boolean {
  return type !== "normal";
}

/**
 * バター猫駒かどうかを判定
 */
export function isButterCat(type: DiscType): boolean {
  return type === "buttercat";
}
