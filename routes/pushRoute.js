const express = require("express");
const webpush = require("web-push");

const { pushModel } = require("../models/pushModel");
const router = express.Router();

webpush.setVapidDetails(
  process.env.WEB_PUSH_CONTACT,
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

router.get("/", (req, res) => {
  res.json({ msg: "test" });
});

router.post("/notify", async (req, res) => {
  try {
    // console.log(req.body);
    const existEmail = await pushModel.findOne({ email: req.body.email });

    if (existEmail)
      return res.status(403).json({ error: true, msg: "Email already exists" });

    const newUser = new pushModel(req.body);
    const saveUser = await newUser.save();
    // console.log(saveUser);

    res.json({
      error: false,
      msg: "We have updated the notification list",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, msg: error });
  }
});

router.post("/subscribe", async (req, res) => {
  try {
    const subscribe = req.body;
    console.log("subscribe", subscribe);

    const payload = JSON.stringify({
      title: "Hello!",
      body: "It works.",
    });

    const status = await webpush.sendNotification(subscribe, payload);
    console.log("status", status);

    res.json({ error: false, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: true, msg: error });
  }
});

module.exports = router;
