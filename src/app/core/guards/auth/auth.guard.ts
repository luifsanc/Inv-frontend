import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../services/session/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  if (!sessionService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
