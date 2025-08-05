import polycrc from "polycrc";
import { PROTOCOL_VERSIONS } from "./constants.js";

function getCrcImpl(id) {
  const crcImpl = polycrc["crc" + id];
  if (!(crcImpl instanceof polycrc.CRC || typeof crcImpl === "function")) {
    throw new TypeError("Invalid CRC Id");
  }
  return crcImpl;
}

function getCrcId(id) {
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
function validByte(value, defaultValue) {
  value = parseInt(value.toString(), 10);
  if (typeof value !== "number" || value < 0 || value > 255 || isNaN(value)) {
    return defaultValue || 0;
  }
  return value;
}

function validVersion(version) {
  version = parseInt(version.toString(), 10);
  return (
    typeof version === "number" &&
    !isNaN(version) &&
    version > 0 &&
    version <= PROTOCOL_VERSIONS.LATEST
  );
}

function defaults(opts = {}, defaultOpts = {}) {
  if (!isObject(opts)) {
    throw new TypeError("Options must be an object");
  }
  const outOpts = {};
  for (const key of Object.keys(defaultOpts)) {
    if (!hasOwn(opts, key)) {
      outOpts[key] = defaultOpts[key];
    } else {
      outOpts[key] = opts[key];
    }
  }
  return outOpts;
}

const isArray =
  Array.isArray ||
  function (a) {
    return a && a.constructor === Array;
  };

function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn =
  Object.hasOwn ||
  function (obj, prop) {
    return hasOwnProperty.call(obj, prop);
  };

export {
  getCrcImpl,
  getCrcId,
  validByte,
  validVersion,
  defaults,
  isArray,
  isObject,
  hasOwn,
};
