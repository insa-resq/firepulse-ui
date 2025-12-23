import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage';
import { LoginComponent } from "./login/login";
import { DetectionComponent } from "./detection/detection";
import { PlanningComponent } from "./planning/planning";
import { AccountComponent } from './account/account';
import { authGuard } from './auth-guard';
import { AdministrationComponent } from './administration/administration';

export const routes: Routes = [
    { path: '', component: HomepageComponent, canActivate: [authGuard] },
    { path: 'detection', component: DetectionComponent, canActivate: [authGuard] },
    { path: 'planning', component: PlanningComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'account', component: AccountComponent, canActivate: [authGuard] },
    { path: 'administration', component: AdministrationComponent, canActivate: [authGuard] }
];
