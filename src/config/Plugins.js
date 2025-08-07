import { LoadError } from "../utils/errors.js";
import {
  isObject,
  isArray,
  hasOwn,
  isFunction,
  isDefined,
} from "../utils/utils.js";

export class PluginManager {
  static #loaded = {};

  static load(id) {
    if (isArray(id)) {
      this.#loadMany(ids);
      return;
    }
    if (typeof id !== "string" || id.length === 0) {
      throw new TypeError("Invalid Id");
    }
    try {
      const plugin = require(id);
      if (!isDefined(plugin)) {
        throw "";
      }
    } catch (e) {
      throw new LoadError("Failed to get Plugin: " + id);
    }
    PluginBase.validate(plugin);
    this.#loaded[plugin.id] = plugin;
    try {
      if (isArray(plugin.dependencies)) {
        this.#loadMany(plugin.dependencies);
      }
    } catch (e) {
      throw new LoadError("Failed to load dependencies");
    }
    try {
      if (isFunction(plugin.load)) {
        plugin.load();
      }
    } catch (e) {
      throw new LoadError("Failed to load plugin: " + err);
    }
  }

  static #loadMany(ids) {
    for (let i = 0; i < ids.length; i++) {
      this.#loadMany(ids[i]);
    }
  }

  static unload(id) {
    if (isArray(id)) {
      this.#unloadMany(ids);
      return;
    }
    if (typeof id !== "string" || id.length === 0) {
      throw new TypeError("Invalid Id");
    }
    if (!hasOwn(this.#loaded, id)) {
      return;
    }
    const plugin = this.#loaded[id];
    try {
      if (isArray(plugin.dependencies)) {
        this.#unloadMany(plugin.dependencies);
      }
    } catch (e) {
      throw new LoadError("Failed to unload plugin dependencies");
    }
    try {
      if (isFunction(plugin.unload)) {
        plugin.unload();
      }
    } catch (e) {
      throw new LoadError("Failed to unload plugin: " + err);
    }
    delete this.#loaded[id];
  }

  static #unloadMany(ids) {
    for (let i = 0; i < ids.length; i++) {
      this.#unloadMany(ids[i]);
    }
  }

  static unloadAll() {
    for (const id of Object.keys(this.#loaded)) {
      this.unload(id);
    }
  }

  static isLoaded(id) {
    if (typeof id !== "string" || id.length === 0) {
      throw new TypeError("Invalid Id");
    }
    return hasOwn(this.#loaded, id);
  }

  static listLoaded() {
    return Object.keys(this.#loaded);
  }

  static getPlugin(id) {
    if (typeof id !== "string" || id.length === 0) {
      throw new TypeError("Invalid Id");
    }
    if (!hasOwn(this.#loaded, id)) {
      return null;
    }
    return this.#loaded[id];
  }

  static getPlugins() {
    return this.#loaded;
  }
}

export class PluginBase {
  name;
  version;
  description;
  author;
  dependencies;

  #isLoaded;
  constructor(opts = {}) {
    if (!isObject(opts)) {
      throw new TypeError("Invalid Options");
    }
    this.name = opts.name;
    this.version = opts.version;
    this.description = opts.description;
    this.author = opts.author;
    this.dependencies = opts.dependencies;
    PluginBase.validate(this);
  }

  isLoaded() {
    return this.#isLoaded;
  }

  load() {
    this.#isLoaded = true;
  }
  unload() {
    this.#isLoaded = false;
  }

  static validate(plg) {
    if (
      !(plg instanceof PluginBase) ||
      typeof plg.name !== "string" ||
      plg.name.length === 0 ||
      typeof plg.version !== "string" ||
      plg.version.length === 0 ||
      (isDefined(plg.description) && typeof plg.description !== "string") ||
      (isDefined(plg.author) && typeof plg.author !== "string")
    ) {
      throw new SyntaxError("Invalid Plugin Base");
    }
    if (
      isDefined(plg.dependencies) &&
      (!isArray(plg.dependencies) ||
        plg.dependencies.some((v) => typeof v !== "string" || v.length === 0))
    ) {
      throw new SyntaxError("Invalid Plugin Dependencies");
    }
    if (
      (plg.load && !isFunction(plg.load)) ||
      (plg.unload && !isFunction(plg.unload))
    ) {
      throw new SyntaxError("Invalid Plugin Load/Unload Function");
    }
    if (!isFunction(plg.isLoaded)) {
      throw new SyntaxError("Invalid Plugin isLoaded Function");
    }
  }
}
