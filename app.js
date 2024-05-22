import { config } from "dotenv";

import Server from "./models/server.model.js";

config();

const server = new Server();

server.app.get("/api/env/google-client-id", (req, res) => {
  res.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  });
});

server.listen();
