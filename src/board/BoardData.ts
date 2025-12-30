import { isDefined, isObject } from "../utils/utils.ts";
import PinLayout from "./PinLayout.ts";
import { FQBN } from "./fqbn.ts";

export type BoardDataOptions = {
  fqbn: FQBN;
  pins: PinLayout;
  name?: string;
  spec?: BoardSpec;
};
export type BoardSpec = {};


export class BoardData {
  id: string;
  name: string;
  fqbn: FQBN;
  pins: PinLayout;
  spec?: BoardSpec;

  constructor(fqbn: FQBN, pins: PinLayout, name: string, spec?: BoardSpec) {
    if (!(fqbn instanceof FQBN)) {
      throw new TypeError("Invalid FQBN for Board");
    }
    this.id = fqbn.boardId;
    if (typeof name !== "string") {
      throw new TypeError("Invalid Name for Board " + this.id);
    }
    if (!(pins instanceof PinLayout)) {
      throw new TypeError("Invalid PinLayout for Board " + this.id);
    }
    if (isDefined(spec) && !isObject(spec)) {
      throw new TypeError("Invalid Spec for Board " + this.id);
    }
    this.fqbn = fqbn;
    this.name = name;
    this.pins = pins;
    this.spec = spec;
  }

  static from(opts: BoardDataOptions): BoardData {
    if (!isObject(opts)) {
      throw new TypeError("Invalid BoardData Object");
    }
    return new BoardData(
      opts.fqbn,
      opts.pins,
      typeof opts.name !== "string" ? opts.fqbn.boardId : opts.name,
      opts.spec
    );
  }

  getId(): string {
    return this.fqbn.boardId;
  }

  getFQBN(): FQBN {
    return this.fqbn;
  }

  getName(): string {
    return this.name;
  }

  getVendor(): string {
    return this.fqbn.vendor;
  }

  getArch(): string {
    return this.fqbn.arch;
  }

  getPins(): PinLayout {
    return this.pins;
  }

  getSpec(): BoardSpec | undefined {
    return this.spec;
  }

  toString(): string {
    return (
      "BoardData [name=" +
      this.name +
      ",fqbn=" +
      this.fqbn.toString() +
      ",pins=" +
      this.pins.toString() +
      "]"
    );
  }
}
export default BoardData;