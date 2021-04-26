module.exports = app => {
    const patientRequests = require("../controllers/patientRequests.controller.js");
    const doctorRequests = require("../controllers/doctorRequests.controller.js");
  
    var router = require("express").Router();
  
    // Create a new patient
    router.post("/patientRequest", patientRequests.create);

    router.post("/doctorRequest", doctorRequests.create);

    // Retrieve all patients
    router.get("/", patientRequests.findAll);
  
    // Retrieve all published patients
    router.get("/published", patientRequests.findAllPublished);
  
    // Retrieve a single patient with id
    router.get("/:id", patientRequests.findById);

    // Retrieve a single patient with username
    router.get("/getByUsername/:username", patientRequests.findByUsername);
  
    // Update a patient with id
    router.put("/:id", patientRequests.update);

    // Update a patient with id
    router.put("/update/:id", patientRequests.updateArray);

    // Delete a patient with id
    router.delete("/:id", patientRequests.delete);
  
    // delete all patients
    router.delete("/", patientRequests.deleteAll);
  
    app.use('/api/requests', router);
  };