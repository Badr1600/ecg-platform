const mongoose = require("mongoose");

const Hospital = mongoose.model(
  "Hospital",
  new mongoose.Schema({
    title: String,
    location: String,
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
      }
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
      }
    ]
  }, { timestamps: true }).method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  })
);

module.exports = Hospital;