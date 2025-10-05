import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Data interfaces
export interface ProductionSummaryItem {
  label: string;
  target: string;
  actual: string;
  mtd: string;
  ytd: string;
}

export interface DayProductionItem {
  label: string;
  pcs: string;
  qty: string;
  percentage: string;
}

export interface HourlyProductionItem {
  label: string;
  rolled: string;
  hotOut: string;
  cobble: string;
}

export interface YieldDataItem {
  label: string;
  goal: string;
  mtd: string;
  ytd: string;
}

export interface ShiftDataItem {
  label: string;
  ytd: string;
  mtd: string;
  goal: string;
}

export interface DelaySummaryItem {
  label: string;
  value: string;
}

export interface DelayType {
  type: string;
  fromTo: string;
}

export interface RollChangeItem {
  label: string;
  current: string;
  lastChange: string;
  rollConsum: string;
}

export interface OeeItem {
  label: string;
  value: string;
}

export interface ConsumptionItem {
  label: string;
  current: string;
  yester: string;
  mtd: string;
  ytd: string;
}

export interface UserInstruction {
  id?: number;
  text: string;
  priority?: 'high' | 'medium' | 'low';
  createdAt?: string;
}

export interface UserAlert {
  id?: number;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'error' | 'success';
  timestamp?: string;
  isRead?: boolean;
}

export interface ProductionTrendItem {
  day: string;
  value: number;
  percentage: number;
}

export interface MetricItem {
  value: number | string;
  unit: string;
  change: number;
  changeType: 'positive' | 'negative';
  target?: number;
}

export interface MetricsData {
  product: MetricItem;
  length: MetricItem;
  yield_metric: MetricItem;
  downtime: MetricItem;
  performance: MetricItem;
}

export interface DashboardData {
  productionSummary: ProductionSummaryItem[];
  dayProduction: DayProductionItem[];
  hourlyProduction: HourlyProductionItem[];
  yieldData: YieldDataItem[];
  shiftData: ShiftDataItem[];
  delaySummary: DelaySummaryItem[];
  delayTypes: DelayType[];
  rollChange: RollChangeItem[];
  oee: OeeItem[];
  consumption: ConsumptionItem[];
  instructions: UserInstruction[];
  alerts: UserAlert[];
  productionTrend: ProductionTrendItem[];
  metrics: MetricsData;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8001/api/dashboard';

  constructor(private http: HttpClient) {}

