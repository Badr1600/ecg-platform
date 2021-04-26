import { Component, OnInit } from '@angular/core';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { RequestsService } from 'src/app/_services/requests.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  patient: any;
  patientId = null;
  currentPatient = null;
  currentDoctor = null;
  currentMedical = null;
  currentHospital = null;
  selected = false;
  newDoctor = null;
  oldDoctor = null;
  newHospital = null;
  oldHospital = null;
  message = '';
  hospitals: any;
  patients: any;
  doctors: any;
  medicals: any;
  currentIndexDoctor = -1;
  currentIndexHospital = -1;
  currentIndexMedical = -1;
  title = '';

  constructor(
    private hospitalService: HospitalsService,
    private patientService: PatientsService,
    private doctorService: DoctorsService,
    private medicalService: MedicalsService,
    private requestService: RequestsService,
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
      this.authorizeLogin(this.username);
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }
  }

  authorizeLogin(username): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.retrievePatient(this.patientId);
    if ((this.roles.includes('ROLE_ADMIN'))) {
      this.message = '';
      this.getPatient(this.patientId);
      this.retrieveDoctors();
      this.retrieveMedicals(this.patientId);
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.patient.hospital) {
              this.message = '';
              this.getPatient(this.patientId);
              this.retrieveDoctors();
              this.retrieveMedicals(this.patientId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_DOCTOR'))) {
      this.doctorService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.patient.doctor) {
              this.message = '';
              this.getPatient(this.patientId);
              this.retrieveDoctors();
              this.retrieveMedicals(this.patientId);
            }
          }
        )
    }
  }

  retrievePatient(id): void {
    this.patientService.get(id)
      .subscribe(
        data => {
          this.patient = data;
        },
        error => {
          console.log(error);
        });
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

  retrieveMedicals(id): void {
    var temp = [];
    this.patientService.get(id)
      .subscribe(
        data => {
          this.currentMedical = data;
          this.medicalService.getAll()
            .subscribe(
              results => {
                results.forEach(element => {
                  if (element.patient == data.id) {
                    temp.push(element);
                  }
                  this.medicals = temp;
                });
              }
            )
        },
        error => {
          console.log(error);
        });
  }

  retrieveHospitals(): void {
    var temp = [];
    this.hospitalService.getAll()
      .subscribe(
        data => {
          data.forEach(element => {
            if (this.newDoctor.hospital == element.id) {
              temp.push(element);
            }
            this.hospitals = temp;
          });
        },
        error => {
          console.log(error);
        });
  }

  setActiveMedical(medical, index): void {
    this.currentIndexMedical = index;
    this.currentMedical = medical;
    this.selected = true;
    console.log(this.currentMedical.title);
  }

  setActiveHospital(hospital, index): void {
    this.currentIndexHospital = index;
    this.patientService.update(this.currentPatient.id, this.currentPatient)
      .subscribe(
        data => {
          this.newHospital = hospital;
        },
        error => {
          console.log(error);
        });
  }

  setActiveDoctor(doctor, index): void {
    this.currentIndexDoctor = index;
    this.newDoctor = doctor;
    this.retrieveHospitals();
    this.oldDoctor = this.currentDoctor;
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
          this.getDoctor(this.currentPatient.doctor);
          this.getHospital(this.currentPatient.hospital);
        },
        error => {
          console.log(error);
        });
  }

  updatePatient(): void {
    const data = {
      title: this.currentPatient.title,
      age: this.currentPatient.age,
      gender: this.currentPatient.gender
    }

    this.patientService.update(this.currentPatient.id, data).subscribe();
    
    this.message = 'Patient information updated sucessfully.';
  }

  transferPatient(): void {
    this.oldDoctor = this.currentPatient.doctor[0];
    this.oldHospital = this.currentHospital;
    if (this.newDoctor != null) {
      this.currentPatient.doctor = [];
      this.currentPatient.doctor.push(this.newDoctor.id);
      this.currentDoctor = this.newDoctor;
      this.currentHospital = this.hospitals[0];
      this.currentPatient.hospital = this.currentDoctor.hospital[0];
    }

    this.requestService.getAll()
      .subscribe(
        data => {
          var duplicate = false;

          if (data) {
            const request = {
              title: this.currentPatient.title,
              requestType: "Transfer",
              requestedBy: this.username,
              patientId: this.currentPatient.id,
              currentDoctor: this.oldDoctor,
              newDoctor: this.newDoctor.id,
              currentHospital: this.oldHospital.id,
              newHospital: this.currentPatient.hospital,
              status: "Pending"
            }
            data.forEach(element => {
              if ((element.patientId == this.currentPatient.id) && (element.status == "Pending")) {
                duplicate = true;
                this.message = "There is already an active request for this doctor."
              }
            });

            if (!duplicate) {
              this.requestService.createPatientReq(request)
                .subscribe(
                  response => {
                  });
            }
          }
        });
  }

  refresh(): void {
    this.router.navigate(['/patients'])
      .then(() => {
        window.location.reload();
      });
  }

  deletePatient(): void {
    this.oldDoctor = this.currentPatient.doctor[0];
    this.oldHospital = this.currentHospital;
    this.requestService.getAll()
      .subscribe(
        data => {
          var duplicate = false;

          if (data) {
            const request = {
              title: this.currentPatient.title,
              requestedBy: this.username,
              requestType: "Delete",
              patientId: this.currentPatient.id,
              currentDoctor: this.oldDoctor,
              newDoctor: "",
              currentHospital: this.oldHospital.id,
              newHospital: "",
              status: "Pending"
            }
            data.forEach(element => {
              if ((element.patientId == this.currentPatient.id) && (element.status == "Pending")) {
                duplicate = true;
                this.message = "There is already an active request for this doctor."
              }
            });

            if (!duplicate) {
              this.requestService.createPatientReq(request)
                .subscribe(
                  response => {
                    this.refresh();
                  });
            }
          }
        });
  }
}