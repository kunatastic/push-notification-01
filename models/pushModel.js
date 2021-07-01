const mongoose = require("mongoose");

const pushSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const pushModel = mongoose.model("notification", pushSchema);

module.exports = { pushModel };
