import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {
  patient = {
    title: '',
    age: '',
    gender: '',
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
  doctors: any;
  currentDoctor = null;
  currentIndex = -1;
  currentPatient = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private patientService: PatientsService,
    private tokenStorageService: TokenStorageService,
    private doctorService: DoctorsService) { }


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
        this.retrieveDoctors();
      }
      this.username = user.username;
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }
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

  refreshList(): void {
    this.retrieveDoctors();
    this.currentDoctor = null;
    this.currentIndex = -1;
  }

  setActiveDoctor(doctor, index): void {
    this.currentIndex = index;
    this.currentDoctor = doctor;
  }

  registerPatient(): void {
    const register = {
      username: this.patient.username,
      email: this.patient.email,
      password: this.patient.password,
      roles: ["patient"]
    }

    console.log(register);

    this.authService.register(register).subscribe(
      data => {
        console.log(data);
        this.submitted = true;
        this.savePatient();
      },
      err => {
      }
    );
  }

  savePatient(): void {
    const data = {
      title: this.patient.title,
      age: this.patient.age,
      gender: this.patient.gender,
      username: this.patient.username,
    };

    this.patientService.create(data)
      .subscribe(
        response => {
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
    this.refresh();

  }

  refresh(): void {
    this.router.navigate(['/addPatient'])
      .then(() => {
        window.location.reload();
      });
  }

  newPatient(): void {
    this.submitted = false;
    this.patient = {
      title: '',
      age: '',
      gender: '',
      username: '',
      email: '',
      password: '',
      roles: ''
    };
  }

}
