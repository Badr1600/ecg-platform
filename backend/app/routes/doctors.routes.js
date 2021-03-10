module.exports = app => {
  const doctors = require("../controllers/doctor.controller.js");

  var router = require("express").Router();

  // Create a new doctors
  router.post("/", doctors.create);

  // Retrieve all doctors
  router.get("/", doctors.findAll);

  // Retrieve all published doctors
  router.get("/published", doctors.findAllPublished);

  // Retrieve a single doctor with id
  router.get("/:id", doctors.findOne);

  // Update a doctor with id
  router.put("/:id", doctors.update);

  // Update a patient with id
  router.put("/update/:id", doctors.updateArray);

  // Delete a doctor with id
  router.delete("/:id", doctors.delete);

  // Create a new doctor
  router.delete("/", doctors.deleteAll);

  app.use('/api/doctors', router);
};