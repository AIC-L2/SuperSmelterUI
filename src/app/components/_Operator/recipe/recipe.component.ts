import { MasterDataService } from '../../../services/master-data.service';
import { UtilService } from '../../../services/common/utils-service';
import { RSocketService } from '../../../services/common/rsocket.service';
import { StorageService } from '../../../services/common/storage.service';
import { RecipeService } from '../../../services/recipe/recipe.service';
import { ApiConfigService } from '../../../services/common/api-config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RELOAD_TIME } from '../../../constants/reloadtimeconstants';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { SocketService } from '../../../services/common/socket.service';
import { HeaderService } from '../../../services/common/header.service';
import { ReloadService } from '../../../services/common/reload.service';
import { ToastModule } from 'primeng/toast';
import { MergeRecipeComponent } from '../merge-recipe/merge-recipe.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ContextMenuModule,
    SelectModule,
    MultiSelectModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    ProgressBarModule,
    ConfirmDialogModule,
    NumberFormatPipe,
    ToastModule,
    MergeRecipeComponent
  ],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  providers: [ConfirmationService, MessageService, RecipeService, MasterDataService, UtilService, StorageService, RSocketService, ApiConfigService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecipeComponent implements OnInit, OnDestroy {

  @Output() selectOption = new EventEmitter();
  @Output() out_selectedRecipe = new EventEmitter();
  // @Input() set screen(data: any) {
  //   if (data) {
  //     this.isOperatorScreen = data;
  //   }
  // }

  // @Input() set recipeInpData(data: any) {
  //   if (data) {
  //     this.isMillSetup = true;
  //     this.productId = data?.productId ?? 0;
  //   }
  // }

  @ViewChild('recipeTable') recipeTable: any;
  @ViewChild('fileImport') fileImport: any;
  copyEquipmentsListData: any;
  copy_From_recipeId: any;
  selectedCopyRecipe: any;
  isOperatorScreen = false;
  isMillSetup = false;
  // productId: number = 0;
  // screenProduct: boolean = false;
  RecipeDataList: any[] = [];
  // selectedRecipeId: number = 0;
  // private reportUrl: string = environment.reportUrl;
  // private recipeReportUrl: string = this.reportUrl + "Reports/RecipeReport.aspx";
  // plantIds: any;
  // facility: any;
  selectedPlantDataList: any
  saveAsdlg = false;
  userPermissions: any;
  reloadRequired: any;
  recipeList: any[] = [];
  copyRecipeList: any[] = [];
  selectedRecipe: any;
  recipeId = 0;
  dlgRecipe: boolean = false;
  // importUrl = environment.baseUrl + 'recipes/Import';
  recipeDialogData = {
    id: 0,
    name: '',
    description: '',
    // inputProductId: null,
    outputProductId: 0,
    diameter: 0,
    steelGradeId: null,
    fmspeed: 0,
    finalStandSpeed: 0,
    finalSpeed: 0,
    rollingTime: 0,
    gapTime: 0,
    finalStand: 0,
    productivity: 0,
    furnaceTemp: 0,
    billetLength: 0,
    isActive: false,
    isDefault: false,
  };
  saveAsData = {
    id: 0,
    name: '',
    newName: '',
    description: '',
  };
  isEdit: boolean = false;
  submitted: boolean = false;
  // inputProductsList: any[] = [];
  outputProductsList: any[] = [];
  dlgProgress: boolean = false;
  isWaitForSignalR: boolean = false;
  steelGradeList: any[] = [];
  refreshRecipeValues: number = 0;
  shapes: any;
  productSubscription!: Subscription;
  product: any;
  loaderCount: number = 0;
  loadReport = false;
  showLoading = false;
  showReportDialog: boolean = false;
  urlSafe: SafeResourceUrl | null = null;
  sb_hdrl1Status: any;
  sb_readComplete: any;
  sb_writeComplete: any;
  sb_AppDataModify: any;
  l1Status: number = 0; //from header service
  contextMenuItems: any[] = [
    { Id: 1, label: 'Edit', icon: 'pi pi-file-edit', disabled: false, command: () => this.showRecipeDialog('Edit') },
    { Id: 2, label: 'Delete', icon: 'pi pi-trash', disabled: false, command: () => this.deleteRecipe() },
    { Id: 3, label: 'Duplicate', icon: 'pi pi-copy', disabled: false, command: () => this.openSaveAs() },
  ];
  contextSelectedRecipeId: number = 0; // To avoid recipe value reload in same row context selection
  contentHeightSub: any;
  contentHeight: string = '19vh';
  loading: boolean = false;
  recipeDlg: boolean = false;
  isRecipeExist: boolean = false;
  unSelectedId: any;
  windowHeight: any;
  timeInterval: any;
  interval: any;
  sb_APIConnectionOk: any;
  isAPIConnectionOk: boolean = false;
  isRequest: boolean = false;
  productId: any;
  isFileImportDialog: boolean = false;
  fileErrorMessage: string = "";
  selectedFile: any;
  uploadFileSize = 1000000;
  isRecipeGridMinimized: boolean = true; // Changed to true to show minimized initially
  private reloadSubscription: Subscription | null = null;

  constructor(
    private recipeService: RecipeService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    // private translate: TranslateService,
    // private panelService: PanelService,
    private messages: MessageService,
    private socketService: RSocketService,
    private utilService: UtilService,
    private masterDataService: MasterDataService,
    private sanitizer: DomSanitizer,
    private iosocketService: SocketService,
    private headerService: HeaderService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.reloadSubscription = this.reloadService.reload$.subscribe(shouldReload => {
      if (shouldReload) {
        this.getMasterData();
        this.reloadService.resetReload();
      }
    });
    this.getMasterData();
    // this.userPermissions = this.getUserPermission();
    if (this.userPermissions?.interval) {
      this.interval = this.userPermissions?.interval ?? undefined;
    }
    if (!this.userPermissions?.canEdit) {
      this.contextMenuItems = [];
    }
    if (!this.userPermissions?.canDelete) {
      let deleteItem = this.contextMenuItems.find(item => item.Id == 2);
      if (deleteItem) {
        this.contextMenuItems.splice(this.contextMenuItems.indexOf(deleteItem), 1)
      }
    }
    // this.sb_APIConnectionOk = this.headerService.IsConnectionOk.subscribe((status: any) => {
    //   this.isAPIConnectionOk = status;
    // });
    // this.reloadRequired = this.headerService.reloadRequired.subscribe((required: any) => {
    //   if (required) {
    //     this.getRecipeList();
    //   }
    // });

    //Content Height
    // let height = this.panelService.getContentHeight();
    // this.windowHeight = height;
    // this.contentHeight = Math.max((height * 0.26) - 4, 50) + "px";
    // this.contentHeightSub = this.panelService.contentHeightState.subscribe((data: any) => {
     // this.windowHeight = data; 
       // this.contentHeight = Math.max((data * 0.26) - 4, 50) + "px";
    // });

    this.sb_hdrl1Status = this.headerService._l1Status.subscribe((res: any) => {
      this.l1Status = res;
    })  
    this.getSIgnalrReadStatus();
    this.getSIgnalrWriteStatus();
    this.getSIgnalrAppDataModify();
    this.startInterval();
    
    // Add dummy data for testing
  }


  ngOnDestroy() {
    this.reloadRequired?.unsubscribe();
    this.contentHeightSub?.unsubscribe();
    this.sb_hdrl1Status?.unsubscribe();
    this.sb_readComplete?.unsubscribe();
    this.sb_writeComplete?.unsubscribe();
    this.sb_AppDataModify?.unsubscribe();
    this.sb_APIConnectionOk?.unsubscribe();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  // getUserPermission() {
  //   let user: any = this.storageService.getItem('user');
  //   let claims = user ? JSON.parse(user).claims : '';
  //   let screen_id = this.isOperatorScreen ? SCREENS_ID.operator : SCREENS_ID.recipes;
  //   let userPermission = claims.find((item: any) => item.screenEnumId === screen_id);
  //   return userPermission;
  // }

  startInterval() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.interval) {
      this.timeInterval = setInterval(() => {
        if (this.isAPIConnectionOk && !this.isRequest) {
          this.getRecipeList();
        }
      }, this.interval);
    }
  }

  getSIgnalrReadStatus() {
    this.sb_readComplete = this.iosocketService.isReadComplete.subscribe((data: any) => {
      if (this.isWaitForSignalR) {
        this.isWaitForSignalR = false;
        this.dlgProgress = false;
        this.refreshRecipeValues = this.refreshRecipeValues ? 0 : 1;
        this.messages.add({ severity: 'success', summary: 'Read Complete' });
        this.getRecipeList();
      }
    });
  }

  getSIgnalrWriteStatus() {
    this.sb_writeComplete = this.iosocketService.isWriteComplete.subscribe((data: any) => {
      if (this.isWaitForSignalR) {
        this.isWaitForSignalR = false;
        this.dlgProgress = false;
        this.messages.add({ severity: 'success', summary: 'Write Complete' });
        this.getRecipeList();
      }
    });
  }

  getSIgnalrAppDataModify() {
    this.sb_AppDataModify = this.socketService.isAppDataModify.subscribe((data: any) => {
      let isCurrentPc = this.socketService.getisCurrentPc();
      if (!isCurrentPc) {
        this.getRecipeList();
      }
      else {
        this.socketService.setisCurrentPc(false);
      }
    });
  }

  getMasterData() {
    this.shapes = this.utilService.getCastShapeConstant();
    this.getGradesList();
    this.getOutPutProductList();
    
    // this.masterDataService.getInputProductList().subscribe((res: any) => {
    //   this.inputProductsList = res;
    //   this.getRecipeList();
    // })
  }

  getGradesList() {
    this.masterDataService.getGradesData().subscribe((res: any) => {
      this.steelGradeList = res;
    });
  }

  getOutPutProductList() {
    this.masterDataService.getOutputProductList().subscribe((res: any) => {
      this.outputProductsList = res;
      this.getRecipeList();
    });
  }

  onRowSelect() {
    this.recipeId = this.selectedRecipe.id;
    this.unSelectedId = this.recipeId;
    this.selectOption.emit(this.selectedRecipe);
    if (this.isMillSetup) {
      this.out_selectedRecipe.emit(this.selectedRecipe);
    }
  }

  onRowUnSelect(event: any) {
    this.selectedRecipe = event.data;
    this.unSelectedId = event.data.id;
  }

  contextMenuSelected(event: any) {
    // To avoid recipe value reload in same row context selection
    if (this.contextSelectedRecipeId != this.selectedRecipe.id) {
      this.contextSelectedRecipeId = event.data?.id ?? 0;
      this.onRowSelect();
    }
    else {
      this.onRowSelect();
    }

    let deleteItem = this.contextMenuItems.find(t => t.Id == 2); //DELETE
    if (deleteItem) {
      if (event.data.isActive) { deleteItem.disabled = true; }
      else { deleteItem.disabled = false; }
    }
    this.contextMenuItems = [...this.contextMenuItems]
  }

  onFilter(event: any) {
    if (event.filteredValue.length > 0) {
      //  this.selectedRecipe = null;
      let recipe: any;
      if (this.selectedRecipe) {
        recipe = event.filteredValue?.find((item: any) => item.id == this.selectedRecipe.id)
      }
      if (!recipe) {
        recipe = event.filteredValue?.find((item: any) => item.id == event.filteredValue[0].id)
      }
      setTimeout(() => {
        this.selectedRecipe = { ...recipe }
        this.onRowSelect();
      });
    }
    else {
      this.recipeId = 0;
      this.unSelectedId = 0;
      this.contextSelectedRecipeId = 0;
      this.selectedRecipe = null;
      this.selectOption.emit(this.selectedRecipe);
    }
  }

  showRecipeDialog(action: any) {
    if (action == 'Add') {
      this.dlgRecipe = true;
      this.isEdit = false;
      this.recipeDialogData = {
        id: 0,
        name: '',
        description: '',
        // inputProductId: null,
        outputProductId: 0,
        diameter: 0,
        steelGradeId: null,
        fmspeed: 0,
        finalStandSpeed: 0,
        finalSpeed: 0,
        rollingTime: 0,
        gapTime: 0,
        finalStand: 0,
        productivity: 0,
        furnaceTemp: 0,
        billetLength: 0,
        isActive: false,
        isDefault: false,
      };
    }

    else if (action == "Edit") {
      this.dlgRecipe = true;
      this.isEdit = true;
      this.recipeDialogData = { ...this.selectedRecipe }
    }
  }

  onchangeRecipeRadio() {
    this.getRecipeList();
  }

  onChangeProductSelection() {
    const product = this.outputProductsList.find((item: any) => item.id == this.recipeDialogData.outputProductId);
    if (product) {
      this.recipeDialogData.diameter = product?.diameter ?? 0;
    }
  }

  getRecipeList() {
    this.loading = true;
    this.isRequest = true;
    this.recipeService.getRecipeList(0).subscribe((res: any) => {
      res.map((result: any) => {
        const outputProduct = this.outputProductsList.find((item: any) => item.id === result.outputProductId);
        if (outputProduct) {
          result.outputProductName = outputProduct.code;
        }
        // const inputProduct = this.inputProductsList.find((item: any) => item.id === result.inputProductId);
        // if (inputProduct) {
        //   result.inputProductName = inputProduct.code;
        // }
        if (!result.updateDate) {
          result.updateDate = result.createDate;
        }
        const grade = this.steelGradeList.find((item: any) => item.id === result.steelGradeId);
        if (grade) {
          result.gradeName = grade.name;
        }
      })
      this.recipeList = res;
      this.loading = false;
      this.isRequest = false;
    })
  }

  saveRecipe() {
    this.submitted = true;
    if (this.validateForm()) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to save?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.dlgProgress = true;
          this.socketService.setisCurrentPc(true);
          this.recipeService.saveRecipe(this.recipeDialogData).subscribe({
            next: () => {
              this.messages.add({ severity: 'success', summary: 'Successfully Saved' });
              this.dlgProgress = false;
              this.hideDialog();
              this.getRecipeList();
            },
            error: err => {
              console.log(err);
              this.dlgProgress = false;
              this.socketService.setisCurrentPc(false);
              this.messages.add({ severity: 'error', summary: 'Error' });
            }
          });
        },
      });
    }
  }

  updateRecipe() {
    this.submitted = true;
    if (this.validateForm()) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to update?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.dlgProgress = true;
          this.socketService.setisCurrentPc(true);
          this.recipeService.updateRecipe(this.recipeDialogData).subscribe({
            next: () => {
              this.messages.add({ severity: 'success', summary: 'Successfully Updated' });
              this.dlgProgress = false;
              //    this.selectedRecipe = null;
              this.hideDialog();
              this.getRecipeList();
            },
            error: err => {
              console.log(err);
              this.dlgProgress = false;
              this.socketService.setisCurrentPc(false);
              this.messages.add({ severity: 'error', summary: 'Error' });
            }
          });
        },
      });
    }
  }

  deleteRecipe() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dlgProgress = true;
        this.socketService.setisCurrentPc(true);
        this.recipeService.deleteRecipe(this.selectedRecipe.id).subscribe({
          next: () => {
            this.messages.add({ severity: 'success', summary: 'Successfully Deleted' });
            this.dlgProgress = false;
            this.selectedRecipe = null;
            this.unSelectedId = 0;
            this.recipeTable.clear();
            this.hideDialog();
            this.getRecipeList();
          },
          error: err => {
            console.log(err);
            this.dlgProgress = false;
            this.socketService.setisCurrentPc(false);
            this.messages.add({ severity: 'error', summary: 'Error' });
          }
        });
      },
    });
  }

  // Recipe Report
  // viewRecipeReport() {
  //   this.loaderCount = 0;
  //   this.loadReport = true;
  //   this.showLoading = true;
  //   this.showReportDialog = true;
  //   let urlfilter = this.recipeReportUrl + '?recipeId=' + this.recipeId;
  //   this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlfilter);
  // }

  onLoad() {
    this.loaderCount++
    if (this.loaderCount > 1) this.showLoading = false;
  }
  // END Recipe Report

  //SAVE AS
  openSaveAs() {
    this.saveAsdlg = true;
    this.saveAsData = {
      id: this.selectedRecipe.id,
      name: this.selectedRecipe.name,
      newName: '',
      description: this.selectedRecipe.description
    };
  }

  saveAsRecipe(saveAsData: any) {
    this.submitted = true;
    if (saveAsData.newName) {
      if (this.checkRecipeExist(saveAsData.newName)) {
        this.confirmationService.confirm({
          message: 'Are you sure you want to save?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.dlgProgress = true;
            this.socketService.setisCurrentPc(true);
            this.recipeService.saveAsRecipe(saveAsData.id, saveAsData.newName, saveAsData.description, saveAsData.name).subscribe({
              next: () => {
                this.messages.add({ severity: 'success', summary: 'Successfully Saved' });
                this.hideDialog();
                this.getRecipeList();
                this.dlgProgress = false;
              },
              error: err => {
                console.log(err);
                this.dlgProgress = false;
                this.socketService.setisCurrentPc(false);
                this.messages.add({ severity: 'error', summary: 'Error' });
              }
            });
          },
        });
      }
    }
  }

  checkRecipeExist(recipeName: string) {
    const recipeExist = Boolean(this.recipeList.find(recipe => recipe.name === recipeName));
    if (recipeExist) {
      this.isRecipeExist = true;
      this.messages.add({ severity: 'info', summary: 'Recipe Already Exist..!' })
      return false
    }
    return true;
  }

  updateRecipeValues() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.socketService.setisCurrentPc(true);
        this.recipeService.UpdateFromActual(this.selectedRecipe.id, null).subscribe({
          next: () => {
            this.messages.add({ severity: 'success', summary: 'Successfully Updated' });
            this.getRecipeList();
            this.refreshRecipeValues = this.refreshRecipeValues ? 0 : 1;
          },
          error: err => {
            console.log(err);
            this.socketService.setisCurrentPc(false);
            this.messages.add({ severity: 'error', summary: 'Error' });
          }
        });
      },
    });
  }

  setActive() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to set active?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dlgProgress = true;
        this.socketService.setisCurrentPc(true);
        this.recipeService.setActive(this.selectedRecipe.id).subscribe({
          next: () => {
            this.messages.add({ severity: 'success', summary: 'Successfully Saved' });
            this.getRecipeList();
            this.dlgProgress = false;
          },
          error: err => {
            console.log(err);
            this.dlgProgress = false;
            this.socketService.setisCurrentPc(false);
            this.messages.add({ severity: 'error', summary: 'Error' });
          }
        });
      },
    });
  }

  exportFile() {
    if (this.selectedRecipe) {
      this.confirmationService.confirm({
        message: 'Do you want to Export?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.dlgProgress = true;
          this.recipeService.getFiles(this.selectedRecipe.id).subscribe({
            next: (res: any) => {
              this.messages.add({ severity: 'success', summary: 'Successfully Exported' });
              const a = document.createElement('a');
              const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              a.href = url;
              a.download = 'Recipe.xlsx';
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
              this.dlgProgress = false;
              // window.open(url);
            },
            error: err => {
              console.log(err);
              this.dlgProgress = false;
            }
          });
        },
      });
    }
    else {
      this.messages.add({ severity: 'error', summary: 'Validation Error' });
    }
  }

  //#region IMPORT FILE

  showImportDialog() {
    this.isFileImportDialog = true;
  }

  onSelectFile(event: any) {
    this.fileErrorMessage = "";
    this.selectedFile = event.target.files[0];
    if (this.selectedFile?.size > this.uploadFileSize) { //1mb
      this.fileErrorMessage = "file size cannot exceed 1mb";
      this.selectedFile = null;
      this.fileImport.nativeElement.value = null;
    }
  }

  uploadFileSubmit() {
    if (this.selectedFile) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to proceed?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.dlgProgress = true;
          this.recipeService.uploadFile(this.recipeId, this.selectedFile).subscribe({
            next: () => {
              this.hideDialog();
              this.getRecipeList();
              this.messages.add({ severity: 'success', summary: 'Successfully Updated' });
            },
            error: (err: any) => {
              console.log(err);
              this.messages.add({ severity: 'error', summary: 'Error' });
              this.dlgProgress = false;
            }
          });
        },
      });
    }
  }

  //#endregion END IMPORT FILE

  // send and rcve apis after rsocket connctions.
  sendRecipeToL1() {
    let query = '';
    for (let i = 0; i < this.selectedPlantDataList?.length; i++) {
      query = query + '&plantDataIds=' + this.selectedPlantDataList[i];
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to send to L1?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dlgProgress = true;
        this.iosocketService.checkConnectionOK();
        this.recipeService.sendToL1(this.selectedRecipe.id, query).subscribe({
          next: () => {
            this.isWaitForSignalR = true;
            setTimeout(() => { //IF no response from signalR
              if (this.isWaitForSignalR) {
                this.dlgProgress = false;
                this.getRecipeList();
              }
            }, RELOAD_TIME["progressTimeOut"]);
            // this.getRecipeList();
          },
          error: err => {
            console.log(err);
            this.dlgProgress = false;
            this.messages.add({ severity: 'error', summary: 'Error' });
          }
        });
      },
    });
  }

  readRecipeFromL1() {    
    let query = '';
    for (let i = 0; i < this.selectedPlantDataList?.length; i++) {
      query = query + '&plantDataIds=' + this.selectedPlantDataList[i];
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to read from L1?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dlgProgress = true;
        this.iosocketService.setisCurrentPc(true);
        this.iosocketService.checkConnectionOK();
        this.recipeService.readFromL1(this.selectedRecipe.id, query).subscribe({
          next: () => {
            this.isWaitForSignalR = true;
            setTimeout(() => { //IF no response from signalR
              if (this.isWaitForSignalR) {
                this.dlgProgress = false;
                this.getRecipeList();
              }
            }, RELOAD_TIME["progressTimeOut"]);
            // this.getRecipeList();
          },
          error: err => {
            console.log(err);
            this.dlgProgress = false;
            this.iosocketService.setisCurrentPc(false);
            this.messages.add({ severity: 'error', summary: 'Error' });
          }
        });
      },
    });
  }

  validateForm() {
    if (!this.recipeDialogData.fmspeed) {
      this.recipeDialogData.fmspeed = 0;
    }
    if (!this.recipeDialogData.name ||
      !this.recipeDialogData.fmspeed ||
      // !this.recipeDialogData.inputProductId ||
      !this.recipeDialogData.outputProductId
    ) {
      return false
    }
    if (this.isEdit) {
      const recipeExist = Boolean(this.recipeList.filter(recipe => recipe.name !== this.selectedRecipe.name).find(recipe => recipe.name === this.recipeDialogData.name));
      if (recipeExist) {
        this.isRecipeExist = true;
        this.messages.add({ severity: 'info', summary: 'Recipe Already Exist..!' })
        return false
      }
    }
    else {
      const recipeExist = Boolean(this.recipeList.find(recipe => recipe.name === this.recipeDialogData.name));
      if (recipeExist) {
        this.isRecipeExist = true;
        this.messages.add({ severity: 'info', summary: 'Recipe Already Exist..!' })
        return false
      }
    }

    return true;
  }

  //  OUTPUT RecipeValue
  selectedPlantDatas(event: any) {
    if (event) {
      this.selectedPlantDataList = event;
    }
  }

  hideDialog() {
    this.recipeDlg = false;
    this.saveAsdlg = false;
    this.dlgRecipe = false;
    this.isEdit = false;
    this.submitted = false
    this.isRecipeExist = false;

    this.selectedCopyRecipe = null;

    this.isFileImportDialog = false;
    this.fileErrorMessage = "";
  }

  copyRecipe() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to copy?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.socketService.setisCurrentPc(true);
        if (!this.copyEquipmentsListData) {
          this.copyEquipmentsListData = '&plantDataIds=null';
        }
        this.recipeService.CopyRecipeData(this.copy_From_recipeId, this.recipeId, this.copyEquipmentsListData).subscribe({
          next: () => {
            this.messages.add({ severity: 'success', summary: 'Successfully Copied' });
            this.recipeDlg = false;
            this.getRecipeList();
            // this.getRecipeList();
          },
          error: err => {
            console.log(err);
            this.socketService.setisCurrentPc(false);
            this.messages.add({ severity: 'error', summary: 'Error' });
          }
        });
      },
    });
  }

  showCopyDlg() {
    this.copyEquipmentsListData = null;
    this.recipeService.getRecipeList(0).subscribe((res: any) => {
      res.map((result: any) => {
        const outputProduct = this.outputProductsList.find((item: any) => item.id === result.outputProductId);
        if (outputProduct) {
          result.outputProductName = outputProduct.sapcode;
        }
        // const inputProduct = this.inputProductsList.find((item: any) => item.id === result.inputProductId);
        // if (inputProduct) {
        //   result.inputProductName = inputProduct.code;
        // }
        const grade = this.steelGradeList.find((item: any) => item.id === result.steelGradeId);
        if (grade) {
          result.gradeName = grade.name;
        }
      })
      this.copyRecipeList = res.filter((item: any) => (item.id !== this.selectedRecipe.id));
      if (this.copyRecipeList?.length > 0) {
        this.selectedCopyRecipe = this.copyRecipeList[0];
        this.copy_From_recipeId = this.selectedCopyRecipe.id;
      }
    });
    // this.mergeRecipeList = this.mergeRecipeList.filter((res: any) => (res.id !== this.selectedRecipe.id) && (res.isActive != true))
    this.recipeDlg = true;
  }

  onRowSelectCopy() {
    this.copy_From_recipeId = this.selectedCopyRecipe.id;
  }

  onRowUnSelectCopy() {
    this.copy_From_recipeId = null;
  }

  mergeEquipList(event: any) {
    this.copyEquipmentsListData = event;
  }
  // onKeydown events, arrow key navigation
  onKeydown(event: any, index: number) {
    this.unSelectedId = 0;
    if (event.key === "ArrowDown") {
      if (index != this.recipeList.length - 1) {
        this.selectedRecipe = this.recipeList[index + 1];
        this.recipeId = this.selectedRecipe.id;
        this.selectOption.emit(this.selectedRecipe);
      }
    }
    if (event.key === "ArrowUp") {
      if (this.selectedRecipe != this.recipeList[0]) {
        this.selectedRecipe = this.recipeList[index - 1];
        this.recipeId = this.selectedRecipe.id;
        this.selectOption.emit(this.selectedRecipe);
      }
    }
  }

  getActiveRecipe(): any {
    return this.recipeList.find(recipe => recipe.isActive === true);
  }

  toggleRecipeGrid() {
    this.isRecipeGridMinimized = !this.isRecipeGridMinimized;
  }
}
