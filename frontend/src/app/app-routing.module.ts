import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { AddHospitalComponent } from './components/add-hospital/add-hospital.component';
import { DoctorListComponent } from './components/doctor-list/doctor-list.component';
import { DoctorDetailsComponent } from './components/doctor-details/doctor-details.component';
import { HospitalListComponent } from './components/hospital-list/hospital-list.component';
import { HospitalDetailsComponent } from './components/hospital-details/hospital-details.component';
import { HospitalViewComponent } from './components/hospital-view/hospital-view.component';
import { PatientViewComponent } from './components/patient-view/patient-view.component';
import { DoctorViewComponent } from './components/doctor-view/doctor-view.component';
import { AddMedicalComponent } from './components/add-medical/add-medical.component';
import { MedicalDetailsComponent } from './components/medical-details/medical-details.component';
import { MedicalViewComponent } from './components/medical-view/medical-view.component';
import * as Chart from 'chart.js';



const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientListComponent },
  { path: 'patients/:id', component: PatientDetailsComponent },
  { path: 'addPatient', component: AddPatientComponent },
  { path: 'addDoctor', component: AddDoctorComponent },
  { path: 'doctors', component: DoctorListComponent },
  { path: 'doctors/:id', component: DoctorDetailsComponent },
  { path: 'addHospital', component: AddHospitalComponent },
  { path: 'hospitals', component: HospitalListComponent },
  { path: 'hospitals/:id', component: HospitalDetailsComponent },
  { path: 'hospitalsView/:id', component: HospitalViewComponent },
  { path: 'patientsView/:id', component: PatientViewComponent },
  { path: 'doctorsView/:id', component: DoctorViewComponent },
  { path: 'addMedical/:id', component: AddMedicalComponent },
  { path: 'medicals/:id', component: MedicalDetailsComponent },
  { path: 'medicalsView/:id', component: MedicalViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
