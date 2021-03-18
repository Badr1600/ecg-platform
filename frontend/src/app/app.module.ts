import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';


// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';

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
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    P404Component,
    P500Component,

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
    BrowserAnimationsModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),

    DataTablesModule,

    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    IconSetService,
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }