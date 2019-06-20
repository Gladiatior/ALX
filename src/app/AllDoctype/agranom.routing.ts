import {Routes} from '@angular/router';
import {HomeComponent} from '../layouts/home/home.component';
import {FumigatsiyaNazoratiComponent} from '../Documets/fumigatsiya-nazorati/fumigatsiya-nazorati.component';
import {RejaBuyichaNazoratiComponent} from '../Documets/reja-buyicha-nazorati/reja-buyicha-nazorati.component';
import {RejadanTashqariNazoratComponent} from '../Documets/rejadan-tashqari-nazorat/rejadan-tashqari-nazorat.component';
import {YozilganSertifikatlarComponent} from '../Documets/yozilgan-sertifikatlar/yozilgan-sertifikatlar.component';
import {PlanKiritishComponent} from '../Documets/plan-kiritish/plan-kiritish.component';
import {UsersComponent} from "../layouts/users/users.component";

export const AgranomRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'user', component: UsersComponent},
  {path: 'fumigatsiyaNazorati', component: FumigatsiyaNazoratiComponent},
  {path: 'rejaBuyichaNazorat', component: RejaBuyichaNazoratiComponent},
  {path: 'rejadanTashqariNazorat', component: RejadanTashqariNazoratComponent},
  {path: 'yozilganSertifikatlar', component: YozilganSertifikatlarComponent},
  {path: 'planKiritish', component: PlanKiritishComponent},
];
