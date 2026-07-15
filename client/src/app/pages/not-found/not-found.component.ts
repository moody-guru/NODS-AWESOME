import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="not-found">
      <div class="not-found-content">
        <div class="not-found-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 class="not-found-title">404</h1>
        <p class="not-found-text">Page not found</p>
        <a routerLink="/dashboard" class="btn-home">Back to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      padding: 24px;
    }
    .not-found-content { text-align: center; }
    .not-found-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.08);
      color: #6366f1;
      margin-bottom: 16px;
    }
    .not-found-title {
      margin: 0 0 8px;
      font-size: 72px;
      font-weight: 800;
      color: #1a1a2e;
      letter-spacing: -2px;
      line-height: 1;
    }
    .not-found-text {
      margin: 0 0 32px;
      font-size: 18px;
      color: #6b7280;
    }
    .btn-home {
      display: inline-flex;
      padding: 12px 28px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-home:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }
  `]
})
export class NotFoundComponent {}
