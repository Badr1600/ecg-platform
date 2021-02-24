const Doctor = require('../models/doctors.model');

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    if (req.method == 'POST') {
        var doctor = new Doctor({
            title: req.body.title,
            hospital: req.body.hospital,
            patient: req.body.patient
        });
        doctor.save((err, doctor) => {
            if(err) return res.status(500).send(err);
            return res.status(200).json(doctor);
        });
    }
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Doctor.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving doctors."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Doctor.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No doctor found with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving doctor with id=" + id });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Doctor.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update doctor with id=${id}. Maybe doctor was not found!`
                });
            } else res.send({ message: "Doctor was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Doctor with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Doctor.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete doctor with id=${id}. Maybe doctor was not found!`
                });
            } else {
                res.send({
                    message: "Doctor was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete doctor with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Doctor.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Doctors were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Doctors."
      });
    });
};

exports.findAllPublished = (req, res) => {
    Doctor.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Doctors."
      });
    });
};