module.exports = app => {
    const records = require("../controllers/aws.controller.js");

    const mutler = require('multer');
    const upload = mutler({ dest: 'fileprint/' });
  
    var router = require("express").Router();

    // Retrieve all doctors
    router.get("/:id", records.findCSV);
    //Create directory for patient in S3

    //router.post("/", records.create);

    router.post("/sendCSV", upload.any(), records.sendCSV);

    app.use('/api/aws', router);

  };