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
    return (
      isObject(pin) && typeof pin.id === "string" && pin.type instanceof PinType
    );
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

  toString(): string {
    return "PinLayout [pins=" + this.pins.toString() + "]";
  }
}
export default PinLayout;

export type PinTypeNames = Exclude<keyof typeof PinType, "from" | "types" | "prototype">;
export class PinType {
  static DIGITAL = new PinType("D", "digital");
  static ANALOG = new PinType("A", "analog");
  static PWM = new PinType(["~D"], "pwm");
  static POWER = new PinType(
    ["VIN", "GND", "GROUND", "3.3V", "3V3", "5V"],
    "power"
  );
  static SERIAL = new PinType(["TX", "RX", "UART", "SPI", "I2C"], "serial");

  #letters: string[];
  #name: string;
  constructor(letter: string | string[], name: string) {
    if (typeof letter === "string") {
      letter = [letter];
    }
    this.#letters = letter;
    this.#name = name;
  }

  getName(): string {
    return this.#name;
  }

  getLetters(): readonly string[] {
    return this.#letters;
  }

  static types(): readonly PinType[] {
    return [this.DIGITAL, this.ANALOG, this.PWM, this.POWER, this.SERIAL];
  }

  static from(name: PinTypeNames): PinType | undefined {
    const str = name.toUpperCase();
    for (const type of this.types()) {
      for (let i = 0; i < type.getLetters().length; i++) {
        if (str.startsWith(type.getLetters()[i])) {
          return type;
        }
      }
    }
  }
}