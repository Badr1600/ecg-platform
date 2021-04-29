import { Component, OnInit } from '@angular/core';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hospital-view',
  templateUrl: './hospital-view.component.html',
  styleUrls: ['./hospital-view.component.css']
})

export class HospitalViewComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  hospital: any;
  hospitalId = null;
  hospitals: any;
  doctors: any;
  patients: any;
  currentHospital = null;
  currentDoctor = null;
  currentPatient = null;
  currentIndex = -1;
  title = '';
  message = '';

  constructor(
    private hospitalService: HospitalsService,
    private doctorService: DoctorsService,
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
    this.hospitalId = this.route.snapshot.paramMap.get('id');
    this.retrieveHospital(this.hospitalId);
    if ((this.roles.includes('ROLE_ADMIN'))) {
      this.retrieveDoctors(this.hospitalId);
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.hospital.id) {
              this.retrieveDoctors(this.hospitalId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_DOCTOR'))) {
      this.doctorService.getByUsername(username)
      .subscribe(
        data => {
          if (this.hospital.doctors.includes(data.id)) {
            this.retrieveDoctors(this.hospitalId);
          }
        }
      )
    }
  }

  retrieveHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.hospital = data;
        },
        error => {
          console.log(error);
        });
  }

  retrieveDoctors(id): void {
    var temp = [];
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.currentHospital = data;
          this.doctorService.getAll()
          .subscribe(
            results => {
              results.forEach(element => {
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
          this.patientService.getAll()
          .subscribe(
            results => { 
              results.forEach(element => {
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
        },
        error => {
          console.log(error);
        });
  }
}