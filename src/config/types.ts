export type ConfigOptions = {
  board?: string;
  port?: string;
  baudRate?: number;
  autoOpen?: boolean;

  protocolVersion?: string;
  features?: {
    multiPacket?: boolean;
    multiDevice?: boolean;
  };
  plugins?: any[];

  reconnect?: boolean | {
    enabled?: boolean;
    delay?: number;
    retries?: number;
  };
  packetTimeout?: number;
  packetRetries?: number;

  compression?: boolean | {
    enabled?: boolean;
  };
  encryption?: boolean | {
    enabled?: boolean;
    key?: string;
    iterations?: number;
  };
  checksum?: boolean | {
    enabled?: boolean;
    algorithm?: string;
  };
};

export interface PluginBaseOptions {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
}

export interface PluginBase {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  isLoaded(): boolean;
  load(): void;
  unload(): void;
}