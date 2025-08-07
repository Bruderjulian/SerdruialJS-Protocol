import  {Config} from "./Config.js";
import {PluginManager} from "./Plugins.js";

Config.load({
  board: "Arduino Uno",
  port: "COM1",
  baudRate: 9600,
  autoOpen: true,

  protocolVersion: "1.0.0",
  features: {
    multiDevice: true,
    streaming: true,
  },
  plugins: [""],

  packetRetries: 3,
  packetTimeout: 1000,
  reconnect: {
    enabled: true,
    maxRetries: 5,
    delay: 2000,
  },

  compression: {
    enabled: true,
  },
  encryption: {
    enabled: true,
    key: "1234",
    iterations: 100000,
  },
  checksum: {
    enabled: true,
    algorithm: "crc16",
  }

});