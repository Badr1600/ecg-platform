import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PatientsService } from '../../../_services/patients.service';
import { DoctorsService } from '../../../_services/doctors.service';
import { HospitalsService } from '../../../_services/hospitals.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patientInfo.component.html',
  styleUrls: ['./patientInfo.component.css']
})

export class patientUserInfoComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  currentDoctor = null;
  currentHospital = null;
  patient: any;
  doctor: any;
  hospitals: any;
  medicals: any;
  currentPatient = null;
  currentMedical = null;
  currentIndex = -1;
  title = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private tokenStorageService: TokenStorageService,
    private patientService: PatientsService,
    private hospitalService: HospitalsService,
    private doctorService: DoctorsService,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;

      if (this.roles.includes('ROLE_PATIENT')) {
        this.retrievePatient();
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getDoctor(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.doctor = data;
          this.patient.doctor = this.doctor.title;
        },
        error => {
          console.log(error);
        });
  }

  getHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.hospitals = data;
          this.patient.hospital = this.hospitals.title;
        },
        error => {
          console.log(error);
        });
  }

  retrievePatient(): void {
    this.patientService.getByUsername(this.username)
      .subscribe(
        data => {
          this.patient = data;
          this.getDoctor(this.patient.doctor);
          this.getHospital(this.patient.hospital);
        },
        error => {
          console.log(error);
        });

    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  refreshList(): void {
    this.retrievePatient();
    this.currentPatient = null;
    this.currentIndex = -1;
  }

  setActivePatient(patient): void {
    this.currentPatient = patient;
  }

  setActiveMedical(medical, index): void {
    this.currentMedical = medical;
    this.currentIndex = index;
    this.router.navigate(['/medicalsView/' + this.currentMedical.id]);
  }

  removeAllPatients(): void {
    this.patientService.deleteAll()
      .subscribe(
        response => {
          this.retrievePatient();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.patientService.findByTitle(this.title)
      .subscribe(
        data => {
          this.patient = data;
        },
        error => {
          console.log(error);
        });
  }
}