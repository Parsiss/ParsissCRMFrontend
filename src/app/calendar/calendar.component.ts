import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import faLocale from '@fullcalendar/core/locales/fa';

import { Router } from '@angular/router';

import { DataService } from '../data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  constructor(
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    let api = this.calendarComponent.getApi();
    this.dataService.getCalendarEvent().subscribe(
      (data) => {
        let listOfOperators = data.map(event => event.HospitalType);
        listOfOperators = Array.from(new Set(listOfOperators));
        let colors = ['#f44336', '#03a9f4', '#4caf50', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];
        let colorMap = new Map<number, string>();
        listOfOperators.forEach((operator, index) => {
          colorMap.set(operator as number, colors[index]);
        });

        data.forEach((event) => {
          api.addEvent({
            id: event.ID!.toString(),
            title: event.Hospital + ' ' + event.OperatorFirst,
            start: new Date(event.SurgeryDate as number * 1000),
            end: new Date(event.SurgeryDate as number * 1000),
            color: colorMap.get(event.HospitalType as number),
          });
        });
    });
  }

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },

    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: faLocale,
    visibleRange: {
      start: '2022-5-20',
      end: '2022-6-21'
    },
  };
  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  }

  handleEventClick(clickInfo: EventClickArg) {
    let id = clickInfo.event.id;
    this.router.navigate(['/detailPage', id]);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
