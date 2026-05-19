import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../services/session/session.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  if (sessionService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
