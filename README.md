# ecg-platform
- Setup MongoDB database, collections will be created on their own, if they are not create the collections.
  - Must have the host connection information and add it to db.config.js in the backend.
  - Make sure all routing in backend matches with database configuration.
  - Backend server.js file configures the database connection.
- aws.controller.js requires accessKey and secretKey from AWS S3 service when a bucket is created.
  - Add this information to the config.json file in the backend.
  - Change the "Bucket" information where required (backend: aws.controller.js, frontend: records.service.ts).
  - In frontend, records.service.ts, change the access key and secret access key information to AWS S3 information.
- CSV files should contain only data points, no header, as many columns as needed.
- Check _services_ folder for all files and verify API urls.

- To start beckend:
  - nodemon server.js
- To start frontend: 
  - ng serve --port 8081

