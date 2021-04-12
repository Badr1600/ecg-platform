const Patient = require('../models/patients.model');

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    if (req.method == 'POST') {
        var patient = new Patient({
            title: req.body.title,
            age: req.body.age,
            gender: req.body.gender,
            doctor: req.body.doctor,
            medicals: req.body.medicals,
            username: req.body.username
        });
        patient.save((err, patient) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(patient);
        });
    }
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Patient.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving patients."
            });
        });
};

exports.findById = (req, res) => {
    const id = req.params.id;

    Patient.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No patient found with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving patient with id=" + id });
        });
};

exports.findByUsername = (req, res) => {
    const username = req.params.username;

    Patient.findOne({ username: username })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No patient found with username " + username });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving patient with username=" + username });
        });
};

exports.updateArray = (req, res) => {
    const id = req.params.id;
    const medicals = req.body.medicals;

    if ((req.body.medicals && (req.body.add == true))) {
        Patient.updateOne(
            { _id: id },
            { $push: { "medicals": medicals } }, { new: true, upsert: true }).exec();
    }

    if ((req.body.medicals && (req.body.delete == true))) {
        Patient.updateOne(
            { _id: id },
            { $pull: { "medicals": medicals } }, { new: true, upsert: true }).exec();
    }

    if (req.body.hospital) {
        Patient.updateMany(
            { doctor: id },
            { $set: { "hospital": req.body.hospital.id } }, { new: true, upsert: true }).exec();
    }

    if ((req.body.doctor && (req.body.delete == true))) {
        Patient.updateMany(
            { doctor: id },
            { $pull: { "doctor": req.body.doctor } }, { new: true, upsert: true }).exec();
    }
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Patient.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update patient with id=${id}. Maybe patient was not found!`
                });
            } else res.send({ message: "Patient was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Patient with id=" + id
            });
        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    Patient.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete patient with id=${id}. Maybe patient was not found!`
                });
            } else {
                res.send({
                    message: "Patient was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete patient with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Patient.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Patients were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Patients."
            });
        });
};

exports.findAllPublished = (req, res) => {
    Patient.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Patients."
            });
        });
};