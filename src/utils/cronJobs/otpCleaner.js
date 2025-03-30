import cron from "node-cron";
import User from "../../DB/model/userModel.js";
import { updateMany } from "../../DB/dbHelper.js";

const clearExpiredOTPs = async () => {
  try {
    console.log(" Running CRON job to remove expired OTPs...");

    const updatedUsers = await updateMany({
      model: User,
      filter: { "OTP.expiresIn": { $lt: new Date() } },
      data: { $pull: { OTP: { expiresIn: { $lt: new Date() } } } },
    });

    console.log(`Expired OTPs removed from ${updatedUsers.modifiedCount} users.`);
  } catch (error) {
    console.error("Error clearing expired OTPs:", error);
  }
};

cron.schedule("0 */6 * * *", () => {
  clearExpiredOTPs();
});

export default clearExpiredOTPs;
