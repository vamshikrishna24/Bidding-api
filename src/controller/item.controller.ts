import Joi from "joi";
import { ErrorHandler } from "../lib/error";
import { prisma } from "../startup/db";
import { Item } from "@prisma/client";

export const getItems = async (req: any, res: any, next: any) => {
  try {
    const items = await prisma.item.findMany();
    return res.status(200).send(items);
  } catch (err) {
    next(err);
  }
};

export const getItemsById = async (req: any, res: any, next: any) => {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: Number.parseInt(req.params.id),
      },
    });
    if (!item) return next(ErrorHandler(404, "Item not found"));
    res.status(200).send(item);
  } catch (err) {
    next(err);
  }
};

export const postItem = async (req: any, res: any, next: any) => {
  const { error } = validateItem(req.body);
  if (error) return next(ErrorHandler(400, "Enter all details of items"));
  const { starting_price, end_time } = req.body;
  try {
    let item = await prisma.item.create({
      data: {
        ...req.body,
        end_time: new Date(end_time),
        current_price: starting_price,
        userId: req.user.id,
      },
    });
    res.status(201).send(item);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req: any, res: any, next: any) => {
  const userId = req.user.id;
  try {
    let item = await prisma.item.findUnique({
      where: {
        id: Number.parseInt(req.params.id),
      },
    });
    if (!item) return next(ErrorHandler(404, "Item not found"));

    if (item.userId !== userId)
      return next(ErrorHandler(403, "User dont own this item"));

    const { error } = validateItemUpdate(req.body);
    if (error) return next(ErrorHandler(400, error.details[0].message));

    let updateData = { ...req.body };
    if (updateData.end_time)
      updateData.end_time = new Date(updateData.end_time);
    if (updateData.starting_price)
      updateData.starting_price = Number(updateData.starting_price);
    if (updateData.current_price)
      updateData.current_price = Number(updateData.current_price);

    const itemUpdate = await prisma.item.update({
      where: {
        id: item.id,
      },
      data: {
        ...updateData,
      },
    });
    res.status(200).send(itemUpdate);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req: any, res: any, next: any) => {
  const userId = Number(req.user.id);
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!item) return next(ErrorHandler(404, "Item not found"));
    if (item.userId !== userId)
      return next(ErrorHandler(403, "You don't own this item to delete"));
    let deletedItem = await prisma.item.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).send(deletedItem);
  } catch (err) {
    next(err);
  }
};

function validateItem(item: Item) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    starting_price: Joi.number().required(),
    end_time: Joi.date().required(),
    image_url: Joi.string(),
  });
  return schema.validate(item);
}

function validateItemUpdate(item: Item) {
  const schema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    starting_price: Joi.number().optional(),
    current_price: Joi.number().optional(),
    end_time: Joi.date().optional(),
    image_url: Joi.string().optional(),
  });
  return schema.validate(item);
}
