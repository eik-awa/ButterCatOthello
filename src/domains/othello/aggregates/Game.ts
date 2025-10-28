import { Board } from "../entities/Board";
import { Disk } from "../entities/Disk";
import { Position } from "../valueObjects/Position";
import { Color, oppositeColor } from "../valueObjects/Color";
import { Hand } from "../valueObjects/Hand";

/**
 * Game集約ルート
 * オセロゲーム全体の状態と振る舞いを管理する
 */
export class Game {
  private board: Board;
  private currentTurn: Color;
  private flippingPositions: Set<string>; // フリップ中の石の位置（"x,y"形式）
  private isOperationLocked: boolean; // フリップ中の操作ロック
  private blackHand: Hand; // 黒プレイヤーの手札
  private whiteHand: Hand; // 白プレイヤーの手札

  constructor(board?: Board, currentTurn: Color = "black") {
    this.board = board || new Board();
    this.currentTurn = currentTurn;
    this.flippingPositions = new Set();
    this.isOperationLocked = false;
    this.blackHand = new Hand("black");
    this.whiteHand = new Hand("white");
  }

  /**
   * 手札から駒を選択する
   */
  selectHandDisc(discId: number): void {
    // 選択された駒がどちらのプレイヤーのものかを判定
    const blackDisc = this.blackHand.getDiscs().find(d => d.id === discId);
    const whiteDisc = this.whiteHand.getDiscs().find(d => d.id === discId);

    if (blackDisc) {
      // 黒の駒が選択された場合、白の選択を解除してから黒を選択
      this.whiteHand = this.whiteHand.deselectDisc();
      const newHand = this.blackHand.selectDisc(discId);
      this.blackHand = newHand;
    } else if (whiteDisc) {
      // 白の駒が選択された場合、黒の選択を解除してから白を選択
      this.blackHand = this.blackHand.deselectDisc();
      const newHand = this.whiteHand.selectDisc(discId);
      this.whiteHand = newHand;
    }
  }

  /**
   * 手札の選択を解除する
   */
  deselectHandDisc(): void {
    const hand = this.getCurrentHand();
    const newHand = hand.deselectDisc();
    this.setCurrentHand(newHand);
  }

  /**
   * 指定位置に石を置く
   * @returns 裏返された石の位置配列
   */
  placeDisk(pos: Position, color: Color): Position[] | null {
    // 操作がロックされている場合は実行不可
    if (this.isOperationLocked) {
      return null;
    }

    // 現在のターンと一致しない場合は実行不可
    if (color !== this.currentTurn) {
      return null;
    }

    // 手札から駒が選択されていない場合は実行不可
    const hand = this.getCurrentHand();
    if (!hand.hasSelection()) {
      return null;
    }

    // 選択された駒の情報を取得
    const selectedDiscId = hand.getSelectedDiscId();
    if (selectedDiscId === null) return null;

    const selectedDisc = hand.getDiscs().find(d => d.id === selectedDiscId);
    if (!selectedDisc) return null;
    const discType = selectedDisc.type;

    // 特殊駒は中央16マスに置けない
    if (discType !== "normal" && pos.isInCenter16()) {
      return null;
    }

    if (!this.canPlaceDisk(pos, color)) {
      return null;
    }

    // 駒の配置色を決定
    let placedColor: Color = color;
    if (discType === "butter") {
      // バター駒：相手の色になる
      placedColor = oppositeColor(color);
    } else if (discType === "buttercat") {
      // バター猫駒：とりあえず自分の色（後でUIで表現）
      placedColor = color;
    }

    const newDisk = new Disk(placedColor, discType);
    this.board.setDisk(pos, newDisk);

    // 裏返された石のみを含める
    const flippedPositions: Position[] = [];

    // バター猫駒の場合は挟めない
    if (discType === "buttercat") {
      // 選択した駒を使用（使用後に全駒補充）
      const currentHand = this.getCurrentHand();
      const newHand = currentHand.useSelectedDisc();
      this.setCurrentHand(newHand);

      // ターンを次のプレイヤーに変更
      this.currentTurn = oppositeColor(this.currentTurn);

      return flippedPositions;
    }

    // 裏返しの基準色を決定（バター駒の場合は元のプレイヤーの色で裏返す）
    const flipBaseColor = discType === "butter" ? color : placedColor;

    for (const dir of Position.directionOffsets()) {
      const disksToFlip: Position[] = [];
      let current = pos.move(dir.dx, dir.dy);

      while (current) {
        const disk = this.board.getDisk(current);
        if (!disk) break;

        // バター猫駒は挟めない
        if (disk.isButterCat()) break;

        if (disk.color === oppositeColor(flipBaseColor)) {
          // 猫駒とバター駒も含めて挟める対象とする
          disksToFlip.push(current);
        } else if (disk.color === flipBaseColor) {
          for (const flipPos of disksToFlip) {
            const flippedDisk = this.board.getDisk(flipPos);
            if (flippedDisk) {
              // 猫駒とバター駒は360度回転で元に戻る（色もタイプも保持）
              if (flippedDisk.isCat() || flippedDisk.isButter()) {
                // 色とタイプをそのまま保持（見た目は回転するが元に戻る）
                this.board.setDisk(
                  flipPos,
                  new Disk(flippedDisk.color, flippedDisk.type)
                );
              } else {
                // 通常駒は色を変更
                this.board.setDisk(
                  flipPos,
                  new Disk(flipBaseColor, flippedDisk.type)
                );
              }
              flippedPositions.push(flipPos);
            }
          }
          break;
        } else {
          break;
        }
        current = current.move(dir.dx, dir.dy);
      }
    }

    // 選択した駒を使用（使用後に全駒補充）
    const currentHand = this.getCurrentHand();
    const newHand = currentHand.useSelectedDisc();
    this.setCurrentHand(newHand);

    // ターンを次のプレイヤーに変更
    this.currentTurn = oppositeColor(this.currentTurn);

    return flippedPositions;
  }

