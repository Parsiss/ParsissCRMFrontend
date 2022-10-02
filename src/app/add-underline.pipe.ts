import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addUnderline'
})
export class AddUnderlinePipe implements PipeTransform {

  transform(str: string): string {
    const wordRegex = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;
    let result = str.match(wordRegex)!.join('_');
    // let result = str.split(/(?=[A-Z])/).join('_');
    return result;
  }

}
