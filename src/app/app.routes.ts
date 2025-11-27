import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';

export const HOME_SLUG = 'home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: HOME_SLUG,
    pathMatch: 'full',
  },
  {
    path: HOME_SLUG,
    component: HomePage,
  },
];
