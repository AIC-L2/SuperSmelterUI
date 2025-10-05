import { ApiConfigService } from './api-config.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// export interface headerStack {
//     routes: Array<DEAULT_PAGES_ENUM>,
//     isShow: boolean,
//     showRouteLinks: boolean,
//     route: string
// }

@Injectable()
export class HeaderService {

    // shift: Shift | undefined;

    // public headerSettings: headerStack = {
    //     routes: [],
    //     isShow: false,
    //     showRouteLinks: false,
    //     route: ''
    // };
    public headerState = new Subject();
    public headerStateUpdated: any;
    public reloadRequired = new Subject();

    private footerState: boolean = false;
    public footerStates = new Subject();
    public footerStateUpdated = this.footerStates.asObservable();;

    private tabs: any = [];
    private maxTabs: number = 6;
    public tabsState = new Subject();
    public tabsStateUpdated = this.tabsState.asObservable();
    // public activeTabId: SCREENS_ID = 1;

    public connectionOk = new Subject();
    public IsConnectionOk = this.connectionOk.asObservable();

    public l1Status = new Subject();
    public _l1Status = this.l1Status.asObservable();

    public bamiconStatus = new Subject();
    public _bamiconStatus = this.bamiconStatus.asObservable();


    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfigService,
        private router: Router,
    ) {
        this.headerStateUpdated = this.headerState.asObservable();
    }

    getApiUrl() {
        return this.apiConfig.getApiUrl();
    }

    // updateActiveID(id: SCREENS_ID) {
        // this.activeTabId = id;
    // }

    updateTabs(tab: any) {
        if (tab.route) {
            if (this.checkTabAlreadyAvailable(tab)) {
                if (this.tabs.length > this.maxTabs) {
                    this.tabs.shift();
                }
                // this.activeTabId = tab.id;
                this.tabs.push(tab);
                this.tabsState.next(this.tabs);
            }
        }
    }

    removeTab(value: any) {
        this.tabs = this.tabs.filter((tab: any) => {
            return tab.name !== value.name;
        });
        this.tabsState.next(this.tabs);
    }

    clearTabs() {
        this.tabs = [];
        this.tabsState.next(this.tabs);
    }

    checkTabAlreadyAvailable(tab: any) {
        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].name == tab.name) {
                return false;
            }
        }
        return true;
    }

    // updateRoute(route: DEAULT_PAGES_ENUM) {
    //     this.headerSettings.route = route;
    //     this.headerSettings.routes.push(route);
    //     this.headerState.next(this.headerSettings);
    // }

    // setNewRoute(route: DEAULT_PAGES_ENUM) {
    //     this.headerSettings.routes = [route];
    //     this.headerState.next(this.headerSettings);
    // }

    // resetRoutes() {
    //     this.headerSettings.routes = [];
    //     this.headerState.next(this.headerSettings);
    // }

    // popRoute() {
    //     this.headerSettings.routes.pop();
    //     this.headerState.next(this.headerSettings);
    // }

    getHeaderData() {
        return this.http.get(this.getApiUrl() + 'header/HeaderDetails');
    }

    // getIndicators() {
    //     return this.http.get<Indicator>(this.getApiUrl() + 'header/status');
    // }

    // getalertCount() {
    //     return this.http.get<number>(this.getApiUrl() + 'header/AlertCount');
    // }

    // getHeaderShiftInfo() {
    //     return this.http.get<Shift>(this.getApiUrl() + 'header/shift');
    // }

    // updateFooterState(isOpen: boolean) {
    //     this.footerState = isOpen;
    //     this.footerStates.next(this.footerState);
    // }

    // updateReloadRequired(required: boolean) {
    //     this.reloadRequired.next(required);
    // }

    // changePassword(user: any) {
    //     let url: string = this.getApiUrl() + 'users/changePassword' + '?id=' + user.usrId + '&currentPassword=' + encodeURIComponent(user.currentPassword) + '&password=' + encodeURIComponent(user.confirmPassword)
    //     return this.http.put(url, '');
    // }

    updateConnectionStatus(isConnected: boolean) {
        this.connectionOk.next(isConnected);
    }

    // logout(mode: boolean) {
    //     let url = !mode ? ROUTENAMES.LOGIN : ROUTENAMES.LOGIN_MODE;
    //     localStorage.clear();
    //     this.clearTabs();
    //     this.updateRoute(DEAULT_PAGES_ENUM.LOGIN);
    //     this.router.navigateByUrl('/' + url);
    // }

    updatel1Status(status: number) {      
        this.l1Status.next(status);
    }

    updateBamiconStatus(status: number) {
        this.bamiconStatus.next(status);
    }
}
