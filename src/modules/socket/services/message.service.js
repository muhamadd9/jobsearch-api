import { create, findOne, findOneAndUpdate } from "../../../DB/dbHelper.js";
import Chat from "../../../DB/model/chatModel.js";
import Company from "../../../DB/model/companyModel.js";
import { socketConnections } from "../../../DB/model/userModel.js";
import authenticate from "../../../middleware/auth.js";

export const sendMessage = (socket) => {
  return socket.on("sendMessage", async (messageData) => {
    const { data, valid } = await authenticate({ socket });
    if (!valid) {
      return socket.emit("socketError", data);
    }
    const userId = data.user._id;
    const { receiverId, message } = messageData;
    if (!receiverId || !message) {
      return socket.emit("socketError", { message: "Receiver ID and message are required" });
    }

    // if chat exists between the two users
    let chat = findOneAndUpdate({
      model: Chat,
      filter: {
        $or: [
          {
            senderId: userId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: userId,
          },
        ],
      },
      data: {
        $push: { messages: { senderId: userId, message } },
      },
      populate: ["senderId", "receiverId"],
    });
    
    // if chat doesn't exist, create a new one
    if (!chat) {
      // only copmany owner or Hr can satrt a chat with the user
      const copmany = await findOne({
        model: Company,
        filter: {
          $or: [{ ownerId: userId }, { HRs: userId }],
        },
      });
      if (!copmany) {
        return socket.emit("socketError", { message: "You are not allowed to start a chat" });
      }
      chat = await create({
        model: Chat,
        data: {
          senderId: userId,
          receiverId,
          messages: [{ senderId: userId, message }],
        },
      });
    }
    socket.emit("message", { message });
    // Emit the message to the receiver
    socket.to(socketConnections.get(receiverId)).emit("recievedMessage", { message });
  });
};
