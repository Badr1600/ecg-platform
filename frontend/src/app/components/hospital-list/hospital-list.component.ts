import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.css']
})

export class HospitalListComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  hospitals: any;
  currentHospital = null;
  currentIndex = -1;
  title = '';
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private hospitalService: HospitalsService,
    private tokenStorageService: TokenStorageService,
    private router: Router) { }

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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  retrieveHospitals(): void {
    this.hospitalService.getAll()
      .subscribe(
        data => {
          this.hospitals = data;
          this.dtTrigger.next();
        },
        error => {
          console.log(error);
        });

    this.dtOptions = {
      pagingType: 'full_numbers',
    };
  }

  refreshList(): void {
    this.retrieveHospitals();
    this.currentHospital = null;
    this.currentIndex = -1;
  }

  setActiveHospital(hospital): void {
    this.currentHospital = hospital;
  }

  removeAllHospitals(): void {
    this.hospitalService.deleteAll()
      .subscribe(
        response => {
          this.retrieveHospitals();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.hospitalService.findByTitle(this.title)
      .subscribe(
        data => {
          this.hospitals = data;
        },
        error => {
          console.log(error);
        });
  }
}