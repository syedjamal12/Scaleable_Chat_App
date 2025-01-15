import { error } from "console";
import { Server, Socket } from "socket.io";

interface customSocket extends Socket {
  room? : string
}

export function setupSocket(io: Server) {

  io.use((socket:customSocket,next)=>{
    const room = socket.handshake.auth.room || socket.handshake.headers.room
    if(!room){
      return next(new error("Invalid room"))
    }
    socket.room = room
    next()
  })

  io.on("connection", (socket:customSocket) => {
  
    socket.join(socket.room);

    socket.on("message", (data) => {
      console.log("server side msg", data);
      // socket.broadcast.emit("message", data);
      io.to(socket.room).emit("message",data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
}
