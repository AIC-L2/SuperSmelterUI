import { HeaderService } from '../../../services/common/header.service';
import { RecipeService } from '../../../services/recipe/recipe.service';
import { RSocketService } from '../../../services/common/rsocket.service';
import { StorageService } from '../../../services/common/storage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DynamicEquipmentsService } from '../../../services/dynamic-equipments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { ToastModule } from 'primeng/toast';
import { CamelCaseToSpacePipe } from '../../../pipes/camelCasetoSpace.pipe';

@Component({
  selector: 'app-dynamic-equipment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ContextMenuModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ProgressBarModule,
    ConfirmDialogModule,
    RippleModule,
    InputTextModule,
    CheckboxModule,
    InputNumberModule,
    Select,
    NumberFormatPipe,
    ToastModule,
    CamelCaseToSpacePipe
  ],
  templateUrl: './dynamic-equipment.component.html',
  styleUrls: ['./dynamic-equipment.component.scss'],
  providers: [ConfirmationService,StorageService,MessageService,RSocketService,RecipeService,DynamicEquipmentsService,HeaderService]
})
export class DynamicEquipmentComponent implements OnInit, OnDestroy {

  @Output() gearSelChanged = new EventEmitter();

  
  @Input() set inpReloadBlockStand(data: any) {
    if (this.equipmentName === data) {
      
      this.tryLoadData();
    }
  }

  @Input() set MasterSelectedRecipe(recipeSelected: any) {
    if (recipeSelected ) {
      if (!this.recipeId ) { //initial Load
        this.recipeId = recipeSelected.recipeId;
        this.isActive = recipeSelected.isActive;
        this.tryLoadData();
      }
      else if (this.recipeId != recipeSelected.recipeId) {
        this.recipeId = recipeSelected.recipeId;
        this.isActive = recipeSelected.isActive;
        this.tryLoadData();
      }
      else {
        this.tryLoadData();
      }
    }
    else {
      this.dataList = [];
    }
  }
  // selectedfieldDefinitionId: any;
  @Input() set inpfieldDefinitionId(id: any) {
    if (id) {
      if (this.recipeId) {
        this.fieldDefinitionId = id;
        this.tryLoadData();
      }
    }
  }
  // selectedSpeed: any;
  @Input() set rollingSpeedMps(speed: any) {
    if (speed) {
      if (this.recipeId) {
        this.speedMPS = speed;
       } 
    }
  } 

  // selectedEquimentId: any;
  @Input() set inpEquipmentId(id: any) {
    if (id) {
      if (this.recipeId) {
        this.fieldTypeDefinitionId = id;
        this.tryLoadData();
      }
      else { //initial Load
        this.fieldTypeDefinitionId = id;
      }
    }
  }

  @Input() set isActiveTab(active: boolean) {
    // console.log('isActiveTab set to:', active, 'for equipment:', this.fieldTypeDefinitionId, 'recipeId:', this.recipeId);
    this.isTabActive = active;
    // If the tab becomes inactive while in edit mode, exit edit mode and reset transient state
    if (!active && this.editMode) {
      this.cancelEdit();
      this.selectedData = null;
      this.cdr.detectChanges();
    }
    this.tryLoadData();
  }

  // Helper method to check if we can load data
  private canLoadData(): boolean {
    return this.isTabActive && this.recipeId && this.fieldTypeDefinitionId;
  }

  // Try to load data if all conditions are met
  private tryLoadData(): void {
    if (this.canLoadData()) {
      this.getEquipmentData();
    }
  }

  // Method to determine parameter group based on parameter name
  private getParameterGroup(paramName: string): string | null {
    const lowerParamName = paramName.toLowerCase();
    
    // Debug logging to see actual parameter names
    // if (lowerParamName.includes('brake') || lowerParamName.includes('ramp') || lowerParamName.includes('delay') || lowerParamName.includes('speed')) {
    //   console.log('Parameter name:', paramName, 'Lowercase:', lowerParamName);
    // }
    
    if (lowerParamName.includes('head')) {
      return 'Head';
    } else if (lowerParamName.includes('tail')) {
      return 'Tail';
    } else if (lowerParamName.includes('scrap')) {
      return 'Scrap';
    } else if (lowerParamName.includes('brakeramp') || lowerParamName.startsWith('brakeramp')) {
      return 'Brake Ramp';
    } else if (lowerParamName.includes('brakedelay') || lowerParamName.startsWith('brakedelay')) {
      return 'Brake Delay';
    } else if (lowerParamName.includes('brakespeed') || lowerParamName.startsWith('brakespeed')) {
      return 'Brake Speed';
    }
    
    return null; // No group for parameters that don't match
  }

