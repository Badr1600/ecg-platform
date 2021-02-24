import { Component, OnInit } from '@angular/core';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  currentPatient = null;
  currentDoctor = null;
  currentMedical = null;
  currentHospital = null;
  selected = false;
  newDoctor = null;
  newHospital = null;
  message = '';
  hospitals: any;
  patients: any;
  doctors: any;
  medicals: any;
  currentIndexDoctor = -1;
  currentIndexHospital = -1;
  currentIndexMedical = -1;
  title = '';

  constructor(
    private hospitalService: HospitalsService,
    private patientService: PatientsService,
    private doctorService: DoctorsService,
    private medicalService: MedicalsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    this.getPatient(this.route.snapshot.paramMap.get('id'));
    this.retrieveDoctors();
    this.retrieveMedicals(this.route.snapshot.paramMap.get('id'));
  }

  retrieveDoctors(): void {
    this.doctorService.getAll()
      .subscribe(
        data => {
          this.doctors = data;
        },
        error => {
          console.log(error);
        });
  }

  retrieveMedicals(id): void {
    var temp = [];
    this.patientService.get(id)
      .subscribe(
        data => {
          this.currentMedical = data;
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

  retrieveHospitals(): void {
    var temp = [];
    this.hospitalService.getAll()
      .subscribe(
        data => {
          data.forEach(element => {
            if (this.newDoctor.hospital == element.id) {
              temp.push(element);
            }
            this.hospitals = temp;
          });
        },
        error => {
          console.log(error);
        });
  }

  setActiveMedical(medical, index): void {
    this.currentIndexMedical = index;
    this.currentMedical = medical;
    this.selected = true;
    console.log(this.currentMedical.title);
  }

  setActiveHospital(hospital, index): void {
    this.currentIndexHospital = index;
    this.patientService.update(this.currentPatient.id, this.currentPatient)
      .subscribe(
        data => {
          this.newHospital = hospital;
        },
        error => {
          console.log(error);
        });
  }

  setActiveDoctor(doctor, index): void {
    this.currentIndexDoctor = index;
    this.patientService.update(this.currentPatient.id, this.currentPatient)
      .subscribe(
        data => {
          this.newDoctor = doctor;
          this.retrieveHospitals();
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

  getDoctor(id): void {
    this.doctorService.get(id)
      .subscribe(
        data => {
          this.currentDoctor = data;
        },
        error => {
          console.log(error);
        });
  }

  getPatient(id): void {
    this.patientService.get(id)
      .subscribe(
        data => {
          this.currentPatient = data;
          this.getDoctor(this.currentPatient.doctor);
          this.getHospital(this.currentPatient.hospital);
        },
        error => {
          console.log(error);
        });
  }

  updatePatient(): void {
    if (this.newDoctor != null) {
      this.currentPatient.doctor = [];
      this.currentPatient.doctor.push(this.newDoctor.id);
      this.currentDoctor = this.newDoctor;
    }

    if (this.newHospital != null) {
      this.currentPatient.hospital = [];
      this.currentPatient.hospital.push(this.newHospital.id);
      this.currentHospital = this.newHospital;

    }

    this.currentIndexDoctor = -1;
    this.currentIndexHospital = -1;
    this.patientService.update(this.currentPatient.id, this.currentPatient)
      .subscribe(
        response => {
          this.message = 'The patient was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  deletePatient(): void {
    this.patientService.delete(this.currentPatient.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/patients']);
        },
        error => {
          console.log(error);
        });
  }
}