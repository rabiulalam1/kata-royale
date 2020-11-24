require("dotenv").config();

const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const http = require("http");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/deploymentExample";
console.log("Connecting DB to ", MONGODB_URI);

// const MONGODB_URI = "mongodb://localhost/Kata-Royale";
console.log("Connecting DB to ", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://kata-royale.netlify.app"],
    //Swap this with the client url
  })
);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger("dev"));

const index = require("./routes/index");
const auth = require("./routes/auth");

app.use("/api", index);
app.use("/api", auth);

app.get("*", (req, res, next) => {
  console.log("weird", req.headers.host, "peach", req.url);

  if (req.headers.host.includes("heroku")) {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.status(404).json({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error("ERROR", req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).send({ msg: "Check the error on console" });
  }
});

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.set("socketio", io);

const gameState = {
  connections: [],
  players: [],
};

io.on("connection", (socket) => {
  console.log("connected!", socket.id, "socketIDDDD");
  gameState.connections.push(socket.id);
  io.sockets.emit("hi", { data: "New User Connected" });
  socket.on("leave", (game) => {
    console.log("leavinggggggggggg");
    gameState.players.map((eachPlayer, index) => {
      if (eachPlayer._id === game.user._id) {
        gameState.players.splice(index, 1);
      }
    });
    socket.leave(game.gameId);
    io.to(game.gameId).emit("Join", gameState);
  });
  socket.on("disconnect", () => {
    console.log(socket.id, "blahblahhhhhhhhhhh");
    let gameId = null;
    gameState.players.map((eachPlayer, index) => {
      if (eachPlayer.socketId === socket.id) {
        gameId = eachPlayer.gameId;
        gameState.players.splice(index, 1);
      }
    });
    socket.leave(gameId);
    io.to(gameId).emit("Join", gameState);
  });
  socket.on("Join Game", (game) => {
    socket.join(game.id);

    jwt.verify(
      game.headers.Authorization.split(" ")[1],
      "secretkey",
      (err, authData) => {
        if (err) {
        } else {
          let user = authData.user;
          user.socketId = socket.id;
          user.gameId = game.id;
          gameState["players"].push(user);
          io.to(game.id).emit("Join", gameState);
        }
      }
    );
  });
});

function verifyToken(req, res, next) {
  console.log("verify");
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.status(403); //.json({err:'not logged in'});
  }
}

module.exports = server;