  // Method to clean parameter name by removing group prefix
  private cleanParameterName(paramName: string, groupName: string | null): string {
    if (!groupName) {
      return paramName;
    }
    
    const lowerParamName = paramName.toLowerCase();
    const lowerGroupName = groupName.toLowerCase().replace(/\s+/g, '');;
    
    // Remove group prefix from parameter name
    if (lowerParamName.startsWith(lowerGroupName)) {
      return paramName.substring(lowerGroupName.length).trim();
    }
    
    return paramName;
  }

  // Method to transpose data for non-Stand/Blockstand equipment
  private transposeData(dataList: any[], columns: any[]): any[] {
    if (!dataList || dataList.length === 0 || !columns || columns.length === 0) {
      return [];
    }

    const transposedRows: any[] = [];
    const uniqueParameters = new Set<string>();
    
    // First, collect all unique parameters from all devices
    dataList.forEach((device) => {
      if (device.value) {
        Object.keys(device.value).forEach(paramName => {
          uniqueParameters.add(paramName);
        });
      }
    });

    // Group parameters by their group type
    const groupedParameters = new Map<string, string[]>();
    const ungroupedParameters: string[] = [];
    
    Array.from(uniqueParameters).forEach((paramName) => {
      const group = this.getParameterGroup(paramName);
      if (group) {
        if (!groupedParameters.has(group)) {
          groupedParameters.set(group, []);
        }
        groupedParameters.get(group)!.push(paramName);
      } else {
        ungroupedParameters.push(paramName);
      }
    });

    // First, add ungrouped parameters (no group label) - these go on top
    ungroupedParameters.forEach((paramName) => {
      const row: any = {
        columnName: paramName,
        columnIndex: columns.findIndex(col => col.columnName === paramName),
        groupName: null,
        isFirstInGroup: false,
        groupRowSpan: 0,
        isUngrouped: true, // Flag to identify ungrouped parameters
        values: []
      };

      // Add values from each device for this parameter
      dataList.forEach((device, deviceIndex) => {
        const value = device.value[paramName];
        row.values.push({
          deviceName: device.equipmentName,
          deviceIndex: deviceIndex,
          value: value,
          plantDataId: device.plantDataId
        });
      });

      transposedRows.push(row);
    });

    // Then, add grouped parameters - these go after ungrouped ones
    const groupOrder = ['Head', 'Tail', 'Scrap', 'Brake Ramp', 'Brake Delay', 'Brake Speed'];
    
    groupOrder.forEach(group => {
      if (groupedParameters.has(group)) {
        const parameters = groupedParameters.get(group)!;
        
        // Add parameter rows for this group with group label
        parameters.forEach((paramName, paramIndex) => {
          const cleanedParamName = this.cleanParameterName(paramName, group);
          const row: any = {
            columnName: paramName, // Keep original for data lookup
            displayName: cleanedParamName, // Use cleaned name for display
            columnIndex: columns.findIndex(col => col.columnName === paramName),
            groupName: group,
            isFirstInGroup: paramIndex === 0, // Mark first parameter in group
            groupRowSpan: parameters.length, // Total parameters in this group
            isUngrouped: false, // Flag to identify grouped parameters
            values: []
          };

          // Add values from each device for this parameter
          dataList.forEach((device, deviceIndex) => {
            const value = device.value[paramName];
            row.values.push({
              deviceName: device.equipmentName,
              deviceIndex: deviceIndex,
              value: value,
              plantDataId: device.plantDataId
            });
          });

          transposedRows.push(row);
        });
      }
    });

    return transposedRows;
  }

