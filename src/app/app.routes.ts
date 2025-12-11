import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login";
import { DetectionComponent } from "./detection/detection";
import { PlanningComponent } from "./planning/planning";
import { HomepageComponent } from "./homepage/homepage";
import {AccountComponent} from './account/account';

export const routes: Routes = [{ path: '', redirectTo: 'homepage', pathMatch: 'full' },
                                { path: 'detection', component: DetectionComponent},
                                 { path: 'planning', component: PlanningComponent },
                                 { path: 'login', component: LoginComponent },
                                 { path: 'homepage', component: HomepageComponent },
                                { path: 'account', component: AccountComponent }];
