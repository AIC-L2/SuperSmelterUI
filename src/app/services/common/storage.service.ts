import { Injectable } from '@angular/core';
// This is the wrapper class fo the storage
@Injectable({ providedIn: 'root' })
export class StorageService {
    constructor() { }

    setItem(key:string,value:string){
        return new Promise((resolve, reject) => {
            localStorage.setItem(key,value);
            resolve(key);
        })
    }

    getItem(key:string){
        return localStorage.getItem(key)
    }

    removeItem(key:string): void {
        localStorage.removeItem(key);
    }
}
