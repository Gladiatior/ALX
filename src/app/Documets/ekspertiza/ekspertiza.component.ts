import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Ekspertiza, JadvalKarantinRuxsatnomasi, KarantinRuxsatnomasi, PlanKiritish} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Davlatlar, Xodimlar} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

interface Transport {
  name: string;
}

@Component({
  selector: 'app-ekspertiza',
  templateUrl: './ekspertiza.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class EkspertizaComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'xodim',
    'ruxsatnomaNomer', 'ruxsatnomaSana', 'kimga',
    'muddati', 'kurikJoyi', 'utishChegaraPunktlari',
    'firosanitarSertifikatSana', 'firosanitarSertifikatNomer'];

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

  karantinRuxsatnomasi: KarantinRuxsatnomasi;

  jadvalKarantinRuxsatnomasi: JadvalKarantinRuxsatnomasi[] = [];
  selectMaxsulotlar: JadvalKarantinRuxsatnomasi;

  davlatlar: Davlatlar[] = [];
  davlatlarName: Davlatlar;

  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;

  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: Ekspertiza;
  reloading = false;
  positionId: string;
  className = 'ekspertiza';
  list: Ekspertiza;
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
      });
    }
    this.firstFormGroup = new FormGroup({
      firstCtrl: new FormControl(this.page)
    });
    this.secondFormGroup = new FormGroup({
      tasdiqlash: new FormControl(false, Validators.required),
      tartibRaqam: new FormControl(1, Validators.required),
      sana: new FormControl(new Date().toISOString().slice(0, 10), Validators.required),
      xodimlarId: new FormControl(''),
      xodimlarName: new FormControl(''),
      karantinRuxsatnomasiNomer: new FormControl(''),
      ruxsatnomaSanasi: new FormControl(new Date()),
      kimga: new FormControl(''),
      utishChegaraPunktlari: new FormControl(''),
      kurikJoyi: new FormControl(''),
      muddati: new FormControl(''),
      fitosanitarSertifikatNomer: new FormControl(''),
      fitosanitarSertifikatSana: new FormControl(new Date()),
      davlatlarId: new FormControl(''),
      davlatlarName: new FormControl(''),
      tekshirish: new FormControl(this.tekshirish),
      transportTuri: new FormControl(''),
      transportNomi: new FormControl(''),
      xulosa: new FormControl(''),
      foydalanuvchiId: new FormControl(new Date()),

    });
    this.getDavlatlar();
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
    const newEkspertiza: Ekspertiza = {
      tasdiqlash: true,
      tartibRaqam: this.secondFormGroup.value.tartibRaqam,
      sana: this.secondFormGroup.value.sana,
      xodimlarId: this.secondFormGroup.value.xodimlarId,
      xodimlarName: this.secondFormGroup.value.xodimlarName,
      karantinRuxsatnomasiNomer: this.secondFormGroup.value.karantinRuxsatnomasiNomer,
      ruxsatnomaSanasi: this.secondFormGroup.value.ruxsatnomaSanasi,
      kimga: this.secondFormGroup.value.kimga,
      utishChegaraPunktlari: this.secondFormGroup.value.utishChegaraPunktlari,
      kurikJoyi: this.secondFormGroup.value.kurikJoyi,
      muddati: this.secondFormGroup.value.muddati,
      jadval: this.jadvalKarantinRuxsatnomasi,
      fitosanitarSertifikatNomer: this.secondFormGroup.value.fitosanitarSertifikatNomer,
      fitosanitarSertifikatSana: this.secondFormGroup.value.fitosanitarSertifikatSana,
      davlatlarId: this.secondFormGroup.value.davlatlarId,
      davlatlarName: this.secondFormGroup.value.davlatlarName,
      tekshirish: this.secondFormGroup.value.tekshirish,
      transportTuri: this.secondFormGroup.value.transportTuri,
      transportNomi: this.secondFormGroup.value.transportNomi,
      xulosa: this.secondFormGroup.value.xulosa,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,

    };
    if (newEkspertiza) {
      this.creatAll(newEkspertiza);
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
    this.davlatlarName = null;
    this.xodimlarName = null;
    this.jadvalKarantinRuxsatnomasi= [];
    this.tekshirish = true;
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
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        ruxsatnomaSanasi: new Date(this.selectedItem.ruxsatnomaSanasi).toISOString().slice(0, 10),
        kimga: this.selectedItem.kimga,
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        kurikJoyi: this.selectedItem.kurikJoyi,
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        jadval: this.selectedItem.jadval,
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        fitosanitarSertifikatSana: new Date(this.selectedItem.fitosanitarSertifikatSana).toISOString().slice(0, 10),
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        tekshirish: this.selectedItem.tekshirish,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        xulosa: this.selectedItem.xulosa,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
      });
      this.tekshirish = this.selectedItem.tekshirish;
      if (this.selectedItem.jadval) {
        this.jadvalKarantinRuxsatnomasi = this.selectedItem.jadval;
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
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
        karantinRuxsatnomasiNomer: this.selectedItem.karantinRuxsatnomasiNomer,
        ruxsatnomaSanasi: new Date(this.selectedItem.ruxsatnomaSanasi).toISOString().slice(0, 10),
        kimga: this.selectedItem.kimga,
        utishChegaraPunktlari: this.selectedItem.utishChegaraPunktlari,
        kurikJoyi: this.selectedItem.kurikJoyi,
        muddati: new Date(this.selectedItem.muddati).toISOString().slice(0, 10),
        jadval: this.selectedItem.jadval,
        fitosanitarSertifikatNomer: this.selectedItem.fitosanitarSertifikatNomer,
        fitosanitarSertifikatSana: new Date(this.selectedItem.fitosanitarSertifikatSana).toISOString().slice(0, 10),
        davlatlarId: this.selectedItem.davlatlarId,
        davlatlarName: this.selectedItem.davlatlarName,
        tekshirish: this.selectedItem.tekshirish,
        transportTuri: this.selectedItem.transportTuri,
        transportNomi: this.selectedItem.transportNomi,
        xulosa: this.selectedItem.xulosa,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
      });
      this.tekshirish = this.selectedItem.tekshirish;
      if (this.selectedItem.jadval) {
        this.jadvalKarantinRuxsatnomasi = this.selectedItem.jadval;
      }
      if (this.davlatlar.length > 0 && this.selectedItem.davlatlarId) {
        this.davlatlarName = this.davlatlar.find(x => x._id === this.selectedItem.davlatlarId);
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
    this.filterDocuments = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.xodimlarName = null;
    this.jadvalKarantinRuxsatnomasi= [];
    this.tekshirish = false;
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
    } else {
      this.secondFormGroup.get('davlatlarId').setValue('');
      this.secondFormGroup.get('davlatlarName').setValue('');
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
    this.davlatlarName = null;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.closeObject();
    this.stepperRef.previous();
  }

  onPrintForm(cmpName) {
    const printContent = document.getElementById(cmpName);
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  selectedTumanAndMassiv(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.tekshirish = this.selectedItem.tekshirish;
    this.positionId = row._id;
    this.EnableButton();
  }

  selectedJadval(jadvalMaxsulot) {
    this.selectMaxsulotlar = jadvalMaxsulot;
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
      this.apiService.updated<Ekspertiza>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Ekspertiza>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<Ekspertiza>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<Ekspertiza>>(params, this.className)
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
