import express from "express";
import dotenv from "dotenv";
import http from "http";
import { init, getIo } from "./startup/socket";

dotenv.config();
const app = express();
require("./startup/routes")(app);

const server = http.createServer(app);
const io = init(server);
require("./lib/socketUse")(io);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
