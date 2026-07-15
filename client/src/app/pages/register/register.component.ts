import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h1 class="auth-title">Create account</h1>
            <p class="auth-subtitle">Start organizing your notes</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="name">Name</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="form-input"
                placeholder="Your name"
                [class.input-error]="name?.invalid && name?.touched"
              />
              <span class="error-text" *ngIf="name?.invalid && name?.touched">
                Name must be at least 2 characters
              </span>
            </div>

            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-input"
                placeholder="you@example.com"
                [class.input-error]="email?.invalid && email?.touched"
              />
              <span class="error-text" *ngIf="email?.invalid && email?.touched">
                Please enter a valid email
              </span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-input"
                placeholder="At least 6 characters"
                [class.input-error]="password?.invalid && password?.touched"
              />
              <span class="error-text" *ngIf="password?.invalid && password?.touched">
                Password must be at least 6 characters
              </span>
            </div>

            <button type="submit" class="btn-submit" [disabled]="registerForm.invalid || loading">
              <span *ngIf="!loading">Create Account</span>
              <span *ngIf="loading" class="spinner"></span>
            </button>
          </form>

          <p class="auth-footer">
            Already have an account?
            <a routerLink="/login" class="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      padding: 24px;
    }
    .auth-container { width: 100%; max-width: 420px; }
    .auth-card {
      background: #fff;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(0, 0, 0, 0.04);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      margin-bottom: 16px;
    }
    .auth-title {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: -0.5px;
    }
    .auth-subtitle { margin: 0; font-size: 15px; color: #6b7280; }
    .auth-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 13px; font-weight: 600; color: #374151; }
    .form-input {
      padding: 12px 16px;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      font-size: 15px;
      color: #1a1a2e;
      background: #f9fafb;
      transition: all 0.2s;
      outline: none;
      font-family: inherit;
    }
    .form-input:focus {
      border-color: #6366f1;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .form-input.input-error { border-color: #ef4444; background: #fef2f2; }
    .form-input.input-error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
    .error-text { font-size: 12px; color: #ef4444; font-weight: 500; }
    .btn-submit {
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2.5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-footer { text-align: center; margin: 24px 0 0; font-size: 14px; color: #6b7280; }
    .auth-link { color: #6366f1; text-decoration: none; font-weight: 600; }
    .auth-link:hover { text-decoration: underline; }
    @media (max-width: 480px) { .auth-card { padding: 28px 24px; } }
  `]
})
export class RegisterComponent {
  registerForm;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.authService.register(this.registerForm.value as { name: string; email: string; password: string }).subscribe({
      next: () => {
        this.toast.show('Account created successfully!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.show(err.error?.message || 'Registration failed', 'error');
      },
    });
  }
}
