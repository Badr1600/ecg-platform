import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const config = require('./config.json');

const baseUrl = 'http://localhost:8080/api/aws';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private http: HttpClient) { }
  findCSV(id): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(id): Observable<any> {
    return this.http.post(baseUrl, id);
  }

  /*sendCSV(file): Observable<any> {
    return this.http.put(baseUrl, file);
  }*/

}
