import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderService } from './services/common/header.service';
import { MessageService } from 'primeng/api';
import { RSocketService } from './services/common/rsocket.service';
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { Indicator_Enum } from './enums/indicators.enum';
import { ReloadService } from './services/common/reload.service';
import { ToastModule } from 'primeng/toast';
import { LoginService } from './services/common/login.service';
import { StorageService } from './services/common/storage.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, CommonModule, TooltipModule, ButtonModule, ToastModule],
    providers: [HeaderService, MessageService, RSocketService, ReloadService, StorageService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'ReportLoader';
  currentRoute: string = '';
  headerIndicator: any[] = [];
  isRequest: boolean = false;
  lineStatusEnum = Indicator_Enum;
  showConnectionAlert: boolean = false;
  loginData: any;

  constructor(
    private router: Router, 
    private headerService: HeaderService,
    private messageService: MessageService,
    private socketService: RSocketService,
    private reloadService: ReloadService,
    private loginService: LoginService,
    private storageService: StorageService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  ngOnInit(): void {
    this.login();
    setInterval(() => {
      this.getHeaderData();
    }, 3000);
  }

  refreshPage(): void {
    // Trigger reload using the reload service
    this.reloadService.triggerReload();
  }

  login() {
    this.loginService.login().subscribe((res: any) => {
    this.loginData = res;
    this.storageService.setItem('accessToken', this.loginData.bearerToken);
    });
   }

  getPageTitle(): string {
    if (this.currentRoute === '/recipe' || this.currentRoute === '/') {
      return 'Recipes';
    } else if (this.currentRoute === '/reports' ) {
      return 'Report Generator';
    } else if (this.currentRoute === '/home') {
      return 'Production Dashboard';
    } else if (this.currentRoute === '/recipeNew') {
      return 'Recipes New';
    } else {
      return this.title;
    }
  }

  getHeaderData() {
    this.isRequest = true;
    this.headerService.getHeaderData().subscribe({
      next: (res: any) => {
        this.headerService.updateConnectionStatus(true);
        if (res && res.status) {
          this.headerIndicator = [];
         
          let level1_List: any[] = res.status.filter((item: any) => String(item.name).startsWith('PLC_'));
          let level2_List: any[] = res.status.filter((item: any) => item.name == 'Level2');
          // let historian_List: any[] = res.status.filter((item: any) => String(item.name).startsWith('Historian_'));
          // let others_List: any[] = res.status.filter(function (itm: any) { return level1_List.indexOf(itm) == -1 && historian_List.indexOf(itm) == -1 && level2_List.indexOf(itm) == -1; });
         
          let l1_Status = this.lineStatusEnum.Error;
          // console.log(level1_List);
         
          if (level1_List.length > 0) {
            l1_Status = this.check_Indicator_ComStatus(level1_List);
            this.headerService.updatel1Status(l1_Status);
            this.headerIndicator.push({
              name: 'level1',
              description: this.create_Indicator_Tooltip(level1_List),
              appServer: "",
              status: false,
              comStatus: l1_Status
            })
          }
          else {
            this.headerService.updatel1Status(l1_Status);
          }
 
          if (level2_List.length > 0) {
            this.headerIndicator.push({
              name: 'level2',
              description: this.create_Indicator_Tooltip(level2_List),
              appServer: "",
              status: false,
              comStatus: this.check_Indicator_ComStatus(level2_List)
            })
          }
 
          // if (historian_List.length > 0) {
          //   this.headerIndicator.push({
          //     name: 'Historian',
          //     description: this.create_Indicator_Tooltip(historian_List),
          //     appServer: "",
          //     status: false,
          //     comStatus: this.check_Indicator_ComStatus(historian_List)
          //   })
          // }
 
          // if (others_List.length > 0) {
          //   this.headerIndicator.push({
          //     name: 'External',
          //     description: this.create_Indicator_Tooltip(others_List),
          //     appServer: "",
          //     status: false,
          //     comStatus: this.check_Indicator_ComStatus(others_List)
          //   })
          // }
        }
        //this.shiftInfo = res.shift ?? res.shift;
        //this.alertCount = res.alertCount ?? res.alertCount;
        // if (this.showConnectionAlert) {
        //   this.showConnectionAlert = false;
        //   this.messageService.clear();
        //   this.socketService.checkConnectionOK(); //SignalR Reconnect
        // }
        this.isRequest = false;
      },
      error: (err: any) => {
        if (err.status == 0) {
          // if (!this.showConnectionAlert) { //MESSAGE ONLY ONE TIME
          //   this.showConnectionAlert = true;
          //   // this.translate.get('global.connectionError').subscribe((res: string) => {
          //     this.messageService.add({ id: 'msgconnectionLost', severity: 'error', summary: 'Error Connection', icon: '', sticky: true, closable: false })
          //   // });
          // }
          this.headerService.updateConnectionStatus(false);
        }
        else if (err?.status == 401) { //unAuthorised
          let mode = false;
          // this.headerService.logout(mode);
        }
        this.isRequest = false;
      }
    });
  }
 
  check_Indicator_ComStatus(list: any[]) {
    if (list.find((sts: any) => sts.comStatus == this.lineStatusEnum['Service Error'])) {
      return this.lineStatusEnum['Service Error'];
    }
    else if (list.find((sts: any) => sts.comStatus == this.lineStatusEnum['L1 Com. Failure'])) {
      return this.lineStatusEnum['L1 Com. Failure'];
    }
    else if (list.find((sts: any) => sts.comStatus == this.lineStatusEnum['Line Stop'])) {
      return this.lineStatusEnum['Line Stop'];
    }
    else if (list.find((sts: any) => sts.comStatus == this.lineStatusEnum.Error)) {
      return this.lineStatusEnum.Error;
    }
    else {
      return this.lineStatusEnum.Running;
    }
  }
 
  create_Indicator_Tooltip(list: any[]) {
    let description: string = "";
    list.forEach((item: any) => {
      description += item.name + " - <span class='text-sm'>" + this.lineStatusEnum[item.comStatus] + '</span> </br>'
    });
    return description;
  }
}
