import polycrc from "polycrc";
import { baudRates, PROTOCOL_VERSIONS } from "./constants.js";

function getCrcImpl(id: string) {
  const crcImpl = polycrc["crc" + id];
  if (!(crcImpl instanceof polycrc.CRC || typeof crcImpl === "function")) {
    throw new TypeError("Invalid CRC Id");
  }
  return crcImpl;
}

function getCrcId(id: string) {
  if (typeof id !== "string" || !id.startsWith("crc")) {
    throw new TypeError("Invalid CRC Id");
  }
  let parser_id = parseInt(id.substring(3), 10);
  if (
    (typeof parser_id !== "number" && isNaN(parser_id)) ||
    parser_id < 8 ||
    parser_id > 32 ||
    parser_id % 8 !== 0
  ) {
    throw new TypeError("Invalid CRC Id");
  }
  return parser_id;
}
function validByte(value: string | number, defaultValue: number) {
  value = parseInt(value.toString(), 10);
  if (typeof value !== "number" || value < 0 || value > 255 || isNaN(value)) {
    return defaultValue || 0;
  }
  return value;
}

function validVersion(version: string | number) {
  version = parseInt(version.toString(), 10);
  return (
    typeof version === "number" &&
    !isNaN(version) &&
    version > 0 &&
    version <= PROTOCOL_VERSIONS.LATEST
  );
}

const disallowedKeys = new Set(["__proto__", "prototype", "constructor"]);

const merge = (
  destination: Record<string, any>,
  source: Record<string, any>
) => {
  if (!isObject(source)) {
    return destination;
  }

  if (!destination) {
    destination = {};
  }

  for (const [sourceKey, sourceValue] of Object.entries(source)) {
    if (disallowedKeys.has(sourceKey)) {
      continue;
    }

    const destinationValue = destination[sourceKey];

    if (isObject(destinationValue) && isObject(sourceValue)) {
      destination[sourceKey] = merge(destinationValue, sourceValue); // Merge plain objects recursively
    } else if (sourceValue === undefined) {
      continue; // Skip undefined values in source
    } else if (isObject(sourceValue)) {
      destination[sourceKey] = merge({}, sourceValue); // Clone plain objects
    } else if (Array.isArray(sourceValue)) {
      destination[sourceKey] = [...sourceValue]; // Clone arrays
    } else {
      destination[sourceKey] = sourceValue; // Assign other types
    }
  }

  return destination;
};

function defaults(options = {}, defaultOptions = {}) {
  return merge(structuredClone(defaultOptions), structuredClone(options));
}

function validBaudRate(rate: string | number) {
  return baudRates.hasOwnProperty("$" + rate);
}

function validPort(str: string) {
  var regex = /^(\/(dev\/[a-zA-Z0-9]+)|com[0-9]+)$/;
  return (
    (typeof str === "string" && regex.test(str)) ||
    str === "" ||
    str === undefined
  );
}

const isArray =
  Array.isArray ||
  function (a: any): a is any[] {
    return a && a.constructor === Array;
  };

function isObject(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

function isFunction(v: any): v is Function {
  return typeof v === "function";
}

function isNumber(n: any): n is number {
  return typeof n === "number" && !isNaN(n)
}

function isDefined<T>(v?: T): v is NonNullable<T> {
  return typeof v !== "undefined" && v !== null;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn =
  Object.hasOwn ||
  function (obj: Record<string, any>, prop: string): boolean {
    return hasOwnProperty.call(obj, prop);
  };

function deepEqual(x: any, y: any): boolean {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) {
      return false;
    }

    for (let prop in x) {
      if (hasOwn(y, prop)) {
        if (!deepEqual(x[prop], y[prop])) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}

export {
  getCrcImpl,
  getCrcId,
  validByte,
  validVersion,
  defaults,
  isArray,
  isObject,
  isDefined,
  isFunction,
  isNumber,
  hasOwn,
  validBaudRate,
  validPort,
  deepEqual
};
