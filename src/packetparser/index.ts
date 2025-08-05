import { Parser as BinaryParser } from "binary-parser-encoder-bump";
import { Command, Packet, PacketData, PacketFlags, PacketParserOptions } from "./types";
import {
  commandMap,
  PROTOCOL_VERSIONS,
  defaultOptions,
  STARTBYTE,
  ENDBYTE,
  indexedCommandMap,
} from "../constants";
import { createParser } from "./parsers";
import {
  isObject,
  hasOwn,
  validByte,
  validVersion,
  isArray,
  defaults,
  getCrcId,
  getCrcImpl,
} from "../utils";

class PacketParser {
  #version: number;
  #crcId: number;
  #crcImpl: Function;

  #msgId: number = 0;
  #parser: BinaryParser;
  constructor(options: PacketParserOptions) {
    const opts = defaults(
      options,
      defaultOptions
    ) as Required<PacketParserOptions>;
    this.#version = opts.version;
    if (!validVersion(this.#version)) {
      throw new Error(`Unsupported protocol version: ${this.#version}`);
    }
    this.#crcId = getCrcId(opts.crcId);
    this.#crcImpl = getCrcImpl(this.#crcId);
    this.#parser = createParser(this.#crcId);
  }

  init(deviceIds: number[]): Buffer {
    if (!isArray(deviceIds)) {
      throw new TypeError("Device IDs must be an array");
    }
    !deviceIds.every((id) => {
      if (!validByte(id)) {
        throw new TypeError("Device ID '" + id + "' must be a valid byte!");
      }
    });

    return this.encode("init", {
      version: this.#version,
      crcId: this.#crcId / 8,
      deviceIdsAmount: deviceIds.length,
      deviceIds,
    });
  }

  serialize(obj: Command): any {
    return this.encode(obj.name, obj.data, obj.deviceId, obj.flags);
  }

  deserialize(buffer: Buffer): Command {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("Buffer is required");
    }
    const packet = this.decode(buffer);
    const commandName = indexedCommandMap[packet.command];
    if (!commandName) {
      throw new Error(`Unknown command ID: ${packet.command}`);
    }
    return {
      name: commandName,
      data: packet.payload,
      deviceId: packet.deviceId,
      flags: {
        AckRequested: packet.AckRequested,
        isResponse: packet.isResponse,
        isError: packet.isError,
        StreamStart: packet.StreamStart,
        StreamEnd: packet.StreamEnd,
      },
    };
  }

  encode(
    command: string,
    data?: PacketData,
    deviceId?: number,
    flags?: PacketFlags
  ): Buffer {
    if (typeof command !== "string" || !hasOwn(commandMap, command)) {
      throw new TypeError("Invalid command");
    }
    deviceId = deviceId || 0;
    if (!validByte(deviceId)) {
      throw new TypeError("Device ID must be a valid byte");
    }
    data = data || {};
    flags = flags || {};
    if (!isObject(data)) {
      throw new TypeError("Data must be an object");
    }
    if (!isObject(flags)) {
      throw new TypeError("Flags must be an object");
    }
    const packet = this.#getPacket(command, data, deviceId, flags);
    return this.#postEncode(this.#parser.encode(packet));
  }

  decode(buffer: Buffer): Packet {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("Buffer is required");
    }
    return this.#parser.parse(buffer);
  }

  #getPacket(
    command: string,
    data: PacketData,
    deviceId: number,
    flags: PacketFlags
  ): Packet {
    const cmdData = commandMap[command];
    if (this.#msgId >= 0xfc) this.#msgId = 0;
    if (deviceId >= 0xfc) deviceId -= 3;
    if (cmdData.id >= 0xfc) cmdData.id = 0;

    const packet = {
      startByte: STARTBYTE,
      msgId: this.#msgId++,
      deviceId: deviceId || 0,
      packetInfo: 0,
      AckRequested: flags.AckRequested || false,
      isResponse: flags.isResponse || false,
      isError: flags.isError || false,
      StreamStart: flags.StreamStart || false,
      StreamEnd: flags.StreamEnd || false,
      reserved: 0,
      command: cmdData.id,
      payload: data,
      checksum: Buffer.alloc(this.#crcId / 8),
      endByte: ENDBYTE,
    };
    return packet;
  }

  #postEncode(buffer: Buffer): Buffer {
    const checksum = this.#crcImpl(buffer);
    buffer.set(checksum, buffer.length - 3);
    return buffer;
  }
}

export { PacketParser, PROTOCOL_VERSIONS };