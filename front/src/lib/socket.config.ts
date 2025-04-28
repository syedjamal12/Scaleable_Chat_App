import { io, Socket } from "socket.io-client";
import Env from "./env";

let socket: Socket;

export const getSocket = (userId: string): Socket => {
    console.log("getsocket useriddddd from sidebar",userId)
  if (!socket) {
    socket = io(Env.BACKEND_URL, {
      autoConnect: false,
      auth: { userId },
    });
  }
  return socket;
};
