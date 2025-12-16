import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async  () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = await firstValueFrom(auth.isLoggedIn$);

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
