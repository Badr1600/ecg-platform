const PatientRequest = require('../models/requests.model');

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    if (req.method == 'POST') {
        var patientRequest = new PatientRequest({
            type: "patient",
            title: req.body.title,
            requestedBy: req.body.requestedBy,
            requestType: req.body.requestType,
            patientId: req.body.patientId,
            currentDoctor: req.body.currentDoctor,
            newDoctor: req.body.newDoctor,
            currentHospital: req.body.currentHospital,
            newHospital: req.body.newHospital,
            status: req.body.status,
        });
        patientRequest.save((err, patientRequest) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(patientRequest);
        });
    }
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    PatientRequest.find(condition)
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

    PatientRequest.findById(id)
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

    PatientRequest.findOne({ username: username })
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
        PatientRequest.updateOne(
            { _id: id },
            { $push: { "medicals": medicals } }, { new: true, upsert: true }).exec();
    }

    if ((req.body.medicals && (req.body.delete == true))) {
        PatientRequest.updateOne(
            { _id: id },
            { $pull: { "medicals": medicals } }, { new: true, upsert: true }).exec();
    }

    if (req.body.hospital) {
        PatientRequest.updateMany(
            { doctor: id },
            { $set: { "hospital": req.body.hospital.id } }, { new: true, upsert: true }).exec();
    }

    if ((req.body.doctor && (req.body.delete == true))) {
        PatientRequest.updateMany(
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

    PatientRequest.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update patient with id=${id}. Maybe patient was not found!`
                });
            } else res.send({ message: "PatientRequest was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating PatientRequest with id=" + id
            });
        });

};

exports.delete = (req, res) => {
    const id = req.params.id;

    PatientRequest.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete patient with id=${id}. Maybe patient was not found!`
                });
            } else {
                res.send({
                    message: "PatientRequest was deleted successfully!"
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
    PatientRequest.deleteMany({})
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
    PatientRequest.find({ published: true })
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