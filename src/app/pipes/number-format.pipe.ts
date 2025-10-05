import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numberFormat',
	standalone: true
})
export class NumberFormatPipe implements PipeTransform {
	transform(val: any, dec: number): string {

		if (val !== undefined && val !== null && val !== "") {
		  if (typeof val == "string") {
			val = parseFloat(val);
		  }
		  
		  if (dec !== undefined && dec !== null) {
			val = parseFloat(val.toFixed(dec));
		  }
		  
		  // here we just remove the commas from value
		  return val.toString().replace(/,/g, "");
		} else {
		  return "";
		}
	}
}





