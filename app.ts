import express from "express";
import mongoose from "mongoose";
import router from "./controllers";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import handleError from "./middlewares/error-handler";
import http from "http";
import { Server } from "socket.io";

require("dotenv").config();

// TODO Allow Restaurant owners to register their restaurants, registration details include Name, Address , Geo Location. Operation Timings, Contact Numbers.
// TODO Allow Restaurant owners to publish their menu.
// TODO Allow users to search for restaurants by menu item like Paneer Tikka, name, address or geo location( within 5 kms radius) , operation timings.
// TODO Allow users to provide ratings ( 1 to 5 ) to a menu item in a restaurant and overall rating (1 to 5 ) to a restaurant.
// TODO Allow users to search or filter restaurants by item ratings and overall ratings.
const startServer = async () => {
  const app = express();
  const port = 8000;

  // middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(handleError);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });
  global.io = io;
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  const { MONGO_PATH } = process.env;
  await mongoose.connect(MONGO_PATH);

  app.use(router);

  server.listen(port, () => {
    console.log(
      "######################## \n Listening on port: ",
      port,
      "\n########################"
    );
  });
};

startServer();
