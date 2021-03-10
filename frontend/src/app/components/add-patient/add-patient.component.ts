import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {
  patient = {
    title: '',
    age: '',
    gender: '',
  };
  submitted = false;
  patients: any;
  doctors: any;
  currentDoctor = null;
  currentIndex = -1;
  currentPatient = null;

  constructor(
    private patientService: PatientsService,
    private doctorService: DoctorsService) { }


  ngOnInit(): void {
    this.retrieveDoctors();
  }

  retrieveDoctors(): void {
    this.doctorService.getAll()
      .subscribe(
        data => {
          this.doctors = data;
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveDoctors();
    this.currentDoctor = null;
    this.currentIndex = -1;
  }

  setActiveDoctor(doctor, index): void {
    this.currentIndex = index;
    this.currentDoctor = doctor;
  }

  savePatient(): void {
    const data = {
      title: this.patient.title,
      age: this.patient.age,
      gender: this.patient.gender,
    };

    this.patientService.create(data)
      .subscribe(
        response => {
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newPatient(): void {
    this.submitted = false;
    this.patient = {
      title: '',
      age: '',
      gender: '',
    };
  }

}