  // Get all dashboard data
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl).pipe(
      map(response => {
        console.log('Dashboard data received:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        return of(this.getMockData());
      })
    );
  }

  // Mock data for fallback
  private getMockData(): DashboardData {
    return {
      productionSummary: [
        { label: 'TPH', target: '150', actual: '0', mtd: '0', ytd: '0' },
        { label: 'H2H', target: '8', actual: '0', mtd: '0', ytd: '0' },
        { label: 'Production', target: '1200', actual: '0', mtd: '0', ytd: '0' },
        { label: 'Average Yield till date (%)', target: '95', actual: '0', mtd: '0', ytd: '0' },
        { label: 'Progress till date (%)', target: '100', actual: '0', mtd: '0', ytd: '0' },
        { label: 'Average production Till Date (t/day)', target: '1200', actual: '0', mtd: '0', ytd: '0' },
        { label: 'CCM Production', target: '1200', actual: '0', mtd: '0', ytd: '0' },
        { label: 'Billet Rolled', target: '1200', actual: '0', mtd: '0', ytd: '0' },
        { label: 'Finished Goods', target: '1140', actual: '0', mtd: '0', ytd: '0' }
      ],
      dayProduction: [
        { label: 'CCM Production', pcs: '0', qty: '0', percentage: '0' },
        { label: 'Billet Received CCM', pcs: '0', qty: '0', percentage: '0' },
        { label: 'Discarded Billet / Hot out', pcs: '0', qty: '0', percentage: '0' },
        { label: 'Billets Rolled', pcs: '0', qty: '0', percentage: '0' },
        { label: 'Misrolled', pcs: '0', qty: '0', percentage: '0' },
        { label: 'Rejection', pcs: '0', qty: '0', percentage: '0' },
        { label: 'Finished Goods', pcs: '0', qty: '0', percentage: '0' }
      ],
      hourlyProduction: [
        { label: 'Billet Count', rolled: '0', hotOut: '0', cobble: '0' },
        { label: 'Tonnage', rolled: '0', hotOut: '0', cobble: '0' }
      ],
      yieldData: [
        { label: 'Billet Conversion(%)', goal: '95', mtd: '0', ytd: '0' },
        { label: 'Yield (%)', goal: '92', mtd: '0', ytd: '0' },
        { label: 'Misroll (%)', goal: '2.5', mtd: '0', ytd: '0' },
        { label: 'Random (%)', goal: '1.5', mtd: '0', ytd: '0' },
        { label: 'End Cut Losse (%)', goal: '1.0', mtd: '0', ytd: '0' },
        { label: 'Scale Loss (%)', goal: '0.8', mtd: '0', ytd: '0' },
        { label: 'Short Length', goal: '0.5', mtd: '0', ytd: '0' },
        { label: 'Process Rejection (%)', goal: '1.2', mtd: '0', ytd: '0' }
      ],
      shiftData: [
        { label: 'SHFT-A', ytd: '0', mtd: '0', goal: '95.0' },
        { label: 'SHIFT-B', ytd: '0', mtd: '0', goal: '95.0' },
        { label: 'SHIFT-C', ytd: '0', mtd: '0', goal: '95.0' }
      ],
      delaySummary: [
        { label: 'Total Delay', value: '125' },
        { label: 'Current Delay', value: '45' },
        { label: 'Planned Delay', value: '30' },
        { label: 'Unplanned Delay', value: '95' }
      ],
      delayTypes: [
        { type: 'Electrical Delay', fromTo: '' },
        { type: 'Mechanical delay', fromTo: '' }
      ],
      rollChange: [
        { label: 'RM ROLL CHANGE', current: '150', lastChange: '08:30', rollConsum: '85%' },
        { label: 'IM ROLL CHANGE', current: '120', lastChange: '10:15', rollConsum: '72%' },
        { label: 'FM ROLL CHANGE', current: '180', lastChange: '09:45', rollConsum: '91%' }
      ],
      oee: [
        { label: 'Availability (%)', value: '0' },
        { label: 'Performance (%)', value: '0' },
        { label: 'Quality (%)', value: '0' }
      ],
      consumption: [
        { label: 'Fuel(Itr/ton)', current: '45.2', yester: '44.8', mtd: '46.1', ytd: '45.5' },
        { label: 'Compressor(m3/ton)', current: '12.5', yester: '12.3', mtd: '12.8', ytd: '12.6' },
        { label: 'Water (Itr/ton)', current: '8.9', yester: '9.1', mtd: '8.7', ytd: '8.8' },
        { label: 'IH(kwH/ton)', current: '156.3', yester: '155.8', mtd: '157.2', ytd: '156.8' },
        { label: 'Stands(kWH/ton)', current: '89.4', yester: '88.9', mtd: '90.1', ytd: '89.7' },
        { label: 'CL & Block(kWH/ton)', current: '23.7', yester: '23.5', mtd: '24.0', ytd: '23.8' },
        { label: 'Aux (kWH/ton)', current: '34.2', yester: '33.9', mtd: '34.6', ytd: '34.4' }
      ],
      instructions: [
        { id: 1, text: 'Check temperature settings before starting production', priority: 'high', createdAt: new Date().toISOString() },
        { id: 2, text: 'Verify safety equipment is properly installed', priority: 'medium', createdAt: new Date().toISOString() },
        { id: 3, text: 'Monitor quality parameters throughout the shift', priority: 'high', createdAt: new Date().toISOString() }
      ],
      alerts: [
        { id: 1, title: 'Temperature Alert', description: 'High temperature detected in Zone A', type: 'warning', timestamp: new Date().toISOString(), isRead: false },
        { id: 2, title: 'Maintenance Due', description: 'Scheduled maintenance for Roller B', type: 'info', timestamp: new Date().toISOString(), isRead: true },
        { id: 3, title: 'Quality Issue', description: 'Product quality below threshold', type: 'error', timestamp: new Date().toISOString(), isRead: false }
      ],
      productionTrend: [
        { day: 'Mon', value: 2450, percentage: 71 },
        { day: 'Tue', value: 2675, percentage: 76 },
        { day: 'Wed', value: 3250, percentage: 85 },
        { day: 'Thu', value: 2680, percentage: 82 },
        { day: 'Fri', value: 3420, percentage: 93 },
        { day: 'Sat', value: 2990, percentage: 91 },
        { day: 'Sun', value: 2350, percentage: 88 }
      ],
      metrics: {
        product: { value: 'D8', unit: 'mm', change: 12.5, changeType: 'positive' },
        length: { value: 12, unit: 'm', change: 8.3, changeType: 'positive' },
        yield_metric: { value: 94.2, unit: 'Efficiency', change: 2.1, changeType: 'positive', target: 95 },
        downtime: { value: 2.3, unit: 'Today', change: 0.5, changeType: 'negative' },
        performance: { value: 87.6, unit: 'OEE', change: 3.2, changeType: 'positive', target: 90 }
      }
    };
  }
} 