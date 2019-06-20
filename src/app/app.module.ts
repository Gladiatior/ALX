import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FullComponent} from './layouts/full/full.component';
import {DemoMaterialModule} from './demo-material-module';
import {HeaderComponent} from './layouts/header/header.component';
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {LoginComponent} from './layouts/login/login.component';
import {PageNotFoundComponent} from './layouts/page-not-found/page-not-found.component';
import {NgxPrintModule} from 'ngx-print';
import {TokenInterceptor} from "./classes/token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxPrintModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
