import { Disk } from "./Disk";
import { Position } from "../valueObjects/Position";

export class Board {
  private grid: (Disk | null)[][];

  constructor(grid?: (Disk | null)[][]) {
    if (grid) {
      this.grid = grid.map((row) => row.slice());
    } else {
      this.grid = Array.from({ length: 8 }, () => Array(8).fill(null));
      this.grid[3][3] = new Disk("white");
      this.grid[3][4] = new Disk("black");
      this.grid[4][3] = new Disk("black");
      this.grid[4][4] = new Disk("white");
    }
  }

  getDisk(position: Position): Disk | null {
    return this.grid[position.y][position.x];
  }

  setDisk(position: Position, disk: Disk): void {
    this.grid[position.y][position.x] = disk;
  }

  clone(): Board {
    return new Board(this.grid);
  }

  isInBounds(pos: Position): boolean {
    return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
  }

  toArray(): (Disk | null)[][] {
    return this.grid.map((row) => row.slice());
  }
}
