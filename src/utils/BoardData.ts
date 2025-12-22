import { isObject } from "./utils.js";

export type BoardPins = {};
export type BoardDataOptions = {
  id: string;
  name?: string;
  version: string;
  pins: string;
  spec: BoardSpec;
};
export type BoardSpec = {};

export class BoardData {
  id: string;
  name: string;
  version: string;
  pins: any;
  spec: BoardSpec;

  constructor(
    id: string,
    name: string,
    version: string = "1.0",
    pins: string,
    spec: BoardSpec = {}
  ) {
    if (typeof id !== "string" || typeof name !== "string") {
      throw new TypeError("Invalid Name or Id for Board");
    }
    if (typeof version !== "string") {
      throw new TypeError("Invalid Version for Board " + id);
    }
    if (typeof pins !== "string") {
      throw new TypeError("Invalid Pins for Board " + id);
    }
    if (!isObject(spec)) {
      throw new TypeError("Invalid Spec for Board " + id);
    }
    this.id = id;
    this.name = name;
    this.version = version;
    this.pins = BoardData.parsePins(pins);
    this.spec = spec;
  }

  static from(opts: BoardDataOptions) {
    if (!isObject(opts)) {
      throw new TypeError("Invalid BoardData Object");
    }
    return new BoardData(
      opts.id,
      typeof opts.name !== "string" ? opts.id : opts.name,
      opts.version,
      opts.pins,
      opts.spec
    );
  }

  static parsePins(pinsStr: string): any {
    return null;
  }
}

export class BoardPin {
  type: PinType | undefined;
  id: string;

  constructor(str: string) {
    if (typeof str !== "string" || str.length == 0) {
      throw new TypeError("Invalid Pin for Board");
    }
    this.id = str;
    this.type = PinType.from(str);
  }
}

export class PinType {
  static DIGITAL = new PinType("D", "digital");
  static ANALOG = new PinType("A", "analog");

  letter: string;
  name: string;
  constructor(letter: string, name: string) {
    this.letter = letter.toUpperCase();
    this.name = name;
  }

  static modes() {
    return [this.DIGITAL, this.ANALOG];
  }

  static from(str: string): PinType | undefined {
    for (const type of this.modes()) {
      if (str.startsWith(type.letter)) {
        return type;
      }
    }
  }
}