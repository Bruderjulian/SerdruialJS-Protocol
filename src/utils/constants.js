export const ENCRYPTION_ALGORITHM = "aes-256-cbc";
export const ENCRYPTION_HASH_ALGO = "sha256";
export const ENCRYPTION_ITERATIONS = 100000;
export const ENCRYPTION_KEY_LENGTH = 32; // 256 bits
export const ENCRYPTION_IV_LENGTH = 16; // 128 bits

export const STARTBYTE = 0xaa;
export const ENDBYTE = 0xee;
export const DEFAULT_CRC = "crc16";
export const CRC_SIZE = ENCRYPTION_KEY_LENGTH + ENCRYPTION_IV_LENGTH;

export const exitEvents = ["exit", "SIGINT", "SIGTERM", "SIGQUIT"];

export const PROTOCOL_VERSIONS = {
  V1: 1,
  LATEST: 1,
};

export const defaultOptions = {
  version: PROTOCOL_VERSIONS.LATEST,
  crcId: DEFAULT_CRC,
  encrypted: false,
  compressed: false,
};

export const defaultConfig = {
  baudRate: 9600,
  autoOpen: true,
  packetRetries: 3,
  packetTimeout: 1000,
  reconnect: {
    enabled: true,
    maxRetries: 5,
    delay: 2000,
  },
  plugins: [],
  protocolVersion: "1.0.0",
  features: {
    multiDevice: true,
    streaming: true,
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
  },
};

export const commandMap = {
  init: { name: "cmd_init", id: 0x01 },
  pinMode: { name: "cmd_singleValue", id: 0x02 },
  digitalWrite: { name: "cmd_singleValue", id: 0x03 },
  digitalRead: { name: "cmd_singleValue", id: 0x04 },
  analogWrite: { name: "cmd_singleValue", id: 0x05 },
  analogRead: { name: "cmd_singleValue", id: 0x06 },
};

// create a obj with the id as key and the name as value
export const indexedCommandMap = Object.fromEntries(
  Object.entries(commandMap).map(([key, value]) => [value.id, value.name])
);

export const baudRates = {
    $300: 300,
    $1200: 1200,
    $2400: 2400,
    $4800: 4800,
    $9600: 9600,
    $19200: 19200,
    $38400: 38400,
    $57600: 57600,
    $115200: 115200,
  };
export const pinTypes = {
    digital: "D",
    analog: "A",
    pwm: "D",
  };
export const pinModes = { Output: "output", Input: "input" };