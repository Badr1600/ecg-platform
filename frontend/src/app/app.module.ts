import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component';
import { AddDoctorComponent } from './components/add-doctor/add-doctor.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { DoctorDetailsComponent } from './components/doctor-details/doctor-details.component';
import { DoctorListComponent } from './components/doctor-list/doctor-list.component';
import { HospitalDetailsComponent } from './components/hospital-details/hospital-details.component';
import { HospitalListComponent } from './components/hospital-list/hospital-list.component';
import { AddHospitalComponent } from './components/add-hospital/add-hospital.component';
import { HospitalViewComponent } from './components/hospital-view/hospital-view.component';
import { PatientViewComponent } from './components/patient-view/patient-view.component';
import { DoctorViewComponent } from './components/doctor-view/doctor-view.component';
import { AddMedicalComponent } from './components/add-medical/add-medical.component';
import { MedicalDetailsComponent } from './components/medical-details/medical-details.component';
import { MedicalViewComponent } from './components/medical-view/medical-view.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    AddPatientComponent,
    AddDoctorComponent,
    PatientDetailsComponent,
    PatientListComponent,
    DoctorDetailsComponent,
    DoctorListComponent,
    HospitalDetailsComponent,
    HospitalListComponent,
    AddHospitalComponent,
    HospitalViewComponent,
    PatientViewComponent,
    DoctorViewComponent,
    AddMedicalComponent,
    MedicalDetailsComponent,
    MedicalViewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
