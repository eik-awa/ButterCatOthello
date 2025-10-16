import { Board } from "@/domains/othello/entities/Board";
import { OthelloGameService } from "@/domains/othello/services/OthelloGameService";
import { Position } from "@/domains/othello/valueObjects/Position";
import { Color } from "@/domains/othello/valueObjects/Color";

export class GameService {
  private board: Board;
  private game: OthelloGameService;
  private currentTurn: Color;

  constructor() {
    this.board = new Board();
    this.game = new OthelloGameService(this.board);
    this.currentTurn = "black";
  }

  getBoard(): (string | null)[][] {
    return this.board
      .toArray()
      .map((row) => row.map((disk) => (disk ? disk.color : null)));
  }

  getCurrentTurn(): Color {
    return this.currentTurn;
  }

  getValidMoves(): Position[] {
    return this.game.getValidMoves(this.currentTurn);
  }

  playMove(x: number, y: number): boolean {
    const pos = new Position(x, y);
    const success = this.game.placeDisk(pos, this.currentTurn);

    if (success) {
      this.currentTurn = this.currentTurn === "black" ? "white" : "black";
    }

    return success;
  }

  isGameOver(): boolean {
    const blackMoves = this.game.getValidMoves("black");
    const whiteMoves = this.game.getValidMoves("white");
    return blackMoves.length === 0 && whiteMoves.length === 0;
  }
}
