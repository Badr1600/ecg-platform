const Medical = require('../models/medicals.model');

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    if (req.method == 'POST') {
        var medical = new Medical({
            title: req.body.title,
            type: req.body.type,
            patient: req.body.patient

        });
        medical.save((err, medical) => {
            if(err) return res.status(500).send(err);
            return res.status(200).json(medical);
        });
    }
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Medical.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving medicals."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Medical.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No medical found with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving medical with id=" + id });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Medical.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update medical with id=${id}. Maybe medical was not found!`
                });
            } else res.send({ message: "Medical was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Medical with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Medical.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete medical with id=${id}. Maybe medical was not found!`
                });
            } else {
                res.send({
                    message: "Medical was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete medical with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Medical.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Medicals were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Medicals."
      });
    });
};

exports.findAllPublished = (req, res) => {
    Medical.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Medicals."
      });
    });
};