import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})

export class PatientListComponent implements OnInit {
  currentDoctor = null;
  currentHospital = null;
  patients: any;
  doctors: any;
  hospitals: any;
  currentPatient = null;
  currentIndex = -1;
  title = '';
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private patientService: PatientsService,
    private hospitalService: HospitalsService,
    private doctorService: DoctorsService,
    private renderer: Renderer2,
    private router: Router) { }

  ngOnInit(): void {
    this.retrievePatients();
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
          this.hospitals = data;
          for (var i = 0; i < this.patients.length; i++) {
            if (this.patients[i].hospital == this.hospitals.id) {
              this.patients[i].hospital = this.hospitals.title;
            }
          }
        },
        error => {
          console.log(error);
        });
  }

  retrievePatients(): void {
    this.patientService.getAll()
      .subscribe(
        data => {
          this.patients = data;
          this.dtTrigger.next();

          this.patients.forEach(element => {
            this.getDoctor(element.doctor);
            this.getHospital(element.hospital);
          });

        },
        error => {
          console.log(error);
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