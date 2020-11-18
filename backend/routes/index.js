const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ msg: "Working" });
});

router.post("/kata/:name", (req, res, next) => {
  console.log(req.params, req.body, "<<<<<<<<<Helllo");
  if (req.body.action === "honor_changed") {
    axios
      .get(
        `https://www.codewars.com/api/v1/users/${req.body.user.id}/code-challenges/completed?page=0`
      )
      .then((response) => {
        console.log(response);
        let lastKata = response.data.data[0].id;
        Kata.findOne({ id: lastKata }).then((kata) => {
          console.log(kata);
          Challenge.create({ name: req.params.name, kataId: kata._id });
        });
      })
      .catch((err) => console.error(err));
  }
});

module.exports = router;
