import { copyFile, readFile, writeFile } from "fs/promises";
import { defaults, isObject, isArray } from "../utils.js";
import { defaultConfig } from "../constants.js";
import { existsSync } from "fs";
import { join } from "path";
import { LoadError } from "../utils/errors.js";
import { PluginManager } from "./Plugins.js";

export class Config {
  static #path = "serdruial.config.js";
  static #config = {};
  static isLoad = false;

  constructor() {}

  static createDefault() {
    if (!existsSync(this.getPath())) {
      console.log("Creating default config file at", this.getPath());
      copyFile(__dirname + "/serdruial.config.js", this.getPath());
    }
  }

  static async load(config) {
    if (typeof config === "string" && config.length > 0) {
      config = this.#loadFromFile(config);
    } else if (typeof config === "undefined") {
      config = await this.#loadFromFile(this.getPath());
    }
    if (!isObject(config)) {
      throw new Error("Config must be an object");
    }
    this.#config = this.#validate(config);
    this.isLoad = true;
  }

  static async #loadFromFile(path) {
    try {
      if (path.endsWith(".js")) {
        const { Config } = await import(`file://${path}`);
        if (!Config || !isObject(Config)) {
          throw new LoadError("Failed to load config from JS file");
        }
        return Config;
      }
      if (!path.endsWith(".json")) {
        throw new TypeError("Config file must be a JSON or JS file");
      }
      const data = await readFile(path, "utf8");
      if (typeof data !== "string") {
        throw new LoadError("Config file not found!");
      }
      return JSON.parse(data);
    } catch (error) {
      throw new LoadError(
        `Failed to load config from ${path}: ${error.message}`
      );
    }
  }

  static async save(config) {
    config = defaults(config, defaultConfig);
    try {
      writeFile(
        this.getPath(),
        `import {Config} from "serdruialjs";\n\nConfig.load(${JSON.stringify(
          config,
          null,
          2
        )})`
      );
    } catch (err) {
      throw new Error(`Failed to save config: ${err.message}`);
    }
  }

  static get() {
    return this.#config;
  }

  static getPath() {
    return join(process.cwd(), this.#path);
  }

  static addPlugin(id) {
    PluginManager.load(id);
  }

  static removePlugin(id) {
    PluginManager.unload(id);
  }

  static listPlugins(id) {
    PluginManager.listLoaded(id);
  }

  static hasPlugin(id) {
    PluginManager.isLoaded(id);
  }

  static #validate(config) {
    config = defaults(config, defaultConfig);
    if (typeof config.board !== "string") {
      throw new TypeError("Invalid Board Option");
    }
    if (typeof config.port !== "string") {
      throw new TypeError("Invalid Port Option");
    }
    if (typeof config.baudRate !== "number" || config.baudRate <= 0) {
      throw new TypeError("Invalid Baud Rate Option");
    }
    if (typeof config.autoOpen !== "boolean") {
      throw new TypeError("Invalid autoOpen Option");
    }
    if (typeof config.packetRetries !== "number" || config.packetRetries < 0) {
      throw new TypeError("Invalid Packet Retries Option");
    }
    if (typeof config.packetTimeout !== "number" || config.packetTimeout < 0) {
      throw new TypeError("Invalid Packet Timeout Option");
    }
    if (typeof config.protocolVersion !== "string") {
      throw new TypeError("Invalid Protocol Version Option");
    }
    if (!isArray(config.plugins)) {
      throw new TypeError("Invalid Plugins Options");
    }
    if (typeof config.reconnect === "boolean") {
      config.reconnect = { enabled: config.reconnect };
    }
    if (!isObject(config.reconnect)) {
      throw new TypeError("Invalid Reconnect Options");
    }
    if (!isObject(config.features)) {
      throw new TypeError("Invalid Features Options");
    }
    if (typeof config.compression === "boolean") {
      config.compression = { enabled: config.compression };
    }
    if (!isObject(config.compression)) {
      throw new Error("Invalid Compression Options");
    }
    if (typeof config.encryption === "boolean") {
      config.encryption = { enabled: config.encryption };
    }
    if (!isObject(config.encryption)) {
      throw new TypeError("Invalid Encryption Options");
    }
    if (typeof config.checksum === "boolean") {
      config.checksum = { enabled: config.checksum };
    }
    if (!isObject(config.checksum)) {
      throw new TypeError("Invalid Checksum Options");
    }

    config = defaults(config, defaultConfig);
    if (
      typeof config.features.multiDevice !== "boolean" ||
      typeof config.features.streaming !== "boolean"
    ) {
      throw new TypeError("Invalid Feature Options");
    }
    if (
      typeof config.reconnect.enabled !== "boolean" ||
      !Number.isInteger(config.reconnect.delay) ||
      !Number.isInteger(config.reconnect.retries)
    ) {
      throw new TypeError("Invalid Reconnect Options");
    }
    if (typeof config.compression.enabled !== "boolean") {
      throw new TypeError("Invalid Compression Options");
    }
    if (
      typeof config.encryption.enabled !== "boolean" ||
      !Number.isInteger(config.encryption.interations) ||
      (config.encryption.enabled &&
        typeof config.checksum.algorithm !== "string")
    ) {
      throw new TypeError("Invalid Encryption Options");
    }
    if (
      typeof config.checksum.enabled !== "boolean" ||
      typeof config.checksum.algorithm !== "string"
    ) {
      throw new TypeError("Invalid Checksum Options");
    }
    return config;
  }
}
