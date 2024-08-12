const http = require("http");
const express = require("express");
const app = express();
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("send-location", (data) => {
    io.emit("recieve-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnect",socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3800);
