import { Schema, model, Document, Types } from "mongoose";
import { IOperatingHours } from "../interfaces";

const hoursInADaySchema = new Schema({
  openingTime: String,
  closingTime: String,
  isOpen: Boolean,
});

const hoursInAHolidaySchema = new Schema({
  date: String,
  openingTime: String,
  closingTime: String,
  isOpen: Boolean,
});

const operatingHoursSchema = new Schema({
  monday: {
    type: [hoursInADaySchema],
  },
  tuesday: {
    type: [hoursInADaySchema],
  },
  wednesday: {
    type: [hoursInADaySchema],
  },
  thursday: {
    type: [hoursInADaySchema],
  },
  friday: {
    type: [hoursInADaySchema],
  },
  satuday: {
    type: [hoursInADaySchema],
  },
  sunday: {
    type: [hoursInADaySchema],
  },
  holidays: {
    type: [hoursInAHolidaySchema],
  },
  restaurant: { type: Types.ObjectId, ref: "restaurants" },
});

const OperatingHours = model<IOperatingHours & Document>(
  "operatingHours",
  operatingHoursSchema
);

export default OperatingHours;
