import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {YozilganSertifikatlar} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  FaoliyatTuri,
  FaoliyatYunalishi,
  FermerXujaligi,
  Massivlar,
  Mfylar,
  Qfylar,
  Tumanlar,
  Viloyatlar,
  Xodimlar
} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

@Component({
  selector: 'app-yozilgan-sertifikatlar',
  templateUrl: './yozilgan-sertifikatlar.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class YozilganSertifikatlarComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'yuridik',
    'jismoniy', 'xodim', 'sertifikatNomer', 'viloyat',
    'qfy', 'massiv', 'mfy', 'tuman', 'fermerXujaligi', 'maxsulot',
    'soni', 'xonadon',];
  filterDocuments: FilterDateDocuments = {};

  yuridiklar = true;
  jismoniylar = false;

  faoliyatTuri: FaoliyatTuri[] = [];
  faoliyatTuriName: FaoliyatTuri;
  faoilyatTuriId: FaoliyatTuri;
  faoliyatYunalishi: FaoliyatYunalishi[] = [];
  faoliyatTunalishiName: FaoliyatYunalishi;

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

  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;

  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: YozilganSertifikatlar;
  reloading = false;
  positionId: string;
  className = 'yozilganSertifikatlar';
  list: YozilganSertifikatlar;
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
      faoliyatTuriId: new FormControl(''),
      faoliyatTuriName: new FormControl(''),
      faoliyatYunalishlariId: new FormControl(''),
      faoliyatYunalishlariName: new FormControl(''),
      sertifikatNomer: new FormControl(''),
      xodimId: new FormControl('', Validators.required),
      xodimName: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
      maxsulot: new FormControl(''),
      soni: new FormControl(0),
    });
    this.getViloyatlar();
    this.getFaoliyatTuri();
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
    const newYozilganSertifikatlar: YozilganSertifikatlar = {
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
      faoliyatTuriId: this.secondFormGroup.value.faoliyatTuriId,
      faoliyatTuriName: this.secondFormGroup.value.faoliyatTuriName,
      faoliyatYunalishlariId: this.secondFormGroup.value.faoliyatYunalishlariId,
      faoliyatYunalishlariName: this.secondFormGroup.value.faoliyatYunalishlariName,
      sertifikatNomer: this.secondFormGroup.value.sertifikatNomer,
      xodimId: this.secondFormGroup.value.xodimId,
      xodimName: this.secondFormGroup.value.xodimName,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
      maxsulot: this.secondFormGroup.value.maxsulot,
      soni: this.secondFormGroup.value.soni
    };
    if (newYozilganSertifikatlar) {
      this.creatAll(newYozilganSertifikatlar);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.secondFormGroup.reset();
      this.EnableButton();
    }
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.tartibRaqamLength = this.totalDocs + 1;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
  }

  addObject() {
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
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
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatTuriName: this.selectedItem.faoliyatTuriName,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        faoliyatYunalishlariName: this.selectedItem.faoliyatYunalishlariName,
        sertifikatNomer: this.selectedItem.sertifikatNomer,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        maxsulot: this.selectedItem.maxsulot,
        soni: this.selectedItem.soni
      });
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
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
      }
      if (this.faoliyatYunalishi.length > 0 && this.selectedItem.faoliyatYunalishlariId) {
        this.faoliyatTunalishiName = this.faoliyatYunalishi.find(x => x._id === this.selectedItem.faoliyatYunalishlariId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimId);
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
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatTuriName: this.selectedItem.faoliyatTuriName,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        faoliyatYunalishlariName: this.selectedItem.faoliyatYunalishlariName,
        sertifikatNomer: this.selectedItem.sertifikatNomer,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        maxsulot: this.selectedItem.maxsulot,
        soni: this.selectedItem.soni
      });
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
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
      }
      if (this.faoliyatYunalishi.length > 0 && this.selectedItem.faoliyatYunalishlariId) {
        this.faoliyatTunalishiName = this.faoliyatYunalishi.find(x => x._id === this.selectedItem.faoliyatYunalishlariId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimId);
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

  getFaoliyatTuri() {
    this.apiService.getAll<FaoliyatTuri>('faoliyatTuri/')
      .subscribe(result => {
        this.faoliyatTuri = result;
      });
    this.faoliyatYunalishi = [];
  }

  getFaoliyatYunalishlari() {
    if (this.faoilyatTuriId) {
      const params = Object.assign({}, {
        allIds: this.faoilyatTuriId._id
      });
      this.apiService.getObjectId<FaoliyatYunalishi[]>(params, '/faoliyatYunalishlari')
        .subscribe(result => {
          this.faoliyatYunalishi = result;
        });
    }
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

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  onChangeFaoliyatTuri(event) {
    if (event) {
      this.secondFormGroup.get('faoliyatTuriId').setValue(event._id);
      this.secondFormGroup.get('faoliyatTuriName').setValue(event.name);
      if (event._id) {
        this.faoilyatTuriId = event;
        this.getFaoliyatYunalishlari();
      }
    } else {
      this.secondFormGroup.get('faoliyatTuriId').setValue('');
      this.secondFormGroup.get('faoliyatTuriName').setValue('');
    }
  }

  onChangeFaoliyatYunalishlari(event) {
    if (event) {
      this.secondFormGroup.get('faoliyatYunalishlariId').setValue(event._id);
      this.secondFormGroup.get('faoliyatYunalishlariName').setValue(event.name);

    } else {
      this.secondFormGroup.get('faoliyatYunalishlariId').setValue('');
      this.secondFormGroup.get('faoliyatYunalishlariName').setValue('');
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

  onChangeXodimlar(event) {
    if (event) {
      this.secondFormGroup.get('xodimId').setValue(event._id);
      this.secondFormGroup.get('xodimName').setValue(event.name);
    } else {
      this.secondFormGroup.get('xodimId').setValue('');
      this.secondFormGroup.get('xodimName').setValue('');
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
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;

    this.tumanlar = [];
    this.massivlar = [];
    this.qfylar = [];
    this.mfylar = [];
    this.fermerXujaligi = [];
    this.faoliyatYunalishi = [];
    this.xodimlar = [];
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
    this.faoliyatTuriName = null;
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

    if (this.selectedItem.faoliyatTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.faoliyatTuriId
      });
      this.apiService.getObjectId<FaoliyatYunalishi[]>(params, '/faoliyatYunalishlari')
        .subscribe(result => {
          this.faoliyatYunalishi = result;
        });
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
      this.apiService.updated<YozilganSertifikatlar>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<YozilganSertifikatlar>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<YozilganSertifikatlar>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<YozilganSertifikatlar>>(params, this.className)
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
