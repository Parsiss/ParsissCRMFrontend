import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailPageComponent } from './detail-page-component/detail-page.component';
import { HomePageComponent } from './home-page-component/home-page.component';
import { ReportsListComponent } from './reports-list-component/reports-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'detailPage/:id', component: DetailPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'reportsList', component: ReportsListComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
