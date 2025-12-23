import { hasOwn, isArray, isDefined, isObject } from "./utils.js";

export type BoardPin = {
  id: string;
  type: PinType;
};
export type BoardDataOptions = {
  id: string;
  name?: string;
  version: string;
  pins: BoardPin[];
  spec?: BoardSpec;
};
export type BoardSpec = {};

export class BoardData {
  id: string;
  name: string;
  version: string;
  pins: BoardPin[];
  spec?: BoardSpec;

  constructor(
    id: string,
    name: string,
    version: string = "1.0",
    pins: BoardPin[],
    spec?: BoardSpec
  ) {
    if (typeof id !== "string" || typeof name !== "string") {
      throw new TypeError("Invalid Name or Id for Board");
    }
    if (typeof version !== "string") {
      throw new TypeError("Invalid Version for Board " + id);
    }
    if (!isArray(pins) || pins.some(pin => BoardData.#isValidPin(pin))) {
      throw new TypeError("Invalid Pins for Board " + id);
    }
    if (isDefined(spec) && !isObject(spec)) {
      throw new TypeError("Invalid Spec for Board " + id);
    }
    this.id = id;
    this.name = name;
    this.version = version;
    this.pins = pins;
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

  static #isValidPin(pin: BoardPin): any {
    return isObject(pin) && hasOwn(pin, "id")  && hasOwn(pin, "type") && typeof pin.id === "string" && pin.type instanceof PinType;
  }
}

export class PinType {
  static DIGITAL = new PinType("D", "digital");
  static ANALOG = new PinType("A", "analog");
  static PWM = new PinType(["~D"], "pwm");
  static POWER = new PinType(["VIN", "GND", "GROUND", "3.3V", "3V3", "5V"], "power");
  static SERIAL = new PinType(["TX", "RX", "UART", "SPI", "I2C"], "power");

  letters: string[];
  name: string;
  constructor(letter: string | string[], name: string) {
    if (typeof letter === "string") {
      letter = [letter];
    }
    this.letters = letter;
    this.name = name;
  }

  static modes() {
    return [this.DIGITAL, this.ANALOG, this.PWM, this.POWER];
  }

  static from(str: string): PinType | undefined {
    str = str.toUpperCase();
    for (const type of this.modes()) {
      for (let i = 0; i < type.letters.length; i++) {
        if (str.startsWith(type.letters[i])) {
          return type;
        }
      }
    }
  }
}
