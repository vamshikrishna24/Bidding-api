import jwt from "jsonwebtoken";
import { ErrorHandler } from "./error";

export const verifyUser = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return next(ErrorHandler(401, "Token is not valid"));
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return next(ErrorHandler(401, "Token is not valid"));
    req.user = user;
    next();
  });
};
