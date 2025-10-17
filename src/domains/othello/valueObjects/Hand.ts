import { Color } from "./Color";
import { HandDisc } from "./HandDisc";

/**
 * プレイヤーの手札を表す値オブジェクト
 * 4つのディスクを保持し、選択状態を管理する
 */
export class Hand {
  private discs: HandDisc[];
  private selectedDiscId: number | null;

  constructor(color: Color, selectedDiscId: number | null = null) {
    this.discs = [
      new HandDisc(0, color),
      new HandDisc(1, color),
      new HandDisc(2, color),
      new HandDisc(3, color),
    ];
    this.selectedDiscId = selectedDiscId;
  }

  /**
   * ディスクを選択する
   */
  selectDisc(id: number): Hand {
    if (id < 0 || id > 3) {
      throw new Error("Disc id must be between 0 and 3");
    }
    const disc = this.discs[id];
    if (disc.isUsed) {
      throw new Error("Cannot select a used disc");
    }
    const newHand = this.clone();
    newHand.selectedDiscId = id;
    return newHand;
  }

  /**
   * 選択を解除する
   */
  deselectDisc(): Hand {
    const newHand = this.clone();
    newHand.selectedDiscId = null;
    return newHand;
  }

  /**
   * 選択中のディスクを使用する（使用後に全ディスクを補充）
   */
  useSelectedDisc(): Hand {
    if (this.selectedDiscId === null) {
      throw new Error("No disc is selected");
    }
    const newHand = this.clone();
    // すべてのディスクを未使用状態にリセット（補充）
    newHand.discs = this.discs.map((disc) => disc.reset());
    newHand.selectedDiscId = null;
    return newHand;
  }

  /**
   * 選択中のディスクIDを取得
   */
  getSelectedDiscId(): number | null {
    return this.selectedDiscId;
  }

  /**
   * ディスクが選択されているか
   */
  hasSelection(): boolean {
    return this.selectedDiscId !== null;
  }

  /**
   * すべてのディスクを取得
   */
  getDiscs(): ReadonlyArray<HandDisc> {
    return this.discs;
  }

  /**
   * 使用可能なディスクが残っているか
   */
  hasAvailableDiscs(): boolean {
    return this.discs.some((disc) => !disc.isUsed);
  }

  /**
   * すべてのディスクをリセットする
   */
  resetAllDiscs(): Hand {
    const newHand = this.clone();
    newHand.discs = this.discs.map((disc) => disc.reset());
    newHand.selectedDiscId = null;
    return newHand;
  }

  /**
   * クローンを作成
   */
  private clone(): Hand {
    const newHand = new Hand(this.discs[0].color, this.selectedDiscId);
    newHand.discs = this.discs.map(
      (d) => new HandDisc(d.id, d.color, d.isUsed)
    );
    return newHand;
  }
}