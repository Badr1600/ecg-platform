import { Component, OnInit } from '@angular/core';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.css']
})
export class HospitalDetailsComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  hospital: any;
  hospitalId = null;
  currentHospital = null;
  message = '';

  constructor(
    private hospitalService: HospitalsService,
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
    this.hospitalId = this.route.snapshot.paramMap.get('id');
    this.retrieveHospital(this.hospitalId);
    if ((this.roles.includes('ROLE_ADMIN'))) {
      this.message = '';
      this.getHospital(this.hospitalId);
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.id == this.hospital.id) {
              this.message = '';
              this.getHospital(this.hospitalId);
            }
          }
        )
    }
  }

  retrieveHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.hospital = data;
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

  updateHospital(): void {
    this.hospitalService.update(this.currentHospital.id, this.currentHospital)
      .subscribe(
        response => {
          this.message = 'The hospital was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  refresh(): void {
    this.router.navigate(['/hospitals'])
      .then(() => {
        window.location.reload();
      });
  }

  deleteHospital(): void {
    this.hospitalService.delete(this.currentHospital.id)
      .subscribe(
        response => {
        },
        error => {
          console.log(error);
        });

    this.authService.delete(this.currentHospital.username)
      .subscribe(
        response => {
        },
        error => {
          console.log(error);
        });
    this.refresh();
  }
}
