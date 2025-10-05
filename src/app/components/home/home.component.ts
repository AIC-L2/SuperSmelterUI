import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SelectItem } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { ReportService, ReportFilters } from '../../services/report.service';
import { ReloadService } from '../../services/common/reload.service';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { 
  ApiService,
  DashboardData as ApiDashboardData,
  ProductionSummaryItem,
  DayProductionItem,
  HourlyProductionItem,
  YieldDataItem,
  ShiftDataItem,
  DelaySummaryItem,
  DelayType,
  RollChangeItem,
  OeeItem,
  ConsumptionItem,
  UserInstruction,
  UserAlert,
  ProductionTrendItem,
  MetricsData
} from '../../services/api.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    RadioButtonModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    TimeFormatPipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Production Dashboard';
  description = 'Your comprehensive solution for managing and analyzing reports';
  Instructions: any[] = [];

  ngAfterViewInit(): void {
    // Implement any logic needed after the view initializes
  }
  
  // Report filters
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
  maxDate: Date = new Date();
  today: Date = new Date();
  
  // Report display
  reportUrl: SafeResourceUrl | null = null;
  showDashboardContent: boolean = false;
  reportLoading: boolean = false;
  
  // Loading state
  loading: boolean = true;
  
  // API Dashboard data
  productionSummaryItems: ProductionSummaryItem[] = [];
  dayProductionItems: DayProductionItem[] = [];
  hourlyProductionItems: HourlyProductionItem[] = [];
  yieldDataItems: YieldDataItem[] = [];
  shiftDataItems: ShiftDataItem[] = [];
  delaySummaryItems: DelaySummaryItem[] = [];
  delayTypes: DelayType[] = [];
  rollChangeItems: RollChangeItem[] = [];
  oeeItems: OeeItem[] = [];
  consumptionItems: ConsumptionItem[] = [];
  userInstructions: UserInstruction[] = [];
  userAlerts: UserAlert[] = [];
  productionTrendItems: ProductionTrendItem[] = [];
  metricsData: MetricsData | null = null;

  // Auto-refresh subscription
  private autoRefreshSubscription: Subscription | null = null;
  private reloadSubscription: Subscription | null = null;
  public isAutoRefreshActive: boolean = false;
  
  // Sidebar visibility
  public isSidebarVisible: boolean = true;
  
  
  // Alerts section scrolling
  public isAlertsSectionScrollable: boolean = false;
  
  // Instructions section scrolling
  public isInstructionsSectionScrollable: boolean = false;
  
  // Delay section scrolling
  public isDelaySectionScrollable: boolean = false;

  // Sticky helper refs
  @ViewChild('filtersCard') filtersCardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('filtersSentinel') filtersSentinelRef!: ElementRef<HTMLDivElement>;
  private observer?: IntersectionObserver;
  private globalToggleEl: HTMLButtonElement | null = null;

  constructor(
    private reportService: ReportService,
    private apiService: ApiService,
    private dashboardService: DashboardService,
    private reloadService: ReloadService
  ) {}

  ngOnInit() {
    // Subscribe to report URL changes
    this.reportService.getReportUrl().subscribe(url => {
      this.reportUrl = url;
    });
    
    // Subscribe to reload events
    this.reloadSubscription = this.reloadService.reload$.subscribe(shouldReload => {
      if (shouldReload) {
        this.loadApiData(true);
        this.reloadService.resetReload();
      }
    });
    
    // Load API data initially with loading state
    this.loadApiData(true);
    
    // Start auto-refresh every 2 seconds
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    // Clean up auto-refresh subscription
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
    
    // Clean up reload subscription
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  // Start auto-refresh every 2 seconds
  startAutoRefresh() {
    if (!this.isAutoRefreshActive) {
      // this.autoRefreshSubscription = interval(2000).subscribe(() => {
      //   // Load data silently without showing loading state
      //   this.loadApiData(false);
      // });
      this.isAutoRefreshActive = true;
      console.log('Auto-refresh started - updating data silently every 2 seconds');
    }
  }

  // Stop auto-refresh
  stopAutoRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
      this.isAutoRefreshActive = false;
      console.log('Auto-refresh stopped');
    }
  }

  // Load API dashboard data
  loadApiData(showLoading: boolean = true) {
    if (showLoading) {
      this.loading = true;
    }
    
    this.apiService.getDashboardData().subscribe({
      next: (data: ApiDashboardData) => {
        this.productionSummaryItems = data.productionSummary;
        this.dayProductionItems = data.dayProduction;
        this.hourlyProductionItems = data.hourlyProduction;
        this.yieldDataItems = data.yieldData;
        this.shiftDataItems = data.shiftData;
        this.delaySummaryItems = data.delaySummary;
        this.delayTypes = data.delayTypes;
        // Initialize delay section scrolling state based on initial delayTypes length
        this.isDelaySectionScrollable = (this.delayTypes?.length || 0) > 2;
        this.rollChangeItems = data.rollChange;
        this.oeeItems = data.oee;
        this.consumptionItems = data.consumption;
        // this.userInstructions = data.instructions;
        this.userAlerts = data.alerts;
        // Keep alerts scroll state consistent on initial load as well
        this.isAlertsSectionScrollable = (this.userAlerts?.length || 0) > 3;
        this.productionTrendItems = data.productionTrend;
        this.metricsData = data.metrics;
        
        // Fetch live production instructions (concise format)
        this.dashboardService.getProductionInstructions().subscribe({
          next: (res: any) => {
            const items = Array.isArray(res?.data) ? res.data : [];
            this.Instructions = items.map((it: any) => ({ id: it.id, text: it.value }));
            // Sync instructions scroll state with count (match Active Alerts behavior)
            this.isInstructionsSectionScrollable = (this.Instructions?.length || 0) > 3;
            console.log('Production Instructions loaded:', this.Instructions);
          },
          error: (error) => {
            console.error('Error fetching production instructions:', error);
            // Keep existing instructions if API fails
          }
        });

        if (showLoading) {
          this.loading = false;
        }
        
        console.log('API data updated silently at:', new Date().toLocaleTimeString());
      },
      error: (error) => {
        console.error('Error loading API data:', error);
        if (showLoading) {
          this.loading = false;
        }
      }
    });
  }

  // Refresh API data manually
  refreshApiData() {
    // Manual refresh shows loading state
    this.loadApiData(true);
  }

  // Simple CRUD operations for local data
  addDelayRow() {
    this.delayTypes.push({ type: '', fromTo: '' });
    // Enable scrolling for delay section only after 2 rows are added
    this.isDelaySectionScrollable = this.delayTypes.length > 2;
  }

  removeDelayRow(index: number) {
    if (this.delayTypes.length > 1) {
      this.delayTypes.splice(index, 1);
      // Disable scrolling if delay rows count goes back to 2 or fewer
      this.isDelaySectionScrollable = this.delayTypes.length > 2;
    }
  }

  addInstruction() {
    this.Instructions.push({ text: '', priority: 'medium' } as any);
    // Enable scrolling like Active Alerts once items exceed threshold
    this.isInstructionsSectionScrollable = this.Instructions.length > 3;
  }

  removeInstruction(index: number) {
    if (this.Instructions.length > 1) {
      this.Instructions.splice(index, 1);
      // Disable scrolling if count drops to threshold or below
      this.isInstructionsSectionScrollable = this.Instructions.length > 3;
    }
  }

  addAlert() {
    this.userAlerts.push({ title: '', description: '', type: 'info' });
    // Enable scrolling for alerts section only after 3 alerts are added
    this.isAlertsSectionScrollable = this.userAlerts.length > 3;
  }

  removeAlert(index: number) {
    if (this.userAlerts.length > 1) {
      this.userAlerts.splice(index, 1);
      // Disable scrolling if alerts count goes back to 3 or fewer
      this.isAlertsSectionScrollable = this.userAlerts.length > 3;
    }
  }

  // Report functionality
  onFilterChange() {
    this.shiftDate = null;
    this.selectedShift = null;
    this.dayDate = null;
    this.monthDate = null;
    this.startDate = null;
    this.endDate = null;
    
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
    this.reportLoading = true;
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
    
    setTimeout(() => {
      this.reportLoading = false;
    }, 2000);
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

  clearReport() {
    this.reportService.clearReport();
    this.showDashboardContent = false;
    this.reportLoading = false;
  }

  get currentShiftLabel(): string {
    const found = this.shifts?.find((s: any) => s.value === this.selectedShift);
    return (found && (found.label as string)) || '-';
  }

  get selectedShiftData(): ShiftDataItem | null {
    if (!this.shiftDataItems || this.shiftDataItems.length === 0) {
      return null;
    }
    if (this.selectedShift == null) {
      return null;
    }
    const index = Number(this.selectedShift) - 1;
    return this.shiftDataItems[index] ?? null;
  }

  // Back button functionality - toggle sidebar visibility
  onBackClick() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.updateGlobalTogglePosition();
  }

  // Global toggle creation and management
  private createGlobalToggle() {
    if (this.globalToggleEl) return;
    const btn = document.createElement('button');
    btn.className = 'global-sidebar-toggle';
    btn.type = 'button';
    const span = document.createElement('span');
    span.className = 'arrow';
    span.textContent = '>';
    btn.appendChild(span);
    btn.addEventListener('click', () => this.onBackClick());
    document.body.appendChild(btn);
    this.globalToggleEl = btn;
    this.updateGlobalTogglePosition();
  }

  private updateGlobalTogglePosition() {
    if (!this.globalToggleEl) return;
    if (this.isSidebarVisible) {
      this.globalToggleEl.classList.remove('hidden-pos');
      (this.globalToggleEl.querySelector('.arrow') as HTMLElement).style.transform = 'rotate(180deg)';
    } else {
      this.globalToggleEl.classList.add('hidden-pos');
      (this.globalToggleEl.querySelector('.arrow') as HTMLElement).style.transform = 'rotate(0deg)';
    }
  }

  private removeGlobalToggle() {
    if (this.globalToggleEl && this.globalToggleEl.parentNode) {
      this.globalToggleEl.parentNode.removeChild(this.globalToggleEl);
    }
    this.globalToggleEl = null;
  }
} 