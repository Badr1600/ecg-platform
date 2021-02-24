import { Component, OnInit, ViewChild } from '@angular/core';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from "papaparse";

const lcjs = require('@arction/lcjs')

const {
  lightningChart,
  DataPatterns,
  AxisScrollStrategies,
  SolidLine,
  SolidFill,
  ColorHEX,
  AutoCursorModes,
  Themes
} = lcjs


@Component({
  selector: 'app-medical-view',
  templateUrl: './medical-view.component.html',
  styleUrls: ['./medical-view.component.css']
})

export class MedicalViewComponent implements OnInit {
  medicals: any;
  hospitals: any;
  medicalData: any[] = [];
  currentMedical = null;
  currentHospital = null;
  currentPatient = null;
  currentIndex = -1;
  title = '';

  constructor(
    private medicalService: MedicalsService,
    private hospitalService: HospitalsService,
    private patientService: PatientsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMedical(this.route.snapshot.paramMap.get('id'));
    this.retrieveHospitals(this.route.snapshot.paramMap.get('id'));
  }

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  uploadListener($event: any): void {
    const papa = require('papaparse');
    const chart = lightningChart().ChartXY();
    chart.setTitle('ECG');

    const {
      createSampledDataGenerator
    } = require('@arction/xydata')

    // Add line series to visualize the data received
    const ch1 = chart.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
    const ch2 = chart.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
    // Style the series
    ch1
      .setStrokeStyle(new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorHEX('#5aafc7') })
      }))
      .setMouseInteractions(false)

    ch1
      .setStrokeStyle(new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({ color: ColorHEX('#499822') })
      }))
      .setMouseInteractions(false)

    chart.setAutoCursorMode(AutoCursorModes.disabled)

    // Setup view nicely.
    chart.getDefaultAxisY()
      .setTitle('heartrate')
      .setInterval(0.2, 0.4)
      .setScrollStrategy(AxisScrollStrategies.expansion)

    chart.getDefaultAxisX()
      .setTitle('milliseconds')
      .setInterval(0, 2500)
      .setScrollStrategy(AxisScrollStrategies.progressive)

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      var point = [];
      var point2 = [];
      var time = 0;
      let input = $event.target;
      let reader = new FileReader();
      papa.parse(files[0], {
        dynamicTyping: true,
        complete: function (results) {
          var temp = [];
          temp.push(results.data);
          temp[0].forEach(element => {
            point.push({ x: time, y: element[0] });
            point2.push({ x: time, y: element[1] });
            time++;
          })
          console.log(point[0].x);

          createSampledDataGenerator(point, 1, 10)
            .setSamplingFrequency(1)
            .setInputData(point)
            .generate()
            .setStreamBatchSize(10)
            .setStreamInterval(10)
            .setStreamRepeat(false)
            .toStream()
            .forEach(element => {
              ch1.add([
                { x: element.data.x, y: element.data.y },
              ])
            })

            createSampledDataGenerator(point2, 1, 10)
            .setSamplingFrequency(1)
            .setInputData(point2)
            .generate()
            .setStreamBatchSize(10)
            .setStreamInterval(10)
            .setStreamRepeat(false)
            .toStream()
            .forEach(element => {
              ch2.add([
                { x: element.data.x, y: element.data.y },
              ])
            })
            
        }
      })

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    }
  }

  retrieveHospitals(id): void {
    var temp = [];
    this.medicalService.get(id)
      .subscribe(
        data => {
          console.log(data);
          this.hospitalService.getAll()
            .subscribe(
              results => {
                console.log(results);
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