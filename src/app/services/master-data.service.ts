import { API_NAMES } from '../enums/apiNames.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './common/api-config.service'; 
// import { ProductTypeEnum } from '@enums/productType.enum';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  private get url() {
    return this.getApiUrl();
  }

  private get aliasShift() {
    return this.url + API_NAMES.SHIFT;
  }

  private get aliasdelayCode() {
    return this.url + API_NAMES.DELAYCODES;
  }

  private get aliasPlantData() {
    return this.url + API_NAMES.PLANTDATA;
  }

  private get aliaDeliveries() {
    return this.url + 'Deliveries';
  }

  private get aliaProductTypes() {
    return this.url + 'ProductTypes';
  }

  private get aliaSteelGrades() {
    return this.url + API_NAMES.STEEL_GRADE;
  }

  private get aliaDiameterRanges() {
    return this.url + 'FinishDiameterRanges';
  }

  private get productUrl() {
    return this.url + API_NAMES.PRODUCTS;
  }

  private get aliasSatndards() {
    return this.url + 'Standards';
  }

  private get aliasProduct() {
    return this.url + API_NAMES.PRODUCTS;
  }

  private get aliasRolls() {
    return this.url + API_NAMES.ROLLS;
  }

  getApiUrl() {
    return this.apiConfig.getApiUrl();
  }

  getShiftList() {
    return this.http.get(this.aliasShift);
  }

  getDelayCodeList() {
    return this.http.get(this.aliasdelayCode);
  }

  getMainDelayCodeList() {
    return this.http.get(this.aliasdelayCode + '?type=0');
  }

  getRollsList() {
    return this.http.get(this.aliasRolls);
  }

  getPlantDataEquipmentsList(fieldTypeDefinitionId?: number) {
    let url = this.aliasPlantData + '/GetPlantDataList';
    if (fieldTypeDefinitionId) {
      url += '?fieldTypeDefinitionId=' + fieldTypeDefinitionId
    }
    return this.http.get<any>(url);
  }

  getPermissionSettings() {
    return this.http.get('assets/Data/permissionsSetup.json');
  }

  getDeliveryList() {
    return this.http.get(this.url + 'Deliveries');
  }

  getInputProductList() {
    return this.http.get(this.productUrl + '?ProductTypeId=8');
  }

  getOutputProductList() {
    return this.http.get(this.productUrl + '?ProductTypeId=1');
  }

  getGradesData() {
    return this.http.get(this.aliaSteelGrades);
  }

  getProductTypeList() {
    return this.http.get(this.aliaProductTypes);
  }

  syncProductType() {
    return this.http.post(this.aliaProductTypes + "/" + "SyncProductTypes", "");
  }

  getDiameterRangeList(productType: number = 0) {
    let url = this.aliaDiameterRanges;
    if (productType) {
      url = url + '?productionTypeId=' + productType;
    }
    return this.http.get(url);
  }

  updateDiameterRangeList(data: any) {
    return this.http.put(this.aliaDiameterRanges + "/" + data.id, data);
  }

  syncDiameterRanges() {
    return this.http.post(this.aliaDiameterRanges + "/" + "SyncDiameterRanges", "");
  }

  getProductTypesList() {
    return this.http.get(this.aliaProductTypes);
  }

  syncDeliveries() {
    return this.http.post(this.aliaDeliveries + "/" + "SyncDelivery", "");
  }

  getProductCodes() {
    return this.http.get(this.url + 'ProductCodes');
  }

  getProductsList() {
    return this.http.get(this.url + this.aliasProduct + "?option=1");
  }

  //Attributes
  getAttributesList() {
    return this.http.get<any[]>(this.url + 'Attributes');
  }

  getSatndardsList() {
    return this.http.get(this.aliasSatndards);
  }
}
