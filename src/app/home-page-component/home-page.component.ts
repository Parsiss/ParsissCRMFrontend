import { Component, OnInit } from '@angular/core';
import {SurgeriesInformation} from "../../types/report";
import {EventClickArg} from "@fullcalendar/angular";
import {Router} from "@angular/router";
import {AutofillService} from "../autofill.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    public router: Router,
    public autofill: AutofillService
  ) { }
  images = [
    'assets/images/image1.jpg',
    'assets/images/image2.jpg',
    'assets/images/image3.jpg',
    'assets/images/image4.jpg',
    'assets/images/image5.jpg'
  ]
  ngOnInit(): void {
  }

  calendarEventClicked(calEvent: SurgeriesInformation)
  {
    const id = calEvent.ID;
    this.router.navigate(['/detailPage', id]);
  }

}
