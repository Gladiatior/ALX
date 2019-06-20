import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {LavozimniUzgartirishBuyrugi} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Bulimlar, Bulinmalar, Lavozimlar, Tashkilotlar, Xodimlar} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

@Component({
  selector: 'app-lavozimni-uzgartirish-buyrugi',
  templateUrl: './lavozimni-uzgartirish-buyrugi.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class LavozimniUzgartirishBuyrugiComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'xodim',
    'ishgaKirganSana', 'lavozim', 'tashkilot', 'bulim', 'bulinma'];
  filterDocuments: FilterDateDocuments = {};

  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

  lavozimlar: Lavozimlar[] = [];
  lavozimlarName: Lavozimlar;
  eskiLavozimlar: Lavozimlar[] = [];
  eskiLavozimlarName: Lavozimlar;

  bulimlar: Bulimlar[] = [];
  bulimlarName: Bulimlar;
  eskiBulimlar: Bulimlar[] = [];
  eskiBulimlarName: Bulimlar;

  bulinmalar: Bulinmalar[] = [];
  bulinmalarName: Bulinmalar;
  eskiBulinmalar: Bulinmalar[] = [];
  eskiBulinmalarName: Bulinmalar;

  tashkilotlar: Tashkilotlar[] = [];
  tashkilotlarName: Tashkilotlar;
  eskiTashkilotlar: Tashkilotlar[] = [];
  eskiTashkilotlarName: Tashkilotlar;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;

  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: LavozimniUzgartirishBuyrugi;
  reloading = false;
  positionId: string;
  className = 'lavozimniUzgartirishBuyrugi';
  list: LavozimniUzgartirishBuyrugi;
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
      xodimlarName: new FormControl('', Validators.required),
      ishgaKirganSana: new FormControl(new Date()),
      ishdanKetganSana: new FormControl(new Date()),
      lavozimlarId: new FormControl(''),
      lavozimlarName: new FormControl(''),
      tashkilotlarId: new FormControl(''),
      tashkilotlarName: new FormControl(''),
      bulimlarId: new FormControl(''),
      bulimlarName: new FormControl(''),
      bulinmalarId: new FormControl(''),
      bulinmalarName: new FormControl(''),
      eskiLavozimlarId: new FormControl(''),
      eskiLavozimlarName: new FormControl(''),
      eskiTashkilotlarId: new FormControl(''),
      eskiTashkilotlarName: new FormControl(''),
      eskiBulimlarId: new FormControl(''),
      eskiBulimlarName: new FormControl(''),
      eskiBulinmalarId: new FormControl(''),
      eskiBulinmalarName: new FormControl(''),
    });
    this.getBulimlar();
    this.getLavozimlar();
    this.getBulinmalar();
    this.getTashkilotlar();
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
    const newLavozimniUzgartirishBuyrugi: LavozimniUzgartirishBuyrugi = {
      tasdiqlash: true,
      tartibRaqam: this.secondFormGroup.value.tartibRaqam,
      sana: this.secondFormGroup.value.sana,
      xodimlarId: this.secondFormGroup.value.xodimlarId,
      xodimlarName: this.secondFormGroup.value.xodimlarName,
      ishgaKirganSana: this.secondFormGroup.value.ishgaKirganSana,
      ishdanKetganSana: this.secondFormGroup.value.ishdanKetganSana,
      lavozimlarId: this.secondFormGroup.value.lavozimlarId,
      lavozimlarName: this.secondFormGroup.value.lavozimlarName,
      tashkilotlarId: this.secondFormGroup.value.tashkilotlarId,
      tashkilotlarName: this.secondFormGroup.value.tashkilotlarName,
      bulimlarId: this.secondFormGroup.value.bulimlarId,
      bulimlarName: this.secondFormGroup.value.bulimlarName,
      bulinmalarId: this.secondFormGroup.value.bulinmalarId,
      bulinmalarName: this.secondFormGroup.value.bulinmalarName,
      eskiLavozimlarId: this.secondFormGroup.value.eskiLavozimlarId,
      eskiLavozimlarName: this.secondFormGroup.value.eskiLavozimlarName,
      eskiTashkilotlarId: this.secondFormGroup.value.eskiTashkilotlarId,
      eskiTashkilotlarName: this.secondFormGroup.value.eskiTashkilotlarName,
      eskiBulimlarId: this.secondFormGroup.value.eskiBulimlarId,
      eskiBulimlarName: this.secondFormGroup.value.eskiBulimlarName,
      eskiBulinmalarId: this.secondFormGroup.value.eskiBulinmalarId,
      eskiBulinmalarName: this.secondFormGroup.value.eskiBulinmalarName,
    };
    if (newLavozimniUzgartirishBuyrugi) {
      this.creatAll(newLavozimniUzgartirishBuyrugi);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.secondFormGroup.reset();
      this.EnableButton();
    }
    this.xodimlarName = null;
    this.lavozimlarName = null;
    this.eskiLavozimlarName = null;
    this.tashkilotlarName = null;
    this.eskiTashkilotlarName = null;
    this.bulimlarName = null;
    this.eskiBulimlarName = null;
    this.bulinmalarName = null;
    this.eskiBulinmalarName = null;
  }

  addObject() {
    this.xodimlarName = null;
    this.lavozimlarName = null;
    this.eskiLavozimlarName = null;
    this.tashkilotlarName = null;
    this.eskiTashkilotlarName = null;
    this.bulimlarName = null;
    this.eskiBulimlarName = null;
    this.bulinmalarName = null;
    this.eskiBulinmalarName = null;
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
        ishgaKirganSana: new Date(this.selectedItem.ishgaKirganSana).toISOString().slice(0, 10),
        ishdanKetganSana: new Date(this.selectedItem.ishdanKetganSana).toISOString().slice(0, 10),
        lavozimlarId: this.selectedItem.lavozimlarId,
        lavozimlarName: this.selectedItem.lavozimlarName,
        tashkilotlarId: this.selectedItem.tashkilotlarId,
        tashkilotlarName: this.selectedItem.tashkilotlarName,
        bulimlarId: this.selectedItem.bulimlarId,
        bulimlarName: this.selectedItem.bulimlarName,
        bulinmalarId: this.selectedItem.bulinmalarId,
        bulinmalarName: this.selectedItem.bulinmalarName,
        eskiLavozimlarId: this.selectedItem.eskiLavozimlarId,
        eskiLavozimlarName: this.selectedItem.eskiLavozimlarName,
        eskiTashkilotlarId: this.selectedItem.eskiTashkilotlarId,
        eskiTashkilotlarName: this.selectedItem.eskiTashkilotlarName,
        eskiBulimlarId: this.selectedItem.eskiBulimlarId,
        eskiBulimlarName: this.selectedItem.eskiBulimlarName,
        eskiBulinmalarId: this.selectedItem.eskiBulinmalarId,
        eskiBulinmalarName: this.selectedItem.eskiBulinmalarName,
      });
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
      }
      if (this.lavozimlar.length > 0 && this.selectedItem.lavozimlarId) {
        this.lavozimlarName = this.lavozimlar.find(x => x._id === this.selectedItem.lavozimlarId);
      }
      if (this.eskiLavozimlar.length > 0 && this.selectedItem.eskiLavozimlarId) {
        this.eskiLavozimlarName = this.eskiLavozimlar.find(x => x._id === this.selectedItem.eskiLavozimlarId);
      }
      if (this.tashkilotlar.length > 0 && this.selectedItem.tashkilotlarId) {
        this.tashkilotlarName = this.tashkilotlar.find(x => x._id === this.selectedItem.tashkilotlarId);
      }
      if (this.eskiTashkilotlar.length > 0 && this.selectedItem.eskiTashkilotlarId) {
        this.eskiTashkilotlarName = this.eskiTashkilotlar.find(x => x._id === this.selectedItem.eskiTashkilotlarId);
      }
      if (this.bulimlar.length > 0 && this.selectedItem.bulimlarId) {
        this.bulimlarName = this.bulimlar.find(x => x._id === this.selectedItem.bulimlarId);
      }
      if (this.eskiBulimlar.length > 0 && this.selectedItem.eskiBulimlarId) {
        this.eskiBulimlarName = this.eskiBulimlar.find(x => x._id === this.selectedItem.eskiBulimlarId);
      }
      if (this.bulinmalar.length > 0 && this.selectedItem.bulinmalarId) {
        this.bulinmalarName = this.bulinmalar.find(x => x._id === this.selectedItem.bulinmalarId);
      }
      if (this.eskiBulinmalar.length > 0 && this.selectedItem.eskiBulinmalarId) {
        this.eskiBulinmalarName = this.eskiBulinmalar.find(x => x._id === this.selectedItem.eskiBulinmalarId);
      }
      this.DisableButton();
      this.stepperRef.next();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  copyObject() {
    if (this.selectedItem) {
      this.secondFormGroup.reset();
      this.secondFormGroup.patchValue({
        tartibRaqam: this.totalDocs + 1,
        tasdiqlash: this.selectedItem.tasdiqlash,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0, 10),
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        ishgaKirganSana: new Date(this.selectedItem.ishgaKirganSana).toISOString().slice(0, 10),
        ishdanKetganSana: new Date(this.selectedItem.ishdanKetganSana).toISOString().slice(0, 10),
        lavozimlarId: this.selectedItem.lavozimlarId,
        lavozimlarName: this.selectedItem.lavozimlarName,
        tashkilotlarId: this.selectedItem.tashkilotlarId,
        tashkilotlarName: this.selectedItem.tashkilotlarName,
        bulimlarId: this.selectedItem.bulimlarId,
        bulimlarName: this.selectedItem.bulimlarName,
        bulinmalarId: this.selectedItem.bulinmalarId,
        bulinmalarName: this.selectedItem.bulinmalarName,
        eskiLavozimlarId: this.selectedItem.eskiLavozimlarId,
        eskiLavozimlarName: this.selectedItem.eskiLavozimlarName,
        eskiTashkilotlarId: this.selectedItem.eskiTashkilotlarId,
        eskiTashkilotlarName: this.selectedItem.eskiTashkilotlarName,
        eskiBulimlarId: this.selectedItem.eskiBulimlarId,
        eskiBulimlarName: this.selectedItem.eskiBulimlarName,
        eskiBulinmalarId: this.selectedItem.eskiBulinmalarId,
        eskiBulinmalarName: this.selectedItem.eskiBulinmalarName,
      });
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x.name === this.selectedItem.xodimlarId);
      }
      if (this.lavozimlar.length > 0 && this.selectedItem.lavozimlarId) {
        this.lavozimlarName = this.lavozimlar.find(x => x._id === this.selectedItem.lavozimlarId);
      }
      if (this.eskiLavozimlar.length > 0 && this.selectedItem.eskiLavozimlarId) {
        this.eskiLavozimlarName = this.eskiLavozimlar.find(x => x._id === this.selectedItem.eskiLavozimlarId);
      }
      if (this.tashkilotlar.length > 0 && this.selectedItem.tashkilotlarId) {
        this.tashkilotlarName = this.tashkilotlar.find(x => x._id === this.selectedItem.tashkilotlarId);
      }
      if (this.eskiTashkilotlar.length > 0 && this.selectedItem.eskiTashkilotlarId) {
        this.eskiTashkilotlarName = this.eskiTashkilotlar.find(x => x._id === this.selectedItem.eskiTashkilotlarId);
      }
      if (this.bulimlar.length > 0 && this.selectedItem.bulimlarId) {
        this.bulimlarName = this.bulimlar.find(x => x._id === this.selectedItem.bulimlarId);
      }
      if (this.eskiBulimlar.length > 0 && this.selectedItem.eskiBulinmalarId) {
        this.eskiBulimlarName = this.eskiBulimlar.find(x => x._id === this.selectedItem.eskiBulinmalarId);
      }
      if (this.bulinmalar.length > 0 && this.selectedItem.bulinmalarId) {
        this.bulinmalarName = this.bulinmalar.find(x => x._id === this.selectedItem.bulinmalarId);
      }
      if (this.eskiBulinmalar.length > 0 && this.selectedItem.eskiBulinmalarId) {
        this.eskiBulimlarName = this.eskiBulinmalar.find(x => x._id === this.selectedItem.eskiBulinmalarId);
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
    this.lavozimlarName = null;
    this.eskiLavozimlarName = null;
    this.tashkilotlarName = null;
    this.eskiTashkilotlarName = null;
    this.bulimlarName = null;
    this.eskiBulimlarName = null;
    this.bulinmalarName = null;
    this.eskiBulinmalarName = null;
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.stepperRef.previous();
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  getLavozimlar() {
    this.apiService.getAll<Lavozimlar>('lavozimlar/')
      .subscribe(result => {
        this.lavozimlar = result;
        this.eskiLavozimlar = result;
      });
  }

  getTashkilotlar() {
    this.apiService.getAll<Tashkilotlar>('tashkilotlar/')
      .subscribe(result => {
        this.tashkilotlar = result;
        this.eskiTashkilotlar = result;
      });
  }

  getBulimlar() {
    this.apiService.getAll<Bulimlar>('bulimlar/')
      .subscribe(result => {
        this.bulimlar = result;
        this.eskiBulimlar = result;
      });
  }

  getBulinmalar() {
    this.apiService.getAll<Bulinmalar>('bulinmalar/')
      .subscribe(result => {
        this.bulinmalar = result;
        this.eskiBulinmalar = result;
      });
  }

  onChangeXodimlar(event) {
    this.secondFormGroup.get('xodimlarId').setValue(event._id);
    this.secondFormGroup.get('xodimlarName').setValue(event.name);
    this.secondFormGroup.get('eskiLavozimlarId').setValue(event.lavozimId);
    this.secondFormGroup.get('eskiTashkilotlarId').setValue(event.tashkilotId);
    this.secondFormGroup.get('eskiBulimlarId').setValue(event.bulimiId);
    this.secondFormGroup.get('eskiBulinmalarId').setValue(event.bulinmaId);

    this.secondFormGroup.get('ishgaKirganSana').setValue(new Date(event.ishgaKirganSana).toISOString().slice(0, 10),);
    if (this.eskiLavozimlar.length > 0 && event.lavozimId) {
      this.eskiLavozimlarName = this.eskiLavozimlar.find(x => x._id === event.lavozimId);
      this.secondFormGroup.get('eskiLavozimlarName').setValue(this.eskiLavozimlarName.name);
    }
    if (this.eskiTashkilotlar.length > 0 && event.tashkilotId) {
      this.eskiTashkilotlarName = this.eskiTashkilotlar.find(x => x._id === event.tashkilotId);
      this.secondFormGroup.get('eskiTashkilotlarName').setValue(this.eskiTashkilotlarName.name);
    }
    if (this.eskiBulimlar.length > 0 && event.bulimiId) {
      this.eskiBulimlarName = this.eskiBulimlar.find(x => x._id === event.bulimiId);
      this.secondFormGroup.get('eskiBulimlarName').setValue(this.eskiBulimlarName.name);
    }
    if (this.eskiBulinmalar.length > 0 && event.bulinmaId) {
      this.eskiBulinmalarName = this.eskiBulinmalar.find(x => x._id === event.bulinmaId);
      this.secondFormGroup.get('eskiBulinmalarName').setValue(this.eskiBulinmalarName.name);
    }
  }

  onChangeLavozimlar(event) {
    this.secondFormGroup.get('lavozimlarId').setValue(event._id);
    this.secondFormGroup.get('lavozimlarName').setValue(event.name);
  }

  onChangeTashkilotlar(event) {
    this.secondFormGroup.get('tashkilotlarId').setValue(event._id);
    this.secondFormGroup.get('tashkilotlarName').setValue(event.name);
  }

  onChangeBulimlar(event) {
    this.secondFormGroup.get('bulimlarId').setValue(event._id);
    this.secondFormGroup.get('bulimlarName').setValue(event.name);
  }

  onChangeBulinmalar(event) {
    this.secondFormGroup.get('bulinmalarId').setValue(event._id);
    this.secondFormGroup.get('bulinmalarName').setValue(event.name);
  }

  onCloseForm() {
    this.filterDocuments = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.xodimlarName = null;
    this.lavozimlarName = null;
    this.eskiLavozimlarName = null;
    this.tashkilotlarName = null;
    this.eskiTashkilotlarName = null;
    this.bulimlarName = null;
    this.eskiBulimlarName = null;
    this.bulinmalarName = null;
    this.eskiBulinmalarName = null;
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedTumanAndMassiv(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.EnableButton();

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
    this.secondFormGroup.reset();
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
      this.apiService.updated<LavozimniUzgartirishBuyrugi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<LavozimniUzgartirishBuyrugi>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<LavozimniUzgartirishBuyrugi>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<LavozimniUzgartirishBuyrugi>>(params, this.className)
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
