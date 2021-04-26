import { Component, OnInit } from '@angular/core';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { RequestsService } from 'src/app/_services/requests.service';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  doctor: any;
  doctorId = null;
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
      this.message = '';
      this.getDoctor(this.doctorId);
      this.retrieveHospitals();
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.doctor.hospital) {
              this.message = '';
              this.getDoctor(this.doctorId);
              this.retrieveHospitals();
            }
          }
        )
    } else if ((this.roles.includes('ROLE_DOCTOR'))) {
      this.doctorService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.doctor.id) {
              this.message = '';
              this.getDoctor(this.doctorId);
              this.retrieveHospitals();
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
    const data = {
      title: this.currentDoctor.title,
      age: this.currentDoctor.age,
      gender: this.currentDoctor.gender
    }

    this.doctorService.update(this.currentDoctor.id, data).subscribe();

    this.message = 'Doctor information updated sucessfully.';
  }

  transferDoctor(): void {
    this.oldHospital = this.currentHospital;
    if (this.newHospital != null) {
      this.currentDoctor.hospital = [];
      this.currentDoctor.hospital.push(this.newHospital.id);
      this.currentHospital = this.newHospital;
    }

    this.requestService.getAll()
      .subscribe(
        data => {
          var duplicate = false;

          if (data) {
            const request = {
              title: this.currentDoctor.title,
              requestedBy: this.username,
              requestType: "Transfer",
              doctorId: this.currentDoctor.id,
              currentHospital: this.oldHospital.id,
              newHospital: this.newHospital.id,
              status: "Pending"
            }
            data.forEach(element => {
              if ((element.doctorId == this.currentDoctor.id) && (element.status == "Pending")) {
                duplicate = true;
                this.message = "There is already an active request for this doctor."
              }
            });

            if (!duplicate) {
              this.requestService.createDoctorReq(request)
                .subscribe(
                  response => {
                    this.refresh();
                  });
            }
          }
        });
  }

  refresh(): void {
    this.router.navigate(['/doctors'])
      .then(() => {
        window.location.reload();
      });
  }

  deleteDoctor(): void {
    this.oldHospital = this.currentHospital;
    this.requestService.getAll()
      .subscribe(
        data => {
          var duplicate = false;

          if (data) {
            const request = {
              title: this.currentDoctor.title,
              requestedBy: this.username,
              requestType: "Delete",
              doctorId: this.currentDoctor.id,
              currentHospital: this.oldHospital.id,
              newHospital: "",
              status: "Pending"
            }
            data.forEach(element => {
              if ((element.doctorId == this.currentDoctor.id) && (element.status == "Pending")) {
                duplicate = true;
                this.message = "There is already an active request for this doctor."
              }
            });

            if (!duplicate) {
              this.requestService.createDoctorReq(request)
                .subscribe(
                  response => {
                    console.log(response);
                    this.refresh();
                  });
            }
          }
        });
  }
}
