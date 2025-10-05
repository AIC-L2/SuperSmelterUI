import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private connectionState$ = new BehaviorSubject<boolean>(false);
  private socketUrl = environment.socketUrl

  // 🔥 Subjects for server events
  private recipeReadComplete$ = new Subject<any>();
  private recipeSendComplete$ = new Subject<any>();

  isCurrentPc: boolean = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = io(this.socketUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connectionState$.next(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      this.connectionState$.next(false);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err?.message);
    });

    // 🔥 map incoming events to subjects
    this.socket.on('RecipeReadcomplete', (data) => {
      this.recipeReadComplete$.next(data);
    });

    this.socket.on('RecipeSendcomplete', (data) => {
      this.recipeSendComplete$.next(data);
    });
  }

  // ✅ Expose as observables (read-only)
  get onConnectionState(): Observable<boolean> {
    return this.connectionState$.asObservable();
  }

  get isReadComplete(): Observable<any> {
    return this.recipeReadComplete$.asObservable();
  }

  get isWriteComplete(): Observable<any> {
    return this.recipeSendComplete$.asObservable();
  }

  checkConnectionOK(): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected. Reconnecting...');
      this.connect();
    }
  }

  setisCurrentPc(status: boolean) {
    this.isCurrentPc = status;
  }
}
