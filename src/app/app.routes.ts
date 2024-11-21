import { Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

export const routes: Routes = [
  {
    path: '', // Default route
    component: UserDashboardComponent,
  },
  {
    path : 'user-profile/:id', // Default route
    component: UserDetailsComponent,
  },
];
