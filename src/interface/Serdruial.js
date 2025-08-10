import { Config } from "../config/Config";

export class Serdruial {
  constructor(options) {
    Config.load(options.config);
  }
}