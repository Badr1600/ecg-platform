import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/requests';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

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
  
  createPatientReq(data): Observable<any> {
    return this.http.post(`${baseUrl}/patientRequest`, data);
  }

  createDoctorReq(data): Observable<any> {
    return this.http.post(`${baseUrl}/doctorRequest`, data);
  }

  update(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  updateArray(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/update/${id}`, data);
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
