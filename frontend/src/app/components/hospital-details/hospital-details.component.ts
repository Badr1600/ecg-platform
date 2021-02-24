import { Component, OnInit } from '@angular/core';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.css']
})
export class HospitalDetailsComponent implements OnInit {
  currentHospital = null;
  message = '';

  constructor(
    private hospitalService: HospitalsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getHospital(this.route.snapshot.paramMap.get('id'));
  }

  getHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.currentHospital = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateHospital(): void {
    this.hospitalService.update(this.currentHospital.id, this.currentHospital)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The hospital was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteHospital(): void {
    this.hospitalService.delete(this.currentHospital.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/hospitals']);
        },
        error => {
          console.log(error);
        });
  }
}
