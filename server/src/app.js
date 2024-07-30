const express = require("express");
const http = require('http');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { initSocket } = require('./socketHandler');

const app = express();
const server = http.createServer(app);
initSocket(server);

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/test", require("./routes/test"));
app.use("/api/items", require("./routes/items"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/areas", require("./routes/areas"));
app.use("/api/locations", require("./routes/locations"));
app.use("/api/users", require("./routes/users"));
app.use("/api/lists", require("./routes/lists"));

module.exports = { app, server };
