import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-view',
  templateUrl: './doctor-view.component.html',
  styleUrls: ['./doctor-view.component.css']
})

export class DoctorViewComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  doctor: any;
  doctorId = null;
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
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.authorizeLogin(this.username);
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }

  }

  authorizeLogin(username): void {
    this.doctorId = this.route.snapshot.paramMap.get('id');
    this.retrieveDoctor(this.doctorId);
    if ((this.roles.includes('ROLE_ADMIN'))) {
      this.getDoctor(this.doctorId);
      this.retrieveHospitals(this.doctorId);
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.doctor.hospital) {
              this.getDoctor(this.doctorId);
              this.retrieveHospitals(this.doctorId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_DOCTOR'))) {
      this.doctorService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.doctor.id) {
              this.getDoctor(this.doctorId);
              this.retrieveHospitals(this.doctorId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_PATIENT'))) {
      this.patientService.getByUsername(username)
      .subscribe(
        data => {
          if (this.doctor.patient.includes(data.id)) {
            this.getDoctor(this.doctorId);
            this.retrieveHospitals(this.doctorId);
          }
        }
      )
    }
  }

  retrieveDoctor(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.doctor = data;
        },
        error => {
          console.log(error);
        });
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