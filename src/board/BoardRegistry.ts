import {BoardData} from "./BoardData.ts";
import {hasOwn} from "../utils/utils.js";

export class BoardRegistry {
  static count: number = 0;
  static boards: {
    [id: string]: BoardData;
  } = {};

  static add(data: BoardData): void {
    if (!(data instanceof BoardData)) {
      throw new TypeError("Invalid Board Data");
    }
    this.boards[data.id] = data;
    this.count++;
  }

  static get(id: string): BoardData | undefined {
    if (typeof id !== "string" || id.length === 0) {
      return;
    }
    return this.boards[id];
  }

  static getByName(name: string): BoardData | undefined {
    if (typeof name !== "string" || name.length == 0) {
      return;
    }
    return Object.values(this.boards).find((b) => b.name === name);
  }

  static has(id: string): boolean {
    if (typeof id !== "string" || id.length === 0) {
      return false;
    }
    return hasOwn(this.boards, id);
  }

  static remove(id: string): void {
    if (typeof id !== "string" || id.length === 0) {
      return;
    }
    if (!hasOwn(this.boards, id)) {
      return;
    }
    this.count--;
    delete this.boards[id];
  }

  static getIds(): string[] {
    return Object.keys(this.boards);
  }

  static getBoards(): BoardData[] {
    return Object.values(this.boards);
  }
}