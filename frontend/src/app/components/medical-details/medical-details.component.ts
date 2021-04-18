import { Component, OnInit } from '@angular/core';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from 'src/app/_services/patients.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-medical-details',
  templateUrl: './medical-details.component.html',
  styleUrls: ['./medical-details.component.css']
})
export class MedicalDetailsComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  medical: any;
  medicalId = null;
  currentPatient = null;
  currentMedical = null;
  message = '';
  medicals: any;
  patients: any;
  currentIndex = -1;
  title = '';

  constructor(
    private medicalService: MedicalsService,
    private patientService: PatientsService,
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
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
    this.medicalId = this.route.snapshot.paramMap.get('id');
    this.retrieveMedical(this.medicalId);
    if ((this.roles.includes('ROLE_ADMIN'))) {
      this.message = '';
      this.getInfo(this.medicalId);
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.patients.includes(this.medical.patient[0])) {
              this.message = '';
              this.getInfo(this.medicalId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_DOCTOR'))) {
      this.doctorService.getByUsername(username)
        .subscribe(
          data => {
            if (data.patient.includes(this.medical.patient[0])) {
              this.message = '';
              this.getInfo(this.medicalId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_PATIENT'))) {
      this.patientService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.medical.patient[0]) {
              this.message = '';
              this.getInfo(this.medicalId);
            }
          }
        )
    }
  }

  retrieveMedical(id): void {
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.medical = data;
        },
        error => {
          console.log(error);
        });
  }

  getPatient(id): void {
    this.patientService.get(id)
      .subscribe(
        data => {
          this.currentPatient = data;
        },
        error => {
          console.log(error);
        });
  }

  getInfo(id): void {
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.currentMedical = data;
          this.patientService.get(this.currentMedical.patient)
            .subscribe(
              data => {
                this.currentPatient = data;
              },
              error => {
                console.log(error);
              });
        },
        error => {
          console.log(error);
        });
  }

  updateMedical(): void {
    this.medicalService.update(this.currentMedical.id, this.currentMedical)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The medical record was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteMedical(): void {
    this.medicalService.delete(this.currentMedical.id)
      .subscribe(
        response => {
          this.router.navigate(['/patients/' + this.currentPatient.id]);
          this.patientService.get(this.currentPatient.id)
            .subscribe(results => {
              var temp = this.route.snapshot.paramMap.get('id');
              const data = {
                medicals: temp,
                delete: true
              }
              this.patientService.updateArray(this.currentPatient.id, data).subscribe(content => {
                console.log(content);
              });
            });
        },
        error => {
          console.log(error);
        });
  }
}
