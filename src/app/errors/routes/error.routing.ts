import { Routes, RouterModule } from '@angular/router';
import { Error404Component } from '../pages/error404/error404.component';

export const error_routes: Routes = [
    {
      path: '404',
      component: Error404Component,
    },
];
