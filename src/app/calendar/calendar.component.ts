import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import faLocale from '@fullcalendar/core/locales/fa';

import { DataService } from '../data.service';
import { CalendarEvent } from "./intefrace";



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  dataSource: CalendarEvent[] = [];

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    let api = this.calendarComponent.getApi();
    console.log(api.currentData.viewApi.activeStart);
    console.log(api.currentData.viewApi.activeEnd);
    this.dataService.getCalendarEvent().subscribe(
      (data) => {
        data.forEach((event) => {
          console.log(event);
        });
      });

     // set ption to the calendar api
     this.calendarComponent.getApi().setOption('visibleRange', {
      start: '2017-04-01',
      end: '2017-04-05'
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
      start: '2022-5-20', //روز اول ماه شمسی
      end: '2022-6-21' // روز آخر بیستم بود که یه روز اضاف کردم تا درست شد
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
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
