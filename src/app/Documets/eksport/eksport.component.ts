import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Eksport, JadvalEksport,} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  Davlatlar,
  FermerXujaligi, FumigatsiyaForSpravochnik, FumigatsiyaTuri,
  Massivlar, Maxsulotalar,
  Preparatlar, Qadoqlar,
  QushimchaDekloratsiya,
  Tumanlar, UlchovBirligi,
  Viloyatlar,
  Xodimlar
} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

interface Transport {
  name: string;
}

@Component({
  selector: 'app-eksport',
  templateUrl: './eksport.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class EksportComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'yuridik',
    'jismoniy', 'xodim', 'viloyat', 'tuman',
    'massiv', 'fermerXujaligi', 'raxbari', 'jismoniyFISH',
    'manzili', 'passport', 'inn', 'telefon', 'davlat',
    'ifsBlankaNomer', 'afBlankaNomer', 'fumigatsiyaSana', 'fitosanitarSertifikatNomer',];

  filterDocuments: FilterDateDocuments = {};

  yuridiklar = true;
  jismoniylar = false;

  transportTuri: Transport[] = [
    {name: 'Автотранспорт'},
    {name: 'Дарё траспорти'},
    {name: 'Кўл юки'},
    {name: 'Темир йўл'},
    {name: 'Хаво транспорти'},
    {name: 'Бошқа транспортлар'},
  ];
  transportTuriName: Transport;

  viloyatlar: Viloyatlar[] = [];
  viloyatlarName: Viloyatlar;
  viloyatId: Viloyatlar;
  tumanlar: Tumanlar[] = [];
  tumanlarName: Tumanlar;
  tumanlarId: Tumanlar;
  massivlar: Massivlar[] = [];
  massivlarName: Massivlar;
  massivlarId: Massivlar;

  fermerXujaligi: FermerXujaligi[] = [];
  fermerXujaligiName: FermerXujaligi;

  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

  davlatlar: Davlatlar[] = [];
  davlatlarName: Davlatlar;

  ishlabChiqarilganViloyat: Viloyatlar[] = [];
  ishlabChiqarilganViloyatName: Viloyatlar;
  ishlabChiqarilganViloyatId: Viloyatlar;
  ishlabChiqarilganTumanlar: Tumanlar[] = [];
  ishlabChiqarilganTumanlarName: Tumanlar;

  qushimchaDekloratsiya: QushimchaDekloratsiya[] = [];
  qushimchaDekloratsiyaName: QushimchaDekloratsiya;

  fumigatsiyaTuri: FumigatsiyaTuri[] = [];
  fumigatsiyaTuriName: FumigatsiyaTuri;
  fumigatsiyaTuriId: FumigatsiyaTuri;

  fumigatsiya: FumigatsiyaForSpravochnik[] = [];
  fumigatsiyaName: FumigatsiyaForSpravochnik;

  preparatlar: Preparatlar[] = [];
  preparatlarName: Preparatlar;

  jadvalEksport: JadvalEksport[] = [];
  selectMaxsulotlar: JadvalEksport;

  maxsulotlar: Maxsulotalar[] = [];
  maxsulotlarName: Maxsulotalar;
  markirovka = false;

  ulchovBirligi: UlchovBirligi[] = [];
  ulchovBirligiName: UlchovBirligi;

  qadoqlar: Qadoqlar[] = [];
  qadoqlarName: Qadoqlar;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;

  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: Eksport;
  reloading = false;
  positionId: string;
  className = 'eksport';
  list: Eksport;
  page = 1;
  pageSize = 20;
  totalPages: number;
  totalDocs: number;
  hasNextPage = false;
  hasPrevPage = false;
  pagingCounter: number;
  prevPage = false;
  nextPage = false;

  constructor(private apiService: RestClientDocumentsService, private appRout: RoutService,
              private dialogFilter: MatDialog, private snackBar: MatSnackBar) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      this.editObject();
    }
    if (event.key === 'Insert') {
      this.addNewObject();
    }
    if (event.key === 'F9') {
      this.copyObject();
    }
    if (event.key === 'F8') {
      this.onResetForm();
    }
    if (event.key === 'Enter' && event.ctrlKey) {
      this.onSubmit();
    }
    if (event.key === 'Delete') {
      if (!this.Buttons) {
        this.deleteObjectForm();
      }
    }
    if (event.key === '9' && event.altKey) {
      if (!this.Buttons) {
        this.opeFilterDialog();
      }
    }
    if (event.key === 'Escape') {
      this.onCloseForm();
    }
    if (event.key === '1' && event.altKey) {
      this.backTable();
    }
    if (event.key === '2' && event.altKey) {
      this.backForm();
    }
  }

  ngOnInit() {
    this.firstFormGroup = new FormGroup({
      firstCtrl: new FormControl(this.page)
    });
    this.secondFormGroup = new FormGroup({
      tasdiqlash: new FormControl(false, Validators.required),
      tartibRaqam: new FormControl(1, Validators.required),
      sana: new FormControl(new Date().toISOString().slice(0, 10), Validators.required),
      yuridik: new FormControl(this.yuridiklar),
      jismoniy: new FormControl(this.jismoniylar),
      viloyatId: new FormControl(''),
      viloyatName: new FormControl(''),
      tumanId: new FormControl(''),
      tumanName: new FormControl(''),
      massivId: new FormControl(''),
      massivName: new FormControl(''),
      fermerXujaligiId: new FormControl(''),
      fermerXujaligiName: new FormControl(''),
      raxbari: new FormControl(''),
      jismoniyFISH: new FormControl(''),
      manzili: new FormControl(''),
      passport: new FormControl(''),
      inn: new FormControl(''),
      telefon: new FormControl(''),
      davlatlarId: new FormControl(''),
      davlatlarName: new FormControl(''),
      kkManzili: new FormControl(''),
      kkNomi: new FormControl(''),
      kkPochtaIndex: new FormControl(''),
      kkElektronPochta: new FormControl('', Validators.required),
      kkTelefon: new FormControl(''),
      kimga: new FormControl(''),
      ishlabChiqarilganViloyatId: new FormControl(''),
      ishlabChiqarilganViloyatName: new FormControl(''),
      ishlabChiqarilganTumanId: new FormControl(''),
      ishlabChiqarilganTumanName: new FormControl(''),
      transportTuri: new FormControl(''),
      transportNomi: new FormControl(''),
      qushimchaDekloratsiyaId: new FormControl(''),
      qushimchaDekloratsiyaName: new FormControl(''),
      eksportShartnomaNomer: new FormControl(''),
      eksportShartnomaSana: new FormControl(new Date()),
      markirovka: new FormControl(this.markirovka),
      chiqishChegaraMaskani: new FormControl(''),
      ifsBlankaNomer: new FormControl(''),
      afBlankaNomer: new FormControl(''),
      obektXarorati: new FormControl(''),
      fumigatsiyaSana: new FormControl(new Date()),
      ekspozitsiya: new FormControl(0),
      dozirovka: new FormControl(0),
      fumigatsiyaTuriId: new FormControl(''),
      fumigatsiyaTuriName: new FormControl(''),
      fumigatsiyaId: new FormControl(''),
      fumigatsiyaName: new FormControl(''),
      preparatlarId: new FormControl(''),
      preparatlarName: new FormControl(''),
      ishlatilganPreparatXajmi: new FormControl(''),
      xodimlarId: new FormControl(''),
      xodimlarName: new FormControl(''),
      fitosanitarSertifikatNomer: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
      tartibRaqamMaxsulot: new FormControl(1),
      maxsulotId: new FormControl(''),
      maxsulotName: new FormControl(''),
      botanikNomi: new FormControl(''),
      TIFTNKODI: new FormControl(''),
      ulchovBirligiId: new FormControl(''),
      ulchovBirligiName: new FormControl(''),
      netto: new FormControl(0),
      brutto: new FormControl(0),
      qadoqlarId: new FormControl(''),
      qadoqlarName: new FormControl(''),
      joySoni: new FormControl(0),
      narxi: new FormControl(0),
      soni: new FormControl(0),
      summasi: new FormControl(0),
    });

    this.getViloyatlar();
    this.getDavlatlar();
    this.getQushimchaDekloratsiya();
    this.getQadoqlar();
    this.getFumigatsiyaTuri();
    this.getMaxsulotlar();
    this.getUlchovBirligi();
    this.getXodimlar();
    this.getAll();
  }

  backTable() {
    this.stepperRef.previous();
  }

  backForm() {
    this.stepperRef.next();
  }

  onSubmit() {
    const newEksport: Eksport = {
      tasdiqlash: true,
      tartibRaqam: this.secondFormGroup.value.tartibRaqam,
      sana: this.secondFormGroup.value.sana,
      yuridik: this.secondFormGroup.value.yuridik,
      jismoniy: this.secondFormGroup.value.jismoniy,
      viloyatId: this.secondFormGroup.value.viloyatId,
      viloyatName: this.secondFormGroup.value.viloyatName,
      tumanId: this.secondFormGroup.value.tumanId,
      tumanName: this.secondFormGroup.value.tumanName,
      massivId: this.secondFormGroup.value.massivId,
      massivName: this.secondFormGroup.value.massivName,
      fermerXujaligiId: this.secondFormGroup.value.fermerXujaligiId,
      fermerXujaligiName: this.secondFormGroup.value.fermerXujaligiName,
      raxbari: this.secondFormGroup.value.raxbari,
      jismoniyFISH: this.secondFormGroup.value.jismoniyFISH,
      manzili: this.secondFormGroup.value.manzili,
      passport: this.secondFormGroup.value.passport,
      inn: this.secondFormGroup.value.inn,
      telefon: this.secondFormGroup.value.telefon,
      davlatlarId: this.secondFormGroup.value.davlatlarId,
      davlatlarName: this.secondFormGroup.value.davlatlarName,
      kkManzili: this.secondFormGroup.value.kkManzili,
      kkNomi: this.secondFormGroup.value.kkNomi,
      kkPochtaIndex: this.secondFormGroup.value.kkPochtaIndex,
      kkElektronPochta: this.secondFormGroup.value.kkElektronPochta,
      kkTelefon: this.secondFormGroup.value.kkTelefon,
      kimga: this.secondFormGroup.value.kimga,
      ishlabChiqarilganViloyatId: this.secondFormGroup.value.ishlabChiqarilganViloyatId,
      ishlabChiqarilganViloyatName: this.secondFormGroup.value.ishlabChiqarilganViloyatName,
      ishlabChiqarilganTumanId: this.secondFormGroup.value.ishlabChiqarilganTumanId,
      ishlabChiqarilganTumanName: this.secondFormGroup.value.ishlabChiqarilganTumanName,
      transportTuri: this.secondFormGroup.value.transportTuri,
      transportNomi: this.secondFormGroup.value.transportNomi,
      qushimchaDekloratsiyaId: this.secondFormGroup.value.qushimchaDekloratsiyaId,
      qushimchaDekloratsiyaName: this.secondFormGroup.value.qushimchaDekloratsiyaName,
      eksportShartnomaNomer: this.secondFormGroup.value.eksportShartnomaNomer,
      eksportShartnomaSana: this.secondFormGroup.value.eksportShartnomaSana,
      markirovka: this.secondFormGroup.value.markirovka,
      chiqishChegaraMaskani: this.secondFormGroup.value.chiqishChegaraMaskani,
      ifsBlankaNomer: this.secondFormGroup.value.ifsBlankaNomer,
      afBlankaNomer: this.secondFormGroup.value.afBlankaNomer,
      obektXarorati: this.secondFormGroup.value.obektXarorati,
      fumigatsiyaSana: this.secondFormGroup.value.fumigatsiyaSana,
      ekspozitsiya: this.secondFormGroup.value.ekspozitsiya,
      dozirovka: this.secondFormGroup.value.dozirovka,
      fumigatsiyaTuriId: this.secondFormGroup.value.fumigatsiyaTuriId,
      fumigatsiyaTuriName: this.secondFormGroup.value.fumigatsiyaTuriName,
      fumigatsiyaId: this.secondFormGroup.value.fumigatsiyaId,
      fumigatsiyaName: this.secondFormGroup.value.fumigatsiyaName,
      preparatlarId: this.secondFormGroup.value.preparatlarId,
      preparatlarName: this.secondFormGroup.value.preparatlarName,
      ishlatilganPreparatXajmi: this.secondFormGroup.value.ishlatilganPreparatXajmi,
      xodimlarId: this.secondFormGroup.value.xodimlarId,
      xodimlarName: this.secondFormGroup.value.xodimlarName,
      fitosanitarSertifikatNomer: this.secondFormGroup.value.fitosanitarSertifikatNomer,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
      jadval: this.jadvalEksport
    };
    if (newEksport) {
      this.creatAll(newEksport);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.secondFormGroup.reset();
      this.EnableButton();
    }
    this.viloyatlarName = null;
    this.ishlabChiqarilganViloyatName = null;
    this.ishlabChiqarilganTumanlarName = null;
    this.davlatlarName = null;
    this.fumigatsiyaTuriName = null;
    this.fumigatsiyaName = null;
    this.preparatlarName = null;
    this.qushimchaDekloratsiyaName = null;
    this.transportTuriName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.jadvalEksport = [];
    this.fumigatsiya = [];
    this.preparatlar = [];
    this.tartibRaqamLength = this.totalDocs + 1;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
  }

  addObject() {
    this.viloyatlarName = null;
    this.ishlabChiqarilganViloyatName = null;
    this.ishlabChiqarilganTumanlarName = null;
    this.davlatlarName = null;
    this.fumigatsiyaTuriName = null;
    this.fumigatsiyaName = null;
    this.preparatlarName = null;
    this.qushimchaDekloratsiyaName = null;
    this.transportTuriName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.jadvalEksport = [];
    this.fumigatsiya = [];
    this.preparatlar = [];
    this.stepperRef.next();
    this.addNewObject();
  }

  editObject() {
    if (this.selectedItem) {
      this.secondFormGroup.reset();
      this.secondFormGroup.patchValue({
        tasdiqlash: this.selectedItem.tasdiqlash,
        tartibRaqam: this.selectedItem.tartibRaqam,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0, 10),
        yuridik: this.selectedItem.yuridik,
        jismoniy: this.selectedItem.jismoniy,
        viloyatId: this.selectedItem.viloyatId,
        viloyatName: this.selectedItem.viloyatName,
        tumanId: this.selectedItem.tumanId,
        tumanName: this.selectedItem.tumanName,
        massivId: this.selectedItem.massivId,
        massivName: this.selectedItem.massivName,
        fermerXujaligiId: this.selectedItem.fermerXujaligiId,
        fermerXujaligiName: this.selectedItem.fermerXujaligiName,
        raxbari: this.selectedItem.raxbari,
        jismoniyFISH: this.selectedItem.jismoniyFISH,
        manzili: this.selectedItem.manzili,
        passport: this.selectedItem.passport,
        inn: this.selectedItem.inn,
        telefon: this.selectedItem.telefon,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        kkManzili: this.selectedItem.kkManzili,
        kkNomi: this.selectedItem.kkNomi,
        kkPochtaIndex: this.selectedItem.kkPochtaIndex,
        kkElektronPochta: this.selectedItem.kkElektronPochta,
        kkTelefon: this.selectedItem.kkTelefon,
        kimga: this.selectedItem.kimga,
        ishlabChiqarilganViloyatId: this.selectedItem.ishlabChiqarilganViloyatId,
        ishlabChiqarilganViloyatName: this.selectedItem.ishlabChiqarilganViloyatName,
        ishlabChiqarilganTumanId: this.selectedItem.ishlabChiqarilganTumanId,
        ishlabChiqarilganTumanName: this.selectedItem.ishlabChiqarilganTumanName,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        qushimchaDekloratsiyaId: this.selectedItem.qushimchaDekloratsiyaId,
        qushimchaDekloratsiyaName: this.selectedItem.qushimchaDekloratsiyaName,
        eksportShartnomaNomer: this.selectedItem.eksportShartnomaNomer,
        eksportShartnomaSana: new Date(this.selectedItem.eksportShartnomaSana).toISOString().slice(0, 10),
        markirovka: this.selectedItem.markirovka,
        chiqishChegaraMaskani: this.selectedItem.chiqishChegaraMaskani,
        ifsBlankaNomer: this.selectedItem.ifsBlankaNomer,
        afBlankaNomer: this.selectedItem.afBlankaNomer,
        obektXarorati: this.selectedItem.obektXarorati,
        fumigatsiyaSana: new Date(this.selectedItem.fumigatsiyaSana).toISOString().slice(0, 10),
        ekspozitsiya: this.selectedItem.ekspozitsiya,
        dozirovka: this.selectedItem.dozirovka,
        fumigatsiyaTuriId: this.selectedItem.fumigatsiyaTuriId,
        fumigatsiyaTuriName: this.selectedItem.fumigatsiyaTuriName,
        fumigatsiyaId: this.selectedItem.fumigatsiyaId,
        fumigatsiyaName: this.selectedItem.fumigatsiyaName,
        preparatlarId: this.selectedItem.preparatlarId,
        preparatlarName: this.selectedItem.preparatlarName,
        ishlatilganPreparatXajmi: this.selectedItem.ishlatilganPreparatXajmi,
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamMaxsulot: this.selectedItem.jadval.length+1
      });
      if (this.selectedItem.jadval.length) {
        this.jadvalEksport = this.selectedItem.jadval;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.ishlabChiqarilganViloyat.length > 0 && this.selectedItem.ishlabChiqarilganViloyatId) {
        this.ishlabChiqarilganViloyatName = this.ishlabChiqarilganViloyat.find(x => x._id === this.selectedItem.ishlabChiqarilganViloyatId);
      }
      if (this.ishlabChiqarilganTumanlar.length > 0 && this.selectedItem.ishlabChiqarilganTumanId) {
        this.ishlabChiqarilganTumanlarName = this.ishlabChiqarilganTumanlar.find(x => x._id === this.selectedItem.ishlabChiqarilganTumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
      }
      if (this.transportTuri.length > 0 && this.selectedItem.transportTuri) {
        this.transportTuriName = this.transportTuri.find(x => x.name === this.selectedItem.transportTuri);
      }
      if (this.qushimchaDekloratsiya.length > 0 && this.selectedItem.qushimchaDekloratsiyaId) {
        this.qushimchaDekloratsiyaName = this.qushimchaDekloratsiya.find(x => x._id === this.selectedItem.qushimchaDekloratsiyaId);
      }
      if (this.fumigatsiyaTuri.length > 0 && this.selectedItem.fumigatsiyaTuriId) {
        this.fumigatsiyaTuriName = this.fumigatsiyaTuri.find(x => x._id === this.selectedItem.fumigatsiyaTuriId);
      }
      if (this.fumigatsiya.length > 0 && this.selectedItem.fumigatsiyaId) {
        this.fumigatsiyaName = this.fumigatsiya.find(x => x._id === this.selectedItem.fumigatsiyaId);
      }
      if (this.preparatlar.length > 0 && this.selectedItem.preparatlarId) {
        this.preparatlarName = this.preparatlar.find(x => x._id === this.selectedItem.preparatlarId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
      }
      if (this.selectedItem.yuridik) {
        this.onChangeYuridiklar();
      } else {
        this.onChangeJismoniylar();
      }
      this.DisableButton();
      this.stepperRef.next();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  copyObject() {
    if (this.selectedItem) {
      this.secondFormGroup.patchValue({
        tasdiqlash: this.selectedItem.tasdiqlash,
        tartibRaqam: this.totalDocs + 1,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0, 10),
        yuridik: this.selectedItem.yuridik,
        jismoniy: this.selectedItem.jismoniy,
        viloyatId: this.selectedItem.viloyatId,
        viloyatName: this.selectedItem.viloyatName,
        tumanId: this.selectedItem.tumanId,
        tumanName: this.selectedItem.tumanName,
        massivId: this.selectedItem.massivId,
        massivName: this.selectedItem.massivName,
        fermerXujaligiId: this.selectedItem.fermerXujaligiId,
        fermerXujaligiName: this.selectedItem.fermerXujaligiName,
        raxbari: this.selectedItem.raxbari,
        jismoniyFISH: this.selectedItem.jismoniyFISH,
        manzili: this.selectedItem.manzili,
        passport: this.selectedItem.passport,
        inn: this.selectedItem.inn,
        telefon: this.selectedItem.telefon,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        kkManzili: this.selectedItem.kkManzili,
        kkNomi: this.selectedItem.kkNomi,
        kkPochtaIndex: this.selectedItem.kkPochtaIndex,
        kkElektronPochta: this.selectedItem.kkElektronPochta,
        kkTelefon: this.selectedItem.kkTelefon,
        kimga: this.selectedItem.kimga,
        ishlabChiqarilganViloyatId: this.selectedItem.ishlabChiqarilganViloyatId,
        ishlabChiqarilganViloyatName: this.selectedItem.ishlabChiqarilganViloyatName,
        ishlabChiqarilganTumanId: this.selectedItem.ishlabChiqarilganTumanId,
        ishlabChiqarilganTumanName: this.selectedItem.ishlabChiqarilganTumanName,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        qushimchaDekloratsiyaId: this.selectedItem.qushimchaDekloratsiyaId,
        qushimchaDekloratsiyaName: this.selectedItem.qushimchaDekloratsiyaName,
        eksportShartnomaNomer: this.selectedItem.eksportShartnomaNomer,
        eksportShartnomaSana: new Date(this.selectedItem.eksportShartnomaSana).toISOString().slice(0, 10),
        markirovka: this.selectedItem.markirovka,
        chiqishChegaraMaskani: this.selectedItem.chiqishChegaraMaskani,
        ifsBlankaNomer: this.selectedItem.ifsBlankaNomer,
        afBlankaNomer: this.selectedItem.afBlankaNomer,
        obektXarorati: this.selectedItem.obektXarorati,
        fumigatsiyaSana: new Date(this.selectedItem.fumigatsiyaSana).toISOString().slice(0, 10),
        ekspozitsiya: this.selectedItem.ekspozitsiya,
        dozirovka: this.selectedItem.dozirovka,
        fumigatsiyaTuriId: this.selectedItem.fumigatsiyaTuriId,
        fumigatsiyaTuriName: this.selectedItem.fumigatsiyaTuriName,
        fumigatsiyaId: this.selectedItem.fumigatsiyaId,
        fumigatsiyaName: this.selectedItem.fumigatsiyaName,
        preparatlarId: this.selectedItem.preparatlarId,
        preparatlarName: this.selectedItem.preparatlarName,
        ishlatilganPreparatXajmi: this.selectedItem.ishlatilganPreparatXajmi,
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamBlanka: this.selectedItem.jadval.length+1
      });
      if (this.selectedItem.jadval.length) {
        this.jadvalEksport = this.selectedItem.jadval;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.ishlabChiqarilganViloyat.length > 0 && this.selectedItem.ishlabChiqarilganViloyatId) {
        this.ishlabChiqarilganViloyatName = this.ishlabChiqarilganViloyat.find(x => x._id === this.selectedItem.ishlabChiqarilganViloyatId);
      }
      if (this.ishlabChiqarilganTumanlar.length > 0 && this.selectedItem.ishlabChiqarilganTumanId) {
        this.ishlabChiqarilganTumanlarName = this.ishlabChiqarilganTumanlar.find(x => x._id === this.selectedItem.ishlabChiqarilganTumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
      }
      if (this.transportTuri.length > 0 && this.selectedItem.transportTuri) {
        this.transportTuriName = this.transportTuri.find(x => x.name === this.selectedItem.transportTuri);
      }
      if (this.qushimchaDekloratsiya.length > 0 && this.selectedItem.qushimchaDekloratsiyaId) {
        this.qushimchaDekloratsiyaName = this.qushimchaDekloratsiya.find(x => x._id === this.selectedItem.qushimchaDekloratsiyaId);
      }
      if (this.fumigatsiyaTuri.length > 0 && this.selectedItem.fumigatsiyaTuriId) {
        this.fumigatsiyaTuriName = this.fumigatsiyaTuri.find(x => x._id === this.selectedItem.fumigatsiyaTuriId);
      }
      if (this.fumigatsiya.length > 0 && this.selectedItem.fumigatsiyaId) {
        this.fumigatsiyaName = this.fumigatsiya.find(x => x._id === this.selectedItem.fumigatsiyaId);
      }
      if (this.preparatlar.length > 0 && this.selectedItem.preparatlarId) {
        this.preparatlarName = this.preparatlar.find(x => x._id === this.selectedItem.preparatlarId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
      }
      if (this.selectedItem.yuridik) {
        this.onChangeYuridiklar();
      } else {
        this.onChangeJismoniylar();
      }
      this.positionId = null;
      this.DisableButton();
      this.stepperRef.next();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  deleteObjectForm() {
    if (this.positionId) {
      this.deleteObject();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  onResetForm() {
    this.filterDocuments = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.viloyatlarName = null;
    this.ishlabChiqarilganViloyatName = null;
    this.ishlabChiqarilganTumanlarName = null;
    this.davlatlarName = null;
    this.fumigatsiyaTuriName = null;
    this.fumigatsiyaName = null;
    this.preparatlarName = null;
    this.qushimchaDekloratsiyaName = null;
    this.transportTuriName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.jadvalEksport = [];
    this.fumigatsiya = [];
    this.preparatlar = [];
    this.stepperRef.previous();
  }

  getDavlatlar() {
    this.apiService.getAll<Davlatlar>('davlatlar/')
      .subscribe(result => {
        this.davlatlar = result;
      });
  }

  getQushimchaDekloratsiya() {
    this.apiService.getAll<QushimchaDekloratsiya>('qushimchaDekloratsiya/')
      .subscribe(result => {
        this.qushimchaDekloratsiya = result;
      });
  }

  getFumigatsiyaTuri() {
    this.apiService.getAll<FumigatsiyaTuri>('fumigatsiyaTuri/')
      .subscribe(result => {
        this.fumigatsiyaTuri = result;
      });
    this.fumigatsiya = [];
    this.preparatlar = [];
  }

  getUlchovBirligi() {
    this.apiService.getAll<UlchovBirligi>('ulchovBirligi/')
      .subscribe(result => {
        this.ulchovBirligi = result;
      });
  }

  getMaxsulotlar() {
    this.apiService.getAll<Maxsulotalar>('maxsulotlar/')
      .subscribe(result => {
        this.maxsulotlar = result;
      });
  }

  getQadoqlar() {
    this.apiService.getAll<Qadoqlar>('qadoqlar/')
      .subscribe(result => {
        this.qadoqlar = result;
      });
  }

  getFumigatsiya() {
    if (this.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.fumigatsiyaTuriId._id
      });
      this.apiService.getObjectId<FumigatsiyaForSpravochnik[]>(params, '/fumigatsiyaForSpravochnik')
        .subscribe(result => {
          this.fumigatsiya = result;
        });
    }
  }

  getPreparatlar() {
    if (this.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.fumigatsiyaTuriId._id
      });
      this.apiService.getObjectId<Preparatlar[]>(params, '/preparatlar')
        .subscribe(result => {
          this.preparatlar = result;
        });
    }
  }

  getViloyatlar() {
    this.apiService.getAll<Viloyatlar>('viloyatlar/')
      .subscribe(result => {
        this.viloyatlar = result;
        this.ishlabChiqarilganViloyat = result;
      });
    this.tumanlar = [];
    this.ishlabChiqarilganTumanlar = [];
  }

  getTumanlar() {
    if (this.viloyatId) {
      const params = Object.assign({}, {
        allIds: this.viloyatId._id
      });
      this.apiService.getObjectId<Tumanlar[]>(params, '/tumanlar')
        .subscribe(result => {
          this.tumanlar = result;
        });
      this.massivlar = [];
    }
  }

  getIshlabChiqarilaganTumanlar() {
    if (this.ishlabChiqarilganViloyatId) {
      const params = Object.assign({}, {
        allIds: this.ishlabChiqarilganViloyatId._id
      });
      this.apiService.getObjectId<Tumanlar[]>(params, '/tumanlar')
        .subscribe(result => {
          this.ishlabChiqarilganTumanlar = result;
        });
    }
  }

  getMassivlar() {
    if (this.tumanlarId) {
      const params = Object.assign({}, {
        allIds: this.tumanlarId._id
      });
      this.apiService.getObjectId<Massivlar[]>(params, '/massivlar')
        .subscribe(result => {
          this.massivlar = result;
        });
      this.fermerXujaligi = [];
    }
  }

  getFermerXujaliklari() {
    if (this.massivlarId) {
      const params = Object.assign({}, {
        allIds: this.massivlarId._id
      });
      this.apiService.getObjectId<FermerXujaligi[]>(params, '/fermerXujaligi')
        .subscribe(result => {
          this.fermerXujaligi = result;
        });
    }
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  onChangeDavlatlar(event) {
    if (event) {
      this.secondFormGroup.get('davlatlarId').setValue(event._id);
      this.secondFormGroup.get('davlatlarName').setValue(event.name);
      this.secondFormGroup.get('kimga').setValue(event.qisqachaNomi);
    } else {
      this.secondFormGroup.get('davlatlarId').setValue('');
      this.secondFormGroup.get('davlatlarName').setValue('');
      this.secondFormGroup.get('kimga').setValue('');
    }
  }

  onChangeQushimchaDekloratsiya(event) {
    if (event) {
      this.secondFormGroup.get('qushimchaDekloratsiyaId').setValue(event._id);
      this.secondFormGroup.get('qushimchaDekloratsiyaName').setValue(event.name);
    } else {
      this.secondFormGroup.get('qushimchaDekloratsiyaId').setValue('');
      this.secondFormGroup.get('qushimchaDekloratsiyaName').setValue('');
    }
  }

  onChangeRadioButton(event) {
    this.secondFormGroup.get('markirovka').setValue(event.value);
  }

  onChangeFumigatsiyaTuri(event) {
    if (event) {
      this.secondFormGroup.get('fumigatsiyaTuriId').setValue(event._id);
      this.secondFormGroup.get('fumigatsiyaTuriName').setValue(event.name);
      if (event._id) {
        this.fumigatsiyaTuriId = event;
        this.getFumigatsiya();
        this.getPreparatlar();
      }
    } else {
      this.secondFormGroup.get('fumigatsiyaTuriId').setValue('');
      this.secondFormGroup.get('fumigatsiyaTuriName').setValue('');
    }
  }

  onChangeFumigatsiya(event) {
    if (event) {
      this.secondFormGroup.get('fumigatsiyaId').setValue(event._id);
      this.secondFormGroup.get('fumigatsiyaName').setValue(event.name);

    } else {
      this.secondFormGroup.get('fumigatsiyaId').setValue('');
      this.secondFormGroup.get('fumigatsiyaName').setValue('');
    }
  }

  onChangePreparatlar(event) {
    if (event) {
      this.secondFormGroup.get('preparatlarId').setValue(event._id);
      this.secondFormGroup.get('preparatlarName').setValue(event.name);

    } else {
      this.secondFormGroup.get('preparatlarId').setValue('');
      this.secondFormGroup.get('preparatlarName').setValue('');
    }
  }

  onChangeMaxsulotlar(event) {
    this.secondFormGroup.get('maxsulotId').setValue(event._id);
    this.secondFormGroup.get('maxsulotName').setValue(event.name);
    this.secondFormGroup.get('botanikNomi').setValue(event.botanikNomi);
    this.secondFormGroup.get('TIFTNKODI').setValue(event.TIFTNKODI);
    if (event.ulchovBirligiId) {
      if (this.ulchovBirligi.length > 0 && event.ulchovBirligiId) {
        this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === event.ulchovBirligiId);
        this.secondFormGroup.get('ulchovBirligiId').setValue(event.ulchovBirligiId);
        this.secondFormGroup.get('ulchovBirligiName').setValue(event.ulchovBirligiName);
      }
    }
  }

  onChangeUlchovBirligi(event) {
    this.secondFormGroup.get('ulchovBirligiId').setValue(event._id);
    this.secondFormGroup.get('ulchovBirligiName').setValue(event.name);
  }

  onChangeQadoqlar(event) {
    this.secondFormGroup.get('qadoqlarId').setValue(event._id);
    this.secondFormGroup.get('qadoqlarName').setValue(event.name);
  }

  onChangeIshlabChiqarilganViloyatlar(event) {
    if (event) {
      this.secondFormGroup.get('ishlabChiqarilganViloyatId').setValue(event._id);
      this.secondFormGroup.get('ishlabChiqarilganViloyatName').setValue(event.name);
      if (event._id) {
        this.ishlabChiqarilganViloyatId = event;
        this.getIshlabChiqarilaganTumanlar();
      }
    } else {
      this.secondFormGroup.get('ishlabChiqarilganViloyatId').setValue('');
      this.secondFormGroup.get('ishlabChiqarilganViloyatName').setValue('');
    }
  }

  onChangeViloyatlar(event) {
    if (event) {
      this.secondFormGroup.get('viloyatId').setValue(event._id);
      this.secondFormGroup.get('viloyatName').setValue(event.name);
      if (event._id) {
        this.viloyatId = event;
        this.getTumanlar();
      }
    } else {
      this.secondFormGroup.get('viloyatId').setValue('');
      this.secondFormGroup.get('viloyatName').setValue('');
    }
  }

  onChangeTumanlar(event) {
    if (event) {
      this.secondFormGroup.get('tumanId').setValue(event._id);
      this.secondFormGroup.get('tumanName').setValue(event.name);
      if (event._id) {
        this.tumanlarId = event;
        this.getMassivlar();
      }
    } else {
      this.secondFormGroup.get('tumanId').setValue('');
      this.secondFormGroup.get('tumanName').setValue('');
    }
  }

  onChangeIshlabChiqarilganTumanlar(event) {
    if (event) {
      this.secondFormGroup.get('ishlabChiqarilganTumanId').setValue(event._id);
      this.secondFormGroup.get('ishlabChiqarilganTumanName').setValue(event.name);
      if (event._id) {
        this.tumanlarId = event;
        this.getMassivlar();
      }
    } else {
      this.secondFormGroup.get('ishlabChiqarilganTumanId').setValue('');
      this.secondFormGroup.get('ishlabChiqarilganTumanName').setValue('');
    }
  }

  onChangeTransportTuri(event) {
    if (event) {
      this.secondFormGroup.get('transportTuri').setValue(event.value);
    } else {
      this.secondFormGroup.get('transportTuri').setValue('');

    }
  }

  onChangeMassivlar(event) {
    if (event) {
      this.secondFormGroup.get('massivId').setValue(event._id);
      this.secondFormGroup.get('massivName').setValue(event.name);
      if (event._id) {
        this.massivlarId = event;
        this.getFermerXujaliklari();
      }
    } else {
      this.secondFormGroup.get('massivId').setValue('');
      this.secondFormGroup.get('massivName').setValue('');
    }
  }

  onChangeFermerXujaliklari(event) {
    if (event) {
      this.secondFormGroup.get('fermerXujaligiId').setValue(event._id);
      this.secondFormGroup.get('fermerXujaligiName').setValue(event.name);
      this.secondFormGroup.get('raxbari').setValue(event.raxbari);
    } else {
      this.secondFormGroup.get('fermerXujaligiId').setValue('');
      this.secondFormGroup.get('fermerXujaligiName').setValue('');
      this.secondFormGroup.get('raxbari').setValue('');
    }
  }

  onChangeXodimlar(event) {
    if (event) {
      this.secondFormGroup.get('xodimlarId').setValue(event._id);
      this.secondFormGroup.get('xodimlarName').setValue(event.name);
    } else {
      this.secondFormGroup.get('xodimlarId').setValue('');
      this.secondFormGroup.get('xodimlarName').setValue('');
    }
  }

  onChangeJismoniylar() {
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.yuridiklar = false;
    this.massivlarName = null;
    this.fermerXujaligi = null;
    this.secondFormGroup.get('raxbari').setValue('');
    this.secondFormGroup.get('raxbari').disable();
    this.secondFormGroup.get('jismoniyFISH').enable();
    this.secondFormGroup.get('manzili').enable();
    this.secondFormGroup.get('passport').enable();
    this.secondFormGroup.get('inn').enable();
    this.secondFormGroup.get('telefon').enable();
  }

  onChangeYuridiklar() {
    this.jismoniylar = false;
    this.secondFormGroup.get('jismoniyFISH').setValue('');
    this.secondFormGroup.get('manzili').setValue('');
    this.secondFormGroup.get('passport').setValue('');
    this.secondFormGroup.get('inn').setValue('');
    this.secondFormGroup.get('telefon').setValue('');
    this.secondFormGroup.get('raxbari').enable();
    this.secondFormGroup.get('jismoniyFISH').disable();
    this.secondFormGroup.get('manzili').disable();
    this.secondFormGroup.get('passport').disable();
    this.secondFormGroup.get('inn').disable();
    this.secondFormGroup.get('telefon').disable();
  }

  onCloseForm() {
    this.viloyatlarName = null;
    this.ishlabChiqarilganViloyatName = null;
    this.ishlabChiqarilganTumanlarName = null;
    this.davlatlarName = null;
    this.fumigatsiyaTuriName = null;
    this.fumigatsiyaName = null;
    this.preparatlarName = null;
    this.qushimchaDekloratsiyaName = null;
    this.transportTuriName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.jadvalEksport = [];
    this.fumigatsiya = [];
    this.preparatlar = [];
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedTumanAndMassiv(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.viloyatlarName = null;
    this.viloyatlarName = null;
    this.ishlabChiqarilganViloyatName = null;
    this.ishlabChiqarilganTumanlarName = null;
    this.davlatlarName = null;
    this.fumigatsiyaTuriName = null;
    this.fumigatsiyaName = null;
    this.preparatlarName = null;
    this.qushimchaDekloratsiyaName = null;
    this.transportTuriName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.EnableButton();
    if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
      this.viloyatId = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      this.getTumanlar();
    }
    if (this.selectedItem.tumanId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.tumanId
      });
      this.apiService.getObjectId<Massivlar[]>(params, '/massivlar')
        .subscribe(result => {
          this.massivlar = result;
        });
    }
    if (this.selectedItem.massivId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.massivId
      });
      this.apiService.getObjectId<FermerXujaligi[]>(params, '/fermerXujaligi')
        .subscribe(result => {
          this.fermerXujaligi = result;
        });
    } else {
      this.fermerXujaligi = [];
    }
    if (this.selectedItem.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.fumigatsiyaTuriId
      });
      this.apiService.getObjectId<FumigatsiyaForSpravochnik[]>(params, '/fumigatsiyaForSpravochnik')
        .subscribe(result => {
          this.fumigatsiya = result;
        });
    } else {
      this.fumigatsiya = [];
    }

    if (this.selectedItem.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.fumigatsiyaTuriId
      });
      this.apiService.getObjectId<Preparatlar[]>(params, '/preparatlar')
        .subscribe(result => {
          this.preparatlar = result;
        });
    } else {
      this.preparatlar = [];
    }
  }

  selectedJadval(jadvalMaxsulot) {
    this.selectMaxsulotlar = jadvalMaxsulot;
  }

  adder() {
    const idx = this.jadvalEksport.find(p => p.maxsulotId === this.secondFormGroup.value.maxsulotId);
    if (idx) {
      this.openSnackBar(`${this.secondFormGroup.value.maxsulotName}${'номли бланка киритилган, бир хил бланка киритиш мумкин эмас!'}`, 'Хатолик', 3);
      return;
    }
    this.jadvalEksport.push(
      {
        tartibRaqam: this.secondFormGroup.value.tartibRaqamMaxsulot,
        maxsulotId: this.secondFormGroup.value.maxsulotId,
        maxsulotName: this.secondFormGroup.value.maxsulotName,
        botanikNomi: this.secondFormGroup.value.botanikNomi,
        TIFTNKODI: this.secondFormGroup.value.TIFTNKODI,
        ulchovBirligiId: this.secondFormGroup.value.ulchovBirligiId,
        ulchovBirligiName: this.secondFormGroup.value.ulchovBirligiName,
        netto: this.secondFormGroup.value.netto,
        brutto: this.secondFormGroup.value.brutto,
        qadoqlarId: this.secondFormGroup.value.qadoqlarId,
        qadoqlarName: this.secondFormGroup.value.qadoqlarName,
        joySoni: this.secondFormGroup.value.joySoni,
        narxi: this.secondFormGroup.value.narxi,
        soni: this.secondFormGroup.value.soni,
        summasi: this.secondFormGroup.value.summasi
      }
    );
    this.maxsulotlarName = null;
    this.ulchovBirligiName = null;
    this.qadoqlarName = null;
    this.secondFormGroup.patchValue({
      tartibRaqamMaxsulot: this.jadvalEksport.length + 1,
      maxsulotId: '',
      maxsulotName: '',
      botanikNomi: '',
      TIFTNKODI: '',
      ulchovBirligiId: '',
      ulchovBirligiName: '',
      netto: 0,
      brutto: 0,
      qadoqlarId: '',
      qadoqlarName: '',
      joySoni: 0,
      narxi: 0,
      soni: 0,
      summasi: 0,
    });
  }

  editJadVal() {
    if (this.selectMaxsulotlar) {
      this.secondFormGroup.patchValue({
        tartibRaqamMaxsulot: this.selectMaxsulotlar.tartibRaqam,
        maxsulotId: this.selectMaxsulotlar.maxsulotId,
        maxsulotName: this.selectMaxsulotlar.maxsulotName,
        botanikNomi: this.selectMaxsulotlar.botanikNomi,
        TIFTNKODI: this.selectMaxsulotlar.TIFTNKODI,
        ulchovBirligiId: this.selectMaxsulotlar.ulchovBirligiId,
        ulchovBirligiName: this.selectMaxsulotlar.ulchovBirligiName,
        netto: this.selectMaxsulotlar.netto,
        brutto: this.selectMaxsulotlar.brutto,
        qadoqlarId: this.selectMaxsulotlar.qadoqlarId,
        qadoqlarName: this.selectMaxsulotlar.qadoqlarName,
        joySoni: this.selectMaxsulotlar.joySoni,
        narxi: this.selectMaxsulotlar.narxi,
        soni: this.selectMaxsulotlar.soni,
        summasi: this.selectMaxsulotlar.summasi
      });
      if (this.maxsulotlar.length > 0 && this.selectMaxsulotlar.maxsulotId) {
        this.maxsulotlarName = this.maxsulotlar.find(x => x._id === this.selectMaxsulotlar.maxsulotId);
      }
      if (this.ulchovBirligi.length > 0 && this.selectMaxsulotlar.ulchovBirligiId) {
        this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === this.selectMaxsulotlar.ulchovBirligiId);
      }
      if (this.qadoqlar.length > 0 && this.selectMaxsulotlar.qadoqlarId) {
        this.qadoqlarName = this.qadoqlar.find(x => x._id === this.selectMaxsulotlar.qadoqlarId);
      }
    }
  }

  deleteJadval() {
    if (this.selectMaxsulotlar) {
      const idx = this.jadvalEksport.find(p => p.maxsulotId === this.selectMaxsulotlar.maxsulotId).tartibRaqam - 1;
      this.jadvalEksport.splice(idx, 1);
    }
  }

  EnableButton() {
    this.Buttons = false;
  }

  DisableButton() {
    this.Buttons = true;
  }

  goHome() {
    this.appRout.goHome();
  }

  hasPrevPageGet() {
    this.page = 1;
    this.getAll();
  }

  prevPageGet() {
    this.page = this.page - 1;
    this.getAll();
  }

  nextPageGet() {
    if (this.totalPages > this.page) {
      this.page = this.page + 1;
    } else {
      this.page = this.totalPages;
    }
    this.getAll();
  }

  hasNextPageGet() {
    this.page = this.totalPages;
    this.getAll();
  }

  getPage() {
    if (this.page > this.totalPages) {
      this.page = this.totalPages;
    }
    this.getAll();
  }

  addNewObject() {
    this.isVisbleForm = true;
    this.selectedItem = null;
    this.tartibRaqamLength = this.totalDocs + 1;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
    this.secondFormGroup.patchValue({tartibRaqamMaxsulot: 1});
    this.secondFormGroup.get('raxbari').enable();
    this.secondFormGroup.get('jismoniyFISH').disable();
    this.secondFormGroup.get('manzili').disable();
    this.secondFormGroup.get('passport').disable();
    this.secondFormGroup.get('inn').disable();
    this.secondFormGroup.get('telefon').disable();
    this.positionId = null;
    this.DisableButton();

  }

  selectedRow(row) {
    this.selectedItem = row;
    this.positionId = row._id;
    this.secondFormGroup.reset();
    this.EnableButton();
  }

  closeObject() {
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.positionId = null;
    this.EnableButton();

  }

  deleteObject() {
    const decision = window.confirm("Танланган қаторини ўчиришни хохлайсизми!");
    if (decision) {
      this.apiService.delete(this.positionId, this.className)
        .subscribe(
          response =>
            this.openSnackBar(response.message, 'Тасдиқлаш', 2),
          error => this.openSnackBar(error.error.message, 'Хатолик', 2),
          () => this.getAll()
        );
    }
    this.EnableButton();
  }

  creatAll(ObjectForm) {
    if (this.positionId) {
      ObjectForm._id = this.positionId;
      this.apiService.updated<Eksport>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Eksport>(this.className, ObjectForm)
        .subscribe(
          () => this.openSnackBar('Маълумот сақланди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    }
    this.positionId = null;
  }

  getAll() {
    this.reloading = true;
    const params = Object.assign({}, this.filterDocuments, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Eksport>>(params, this.className)
      .subscribe(result => {
        this.list = result.content;
        this.totalDocs = result.totalDocs;
        this.hasPrevPage = result.hasPrevPage;
        this.hasNextPage = result.hasNextPage;
        this.totalPages = result.totalPages;
        this.pagingCounter = result.pagingCounter;
        this.prevPage = result.prevPage;
        this.nextPage = result.nextPage;
        this.reloading = false;
        this.backTable();
      }, () => {
        this.reloading = true;
      });

  }

  openSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration: duration * 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  getByFilter() {
    this.reloading = true;
    const params = Object.assign({}, this.filterDocuments, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Eksport>>(params, this.className)
      .subscribe(result => {
        this.list = result.content;
        this.totalDocs = result.totalDocs;
        this.hasPrevPage = result.hasPrevPage;
        this.hasNextPage = result.hasNextPage;
        this.totalPages = result.totalPages;
        this.pagingCounter = result.pagingCounter;
        this.prevPage = result.prevPage;
        this.nextPage = result.nextPage;
        this.reloading = false;
      });
  }

  opeFilterDialog() {
    const dialogRef = this.dialogFilter.open(FilterDocumentsDateComponent, {
      width: '350px',
      data: {start: this.filterDocuments.start, end: this.filterDocuments.end}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.start && result.end && result.ok && (typeof result.start) === 'string' && (typeof result.end) === 'string') {
        this.filterDocuments.start = result.start;
        this.filterDocuments.end = result.end;
        this.reloading = true;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterDocuments = {};
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }
}
