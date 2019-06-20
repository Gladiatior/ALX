import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AllComponentRoutes} from './allcomponent.routing';
import {DemoMaterialModule} from '../demo-material-module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BankComponent} from '../Spravochnik/bank/bank.component';
import {TashkilotComponent} from '../Spravochnik/tashkilot/tashkilot.component';
import {HomeComponent} from '../layouts/home/home.component';
import {UsersComponent} from '../layouts/users/users.component';
import {BegonaUtlarTuriComponent} from '../Spravochnik/begona-utlar-turi/begona-utlar-turi.component';
import {BlankalarComponent} from '../Spravochnik/blankalar/blankalar.component';
import {BulimlarComponent} from '../Spravochnik/bulimlar/bulimlar.component';
import {BulinmalarComponent} from '../Spravochnik/bulinmalar/bulinmalar.component';
import {DavlatlarComponent} from '../Spravochnik/davlatlar/davlatlar.component';
import {FaoliyatTuriComponent} from '../Spravochnik/faoliyat-turi/faoliyat-turi.component';
import {FermerXujaligiComponent} from '../Spravochnik/fermer-xujaligi/fermer-xujaligi.component';
import {FumigatsiyaTuriComponent} from '../Spravochnik/fumigatsiya-turi/fumigatsiya-turi.component';
import {KasalliklarTuriComponent} from '../Spravochnik/kasalliklar-turi/kasalliklar-turi.component';
import {KurashUsullariComponent} from '../Spravochnik/kurash-usullari/kurash-usullari.component';
import {LavozimlarComponent} from '../Spravochnik/lavozimlar/lavozimlar.component';
import {MassivlarComponent} from '../Spravochnik/massivlar/massivlar.component';
import {MaxsulotlarComponent} from '../Spravochnik/maxsulotlar/maxsulotlar.component';
import {MfyComponent} from '../Spravochnik/mfy/mfy.component';
import {OmborComponent} from '../Spravochnik/ombor/ombor.component';
import {PreparatlarComponent} from '../Spravochnik/preparatlar/preparatlar.component';
import {QadoqlarComponent} from '../Spravochnik/qadoqlar/qadoqlar.component';
import {QFYComponent} from '../Spravochnik/qfy/qfy.component';
import {QushimchaDekloratsiyaComponent} from '../Spravochnik/qushimcha-dekloratsiya/qushimcha-dekloratsiya.component';
import {TumanlarComponent} from '../Spravochnik/tumanlar/tumanlar.component';
import {UlchovBirligiComponent} from '../Spravochnik/ulchov-birligi/ulchov-birligi.component';
import {ViloyatlarComponent} from '../Spravochnik/viloyatlar/viloyatlar.component';
import {XodimlarComponent} from '../Spravochnik/xodimlar/xodimlar.component';
import {YetkazibBeruvchilarComponent} from '../Spravochnik/yetkazib-beruvchilar/yetkazib-beruvchilar.component';
import {ZararkunandalarTuriComponent} from '../Spravochnik/zararkunandalar-turi/zararkunandalar-turi.component';
import {BlankaKirimiComponent} from '../Documets/blanka-kirimi/blanka-kirimi.component';
import {BlankaChiqimiComponent} from '../Documets/blanka-chiqimi/blanka-chiqimi.component';
import {EkspertizaComponent} from '../Documets/ekspertiza/ekspertiza.component';
import {EksportComponent} from '../Documets/eksport/eksport.component';
import {FumigatsiyaComponent} from '../Documets/fumigatsiya/fumigatsiya.component';
import {FumigatsiyaNazoratiComponent} from '../Documets/fumigatsiya-nazorati/fumigatsiya-nazorati.component';
import {KarantinRuxsatnomasiComponent} from '../Documets/karantin-ruxsatnomasi/karantin-ruxsatnomasi.component';
import {KurikComponent} from '../Documets/kurik/kurik.component';
import {LabaratoriyaComponent} from '../Documets/labaratoriya/labaratoriya.component';
import {PreparatChiqimiComponent} from '../Documets/preparat-chiqimi/preparat-chiqimi.component';
import {PreparatKirimiComponent} from '../Documets/preparat-kirimi/preparat-kirimi.component';
import {RejaBuyichaNazoratiComponent} from '../Documets/reja-buyicha-nazorati/reja-buyicha-nazorati.component';
import {RejadanTashqariNazoratComponent} from '../Documets/rejadan-tashqari-nazorat/rejadan-tashqari-nazorat.component';
import {TranzitYukKurigiComponent} from '../Documets/tranzit-yuk-kurigi/tranzit-yuk-kurigi.component';
import {YozilganSertifikatlarComponent} from '../Documets/yozilgan-sertifikatlar/yozilgan-sertifikatlar.component';
import {PlanKiritishComponent} from '../Documets/plan-kiritish/plan-kiritish.component';
import {BegonaUtlarComponent} from '../Spravochnik/begona-utlar/begona-utlar.component';
import {KasalliklarComponent} from '../Spravochnik/kasalliklar/kasalliklar.component';
import {ZararkunandalarComponent} from '../Spravochnik/zararkunandalar/zararkunandalar.component';
import {FumigatsiyaForSpravochnikComponent} from '../Spravochnik/fumigatsiya-for-spravochnik/fumigatsiya-for-spravochnik.component';
import {RestClientService} from '../services/rest-client.service';
import {XuquqlarComponent} from '../Spravochnik/xuquqlar/xuquqlar.component';
import {TokenInterceptor} from '../classes/token.interceptor';
import {FilterNameSprComponent} from '../filter-name-spr/filter-name-spr.component';
import {FaoliyatYunalishlariComponent} from '../Spravochnik/faoliyat-yunalishlari/faoliyat-yunalishlari.component';
import {XulosalarComponent} from '../Spravochnik/xulosalar/xulosalar.component';
import {KurashishUsuliXulosaComponent} from '../Spravochnik/kurashish-usuli-xulosa/kurashish-usuli-xulosa.component';
import {LabaratoriyaXulosaComponent} from '../Spravochnik/labaratoriya-xulosa/labaratoriya-xulosa.component';
import {FilterDocumentsDateComponent} from '../filter-documents-date/filter-documents-date.component';
import {XulosalarFilterForDocumentsComponent} from "../xulosalar-filter-for-documents/xulosalar-filter-for-documents.component";
import {XodimBlankaChiqimiComponent} from "../Documets/xodim-blanka-chiqimi/xodim-blanka-chiqimi.component";
import {IshdanBushatishBuyrugiComponent} from "../Documets/ishdan-bushatish-buyrugi/ishdan-bushatish-buyrugi.component";
import {LavozimniUzgartirishBuyrugiComponent} from "../Documets/lavozimni-uzgartirish-buyrugi/lavozimni-uzgartirish-buyrugi.component";
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AllComponentRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FlexLayoutModule,
    NgxPrintModule
  ],
  providers: [RestClientService, {provide: HTTP_INTERCEPTORS, multi: true, useClass: TokenInterceptor}],
  entryComponents: [
    FilterNameSprComponent,
    FilterDocumentsDateComponent,
    XulosalarFilterForDocumentsComponent
  ],
  declarations: [
    BankComponent,
    TashkilotComponent,
    HomeComponent,
    UsersComponent,
    BlankalarComponent,
    BulimlarComponent,
    BulinmalarComponent,
    DavlatlarComponent,
    FaoliyatTuriComponent,
    FermerXujaligiComponent,
    FumigatsiyaTuriComponent,
    KurashUsullariComponent,
    LavozimlarComponent,
    MassivlarComponent,
    MaxsulotlarComponent,
    MfyComponent,
    OmborComponent,
    PreparatlarComponent,
    QadoqlarComponent,
    QFYComponent,
    QushimchaDekloratsiyaComponent,
    TumanlarComponent,
    UlchovBirligiComponent,
    ViloyatlarComponent,
    XodimlarComponent,
    YetkazibBeruvchilarComponent,
    BlankaKirimiComponent,
    BlankaChiqimiComponent,
    EkspertizaComponent,
    EksportComponent,
    FumigatsiyaComponent,
    FumigatsiyaNazoratiComponent,
    KarantinRuxsatnomasiComponent,
    KurikComponent,
    LabaratoriyaComponent,
    PreparatChiqimiComponent,
    PreparatKirimiComponent,
    RejaBuyichaNazoratiComponent,
    RejadanTashqariNazoratComponent,
    TranzitYukKurigiComponent,
    YozilganSertifikatlarComponent,
    PlanKiritishComponent,
    BegonaUtlarTuriComponent,
    BegonaUtlarComponent,
    KasalliklarTuriComponent,
    KasalliklarComponent,
    ZararkunandalarTuriComponent,
    ZararkunandalarComponent,
    FumigatsiyaForSpravochnikComponent,
    XuquqlarComponent,
    FilterNameSprComponent,
    FilterDocumentsDateComponent,
    FaoliyatYunalishlariComponent,
    XulosalarComponent,
    KurashishUsuliXulosaComponent,
    LabaratoriyaXulosaComponent,
    XulosalarFilterForDocumentsComponent,
    XodimBlankaChiqimiComponent,
    IshdanBushatishBuyrugiComponent,
    LavozimniUzgartirishBuyrugiComponent
  ]
})
export class AllComponentsModule {
}
