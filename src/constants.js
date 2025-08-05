export const ENCRYPTION_ALGORITHM = "aes-256-cbc";
export const ENCRYPTION_HASH_ALGO = "sha256";
export const ENCRYPTION_ITERATIONS = 100000;
export const ENCRYPTION_KEY_LENGTH = 32; // 256 bits
export const ENCRYPTION_IV_LENGTH = 16; // 128 bits

export const STARTBYTE = 0xAA;
export const ENDBYTE = 0xEE;
export const DEFAULT_CRC = "crc16";
export const CRC_SIZE = ENCRYPTION_KEY_LENGTH + ENCRYPTION_IV_LENGTH;

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

export const defaultConfig = {};

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
