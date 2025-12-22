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
    let plugin;
    try {
      plugin = require(id);
      if (!isDefined(plugin)) {
        throw "";
      }
    } catch (e) {
      throw new LoadError("Failed to get Plugin: " + id);
    }
    plugin = PluginBase.validate(plugin);
    this.#loaded[plugin.id] = plugin;
    try {
      if (isArray(plugin.dependencies)) {
        this.#loadMany(plugin.dependencies);
      }
    } catch (e) {
      throw new LoadError("Failed to load dependencies");
    }
    plugin._load();
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
    plugin.unload();
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

  static hasPlugin(id) {
    if (typeof id !== "string" || id.length == 0) {
      return false;
    }
    return hasOwn(this.#loaded, id);
  }

  static isLoaded(id) {
    return this.hasPlugin(id);
  }

  static listLoaded() {
    return Object.keys(this.#loaded);
  }

  static getPlugin(id) {
    if (typeof id !== "string" || id.length === 0) {
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
  version = "1.0";
  description;
  author;
  dependencies;

  #isLoaded;
  constructor(opts = {}) {
    if (!isObject(opts)) {
      throw new TypeError("Invalid Options");
    }
    if (typeof opts.name !== "string" || opts.name.length == 0) {
      throw new TypeError("Invalid Name for Plugin");
    }
    this.name = opts.name;
    if (isDefined(opts.version)) {
      setVersion(opts.version);
    }
    if (isDefined(opts.description)) {
      setDescription(opts.description);
    }
    if (isDefined(opts.author)) {
      setAuthor(opts.author);
    }
    if (isDefined(opts.dependencies)) {
      setDependencies(opts.dependencies);
    }
    if (isDefined(opts.load)) {
      this.load = opts.load;
    }
    if (isDefined(opts.unload)) {
      this.unload = opts.unload;
    }

    if (
      (plg.load && !isFunction(plg.load)) ||
      (plg.unload && !isFunction(plg.unload)) ||
      !isFunction(plg._load) ||
      !isFunction(plg._unload)
    ) {
      throw new SyntaxError("Invalid Plugin Load/Unload Function");
    }
    if (!isFunction(plg.isLoaded)) {
      throw new SyntaxError("Invalid Plugin isLoaded Function");
    }
  }

  setVersion(str) {
    if (typeof str !== "string" || str.length == 0) {
      throw new SyntaxError("Invalid Version for Plugin " + this.name);
    }
    this.version = str;
  }
  setDescription(str) {
    if (typeof str !== "string" || str.length == 0) {
      throw new SyntaxError("Invalid Description for Plugin " + this.name);
    }
    this.description = str;
  }

  setAuthor(str) {
    if (typeof str !== "string" || str.length == 0) {
      throw new SyntaxError("Invalid Author for Plugin " + this.name);
    }
    this.author = str;
  }

  setDependencies(deps) {
    if (typeof deps == "string") {
      deps = [deps];
    }
    if (!isArray(deps)) {
      throw new TypeError("Invalid Dependencies for Plugin " + this.name);
    }
    if (deps.some((v) => typeof v !== "string" || v.length === 0)) {
      throw new SyntaxError("Invalid Dependencies for Plugin " + this.name);
    }
    this.dependencies = deps;
  }

  isLoaded() {
    return this.#isLoaded;
  }

  load() {}

  unload() {}

  _load() {
    this.#isLoaded = true;
    if (isFunction(this.load)) {
      try {
        this.load();
      } catch (e) {
        throw new EvalError("Failed to execute load for Plugin " + this.name);
      }
    }
  }
  _unload() {
    this.#isLoaded = false;
    if (isFunction(this.unload)) {
      try {
        this.unload();
      } catch (e) {
        throw new EvalError("Failed to execute unload for Plugin " + this.name);
      }
    }
  }

  static from(opts) {
    return new PluginBase(opts);
  }

  static validate(plg) {
    if (plg instanceof PluginBase) {
      return plg;
    } else if (isObject(plg)) {
      try {
        return this.from(plg);
      } catch (e) {
        throw new TypeError("Failed to create Plugin from Object! Use PluginBase.from() instead!");
      }
    }
    throw new TypeError("Invalid Plugin");
  }
}
