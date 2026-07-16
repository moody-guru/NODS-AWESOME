import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="user">
      <div class="navbar-inner">
        <div class="navbar-left">
          <a routerLink="/dashboard" class="navbar-brand">
            <span class="brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </span>
            <span class="brand-text">Notes</span>
          </a>
        </div>

        <div class="navbar-center">
          <div class="search-box">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" class="search-input" placeholder="Search notes..." />
          </div>
        </div>

        <div class="navbar-right">
          <button class="btn-icon" (click)="themeService.toggle()" [attr.title]="(themeService.isDark$ | async) ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg *ngIf="themeService.isDark$ | async" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg *ngIf="!(themeService.isDark$ | async)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <div class="user-profile">
            <div class="avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
            <span class="user-name">{{ user.name }}</span>
          </div>
          <button class="btn-icon btn-logout" (click)="logout()" title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 10, 15, 0.8);
      backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid var(--border);
    }
    [data-theme="light"] .navbar {
      background: rgba(255, 255, 255, 0.8);
    }
    .navbar-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
    .navbar-left {
      flex-shrink: 0;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--text);
      font-weight: 700;
      font-size: 18px;
      letter-spacing: -0.3px;
      transition: opacity var(--transition);
    }
    .navbar-brand:hover { opacity: 0.8; }
    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: #fff;
    }
    .navbar-center {
      flex: 1;
      max-width: 480px;
    }
    .search-box {
      position: relative;
      width: 100%;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 10px 16px 10px 42px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 14px;
      color: var(--text);
      background: var(--bg-secondary);
      transition: all var(--transition);
      outline: none;
      box-sizing: border-box;
    }
    .search-input:focus {
      border-color: var(--primary);
      background: var(--surface);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
    }
    .search-input::placeholder {
      color: var(--text-muted);
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);
    }
    .btn-icon:hover {
      background: var(--surface-hover);
      color: var(--text);
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 8px;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
    }
    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text);
    }
    .btn-logout:hover {
      background: rgba(248, 113, 113, 0.1);
      color: var(--error);
    }
    @media (max-width: 768px) {
      .navbar-center { display: none; }
      .user-name { display: none; }
      .navbar-inner { padding: 0 16px; height: 56px; }
    }
  `]
})
export class NavbarComponent {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    public themeService: ThemeService
  ) {
    this.authService.currentUser$.subscribe((u) => (this.user = u));
  }

  logout(): void {
    this.authService.logout();
  }
}
