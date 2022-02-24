import express from "express";
import { Request, Response, NextFunction } from "express";
import { Menus, Restaurants } from "../models";

const router = express.Router();

router.post(
  "/restaurant",
  async (req: Request, res: Response, next: NextFunction) => {
    const { star, restaurantId } = req.body;
    const updatedRatings = await Restaurants.findOneAndUpdate(
      {
        _id: restaurantId,
      },
      {
        $push: {
          ratingRecord: star,
        },
      },
      {
        new: true,
      }
    );
    global.io.emit("rated-restaurant", updatedRatings);
    res.send(updatedRatings);
  }
);

router.post(
  "/food",
  async (req: Request, res: Response, next: NextFunction) => {
    const { foodId, star, menuId } = req.body;

    const updatedRatings = await Menus.updateOne(
      {
        _id: menuId,
        "item._id": foodId,
      },
      {
        $push: {
          "item.$.ratingRecord": star,
        },
      },
      {
        new: true,
      }
    );
    global.io.emit("rated-food", Date.now());

    res.send(updatedRatings);
  }
);

export default router;
