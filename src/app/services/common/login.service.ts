import { ApiConfigService } from '../common/api-config.service';
import { API_NAMES } from '../../enums/apiNames.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  private get mainUrl() {
    return this.apiConfig.getApiUrl();
  }
  
  // private recipeNodeUrl = environment.nodeUrl;
  
  getApiUrl() {
    return this.apiConfig.getApiUrl();
  }

  login(){
    let payload = {
        "userName":'guest',
        "password": 'aic123#'
      };
    return this.http.post(this.mainUrl + 'security/login', JSON.stringify(payload));
  }
}

