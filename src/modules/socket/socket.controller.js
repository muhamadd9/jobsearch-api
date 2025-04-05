import { Server } from "socket.io";
import { logOut, registerSocket } from "./services/auth.service.js";
import { sendMessage } from "./services/message.service.js";

let io = null;
export const runIo = (httpServer) => {
  io = new Server(httpServer, { cors: "*" });

  io.on("connection", async (socket) => {
    await registerSocket(socket);

    await sendMessage(socket);
    await logOut(socket);
  });
};
export { io };
