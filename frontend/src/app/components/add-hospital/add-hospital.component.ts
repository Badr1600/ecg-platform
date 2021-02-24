import { Component, OnInit } from '@angular/core';
import { HospitalsService } from 'src/app/_services/hospitals.service';

@Component({
  selector: 'app-add-hospital',
  templateUrl: './add-hospital.component.html',
  styleUrls: ['./add-hospital.component.css']
})
export class AddHospitalComponent implements OnInit {
  hospital = {
    title: '',
    location: ''
  };
  submitted = false;

  constructor(private hospitalService: HospitalsService) { }

  ngOnInit(): void {
  }

  saveHospital(): void {
    const data = {
      title: this.hospital.title,
      location: this.hospital.location
    };

    this.hospitalService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

  newHospital(): void {
    this.submitted = false;
    this.hospital = {
      title: '',
      location: ''
    };
  }

}
