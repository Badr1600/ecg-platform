import { Component, OnInit, ViewChild } from '@angular/core';
import { MedicalsService } from 'src/app/_services/medicals.service';
import { PatientsService } from 'src/app/_services/patients.service';
import { HospitalsService } from 'src/app/_services/hospitals.service';
import { RecordsService } from 'src/app/_services/records.service';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from "papaparse";
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

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
  patient;
  temp = [];
  length = 0;
  currentMedical = null;
  currentHospital = null;
  currentPatient = null;
  currentIndex = -1;
  title = '';

  constructor(
    private medicalService: MedicalsService,
    private hospitalService: HospitalsService,
    private patientService: PatientsService,
    private recordsService: RecordsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMedical(this.route.snapshot.paramMap.get('id'));
    this.retrieveHospitals(this.route.snapshot.paramMap.get('id'));
    this.fetchCSV(this.route.snapshot.paramMap.get('id'));
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  createECG(length: any): void {
    const chart = lightningChart().ChartXY({
      containerId: 'target'
    });

    chart.setTitle('ECG');

    const {
      createSampledDataGenerator
    } = require('@arction/xydata')

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
      .setStreamBatchSize(10)
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
          this.recordsService.findCSV(this.patient)
            .subscribe(results => {
              console.log(results);
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