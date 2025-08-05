# SerdruialJS-Protocol

The Protocol for the SerdruialJS Project

## Dependencies

- polycrc / js-crc
- binary-parser-encoder-bump
- serialport (
  - serialport-manager, 
  - port-watch/serialharbor, 
  - yaspm
  - faster-serialport)

Keep in mind:
- firmata.js/firmata-arduino
- fffaraz/awesome-cpp/Serial


## Binary Message Protocol

This binary message format is designed to reliably communicate with 
one or more Arduino boards over serial or similar byte streams. 
It supports device/group addressing, streaming, fragmentation, 
commands, and CRC-based validation.

### Key Features

- Supports device/group addressing with shared IDs
- Broadcasts via `0xFF` device ID
- Stream fragmentation with start/end indicators
- Compact & efficient (minimum 9 bytes)
- Extendable flags field
- CRC-16 integrity check for reliability

---

### Message Format

| Field          | Size (bytes) | Description                                     |
| -------------- | ------------ | ----------------------------------------------- |
| Start Byte     | 1            | Fixed value `0xAA` to mark the beginning        |
| Msg ID         | 1            | Message identifier                              |
| Device ID      | 1            | Target device                                   |
| Packet Info    | 1            | Fragmentation info (total & current packet)     |
| Flags          | 1            | Control flags                                   |
| Command        | 1            | 1-byte command identifier                       |
| Payload Length | 1            | Length of the payload in bytes (0–255)          |
| Payload        | 0–255        | Variable-length payload                         |
| CRC-16         | 2            | CRC-16                                          |
| End Byte       | 1            | fixed value `0x55` to mark the end of a message |

---

### Field Details

#### Start Byte

- Fixed `0xAA`
- Indicates the start of a new message

#### Msg ID

- 1 byte
- Upwards Counting ID to track or acknowledge messages

#### Device ID

- 1 byte
- Each board can be assigned **multiple Device IDs** (grouping supported)
- `0xFF` targets **all boards** (broadcast)

#### Packet Info

- 4 high bits: total number of packets (`1–15`)
- 4 low bits: current packet number (`1–15`)
- For single-packet messages: `0x11`

#### Flags (Bitfield)

| Bit | Name          | Description                        |
| --- | ------------- | ---------------------------------- |
| 0   | ACK Required  | Set if receiver should acknowledge |
| 1   | Is Response   | This is a response message         |
| 2   | High Priority | Higher priority in queue/handling  |
| 3   | Error         | This message indicates an error    |
| 4   | Stream Start  | First packet of a stream           |
| 5   | Stream End    | Last packet of a stream            |
| 6–7 | Reserved      | For future use                     |

#### Command

- 1-byte command identifier

#### Payload Length & Payload

- Up to 255 bytes
- Structure is defined by the specific command

#### CRC-16

- 2 bytes (16 bits)
- Calculated over all bytes **from Msg ID through the end of the Payload**

#### End Byte

- Fixed `0x55`
- Indicates the end of a message

---

## 🔄 Notes

- Every board should maintain a list of assigned Device IDs.
- Messages with unknown commands or unmatched device IDs should be ignored.
- CRC errors must be handled gracefully (e.g. discard or request retransmit).
