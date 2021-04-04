const mongoose = require('mongoose');
const dbConfig = require("../config/db.config.js");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.url = dbConfig.url;
db.patients = require("./patients.model.js")(mongoose);
db.doctors = require("./doctors.model.js")(mongoose);
db.hospitals = require("./hospitals.model.js")(mongoose);
db.medicals = require("./medicals.model.js")(mongoose);

db.ROLES = ["user", "admin", "hospital", "doctor", "patient"];

module.exports = db;