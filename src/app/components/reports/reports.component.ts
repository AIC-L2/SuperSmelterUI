import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SelectItem } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReportService, ReportFilters } from '../../services/report.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [
        FormsModule,
        RadioButtonModule,
        DatePickerModule,
        SelectModule,
        ButtonModule,
        CommonModule,
        RouterModule
    ],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit, OnDestroy {

    title: string = 'Report Generator';
    selectedFilter: string = 'shift';
    shifts: SelectItem[] = [
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
      { label: 'C', value: 3 }
    ];
    selectedShift: string | null = null;
    shiftDate: Date | null = null;
    dayDate: Date | null = null;
    monthDate: Date | null = null;
    startDate: Date | null = null;
    endDate: Date | null = null;
    reportUrl: SafeResourceUrl | null = null;
    maxDate: Date = new Date();
    
    private subscriptions: Subscription[] = [];
  
    constructor(private sanitizer: DomSanitizer, private reportService: ReportService) {}
    
    ngOnInit() {
      // Subscribe to report URL changes
      this.subscriptions.push(
        this.reportService.getReportUrl().subscribe(url => {
          this.reportUrl = url;
        })
      );
    }

    ngOnDestroy() {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  
    onFilterChange() {
      // Reset values when filter changes
      this.shiftDate = null;
      this.selectedShift = null;
      this.dayDate = null;
      this.monthDate = null;
      this.startDate = null;
      this.endDate = null;
      
      // Update service
      this.reportService.updateFilters({
        selectedFilter: this.selectedFilter,
        selectedShift: this.selectedShift,
        shiftDate: this.shiftDate,
        dayDate: this.dayDate,
        monthDate: this.monthDate,
        startDate: this.startDate,
        endDate: this.endDate
      });
    }
  
    loadReport() {
      const filters: ReportFilters = {
        selectedFilter: this.selectedFilter,
        selectedShift: this.selectedShift,
        shiftDate: this.shiftDate,
        dayDate: this.dayDate,
        monthDate: this.monthDate,
        startDate: this.startDate,
        endDate: this.endDate
      };
      
      this.reportService.loadReport(filters);
    }

    canLoadReport(): boolean {
      switch (this.selectedFilter) {
        case 'shift':
          return !!(this.shiftDate && this.selectedShift);
        case 'day':
          return !!this.dayDate;
        case 'month':
          return !!this.monthDate;
        case 'periodic':
          return !!(this.startDate && this.endDate);
        default:
          return false;
      }
    }
}
