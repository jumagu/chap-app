import Chat from "../models/chat.model.js";

import { validateJWT } from "../helpers/validate-jwt.helper.js";

const chat = new Chat();

export const socketController = async (socket, io) => {
  const user = await validateJWT(socket.handshake.headers["x-token"]);

  if (!user) return socket.disconnect();

  chat.connectUser(user);

  // ? Connect user to a room; the room's name is the user ID
  socket.join(user.id);

  // ? Emit all connected users to all users
  io.emit("user-connected", chat.userArray);

  // ? Emit all messages to all users
  socket.emit("message-received", chat.messages);

  // ? Listen when user disconnect
  socket.on("disconnect", () => {
    chat.disconnectUser(user.id);

    // ? Emit updated list of connected users
    io.emit("user-connected", chat.userArray);
  });

  // ? Listen when a message is sent
  socket.on("send-message", ({ uid, message }) => {
    if (uid) {
      socket.to(uid).emit("private-message", { from: user.name, message });
    } else {
      chat.sendMessage(user.id, user.name, message);

      // ? Emit messages to global room
      io.emit("message-received", chat.messages);
    }
  });
};
