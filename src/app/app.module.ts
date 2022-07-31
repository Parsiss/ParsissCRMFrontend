import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page-component/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { ImageSliderComponent } from './image-slider-component/image-slider.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportsListComponent } from './reports-list-component/reports-list.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxCurrencyModule } from "ngx-currency";

import { MatTabsModule } from '@angular/material/tabs';

import { NativeDateAdapter, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import { FormControlDirective, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailPageComponent } from './detail-page-component/detail-page.component';
import { NumberfieldDirective } from './numberfield.directive';
import { AddNewPatientComponent } from './add-new-patient/add-new-patient.component';
import { UpdatePatientComponent } from './update-patient/update-patient.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CalendarComponent } from './calendar/calendar.component';
import { JalaliMomentDateAdapter } from './moment-date-adapter';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ImageSliderComponent,
    ReportsListComponent,
    DetailPageComponent,
    NumberfieldDirective,
    AddNewPatientComponent,
    UpdatePatientComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    HttpClientModule,
    MatSelectModule,
    MatMenuModule,
    NgxCurrencyModule,
    NgbModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTabsModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    FullCalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    HttpClient,
    { provide: MAT_DATE_LOCALE, useValue: 'fa' },
    { provide: DateAdapter, useClass: JalaliMomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    FormControlDirective,
    FormGroupDirective,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
