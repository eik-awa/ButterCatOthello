export class Position {
  constructor(public readonly x: number, public readonly y: number) {
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error(`Invalid position: (${x}, ${y})`);
    }
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  static directionOffsets(): { dx: number; dy: number }[] {
    const directions: { dx: number; dy: number }[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        directions.push({ dx, dy });
      }
    }

    return directions;
  }

  move(dx: number, dy: number): Position | null {
    const nx = this.x + dx;
    const ny = this.y + dy;
    if (nx < 0 || nx > 7 || ny < 0 || ny > 7) return null;
    return new Position(nx, ny);
  }
}
