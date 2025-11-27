import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CurrentUser } from '../../shared/components/current-user/current-user';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CurrentUser,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  get name() {
    return this.form.get('name') as FormControl<string>;
  }

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  getErrorMessageForEmail(): string | null {
    const control = this.email;

    if (control.hasError('required')) {
      return 'Email is required';
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    return null;
  }

  getErrorMessageForName(): string | null {
    const control = this.name;

    if (control.hasError('required')) {
      return 'Name is required';
    }

    return null;
  }

  loading = false;
  successMsg = '';
  errorMsg = '';

  async onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const body = {
        user: {
          name: this.form.value.name,
          email: this.form.value.email,
        },
      };

      const res = await fetch(`https://${environment.subdomain}.zendesk.com/api/v2/users.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${environment.mail}/token:${environment.token}`)}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} ${errText}`);
      }
      const data = await res.json();

      this.successMsg = `User created: ${data?.user?.id ?? 'OK'}`;
      this.form.reset();
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Unknown error';
    } finally {
      this.loading = false;
    }
  }
}
