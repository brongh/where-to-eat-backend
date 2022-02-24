import express from "express";

import { default as restaurants } from "./restaurants";
import { default as menus } from "./menus";
import { default as ratings } from "./ratings";

const router = express.Router();

router.get("/", () => console.log("test"));
router.use("/restaurants", restaurants);
router.use("/menus", menus);
router.use("/ratings", ratings);

export default router;
