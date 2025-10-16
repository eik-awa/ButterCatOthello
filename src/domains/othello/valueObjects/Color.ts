export type Color = "black" | "white";

export const oppositeColor = (color: Color): Color => {
  return color === "black" ? "white" : "black";
};
