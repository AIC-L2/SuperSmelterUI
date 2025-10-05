import { ApiConfigService } from '../common/api-config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  private get mainUrl() {
    return this.apiConfig.getApiUrl();
  }

  private get operatorTabs() {
    return this.mainUrl + 'OperatorTabs';
  }

  getApiUrl() {
    return this.apiConfig.getApiUrl();
  }

  getOperatorTabList() {
    return this.http.get(this.operatorTabs);
  }

  GetOperatorTabTree() {
    return this.http.get(this.operatorTabs + '/GetOperatorTabTree');
  }

  saveOperatorTab(data : any){
    return this.http.post(this.operatorTabs,data);
  }

  updateEquipmentsTab(id:any,data: any){
    return this.http.post(this.operatorTabs+"/UpdateTabEquipments?parentId="+ id + data,[]);
  }

  updateOperatorTab(data: any){
    return this.http.put(this.operatorTabs+"/"+ data.id, data);
  }

  deleteOperatorTab(id: any){
    return this.http.delete(this.operatorTabs+"/"+ id);
  }

}