import { Component, OnInit } from '@angular/core';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-medical',
  templateUrl: './add-medical.component.html',
  styleUrls: ['./add-medical.component.css']
})
export class AddMedicalComponent implements OnInit {
  medical = {
    title: '',
    type: '',
    patient: '',
  };
  id = '';
  submitted = false;
  medicals: any;
  patients: any;
  currentPatient = null;
  currentIndex = -1;
  currentMedical = null;

  constructor(
    private medicalService: MedicalsService,
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.retrievePatients();
  }

  retrievePatients(): void {
    this.patientService.getAll()
      .subscribe(
        data => {
          this.patients = data;
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrievePatients();
    this.currentPatient = null;
    this.currentIndex = -1;
  }

  setActiveDoctor(doctor, index): void {
    this.currentIndex = index;
    this.currentPatient = doctor;
  }

  getMedical(title): void {
    this.medicalService.findByTitle(title)
      .subscribe(
        data => {
          this.currentMedical = data;
          console.log(this.currentMedical);
        },
        error => {
          console.log(error);
        });
  }

  saveMedical(): void {
    const data = {
      title: this.medical.title,
      type: this.medical.type,
      patient: this.id
    };

    this.medicalService.create(data)
      .subscribe(
        response => {
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
    this.getMedical(data.title);
  }

  /*setMedical(): void {
    
  }*/

  newMedical(): void {
    this.submitted = false;
    this.medical = {
      title: '',
      patient: '',
      type: ''
    };
  }

}
