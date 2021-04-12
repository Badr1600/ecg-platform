import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})

export class DoctorListComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  hospitals: any;
  doctors: any;
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.hospitals = data;

          for (var i = 0; i < this.doctors.length; i++) {
            if (this.doctors[i].hospital == this.hospitals.id) {
              this.doctors[i].hospital = this.hospitals.title;
            }
          }
        },
        error => {
          console.log(error);
        });
  }

  retrieveDoctors(): void {
    this.doctorService.getAll()
      .subscribe(
        data => {
          this.doctors = data;
          this.dtTrigger.next();

          this.doctors.forEach(element => {
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
    this.retrieveDoctors();
    this.currentDoctor = null;
    this.currentIndex = -1;
  }

  setActiveDoctor(doctor): void {
    this.currentDoctor = doctor;
  }

  removeAllDoctors(): void {
    this.doctorService.deleteAll()
      .subscribe(
        response => {
          this.retrieveDoctors();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.doctorService.findByTitle(this.name)
      .subscribe(
        data => {
          this.doctors = data;
        },
        error => {
          console.log(error);
        });
  }
}