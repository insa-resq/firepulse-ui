import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login";
import { DetectionComponent } from "./detection/detection";
import { PlanningComponent } from "./planning/planning";
import { HomepageComponent } from "./homepage/homepage";
import { AccountComponent } from './account/account';
import { authGuard } from './auth-guard';
import { AdministrationComponent } from './administration/administration';

export const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'detection', component: DetectionComponent, canActivate: [authGuard] },
{ path: 'planning', component: PlanningComponent, canActivate: [authGuard] },
{ path: 'login', component: LoginComponent },
{ path: 'homepage', component: HomepageComponent },
{ path: 'account', component: AccountComponent, canActivate: [authGuard] },
{ path: 'administration', component: AdministrationComponent, canActivate: [authGuard] }
];
