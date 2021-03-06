const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const Kata = require("../models/Kata");
const Challenge = require("../models/Challenge");
const Game = require("../models/Game");
const axios = require("axios");

router.post("/signup", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then((user) => {
      jwt.sign({ user }, "secretkey", { expiresIn: "7d" }, (err, token) => {
        req.login(user, function (err, result) {
          res.status(201).json({ ...user._doc, token });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/user", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      // res.status(200).json(authData.user)
      User.findById(authData.user._id)
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => res.status(500).json(err));
    }
  });
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const { user } = req;
  jwt.sign({ user }, "secretkey", { expiresIn: "7d" }, (err, token) => {
    res.status(200).json({ ...user._doc, token });
  });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.status(200).json({ msg: "Logged out" });
});

router.post("/newKata", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      console.log(err);
      res.status(403).json(err);
    } else {
      // console.log(req.body);
      Kata.findOne(req.body).then((kata) => {
        if (kata) {
          return res.status(500).json({ message: "This Kata already exists" });
        }
        // console.log(req.body.url.split("/"));
        let id = req.body.url.split("/")[4];
        axios
          .get(`https://www.codewars.com/api/v1/code-challenges/${id}`)
          .then((challenge) => {
            // console.log("challendge, ", challenge);
            challenge.userId = authData.user._id;
            Kata.create(challenge.data)
              .then((kata) => res.status(200).json({ kata }))
              .catch(console.error);
          })
          .catch(console.error);
      });
    }
  });
});

router.post("/newGame", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      console.log(err);
      res.status(403).json(err);
    } else {
      // console.log(req.body);
      Game.create(req.body)
        .then((game) => {
          res.status(200).json({ game });
        })
        .catch((err) => res.status(500).json(err));
    }
  });
});

router.get("/getdailykata", (req, res) => {
  Kata.find()
    .sort({ _id: -1 })
    .limit(1)
    .then((kata) => {
      res.json({ kata });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/gameDetail", (req, res) => {
  console.log(req.query, "<<<<<<<<<<<<<<<<<<<<<ID");
  // const io = req.app.get("socketio");
  // io.on("Join Game", (socket) => console.log(socket, socket.id, "socket.io"));
  Game.findById(req.query.id)

    .then((game) => {
      res.json({ game });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getAllGames", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      Game.find()
        .then((allGames) => {
          res.json({ allGames });
        })
        .catch((err) => console.log(err));
    }
  });
});

router.get("/getuserkata", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      Challenge.find({ email: authData.user.email }).then((allKatas) => {
        res.json({ allKatas });
      });
    }
  });
});

function isAuth(req, res, next) {
  req.isAuthenticated()
    ? next()
    : res.status(401).json({ msg: "Log in first" });
}

// Verify Token
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

module.exports = router;
