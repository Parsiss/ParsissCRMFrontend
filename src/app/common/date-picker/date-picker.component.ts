import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true
  }]
})
export class TimePickerComponent implements OnInit {
  @Input() public name: string = 'date';

  public date: FormControl;

  private onChange = (value: Date) => {};

  registerOnChange(fn: any): void { this.onChange = fn; }

  writeValue(value: Date) { this.date.setValue(value); }

  registerOnTouched(fn: () => void): void {/* ignore */}


  constructor(private fb: FormBuilder) { 
    this.date = new FormControl(new Date());
  }

  ngOnInit(): void {
    this.date.valueChanges.subscribe(() => {
      this.onChange(this.date.value)
    });
  }
}
