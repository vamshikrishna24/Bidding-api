import Joi from "joi";
import bcrypt from "bcrypt";
import { prisma } from "../startup/db";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { ErrorHandler } from "../lib/error";

export const test = (req: any, res: any) => {
  res.send("working");
};

export const register = async (req: any, res: any) => {
  const { error } = validateUserRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { username, password, email } = req.body;
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) return res.status(400).send("user already registered");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const responseUser = _.pick(user, ["username", "email", "role"]);
    res.status(201).send(responseUser);
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req: any, res: any, next: any) => {
  const { error } = vadilateUser(req.body);
  if (error) return next(ErrorHandler(400, "Enter all details"));
  const { email, password } = req.body;
  try {
    let validUser = await prisma.user.findUnique({ where: { email } });
    if (!validUser) return next(ErrorHandler(404, "User not found"));
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(ErrorHandler(401, "Invalid Creds"));

    const token = jwt.sign(
      {
        id: validUser.id,
        username: validUser.username,
        email: validUser.email,
        role: validUser.role,
      },
      process.env.JWT_SECRET!
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }).send(token);
  } catch (err) {
    console.log(err);
  }
};

function validateUserRegister(user: any) {
  const schema = Joi.object({
    username: Joi.string().min(4).max(50).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(4).required(),
  });
  return schema.validate(user);
}

function vadilateUser(user: any) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
}
