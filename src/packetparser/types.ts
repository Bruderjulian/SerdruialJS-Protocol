
export type PacketParserOptions = {
  version?: number;
  crcId?: string;
  encrypted?: boolean;
  compressed?: boolean;
};
export type CommandEntry = {
  name: string;
  id: number;
};
export type CommandMap = Record<string, CommandEntry>;
export type IndexedCommandMap = Record<number, string>;

export type Parser = {
  init: (deviceIds: number[]) => Buffer;
  encode: (
    command: string,
    data?: Record<string, any>,
    flags?: PacketFlags
  ) => Buffer;
  decode: (buffer: Buffer) => Packet;
};

export type Packet = {
  startByte: number;
  msgId: number;
  deviceId: number;
  packetInfo: number;
  AckRequested: boolean;
  isResponse: boolean;
  isError: boolean;
  StreamStart: boolean;
  StreamEnd: boolean;
  reserved: number;
  command: number;
  payload: PacketData;
  checksum: Buffer;
  endByte: number;
};

export type PacketFlags = {
  AckRequested?: boolean;
  isResponse?: boolean;
  isError?: boolean;
  StreamStart?: boolean;
  StreamEnd?: boolean;
};

export type Command = {
  name: string;
  deviceId?: number;
  flags?: PacketFlags;
  data?: Record<string, any>;
}

export type PacketData = Record<string, any> | Cmd_Init | Cmd_SingleValue;

export type Cmd_Init= {
  version: number;
  crcId: number;
  deviceIdsAmount: number;
  deviceIds: number[];
}

export type Cmd_SingleValue = {
  value: number;
};