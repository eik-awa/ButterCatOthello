import { Disk } from "../entities/Disk";
import { Position } from "../valueObjects/Position";

export type CellViewModel = {
  position: Position;
  disk: Disk | null;
  isValidMove: boolean;
  isFlipping: boolean;
};
