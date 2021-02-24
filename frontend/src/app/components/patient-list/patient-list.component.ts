import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})

export class PatientListComponent implements OnInit {
  currentDoctor = null;
  currentHospital = null;
  patients: any;
  currentPatient = null;
  currentIndex = -1;
  title = '';

  constructor(
    private patientService: PatientsService,
    private hospitalService: HospitalsService,
    private doctorService: DoctorsService) { }

  ngOnInit(): void {
    this.retrievePatients();
  }

  getDoctor(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.currentDoctor = data.title;
        },
        error => {
          console.log(error);
        });
  }

  getHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.currentHospital = data.title;
        },
        error => {
          console.log(error);
        });
  }

  retrievePatients(): void {
    this.patientService.getAll()
      .subscribe(
        data => {
          this.patients = data;
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrievePatients();
    this.currentPatient = null;
    this.currentIndex = -1;
  }

  setActivePatient(patient, index): void {
    this.currentPatient = patient;
    this.currentIndex = index;
    if (this.currentPatient.doctor || this.currentPatient.hospital) {
      this.getDoctor(this.currentPatient.doctor);   
      this.getHospital(this.currentPatient.hospital);
    }
  }

  removeAllPatients(): void {
    this.patientService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.retrievePatients();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.patientService.findByTitle(this.title)
      .subscribe(
        data => {
          this.patients = data;
        },
        error => {
          console.log(error);
        });
  }
}