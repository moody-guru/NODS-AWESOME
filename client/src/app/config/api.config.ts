import { InjectionToken, isDevMode } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');

export function getApiUrl(): string {
  return isDevMode() ? '/api' : 'https://notes-binaried.onrender.com/api';
}
