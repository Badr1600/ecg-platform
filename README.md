# ecg-platform
- Setup MongoDB database, collections will be created on their own, if they are not create the collections.
  - Must have the host connection information and add it to **_db.config.js_** in the backend.
  - Make sure all routing in backend matches with database configuration.
  - Backend **_server.js_** file configures the database connection.
- **_aws.controller.js_** requires **accessKey** and **secretKey** from AWS S3 service when a bucket is created.
  - Add this information to the **_config.json_** file in the backend.
  - Change the "Bucket" information where required (backend: **_aws.controller.js_**, frontend: **_records.service.ts_**).
  - In frontend, **_records.service.ts_**, change the access key and secret access key information to AWS S3 information.
- CSV files should contain only data points, no header, as many columns as needed.
- Check **_services_** folder for all files and verify API urls.

- **npm install** both backend and frontend should install all required packages. Check **_package.json_** files incase of difficulties.

- To start beckend:
  - **nodemon server.js**
- To start frontend: 
  - **ng serve --port 8081**

