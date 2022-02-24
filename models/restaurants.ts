import { Schema, model, Types, Document } from "mongoose";
import { IRestaurants } from "../interfaces";
import { findAverage } from "../utils";

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    ratingRecord: { type: [Number] },
    address: {
      street: { type: String, required: true },
      postalCode: { type: String, required: true },
      building: { type: String },
      block: { type: String },
      unit: { type: String },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

restaurantSchema.virtual("rating").get(function () {
  return findAverage(this.ratingRecord);
});

restaurantSchema.virtual("numberOfRatings").get(function () {
  return this.ratingRecord.length;
});

restaurantSchema.virtual("operatingHours", {
  ref: "operatingHours",
  localField: "_id",
  foreignField: "restaurant",
  justOne: true,
});

restaurantSchema.virtual("menu", {
  ref: "menus",
  localField: "_id",
  foreignField: "restaurant",
  justOne: true,
});

const autoPopulateRestaurant = function (next: any) {
  this.populate("operatingHours");
  this.populate("menu");
  next();
};

restaurantSchema
  .pre("findOne", autoPopulateRestaurant)
  .pre("find", autoPopulateRestaurant);

restaurantSchema.index({
  "address.location": "2dsphere",
});

const Restaurants = model<IRestaurants & Document>(
  "restaurants",
  restaurantSchema
);

// Restaurants.createIndexes();

export default Restaurants;
