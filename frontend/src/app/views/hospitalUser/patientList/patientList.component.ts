import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PatientsService } from '../../../_services/patients.service';
import { DoctorsService } from '../../../_services/doctors.service';
import { HospitalsService } from '../../../_services/hospitals.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patientList.component.html',
  styleUrls: ['./patientList.component.css']
})

export class hospitalUserPatientComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  currentDoctor = null;
  currentHospital = null;
  patients: any;
  doctors: any;
  hospital: any;
  currentPatient = null;
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

      if (this.roles.includes('ROLE_HOSPITAL')) {
        this.username = user.username;
        this.retrievePatients();
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
          this.doctors = data;
          for (var i = 0; i < this.patients.length; i++) {
            if (this.patients[i].doctor == this.doctors.id) {
              this.patients[i].doctor = this.doctors.title;
            }
          }
        },
        error => {
          console.log(error);
        });
  }

  getHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.hospital = data;
          for (var i = 0; i < this.patients.length; i++) {
            if (this.patients[i].hospital == this.hospital.id) {
              this.patients[i].hospital = this.hospital.title;
            }
          }
        },
        error => {
          console.log(error);
        });
  }

  retrievePatients(): void {
    this.hospitalService.getByUsername(this.username)
      .subscribe(
        data => {
          this.patients = [];
          this.hospital = data;
          this.patientService.getAll()
            .subscribe(
              data => {
                data.forEach(element => {
                  if (this.hospital.patients.includes(element.id)) {
                    this.patients.push(element);
                  }
                });

                this.dtTrigger.next();
                this.patients.forEach(element => {
                  this.getDoctor(element.doctor);
                  this.getHospital(element.hospital);
                });

              },
              error => {
                console.log(error);
              });
        });


    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  refreshList(): void {
    this.retrievePatients();
    this.currentPatient = null;
    this.currentIndex = -1;
  }

  setActivePatient(patient): void {
    this.currentPatient = patient;
  }

  removeAllPatients(): void {
    this.patientService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.retrievePatients();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.patientService.findByTitle(this.title)
      .subscribe(
        data => {
          this.patients = data;
        },
        error => {
          console.log(error);
        });
  }
}