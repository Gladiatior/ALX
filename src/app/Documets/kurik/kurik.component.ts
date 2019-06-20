import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Ekspertiza, JadvalKurik, Kurik} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  Davlatlar,
  FermerXujaligi,
  Massivlar, Maxsulotalar,
  Tumanlar,
  UlchovBirligi,
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
  selector: 'app-kurik',
  templateUrl: './kurik.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class KurikComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'yuridik',
    'jismoniy', 'xodim', 'viloyat', 'tuman', 'massiv',
    'fermerXujaligi', 'raxbari', 'jismoniyFISH', 'manzili',
    'passport', 'transportNomi',
    'transportTuri', 'xulosaVaTakliflar'];

  transportTuri: Transport[] = [
    {name: 'Автотранспорт'},
    {name: 'Дарё траспорти'},
    {name: 'Кўл юки'},
    {name: 'Темир йўл'},
    {name: 'Хаво транспорти'},
    {name: 'Бошқа транспортлар'},
  ];

  transportTuriName: Transport;

  filterDocuments: FilterDateDocuments = {};
  tekshirish = true;

  yuridiklar = true;
  jismoniylar = false;

  ekspertiza: Ekspertiza;

  jadvalEkspertiza: JadvalKurik[] = [];
  selectEkspertizaMaxsulotlar: JadvalKurik;

  jadvalKurik: JadvalKurik[] = [];
  selectKurikMaxsulotlar: JadvalKurik;

  davlatlar: Davlatlar[] = [];
  davlatlarName: Davlatlar;
  kelganDavlatlar: Davlatlar[] = [];
  kelganDavlatlarName: Davlatlar;

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
  ekspertizaXodimlar: Xodimlar[] = [];
  ekspertizaXodimlarName: Xodimlar;

  maxsulotlar: Maxsulotalar[] = [];
  maxsulotlarName: Maxsulotalar;

  ulchovBirligi: UlchovBirligi[] = [];
  ulchovBirligiName: UlchovBirligi;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;

  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: Kurik;
  reloading = false;
  positionId: string;
  className = 'kurik';
  list: Kurik;
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
      xodimlarId: new FormControl('', Validators.required),
      xodimlarName: new FormControl(''),
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
      kelganDavlatlarId: new FormControl(''),
      kelganDavlatlarName: new FormControl(''),
      transportTuri: new FormControl(''),
      transportNomi: new FormControl(''),
      xulosaVaTakliflar: new FormControl(''),
      ekspertizaSana: new FormControl(new Date()),
      ekspertizaNomer: new FormControl(''),
      ekspertizaXodimId: new FormControl(''),
      ekspertizaXodimName: new FormControl(),
      karantinRuxsatnomasiNomer: new FormControl(''),
      ruxsatnomaSanasi: new FormControl(new Date()),
      muddati: new FormControl(new Date()),
      kimga: new FormControl(''),
      utishChegaraPunktlari: new FormControl(''),
      kurikJoyi: new FormControl(''),
      fitosanitarSertifikatSana: new FormControl(new Date()),
      fitosanitarSertifikatNomer: new FormControl(''),
      davlatlarId: new FormControl(0),
      davlatlarName: new FormControl(''),
      tekshirish: new FormControl(this.tekshirish),
      xulosa: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
      tartibRaqamMaxsulot: new FormControl(1),
      maxsulotId: new FormControl(''),
      maxsulotName: new FormControl(''),
      botanikNomi: new FormControl(''),
      TIFTNKODI: new FormControl(''),
      ulchovBirligiId: new FormControl(''),
      ulchovBirligiName: new FormControl(''),
      soni: new FormControl(0),
    });
    this.getViloyatlar();
    this.getDavlatlar();
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
    const newKurik: Kurik = {
      tasdiqlash: true,
      tartibRaqam: this.secondFormGroup.value.tartibRaqam,
      sana: this.secondFormGroup.value.sana,
      yuridik: this.secondFormGroup.value.yuridik,
      jismoniy: this.secondFormGroup.value.jismoniy,
      xodimlarId: this.secondFormGroup.value.xodimlarId,
      xodimlarName: this.secondFormGroup.value.xodimlarName,
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
      kelganDavlatlarId: this.secondFormGroup.value.kelganDavlatlarId,
      kelganDavlatlarName: this.secondFormGroup.value.kelganDavlatlarName,
      transportTuri: this.secondFormGroup.value.transportTuri,
      transportNomi: this.secondFormGroup.value.transportNomi,
      xulosaVaTakliflar: this.secondFormGroup.value.xulosaVaTakliflar,
      jadval: this.jadvalEkspertiza,
      ekspertizaSana: this.secondFormGroup.value.ekspertizaSana,
      ekspertizaNomer: this.secondFormGroup.value.ekspertizaNomer,
      ekspertizaXodimId: this.secondFormGroup.value.ekspertizaXodimId,
      ekspertizaXodimName: this.secondFormGroup.value.ekspertizaXodimName,
      karantinRuxsatnomasiNomer: this.secondFormGroup.value.karantinRuxsatnomasiNomer,
      ruxsatnomaSanasi: this.secondFormGroup.value.ruxsatnomaSanasi,
      muddati: this.secondFormGroup.value.muddati,
      kimga: this.secondFormGroup.value.kimga,
      utishChegaraPunktlari: this.secondFormGroup.value.utishChegaraPunktlari,
      kurikJoyi: this.secondFormGroup.value.kurikJoyi,
      jadvalKurik: this.jadvalKurik,
      fitosanitarSertifikatSana: this.secondFormGroup.value.fitosanitarSertifikatSana,
      fitosanitarSertifikatNomer: this.secondFormGroup.value.fitosanitarSertifikatNomer,
      davlatlarId: this.secondFormGroup.value.davlatlarId,
      davlatlarName: this.secondFormGroup.value.davlatlarName,
      tekshirish: this.secondFormGroup.value.tekshirish,
      xulosa: this.secondFormGroup.value.xulosa,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId
    };
    if (newKurik) {
      this.creatAll(newKurik);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.secondFormGroup.reset();
      this.EnableButton();
    }
    this.davlatlarName = null;
    this.tartibRaqamLength = this.totalDocs + 1;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
  }

  addObject() {
    this.xodimlarName = null;
    this.ekspertizaXodimlarName = null;
    this.tekshirish = true;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.davlatlarName = null;
    this.kelganDavlatlarName = null;
    this.transportTuriName = null;
    this.tekshirish = true;
    this.tumanlar = [];
    this.massivlar = [];
    this.fermerXujaligi = [];
    this.jadvalKurik = [];
    this.jadvalEkspertiza = [];
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
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
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
        kelganDavlatlarId: this.selectedItem.kelganDavlatlarId,
        kelganDavlatlarName: this.selectedItem.kelganDavlatlarName,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        xulosaVaTakliflar: this.selectedItem.xulosaVaTakliflar,
        ekspertizaSana: new Date(this.selectedItem.ekspertizaSana).toISOString().slice(0, 10),
        ekspertizaNomer: this.selectedItem.ekspertizaNomer,
        ekspertizaXodimId: this.selectedItem.ekspertizaXodimId,
        ekspertizaXodimName: this.selectedItem.ekspertizaXodimName,
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        ruxsatnomaSanasi: new Date(this.selectedItem.ruxsatnomaSanasi).toISOString().slice(0, 10),
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        kimga: this.selectedItem.kimga,
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        kurikJoyi: this.selectedItem.kurikJoyi,
        fitosanitarSertifikatSana: new Date(this.selectedItem.fitosanitarSertifikatSana).toISOString().slice(0, 10),
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        tekshirish: this.selectedItem.tekshirish,
        xulosa: this.selectedItem.xulosa,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamMaxsulot: this.selectedItem.jadval.length + 1
      });
      this.tekshirish = this.selectedItem.tekshirish;
      if (this.selectedItem.jadval.length) {
        this.jadvalEkspertiza = this.selectedItem.jadval;
      }
      if (this.selectedItem.jadvalKurik.length) {
        this.jadvalKurik = this.selectedItem.jadvalKurik;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
      }
      if (this.kelganDavlatlar.length > 0 && this.selectedItem.kelganDavlatlarId) {
        this.kelganDavlatlarName = this.kelganDavlatlar.find(x => x._id === this.selectedItem.kelganDavlatlarId);
      }
      if (this.transportTuri.length > 0 && this.selectedItem.transportTuri) {
        this.transportTuriName = this.transportTuri.find(x => x.name === this.selectedItem.transportTuri);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
      }
      if (this.ekspertizaXodimlar.length > 0 && this.selectedItem.ekspertizaXodimId) {
        this.ekspertizaXodimlarName = this.ekspertizaXodimlar.find(x => x._id === this.selectedItem.ekspertizaXodimId);
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
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
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
        kelganDavlatlarId: this.selectedItem.kelganDavlatlarId,
        kelganDavlatlarName: this.selectedItem.kelganDavlatlarName,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        xulosaVaTakliflar: this.selectedItem.xulosaVaTakliflar,
        ekspertizaSana: new Date(this.selectedItem.ekspertizaSana).toISOString().slice(0, 10),
        ekspertizaNomer: this.selectedItem.ekspertizaNomer,
        ekspertizaXodimId: this.selectedItem.ekspertizaXodimId,
        ekspertizaXodimName: this.selectedItem.ekspertizaXodimName,
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        ruxsatnomaSanasi: new Date(this.selectedItem.ruxsatnomaSanasi).toISOString().slice(0, 10),
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        kimga: this.selectedItem.kimga,
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        kurikJoyi: this.selectedItem.kurikJoyi,
        fitosanitarSertifikatSana: new Date(this.selectedItem.fitosanitarSertifikatSana).toISOString().slice(0, 10),
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        tekshirish: this.selectedItem.tekshirish,
        xulosa: this.selectedItem.xulosa,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamMaxsulot: this.selectedItem.jadval.length + 1
      });
      this.tekshirish = this.selectedItem.tekshirish;
      if (this.selectedItem.jadval.length) {
        this.jadvalEkspertiza = this.selectedItem.jadval;
      }
      if (this.selectedItem.jadvalKurik.length) {
        this.jadvalKurik = this.selectedItem.jadvalKurik;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
      }
      if (this.kelganDavlatlar.length > 0 && this.selectedItem.kelganDavlatlarId) {
        this.kelganDavlatlarName = this.kelganDavlatlar.find(x => x._id === this.selectedItem.kelganDavlatlarId);
      }
      if (this.transportTuri.length > 0 && this.selectedItem.transportTuri) {
        this.transportTuriName = this.transportTuri.find(x => x.name === this.selectedItem.transportTuri);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
      }
      if (this.ekspertizaXodimlar.length > 0 && this.selectedItem.ekspertizaXodimId) {
        this.ekspertizaXodimlarName = this.ekspertizaXodimlar.find(x => x._id === this.selectedItem.ekspertizaXodimId);
      }
      this.positionId = null;
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

  deleteObjectForm() {
    if (this.positionId) {
      this.deleteObject();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  onResetForm() {
    this.xodimlarName = null;
    this.ekspertizaXodimlarName = null;
    this.tekshirish = false;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.davlatlarName = null;
    this.kelganDavlatlarName = null;
    this.transportTuriName = null;
    this.tumanlar = [];
    this.massivlar = [];
    this.fermerXujaligi = [];
    this.jadvalKurik = [];
    this.jadvalEkspertiza = [];
    this.stepperRef.next();
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.stepperRef.previous();
  }

  getDavlatlar() {
    this.apiService.getAll<Davlatlar>('davlatlar/')
      .subscribe(result => {
        this.davlatlar = result;
        this.kelganDavlatlar = result;
      });
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
        this.ekspertizaXodimlar = result;
      });
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

  getViloyatlar() {
    this.apiService.getAll<Viloyatlar>('viloyatlar/')
      .subscribe(result => {
        this.viloyatlar = result;
      });
    this.tumanlar = [];
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

  onChangeEksperiza(event) {
    if (event) {
      const params = Object.assign({}, {
        tartibRaqam: event.target.value,
      });
      this.apiService.getEkspertiza<Ekspertiza>(params, '/ekspertiza')
        .subscribe(result => {
          this.ekspertiza = result;
          if (this.ekspertiza) {
            this.secondFormGroup.patchValue({
              ekspertizaSana: new Date(this.ekspertiza.sana).toISOString().slice(0, 10),
              ekspertizaXodimId: this.ekspertiza.xodimlarId,
              ekspertizaXodimName: this.ekspertiza.xodimlarName,
              karantinRuxsatnomasiNomer: this.ekspertiza.karantinRuxsatnomasiNomer,
              ruxsatnomaSanasi: new Date(this.ekspertiza.ruxsatnomaSanasi).toISOString().slice(0, 10),
              muddati: new Date(this.ekspertiza.muddati).toISOString().slice(0, 10),
              kimga: this.ekspertiza.kimga,
              utishChegaraPunktlari: this.ekspertiza.utishChegaraPunktlari,
              kurikJoyi: this.ekspertiza.kurikJoyi,
              fitosanitarSertifikatNomer: this.ekspertiza.fitosanitarSertifikatNomer,
              fitosanitarSertifikatSana: new Date(this.ekspertiza.fitosanitarSertifikatSana).toISOString().slice(0, 10),
              davlatlarId: this.ekspertiza.davlatlarId,
              davlatlarName: this.ekspertiza.davlatlarName,
              tekshirish: this.ekspertiza.tekshirish,
              xulosa: this.ekspertiza.xulosa,
            });
            this.tekshirish = this.ekspertiza.tekshirish;
            this.jadvalEkspertiza = this.ekspertiza.jadval;
            if (this.ekspertizaXodimlar.length > 0 && this.ekspertiza.xodimlarId) {
              this.ekspertizaXodimlarName = this.ekspertizaXodimlar.find(x => x._id === this.ekspertiza.xodimlarId);
            }
            if (this.davlatlar.length > 0 && this.ekspertiza.davlatlarId) {
              this.davlatlarName = this.davlatlar.find(x => x._id === this.ekspertiza.davlatlarId);
            }
          } else {
            this.openSnackBar('Бундай рақамлик экспертиза мавжуд эмас!', 'Хатолик!', 5);
            this.secondFormGroup.patchValue({
              ekspertizaSana: '',
              ekspertizaNomer: '',
              ekspertizaXodimId: '',
              ekspertizaXodimName: '',
              karantinRuxsatnomasiNomer: '',
              ruxsatnomaSanasi: '',
              muddati: '',
              kimga: '',
              utishChegaraPunktlari: '',
              kurikJoyi: '',
              fitosanitarSertifikatSana: '',
              fitosanitarSertifikatNomer: '',
              davlatlarId: '',
              davlatlarName: '',
              tekshirish: false,
              xulosa: '',
            });
            this.davlatlarName = null;
            this.ekspertizaXodimlarName = null;
            this.jadvalEkspertiza = [];
          }
        });
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

  onChangeKelganDavlatlar(event) {
    if (event) {
      this.secondFormGroup.get('kelganDavlatlarId').setValue(event._id);
      this.secondFormGroup.get('kelganDavlatlarName').setValue(event.name);
    } else {
      this.secondFormGroup.get('kelganDavlatlarId').setValue('');
      this.secondFormGroup.get('kelganDavlatlarName').setValue('');
    }
  }

  onChangeTransportTuri(event) {
    if (event) {
      this.secondFormGroup.get('transportTuri').setValue(event.name);
    } else {
      this.secondFormGroup.get('transportTuri').setValue('');
    }
  }

  onChangeRadioButton(event) {
    this.secondFormGroup.get('tekshirish').setValue(event.value);
  }

  onChangeMaxsulotlar(event) {
    this.secondFormGroup.get('maxsulotId').setValue(event._id);
    this.secondFormGroup.get('maxsulotName').setValue(event.name);
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

  onChangeXodimlar(event) {
    if (event) {
      this.secondFormGroup.get('xodimlarId').setValue(event._id);
      this.secondFormGroup.get('xodimlarName').setValue(event.name);
    } else {
      this.secondFormGroup.get('xodimlarId').setValue('');
      this.secondFormGroup.get('xodimlarName').setValue('');
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

  onCloseForm() {
    this.xodimlarName = null;
    this.ekspertizaXodimlarName = null;
    this.tekshirish = false;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.davlatlarName = null;
    this.kelganDavlatlarName = null;
    this.transportTuriName = null;
    this.tumanlar = [];
    this.massivlar = [];
    this.fermerXujaligi = [];
    this.jadvalKurik = [];
    this.jadvalEkspertiza = [];
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
    this.tekshirish = this.selectedItem.tekshirish;
    this.positionId = row._id;
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
    this.EnableButton();
  }

  selectedJadval(jadvalMaxsulot) {
    this.selectKurikMaxsulotlar = jadvalMaxsulot;
  }

  adder() {
    const idx = this.jadvalKurik.find(p => p.maxsulotId === this.secondFormGroup.value.maxsulotId);
    if (idx) {
      this.openSnackBar(`${this.secondFormGroup.value.maxsulotName}${'номли бланка киритилган, бир хил бланка киритиш мумкин эмас!'}`, 'Хатолик', 3);
      return;
    }
    this.jadvalKurik.push(
      {
        tartibRaqam: this.secondFormGroup.value.tartibRaqamMaxsulot,
        maxsulotId: this.secondFormGroup.value.maxsulotId,
        maxsulotName: this.secondFormGroup.value.maxsulotName,
        botanikNomi: this.secondFormGroup.value.botanikNomi,
        TIFTNKODI: this.secondFormGroup.value.TIFTNKODI,
        ulchovBirligiId: this.secondFormGroup.value.ulchovBirligiId,
        ulchovBirligiName: this.secondFormGroup.value.ulchovBirligiName,
        soni: this.secondFormGroup.value.soni
      }
    );
    this.maxsulotlarName = null;
    this.ulchovBirligiName = null;
    this.secondFormGroup.patchValue({
      tartibRaqamMaxsulot: this.jadvalKurik.length + 1,
      maxsulotId: '',
      maxsulotName: '',
      botanikNomi: '',
      TIFTNKODI: '',
      ulchovBirligiId: '',
      ulchovBirligiName: '',
      soni: 0
    });
  }

  editJadVal() {
    if (this.selectKurikMaxsulotlar) {
      this.secondFormGroup.patchValue({
        tartibRaqamMaxsulot: this.selectKurikMaxsulotlar.tartibRaqam,
        maxsulotId: this.selectKurikMaxsulotlar.maxsulotId,
        maxsulotName: this.selectKurikMaxsulotlar.maxsulotName,
        botanikNomi: this.selectKurikMaxsulotlar.botanikNomi,
        TIFTNKODI: this.selectKurikMaxsulotlar.TIFTNKODI,
        ulchovBirligiId: this.selectKurikMaxsulotlar.ulchovBirligiId,
        ulchovBirligiName: this.selectKurikMaxsulotlar.ulchovBirligiName,
        soni: this.selectKurikMaxsulotlar.soni
      });
      if (this.maxsulotlar.length > 0 && this.selectKurikMaxsulotlar.maxsulotId) {
        this.maxsulotlarName = this.maxsulotlar.find(x => x._id === this.selectKurikMaxsulotlar.maxsulotId);
      }
      if (this.ulchovBirligi.length > 0 && this.selectKurikMaxsulotlar.ulchovBirligiId) {
        this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === this.selectKurikMaxsulotlar.ulchovBirligiId);
      }
    }
  }

  deleteJadval() {
    if (this.selectKurikMaxsulotlar) {
      const idx = this.jadvalKurik.find(p => p.maxsulotId === this.selectKurikMaxsulotlar.maxsulotId).tartibRaqam - 1;
      this.jadvalKurik.splice(idx, 1);
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
      this.apiService.updated<Kurik>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Kurik>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<Kurik>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<Kurik>>(params, this.className)
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
