const DoctorRequest = require('../models/requests.model');

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    if (req.method == 'POST') {
        var doctorRequest = new DoctorRequest({
            type: "doctor",
            title: req.body.title,
            requestedBy: req.body.requestedBy,
            requestType: req.body.requestType,
            doctorId: req.body.doctorId,
            currentHospital: req.body.currentHospital,
            newHospital: req.body.newHospital,
            status: req.body.status,
        });
        doctorRequest.save((err, doctorRequest) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(doctorRequest);
        });
    }
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    DoctorRequest.find(condition)
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

exports.findById = (req, res) => {
    const id = req.params.id;

    DoctorRequest.findById(id)
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

exports.findByUsername = (req, res) => {
    const username = req.params.username;

    DoctorRequest.findOne({ username: username })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No doctor found with username " + username });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving doctor with username=" + username });
        });
};

exports.updateArray = (req, res) => {
    const id = req.params.id;
    const patients = req.body.patient;

    if (req.body.addPatient == true) {
        DoctorRequest.findOneAndUpdate(
            { _id: id },
            { $push: { "patient": patients } }, { new: true, upsert: true, useFindAndModify: false }).exec();
    }

    if (req.body.deletePatient == true) {
        DoctorRequest.findOneAndUpdate(
            { _id: id },
            { $pull: { "patient": patients } }, { new: true, upsert: true, useFindAndModify: false }).exec();
    }

}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    DoctorRequest.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update doctor with id=${id}. Maybe doctor was not found!`
                });
            } else res.send({ message: "DoctorRequest was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating DoctorRequest with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    DoctorRequest.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete doctor with id=${id}. Maybe doctor was not found!`
                });
            } else {
                res.send({
                    message: "DoctorRequest was deleted successfully!"
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
    DoctorRequest.deleteMany({})
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
    DoctorRequest.find({ published: true })
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