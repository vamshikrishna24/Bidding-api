import { ErrorHandler } from "../lib/error";
import { prisma } from "../startup/db";
import { getIo } from "../startup/socket";

export const getBidsOnItem = async (req: any, res: any, next: any) => {
  const itemId = Number(req.params.itemId);
  try {
    const bids = await prisma.bid.findMany({
      where: { item_id: itemId },
    });

    if (!bids) return next(ErrorHandler(404, "Bid for Item not found"));
    return res.status(200).send(bids);
  } catch (err) {
    next(err);
  }
};

export const placeBidOnItem = async (req: any, res: any, next: any) => {
  const { bid_amount } = req.body;
  const itemId = Number(req.params.itemId);
  const userId = Number(req.user.id);
  try {
    const bid = await prisma.bid.create({
      data: {
        item_id: itemId,
        user_id: userId,
        bid_amount: Number(bid_amount),
      },
    });

    await prisma.notification.create({
      data: {
        user_id: userId,
        message: `new Bid added for item with ID = ${itemId}`,
      },
    });
    res.status(201).send(bid);
  } catch (err) {
    next(err);
  }
};
