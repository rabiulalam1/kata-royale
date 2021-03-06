const { Schema, model } = require("mongoose");

const challengeSchema = new Schema(
  {
    email: String,
    rank: Number,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    kataId: { type: Schema.Types.ObjectId, ref: "Kata" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Challenge", challengeSchema);
