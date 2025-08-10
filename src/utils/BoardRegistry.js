import BoardData from "./BoardData.js";
import {hasOwn} from "./utils.js";

export const boards = {};

export class BoardRegistry {
  ids = [];
  names = [];
  count = 0;

  constructor() {
    this.#update();
  }

  add(data) {
    if (!(data instanceof BoardData)) {
      throw new TypeError("Invalid Board Data Type");
    }
    boards[data.id] = data;
    this.ids.push(data.id);
    this.names.push(data.name);
    this.count++;
  }

  get(id) {
    if (typeof id !== "string" || id.length === 0) {
      throw new TypeError("Invalid Id");
    }
    if (!hasOwn(boards, id)) {
      return null;
    }
    return boards[id];
  }

  has(id) {
    if (typeof id !== "string" || id.length === 0) {
      throw new TypeError("Invalid Id");
    }
    return hasOwn(boards, id);
  }

  remove(id) {
    if (typeof id !== "string" || id.length === 0) {
      throw new TypeError("Invalid Id");
    }
    if (!hasOwn(boards, id)) {
      return;
    }
    let idx = this.ids.indexOf(id);
    this.ids.splice(idx, 1);
    this.count--;
    delete boards[id];
  }

  list() {
    return this.ids;
  }

  #update() {
    this.ids = Object.keys(boards);
    this.names = Object.values(boards).map((v) => v.id);
    this.count = this.ids.length;
  }
}
const defaultRegistry = new BoardRegistry();
export default defaultRegistry;