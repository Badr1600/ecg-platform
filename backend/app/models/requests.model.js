const mongoose = require("mongoose");

const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    type: String,
    title: String,
    requestedBy: String,
    requestType: String,
    completedBy: String,
    patientId: String,
    doctorId: String,
    currentDoctor: String,
    newDoctor: String,
    currentHospital: String,
    newHospital: String,
    status: String,
  }, { timestamps: true }).method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  })
); 

module.exports = Request;

