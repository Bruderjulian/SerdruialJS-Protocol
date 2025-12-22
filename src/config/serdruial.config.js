import  {Config} from "./Config.js";

await Config.load({
  board: "Arduino Uno",
  port: "COM1",
  baudRate: 9600,
  autoOpen: true,

  features: {
    multiDevice: true,
    streaming: false,
  },
  plugins: [],

  reconnect: {
    enabled: true,
  },
  compression: {
    enabled: false,
  },
  encryption: {
    enabled: false,
    key: "1234",
    iterations: 100000,
  },
  checksum: {
    enabled: true,
    algorithm: "crc16",
  }
});