  /**
   * フリップアニメーション開始
   */
  startFlipping(positions: Position[]): void {
    this.isOperationLocked = true;
    this.flippingPositions.clear();
    positions.forEach((pos) => {
      this.flippingPositions.add(`${pos.x},${pos.y}`);
    });
  }

  /**
   * フリップアニメーション終了
   */
  endFlipping(): void {
    this.isOperationLocked = false;
    this.flippingPositions.clear();
  }

  /**
   * 指定位置がフリップ中かどうか
   */
  isFlipping(pos: Position): boolean {
    return this.flippingPositions.has(`${pos.x},${pos.y}`);
  }

  /**
   * 操作がロックされているか
   */
  isLocked(): boolean {
    return this.isOperationLocked;
  }

  /**
   * 有効な手を取得
   */
  getValidMoves(color: Color): Position[] {
    const positions: Position[] = [];
    const hand = this.getHand(color);
    const selectedDiscId = hand.getSelectedDiscId();

    // 選択された駒のタイプを取得
    let discType: string | null = null;
    if (selectedDiscId !== null) {
      const selectedDisc = hand.getDiscs().find(d => d.id === selectedDiscId);
      if (selectedDisc) {
        discType = selectedDisc.type;
      }
    }

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const pos = new Position(x, y);

        // 特殊駒が選択されている場合、中央16マスを除外
        if (discType && discType !== "normal" && pos.isInCenter16()) {
          continue;
        }

        if (this.canPlaceDisk(pos, color)) {
          positions.push(pos);
        }
      }
    }
    return positions;
  }

  /**
   * 指定位置に石を置けるか判定
   */
  canPlaceDisk(pos: Position, color: Color): boolean {
    if (this.board.getDisk(pos)) return false;

    for (const dir of Position.directionOffsets()) {
      let current = pos.move(dir.dx, dir.dy);
      let foundOpponent = false;

      while (current) {
        const disk = this.board.getDisk(current);
        // バター猫駒は空欄として扱う（通過できない）
        if (!disk || disk.isButterCat()) break;
        if (disk.color === oppositeColor(color)) {
          foundOpponent = true;
        } else if (disk.color === color && foundOpponent) {
          return true;
        } else {
          break;
        }
        current = current.move(dir.dx, dir.dy);
      }
    }

    return false;
  }

  /**
   * 現在のプレイヤーが有効な手を持っているか（選択された駒のみ）
   */
  hasValidMoves(): boolean {
    const currentMoves = this.getValidMoves(this.currentTurn);
    return currentMoves.length > 0;
  }

  /**
   * 現在のプレイヤーが通常駒で有効な手を持っているか
   */
  hasValidMovesWithNormalDiscs(): boolean {
    const hand = this.getCurrentHand();
    const normalDiscs = hand.getDiscs().filter(d => !d.isUsed && d.type === "normal");

    // 通常駒がない場合はfalse
    if (normalDiscs.length === 0) {
      return false;
    }

    // 通常駒のいずれかで置ける場所があるかチェック
    for (const disc of normalDiscs) {
      // 一時的に駒を選択してチェック
      const tempGame = this.clone();
      tempGame.selectHandDisc(disc.id);
      const moves = tempGame.getValidMoves(this.currentTurn);
      if (moves.length > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * パス（ターンを相手に渡す）
   * 駒を選択している場合は選択を解除する
   */
  pass(): void {
    // 選択を解除
    this.deselectHandDisc();
    // ターンを次のプレイヤーに変更
    this.currentTurn = oppositeColor(this.currentTurn);
  }

  /**
   * ゲームが終了しているか判定
   * 両プレイヤーが置ける場所がない場合にゲーム終了
   */
  isGameOver(): boolean {
    // 現在のプレイヤーの有効な手を確認
    const currentMoves = this.getValidMoves(this.currentTurn);

    // 現在のプレイヤーが置けない場合、相手プレイヤーの有効な手を確認
    if (currentMoves.length === 0) {
      const oppositeTurn = oppositeColor(this.currentTurn);
      const oppositeMoves = this.getValidMoves(oppositeTurn);

      // 両プレイヤーが置けない場合はゲーム終了
      return oppositeMoves.length === 0;
    }

    return false;
  }

  /**
   * 指定色の駒の数を取得
   */
  getDiscCount(color: Color): number {
    let count = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const pos = new Position(x, y);
        const disk = this.board.getDisk(pos);
        if (disk && disk.color === color) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * 勝者を取得（ゲーム終了時のみ有効）
   * @returns "black" | "white" | "draw"
   */
  getWinner(): "black" | "white" | "draw" | null {
    if (!this.isGameOver()) {
      return null;
    }

    const blackCount = this.getDiscCount("black");
    const whiteCount = this.getDiscCount("white");

    if (blackCount > whiteCount) {
      return "black";
    } else if (whiteCount > blackCount) {
      return "white";
    } else {
      return "draw";
    }
  }

  /**
   * 現在のターンを取得
   */
  getCurrentTurn(): Color {
    return this.currentTurn;
  }

  /**
   * ボードを取得
   */
  getBoard(): Board {
    return this.board;
  }

  /**
   * ボードを配列形式で取得
   */
  getBoardAsArray(): (Disk | null)[][] {
    return this.board.toArray();
  }

  /**
   * 現在のプレイヤーの手札を取得
   */
  getCurrentHand(): Hand {
    return this.currentTurn === "black" ? this.blackHand : this.whiteHand;
  }

  /**
   * 指定色の手札を取得
   */
  getHand(color: Color): Hand {
    return color === "black" ? this.blackHand : this.whiteHand;
  }

  /**
   * 現在のプレイヤーの手札を設定
   */
  private setCurrentHand(hand: Hand): void {
    if (this.currentTurn === "black") {
      this.blackHand = hand;
    } else {
      this.whiteHand = hand;
    }
  }

  /**
   * ゲームのクローンを作成
   */
  clone(): Game {
    const clonedGame = new Game(this.board.clone(), this.currentTurn);
    clonedGame.isOperationLocked = this.isOperationLocked;
    clonedGame.flippingPositions = new Set(this.flippingPositions);
    clonedGame.blackHand = this.blackHand;
    clonedGame.whiteHand = this.whiteHand;
    return clonedGame;
  }
}
