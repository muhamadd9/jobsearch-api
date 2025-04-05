import { socketConnections } from "../../../DB/model/userModel.js";
import authenticate from "../../../middleware/socket/auth.js";

export const registerSocket = async (socket) => {
  const { data, valid } = await authenticate({ socket });
  if (!valid) {
    return socket.emit("socketError", data);
  }
  socketConnections.set(data.user._id.toString(), socket.id);
};

export const logOut = async (socket) => {
  return socket.on("disconnect", async () => {
    const { data, valid } = await authenticate({ socket });
    if (!valid) {
      return socket.emit("socketError", data);
    }
    socketConnections.delete(data.user._id);
    return socket.emit("message", { message: "Logged out successfully" });
  });
};
