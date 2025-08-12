import {isObject, IsArray} from "./utils.js";

export default class BoardData {
  id;
  name;
  pins;
  spec;
  constructor(id, name, version, pins, spec = {}) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.pins = parsePins(pins);
    this.spec = spec;
  }
  
  static create(id, name, version = "1", pins = "", spec = {}) {
      if (isObject(id)) {
          id = obj.id;
          name = obj.name ?? name;
          version = obj.version ?? version;
          pins = obj.pins ?? pins;
          spec = obj.spec ?? spec;
      }
      if (typeof id !== "string" || typeof name !== "string") {
        throw new TypeError("Invalid Name or Id");
      }
      if (typeof version !== "string" ) {
        throw new TypeError("Invalid Version");
      }
      if (typeof pins !== "string") {
        throw new TypeError("Invalid Pins"); 
      }
      if (!isObject(spec) {
        throw new TypeError("Invalid Spec");
      }
      return new BoardData(id, name, version, pins, spec);
  }
  
  static find() {
      
  }
  

  static parsePins() {
    
  }
}