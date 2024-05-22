import http from "http";
import cors from "cors";
import express from "express";
import { Server as SocketServer } from "socket.io";

import authRouter from "../routes/auth.routes.js";
import usersRouter from "../routes/users.routes.js";

import { dbConnection } from "../database/config.database.js";
import { socketController } from "../sockets/controller.socket.js";

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server);

    // ? Connect DB
    this.connectDB();

    // ? Middlewares
    this.middlewares();

    // ? Routes
    this.routes();

    // ? Sockets
    this.sockets();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // ? CORS
    this.app.use(cors());

    // ? JSON parse
    this.app.use(express.json());

    // ? Public directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/users", usersRouter);
  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Server running on port", this.port);
    });
  }
}
