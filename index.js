import * as dotenv from "dotenv";
import express from "express";
import path from "node:path";
import bootstrap from "./src/app.controller.js";
import { runIo } from "./src/modules/socket/socket.controller.js";
dotenv.config({ path: path.resolve("./src/config/.env") });

const app = express();
const port = process.env.PORT || 3000;

bootstrap(app, express);
const httpServer = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
runIo(httpServer);
