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

export default class BoardData {
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

  static from(opts: BoardDataOptions) {
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

  getId() {
    return this.fqbn.boardId;
  }

  getFQBN() {
    return this.fqbn;
  }

  getName() {
    return this.name;
  }

  getVendor() {
    return this.fqbn.vendor;
  }

  getArch() {
    return this.fqbn.arch;
  }

  getPins() {
    return this.pins;
  }

  getSpec() {
    return this.spec;
  }

  toString() {
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
