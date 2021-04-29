import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { RecordsService } from 'src/app/_services/records.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css']
})

export class PatientViewComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  message = '';
  patientId = null;
  patient: any;
  patients: any;
  doctors: any;
  hospitals: any;
  medicals: any;
  currentDoctor = null;
  currentPatient = null;
  currentHospital = null;
  currentMedical = null;
  currentIndex = -1;
  title = '';
  fileToUpload: File = null;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private patientService: PatientsService,
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
    private medicalService: MedicalsService,
    private recordService: RecordsService,
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  authorizeLogin(username): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.retrievePatient(this.patientId);
    if ((this.roles.includes('ROLE_ADMIN'))) {
      this.message = '';
      this.getPatient(this.patientId);
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.patient.hospital) {
              this.message = '';
              this.getPatient(this.patientId);
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
            }
          }
        )
    } else if ((this.roles.includes('ROLE_PATIENT'))) {
      this.patientService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.patient.id) {
              this.message = '';
              this.getPatient(this.patientId);
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


  retrieveMedicals(id): void {
    var temp = [];
    this.patientService.get(id)
      .subscribe(
        data => {
          this.medicalService.getAll()
            .subscribe(
              results => {
                results.forEach(element => {
                  if (element.patient == data.id) {
                    temp.push(element);
                  }
                  this.medicals = temp;
                });
                this.dtTrigger.next();
              }
            )
        },
        error => {
          console.log(error);
        });
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  fileUpload(files: FileList) {
    this.fileToUpload = files.item(0);
    this.recordService.uploadFile(this.patientId, this.fileToUpload);
  }

  getPatient(id): void {
    this.patientService.get(id)
      .subscribe(
        data => {
          this.currentPatient = data;
          this.getHospital(this.currentPatient.hospital);
          this.getDoctors(this.currentPatient.doctor);
          this.retrieveMedicals(this.currentPatient.id);
        },
        error => {
          console.log(error);
        });
  }

  getDoctors(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.currentDoctor = data;
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

  getMedical(id): void {
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.currentMedical = data;
          this.getPatient(this.currentMedical.patient);
        },
        error => {
          console.log(error);
        });
  }

  setActiveDoctor(doctor, index): void {
    this.currentDoctor = doctor;
    this.currentIndex = index;
  }

  setActiveMedical(medical, index): void {
    this.currentMedical = medical;
    this.currentIndex = index;
  }

  refreshview(): void {
    this.currentPatient = null;
    this.currentIndex = -1;
  }

  setActivePatient(patient, index): void {
    this.currentPatient = patient;
    this.currentIndex = index;
  }

  searchTitle(): void {
    this.patientService.findByTitle(this.title)
      .subscribe(
        data => {
          this.patients = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
}