import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { RecordsService } from 'src/app/_services/records.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.css']
})

export class PatientViewComponent implements OnInit {
  patients: any;
  doctors: any;
  hospitals: any;
  medicals: any;
  currentDoctor = null;
  currentPatient = null;
  currentHospital = null;
  currentMedical = null;
  currentIndex = -1;
  title = '';

  fileToUpload: File = null;

  constructor(
    private patientService: PatientsService,
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
    private medicalService: MedicalsService,
    private recordService: RecordsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getPatient(this.route.snapshot.paramMap.get('id'));
  }

  patientId = this.route.snapshot.paramMap.get('id');

  retrieveMedicals(id): void {
    var temp = [];
    this.patientService.get(id)
      .subscribe(
        data => {
          this.medicalService.getAll()
            .subscribe(
              results => {
                results.forEach(element => {
                  if (element.patient == data.id) {
                    temp.push(element);
                  }
                  this.medicals = temp;
                });
              }
            )
        },
        error => {
          console.log(error);
        });
  }

  fileUpload(files: FileList) {
    this.fileToUpload = files.item(0);
    this.recordService.uploadFile(this.patientId, this.fileToUpload);
  }

  getPatient(id): void {
    this.patientService.get(id)
      .subscribe(
        data => {
          this.currentPatient = data;
          this.getHospital(this.currentPatient.hospital);
          this.getDoctors(this.currentPatient.doctor);
          this.retrieveMedicals(this.currentPatient.id);
        },
        error => {
          console.log(error);
        });
  }

  getDoctors(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.currentDoctor = data;
        },
        error => {
          console.log(error);
        });
  }

  getHospital(id): void {
    this.hospitalService.get(id)
      .subscribe(
        data => {
          this.currentHospital = data;
        },
        error => {
          console.log(error);
        });
  }

  getMedical(id): void {
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.currentMedical = data;
          this.getPatient(this.currentMedical.patient);
        },
        error => {
          console.log(error);
        });
  }

  setActiveDoctor(doctor, index): void {
    this.currentDoctor = doctor;
    this.currentIndex = index;
  }

  setActiveMedical(medical, index): void {
    this.currentMedical = medical;
    this.currentIndex = index;
    this.router.navigate(['/medicalsView/' + this.currentMedical.id]);
  }

  refreshview(): void {
    this.currentPatient = null;
    this.currentIndex = -1;
  }

  setActivePatient(patient, index): void {
    this.currentPatient = patient;
    this.currentIndex = index;
  }

  searchTitle(): void {
    this.patientService.findByTitle(this.title)
      .subscribe(
        data => {
          this.patients = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
}