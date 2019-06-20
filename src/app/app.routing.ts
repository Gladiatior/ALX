import {Routes} from '@angular/router';
import {FullComponent} from './layouts/full/full.component';
import {LoginComponent} from './layouts/login/login.component';
import {PageNotFoundComponent} from './layouts/page-not-found/page-not-found.component';
import {AuthGuard} from "./classes/auth.guard";
const rout = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren:
          './AllDoctype/allcomponent.module#AllComponentsModule'
      }]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];



export const AppRoutes: Routes = rout;

