import { OnDestroy, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HospitalsService } from 'src/app/_services/hospitals.service';

@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.css']
})

export class HospitalListComponent implements OnInit {
  hospitals: any;
  currentHospital = null;
  currentIndex = -1;
  title = '';
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private hospitalService: HospitalsService) { }

  ngOnInit(): void {
    this.retrieveHospitals();
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