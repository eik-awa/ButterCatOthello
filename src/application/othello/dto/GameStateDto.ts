import { Color } from "@/domains/othello/valueObjects/Color";
import { DiscType } from "@/domains/othello/valueObjects/DiscType";

/**
 * ゲーム状態のDTO
 * プレゼンテーション層に渡すためのデータ構造
 */
export type GameStateDto = {
  board: CellDto[][];
  currentTurn: Color;
  isGameOver: boolean;
  isLocked: boolean;
  blackHand: HandDto;
  whiteHand: HandDto;
  blackDiscCount: number;
  whiteDiscCount: number;
  winner: "black" | "white" | "draw" | null;
  hasValidMoves: boolean;
};

/**
 * セルのDTO
 */
export type CellDto = {
  x: number;
  y: number;
  color: Color | null;
  discType: DiscType | null;
  isValidMove: boolean;
  isFlipping: boolean;
};

/**
 * 手札のDTO
 */
export type HandDto = {
  color: Color;
  discs: HandDiscDto[];
  selectedDiscId: number | null;
  hasSelection: boolean;
};

/**
 * 手札の駒のDTO
 */
export type HandDiscDto = {
  id: number;
  color: Color;
  type: DiscType;
  isUsed: boolean;
};
