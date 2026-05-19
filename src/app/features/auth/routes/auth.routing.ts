import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from '../pages/auth/auth.component';
import { LoginComponent } from '../components/login/login.component';
import { ForgotPasswordComponent } from '../components/forgotPassword/forgotPassword.component';

export const auth_routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
];
