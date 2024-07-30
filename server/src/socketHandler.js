const socketIO = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected");

    // Example: Handle list update events
    socket.on('updateList', (listId) => {
      // Broadcast the updated list to all clients
      socket.broadcast.emit('listUpdated', listId);
    });
  
    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
