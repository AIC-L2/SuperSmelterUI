import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ReportFilters {
  selectedFilter: string;
  selectedShift: string | null;
  shiftDate: Date | null;
  dayDate: Date | null;
  monthDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportUrlSubject = new BehaviorSubject<SafeResourceUrl | null>(null);
  private filtersSubject = new BehaviorSubject<ReportFilters>({
    selectedFilter: 'shift',
    selectedShift: null,
    shiftDate: null,
    dayDate: null,
    monthDate: null,
    startDate: null,
    endDate: null
  });

  constructor(private sanitizer: DomSanitizer) {}

  getReportUrl(): Observable<SafeResourceUrl | null> {
    return this.reportUrlSubject.asObservable();
  }

  getFilters(): Observable<ReportFilters> {
    return this.filtersSubject.asObservable();
  }

  updateFilters(filters: Partial<ReportFilters>) {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({ ...currentFilters, ...filters });
  }

  loadReport(filters: ReportFilters) {
    let url = '';
    switch (filters.selectedFilter) {
      case 'shift':
        if (filters.shiftDate && filters.selectedShift) {
          const formattedDate = this.formatDate(filters.shiftDate, true); 
          url = `http://localhost/aic_report/Reports/ShiftReport.aspx?type=1&fromDt='${formattedDate}'&toDt='${formattedDate}'&shift=${filters.selectedShift}`;
        }
        break;
      case 'day':
        if (filters.dayDate) {
          const formattedDate = this.formatDate(filters.dayDate, true); 
          url = `http://localhost/aic_report/Reports/ShiftReport.aspx?type=2&fromDt='${formattedDate}'&toDt='${formattedDate}'`;
        }
        break;
      case 'month':
        if (filters.monthDate) {
          const formattedDate = this.formatDate(filters.monthDate, true); 
          url = `http://localhost/aic_report/Reports/ProductionReport.aspx?type=3&fromDt='${formattedDate}'&toDt='${formattedDate}'`;
        }
        break;
      case 'periodic':
        if (filters.startDate && filters.endDate) {
          const formattedStart = this.formatDate(filters.startDate, false);
          const formattedEnd = this.formatDate(filters.endDate, false);
          url = `http://localhost/aic_report/Reports/ProductionReport.aspx?type=3&fromDt='${formattedStart}'&toDt='${formattedEnd}'`;
        }
        break;
    }
    
    if (url) {
      console.log('Generated URL:', url);
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.reportUrlSubject.next(safeUrl);
    }
  }

  private formatDate(date: Date, setToMidnight: boolean = false): string {
    if (!date) return '';
    let formattedDate = new Date(date);
    if (setToMidnight) {
      formattedDate.setHours(0, 0, 0, 0);
    }
    return formattedDate.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/,/, '');
  }

  clearReport() {
    this.reportUrlSubject.next(null);
  }
}





