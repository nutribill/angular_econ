import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'yearAbbrev'})

export class YearAbbrev implements PipeTransform {
  transform(value: any, args: string[]): string {
    let strVal = String(value);
    let lastDigit = strVal.substr(strVal.length-1);
    return (lastDigit == '0' || lastDigit == '5') ? "'" + strVal.substr(strVal.length-2) : lastDigit;
  }
}
