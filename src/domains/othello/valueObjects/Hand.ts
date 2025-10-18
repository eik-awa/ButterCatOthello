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
      // 黒は0-3、白は4-7のIDを使用
      const baseId = color === "black" ? 0 : 4;
      this.discs = [
        new HandDisc(baseId + 0, color),
        new HandDisc(baseId + 1, color),
        new HandDisc(baseId + 2, color),
        new HandDisc(baseId + 3, color),
      ];
    }
    this.selectedDiscId = selectedDiscId;
  }

  /**
   * ランダムに駒タイプを決定
   * 通常: 70%, バター: 10%, 猫: 10%, バター猫: 10%
   * 全駒が通常の場合は必ず特殊駒を出す
   */
  private randomDiscType(): DiscType {
    // 全駒が通常駒かチェック
    const allNormal = this.discs.every((disc) => disc.type === "normal");

    if (allNormal) {
      // 全部通常駒の場合は必ず特殊駒を出す
      const rand = Math.random();
      if (rand < 0.33) return "butter";
      if (rand < 0.66) return "cat";
      return "buttercat";
    }

    // 通常のランダム選択
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
    // IDから配列インデックスを取得（黒:0-3, 白:4-7）
    const index = this.discs.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Disc with id ${id} not found`);
    }
    const disc = this.discs[index];
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
    newHand.discs = this.discs.map((disc) => {
      if (disc.id === this.selectedDiscId) {
        // 使用した駒を新しいランダムタイプで補充
        const type = newHand.randomDiscType();
        return new HandDisc(disc.id, disc.color, type, false);
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
