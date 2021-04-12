module.exports = app => {
  const hospitals = require("../controllers/hospital.controller.js");

  var router = require("express").Router();

  // Create a new hospitals
  router.post("/", hospitals.create);

  // Retrieve all hospitals
  router.get("/", hospitals.findAll);

  // Retrieve hospital with specific id
  router.get("/hospital", hospitals.findHospital);

  // Retrieve all published hospitals
  router.get("/published", hospitals.findAllPublished);

  // Retrieve a single hospital with id
  router.get("/:id", hospitals.findById);

  // Retrieve a single hospital with username
  router.get("/getByUsername/:username", hospitals.findByUsername);

  // Update a hospital with id
  router.put("/:id", hospitals.update);

  // Update a patient with id
  router.put("/updateDoctor/:id", hospitals.updateArrayDoctor);

  // Update a patient with id
  router.put("/updatePatient/:id", hospitals.updateArrayPatient);

  // Delete a hospital with id
  router.delete("/:id", hospitals.delete);

  // Create a new hospital
  router.delete("/", hospitals.deleteAll);

  app.use('/api/hospitals', router);
};