import { Parser } from "binary-parser-encoder-bump";
import { STARTBYTE, ENDBYTE, indexedCommandMap } from "../constants.ts";

Parser.start()
  .namely("cmd_init")
  .endianess("little")
  .bit4("version")
  .bit4("crcId")
  .uint8("deviceIdsAmount")
  .array("deviceIds", {
    type: "uint8",
    length: "deviceIdsAmount",
  });

Parser.start().namely("cmd_singleValue").endianess("little").uint8("value");

export function createParser(crcId: number): Parser {
  return new Parser()
    .namely("self")
    .endianess("little")
    .uint8("startByte", { assert: STARTBYTE })
    .uint8("msgId")
    .uint8("deviceId")
    .uint8("packetInfo")
    .bit1("AckRequested")
    .bit1("isResponse")
    .bit1("isError")
    .bit1("StreamStart")
    .bit1("StreamEnd")
    .bit3("reserved")
    .uint8("command")
    .choice("payload", {
      tag: "command",
      choices: indexedCommandMap,
      //defaultChoice: "cmd_init",
    })
    .buffer("checksum", {
      assert: function (c: number | string): boolean {
        console.log("CK CRC:", c);
        return true;
      },
      length: crcId,
    })
    .uint8("endByte", { assert: ENDBYTE });
}
