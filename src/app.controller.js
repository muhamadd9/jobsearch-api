import cors from "cors";
import connectDB from "./DB/dbConfig.js";
import globalErrorHandler from "./utils/response/globalErrorHandler.js";
import notFoundError from "./utils/response/notFoundError.js";
import authRouter from "./services/auth/auth.controller.js";

const bootstrap = (app, express) => {
  connectDB();

  app.use(express.json());
  app.use(cors());

  app.use("/auth", authRouter);

  app.all("*", notFoundError);

  app.use(globalErrorHandler);
};

export default bootstrap;
