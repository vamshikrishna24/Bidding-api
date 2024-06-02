import { Socket } from "socket.io";

module.exports = function (io: Socket) {
  io.on("connection", (socket) => {
    console.log("a user connected ", socket.id);
  });
};
