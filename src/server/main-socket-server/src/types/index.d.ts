import { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
  username: string;
  room: string;
}

export type ChatMessage = {
  username: string;
  msg: string;
};
