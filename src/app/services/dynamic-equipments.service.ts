import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './common/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicEquipmentsService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  private get recipeUrl() {
    return this.getApiUrl()+'Recipes';
  }

  private get rollDTOUrl() {
    return this.getApiUrl();
  }

  getApiUrl() {
    return this.apiConfig.getApiUrl();
  }

    //Dynamic
    getDynamicEquipmentList(recipeId: number, fieldTypeDefinitionId: number, fieldDefinitionId:any, speed?:any) {
      return this.http.get(this.recipeUrl + '/GetEquipmentDataNew?recipeId=' + recipeId + '&fieldTypeDefinitionId=' + fieldTypeDefinitionId + '&fieldDefinitionId=' + fieldDefinitionId    + '&speed=' + speed );
    }
  
    updateDynamicEquipmentData(recipeId: any, data: any) {
      return this.http.post(this.recipeUrl + '/EditEquipmentData?recipeId=' + recipeId, JSON.stringify(data));
    }
  
    updateDynamicFromActual(recipeId: any, plantIds: any, parentFieldDefinitionId?:any ) {
      return this.http.post(this.recipeUrl + '/UpdateFromActual?id=' + recipeId + '&parentFieldDefinitionId=' + parentFieldDefinitionId + plantIds, []);
    }


    getRollsData(recipeId: any) {
      return this.http.get(this.rollDTOUrl+ '/GetRollDTO' + '?recipeId=' + recipeId);
    }

    saveRollsList(data: any) {
      return this.http.put(this.recipeUrl + '/EditRollsDTOs', JSON.stringify(data));
    }
    
    rollChange(plantDataId:number, isPassChange:boolean) {
      return this.http.post(this.recipeUrl + '/RollChange' + '?plantDataId=' +  plantDataId + '&isPassChange='+ isPassChange, []);
    }

    updateValuesPlantId(recipeId: any, plantIds:any) {
      return this.http.post(this.getApiUrl() + this.recipeUrl + '/UpdateFromActual?id=' + recipeId + plantIds, []);
    }
  
    sendRollsToL1(recipeId:any,plantIds: any){
      return this.http.post(this.recipeUrl + '/SendRecipeToL1?recipeId=' + recipeId + plantIds+"&mainFieldDefinitionId=12288", []);
    }

}
