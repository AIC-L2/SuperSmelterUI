import { OperatorService } from '../../../services/operations/operator.service';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { RecipeComponent } from '../recipe/recipe.component';
import { DynamicEquipmentComponent } from '../dynamic-equipment/dynamic-equipment.component';

@Component({
  selector: 'app-operator-overview',
  standalone: true,
  imports: [CommonModule, TabsModule, RecipeComponent, DynamicEquipmentComponent],
  templateUrl: './operator-overview.component.html',
  styleUrls: ['./operator-overview.component.scss'],
  providers: [ConfirmationService]
})
export class OperatorOverviewComponent {

  @ViewChild('fileImport') fileImport: any;
  isOperatorScreen = true;
  selectedRecipe: { recipeId: number, isActive: boolean, isKocksSelected: boolean } = { recipeId: 0, isActive: false, isKocksSelected: false }
  selectedTab: string = 'stand';
  selectedFieldDefinitionId: any;
  selectedData: any;
  operatorTabList: any[] = [];
  isNoData: boolean = false;
  activeTabValue: string = '';
  activeTabIndex: number = 0;
  reloadBlockStand: string = '';

  constructor(
    private operatorService: OperatorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getOperatorTabList();
  }


  getOperatorTabList() {
    this.operatorTabList = [];
    this.operatorService.getOperatorTabList().subscribe({
      next: (res: any) => {
        if (res?.length) {
          this.isNoData = false;
          this.selectedTab = res[0].name;
          this.activeTabValue = res[0].name;
          this.operatorTabList = res;
        }
        else {
          this.operatorTabList = [];
          this.isNoData = true;
        }
      },
      error: (error) => {
        this.operatorTabList = [];
        this.isNoData = true;
      }
    })
  }

  //Output from Recipe
  changeRecipeID(event: any) {
    if (this.selectedRecipe?.isKocksSelected && !event?.isKocksSelected && this.selectedTab == 'kocks') {
      this.selectedTab = 'stand'
    }
    if (event) {
      // this.selectedRecipe = { recipeId: 0, isActive: false, isKocksSelected: event.isKocksSelected }
      this.selectedRecipe = { recipeId: event.id, isActive: event.isActive, isKocksSelected: event.isKocksSelected }
    }
    else {
      this.selectedRecipe = { recipeId: 0, isActive: false, isKocksSelected: false }
    }
  }

  onTabChange(event: any) {
    // PrimeNG tabs event contains the selected tab value
    const selectedTabName = event.value;
    const selectedTabItem = this.operatorTabList.find(item => item.name === selectedTabName);
    
    if (selectedTabItem) {
      this.selectedFieldDefinitionId = selectedTabItem.inverseParentOperatorTab[0]?.parentFieldDefinitionId;
      this.selectedTab = selectedTabItem.name;
      this.activeTabValue = selectedTabName;
      
      // Force change detection to ensure template bindings update
      this.cdr.detectChanges();
      
      // Small delay to ensure change detection propagates
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  }

  getSelectedEquipmentId(): any {
    const selectedTabItem = this.operatorTabList.find(item => item.name === this.selectedTab);
    if (selectedTabItem && selectedTabItem.inverseParentOperatorTab && selectedTabItem.inverseParentOperatorTab.length > 0) {
      return selectedTabItem.inverseParentOperatorTab[0].fieldTypeDefinitionId || selectedTabItem.id;
    }
    return selectedTabItem?.id || null;
  }

  trackByTabName(index: number, item: any): string {
    return item.name;
  }

  // Handle Gear Sel changes from Stand table
  onGearSelChanged(event: any) {
    this.reloadBlockStand = event;
  }

  // Return equipments with duplicates removed by fieldTypeDefinitionId (fallback equipmentName)
  uniqueEquipments(list: any[] = []): any[] {
    const seen = new Set<string>();
    return list.filter((e: any) => {
      const key = String(e?.fieldTypeDefinitionId ?? '') + '|' + String(e?.equipmentName ?? '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Get grid item class based on total items and current index
  getGridItemClass(totalItems: number, currentIndex: number): string {
    // With auto-fit grid, we don't need complex class logic
    // All items will automatically flow into available space
    return 'grid-item-auto';
  }
}
