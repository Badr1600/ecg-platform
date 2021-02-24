import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent implements OnInit {
  doctor = {
    title: '',
    patients: '',
    hospital: ''
  };
  submitted = false;
  patients: any;
  hospitals: any;
  currentDoctor = null;
  currentIndex = -1;
  currentHospital = null;

  constructor(
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService) { }

  ngOnInit(): void {
    this.retrieveHospitals();
  }

  retrieveHospitals(): void {
    this.hospitalService.getAll()
      .subscribe(
        data => {
          this.hospitals = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  setActiveHospital(hospital, index): void {
    this.currentIndex = index;
    this.currentHospital = hospital;
  }

  saveDoctor(): void {
    const data = {
      title: this.doctor.title,
      hospital: this.currentHospital.id
    };
    this.doctorService.create(data)
      .subscribe(
        response => {
          this.submitted = true;
        },
        error => {
          console.log(error);
        });

        console.log(this.currentHospital.id);
        
  }

  newDoctor(): void {
    this.submitted = false;
    this.doctor = {
      title: '',
      patients: '',
      hospital: ''
    };
  }

}
