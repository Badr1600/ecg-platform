const mongoose = require("mongoose");

const Doctor = mongoose.model(
  "Doctor",
  new mongoose.Schema({
    title: String,
    username: String,
    hospital: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
      }
    ],
    patient: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
      }
    ]
  }, { timestamps: true }).method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  })
);

module.exports = Doctor;