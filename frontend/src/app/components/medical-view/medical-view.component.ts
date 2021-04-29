import { Component, OnInit, Input } from '@angular/core';
import { lightningChart, ChartXY, Point } from '@arction/lcjs';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { DoctorsService } from 'src/app/_services/doctors.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { RecordsService } from 'src/app/_services/records.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../_services/token-storage.service';
import { parse } from "papaparse";

const lcjs = require('@arction/lcjs')

const {
  DataPatterns,
  AxisScrollStrategies,
  SolidLine,
  SolidFill,
  ColorHEX,
  AutoCursorModes,
  AxisTickStrategies,
} = lcjs


@Component({
  selector: 'app-medical-view',
  templateUrl: './medical-view.component.html',
  styleUrls: ['./medical-view.component.css']
})

export class MedicalViewComponent implements OnInit {
  username: string;
  private roles: string[];
  isLoggedIn = false;
  medical: any;
  medicalId = null;
  chart: ChartXY;
  chartId: number;
  medicals: any;
  hospitals: any;
  medicalData: any[] = [];
  patient;
  temp = [];
  length = 0;
  currentMedical = null;
  currentHospital = null;
  currentPatient = null;
  currentIndex = -1;
  title = '';

  @Input() points: Point[];

  ngOnChanges() {
    // Generate random ID to us as the containerId for the chart and the target div id
    this.chartId = Math.trunc(Math.random() * 1000000);
  }

  ngAfterViewInit() {
    
  }

  constructor(
    private medicalService: MedicalsService,
    private patientService: PatientsService,
    private doctorService: DoctorsService,
    private hospitalService: HospitalsService,
    private recordsService: RecordsService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.authorizeLogin(this.username);
    } else {
      this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
    }
  }

  authorizeLogin(username): void {
    this.medicalId = this.route.snapshot.paramMap.get('id');
    this.retrieveMedical(this.medicalId);
    if ((this.roles.includes('ROLE_ADMIN'))) {
      this.fetchCSV(this.medicalId);
      this.getMedical(this.medicalId);
      this.retrieveHospitals(this.medicalId);
    } else if ((this.roles.includes('ROLE_HOSPITAL'))) {
      this.hospitalService.getByUsername(username)
        .subscribe(
          data => {
            if (data.patients.includes(this.medical.patient[0])) {
              this.fetchCSV(this.medicalId);
              this.getMedical(this.medicalId);
              this.retrieveHospitals(this.medicalId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_DOCTOR'))) {
      this.doctorService.getByUsername(username)
        .subscribe(
          data => {
            if (data.patient.includes(this.medical.patient[0])) {
              this.fetchCSV(this.medicalId);
              this.getMedical(this.medicalId);
              this.retrieveHospitals(this.medicalId);
            }
          }
        )
    } else if ((this.roles.includes('ROLE_PATIENT'))) {
      this.patientService.getByUsername(username)
        .subscribe(
          data => {
            if (data.medicals.includes(this.medical.id)) {
              this.fetchCSV(this.medicalId);
              this.getMedical(this.medicalId);
              this.retrieveHospitals(this.medicalId);
            }
          }
        )
    }
    
  }

  retrieveMedical(id): void {
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.medical = data;
        },
        error => {
          console.log(error);
        });
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  createECG(length: any): void {
    const chart = lightningChart().ChartXY({
      container: `target`
    });

    chart.setTitle('ECG');

    const {
      createSampledDataGenerator
    } = require('@arction/xydata')

    chart.setAutoCursorMode(AutoCursorModes.disabled)

    chart.setSeriesBackgroundFillStyle(new SolidFill({ color: ColorHEX('#FFFFFF') }))
    chart.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#000') }))

    // Setup view nicely.
    chart.getDefaultAxisY()
      .setTitle('heartrate')
      .setInterval(0.2, 0.4)
      .setScrollStrategy(AxisScrollStrategies.expansion)
      .setTickStrategy(
        // Base TickStrategy to modify
        AxisTickStrategies.Numeric,
        // Modify the TickStrategy through a mutator
        (tickStrategy) => tickStrategy
          // Use custom grid stroke for the Major Ticks.
          .setMajorTickStyle(tickStyle => tickStyle
            .setGridStrokeStyle(new SolidLine({
              thickness: 3,
              fillStyle: new SolidFill({ color: ColorHEX('#f49ea5') })
            }))
          )
          .setMinorTickStyle(tickStyle => tickStyle
            .setGridStrokeStyle(new SolidLine({
              thickness: 2,
              fillStyle: new SolidFill({ color: ColorHEX('#F0DBD9') })
            }))
          )
      )


    chart.getDefaultAxisX()
      .setTitle('milliseconds')
      .setInterval(0, 2500)
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setTickStrategy(
        // Base TickStrategy to modify
        AxisTickStrategies.Numeric,
        // Modify the TickStrategy through a mutator
        (tickStrategy) => tickStrategy
          // Use custom grid stroke for the Major Ticks.
          .setMajorTickStyle(tickStyle => tickStyle
            .setGridStrokeStyle(new SolidLine({
              thickness: 3,
              fillStyle: new SolidFill({ color: ColorHEX('#f49ea5') })
            }))
          )
          .setMinorTickStyle(tickStyle => tickStyle
            .setGridStrokeStyle(new SolidLine({
              thickness: 2,
              fillStyle: new SolidFill({ color: ColorHEX('#F0DBD9') })
            }))
          )
      )

    var channels = [];

    for (var i = 0; i < length; i++) {
      channels[i] = chart.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive });
      channels[i].setStrokeStyle(new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorHEX('#5aafc7') })
      })).setMouseInteractions(false);
    }

    createSampledDataGenerator(this.temp, 1, 10)
      .setSamplingFrequency(1)
      .setInputData(this.temp)
      .generate()
      .setStreamBatchSize(1)
      .setStreamInterval(10)
      .setStreamRepeat(false)
      .toStream()
      .forEach(element => {
        for (var i = 0; i < channels.length; i++) {
          channels[i].add([
            { x: element.timestamp, y: +element.data[i] },
          ])
        }
      })
  }

  fetchCSV(id): void {
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.patient = data.patient[0];
          this.currentMedical = data;
          this.recordsService.findCSV(this.medicalId)
            .subscribe(results => {
              var length = results[0].length;
              results.forEach(element => {
                this.temp.push(element);
              })
              this.createECG(length);
            });
        },
        error => {
          console.log(error);
        });
  }

  retrieveHospitals(id): void {
    var temp = [];
    this.medicalService.get(id)
      .subscribe(
        data => {
          this.hospitalService.getAll()
            .subscribe(
              results => {
                results.forEach(element => {
                  if (element.id == data.hospital) {
                    temp.push(element);
                  }
                  this.hospitals = temp;
                });
              }
            )
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

  setActiveMedical(medical, index): void {
    this.currentMedical = medical;
    this.currentIndex = index;
  }

  refreshview(): void {
    this.currentMedical = null;
    this.currentIndex = -1;
  }

  setActiveHospital(hospital, index): void {
    this.currentHospital = hospital;
    this.currentIndex = index;
  }

  searchTitle(): void {
    this.medicalService.findByTitle(this.title)
      .subscribe(
        data => {
          this.medicals = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
}