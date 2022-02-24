import express from "express";
import { Request, Response, NextFunction } from "express";
import { Menus } from "../models";

const router = express.Router();

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  const { foodItems, restaurantId } = req.body;
  const updatedMenu = await Menus.findOneAndUpdate(
    {
      restaurant: restaurantId,
    },
    {
      $push: { item: foodItems },
    },
    {
      upsert: true,
      new: true,
    }
  );
  global.io.emit("updated-menu", Date.now());
  res.send(updatedMenu);
});

router.put(
  "/update",
  async (req: Request, res: Response, next: NextFunction) => {
    const { foodItems, restaurantId } = req.body;
    const updatedMenu = await Menus.findOneAndUpdate(
      {
        restaurant: restaurantId,
      },
      {
        $set: { item: foodItems },
      }
    );

    res.send(updatedMenu);
  }
);

router.delete(
  "/remove",
  async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId, foodItems } = req.body;
    const updatedMenu = await Menus.updateOne(
      {
        restaurant: restaurantId,
      },
      {
        $pull: {
          item: {
            _id: {
              $in: foodItems,
            },
          },
        },
      },
      {
        new: true,
      }
    );

    res.send(updatedMenu);
  }
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const menus = await Menus.find();

  res.send(menus);
});

export default router;
