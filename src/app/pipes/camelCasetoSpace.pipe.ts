import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSpace'
})
export class CamelCaseToSpacePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    // Split camelCase into words by inserting a space before any uppercase letter
    return value.replace(/([a-z])([A-Z])/g, '$1 $2')
                // Handle multiple uppercase letters (e.g., "CycleEnable" → "Cycle Enable")
                .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
                // Ensure first letter is capitalized (optional, depending on your needs)
                .replace(/^./, str => str.toUpperCase());
  }
}