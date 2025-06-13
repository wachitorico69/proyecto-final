import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'altura'
})
export class AlturaPipe implements PipeTransform {

  transform(value: number): string {
    return value !== null && value !== undefined ? `${value} cm` : '';
  }

}
