import { deepEqual, isObject} from "../utils/utils";

export type ConfigValue = {
  readonly value: string;
  readonly valueLabel?: string;
  readonly selected: boolean;
};

export type ConfigOption = {
  readonly option: string;
  readonly optionLabel?: string;
  readonly values: readonly ConfigValue[];
};

export class FQBN {
  readonly vendor: string;
  readonly arch: string;
  readonly boardId: string;
  readonly options?: Readonly<Record<string, string>>;

  constructor(fqbn: string) {
    const fqbnSegments = fqbn.split(":");
    if (fqbnSegments.length < 3 || fqbnSegments.length > 4) {
      throw new InvalidFQBNError(fqbn);
    }
    for (let i = 0; i < 3; i++) {
      if (!/^[a-zA-Z0-9_.-]*$/.test(fqbnSegments[i])) {
        throw new InvalidFQBNError(fqbn);
      }
    }
    const [vendor, arch, boardId, rest] = fqbnSegments;
    if (!boardId) {
      throw new InvalidFQBNError(fqbn);
    }

    const options: Record<string, string> = {};
    if (typeof rest === "string") {
      const tuples = rest.split(",");
      for (const tuple of tuples) {
        const configSegments = tuple.split("=", 2);
        if (configSegments.length !== 2) {
          throw new ConfigOptionError(
            fqbn,
            `Invalid config option: '${tuple}'`
          );
        }
        const [key, value] = configSegments;
        if (!/^[a-zA-Z0-9_.-]+$/.test(key)) {
          throw new ConfigOptionError(
            fqbn,
            `Invalid config option key: '${key}' (${tuple})`
          );
        }
        if (!/^[a-zA-Z0-9=_.-]*$/.test(value)) {
          throw new ConfigOptionError(
            fqbn,
            `Invalid config option value: '${value}' (${tuple})`
          );
        }
        const existingValue = options[key];
        if (existingValue) {
          throw new ConfigOptionError(
            fqbn,
            `Duplicate config options: ${key}:${existingValue}, ${key}:${value}`
          );
        }
        options[key] = value;
      }
    }

    this.vendor = vendor;
    this.arch = arch;
    this.boardId = boardId;
    if (Object.keys(options).length) {
      this.options = options;
    }
  }

  withConfigOptions(...configOptions: readonly ConfigOption[]): FQBN {
    if (!configOptions.length) {
      return this;
    }
    const newOptions: Record<string, string> = {};
    for (const configOption of configOptions) {
      const key = configOption.option;
      const selected = configOption.values.filter((value) => value.selected);
      if (!selected.length) {
        throw new ConfigOptionError(
          this.toString(),
          `No selected value for config option: '${key}'`
        );
      }
      if (selected.length > 1) {
        throw new ConfigOptionError(
          this.toString(),
          `Multiple selected value for config option: '${key}'`
        );
      }
      const value = selected[0].value;
      const existingValue = newOptions[key];
      if (existingValue) {
        throw new ConfigOptionError(
          this.toString(),
          `Duplicate config options: ${key}:${existingValue}, ${key}:${selected}`
        );
      }
      newOptions[key] = value;
    }

    const options: Record<string, string> = this.options
      ? Object.assign({}, this.options)
      : {};
    let didUpdate = false;
    for (const [key, newValue] of Object.entries(newOptions)) {
      const existingValue = options[key];
      if (existingValue !== newValue) {
        options[key] = newValue;
        didUpdate = true;
      }
    }

    if (!didUpdate) {
      return this;
    }

    const { vendor, arch, boardId } = this;
    return new FQBN(serialize(vendor, arch, boardId, options));
  }

  setConfigOption(
    option: ConfigOption["option"],
    value: ConfigValue["value"],
    strict = false
  ): FQBN {
    const options = this.options ?? {};
    if (strict && !options[option]) {
      throw new ConfigOptionError(
        this.toString(),
        `Config option ${option} must be present in the FQBN (${this.toString()}) when using strict mode.`
      );
    }
    return this.withConfigOptions({
      option,
      values: [
        {
          value,
          selected: true,
        },
      ],
    });
  }

  withFQBN(fqbn: string): FQBN {
    const other = new FQBN(fqbn);
    if (!this.sanitize().equals(other.sanitize())) {
      throw new ConfigOptionError(
        fqbn,
        `Mismatching FQBNs. this: ${this.toString()}, other: ${fqbn}`
      );
    }
    return this.withConfigOptions(
      ...Object.entries(other.options ?? {}).map(([option, value]) => ({
        option,
        values: [
          {
            value,
            selected: true,
          },
        ],
      }))
    );
  }

  sanitize(): FQBN {
    if (!this.hasConfigOptions()) {
      return this;
    }
    return new FQBN(this.toString(true));
  }

  limitConfigOptions(maxOptions: number): FQBN {
    if (!Number.isInteger(maxOptions) || maxOptions < 0) {
      throw new RangeError("maxOptions must be a non-negative integer");
    }
    const { options } = this;
    if (!options) {
      return this;
    }
    if (maxOptions === 0) {
      return this.sanitize();
    }
    const optionEntries = Object.entries(options);
    if (optionEntries.length <= maxOptions) {
      return this;
    }

    const limitedOptions: Record<string, string> = {};
    for (const [index, [key, value]] of optionEntries.entries()) {
      if (index >= maxOptions) {
        break;
      }
      limitedOptions[key] = value;
    }

    const { vendor, arch, boardId } = this;
    return new FQBN(serialize(vendor, arch, boardId, limitedOptions));
  }

  toString(skipOptions = false): string {
    const { vendor, arch, boardId, options = {} } = this;
    return serialize(vendor, arch, boardId, skipOptions ? undefined : options);
  }

  equals(other: FQBN): boolean {
    if (other === undefined || other === null || !(other instanceof FQBN)) {
      return false;
    }
    if (this === other) {
      return true;
    }
    if (
      this.vendor !== other.vendor ||
      this.arch !== other.arch ||
      this.boardId !== other.boardId
    ) {
      return false;
    }
    return deepEqual(this.options, other.options);
  }

  hasConfigOptions(): boolean {
    return isObject(this.options) && Object.keys(this.options).length != 0;
  }

  static from(fqbn: string): FQBN | undefined {
    try {
      return new FQBN(fqbn);
    } catch (e) {
      return;
    }
  }

  static isValid(fqbn: any) {
    if (typeof fqbn !== "string" || fqbn.length === 0) {
      return false;
    }
    try {
      new FQBN(fqbn);
    } catch (e) {
      return false;
    }
  }

}

function serialize(
  vendor: string,
  arch: string,
  boardId: string,
  options: Record<string, string> | undefined = undefined
): string {
  const configs = !options
    ? ""
    : Object.entries(options)
        .map(([key, value]) => `${key}=${value}`)
        .join(",");
  return `${vendor}:${arch}:${boardId}${configs ? `:${configs}` : ""}`;
}

export class InvalidFQBNError extends Error {
  constructor(readonly fqbn: string) {
    super(`Invalid FQBN: ${fqbn}`);
    this.name = InvalidFQBNError.name;
  }
}

export class ConfigOptionError extends InvalidFQBNError {
  constructor(fqbn: string, readonly detail: string) {
    super(fqbn);
    this.name = ConfigOptionError.name;
  }
}