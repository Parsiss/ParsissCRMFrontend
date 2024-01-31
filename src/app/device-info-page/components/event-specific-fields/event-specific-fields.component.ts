import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-specific-fields',
  templateUrl: './event-specific-fields.component.html',
  styleUrls: ['./event-specific-fields.component.scss']
})
export class EventSpecificFieldsComponent implements OnInit {
  @Input() public type: string;
  @Input() public data: object;

  constructor() { }

  ngOnInit(): void {
    
  }

}
