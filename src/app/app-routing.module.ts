import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewPatientComponent } from './add-new-patient/add-new-patient.component';
import { HomePageComponent } from './home-page-component/home-page.component';
import { PeriodicReportsComponent } from './periodic-reports/periodic-reports.component';
import { ReportsListComponent } from './reports-list-component/reports-list.component';
import { UpdatePatientComponent } from './update-patient/update-patient.component';
import {CanDeactivateGuard} from "./guards/can-deactivate.guard";
import { CentersInfoPageComponent } from './centers-info-page/centers-info-page.component';
import { DeviceInfoPageComponent } from './device-info-page/device-info-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginPageComponent } from './login/login-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
 // {path: '', canActivate:[AuthGuard], children: [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'detailPage/:id', component: UpdatePatientComponent , canDeactivate: [CanDeactivateGuard],canActivate:[AuthGuard] },
    { path: 'add_new_patient', component: AddNewPatientComponent , canDeactivate: [CanDeactivateGuard],canActivate:[AuthGuard] },
    { path: 'home', component: HomePageComponent,canActivate:[AuthGuard] },
    { path: 'reportsList', component: ReportsListComponent,canActivate:[AuthGuard] },
    { path: 'preports', component: PeriodicReportsComponent,canActivate:[AuthGuard]},
    { path: 'centers', component: CentersInfoPageComponent,canActivate:[AuthGuard] },
  // ]
 // },

  { path: 'login', component: LoginPageComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
