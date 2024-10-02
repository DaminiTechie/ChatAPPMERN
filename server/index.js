const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const socket = require("socket.io");
require("dotenv").config();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, 
}));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use('/api/auth', userRoutes);

// Start server
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

// Socket.io configuration
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173", // Updated to match the frontend
    credentials: true,
  },
});

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Chat App API');
}); 

global.onlineUsers = new Map();

// Socket.io connection
io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    }
  });
});
