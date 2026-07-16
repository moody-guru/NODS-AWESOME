import { InjectionToken, isDevMode } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');

export function getApiUrl(): string {
  return isDevMode() ? '/api' : 'https://nods-awesome.onrender.com/api';
}
