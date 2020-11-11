const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ msg: "Working" });
});

router.post("/kata/:name", (req, res, next) => {
  console.log(req.params, req.body, "<<<<<<<<<Helllo");
});

module.exports = router;
