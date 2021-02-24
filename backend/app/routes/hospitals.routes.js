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
  router.get("/:id", hospitals.findOne);

  // Update a hospital with id
  router.put("/:id", hospitals.update);

  // Delete a hospital with id
  router.delete("/:id", hospitals.delete);

  // Create a new hospital
  router.delete("/", hospitals.deleteAll);

  app.use('/api/hospitals', router);
};