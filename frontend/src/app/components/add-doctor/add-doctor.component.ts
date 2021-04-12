import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})

export class AddDoctorComponent implements OnInit {
  doctor = {
    title: '',
    patients: '',
    hospital: '',
    username: '',
    email: '',
    password: '',
    roles: ''
  };
  username: string;
  private roles: string[];
  isLoggedIn = false;
  submitted = false;
  patients: any;
  hospitals: any;
  currentDoctor = null;
  currentIndex = -1;
  currentHospital = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      if (!this.roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/home'])
          .then(() => {
            window.location.reload();
          });
      } else {
        this.retrieveHospitals();
      }

      this.username = user.username;
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }
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

  setActiveHospital(hospital, index): void {
    this.currentIndex = index;
    this.currentHospital = hospital;
  }

  registerDoctor(): void {
    const register = {
      username: this.doctor.username,
      email: this.doctor.email,
      password: this.doctor.password,
      roles: ["doctor"]
    }

    this.authService.register(register).subscribe(
      data => {
        this.submitted = true;
        this.saveDoctor();
      },
      err => {
      }
    );
  }

  saveDoctor(): void {
    const data = {
      title: this.doctor.title,
      hospital: this.currentHospital.id,
      username: this.doctor.username
    };
    this.doctorService.create(data)
      .subscribe(
        response => {
          this.submitted = true;

          const addDoctor = {
            doctor: response,
            add: true
          }

          this.hospitalService.updateArrayDoctor(this.currentHospital.id, addDoctor).subscribe(response => {
          });
        },
        error => {
          console.log(error);
        });

    console.log(this.currentHospital.id);
    this.refresh();
  }

  refresh(): void {
    this.router.navigate(['/addDoctor'])
      .then(() => {
        window.location.reload();
      });
  }

  newDoctor(): void {
    this.submitted = false;
    this.doctor = {
      title: '',
      patients: '',
      hospital: '',
      username: '',
      email: '',
      password: '',
      roles: ''
    };
  }

}
