import { Component, OnInit } from '@angular/core';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hospital-view',
  templateUrl: './hospital-view.component.html',
  styleUrls: ['./hospital-view.component.css']
})

export class HospitalViewComponent implements OnInit {

  hospitals: any;
  doctors: any;
  patients: any;
  currentHospital = null;
  currentDoctor = null;
  currentPatient = null;
  currentIndex = -1;
  title = '';

  constructor(
    private hospitalService: HospitalsService,
    private doctorService: DoctorsService,
    private patientService: PatientsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.retrieveDoctors(this.route.snapshot.paramMap.get('id'));
  }

  retrieveDoctors(id): void {
    var temp = [];
    this.hospitalService.get(id)
      .subscribe(
        data => {
          console.log(data);
          this.currentHospital = data;
          this.doctorService.getAll()
          .subscribe(
            results => {
              console.log(results);
              results.forEach(element => {
                console.log(element.id);
                if (element.hospital == data.id) {
                  temp.push(element);
                }
                this.doctors = temp;
              });
            }
          )
        },
        error => {
          console.log(error);
        });
  }

  retrievePatients(id): void {
    var temp = [];
    this.doctorService.get(id)
      .subscribe(
        data => {
          console.log(data);
          this.patientService.getAll()
          .subscribe(
            results => { 
              results.forEach(element => {
                console.log(element);
                if (element.doctor == data.id) {
                  
                  temp.push(element);
                }
                this.patients = temp;
              });
            }
          )
        },
        error => {
          console.log(error);
        });
  }


  setActiveDoctor(doctor, index): void {
    this.currentDoctor = doctor;
    this.currentIndex = index;
  }

  refreshview(): void {
    this.currentHospital = null;
    this.currentIndex = -1;
  }

  setActiveHospital(hospital, index): void {
    this.currentHospital = hospital;
    this.currentIndex = index;
  }

  searchTitle(): void {
    this.hospitalService.findByTitle(this.title)
      .subscribe(
        data => {
          this.hospitals = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
}