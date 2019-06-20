import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {JadvalKarantinRuxsatnomasi, KarantinRuxsatnomasi,} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  Davlatlar,
  FermerXujaligi,
  Massivlar, Maxsulotalar,
  Mfylar,
  Qfylar,
  Tumanlar, UlchovBirligi,
  Viloyatlar
} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

@Component({
  selector: 'app-karantin-ruxsatnomasi',
  templateUrl: './karantin-ruxsatnomasi.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class KarantinRuxsatnomasiComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'yuridik',
    'jismoniy', 'karantinRuxsatnomasiNomer', 'kimga',
    'muddati', 'kurikJoyi', 'utishChegaraPunktlari'];

  filterDocuments: FilterDateDocuments = {};

  yuridiklar = true;
  jismoniylar = false;

  jadvalKarantinRuxsatnomasi: JadvalKarantinRuxsatnomasi[] = [];
  selectMaxsulotlar: JadvalKarantinRuxsatnomasi;

  davlatlar: Davlatlar[] = [];
  davlatlarName: Davlatlar;

  maxsulotlar: Maxsulotalar[] = [];
  maxsulotlarName: Maxsulotalar;

  ulchovBirligi: UlchovBirligi[] = [];
  ulchovBirligiName: UlchovBirligi;

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

  qfylar: Qfylar[] = [];
  qfylarName: Qfylar;
  qfylarId: Qfylar;
  mfylar: Mfylar[] = [];
  mfylarName: Mfylar;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;

  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: KarantinRuxsatnomasi;
  reloading = false;
  positionId: string;
  className = 'karantinRuxsatnomasi';
  list: KarantinRuxsatnomasi;
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
      qfyId: new FormControl(''),
      qfyName: new FormControl(''),
      mfyId: new FormControl(''),
      mfyName: new FormControl(''),
      xonadon: new FormControl(''),
      kimga: new FormControl(''),
      kurikJoyi: new FormControl(''),
      karantinRuxsatnomasiNomer: new FormControl(''),
      muddati: new FormControl(new Date()),
      utishChegaraPunktlari: new FormControl(''),
      davlatlarId: new FormControl(''),
      davlatlarName: new FormControl(''),
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
    this.getAll();
  }

  backTable() {
    this.stepperRef.previous();
  }

  backForm() {
    this.stepperRef.next();
  }

  onSubmit() {
    const newKarantinRuxsatnomasi: KarantinRuxsatnomasi = {
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
      qfyId: this.secondFormGroup.value.qfyId,
      qfyName: this.secondFormGroup.value.qfyName,
      mfyId: this.secondFormGroup.value.mfyId,
      mfyName: this.secondFormGroup.value.mfyName,
      xonadon: this.secondFormGroup.value.xonadon,
      kimga: this.secondFormGroup.value.kimga,
      kurikJoyi: this.secondFormGroup.value.kurikJoyi,
      karantinRuxsatnomasiNomer: this.secondFormGroup.value.karantinRuxsatnomasiNomer,
      muddati: this.secondFormGroup.value.muddati,
      utishChegaraPunktlari: this.secondFormGroup.value.utishChegaraPunktlari,
      davlatlarId: this.secondFormGroup.value.davlatlarId,
      davlatlarName: this.secondFormGroup.value.davlatlarName,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
      jadval: this.jadvalKarantinRuxsatnomasi,
    };
    if (newKarantinRuxsatnomasi) {
      this.creatAll(newKarantinRuxsatnomasi);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.secondFormGroup.reset();
      this.EnableButton();
    }
    this.davlatlarName = null;
    this.maxsulotlarName = null;
    this.ulchovBirligiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.fermerXujaligiName = null;
    this.tartibRaqamLength = this.totalDocs + 1;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
  }

  addObject() {
    this.davlatlarName = null;
    this.maxsulotlarName = null;
    this.ulchovBirligiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.fermerXujaligiName = null;
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
        qfyId: this.selectedItem.qfyId,
        qfyName: this.selectedItem.qfyName,
        mfyId: this.selectedItem.mfyId,
        mfyName: this.selectedItem.mfyName,
        xonadon: this.selectedItem.xonadon,
        kimga: this.selectedItem.kimga,
        kurikJoyi: this.selectedItem.kurikJoyi,
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamMaxsulot: this.selectedItem.jadval.length + 1
      });
      if (this.selectedItem.jadval) {
        this.jadvalKarantinRuxsatnomasi = this.selectedItem.jadval;
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
      if (this.qfylar.length > 0 && this.selectedItem.qfyId) {
        this.qfylarName = this.qfylar.find(x => x._id === this.selectedItem.qfyId);
      }
      if (this.mfylar.length > 0 && this.selectedItem.mfyId) {
        this.mfylarName = this.mfylar.find(x => x._id === this.selectedItem.mfyId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
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
        qfyId: this.selectedItem.qfyId,
        qfyName: this.selectedItem.qfyName,
        mfyId: this.selectedItem.mfyId,
        mfyName: this.selectedItem.mfyName,
        xonadon: this.selectedItem.xonadon,
        kimga: this.selectedItem.kimga,
        kurikJoyi: this.selectedItem.kurikJoyi,
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        tartibRaqamMaxsulot: this.selectedItem.jadval.length + 1
      });
      if (this.selectedItem.jadval) {
        this.jadvalKarantinRuxsatnomasi = this.selectedItem.jadval;
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
      if (this.qfylar.length > 0 && this.selectedItem.qfyId) {
        this.qfylarName = this.qfylar.find(x => x._id === this.selectedItem.qfyId);
      }
      if (this.mfylar.length > 0 && this.selectedItem.mfyId) {
        this.mfylarName = this.mfylar.find(x => x._id === this.selectedItem.mfyId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
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
    this.stepperRef.previous();
  }

  getDavlatlar() {
    this.apiService.getAll<Davlatlar>('davlatlar/')
      .subscribe(result => {
        this.davlatlar = result;
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

  getQfylar() {
    if (this.tumanlarId) {
      const params = Object.assign({}, {
        allIds: this.tumanlarId._id
      });
      this.apiService.getObjectId<Qfylar[]>(params, '/qfylar')
        .subscribe(result => {
          this.qfylar = result;
        });
      this.mfylar = [];
    }
  }

  getMfylar() {
    if (this.qfylarId) {
      const params = Object.assign({}, {
        allIds: this.qfylarId._id
      });
      this.apiService.getObjectId<Mfylar[]>(params, '/mfylar')
        .subscribe(result => {
          this.mfylar = result;
        });
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

  onChangeDavlatlar(event) {
    if (event) {
      this.secondFormGroup.get('davlatlarId').setValue(event._id);
      this.secondFormGroup.get('davlatlarName').setValue(event.name);
    } else {
      this.secondFormGroup.get('davlatlarId').setValue('');
      this.secondFormGroup.get('davlatlarName').setValue('');
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
        this.getQfylar();
      }
    } else {
      this.secondFormGroup.get('tumanId').setValue('');
      this.secondFormGroup.get('tumanName').setValue('');
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

  onChangeQfylar(event) {
    if (event) {
      this.secondFormGroup.get('qfyId').setValue(event._id);
      this.secondFormGroup.get('qfyName').setValue(event.name);
      if (event._id) {
        this.qfylarId = event;
        this.getMfylar();
      }
    } else {
      this.secondFormGroup.get('qfyId').setValue('');
      this.secondFormGroup.get('qfyName').setValue('');
    }
  }

  onChangeMfylar(event) {
    if (event) {
      this.secondFormGroup.get('mfyId').setValue(event._id);
      this.secondFormGroup.get('mfyName').setValue(event.name);
    } else {
      this.secondFormGroup.get('mfyId').setValue('');
      this.secondFormGroup.get('mfyName').setValue('');
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

  onChangeJismoniylar() {
    this.yuridiklar = false;
    this.massivlarName = null;
    this.fermerXujaligi = null;
    this.secondFormGroup.get('raxbari').setValue('');
  }

  onChangeYuridiklar() {
    this.jismoniylar = false;
    this.qfylarName = null;
    this.mfylar = null;
    this.secondFormGroup.get('xonadon').setValue('');

  }

  onCloseForm() {
    this.davlatlarName = null;
    this.maxsulotlarName = null;
    this.ulchovBirligiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.fermerXujaligiName = null;

    this.tumanlar = [];
    this.massivlar = [];
    this.qfylar = [];
    this.mfylar = [];
    this.fermerXujaligi = [];
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

    if (this.selectedItem.tumanId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.tumanId
      });
      this.apiService.getObjectId<Qfylar[]>(params, '/qfylar')
        .subscribe(result => {
          this.qfylar = result;
        });
    }

    if (this.selectedItem.qfyId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.qfyId
      });
      this.apiService.getObjectId<Mfylar[]>(params, '/mfylar')
        .subscribe(result => {
          this.mfylar = result;
        });
    } else {
      this.mfylar = [];
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
    this.positionId = null;
    this.DisableButton();

  }

  selectedRow(row) {
    this.selectedItem = row;
    this.positionId = row._id;
    this.secondFormGroup.reset();
    this.EnableButton();
  }

  selectedJadval(jadvalMaxsulot) {
    this.selectMaxsulotlar = jadvalMaxsulot;
  }

  adder() {
    const idx = this.jadvalKarantinRuxsatnomasi.find(p => p.maxsulotId === this.secondFormGroup.value.maxsulotId);
    if (idx) {
      this.openSnackBar(`${this.secondFormGroup.value.maxsulotName}${'номли бланка киритилган, бир хил бланка киритиш мумкин эмас!'}`, 'Хатолик', 3);
      return;
    }
    this.jadvalKarantinRuxsatnomasi.push(
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
    this.secondFormGroup.patchValue({
      tartibRaqamMaxsulot: this.jadvalKarantinRuxsatnomasi.length + 1,
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
    if (this.selectMaxsulotlar) {
      this.secondFormGroup.patchValue({
        tartibRaqamMaxsulot: this.selectMaxsulotlar.tartibRaqam,
        maxsulotId: this.selectMaxsulotlar.maxsulotId,
        maxsulotName: this.selectMaxsulotlar.maxsulotName,
        botanikNomi: this.selectMaxsulotlar.botanikNomi,
        TIFTNKODI: this.selectMaxsulotlar.TIFTNKODI,
        ulchovBirligiId: this.selectMaxsulotlar.ulchovBirligiId,
        ulchovBirligiName: this.selectMaxsulotlar.ulchovBirligiName,
        soni: this.selectMaxsulotlar.soni,
      });
      if (this.maxsulotlar.length > 0 && this.selectMaxsulotlar.maxsulotId) {
        this.maxsulotlarName = this.maxsulotlar.find(x => x._id === this.selectMaxsulotlar.maxsulotId);
      }
      if (this.ulchovBirligi.length > 0 && this.selectMaxsulotlar.ulchovBirligiId) {
        this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === this.selectMaxsulotlar.ulchovBirligiId);
      }
    }
  }

  deleteJadval() {
    if (this.selectMaxsulotlar) {
      const idx = this.jadvalKarantinRuxsatnomasi.find(p => p.maxsulotId === this.selectMaxsulotlar.maxsulotId).tartibRaqam - 1;
      this.jadvalKarantinRuxsatnomasi.splice(idx, 1);
    }
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
      this.apiService.updated<KarantinRuxsatnomasi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<KarantinRuxsatnomasi>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<KarantinRuxsatnomasi>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<KarantinRuxsatnomasi>>(params, this.className)
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
