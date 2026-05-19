import { Component, Inject, OnInit } from '@angular/core';
import { SessionService } from '../../../../core/services/session/session.service';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserLoginResponseDTO } from '../../../../core/models/ResponseDTO/UserLoginResponseDTO';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  userData: any;
  loading: boolean = true;

  constructor(
    private sessionService: SessionService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit() {
    const userSession = this.sessionService.getUserSession();

    if (userSession) {
      // Mapear los datos de la sesión al formato esperado por la plantilla
      this.userData = this.mapUserSessionToUserData(userSession);
    }

    this.loading = false;
  }

  private extractNameFromEmail(email: string): string {
    if (!email) return 'No disponible';

    // Extraer la parte antes del @
    const emailPrefix = email.split('@')[0];
    // Reemplazar puntos y guiones con espacios y capitalizar
    const nameParts = emailPrefix.split(/[.-]/);
    const formattedName = nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    return formattedName;
  }

  // Método para mapear los datos de sesión al formato de userDetails
  private mapUserSessionToUserData(userSession: UserLoginResponseDTO): any {
    const firstName = this.extractNameFromEmail(userSession.email);
    return {
      id: userSession.id || null,
      username: firstName,
      email: userSession.email || 'No disponible',
      active: true, // Si está logueado está activo
      suspended: false, // Valor por defecto
      lastConnection: new Date(), // Usar fecha actual
      lastModificationDate: new Date(), // Usar fecha actual
      isLoggedIn: true, // Si está logueado
      employee: {
        identificationType: {
          name: 'No definido' // Valor por defecto
        }
      }
    };
  }

  // Método para abrir el diálogo de cambio de contraseña
  openChangePasswordDialog(): void {
    if (!this.userData?.id) {
    console.error('ID de usuario no disponible, no se puede abrir el diálogo');
    return;
  }

    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: 'auto',
      maxWidth: '95vw',
      data: { id: this.userData.id, email: this.userData.email }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        console.log('Contraseña cambiada exitosamente');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
