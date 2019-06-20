import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {
  JadvalKarantinRuxsatnomasi,
  JadvalKurik,
  KarantinRuxsatnomasi,
  TranzitYukKurigi
} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Davlatlar, Maxsulotalar,UlchovBirligi, Xodimlar } from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

interface Transport {
  name: string;
}

@Component({
  selector: 'app-tranzit-yuk-kurigi',
  templateUrl: './tranzit-yuk-kurigi.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class TranzitYukKurigiComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana',
    'xodim', 'transportTuri', 'transportNomi',
    'kelganDavlat', 'tashkilot', 'vakil', 'utganDavlat'];

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
  kirdiChiqdi = true;

  karantinRuxsatnomasi: KarantinRuxsatnomasi;

  jadvalKarantinRuxsatnomasi: JadvalKarantinRuxsatnomasi[] = [];
  selectKarantinRuxsatnomasi: JadvalKarantinRuxsatnomasi;

  jadvalKurik: JadvalKurik[] = [];
  selectKurikMaxsulotlar: JadvalKurik;

  yukKelganDavlatlar: Davlatlar[] = [];
  yukKelganDavlatlarName: Davlatlar;
  yukUtganDavlatlar: Davlatlar[] = [];
  yukUtganDavlatlarName: Davlatlar;
  davlatlar: Davlatlar[] = [];
  davlatlarName: Davlatlar;


  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

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
  selectedItem: TranzitYukKurigi;
  reloading = false;
  positionId: string;
  className = 'tranzitYukKurigi';
  list: TranzitYukKurigi;
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
      xodimlarId: new FormControl('', Validators.required),
      xodimlarName: new FormControl(''),
      tashkilot: new FormControl(''),
      vakil: new FormControl(''),
      transportTuri: new FormControl(''),
      transportNomi: new FormControl(''),
      yukKelganDavlatlarId: new FormControl(''),
      yukKelganDavlatlarName: new FormControl(''),
      yukUtganDavlatlarId: new FormControl(''),
      yukUtganDavlatlarName: new FormControl(''),
      kirdiChiqdi: new FormControl(this.kirdiChiqdi),
      xulosaVaTakliflar: new FormControl(''),
      karantinRuxsatnomasiNomer: new FormControl(''),
      ruxsatnomaSanasi: new FormControl(new Date()),
      muddati: new FormControl(new Date()),
      kimga: new FormControl(''),
      utishChegaraPunktlari: new FormControl(''),
      kurikJoyi: new FormControl(''),
      xulosa: new FormControl(''),
      fitosanitarSertifikatSana: new FormControl(new Date()),
      fitosanitarSertifikatNomer: new FormControl(''),
      davlatlarId: new FormControl(0),
      davlatlarName: new FormControl(''),
      tekshirish: new FormControl(this.tekshirish),
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
    const newTranzitYukKurigi: TranzitYukKurigi = {
      tasdiqlash: true,
      tartibRaqam: this.secondFormGroup.value.tartibRaqam,
      sana: this.secondFormGroup.value.sana,
      xodimlarId: this.secondFormGroup.value.xodimlarId,
      xodimlarName: this.secondFormGroup.value.xodimlarName,
      tashkilot: this.secondFormGroup.value.tashkilot,
      vakil: this.secondFormGroup.value.vakil,
      transportTuri: this.secondFormGroup.value.transportTuri,
      transportNomi: this.secondFormGroup.value.transportNomi,
      yukKelganDavlatlarId: this.secondFormGroup.value.yukKelganDavlatlarId,
      yukKelganDavlatlarName: this.secondFormGroup.value.yukKelganDavlatlarName,
      yukUtganDavlatlarId: this.secondFormGroup.value.yukUtganDavlatlarId,
      yukUtganDavlatlarName: this.secondFormGroup.value.yukUtganDavlatlarName,
      kirdiChiqdi: this.secondFormGroup.value.kirdiChiqdi,
      xulosaVaTakliflar: this.secondFormGroup.value.xulosaVaTakliflar,
      jadval: this.jadvalKarantinRuxsatnomasi,
      karantinRuxsatnomasiNomer: this.secondFormGroup.value.karantinRuxsatnomasiNomer,
      ruxsatnomaSanasi: this.secondFormGroup.value.ruxsatnomaSanasi,
      muddati: this.secondFormGroup.value.muddati,
      kimga: this.secondFormGroup.value.kimga,
      utishChegaraPunktlari: this.secondFormGroup.value.utishChegaraPunktlari,
      kurikJoyi: this.secondFormGroup.value.kurikJoyi,
      jadvalKurik: this.jadvalKurik,
      xulosa: this.secondFormGroup.value.xulosa,
      fitosanitarSertifikatSana: this.secondFormGroup.value.fitosanitarSertifikatSana,
      fitosanitarSertifikatNomer: this.secondFormGroup.value.fitosanitarSertifikatNomer,
      davlatlarId: this.secondFormGroup.value.davlatlarId,
      davlatlarName: this.secondFormGroup.value.davlatlarName,
      tekshirish: this.secondFormGroup.value.tekshirish,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId
    };
    if (newTranzitYukKurigi) {
      this.creatAll(newTranzitYukKurigi);
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
    this.secondFormGroup.patchValue({kirdiChiqdi: true});
  }

  addObject() {
    this.xodimlarName = null;
    this.tekshirish = true;
    this.davlatlarName = null;
    this.transportTuriName = null;
    this.yukKelganDavlatlarName = null;
    this.yukUtganDavlatlarName = null;
    this.tekshirish = true;
    this.kirdiChiqdi = true;
    this.jadvalKurik = [];
    this.jadvalKarantinRuxsatnomasi = [];
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
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        tashkilot: this.selectedItem.tashkilot,
        vakil: this.selectedItem.vakil,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        yukKelganDavlatlarId: this.selectedItem.yukKelganDavlatlarId,
        yukKelganDavlatlarName: this.selectedItem.yukKelganDavlatlarName,
        yukUtganDavlatlarId: this.selectedItem.yukUtganDavlatlarId,
        yukUtganDavlatlarName: this.selectedItem.yukUtganDavlatlarName,
        kirdiChiqdi: this.selectedItem.kirdiChiqdi,
        xulosaVaTakliflar: this.selectedItem.xulosaVaTakliflar,
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        ruxsatnomaSanasi: new Date(this.selectedItem.ruxsatnomaSanasi).toISOString().slice(0, 10),
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        kimga: this.selectedItem.kimga,
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        kurikJoyi: this.selectedItem.kurikJoyi,
        xulosa: this.selectedItem.xulosa,
        fitosanitarSertifikatSana: new Date(this.selectedItem.fitosanitarSertifikatSana).toISOString().slice(0, 10),
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        tekshirish: this.selectedItem.tekshirish,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamMaxsulot: this.selectedItem.jadval.length + 1
      });
      this.tekshirish = this.selectedItem.tekshirish;
      this.kirdiChiqdi = this.selectedItem.kirdiChiqdi;
      if (this.selectedItem.jadval.length) {
        this.jadvalKarantinRuxsatnomasi = this.selectedItem.jadval;
      }
      if (this.selectedItem.jadvalKurik.length) {
        this.jadvalKurik = this.selectedItem.jadvalKurik;
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
      }
      if (this.yukKelganDavlatlar.length > 0 && this.selectedItem.yukKelganDavlatlarId) {
        this.yukUtganDavlatlarName = this.yukKelganDavlatlar.find(x => x._id === this.selectedItem.yukKelganDavlatlarId);
      }
      if (this.yukUtganDavlatlar.length > 0 && this.selectedItem.yukUtganDavlatlarId) {
        this.yukUtganDavlatlarName = this.yukUtganDavlatlar.find(x => x._id === this.selectedItem.yukUtganDavlatlarId);
      }
      if (this.transportTuri.length > 0 && this.selectedItem.transportTuri) {
        this.transportTuriName = this.transportTuri.find(x => x.name === this.selectedItem.transportTuri);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
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
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        tashkilot: this.selectedItem.tashkilot,
        vakil: this.selectedItem.vakil,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        yukKelganDavlatlarId: this.selectedItem.yukKelganDavlatlarId,
        yukKelganDavlatlarName: this.selectedItem.yukKelganDavlatlarName,
        yukUtganDavlatlarId: this.selectedItem.yukUtganDavlatlarId,
        yukUtganDavlatlarName: this.selectedItem.yukUtganDavlatlarName,
        kirdiChiqdi: this.selectedItem.kirdiChiqdi,
        xulosaVaTakliflar: this.selectedItem.xulosaVaTakliflar,
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        ruxsatnomaSanasi: new Date(this.selectedItem.ruxsatnomaSanasi).toISOString().slice(0, 10),
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        kimga: this.selectedItem.kimga,
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        kurikJoyi: this.selectedItem.kurikJoyi,
        xulosa: this.selectedItem.xulosa,
        fitosanitarSertifikatSana: new Date(this.selectedItem.fitosanitarSertifikatSana).toISOString().slice(0, 10),
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        tekshirish: this.selectedItem.tekshirish,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamMaxsulot: this.selectedItem.jadval.length + 1
      });
      this.tekshirish = this.selectedItem.tekshirish;
      this.kirdiChiqdi = this.selectedItem.kirdiChiqdi;
      if (this.selectedItem.jadval.length) {
        this.jadvalKarantinRuxsatnomasi = this.selectedItem.jadval;
      }
      if (this.selectedItem.jadvalKurik.length) {
        this.jadvalKurik = this.selectedItem.jadvalKurik;
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
      }
      if (this.yukKelganDavlatlar.length > 0 && this.selectedItem.yukKelganDavlatlarId) {
        this.yukUtganDavlatlarName = this.yukKelganDavlatlar.find(x => x._id === this.selectedItem.yukKelganDavlatlarId);
      }
      if (this.yukUtganDavlatlar.length > 0 && this.selectedItem.yukUtganDavlatlarId) {
        this.yukUtganDavlatlarName = this.yukUtganDavlatlar.find(x => x._id === this.selectedItem.yukUtganDavlatlarId);
      }
      if (this.transportTuri.length > 0 && this.selectedItem.transportTuri) {
        this.transportTuriName = this.transportTuri.find(x => x.name === this.selectedItem.transportTuri);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
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
    this.xodimlarName = null;
    this.tekshirish = true;
    this.davlatlarName = null;
    this.transportTuriName = null;
    this.yukKelganDavlatlarName = null;
    this.yukUtganDavlatlarName = null;
    this.tekshirish = true;
    this.kirdiChiqdi = true;
    this.jadvalKurik = [];
    this.jadvalKarantinRuxsatnomasi = [];
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
        this.yukKelganDavlatlar = result;
        this.yukUtganDavlatlar = result;
      });
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
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

  onChangeKarantinRuxsatnomaNomeri(event) {
    if (event) {
      const params = Object.assign({}, {
        karantinRuxsatnomasiNomer: event.target.value,
      });
      this.apiService.getKarantinRuxsatnomasi<KarantinRuxsatnomasi>(params, '/karantinRuxsatnomasi')
        .subscribe(result => {
          this.karantinRuxsatnomasi = result;
          if (this.karantinRuxsatnomasi) {
            this.secondFormGroup.patchValue({
              ruxsatnomaSanasi: new Date(this.karantinRuxsatnomasi.sana).toISOString().slice(0, 10),
              kimga: this.karantinRuxsatnomasi.kimga,
              utishChegaraPunktlari: this.karantinRuxsatnomasi.utishChegaraPunktlari,
              kurikJoyi: this.karantinRuxsatnomasi.kurikJoyi,
              muddati: new Date(this.karantinRuxsatnomasi.muddati).toISOString().slice(0, 10),
            });
            this.jadvalKarantinRuxsatnomasi = this.karantinRuxsatnomasi.jadval;
          } else {
            this.openSnackBar('Бундай рақамлик карантин рухсатномаси мавжуд эмас!', 'Хатолик!', 5);
            this.secondFormGroup.patchValue({
              karantinRuxsatnomasiNomer: '',
              ruxsatnomaSanasi: '',
              kimga: '',
              utishChegaraPunktlari: '',
              kurikJoyi: '',
              muddati: '',
            });
            this.jadvalKarantinRuxsatnomasi = [];

          }
        });

    } else {
      this.secondFormGroup.get('faoliyatYunalishlariId').setValue('');
      this.secondFormGroup.get('faoliyatYunalishlariName').setValue('');
    }
  }

  onChangeKelganDavlatlar(event) {
    if (event) {
      this.secondFormGroup.get('yukKelganDavlatlarId').setValue(event._id);
      this.secondFormGroup.get('yukKelganDavlatlarName').setValue(event.name);
    } else {
      this.secondFormGroup.get('yukKelganDavlatlarId').setValue('');
      this.secondFormGroup.get('yukKelganDavlatlarName').setValue('');
    }
  }

  onChangeUtganDavlatlar(event) {
    if (event) {
      this.secondFormGroup.get('yukUtganDavlatlarId').setValue(event._id);
      this.secondFormGroup.get('yukUtganDavlatlarName').setValue(event.name);
    } else {
      this.secondFormGroup.get('yukUtganDavlatlarId').setValue('');
      this.secondFormGroup.get('yukUtganDavlatlarName').setValue('');
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

  onChangeRadioButton2(event) {
    this.secondFormGroup.get('kirdiChiqdi').setValue(event.value);
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

  onCloseForm() {
    this.xodimlarName = null;
    this.tekshirish = true;
    this.davlatlarName = null;
    this.transportTuriName = null;
    this.yukKelganDavlatlarName = null;
    this.yukUtganDavlatlarName = null;
    this.tekshirish = true;
    this.kirdiChiqdi = true;
    this.jadvalKurik = [];
    this.jadvalKarantinRuxsatnomasi = [];
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
    this.kirdiChiqdi = this.selectedItem.kirdiChiqdi;
    this.positionId = row._id;
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
    this.secondFormGroup.patchValue({tartibRaqamMaxsulot: 1});
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
      this.apiService.updated<TranzitYukKurigi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<TranzitYukKurigi>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<TranzitYukKurigi>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<TranzitYukKurigi>>(params, this.className)
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
