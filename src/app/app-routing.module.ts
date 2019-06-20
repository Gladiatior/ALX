import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./layouts/login/login.component";
import {FullComponent} from "./layouts/full/full.component";
import {AuthGuard} from "./classes/auth.guard";
import {PageNotFoundComponent} from "./layouts/page-not-found/page-not-found.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: FullComponent, canActivate: [AuthGuard]},
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor() {

  }
}
