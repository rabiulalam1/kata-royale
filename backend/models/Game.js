const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    time: Number,
    endDate: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
    startDate: { type: Date, default: () => new Date(+new Date() + 60 * 1000) },
    name: { type: String, default: "Thorn" },
    playersId: [{ type: Schema.Types.ObjectId, ref: "User" }],
    katasId: [{ type: Schema.Types.ObjectId, ref: "Kata" }],
    challengesId: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Game", gameSchema);
