
export default class BoardData {
  id;
  name;
  pins;
  spec;
  constructor(id, name, pins, spec = {}) {
    this.id = id;
    this.name = name;
    this.pins = parsePins(pins);
    this.spec = spec;
  }

  static parsePins() {
    
  }
}