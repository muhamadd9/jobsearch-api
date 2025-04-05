import { findOne } from "../../DB/dbHelper.js";
import Chat from "../../DB/model/chatModel.js";
import catchAsync from "../../utils/response/catchAsync.js";
import ErrorResponse from "../../utils/response/errorResponse.js";
import { successResponse } from "../../utils/response/successResponse.js";

export const getChat = catchAsync(async (req, res, next) => {
  const { id: userId } = req.params;

  const chat = await findOne({
    model: Chat,
    filter: {
      $or: [
        {
          senderId: userId,
          receiverId: req.user._id,
        },
        {
          senderId: req.user._id,
          receiverId: userId,
        },
      ],
    },
    populate: ["senderId", "receiverId"],
  });
  if (!chat) {
    return next(new ErrorResponse("Chat not found", 404));
  }
  return successResponse({
    res,
    message: "Chat retrieved successfully",
    data: chat,
  });
});
