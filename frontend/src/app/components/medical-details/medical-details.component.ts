import { Component, OnInit } from '@angular/core';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from 'src/app/_services/patients.service';

@Component({
  selector: 'app-medical-details',
  templateUrl: './medical-details.component.html',
  styleUrls: ['./medical-details.component.css']
})
export class MedicalDetailsComponent implements OnInit {
  currentPatient = null;
  currentMedical = null;
  message = '';
  medicals: any;
  patients: any;
  currentIndex = -1;
  title = '';

  constructor(
    private medicalService: MedicalsService,
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getInfo(this.route.snapshot.paramMap.get('id'));
  }


  getPatient(id): void {
    this.patientService.get(id)
      .subscribe(
        data => {
          this.currentPatient = data;
        },
        error => {
          console.log(error);
        });
  }

  getInfo(id): void {
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.currentMedical = data;
          this.patientService.get(this.currentMedical.patient)
            .subscribe(
              data => {
                this.currentPatient = data;
              },
              error => {
                console.log(error);
              });
        },
        error => {
          console.log(error);
        });
  }

  updateMedical(): void {
    this.medicalService.update(this.currentMedical.id, this.currentMedical)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The medical record was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deleteMedical(): void {
    console.log(this.currentPatient.id);
    this.medicalService.delete(this.currentMedical.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/patients/' + this.currentPatient.id]);
        },
        error => {
          console.log(error);
        });
  }
}
