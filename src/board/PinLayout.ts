import { PinType } from "./BoardData.ts";
import { isArray, isDefined, isObject } from "../utils/utils";

export type BoardPin = {
  id: string;
  type: PinType;
};

export class PinLayout {
  pins: BoardPin[];

  constructor(pins: BoardPin[]) {
    if (!isArray(pins) || pins.some((pin) => PinLayout.isValidPin(pin))) {
      throw new TypeError("Invalid Pins for PinLayout");
    }
    this.pins = pins;
  }

  static isValidPin(pin?: any): pin is BoardPin {
    return isObject(pin) && typeof pin.id === "string" && pin.type instanceof PinType;
  }

  getPins(): BoardPin[] {
    return this.pins;
  }

  getIds(): string[] {
    return this.pins.map((p) => p.id);
  }

  getByType(type: PinType): BoardPin[] | undefined {
    if (!isDefined(type)) {
      return;
    }
    return this.pins.filter((p) => p.type === type);
  }

  getAmount(type?: PinType): number {
    if (!isDefined(type)) {
      return this.pins.length;
    }
    let data = this.getByType(type);
    return data ? data.length : 0;
  }
}
