const mongoose = require("mongoose");

const Patient = mongoose.model(
  "Patient",
  new mongoose.Schema({
    title: String,
    age: String,
    gender: String,
    doctor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
      }
    ],
    hospital: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
      }
    ],
    medicals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medical"
      }
    ]
  }, { timestamps: true }).method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  })
); 

module.exports = Patient;

