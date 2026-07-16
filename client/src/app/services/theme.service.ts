import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private isDarkSubject = new BehaviorSubject<boolean>(true);
  isDark$ = this.isDarkSubject.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true;
    this.setTheme(isDark);
  }

  toggle(): void {
    this.setTheme(!this.isDarkSubject.value);
  }

  private setTheme(isDark: boolean): void {
    this.isDarkSubject.next(isDark);
    this.renderer.setAttribute(document.documentElement, 'data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
