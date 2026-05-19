import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PasswordChangeRequestDTO } from '../../../../core/models/RequestDTO/PasswordChangeRequestDTO';
import { finalize } from 'rxjs';
import { MessageResponseDTO } from '../../../../core/models/ResponseDTO/MessageResponseDTO';
import { ResponseDTO } from '../../../../core/models/ResponseDTO/ResponseDTO';
import { MatIconModule } from "@angular/material/icon";
import { UserService } from '../../services/user.service';
import { ModalDialogService } from '../../../../core/services/modals/modalDialog/modalDialog.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private modalDialogService: ModalDialogService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  private isSuccessStatus(status: string | number | undefined): boolean {
    if (!status) return false;
    const statusNumber = Number(status);
    return statusNumber >= 200 && statusNumber < 300;
  }

  isPasswordComplex(password: string): boolean {
    return this.passwordPattern.test(password);
  }

  onChangePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newPassword.length < 8 || this.newPassword.length > 30) {
      this.errorMessage = 'La contraseña debe tener entre 8 y 30 caracteres';
      return;
    }

    if (!this.isPasswordComplex(this.newPassword)) {
      this.errorMessage = 'La contraseña debe tener letras minúsculas y mayúsculas, números y caracteres especiales';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.newPassword === this.currentPassword) {
      this.errorMessage = 'La nueva contraseña no puede ser igual a la actual';
      return;
    }

    const passwordRequest: PasswordChangeRequestDTO = {
      actualPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.loading = true;

    this.userService.changePassword(this.data.id, passwordRequest)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response: ResponseDTO<MessageResponseDTO>) => {
          console.log('Cambio de contraseña response:', response);
          console.log('Status recibido:', response?.meta?.status, 'Tipo:', typeof response?.meta?.status);
          console.log('Es success?:', this.isSuccessStatus(response?.meta?.status));

          const isSuccess = response && response.meta && (
            this.isSuccessStatus(response.meta.status) ||
            response.meta.message?.toLowerCase().includes('correctamente') ||
            response.meta.message?.toLowerCase().includes('exitosamente') ||
            response.meta.message?.toLowerCase().includes('actualizada')
          );

          if (isSuccess) {
            this.dialogRef.close({ success: true });
            this.successMessage = response.meta?.message || 'Tu contraseña se actualizó exitosamente.';
            this.modalDialogService.open(
              'success',
              '¡Contraseña cambiada correctamente!',
              this.successMessage
            );

          } else {
            this.errorMessage = response.meta?.message || 'Error al cambiar la contraseña';
            this.modalDialogService.open(
              'error',
              'Error',
              this.errorMessage
            );
          }
        },
        error: (error) => {
          console.error('Error cambiando contraseña:', error);

          if (error.error?.meta) {
            this.errorMessage = error.error.meta.message || 'Error al cambiar la contraseña';
          } else if (error.status === 400) {
            this.errorMessage = 'Datos inválidos';
          } else if (error.status === 401) {
            this.errorMessage = 'Contraseña actual incorrecta';
          } else if (error.status === 403) {
            this.errorMessage = 'No tiene permisos para realizar esta acción';
          } else {
            this.errorMessage = 'Error de conexión. Intente nuevamente.';
          }

          this.modalDialogService.open(
            'error',
            'Error',
            this.errorMessage
          );
        }
      });
  }

  // Limpiar mensaje de error cuando el usuario empiece a escribir
  clearError(): void {
    this.errorMessage = '';
  }

  isFormValid(): boolean {
    return this.currentPassword.length >= 1 &&
           this.newPassword.length >= 8 &&
           this.newPassword.length <= 30 &&
           this.confirmPassword.length >= 1 &&
           this.newPassword === this.confirmPassword;
  }
}
