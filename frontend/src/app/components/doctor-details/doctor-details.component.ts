import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  currentHospital = null;
  currentDoctor = null;
  newHospital = null;
  oldHospital = null;
  isValid = false;
  message = '';
  doctors: any;
  hospitals: any;
  currentIndex = -1;
  title = '';

  constructor(
    private doctorService: DoctorsService,
    private patientService: PatientsService,
    private hospitalService: HospitalsService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;

      if ((this.roles.includes('ROLE_ADMIN')) || (this.roles.includes('ROLE_HOSPITAL'))) {
        this.message = '';
        this.getDoctor(this.route.snapshot.paramMap.get('id'));
        this.retrieveHospitals();
      } else {
        this.router.navigate(['/home'])
          .then(() => {
            window.location.reload();
          });
      }
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }
  }

  // isUserAccount(): boolean {
  //   this.getDoctor(this.route.snapshot.paramMap.get('id'));
    
  //   if (this.currentDoctor.username == this.username) {
  //     return true;
  //   }
  // }

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
          this.currentHospital = data;
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
    this.oldHospital = this.currentHospital;
    if (this.newHospital != null) {
      this.currentDoctor.hospital = [];
      this.currentDoctor.hospital.push(this.newHospital.id);
      this.currentHospital = this.newHospital;
    }

    this.doctorService.update(this.currentDoctor.id, this.currentDoctor)
      .subscribe(
        response => {
          this.message = 'The doctor was updated successfully!';

          const setHospital = {
            hospital: this.newHospital
          }

          this.doctorService.updateArray(this.currentDoctor.id, setHospital).subscribe(response => {
          });

          if (this.currentDoctor.patient.length != 0) {
            this.patientService.updateArray(this.currentDoctor.id, setHospital).subscribe(response => {
            });
          }

          const addDoctor = {
            doctor: this.currentDoctor.id,
            addDoctor: true,
            deleteDoctor: false
          }

          this.hospitalService.updateArrayDoctor(this.newHospital.id, addDoctor).subscribe(response => {
          });

          const removeDoctor = {
            doctor: this.currentDoctor.id,
            deleteDoctor: true,
            addDoctor: false
          }

          this.hospitalService.updateArrayDoctor(this.oldHospital.id, removeDoctor).subscribe(response => {
          });

          const addPatients = {
            patient: this.currentDoctor.patient,
            addPatient: true,
            deletePatient: false
          }

          this.hospitalService.updateArrayPatient(this.newHospital.id, addPatients).subscribe(response => {
          });

          const removePatients = {
            patient: this.currentDoctor.patient,
            deletePatient: true,
            addPatient: false
          }

          this.hospitalService.updateArrayPatient(this.oldHospital.id, removePatients).subscribe(response => {
          });

          this.refresh();
        },
        error => {
          console.log(error);
        });
  }

  refresh(): void {
    this.router.navigate(['/doctors'])
      .then(() => {
        window.location.reload();
      });
  }

  deleteDoctor(): void {
    console.log(this.currentDoctor);
    this.doctorService.delete(this.currentDoctor.id)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
    this.authService.delete(this.currentDoctor.username)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
    this.refresh();
  }
}
