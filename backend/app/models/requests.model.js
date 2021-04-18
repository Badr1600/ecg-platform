const mongoose = require("mongoose");

const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    title: String,
    username: String,
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

module.exports = Request;

