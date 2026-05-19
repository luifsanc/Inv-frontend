import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { SessionService } from '../../../core/services/session/session.service';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Router } from '@angular/router';
import { ProfileComponent } from '../../../features/users/pages/profile/profile.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../../core/services/modals/loading/loading.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  userName = 'Adrián'; // o recuperarlo de tu servicio auth
  userPhotoUrl = ''; // url de la foto de perfil, o cadena vacía si no hay

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private route:Router,
    private loading: LoadingService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userName = this.sessionService.getUserNames();
  }

  goToProfile() {
    this.dialog.open(ProfileComponent, {
      width: '900px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'profile-modal'
    });
  }

  logout() {
    this.loading.show();

    this.authService.logout().subscribe({
      next: (resp)=>{},
      error: (error)=>{
        this.loading.hide();
        console.error(error)},
      complete: ()=>{
        setTimeout(() => {
          this.sessionService.endSession();
          this.route.navigate(['']);
          this.loading.hide();
        }, 800) ;
      },
    });
  }
}
