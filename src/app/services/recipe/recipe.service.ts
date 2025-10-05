import { ApiConfigService } from '../common/api-config.service';
import { API_NAMES } from '../../enums/apiNames.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  private get mainUrl() {
    return this.apiConfig.getApiUrl();
  }

  private get recipeUrl() {
    return this.mainUrl + API_NAMES.RECIPES;
  }

  private get recipeNodeUrl() {
    return this.apiConfig.getNode_Api_Url() + API_NAMES.RECIPES;
  }
  
  // private recipeNodeUrl = environment.nodeUrl;
  
  getApiUrl() {
    return this.apiConfig.getApiUrl();
  }

  getRecipeList(outputProductId?: number, isKocksSelected?: boolean) {
    let url = this.recipeUrl;
    if (isKocksSelected == false || isKocksSelected == true) {
      url = url + '?isKocksSelected=' + isKocksSelected

      if (outputProductId) {
        url = url + '&OutputProductId=' + outputProductId
      }
    }
    else {
      if (outputProductId) {
        url = url + '?OutputProductId=' + outputProductId
      }

    }
    return this.http.get(url);
  }

  saveRecipe(data: any) {
    return this.http.post(this.recipeUrl, JSON.stringify(data));
  }

  updateRecipe(data: any) {
    return this.http.put(this.recipeUrl + '/' + data.id, JSON.stringify(data));
  }

  deleteRecipe(id: number) {
    return this.http.delete(this.recipeUrl + '/' + id);
  }

  getFiles(id: any) {
    return this.http.get(this.recipeUrl + '/Export' + '?id=' + id, { responseType: 'blob' });
  }

  setActive(id: any) {
    return this.http.post(this.recipeUrl + '/SetActiveRecipe' + '?id=' + id, {});
  }

  CopyRecipeData(copy_From_recipeId: any, copy_To_recipeId: any, plantIds: any) {
    return this.http.post(this.recipeUrl + '/MergerRecipe?fromRecipeId=' + copy_From_recipeId + '&toRecipeId=' + copy_To_recipeId + plantIds, []);
  }

  sendToL1(recipeId: any, plantIds: any, parentFieldDefinitionId?:any) {
    return this.http.post(this.recipeNodeUrl + '/SendRecipeToL1?recipeId=' + recipeId + '&parentFieldDefinitionId=' + parentFieldDefinitionId + plantIds, []);
  }

  readFromL1(recipeId: any, plantIds: any, parentFieldDefinitionId?: any) {
    return this.http.post(this.recipeNodeUrl + '/ReadRecipeFromL1?recipeId=' + recipeId + '&parentFieldDefinitionId=' + parentFieldDefinitionId + plantIds, []);
  }

  UpdateFromActual(recipeId: any, plantIds: any) {
    let url = this.recipeUrl + '/UpdateFromActual?id=' + recipeId;
    if (plantIds) { url += plantIds; }
    return this.http.post(url, []);
  }

  saveAsRecipe(id: number, newName: string, newDesc: string, name: string) {
    return this.http.post(this.recipeUrl + '/SaveAs' + '?id=' + id + '&newRecipeName=' + newName + '&newRecipeDescription=' + newDesc + '&copyRecipeName=' + name, {});
  }

  uploadFile(recipeId: number, data: any) {
    let customHdr = { 'image': '' };
    var form_data = new FormData();
    form_data.append('selectedFile', data);
    return this.http.post(this.recipeUrl + '/Import?recipeId=' + recipeId, form_data, { headers: customHdr });
  }
}
