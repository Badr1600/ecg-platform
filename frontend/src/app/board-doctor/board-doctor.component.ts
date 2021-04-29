import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from '../_services/user.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { RequestsService } from 'src/app/_services/requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-board-doctor',
  templateUrl: './board-doctor.component.html',
  styleUrls: ['./board-doctor.component.css']
})
export class BoardDoctorComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  loggedIn = null;
  doctorRequests = [];
  completedDoctorRequests = [];
  patientRequests = [];
  completedPatientRequests = [];
  currentRequest = null;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  content: string;
  doctor: any;
  doctorId = null;
  currentHospital = null;
  currentDoctor = null;
  currentPatient = null;
  newHospital = null;
  oldHospital = null;
  newDoctor = null;
  oldDoctor = null;
  isValid = false;
  message = '';
  doctors: any;
  hospitals: any;
  currentIndex = -1;
  title = '';

  constructor(
    private userService: UserService,
    private patientService: PatientsService,
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
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

      if (!this.roles.includes('ROLE_DOCTOR')) {
        this.router.navigate(['/home'])
          .then(() => {
            window.location.reload();
          });
      } else {
        this.getLoggedIn();
        this.retrieveRequests();
      }
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }
  }

  getLoggedIn(): void {
    this.doctorService.getByUsername(this.username)
      .subscribe(
        data => {
          this.loggedIn = data; 
        });
  }

  retrieveRequests(): void {
    this.requestService.getAll()
      .subscribe(
        data => {
          data.forEach(element => {
            if (element.newDoctor == this.loggedIn.id) {
              if ((element.status == "Pending") && (element.type == "patient")) {
                this.patientRequests.push(element);
              }
  
              if (((element.status == "Accepted") && (element.type == "patient")) || ((element.status == "Denied") && (element.type == "patient"))) {
                this.completedPatientRequests.push(element);
              }
            }

            this.patientRequests.forEach(element => {
              this.getDoctor(element.newDoctor);
              this.getDoctor(element.currentDoctor);
            });

            this.completedPatientRequests.forEach(element => {
              this.getDoctor(element.newDoctor);
              this.getDoctor(element.currentDoctor);
            });
          });
          this.dtTrigger.next();
        },
        error => {
          console.log(error);
        });

    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  getDoctor(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.doctors = data;

          if (this.patientRequests != null) {
            for (var i = 0; i < this.patientRequests.length; i++) {
              if (this.patientRequests[i].currentDoctor == this.doctors.id) {
                this.patientRequests[i].doctorName = this.doctors.title;
              }
              if ((this.patientRequests[i].newDoctor == this.doctors.id) && (this.patientRequests[i].newDoctor != null)) {
                this.patientRequests[i].newDoctorName = this.doctors.title;
              }
            }
          }
          if (this.completedPatientRequests != null) {
            for (var i = 0; i < this.completedPatientRequests.length; i++) {
              if (this.completedPatientRequests[i].currentDoctor == this.doctors.id) {
                this.completedPatientRequests[i].doctorName = this.doctors.title;
              }
              if ((this.completedPatientRequests[i].newDoctor == this.doctors.id) && (this.completedPatientRequests[i].newDoctor != null)) {
                this.completedPatientRequests[i].newDoctorName = this.doctors.title;
              }
            }
          }
        },
        error => {
          console.log(error);
        });
  }


  /*KEEP INCASE NEEDED FOR HOSPITAL USE*/
  // getHospital(id): void {
  //   this.hospitalService.get(id)
  //     .subscribe(
  //       data => {
  //         this.hospitals = data;

  //         if (this.doctorRequests != null) {
  //           for (var i = 0; i < this.doctorRequests.length; i++) {
  //             if (this.doctorRequests[i].currentHospital == this.hospitals.id) {
  //               this.doctorRequests[i].currentHospitalName = this.hospitals.title;
  //             }
  //             if ((this.doctorRequests[i].newHospital == this.hospitals.id) && (this.doctorRequests[i].newHospital != null)) {
  //               this.doctorRequests[i].newHospitalName = this.hospitals.title;
  //             }
  //           }
  //         }
  //         if (this.completedDoctorRequests != null) {
  //           for (var i = 0; i < this.completedDoctorRequests.length; i++) {
  //             if (this.completedDoctorRequests[i].currentHospital == this.hospitals.id) {
  //               this.completedDoctorRequests[i].currentHospitalName = this.hospitals.title;
  //             }
  //             if ((this.completedDoctorRequests[i].newHospital == this.hospitals.id) && (this.completedDoctorRequests[i].newHospital != null)) {
  //               this.completedDoctorRequests[i].newHospitalName = this.hospitals.title;
  //             }
  //           }
  //         }
  //       },
  //       error => {
  //         console.log(error);
  //       });
  // }

  acceptPatientRequest(patientRequest): void {
    const data = {
      status: "Accepted",
      completedBy: this.username
    }

    this.requestService.update(patientRequest.id, data)
      .subscribe(data => { });

    if (patientRequest.requestType == "Transfer") {
      this.doctorService.get(patientRequest.newDoctor)
        .subscribe(
          response => {
            this.newDoctor = response;
            this.patientService.get(patientRequest.patientId)
              .subscribe(
                data => {
                  this.currentPatient = data;
                  this.oldDoctor = this.currentPatient.doctor;
                  this.oldHospital = this.currentPatient.hospital[0];
                  this.newHospital = patientRequest.newHospital;

                  if (this.newDoctor != null) {
                    this.currentPatient.doctor = [];
                    this.currentPatient.doctor.push(this.newDoctor.id);
                    this.currentDoctor = this.newDoctor;
                    this.currentPatient.hospital = this.currentDoctor.hospital[0];
                  }
                  this.patientService.update(this.currentPatient.id, this.currentPatient)
                    .subscribe(
                      response => {
                        this.message = 'The patient was updated successfully!';

                        const patientRemove = {
                          patient: this.currentPatient.id,
                          deletePatient: true
                        }

                        this.doctorService.updateArray(this.oldDoctor, patientRemove).subscribe(response => {
                        });

                        const patientAdd = {
                          patient: this.currentPatient.id,
                          addPatient: true
                        }

                        this.doctorService.updateArray(this.newDoctor.id, patientAdd).subscribe(content => {
                        });

                        const hospitalRemove = {
                          patient: [this.currentPatient.id],
                          deletePatient: true
                        }

                        this.hospitalService.updateArrayPatient(this.oldHospital, hospitalRemove).subscribe(content => {
                        });

                        const hospitalAdd = {
                          patient: [this.currentPatient.id],
                          addPatient: true
                        }

                        this.hospitalService.updateArrayPatient(this.newHospital, hospitalAdd).subscribe(content => {
                        });

                        this.refresh();
                      },
                      error => {
                        console.log(error);
                      });
                });
          });
    }
    if (patientRequest.requestType == "Delete") {
      this.patientService.get(patientRequest.patientId)
        .subscribe(
          data => {
            this.currentPatient = data;
            this.patientService.delete(this.currentPatient.id)
              .subscribe(
                response => {

                  const patientRemove = {
                    patient: this.currentPatient.id,
                    deletePatient: true
                  }

                  this.doctorService.updateArray(patientRequest.doctorId, patientRemove).subscribe(response => {
                  });


                  const hospitalRemove = {
                    patient: this.currentPatient.id,
                    deletePatient: true
                  }

                  this.hospitalService.updateArrayPatient(patientRequest.currentHospital, hospitalRemove).subscribe(content => {
                  });

                  this.refresh();
                },
                error => {
                  console.log(error);
                });

            this.authService.delete(this.currentPatient.username)
              .subscribe(
                response => {
                },
                error => {
                  console.log(error);
                });
          });
    }
  }

  denyPatientRequest(patientRequest): void {
    const data = {
      status: "Denied",
      completedBy: this.username
    }

    this.requestService.update(patientRequest.id, data)
      .subscribe(
        data => {
          this.refresh();
        });
  }

  refresh(): void {
    this.router.navigate(['/doctor'])
      .then(() => {
        window.location.reload();
      });
  }

  setActiveRequest(request): void {
    this.currentRequest = request;
  }

}
