import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MessageDialogComponent } from '../../../../shared/components/message-dialog/message-dialog.component';
import { AuthService } from '../../services/auth.service';
import { error_routes } from '../../../../errors/routes/error.routing';
import { LoadingService } from '../../../../core/services/modals/loading/loading.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';
import { PasswordChangeRequestDTO } from '../../../../core/models/RequestDTO/PasswordChangeRequestDTO';
@Component({
  selector: 'app-forgotPassword',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  recoveryForm!: FormGroup;
  resetForm!: FormGroup;
  token: string | null = null;
  hidePassword = true;
  hideConfirmPassword = true;

  passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loading: LoadingService,
    private modalDialogService: ModalDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  onSubmit(): void {
    this.loading.show();
    if (this.token) {
      console.log(this.resetForm.value.newPassword)
      console.log(this.resetForm.value.confirmPassword)
      if (
        this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword
      ) {
        this.loading.hide();
        this.modalDialogService.open(
          'error',
          'Error',
          'Las contraseñas no coinciden'
        );
        return;
      }
      const passwordRequest: PasswordChangeRequestDTO = this.resetForm.value;
      this.authService.restorePassword(this.token, passwordRequest).subscribe({
        next: (resp) => {
          this.loading.hide();
        },
        error: (error) => {
          this.loading.hide();
          this.modalDialogService.open(
            'error',
            'Error',
            'Las contraseñas no coinciden'
          );
        },
        complete: () => {
          this.modalDialogService.open(
            'success',
            '¡Contraseña actualizada!',
            'Ahora puedes iniciar sesión con tu nueva contraseña.'
          );
          this.loading.hide();
        },
      });
    } else {
      if (this.recoveryForm.valid) {
        const email = this.recoveryForm.value.email;
        this.authService.generateTokenForgotPassword(email).subscribe({
          next: (resp) => {
            console.log(resp);
            this.loading.hide();
          },
          error: (error) => {
            this.loading.hide();
            this.modalDialogService.open('error', 'Error', error.error.message);
          },
          complete: () => {
            this.loading.hide();
            this.modalDialogService.open(
              'success',
              '¡Solicitud realizada correctamente!',
              'Revisa tu bandeja de entrada para redirigirte a la recuperación de contraseña.'
            );
          },
        });
      }
    }
  }

  goBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.loading.show();
    if (this.token) {
      if (!this.isTokenFormatValid(this.token)) {
        this.loading.hide();
        this.router.navigate(['/error/404']);
      }

      this.authService.validateTokenForgotPassword(this.token).subscribe({
        next: (resp) => {},
        error: (error) => {
          this.loading.hide();
          this.router.navigate(['/error/404']);
        },
        complete: () => {
          this.loading.hide();
        },
      });

      this.resetForm = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(8),
          Validators.maxLength(30), Validators.pattern(this.passwordPattern),]],
        confirmPassword: ['', Validators.required],
      }, { validators: this.passwordsMatchValidator });
    } else {
      this.loading.hide();
      this.recoveryForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      });
    }
  }

  isTokenFormatValid(token: string): boolean {
    // Valida que tenga 3 partes separadas por puntos (estructura JWT)
    return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
  }

  passwordsMatchValidator(form: FormGroup) {
  const pass = form.get('newPassword')?.value;
  const confirm = form.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordsMismatch: true };
}
}
