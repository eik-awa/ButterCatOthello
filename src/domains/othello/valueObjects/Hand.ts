import { Color } from "./Color";
import { HandDisc } from "./HandDisc";
import { DiscType } from "./DiscType";

/**
 * プレイヤーの手札を表す値オブジェクト
 * 4つの駒を保持し、選択状態を管理する
 */
export class Hand {
  private discs: HandDisc[];
  private selectedDiscId: number | null;

  constructor(
    color: Color,
    selectedDiscId: number | null = null,
    discs?: HandDisc[]
  ) {
    if (discs) {
      this.discs = discs;
    } else {
      this.discs = [
        new HandDisc(0, color),
        new HandDisc(1, color),
        new HandDisc(2, color),
        new HandDisc(3, color),
      ];
    }
    this.selectedDiscId = selectedDiscId;
  }

  /**
   * ランダムに駒タイプを決定
   * 通常: 70%, バター: 10%, 猫: 10%, バター猫: 10%
   */
  private static randomDiscType(): DiscType {
    const rand = Math.random();
    if (rand < 0.7) return "normal";
    if (rand < 0.8) return "butter";
    if (rand < 0.9) return "cat";
    return "buttercat";
  }

  /**
   * 駒を選択する
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
   * 選択中の駒を使用する（使用した駒だけを補充）
   * 補充時にランダムで特殊駒が出現する
   */
  useSelectedDisc(): Hand {
    if (this.selectedDiscId === null) {
      throw new Error("No disc is selected");
    }
    const newHand = this.clone();
    // 選択した駒だけを新しいタイプで補充
    newHand.discs = this.discs.map((disc, index) => {
      if (index === this.selectedDiscId) {
        // 使用した駒を新しいランダムタイプで補充
        const type = Hand.randomDiscType();
        return new HandDisc(index, disc.color, type, false);
      }
      // それ以外の駒はそのまま
      return disc;
    });
    newHand.selectedDiscId = null;
    return newHand;
  }

  /**
   * 選択中の駒IDを取得
   */
  getSelectedDiscId(): number | null {
    return this.selectedDiscId;
  }

  /**
   * 駒が選択されているか
   */
  hasSelection(): boolean {
    return this.selectedDiscId !== null;
  }

  /**
   * すべての駒を取得
   */
  getDiscs(): ReadonlyArray<HandDisc> {
    return this.discs;
  }

  /**
   * 使用可能な駒が残っているか
   */
  hasAvailableDiscs(): boolean {
    return this.discs.some((disc) => !disc.isUsed);
  }

  /**
   * すべての駒をリセットする
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
    const clonedDiscs = this.discs.map(
      (d) => new HandDisc(d.id, d.color, d.type, d.isUsed)
    );
    return new Hand(this.discs[0].color, this.selectedDiscId, clonedDiscs);
  }
}
