import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/user.route";

module.exports = function (app: any) {
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use("/user", userRouter);
};
