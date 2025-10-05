import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { PlantDataService } from '../../../services/plant-data.service';

@Component({
  selector: 'app-merge-recipe',
  templateUrl: './merge-recipe.component.html',
  styleUrls: ['./merge-recipe.component.scss'],
  imports: [CommonModule, FormsModule, TranslateModule, TableModule, CheckboxModule],
  standalone: true
})
export class MergeRecipeComponent {
  @Output() equipList = new EventEmitter();

  equipTableDataList: any[] = [];
  selectAll: boolean = false;
  isAnyCheckSelected: boolean = false;
  selectedEquipTableData: any;
  loading: boolean = false;
  equipListData: string = '';
  
  constructor( 
    private plantDataService: PlantDataService,) { }

  ngOnInit(): void {
    this.getPlantDataList();
    }


  getPlantDataList() {
    setTimeout(() => {
      this.loading = true;
      this.plantDataService.getPlantDataList().subscribe((res: any) => { 
        this.equipTableDataList = res || [];      
        this.loading = false;
      }) 
    }, 1000);
  }

  onChangeCheckbox() {
    this.isAnyCheckSelected = this.equipTableDataList.some((item: any) => item.isSelected);
    
    // Update select all checkbox state
    if (this.isAnyCheckSelected) {
      const allSelected = this.equipTableDataList.every((item: any) => item.isSelected);
      this.selectAll = allSelected;
    } else {
      this.selectAll = false;
    }
    
    this.updateSelectedEquipment();
  }
   // onKeydown events, arrow key navigation
   onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === "ArrowDown") {
      if (index !== this.equipTableDataList.length - 1) {
        this.selectedEquipTableData = this.equipTableDataList[index + 1]; 
       }
    }
    if (event.key === "ArrowUp") {
      if (index > 0) {
        this.selectedEquipTableData = this.equipTableDataList[index - 1]; 
       }
    }
  }

  checkAllEvent(checkValue: boolean) {
    this.equipListData = '';
    this.selectAll = checkValue;
    
    if (checkValue) {
      this.equipTableDataList.forEach((item: any) => {
        item.isSelected = true;
      });
      this.isAnyCheckSelected = true;
    } else {
      this.equipTableDataList.forEach((item: any) => {
        item.isSelected = false;
      });
      this.isAnyCheckSelected = false;
    }
    
    this.updateSelectedEquipment();
  }

  private updateSelectedEquipment() {
    this.equipListData = '';
    const selectedRows = this.equipTableDataList.filter((item: any) => item.isSelected);
    
    for (let i = 0; i < selectedRows?.length; i++) {
      this.equipListData = this.equipListData + '&plantDataIds=' + selectedRows[i].id;
    }
    
    this.equipList.emit(this.equipListData);
  }

  

}
