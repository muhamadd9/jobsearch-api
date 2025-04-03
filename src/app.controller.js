import cors from "cors";
import connectDB from "./DB/dbConfig.js";
import globalErrorHandler from "./utils/response/globalErrorHandler.js";
import notFoundError from "./utils/response/notFoundError.js";
import authRouter from "./services/auth/auth.controller.js";
import userRouter from "./services/user/user.controller.js";
import companyRouter from "./services/company/company.controller.js";
import schema from "./services/graphql/graphSchema.js";
import playground from "graphql-playground-middleware-express";
import { createHandler } from "graphql-http/lib/use/express";
import jobRouter from "./services/job/job.controller.js";
const bootstrap = (app, express) => {
  connectDB();

  app.use(express.json());

  app.use("/graphql/playground", playground.default({ endpoint: "/graphql" }));
  app.use("/graphql", createHandler({ schema }));
  app.use(cors());

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);

  app.all("*", notFoundError);

  app.use(globalErrorHandler);
};

export default bootstrap;