  // Method to check if table should be transposed
  private shouldTransposeTable(): boolean {
    return this.equipmentName !== 'Stand' && this.equipmentName !== 'BlockStand';
  } 

  
  speedMPS:any= null;
  recipeId: any = 0;
  equipmentName: any = '';
  fieldTypeDefinitionId: any = 0;
  fieldDefinitionId: any = 0;
  isActive: boolean = false;
  isTabActive: boolean = false;
  l1Status: number = 0;
  dataList: any[] = [];
  clonedDataList: any[] = [];
  selectedData: any;
  loading: boolean = false;
  editMode: boolean = false;
  isModelChange: boolean = false;
  userPermissions: any;
  selectAll: boolean = false;
  cols: any[] = [];
  transposedData: any[] = [];
  isTransposed: boolean = false;

  previousVal: number = 0;
  currentVal: number = 0;
  isAnyCheckSelected: boolean = false;
  contextMenuItems = [
    { label: 'Undo', icon: 'pi pi-undo', selectedId: 0, disabled: true, command: (event: any) => this.undoSelectedRow(event) },
    // { label: 'Compare', icon: 'pi pi-clone', selectedId: 0, disabled: true, command: (event: any) => this.compare(event) },
  ];
  dlgProgress: boolean = false;
  isWaitForSignalR: boolean = false;
  sb_hdrl1Status: any;
  sb_readComplete: any;
  sb_writeComplete: any;

  standDataList: any;
  FrontBitingDataList: any;
  TailBitingDataList: any;

  // Numeric values for proper equality matching with model
  gearboxOptions: { label: string, value: number }[] = [
    { label: 'B2', value: 2 },
    { label: 'B4', value: 4 }
  ];

  equipments: any[] = [{name:'PR',value:'Pinch Roll'},{name:'CCSH',value:'Crop Shear'},{name:'TB',value:'Tail Breaker'},{name:'TC',value:'RES'},{name:'Rake',value:'Rake'},{name:'SDVR',value:'Servo Diverter'},{name:'SSH',value:'continuous Speed Shears'}];

  constructor(
    // private route: ActivatedRoute,
    // private utilService: UtilService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private messages: MessageService,
    private socketService: RSocketService,
    private recipeService: RecipeService,
    private dynamicEqupmentsService: DynamicEquipmentsService,
    private headerService: HeaderService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // this.userPermissions = this.getUserPermission();
    this.userPermissions = null; // Initialize to null to make buttons visible
    this.sb_hdrl1Status = this.headerService._l1Status.subscribe((res: any) => {
      this.l1Status = res;
    })
    this.getSIgnalrReadStatus();
    this.getSIgnalrWriteStatus();
    // this.getEquipmentData();
  }

  ngOnDestroy() {
    // this.reloadRequired.unsubscribe();
    this.sb_hdrl1Status.unsubscribe();
    this.sb_readComplete.unsubscribe();
    this.sb_writeComplete.unsubscribe();
  }

  // getUserPermission() {
  //   let user: any = this.storageService.getItem('user');
  //   let claims = user ? JSON.parse(user).claims : '';
  //   let userPermission = claims.find((item: any) => item.screenEnumId === SCREENS_ID.operator);
  //   return userPermission;
  // }

  getSIgnalrReadStatus() {
    this.sb_readComplete = this.socketService.isReadComplete.subscribe((_data: any) => {
      if (this.isWaitForSignalR) {
        this.isWaitForSignalR = false;
        setTimeout(() => { //Wait for database Updation
          this.dlgProgress = false;
                  this.messages.add({ severity: 'success', summary: 'Read Complete' })
          this.getEquipmentData();
        }, 6000);
      }
    });
  }

  getSIgnalrWriteStatus() {
    this.sb_writeComplete = this.socketService.isWriteComplete.subscribe((_data: any) => {
      if (this.isWaitForSignalR) {
        this.isWaitForSignalR = false;
        this.dlgProgress = false;
        this.messages.add({ severity: 'success', summary: 'Write Complete' })
      }
    });
  }

