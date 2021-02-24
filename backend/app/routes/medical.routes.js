module.exports = app => {
    const medicals = require("../controllers/medical.controller.js");
  
    var router = require("express").Router();
  
    // Create a new medical
    router.post("/", medicals.create);
  
    // Retrieve all medicals
    router.get("/", medicals.findAll);
  
    // Retrieve all published medicals
    router.get("/published", medicals.findAllPublished);
  
    // Retrieve a single medical with id
    router.get("/:id", medicals.findOne);
  
    // Update a medical with id
    router.put("/:id", medicals.update);
  
    // Delete a medical with id
    router.delete("/:id", medicals.delete);
  
    // delete all medicals
    router.delete("/", medicals.deleteAll);
  
    app.use('/api/medicals', router);
  };