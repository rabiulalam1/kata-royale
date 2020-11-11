const { Schema, model } = require("mongoose");

const kataSchema = new Schema(
  {
    id: String,
    name: String,
    slug: String,
    rank: Object,
    url: String,
    description: String,
    userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Kata", kataSchema);
