import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  public apiUrl = environment.baseUrl;
  public node_apiUrl = environment.nodeUrl;

  constructor() { }

  getApiUrl() {
    return this.apiUrl;
  }

  setApiUrl(url: string){
    this.apiUrl = url;
  }

  getNode_Api_Url() {
    return this.node_apiUrl;
  }
}
