import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const config = require('./config.json');
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

const baseUrl = 'http://localhost:8080/api/aws';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(private http: HttpClient) { }
  findCSV(id): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(id): Observable<any> {
    return this.http.post(baseUrl, id);
  }

  uploadFile(id, file): void {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: '', //FILL IN ACCESS KEY ID
        secretAccessKey: '', //FILL IN SECRET ACCESS KEY ID
        region: 'us-east-2'
      }
    );

    const params = {
      Bucket: '', //FILL IN BUCKET NAME
      Key: id + '/' + file.name,
      Body: file
    };

    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });

  }
}
