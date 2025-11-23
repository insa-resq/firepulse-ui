import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login";
import {DetectionComponent} from "./detection/detection";

export const routes: Routes = [{ path: 'detection', component: DetectionComponent},
                                 { path: 'planning', component: PlanningComponent },
                                 { path: 'login', component: LoginComponent },
                                 { path: 'dashboard', component: DashboardComponent },

                                 { path: '', redirectTo: '/detection', pathMatch: 'full' },
                                 { path: '**', redirectTo: '/detection' }];
