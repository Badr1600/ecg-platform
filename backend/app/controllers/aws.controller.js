const aws = require('aws-sdk');
const config = require('../../config.json');
const csv = require('@fast-csv/parse');
const fsExtra = require('fs-extra')
const Log = require('../models/logs.model');

var fs = require('fs');
const { strict } = require('assert');

exports.findCSV = (req, res) => {
    const results = [];
    
    (async function () {
        const id = req.params.id + '/';

        aws.config.update({
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
            region: 'us-east-2'
        });

        const params = {
            Bucket: '', //FILL IN BUCKET NAME
        };

        const s3 = new aws.S3();

        let fetcher = new Promise((resolve, reject) => {
            s3.listObjectsV2(params, (err, data) => {
                var objects = [];
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    var contents = data.Contents;
                    contents.forEach(content => {
                        if (content.Key.includes(id)) {
                            if (content.Key.includes('.csv') == true) {
                                objects.push(content);
                            }
                        }
                    });
                    if (data.IsTruncated) {
                        params.ContinuationToken = data.NextContinuationToken;
                    }
                }
                if (objects) {
                    resolve(objects);
                } else {
                    reject(objects);
                }
            });
        });

        fetcher.then(function (value) {
            getCSV(value[0].Key);
        });

        async function getCSV(key) {
            const info = {
                Bucket: '', //FILL IN BUCKET NAME
                Key: key
            }

            const csvFile = s3.getObject(info).createReadStream();

            let parserFcn = new Promise((resolve, reject) => {
                const parser = csv
                    .parseStream(csvFile, { headers: false })
                    .on("data", function (data) {
                        results.push(data);
                    })
                    .on("end", function () {
                        resolve("csv parse process finished");

                    })
                    .on("error", function () {
                        reject("csv parse process failed");
                    });

            });
            try {
                await parserFcn;
            } catch (error) {
                console.log("Get Error: ", error);
            }
            res.send(results);
        }
    })()
};

exports.create = (req, res) => {
    const id = req.body.id + '/';

    aws.config.update({
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey,
        region: 'us-east-2'
    });

    const params = {
        Bucket: '', //FILL IN BUCKET NAME
        Key: id,
        Body: ''
    };

    const s3 = new aws.S3();

    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
    });
}

exports.sendCSV = function(req, res) {
    const dir = './fileprint';
    const s3 = new aws.S3();

    aws.config.update({
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey,
        region: 'us-east-2'
    });

    const params = {
        Bucket: '', //FILL IN BUCKET NAME
        Key: req.query.patient + '/' + req.files[0].originalname, //Later add createdAt from file upload from mobile phone.
        Body: fs.createReadStream(req.files[0].path),
        ContentType: 'text/csv'
    };

    s3.upload(params, function (err, data) {
        if (err) {
            console.log('There was an error uploading your file: ', err);
            return false;
        }
        console.log('Successfully uploaded file.', data);

        var log = new Log({
            patient: req.query.patient,
            etag: data.ETag
        });
        log.save((err, log) => {
            if(err) return res.status(500).send(err);
            return res.status(200).json(log);
        });

        return true;
    });

    fsExtra.emptyDirSync(dir);
}
