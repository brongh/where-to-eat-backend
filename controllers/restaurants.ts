import express from "express";
import { Request, Response, NextFunction } from "express";
import { addressDetails, IRestaurants } from "../interfaces";
import { Menus, Restaurants } from "../models";
import { CustomError } from "../models/custom-error";
import { codeToGeo, getPaginator } from "../utils";

const router = express.Router();

router.post("/new", async (req: Request, res: Response, next: NextFunction) => {
  const { address, name, contactNumber } = req.body;

  const result = await codeToGeo(address.postalCode);

  const coordinates: number[] = [result.longitude, result.latitude];

  const updatedAddress: addressDetails = {
    ...address,
    location: {
      coordinates,
    },
  };

  const newRestaurantData: IRestaurants = {
    name,
    contactNumber,
    address: updatedAddress,
  };

  const updateRestaurantDetails = await Restaurants.create(newRestaurantData);
  global.io.emit("restaurant-created", updateRestaurantDetails);
  res.send(updateRestaurantDetails);
});

router.put("/edit", async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.body;

  const updateRest = await Restaurants.findByIdAndUpdate({ _id }, req.body, {
    new: true,
  });
  global.io.emit("restaurant-updated", updateRest);
  res.send(updateRest);
});

router.get(
  "/close",
  async (req: Request, res: Response, next: NextFunction) => {
    const { postalcode, lon, lat, search } = req.query;
    console.log(lon, lat);

    if (!postalcode && !lon && !lat) {
      throw new CustomError("Invalid Parameters");
    }
    if (!postalcode && lon && lat) {
      const [long, lati] = [
        parseFloat(lon as string),
        parseFloat(lat as string),
      ];
      const coordinates = [long, lati];
      const restaurants = await Restaurants.find({
        "address.location": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coordinates,
            },
            $maxDistance: 5000,
          },
        },
      });

      const reg = new RegExp(search as string, "i");

      const restIds = restaurants.map((item) => {
        return item._id;
      });
      const mRest = await Menus.find({ restaurant: { $in: restIds } });
      const filterFood = mRest
        .map((item) => {
          let pass = false;
          item.item.forEach((a) => {
            if (search && reg.test(a.name)) {
              pass = true;
              return;
            }
          });
          if (pass) {
            console.log(item.restaurant);
            return item.restaurant;
          }
          return;
        })
        .filter((item) => item !== undefined);

      const searchFood = restaurants
        .map((item) => {
          if (!search) {
            return item;
          }
          const testarr = filterFood.map((data) => {
            // @ts-ignore
            if (data.equals(item._id)) {
              return true;
            }
          });
          if (
            reg.test(item.name) ||
            reg.test(item.address.street) ||
            reg.test(item.contactNumber) ||
            testarr.includes(true)
          ) {
            return item;
          }
          return;
        })
        .filter((item) => item !== undefined);
      res.send(searchFood);
      return;
    }

    const userGeoData = await codeToGeo(
      typeof postalcode === "string" && postalcode
    );

    const coordinates = [userGeoData.longitude, userGeoData.latitude];

    const restaurants = await Restaurants.find({
      "address.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates,
          },
          $maxDistance: 5000,
        },
      },
    });

    res.send(restaurants);
  }
);

router.get("/find", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  if (!id) {
    throw new CustomError("Invalid parameters");
  }
  const oneRest = await Restaurants.findById(id);

  res.send(oneRest);
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.query;

  const allRestaurants = await Restaurants.find();
  if (!search) {
    res.send(allRestaurants);
    return;
  }
  const allRestIds = allRestaurants.map((item) => {
    return item._id;
  });
  const menus = await Menus.find({ restaurant: { $in: allRestIds } });

  const reg = new RegExp(search as string, "i");
  const filterFood = menus
    .map((item) => {
      let pass = false;
      item.item.forEach((a) => {
        if (search && reg.test(a.name)) {
          pass = true;
          return;
        }
      });
      if (pass) {
        return item.restaurant;
      }
      return;
    })
    .filter((item) => item !== undefined);

  const searchFood = allRestaurants
    .map((item) => {
      if (!search) {
        return item;
      }
      const testarr = filterFood.map((data) => {
        // @ts-ignore
        if (data.equals(item._id)) {
          return true;
        }
      });
      if (
        reg.test(item.name) ||
        reg.test(item.address.street) ||
        reg.test(item.contactNumber) ||
        testarr.includes(true)
      ) {
        return item;
      }
      return;
    })
    .filter((item) => item !== undefined);

  res.send(searchFood);
});

export default router;
