import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    messages: [
      {
        message: {
          type: String,
          required: [true, "Message is required"],
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Sender is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
