import { Server } from "socket.io";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("The Socket Connected..", socket.id);

    socket.on("message", (data) => {
      console.log("server side msg", data);
      socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
}
