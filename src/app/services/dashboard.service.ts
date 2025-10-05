import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from './common/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private nodeUrls = 'http://localhost:4000/api/ProductionDashboard/';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  // private get url() {
  //   return this.getApiUrl();
  // }

  // getApiUrl() {
  //   return this.apiConfig.getApiUrl();
  // }

  getProductionInstructions() {
    return this.http.get<any>(this.nodeUrls + 'getProductionInstructions');
  }
}


