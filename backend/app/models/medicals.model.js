const mongoose = require("mongoose");

const Medical = mongoose.model(
  "Medical",
  new mongoose.Schema({
    title: String,
    type: String,
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

module.exports = Medical;

