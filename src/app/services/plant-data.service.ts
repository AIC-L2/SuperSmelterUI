import { API_NAMES } from '../enums/apiNames.enum';
import { ApiConfigService } from '../services/common/api-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PlantDataService {

  private mainUrl: string;
  private aliasFieldDefinitions: string;
  private aliadPlantData: string;

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {
    this.mainUrl = this.getApiUrl();
    this.aliasFieldDefinitions = this.mainUrl + API_NAMES.FIELDDEFINITIONS;
    this.aliadPlantData = this.mainUrl + API_NAMES.PLANTDATA;
  }

  getApiUrl() {
    return this.apiConfig.getApiUrl();
  }

  getCommTypeList() {
    return this.http.get<any[]>(this.getApiUrl() + 'ComLinks');
  }

  getFieldTypeDef() {
    return this.http.get<any[]>(this.getApiUrl() + 'fieldTypeDefinitions?option=2');
  }

  getFieldDataTypeDef() {
    return this.http.get<any[]>(this.getApiUrl() + 'fieldTypeDefinitions?option=1');
  }

  getSubTypeList() {
    return this.http.get<any[]>(this.getApiUrl() + 'FieldSubTypeDefinitions');
  }

  getPlantDataList() {
    return this.http.get(this.aliadPlantData)
  }
  getPlantDataTree() {
    return this.http.get(this.aliadPlantData + '/GetPlantDataTree')
  }

  addNewPlantData(data: any) {
    return this.http.post(this.aliadPlantData, JSON.stringify(data));
  }

  editPlantData(data: any) {
    return this.http.put(this.aliadPlantData + '/' + data.id, JSON.stringify(data));
  }

  deletePlantData(data: any) {
    return this.http.delete(this.aliadPlantData + '/' + data.id);
  }

  updateSequence(dragId: number, dropId: number) {
    return this.http.put(this.aliadPlantData + '/ChangeSequence?dragId=' + dragId + "&dropId=" + dropId, {});
  }

  getPlantDetailsList(plantId: any, hmi: number) {
    return this.http.get(this.aliasFieldDefinitions + '/GetFieldDefinitionsTree?plantDataId=' + plantId + '&hmiId=' + hmi);
  }

  updatePlantDetailsData(data: any) {
    return this.http.put(this.getApiUrl() + 'FieldDefinitions/' + data.id, JSON.stringify(data), {});
  }

  savePlantDetailsData(data: any, hmiId: number) {
    return this.http.put(this.getApiUrl() + 'FieldDefinitions/SaveFieldDefinitions' + '?hmiId=' + hmiId, JSON.stringify(data));
  }

  uploadFile(data: any) {
    let customHdr = { 'image': '' };
    var form_data = new FormData();
    form_data.append('selectedFile', data);
    return this.http.post(this.aliadPlantData + '/upload', form_data, { headers: customHdr });
  }
}
