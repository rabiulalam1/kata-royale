const router = require("express").Router();
const axios = require("axios");
const Kata = require("../models/Kata");
const Challenge = require("../models/Challenge");
const User = require("../models/User");

router.get("/", (req, res, next) => {
  res.status(200).json({ msg: "Working" });
});

router.post("/kata/:email", (req, res, next) => {
  const io = req.app.get("socketio");

  if (req.body.action === "honor_changed") {
    axios
      .get(
        `https://www.codewars.com/api/v1/users/${req.body.user.id}/code-challenges/completed?page=0`
      )
      .then((response) => {
        let lastKata = response.data.data[0].id;
        Kata.findOne({ id: lastKata })
          .then((kata) => {
            Challenge.create({
              rank: kata.rank.id * -1,
              email: req.params.email,
              kataId: kata._id,
            }).then((challenge) => {
              io.sockets.emit("kata-completed", {
                kata: kata,
                challenge: challenge,
                email: req.params.email,
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.error(err));
  }
});

module.exports = router;
