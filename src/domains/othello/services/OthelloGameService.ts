import { Board } from "../entities/Board";
import { Disk } from "../entities/Disk";
import { Position } from "../valueObjects/Position";
import { Color, oppositeColor } from "../valueObjects/Color";

export class OthelloGameService {
  constructor(private board: Board) {}

  getValidMoves(color: Color): Position[] {
    const positions: Position[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const pos = new Position(x, y);
        if (this.canPlaceDisk(pos, color)) {
          positions.push(pos);
        }
      }
    }
    return positions;
  }

  canPlaceDisk(pos: Position, color: Color): boolean {
    if (this.board.getDisk(pos)) return false;

    for (const dir of Position.directionOffsets()) {
      let current = pos.move(dir.dx, dir.dy);
      let foundOpponent = false;

      while (current) {
        const disk = this.board.getDisk(current);
        if (!disk) break;
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

  placeDisk(pos: Position, color: Color): boolean {
    if (!this.canPlaceDisk(pos, color)) return false;

    const newDisk = new Disk(color);
    this.board.setDisk(pos, newDisk);

    for (const dir of Position.directionOffsets()) {
      const disksToFlip: Position[] = [];
      let current = pos.move(dir.dx, dir.dy);

      while (current) {
        const disk = this.board.getDisk(current);
        if (!disk) break;
        if (disk.color === oppositeColor(color)) {
          disksToFlip.push(current);
        } else if (disk.color === color) {
          for (const flipPos of disksToFlip) {
            this.board.setDisk(flipPos, new Disk(color));
          }
          break;
        } else {
          break;
        }
        current = current.move(dir.dx, dir.dy);
      }
    }

    return true;
  }

  getBoard(): Board {
    return this.board;
  }
}
