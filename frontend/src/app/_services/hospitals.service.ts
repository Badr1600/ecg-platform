import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/hospitals';

@Injectable({
  providedIn: 'root'
})
export class HospitalsService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  get(id): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  getByUsername(username): Observable<any> {
    return this.http.get(`${baseUrl}/getByUsername/${username}`);
  }
  
  getHospital(hospital): Observable<any> {
    return this.http.get(`${baseUrl}/${hospital}`);
  }

  create(data): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  updateArrayDoctor(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/updateDoctor/${id}`, data);
  }

  updateArrayPatient(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/updatePatient/${id}`, data);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title): Observable<any> {
    return this.http.get(`${baseUrl}?title=${title}`);
  }
}
