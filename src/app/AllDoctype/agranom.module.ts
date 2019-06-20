import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {DemoMaterialModule} from '../demo-material-module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HomeComponent} from '../layouts/home/home.component';
import {FumigatsiyaNazoratiComponent} from '../Documets/fumigatsiya-nazorati/fumigatsiya-nazorati.component';
import {RejaBuyichaNazoratiComponent} from '../Documets/reja-buyicha-nazorati/reja-buyicha-nazorati.component';
import {RejadanTashqariNazoratComponent} from '../Documets/rejadan-tashqari-nazorat/rejadan-tashqari-nazorat.component';
import {YozilganSertifikatlarComponent} from '../Documets/yozilgan-sertifikatlar/yozilgan-sertifikatlar.component';
import {PlanKiritishComponent} from '../Documets/plan-kiritish/plan-kiritish.component';
import {FilterNameSprComponent} from '../filter-name-spr/filter-name-spr.component';
import {FilterDocumentsDateComponent} from '../filter-documents-date/filter-documents-date.component';
import {XulosalarFilterForDocumentsComponent} from "../xulosalar-filter-for-documents/xulosalar-filter-for-documents.component";
import {NgxPrintModule} from 'ngx-print';
import {AgranomRoutes} from './agranom.routing';
import {TokenInterceptor} from "../classes/token.interceptor";
import {FlexLayoutModule} from "@angular/flex-layout";
import {UsersComponent} from "../layouts/users/users.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AgranomRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgxPrintModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  }],
  entryComponents: [
    FilterNameSprComponent,
    FilterDocumentsDateComponent,
    XulosalarFilterForDocumentsComponent
  ],
  declarations: [
    HomeComponent,
    UsersComponent,
    RejaBuyichaNazoratiComponent,
    RejadanTashqariNazoratComponent,
    FumigatsiyaNazoratiComponent,
    YozilganSertifikatlarComponent,
    PlanKiritishComponent,
    FilterNameSprComponent,
    FilterDocumentsDateComponent,
    XulosalarFilterForDocumentsComponent
  ]
})
export class AgranomModule {
}
