import cors from "cors";
import connectDB from "./DB/dbConfig.js";
import globalErrorHandler from "./utils/response/globalErrorHandler.js";
import notFoundError from "./utils/response/notFoundError.js";
import authRouter from "./services/auth/auth.controller.js";
import userRouter from "./services/user/user.controller.js";
import companyRouter from "./services/company/company.controller.js";

const bootstrap = (app, express) => {
  connectDB();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors());

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);

  app.all("*", notFoundError);

  app.use(globalErrorHandler);
};

export default bootstrap;
