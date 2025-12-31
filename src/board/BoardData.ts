import { isArray, isDefined, isNumber, isObject } from "../utils/utils.ts";
import PinLayout from "./PinLayout.ts";
import { FQBN } from "./fqbn.ts";

export type BoardDataOptions = {
  fqbn: FQBN;
  pins: PinLayout;
  idpairs?: BoardIdPair[];
  name?: string;
  spec?: BoardSpec;
};
export type BoardSpec = {};
export type BoardIdPair = {
  vid: number;
  pid: number;
};

export class BoardData {
  #id: string;
  #name: string;
  #fqbn: FQBN;
  #pins: PinLayout;
  #idPairs: BoardIdPair[];
  #spec: BoardSpec;

  constructor(opts: BoardDataOptions) {
    if (!isObject(opts)) {
      throw new TypeError("Invalid BoardData Options");
    }
    if (!(opts.fqbn instanceof FQBN)) {
      throw new TypeError("Invalid FQBN for Board");
    }
    this.#fqbn = opts.fqbn
    this.#id = opts.fqbn.boardId;
    this.#name = isDefined(opts.name) ? opts.name : this.#id;
    if (typeof this.#name !== "string" || this.#name.length === 0) {
      throw new TypeError("Invalid Name for Board " + this.#id);
    }
    this.#pins = opts.pins;
    if (!(this.#pins instanceof PinLayout)) {
      throw new TypeError("Invalid PinLayout for Board " + this.#id);
    }
    this.#idPairs = isDefined(opts.idpairs) ? opts.idpairs : [];
    if (!isArray(this.#idPairs) || this.#idPairs.some(p => !isObject(p) || !isNumber(p.pid) || !isNumber(p.vid))) {
      throw new TypeError("Invalid Id Pairs for Board " + this.#id);
    }
    this.#spec = isDefined(opts.spec) ? opts.spec : {};
    if (!isObject(this.#spec)) {
      throw new TypeError("Invalid Spec for Board " + this.#id);
    }
  }

  getId(): string {
    return this.#fqbn.boardId;
  }

  getFQBN(): FQBN {
    return this.#fqbn;
  }

  getName(): string {
    return this.#name;
  }

  getVendor(): string {
    return this.#fqbn.vendor;
  }
  
  getIdPairs(): readonly BoardIdPair[] {
    return this.#idPairs;
  }

  getArch(): string {
    return this.#fqbn.arch;
  }

  getPins(): PinLayout {
    return this.#pins;
  }

  getSpec(): BoardSpec | undefined {
    return this.#spec;
  }

  toString(): string {
    return (
      "BoardData [name=" +
      this.#name +
      ",fqbn=" +
      this.#fqbn.toString() +
      ",pins=" +
      this.#pins.toString() +
      "]"
    );
  }
}
export default BoardData;