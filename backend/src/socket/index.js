import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const onlineUsers = new Map(); // {userId: socketId}

const emitOnlineUsers = () => {
  const visibleUserIds = Array.from(onlineUsers.entries())
    .filter(([, socket]) => socket.user?.showOnlineStatus !== false)
    .map(([userId]) => userId);

  io.emit("online-users", visibleUserIds);
};

io.on("connection", async (socket) => {
  const user = socket.user;

  // console.log(`${user.displayName} online với socket ${socket.id}`);

  onlineUsers.set(user._id.toString(), socket);

  emitOnlineUsers();

  const conversationIds = await getUserConversationsForSocketIO(user._id);
  conversationIds.forEach((id) => {
    socket.join(id);
  });

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.join(user._id.toString());

  socket.on("online-visibility", (showOnlineStatus) => {
    socket.user.showOnlineStatus = showOnlineStatus;
    emitOnlineUsers();
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    emitOnlineUsers();
    /* console.log(`socket disconnected: ${socket.id}`); */
  });
});

export { io, app, server };
