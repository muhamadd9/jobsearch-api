import catchAsync from "../response/catchAsync.js";
import nodemailer from "nodemailer";
export const sendEmail = catchAsync(async ({ to = "", subject = "", text = "", html = "" }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Job Search App 👻" <jobsearch@gmail.com>',
    to,
    subject,
    text,
    html,
  });
  return info;
});
