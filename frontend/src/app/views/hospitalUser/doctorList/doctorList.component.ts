import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DoctorsService } from '../../../_services/doctors.service';
import { HospitalsService } from '../../../_services/hospitals.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctorList.component.html',
  styleUrls: ['./doctorList.component.css']
})

export class hospitalUserDoctorComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  hospital: any;
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

      if (this.roles.includes('ROLE_HOSPITAL')) {
        this.username = user.username;
        this.retrieveDoctors();
        
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

  getHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.hospital = data;

          for (var i = 0; i < this.doctors.length; i++) {
            if (this.doctors[i].hospital == this.hospital.id) {
              this.doctors[i].hospital = this.hospital.title;
            }
          }
        },
        error => {
          console.log(error);
        });
  }

  retrieveDoctors(): void {
    this.hospitalService.getByUsername(this.username)
      .subscribe(
        data => {
          this.doctors = [];
          this.hospital = data;
          this.doctorService.getAll()
            .subscribe(
              data => {
                data.forEach(element => {
                  if (this.hospital.doctors.includes(element.id)) {
                    this.doctors.push(element);
                  }
                });
                this.dtTrigger.next();
                this.doctors.forEach(element => {
                  this.getHospital(element.hospital);
                });
              },
              error => {
                console.log(error);
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