import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../service/user.service';

const USER_ROLE_TO_PATH_MAP = {
    ADMIN: '/administration',
    ALERT_MONITOR: '/detection',
    PLANNING_MANAGER: '/planning',
    FIREFIGHTER: '/planning'
} as const;

export const authGuard: CanActivateFn = async (route) => {
    const userService = inject(UserService);
    const router = inject(Router);
    
    try {
        const user = userService.currentUser ?? await firstValueFrom(userService.getCurrentUser());
        
        if (route.routeConfig?.path === 'login') {
            if (user) {
                return new RedirectCommand(
                    router.parseUrl(USER_ROLE_TO_PATH_MAP[user.role]),
                    { replaceUrl: true }
                );
            }
            return true;
        }
        
        if (!user) {
            return new RedirectCommand(
                router.parseUrl('/login'),
                { replaceUrl: true }
            );
        }
        
        if (route.routeConfig?.path === '') {
            return new RedirectCommand(
                router.parseUrl(USER_ROLE_TO_PATH_MAP[user.role]),
                { replaceUrl: true }
            );
        }
        
        return true;
    } catch (error) {
        if (route.routeConfig?.path !== 'login') {
            return new RedirectCommand(
                router.parseUrl('/login'),
                { replaceUrl: true }
            );
        }
        return true;
    }
};
