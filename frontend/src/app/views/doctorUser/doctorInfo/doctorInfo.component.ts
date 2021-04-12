import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DoctorsService } from '../../../_services/doctors.service';
import { HospitalsService } from '../../../_services/hospitals.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctorInfo.component.html',
  styleUrls: ['./doctorInfo.component.css']
})

export class doctorUserInfoComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  hospitals: any;
  doctor: any;
  currentHospital = null;
  currentDoctor = null;
  currentIndex = -1;
  name = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private tokenStorageService: TokenStorageService,
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      if (this.roles.includes('ROLE_DOCTOR')) {
        this.username = user.username;
        this.retrieveDoctor();
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

  getHospitals(id): void {
    this.hospitalService.getAll()
      .subscribe(
        data => {
          this.hospitals = [];
          data.forEach(element => {
            if (id == element.id) {
              this.hospitals.push(element);
            }
          });
        },
        error => {
          console.log(error);
        });
  }

  retrieveDoctor(): void {
    this.doctorService.getByUsername(this.username)
      .subscribe(
        data => {
          this.doctor = data;
          this.getHospitals(this.doctor.hospital);
        },
        error => {
          console.log(error);
        });

    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  refreshList(): void {
    this.retrieveDoctor();
    this.currentDoctor = null;
    this.currentIndex = -1;
  }

  setActiveDoctor(doctor): void {
    this.currentDoctor = doctor;
  }

  setActiveHospital(hospital, index): void {
    this.currentHospital = hospital;
    this.currentIndex = index;
  }

  removeAllDoctors(): void {
    this.doctorService.deleteAll()
      .subscribe(
        response => {
          this.retrieveDoctor();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.doctorService.findByTitle(this.name)
      .subscribe(
        data => {
          this.doctor = data;
        },
        error => {
          console.log(error);
        });
  }
}