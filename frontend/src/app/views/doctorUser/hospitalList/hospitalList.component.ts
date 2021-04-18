import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DoctorsService } from '../../../_services/doctors.service';
import { HospitalsService } from '../../../_services/hospitals.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospitalList.component.html',
  styleUrls: ['./hospitalList.component.css']
})

export class doctorUserHospitalComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  doctor: any;
  hospitals: any;
  currentHospital = null;
  currentIndex = -1;
  title = '';
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
    private tokenStorageService: TokenStorageService,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      if (this.roles.includes('ROLE_DOCTOR')) {
        this.username = user.username;
        this.retrieveHospitals();
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

  retrieveHospitals(): void {
    this.doctorService.getByUsername(this.username)
      .subscribe(
        data => {
          this.hospitals = [];
          this.doctor = data;
          this.hospitalService.getAll()
            .subscribe(
              data => {
                data.forEach(element => {
                  if (this.doctor.hospital.includes(element.id)) {
                    this.hospitals.push(element);
                  }
                });
                this.dtTrigger.next();
              },
              error => {
                console.log(error);
              });
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
          console.log(response);
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