import { EventEmitter } from "node:events";
import { generateOTP } from "../security/otp.js";
import { sendEmail } from "./sendEmail.js";
import { findOneAndUpdate } from "../../DB/dbHelper.js";
import User from "../../DB/model/userModel.js";
import { otpType } from "../constants/userConstants.js";
import { encrypt } from "../security/encryption.js";

const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async (data) => {
  const { email } = data;
  const otp = generateOTP();
  await sendEmail({
    to: email,
    subject: "Confirm Email",
    html: `<h1>OTP: ${otp}</h1>`,
  });

  await findOneAndUpdate({
    model: User,
    filter: { email },
    data: {
      $push: {
        OTP: {
          code: encrypt({ plaintext: otp }),
          otptype: otpType.confirmEmail,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
    },
  });
});

emailEvent.on("sendForgetPassword", async (data) => {
  const { email } = data;
  const otp = generateOTP();
  await sendEmail({
    to: email,
    subject: "Forget Password",
    html: `<h1>OTP: ${otp}</h1>`,
  });

  await findOneAndUpdate({
    model: User,
    filter: { email },
    data: {
      $push: {
        OTP: {
          code: encrypt({ plaintext: otp }),
          otptype: otpType.forgetPassword,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
    },
  });
});

emailEvent.on("sendApplicationStatus", async (data) => {
  const { email, status, jobTitle } = data;
  await sendEmail({
    to: email,
    subject: "Application Status",
    html: `<h1>Your application to ${jobTitle} has been ${status}.</h1>`,
  });
});

export default emailEvent;
