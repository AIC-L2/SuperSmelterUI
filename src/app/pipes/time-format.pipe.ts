import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value || value === '0' || value === 0) {
      return '00:00:00';
    }

    // Convert to number if it's a string
    let totalSeconds: number;
    if (typeof value === 'string') {
      // Remove any non-numeric characters except decimal point
      const cleanValue = value.replace(/[^\d.]/g, '');
      totalSeconds = parseFloat(cleanValue);
    } else {
      totalSeconds = value;
    }

    // If the value is already in seconds, use it directly
    // If it's in minutes, convert to seconds
    // We'll assume the value is in minutes if it's less than 1440 (24 hours in minutes)
    if (totalSeconds < 1440 && totalSeconds > 0) {
      totalSeconds = totalSeconds * 60; // Convert minutes to seconds
    }

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format with leading zeros
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
