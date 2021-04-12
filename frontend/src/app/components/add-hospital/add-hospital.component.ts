import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-add-hospital',
  templateUrl: './add-hospital.component.html',
  styleUrls: ['./add-hospital.component.css']
})
export class AddHospitalComponent implements OnInit {
  hospital = {
    title: '',
    location: '',
    username: '',
    email: '',
    password: '',
    roles: ''
  };
  username: string;
  private roles: string[];
  isLoggedIn = false;
  submitted = false;
  isValid = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
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
      }

      this.username = user.username;
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }
  }

  registerHospital(): void {
    const register = {
      username: this.hospital.username,
      email: this.hospital.email,
      password: this.hospital.password,
      roles: ["hospital"]
    }

    this.authService.register(register).subscribe(
      data => {
        this.submitted = true;
        this.saveHospital();
      },
      err => {
      }
    );
  }

  saveHospital(): void {
    const data = {
      title: this.hospital.title,
      location: this.hospital.location,
      username: this.hospital.username
    };

    this.hospitalService.create(data)
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
    this.router.navigate(['/addHospital'])
      .then(() => {
        window.location.reload();
      });
  }

  newHospital(): void {
    this.submitted = false;
    this.hospital = {
      title: '',
      location: '',
      username: '',
      email: '',
      password: '',
      roles: '',
    };
  }

}
