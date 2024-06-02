import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/user.route";
import itemRouter from "../routes/item.route";
import bidRouter from "../routes/bid.route";
import notificationRouter from "../routes/notification.route";

module.exports = function (app: any) {
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use("/users", userRouter);
  app.use("/items", itemRouter);
  app.use("/items", bidRouter);
  app.use("/notifications", notificationRouter);

  app.use((err: any, req: any, res: any, next: any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
      statusCode,
      message,
    });
  });
};
