import polycrc from "polycrc";
import { baudRates, PROTOCOL_VERSIONS } from "./constants.js";

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

const disallowedKeys = new Set(["__proto__", "prototype", "constructor"]);

const merge = (destination, source) => {
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
const mimeMap = {
  json: "application/json",
  text: "text/plain",
};
async function fetchGet(url, type) {
  let retryLeft = 3;
  while (retryLeft > 0) {
    try {
      let result = await fetch(url, {
        method: "GET",
        header: {
          "content-type": mimeMap[type],
          accept: mimeMap[type],
        },
        redirect: "follow",
      });
      if (!result.ok || result.status !== 200) {
        throw "";
      }
      if (type === "json") {
        return await result.json();
      } else if (type === "text") {
        return await result.text();
      }
    } catch (err) {
      await sleep(200);
    } finally {
      retryLeft -= 1;
    }
  }
  throw new Error("Failed to fetch from: " + url);
}

function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function validBaudRate(rate) {
  return baudRates.hasOwnProperty("$" + rate);
}

function validPort(str) {
  var regex = /^(\/(dev\/[a-zA-Z0-9]+)|com[0-9]+)$/;
  return (
    (typeof str === "string" && regex.test(str)) ||
    str === "" ||
    str === undefined
  );
}

const isArray =
  Array.isArray ||
  function (a) {
    return a && a.constructor === Array;
  };

function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

function isFunction(v) {
  return typeof v === "function";
}

function isDefined(v) {
  return typeof v !== "undefined" && v !== null;
}

function isString(v) {
  return typeof v === "string";
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
  isDefined,
  isFunction,
  hasOwn,
  fetchGet,
  validBaudRate,
  validPort
};
