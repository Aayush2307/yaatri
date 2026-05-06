export type MeeraMessageRole = 'user' | 'assistant';

export interface MeeraMessage {
  id: string;
  role: MeeraMessageRole;
  text: string;
  streaming?: boolean;
}

export interface MeeraError {
  code: 'rate_limit' | 'timeout' | 'server_error' | 'network' | 'unauthorized';
  message?: string;
}

export interface MeeraSSEToken {
  type: 'token';
  text: string;
}

export interface MeeraSSEDone {
  type: 'done';
}

export interface MeeraSSEError {
  type: 'error';
  code: MeeraError['code'];
  message?: string;
}

export type MeeraSSEEvent = MeeraSSEToken | MeeraSSEDone | MeeraSSEError;
