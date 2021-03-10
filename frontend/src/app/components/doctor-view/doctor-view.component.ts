import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-view',
  templateUrl: './doctor-view.component.html',
  styleUrls: ['./doctor-view.component.css']
})

export class DoctorViewComponent implements OnInit {
  doctors: any;
  hospitals: any;
  currentDoctor = null;
  currentHospital = null;
  currentIndex = -1;
  title = '';

  constructor(
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
    private patientService: PatientsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDoctor(this.route.snapshot.paramMap.get('id'));
    this.retrieveHospitals(this.route.snapshot.paramMap.get('id'));
  }

  retrieveHospitals(id): void {
    var temp = [];
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.hospitalService.getAll()
          .subscribe(
            results => {
              results.forEach(element => {
                if (element.id == data.hospital) {
                  temp.push(element);
                }
                this.hospitals = temp;
              });
            }
          )
        },
        error => {
          console.log(error);
        });
  }

  getDoctor(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.currentDoctor = data;
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
    this.currentDoctor = null;
    this.currentIndex = -1;
  }

  setActiveHospital(hospital, index): void {
    this.currentHospital = hospital;
    this.currentIndex = index;
  }

  searchTitle(): void {
    this.doctorService.findByTitle(this.title)
      .subscribe(
        data => {
          this.doctors = data;
        },
        error => {
          console.log(error);
        });
  }
}