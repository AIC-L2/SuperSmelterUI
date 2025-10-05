import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from "@microsoft/signalr"
import { formatDate } from '@angular/common';
// import { ApiConfigService } from '@services/common/api-config.service';
@Injectable({
  providedIn: 'root'
})
export class RSocketService {

  private hubConnection!: signalR.HubConnection;
  private signalrUrl = environment.socketUrl;

  public updateStart = new Subject();
  public isAppUpdation = this.updateStart.asObservable();

  public delayStart = new Subject();
  public isDelayStarted = this.delayStart.asObservable();

  public readComplete = new Subject();
  public isReadComplete = this.readComplete.asObservable();

  public writeComplete = new Subject();
  public isWriteComplete = this.writeComplete.asObservable();

  public appDataModify = new Subject();
  public isAppDataModify = this.appDataModify.asObservable();

  public WoChangeStart = new Subject();
  public isWoChange = this.WoChangeStart.asObservable();


  isCurrentPc: boolean = false;

  constructor(
    // private apiConfig: ApiConfigService
  ) { }

  // getApiUrl() {
  //   return this.apiConfig.getApiUrl();
  // }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.signalrUrl, { //Configuration
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err: any) => console.log('Error while starting connection: ' + err))
  }

  public addTransferListener = () => {
    this.hubConnection.on('readcomplete', () => {
      console.log('readcomplete > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss:sss a', 'en'));
      this.updateReadComplete(true)
      //Prgress bar close and show the data as message
    });
    this.hubConnection.on('writecomplete', () => {
      console.log('writecomplete > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss:sss a', 'en'));
      this.updateWriteComplete(true);
      //Prgress bar close and show the data as message
    });
    this.hubConnection.on('delaystart', (data: any) => {
      console.log('delaystart > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss:sss a', 'en'), data);
      this.updateDelayStart(data);
      //Open delay dialog window to enter the delay reason and details
    });
    this.hubConnection.on('delayclose', () => {
      console.log('delayclose > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss:sss a', 'en'));
      this.updateDelayStart(null);
    });

    this.hubConnection.on('appUpdateStart', () => {
      console.log('appUpdateStart > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en'));
      this.updateAppUpdation(true);
    });

    this.hubConnection.on('appUpdateFinish', () => {
      console.log('appUpdateFinish > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en'));
      this.updateAppUpdation(false);
    });

    this.hubConnection.on('signalRAppDataModified', () => {
      console.log('AppDataModified > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en'));
      this.updateAppDataModification(true);
    });

    this.hubConnection.on('workOrderChange', (data: any) => {
      console.log('WorkOrderChange > ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en'), data);
      this.updateWoChange(data);
    });
  }

  checkConnectionOK() {
    if (this.hubConnection?.state != signalR.HubConnectionState.Connected) {
      this.startConnection();
      this.addTransferListener();
    }
  }

  updateAppUpdation(status: boolean) {
    this.updateStart.next(status);
  }

  updateReadComplete(status: boolean) {
    this.readComplete.next(status);
  }

  updateWriteComplete(status: boolean) {
    this.writeComplete.next(status);
  }

  updateDelayStart(data: any) {
    this.delayStart.next(data);
  }

  updateAppDataModification(status: boolean) {
    this.appDataModify.next(status);
  }

  setisCurrentPc(status: boolean) {
    this.isCurrentPc = status;
  }

  updateWoChange(data: any) {
    this.WoChangeStart.next(data);
  }

  getisCurrentPc() {
    return this.isCurrentPc;
  }
}
