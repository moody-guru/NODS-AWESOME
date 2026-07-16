import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h1 class="auth-title">Welcome back</h1>
            <p class="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-input"
                placeholder="you@example.com"
                [class.input-error]="email?.invalid && email?.touched"
                autocomplete="email"
              />
              <span class="error-text" *ngIf="email?.invalid && email?.touched">Please enter a valid email</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-input"
                placeholder="Enter your password"
                [class.input-error]="password?.invalid && password?.touched"
                autocomplete="current-password"
              />
              <span class="error-text" *ngIf="password?.invalid && password?.touched">Password is required</span>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loginForm.invalid || loading">
              <span *ngIf="!loading">Sign In</span>
              <span *ngIf="loading" class="spinner"></span>
            </button>
          </form>

          <p class="auth-footer">
            Don't have an account?
            <a routerLink="/register" class="auth-link">Create one</a>
          </p>
        </div>
      </div>

      <div class="auth-hero">
        <div class="hero-content">
          <div class="hero-badge">Productivity Suite</div>
          <h2 class="hero-title">Organize your<br/>thoughts with ease</h2>
          <p class="hero-desc">A modern workspace for your notes, ideas, and everything in between.</p>
          <div class="hero-features">
            <div class="hero-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Fast and lightweight</span>
            </div>
            <div class="hero-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Secure & encrypted</span>
            </div>
            <div class="hero-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Access anywhere</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      animation: fadeIn 0.5s ease;
    }
    .auth-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 44px 36px;
      animation: slideUp 0.6s var(--transition);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: #fff;
      margin-bottom: 20px;
      box-shadow: var(--glow);
    }
    .auth-title {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.5px;
    }
    .auth-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .form-input {
      padding: 12px 16px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 15px;
      color: var(--text);
      background: var(--bg-secondary);
      transition: all var(--transition);
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: var(--primary);
      background: var(--surface);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .form-input.input-error {
      border-color: var(--error);
      background: rgba(248, 113, 113, 0.05);
    }
    .error-text {
      font-size: 12px;
      color: var(--error);
      font-weight: 500;
    }
    .btn-submit {
      padding: 14px;
      border: none;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
    }
    .btn-submit:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2.5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    .auth-footer {
      text-align: center;
      margin: 24px 0 0;
      font-size: 14px;
      color: var(--text-muted);
    }
    .auth-link {
      color: var(--primary);
      font-weight: 600;
      transition: color var(--transition);
    }
    .auth-link:hover {
      color: var(--primary-light);
    }

    .auth-hero {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(139, 92, 246, 0.05));
      position: relative;
      overflow: hidden;
    }
    .auth-hero::before {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent);
      top: -100px;
      right: -100px;
    }
    .auth-hero::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent);
      bottom: -50px;
      left: -50px;
    }
    .hero-content {
      max-width: 400px;
      animation: slideUp 0.6s var(--transition) 0.1s backwards;
    }
    .hero-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary);
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.15);
      margin-bottom: 20px;
    }
    .hero-title {
      font-size: 36px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.2;
      letter-spacing: -1px;
      margin: 0 0 16px;
    }
    .hero-desc {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 0 28px;
    }
    .hero-features {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hero-feature {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .hero-feature svg {
      color: var(--success);
      flex-shrink: 0;
    }

    @media (max-width: 900px) {
      .auth-page { flex-direction: column-reverse; }
      .auth-hero { padding: 48px 32px; }
      .hero-title { font-size: 28px; }
      .auth-hero::before, .auth-hero::after { display: none; }
    }
    @media (max-width: 480px) {
      .auth-card { padding: 32px 24px; border-radius: var(--radius-lg); }
      .auth-container { padding: 16px; }
      .auth-hero { padding: 32px 24px; }
    }
  `]
})
export class LoginComponent {
  loginForm;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.authService.login(this.loginForm.value as { email: string; password: string }).subscribe({
      next: () => {
        this.toast.show('Welcome back!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.show(err.error?.message || 'Login failed', 'error');
      },
    });
  }
}
