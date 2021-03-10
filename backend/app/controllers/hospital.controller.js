const Hospital = require('../models/hospitals.model');

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    if (req.method == 'POST') {
        var hospital = new Hospital({
            title: req.body.title,
            location: req.body.location
        });
        hospital.save((err, hospital) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(hospital);
        });
    }
};

exports.findHospital = (req, res) => {
    const hospital = req.params.hospital.id;

    Doctor.findByHospital(hospital)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No doctor found with hospital " + hospital });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving doctor with hospital=" + hospital });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Hospital.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving hospitals."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Hospital.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No hospital found with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving hospital with id=" + id });
        });
};

exports.updateArrayDoctor = (req, res) => {
    const id = req.params.id;
    const doctors = req.body.doctor;

    if (req.body.addDoctor == true) {
        Hospital.findByIdAndUpdate(
            { _id: id },
            { $push: { "doctors": doctors } }, { new: true, upsert: true, useFindAndModify: false }).exec();
    }

    if (req.body.deleteDoctor == true) {
        Hospital.findByIdAndUpdate(
            { _id: id },
            { $pull: { "doctors": doctors } }, { new: true, upsert: true, useFindAndModify: false }).exec();
    }

}

exports.updateArrayPatient = (req, res) => {
    const id = req.params.id;
    const patients = req.body.patient;

    if (req.body.addPatient == true) {
        Hospital.findByIdAndUpdate(
            { _id: id },
            { $push: { "patients": patients } }, { new: true, upsert: true, useFindAndModify: false }).exec();
    }

    if (req.body.deletePatient == true) {
        Hospital.findByIdAndUpdate(
            { _id: id },
            { $pull: { "patients": patients } }, { new: true, upsert: true, useFindAndModify: false }).exec();
    }

}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Hospital.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update hospital with id=${id}. Maybe hospital was not found!`
                });
            } else res.send({ message: "Hospital was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Hospital with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Hospital.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete hospital with id=${id}. Maybe hospital was not found!`
                });
            } else {
                res.send({
                    message: "Hospital was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete hospital with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Hospital.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Hospitals were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Hospitals."
            });
        });
};

exports.findAllPublished = (req, res) => {
    Hospital.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Hospitals."
            });
        });
};