  getEquipmentData() {
    this.loading = true;
  
    this.dynamicEqupmentsService.getDynamicEquipmentList(
      this.recipeId,
      this.fieldTypeDefinitionId,
      this.fieldDefinitionId,
      this.speedMPS
    ).subscribe({
      next: (res: any) => {
        if (res.equipmentName === 'Stand') {
          this.standDataList = res;
          // console.log(this.standDataList);
          this.equipmentName = this.standDataList.equipmentName;
          this.cols = [...this.standDataList.columns];  // clone so push doesn't mutate original
          let standList: any[] = [...this.standDataList.values];
  
          // --- Front Biting ---
          this.dynamicEqupmentsService.getDynamicEquipmentList(
            this.recipeId, 47, 12016, this.speedMPS
          ).subscribe({
            next: (res: any) => {
              this.FrontBitingDataList = res;
              this.FrontBitingDataList.columns = this.FrontBitingDataList.columns.map((column: any) => ({
                ...column,
                columnName: `FB${column.columnName}`
              }));
              this.cols.push(...this.FrontBitingDataList.columns);
  
              // merge FrontBiting values
              const updatedValues: { [key: string]: any } = {};
              standList = standList.map((stand: any) => {
                const biting = this.FrontBitingDataList.values.find(
                  (b: any) => b.sequenceNo === stand.sequenceNo
                );

                Object.keys(biting.value).forEach((key) => {
                  const newKey = `FB${key}`;
                  updatedValues[newKey] = { ...biting.value[key] }; // Copy the value object
                });
                biting.value = {...updatedValues};
                

                return biting
                  ? { ...stand, value: { ...stand.value, ...biting.value } }
                  : stand;
              });
  
              // --- Tail Biting ---
              this.dynamicEqupmentsService.getDynamicEquipmentList(
                this.recipeId, 47, 12150, this.speedMPS
              ).subscribe({
                next: (res: any) => {
                  this.TailBitingDataList = res;
                  this.TailBitingDataList.columns = this.TailBitingDataList.columns.map((column: any) => ({
                    ...column,
                    columnName: `TB${column.columnName}`
                  }));
                  this.cols.push(...this.TailBitingDataList.columns);
                  const updatedValues2: { [key: string]: any } = {};

  
                  // merge TailBiting values
                  standList = standList.map((stand: any) => {
                    const biting = this.TailBitingDataList.values.find(
                      (b: any) => b.sequenceNo === stand.sequenceNo
                    );
                    Object.keys(biting.value).forEach((key) => {
                      const newKey = `TB${key}`;
                      updatedValues2[newKey] = { ...biting.value[key] }; // Copy the value object
                    });
                    biting.value = {...updatedValues2};
                    return biting
                      ? { ...stand, value: { ...stand.value, ...biting.value } }
                      : stand;
                  });

                  
                  // ✅ final merged result
                  this.dataList = [...standList];
                  // Normalize GearboxSel values to numbers for select binding
                  this.dataList.forEach((row: any) => {
                    if (row?.value?.GearboxSel && row.value.GearboxSel.sp !== undefined && row.value.GearboxSel.sp !== null && row.value.GearboxSel.sp !== '') {
                      const n = Number(row.value.GearboxSel.sp);
                      if (!Number.isNaN(n)) {
                        row.value.GearboxSel.sp = n;
                      }
                    }
                  });
                  this.clonedDataList = JSON.parse(JSON.stringify(this.dataList));
                  this.loading = false;
  
                  // console.log(this.cols);
                  // console.log(this.dataList);
                },
                error: (err: any) => {
                  console.log(err);
                  this.loading = false;
                }
              });
            },
            error: (err: any) => {
              console.log(err);
              this.loading = false;
            }
          });
        } else {
          // Non-stand case
          const equip = this.equipments.find((item: any) => item.name === res.equipmentName);
          this.equipmentName = equip ? equip.value : res.equipmentName;
          this.fieldTypeDefinitionId = res.fieldTypeDefinitionId;
          this.cols = res.columns ?? [];
          this.dataList = res.values ?? [];
          this.clonedDataList = JSON.parse(JSON.stringify(this.dataList));
          
          // Check if table should be transposed
          this.isTransposed = this.shouldTransposeTable();
          if (this.isTransposed) {
            this.transposedData = this.transposeData(this.dataList, this.cols);
          }
          
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
      }
    });
  }
  

  onRowSelected(event: any) {    
    this.previousVal = this.currentVal; //For getting previous selected row Id
    this.currentVal = event.index;
    //To edit current row //('btn_op_i') button is for init edit row 
    let element: HTMLElement = document.getElementsByClassName('btn_deqp_e_' + this.fieldTypeDefinitionId + '_' + this.currentVal)[0] as HTMLElement;
    element && element.click();

    // setTimeout(() => {
    //   let input: HTMLElement = document.getElementsByClassName('dia_' + this.currentVal)[0] as HTMLElement;
    //   input && input.focus();
    // }, 0);
    if (this.previousVal >= 0 && (this.currentVal !== this.previousVal)) {
      //To Close previous opened row
      let prevelement: HTMLElement = document.getElementsByClassName('btn_deqp_c_' + this.fieldTypeDefinitionId + '_' + this.previousVal)[0] as HTMLElement;
      prevelement && prevelement.click();
    }
  }

  onRowUnSelected() {
    let prevelement: HTMLElement = document.getElementsByClassName('btn_deqp_c_' + this.fieldTypeDefinitionId + '_' + this.currentVal)[0] as HTMLElement;
    prevelement && prevelement.click();
  }

  ngModelChange(index: any, col: any) {
    this.isModelChange = true;
    this.dataList[index].change = true;
    this.dataList[index].value[col.columnName].change = true;
  }

  ngModelChangeTransposed(deviceIndex: any, columnIndex: any) {
    this.isModelChange = true;
    this.dataList[deviceIndex].change = true;
    
    // Find the column name from the transposed data if columnIndex is -1
    let columnName: string;
    if (columnIndex >= 0 && this.cols[columnIndex]) {
      columnName = this.cols[columnIndex].columnName;
    } else {
      // Find the column name from transposed data
      const transposedRow = this.transposedData.find(row => 
        row.values.some((val: any) => val.deviceIndex === deviceIndex)
      );
      columnName = transposedRow ? transposedRow.columnName : '';
    }
    
    if (columnName && this.dataList[deviceIndex].value[columnName]) {
      this.dataList[deviceIndex].value[columnName].change = true;
    }
    
    // Update the transposed data as well
    if (this.isTransposed) {
      const transposedRow = this.transposedData.find(row => row.columnName === columnName);
      if (transposedRow && transposedRow.values[deviceIndex]) {
        transposedRow.values[deviceIndex].value.change = true;
      }
    }
  }

  enableEdit() {
    setTimeout(() => {
      this.editMode = true;
      this.selectedData = null;
      this.cdr.detectChanges();
    });
  }

  cancelEdit() {
    setTimeout(() => {
      this.editMode = false;
      this.onRowUnSelected();
      this.dataList = JSON.parse(JSON.stringify(this.clonedDataList));
      this.isModelChange = false;
      
      // Update transposed data if needed
      if (this.isTransposed) {
        this.transposedData = this.transposeData(this.dataList, this.cols);
      }
      
      this.cdr.detectChanges();
    });
  }

  checkAllEvent(checkValue: any) {
    if (checkValue) {
      this.dataList.map((item) => {
        item.isSelected = true;
      });
      this.isAnyCheckSelected = true;
    } else {
      this.dataList.map((item) => {
        item.isSelected = false;
      });
      this.isAnyCheckSelected = false;
    }
  }

  onChangeCheckbox() {
    this.isAnyCheckSelected = this.dataList.some((item: any) => item.isSelected);
    if (!this.isAnyCheckSelected) {
      this.selectAll = false;
    }
  }

  trackByMethod(el: any): number {
    return el.id;
  }

  contextMenuSelected(event: any) {
    this.contextMenuItems[0].selectedId = event.data.plantDataId;
    // this.contextMenuItems[1].selectedId = event.data.plantDataId;
    if (event.data?.change) {
      this.contextMenuItems[0].disabled = false;
      // this.contextMenuItems[1].disabled = false;
    }
    else {
      this.contextMenuItems[0].disabled = true;
      // this.contextMenuItems[1].disabled = true;
    }
    this.contextMenuItems = [...this.contextMenuItems]
  }

  undoSelectedRow(event: any) {
    let selectedId = event.item?.selectedId ?? null;
    let index = this.dataList.findIndex(x => x.plantDataId === selectedId);
    this.dataList[index] = JSON.parse(JSON.stringify(this.clonedDataList[index]));
    this.isModelChange = this.dataList.find((item: any) => item.change == true) ? true : false;
  }

  // Generate dropdown options for integer ranges (inclusive)
  getIntegerOptions(min: any, max: any): { label: string, value: number }[] {
    const start = parseInt(min);
    const end = parseInt(max);
    if (isNaN(start) || isNaN(end) || end < start) {
      return [];
    }
    const opts: { label: string, value: number }[] = [];
    for (let v = start; v <= end; v++) {
      opts.push({ label: String(v), value: v });
    }
    return opts;
  }

  onGearboxSelChange(rowIndex: number, col: any) {
    // normalize to number for consistency
    const current = this.dataList[rowIndex].value[col.columnName].sp;
    const n = Number(current);
    this.dataList[rowIndex].value[col.columnName].sp = Number.isNaN(n) ? current : n;
    this.ngModelChange(rowIndex, col);
  }

  getGearboxLabel(value: any): string {
    const n = Number(value);
    const found = this.gearboxOptions.find(opt => opt.value === n);
    return found ? found.label : (value !== undefined && value !== null ? String(value) : '');
  }

  // compare(event: any) {
  //   this.compareDialog = true;
  //   let selectedId = event.item?.selectedId ?? null;
  //   let index = this.dataList.findIndex(x => x.plantDataId === selectedId);
  //   this.compareList.push({ ...this.clonedList[index] });
  //   this.compareList.push({ ...this.dataList[index] });
  // }

  // onKeydown events, arrow key navigation
  onKeydown(event: any, index: number) {
    if (event.key === "ArrowDown") {
      if (index != this.dataList.length - 1) {
        this.selectedData = this.dataList[index + 1];
        let event = {
          index: index + 1
        }
        this.onRowSelected(event)
      }
    }
    if (event.key === "ArrowUp") {
      if (this.selectedData != this.dataList[0]) {
        this.selectedData = this.dataList[index - 1];
        let event = {
          index: index - 1
        }
        this.onRowSelected(event)
      }
    }
  }

  // send and rcve apis after rsocket connctions.
  readRecipeFromL1() {
    let query = '';
    let selectedRows = this.dataList.filter((item: any) => item.isSelected);
    for (let i = 0; i < selectedRows?.length; i++) {
      query = query + '&plantDataIds=' + selectedRows[i].plantDataId;
    }
    if(selectedRows.length == 0){
      for (let i = 0; i < this.dataList?.length; i++) {
        query = query + '&plantDataIds=' + this.dataList[i].plantDataId;
      }
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to read from L1?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dlgProgress = true;
        this.socketService.checkConnectionOK();
        this.isWaitForSignalR = true;
        this.socketService.setisCurrentPc(true);
        this.recipeService.readFromL1(this.recipeId, query, this.fieldDefinitionId).subscribe({
          next: () => {
            setTimeout(() => { //IF no response from signalR
              if (this.isWaitForSignalR) {
                this.dlgProgress = false;
                this.getEquipmentData();
              }
            }, 6000);
            this.isAnyCheckSelected = false;
            this.selectAll = false;
          },
          error: (err: any) => {
            console.log(err);
            this.dlgProgress = false;
            this.isAnyCheckSelected = false;
            this.socketService.setisCurrentPc(false);
            this.messages.add({ severity: 'error', summary: 'Error' })
          }
        });
      }
    });
  }

  updateRecipeValues() {
    let query = '';
    let selectedRows = this.dataList.filter((item: any) => item.isSelected);
    for (let i = 0; i < selectedRows?.length; i++) {
      query = query + '&plantDataIds=' + selectedRows[i].plantDataId;
    }
    if(selectedRows.length == 0){
      for (let i = 0; i < this.dataList?.length; i++) {
        query = query + '&plantDataIds=' + this.dataList[i].plantDataId;
      }
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to update?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.socketService.setisCurrentPc(true);
        this.dynamicEqupmentsService.updateDynamicFromActual(this.recipeId, query, this.fieldDefinitionId).subscribe({
          next: () => {
            this.messages.add({ severity: 'success', summary: 'Successfully Updated' })
            this.isAnyCheckSelected = false;
            this.selectAll = false;
            this.getEquipmentData();
          },
          error: (err: any) => {
            console.log(err);
            this.socketService.setisCurrentPc(false);
            this.messages.add({ severity: 'error', summary: 'Error' })
          }
        });
      },
    });
  }

  sendRecipeToL1() {
    let query = '';
    let selectedRows = this.dataList.filter((item: any) => item.isSelected);
    for (let i = 0; i < selectedRows?.length; i++) {
      query = query + '&plantDataIds=' + selectedRows[i].plantDataId;
    }
    if(selectedRows.length == 0){
      for (let i = 0; i < this.dataList?.length; i++) {
        query = query + '&plantDataIds=' + this.dataList[i].plantDataId;
      }
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to send to L1?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dlgProgress = true;
        this.socketService.checkConnectionOK();
        this.isWaitForSignalR = true;
        this.recipeService.sendToL1(this.recipeId, query, this.fieldDefinitionId).subscribe({
          next: () => {
            setTimeout(() => { //IF no response from signalR
              if (this.isWaitForSignalR) {
                this.dlgProgress = false;
                this.getEquipmentData();
              }
            }, 6000);
            this.selectAll = false;
            this.isAnyCheckSelected = false;
          },
          error: (err: any) => {
            console.log(err);
            this.dlgProgress = false;
            this.isAnyCheckSelected = false;
            this.dlgProgress = false;
            this.messages.add({ severity: 'error', summary: 'Error' })
          }
        });
      },
    });
  }

  saveSubmit() {
    let filterData = this.dataList.filter(t => t.change);
    let editedValues: any[] = [];
    let hasGearSelChanges = '';
    
    filterData.forEach(item => {
      Object.entries(item.value).forEach(([key, tag]: [string, any]) => {
        if (tag.change && typeof tag.sp != "boolean") {
          if (tag.sp != "") {
            if (parseInt(tag.sp) < parseInt(tag.minValues)) {
              tag.sp = tag.minValues;
            }
            if (parseInt(tag.sp) > parseInt(tag.maxValues)) {
              tag.sp = tag.maxValues;
            }
          }
        } 
        if (tag?.change) {
          var temp = { recipeValueId: tag.recipeValueId, value: tag.sp };
          editedValues.push(temp);
          
          // Check if Gear Sel column was changed (check multiple possible names)
          if (key === 'GearboxSel') {
            hasGearSelChanges = 'BlockStand';
          }
        }
      });
    });
    if (editedValues && editedValues.length) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to save?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.socketService.setisCurrentPc(true);
          this.dynamicEqupmentsService.updateDynamicEquipmentData(this.recipeId, editedValues).subscribe({
            next: () => {
              this.onRowUnSelected();
              this.selectedData = null;
              this.getEquipmentData();
              this.isModelChange = false;
              setTimeout(() => {
                this.editMode = false;
                this.cdr.detectChanges();
              });
              this.messages.add({ severity: 'success', summary: 'Successfully Saved' });
              
              // Emit event if Gear Sel was changed
              if (hasGearSelChanges && this.equipmentName === 'Stand') {
                setTimeout(() => {
                  this.gearSelChanged.emit(hasGearSelChanges);
                }, 1000);
                this.gearSelChanged.emit('');
              }
            },
            error: (err: any) => {
              console.log(err);
              this.socketService.setisCurrentPc(false);
              this.messages.add({ severity: 'error', summary: 'Error' })
            }
          });
        },
      });
    }
    else {
      this.isModelChange = false;
      this.messages.add({ severity: 'info', summary: 'No modified values' })
    }

  }



  enforceMinMax(el: any, index: number, col: any) { 
    if (el.target.value != "") {
      if (parseInt(el.target.value) < parseInt(el.target.min)) {
        this.dataList[index].value[col.columnName].sp = el.target.min;
      }
      if (parseInt(el.target.value) > parseInt(el.target.max)) {
        this.dataList[index].value[col.columnName].sp = el.target.max;
      }
    }
  }

  enforceMinMaxTransposed(el: any, deviceIndex: number, columnIndex: number) { 
    if (el.target.value != "") {
      let columnName: string;
      if (columnIndex >= 0 && this.cols[columnIndex]) {
        columnName = this.cols[columnIndex].columnName;
      } else {
        // Find the column name from transposed data
        const transposedRow = this.transposedData.find(row => 
          row.values.some((val: any) => val.deviceIndex === deviceIndex)
        );
        columnName = transposedRow ? transposedRow.columnName : '';
      }
      
      if (columnName && this.dataList[deviceIndex].value[columnName]) {
        if (parseInt(el.target.value) < parseInt(el.target.min)) {
          this.dataList[deviceIndex].value[columnName].sp = el.target.min;
        }
        if (parseInt(el.target.value) > parseInt(el.target.max)) {
          this.dataList[deviceIndex].value[columnName].sp = el.target.max;
        }
      }
    }
  }
}
