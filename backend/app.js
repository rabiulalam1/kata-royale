require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const http = require('http');

// var socket = require('socket.io-client')('http://localhost:3000');
// console.log(socket.on)
// socket.on('connect', function () {

//   console.log('connected  ')

// });




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
    origin: ["http://localhost:3000", "https://kata-royale.netlify.app"], //Swap this with the client url
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
  res.status(404).json({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).send({ msg: 'Check the error on console' });
  }
});

const server = http.createServer(app);


//const io = require('socket.io')(server);
// io.set('origins', 'http://localhost:3000');

// const io = require('socket.io')(server, {
//   origins: '*:*'
// });

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('connected!')
  io.sockets.emit('hi', { data: 'cool' })

});

module.exports = server;
