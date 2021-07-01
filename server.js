if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

const pushRoute = require("./routes/pushRoute");

const app = express();

// DB Connection
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => console.log("DB Connected!!!")
);

// Middle wares
app.use(morgan("common"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./client/build")));
app.use(express.static(path.join(__dirname, "./public")));

// Routes
app.use("/api", pushRoute);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Server Running at http://localhost:${PORT}`);
});
