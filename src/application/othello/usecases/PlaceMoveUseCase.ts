import { Game } from "@/domains/othello/aggregates/Game";
import { Position } from "@/domains/othello/valueObjects/Position";
import { PlaceMoveCommand } from "../dto/PlaceMoveCommand";
import { GameStateDto, CellDto, HandDto } from "../dto/GameStateDto";

/**
 * 石を置くユースケース
 */
export class PlaceMoveUseCase {
  constructor(private game: Game) {}

  /**
   * 石を置いてゲーム状態を更新
   * @param command 石を置く位置
   * @returns 更新後のゲーム状態とフリップする石の位置
   */
  execute(command: PlaceMoveCommand): {
    success: boolean;
    flippedPositions: Position[];
    gameState: GameStateDto;
  } {
    const position = new Position(command.x, command.y);
    const currentTurn = this.game.getCurrentTurn();

    const flippedPositions = this.game.placeDisk(position, currentTurn);

    if (flippedPositions === null) {
      return {
        success: false,
        flippedPositions: [],
        gameState: this.getGameState(),
      };
    }

    // フリップアニメーション開始
    if (flippedPositions.length > 0) {
      this.game.startFlipping(flippedPositions);
    }

    return {
      success: true,
      flippedPositions,
      gameState: this.getGameState(),
    };
  }

  /**
   * フリップアニメーション終了
   */
  endFlipping(): GameStateDto {
    this.game.endFlipping();
    return this.getGameState();
  }

  /**
   * 手札の駒を選択
   */
  selectHandDisc(discId: number): GameStateDto {
    this.game.selectHandDisc(discId);
    return this.getGameState();
  }

  /**
   * 手札の選択を解除
   */
  deselectHandDisc(): GameStateDto {
    this.game.deselectHandDisc();
    return this.getGameState();
  }

  /**
   * パス（ターンを相手に渡す）
   */
  pass(): GameStateDto {
    this.game.pass();
    return this.getGameState();
  }

  /**
   * 現在のプレイヤーが有効な手を持っているか
   */
  hasValidMoves(): boolean {
    return this.game.hasValidMoves();
  }

  /**
   * Gameインスタンスを取得（CPU戦略用）
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * 現在のゲーム状態を取得
   */
  getGameState(): GameStateDto {
    const board = this.game.getBoardAsArray();
    const currentTurn = this.game.getCurrentTurn();
    const validMoves = this.game.getValidMoves(currentTurn);
    const validMoveSet = new Set(validMoves.map((pos) => `${pos.x},${pos.y}`));

    const cellDtos: CellDto[][] = board.map((row, y) =>
      row.map((disk, x) => {
        const position = new Position(x, y);
        return {
          x,
          y,
          color: disk?.color || null,
          discType: disk?.type || null,
          isValidMove: validMoveSet.has(`${x},${y}`),
          isFlipping: this.game.isFlipping(position),
        };
      })
    );

    // 手札情報を取得
    const blackHand = this.game.getHand("black");
    const whiteHand = this.game.getHand("white");

    const blackHandDto: HandDto = {
      color: "black",
      discs: blackHand.getDiscs().map((d) => ({
        id: d.id,
        color: d.color,
        type: d.type,
        isUsed: d.isUsed,
      })),
      selectedDiscId: blackHand.getSelectedDiscId(),
      hasSelection: blackHand.hasSelection(),
    };

    const whiteHandDto: HandDto = {
      color: "white",
      discs: whiteHand.getDiscs().map((d) => ({
        id: d.id,
        color: d.color,
        type: d.type,
        isUsed: d.isUsed,
      })),
      selectedDiscId: whiteHand.getSelectedDiscId(),
      hasSelection: whiteHand.hasSelection(),
    };

    return {
      board: cellDtos,
      currentTurn,
      isGameOver: this.game.isGameOver(),
      isLocked: this.game.isLocked(),
      blackHand: blackHandDto,
      whiteHand: whiteHandDto,
      blackDiscCount: this.game.getDiscCount("black"),
      whiteDiscCount: this.game.getDiscCount("white"),
      winner: this.game.getWinner(),
      hasValidMoves: this.game.hasValidMoves(),
    };
  }
}
