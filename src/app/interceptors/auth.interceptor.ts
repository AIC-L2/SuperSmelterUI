import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { StorageService } from '../services/common/storage.service';

export function AuthInterceptor(
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Add the Authorization header with Bearer token
  const storageService = inject(StorageService);
  const token = storageService.getItem('accessToken');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authRequest = request.clone({ setHeaders: headers });

  return next(authRequest);
}
