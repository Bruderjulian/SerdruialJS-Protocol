
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

  static parsePins() {
    
  }
}