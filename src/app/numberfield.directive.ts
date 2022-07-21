import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[numberfield]'
})
export class NumberfieldDirective {

  constructor() { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.match(/[^0-9]/g)) {
      input.value = input.value.replace(/[^0-9]/g, '');
    }
  }
}
