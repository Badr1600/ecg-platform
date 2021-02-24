import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalsService } from 'src/app/_services/hospitals.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  currentHospital = null;
  currentDoctor = null;
  newHospital = null;
  message = '';
  doctors: any;
  hospitals: any;
  currentIndex = -1;
  title = '';

  constructor(
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getDoctor(this.route.snapshot.paramMap.get('id'));
    this.retrieveHospitals();
  }

  retrieveHospitals(): void {
    this.hospitalService.getAll()
      .subscribe(
        data => {
          this.hospitals = data;
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

  getDoctor(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.currentDoctor = data;
          this.getHospital(this.currentDoctor.hospital);
        },
        error => {
          console.log(error);
        });
  }

  setActiveHospital(hospital, index): void {
    this.currentIndex = index;
    this.doctorService.update(this.currentDoctor.id, this.currentDoctor)
      .subscribe(
        data => {
          this.newHospital = hospital;
        },
        error => {
          console.log(error);
        });
  }

  updateDoctor(): void {
    if (this.newHospital != null) {
      this.currentDoctor.hospital = [];
      this.currentDoctor.hospital.push(this.newHospital.id);
      this.currentHospital = this.newHospital.title;
    }

    this.doctorService.update(this.currentDoctor.id, this.currentDoctor)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The doctor was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteDoctor(): void {
    this.doctorService.delete(this.currentDoctor.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/doctors']);
        },
        error => {
          console.log(error);
        });
  }
}


/*updatePublished(status): void {
  const data = {
    title: this.currentDoctor.title,
    description: this.currentDoctor.description,
    published: status
  };

  this.doctorService.update(this.currentDoctor.id, data)
    .subscribe(
      response => {
        this.currentDoctor.published = status;
        console.log(response);
      },
      error => {
        console.log(error);
      });
}*/