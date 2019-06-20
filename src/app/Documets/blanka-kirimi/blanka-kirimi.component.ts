import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {BlankaKirimi, JadvalBlankaKirimi} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Blankalar, Omborlar, YetkazibBeruvchilar} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

@Component({
  selector: 'app-blanka-kirimi',
  templateUrl: './blanka-kirimi.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class BlankaKirimiComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'ombor',
    'qabulQildi', 'kimOrqali', 'kimdan', 'fakturaNomer', 'fakturaSana',
    'ishonchnomaNomer', 'ishonchnomaSana'];
  filterDocuments: FilterDateDocuments = {};
  omborlar: Omborlar[] = [];
  omborlarName: Omborlar;
  yetkazibBeruvchilar: YetkazibBeruvchilar[] = [];
  yetkazibBeruvchilarName: YetkazibBeruvchilar;
  blankalar: Blankalar[] = [];
  blankalarName: Blankalar;

  jadvalBlanKirimi: JadvalBlankaKirimi[] = [];
  selectBlankalar: JadvalBlankaKirimi;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;
  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: BlankaKirimi;
  reloading = false;
  positionId: string;
  className = 'blankaKirimi';
  list: BlankaKirimi;
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
      omborlarId: new FormControl('', Validators.required),
      omborlarName: new FormControl(''),
      qabulQildi: new FormControl(''),
      yetkazibBeruvchilarId: new FormControl('', Validators.required),
      yetkazibBeruvchilarName: new FormControl(''),
      fakturaNomer: new FormControl(''),
      fakturaSana: new FormControl(new Date()),
      ishonchnomaNomer: new FormControl(''),
      ishonchnomaSana: new FormControl(new Date()),
      kimOrqali: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
      yuklashSana: new FormControl(new Date().toISOString().slice(0, 16)),
      tartibRaqamBlanka: new FormControl(1),
      blankalarId: new FormControl(''),
      blankalarName: new FormControl(''),
      blankadan: new FormControl(0),
      blankagacha: new FormControl(0),
      soni: new FormControl(0),
      narxi: new FormControl(0),
    });
    this.getOmborlar();
    this.getBlankalar();
    this.getYetkazibBeruvchilar();
    this.getAll();
  }

  backTable() {
    this.stepperRef.previous();
  }

  backForm() {
    this.stepperRef.next();
  }

  onSubmit() {
    if (this.selectedItem && this.positionId) {
      const YEAR = this.secondFormGroup.value.sana.slice(0, 4);
      const MONTH = this.secondFormGroup.value.sana.slice(5, 7);
      const DAY = this.secondFormGroup.value.sana.slice(8, 10);
      const HOURS = this.selectedItem.yuklashSana.toString().slice(11, 16).slice(0, 2);
      const MINUT = this.selectedItem.yuklashSana.toString().slice(11, 16).slice(3, 5);
      const SEKUND = this.selectedItem.yuklashSana.toString().slice(16, 24).slice(6, 8);
      const yuklashSanasi = new Date(Number(YEAR), Number(MONTH)-1, Number(DAY), Number(HOURS)+5, Number(MINUT), Number(SEKUND));
      const newBlankaKirimi: BlankaKirimi = {
        tasdiqlash: true,
        tartibRaqam: this.secondFormGroup.value.tartibRaqam,
        sana: this.secondFormGroup.value.sana,
        omborlarId: this.secondFormGroup.value.omborlarId,
        omborlarName: this.secondFormGroup.value.omborlarName,
        qabulQildi: this.secondFormGroup.value.qabulQildi,
        yetkazibBeruvchilarId: this.secondFormGroup.value.yetkazibBeruvchilarId,
        yetkazibBeruvchilarName: this.secondFormGroup.value.yetkazibBeruvchilarName,
        fakturaNomer: this.secondFormGroup.value.fakturaNomer,
        fakturaSana: this.secondFormGroup.value.fakturaSana,
        ishonchnomaNomer: this.secondFormGroup.value.ishonchnomaNomer,
        ishonchnomaSana: this.secondFormGroup.value.ishonchnomaSana,
        kimOrqali: this.secondFormGroup.value.kimOrqali,
        foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
        yuklashSana: yuklashSanasi,
        jadval: this.jadvalBlanKirimi,
      };
      if (newBlankaKirimi) {
        this.creatAll(newBlankaKirimi);
        this.selectedItem = null;
        this.isVisbleForm = false;
        this.secondFormGroup.reset();
        this.EnableButton();
      }
    } else {
      const YEAR = this.secondFormGroup.value.sana.slice(0, 4);
      const MONTH = this.secondFormGroup.value.sana.slice(5, 7);
      const DAY = this.secondFormGroup.value.sana.slice(8, 10);
      const HOURS = new Date().toString().slice(16, 21).slice(0, 2);
      const MINUT = new Date().toString().slice(16, 21).slice(3, 5);
      const SEKUND = new Date().toString().slice(16, 24).slice(6,8);
      const yuklashSanasi = new Date(Number(YEAR), Number(MONTH)-1, Number(DAY), Number(HOURS), Number(MINUT), Number(SEKUND));
      const newBlankaKirimi: BlankaKirimi = {
        tasdiqlash: true,
        tartibRaqam: this.secondFormGroup.value.tartibRaqam,
        sana: this.secondFormGroup.value.sana,
        omborlarId: this.secondFormGroup.value.omborlarId,
        omborlarName: this.secondFormGroup.value.omborlarName,
        qabulQildi: this.secondFormGroup.value.qabulQildi,
        yetkazibBeruvchilarId: this.secondFormGroup.value.yetkazibBeruvchilarId,
        yetkazibBeruvchilarName: this.secondFormGroup.value.yetkazibBeruvchilarName,
        fakturaNomer: this.secondFormGroup.value.fakturaNomer,
        fakturaSana: this.secondFormGroup.value.fakturaSana,
        ishonchnomaNomer: this.secondFormGroup.value.ishonchnomaNomer,
        ishonchnomaSana: this.secondFormGroup.value.ishonchnomaSana,
        kimOrqali: this.secondFormGroup.value.kimOrqali,
        foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
        yuklashSana: yuklashSanasi,
        jadval: this.jadvalBlanKirimi,
      };
      if (newBlankaKirimi) {
        this.creatAll(newBlankaKirimi);
        this.selectedItem = null;
        this.isVisbleForm = false;
        this.secondFormGroup.reset();
        this.EnableButton();
      }
    }


    this.omborlarName = null;
    this.yetkazibBeruvchilarName = null;
    this.blankalarName = null;
    this.jadvalBlanKirimi = [];
  }

  addObject() {
    this.omborlarName = null;
    this.yetkazibBeruvchilarName = null;
    this.blankalarName = null;
    this.jadvalBlanKirimi = [];
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
        omborlarId: this.selectedItem.omborlarId,
        omborlarName: this.selectedItem.omborlarName,
        qabulQildi: this.selectedItem.qabulQildi,
        yetkazibBeruvchilarId: this.selectedItem.yetkazibBeruvchilarId,
        yetkazibBeruvchilarName: this.selectedItem.yetkazibBeruvchilarName,
        fakturaNomer: this.selectedItem.fakturaNomer,
        fakturaSana: new Date(this.selectedItem.fakturaSana).toISOString().slice(0, 10),
        ishonchnomaNomer: this.selectedItem.ishonchnomaNomer,
        ishonchnomaSana: new Date(this.selectedItem.ishonchnomaSana).toISOString().slice(0, 10),
        kimOrqali: this.selectedItem.kimOrqali,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        yuklashSana: this.selectedItem.yuklashSana,
        tartibRaqamBlanka: this.selectedItem.jadval.length + 1
      });
      if (this.selectedItem.jadval) {
        this.jadvalBlanKirimi = this.selectedItem.jadval;
      }
      if (this.omborlar.length > 0 && this.selectedItem.omborlarId) {
        this.omborlarName = this.omborlar.find(x => x._id === this.selectedItem.omborlarId);
      }
      if (this.yetkazibBeruvchilar.length > 0 && this.selectedItem.yetkazibBeruvchilarId) {
        this.yetkazibBeruvchilarName = this.yetkazibBeruvchilar.find(x => x._id === this.selectedItem.yetkazibBeruvchilarId);
      }
      this.blankalarName = null;
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
        tasdiqlash: this.selectedItem.tasdiqlash,
        tartibRaqam: this.totalDocs + 1,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0, 10),
        omborlarId: this.selectedItem.omborlarId,
        omborlarName: this.selectedItem.omborlarName,
        qabulQildi: this.selectedItem.qabulQildi,
        yetkazibBeruvchilarId: this.selectedItem.yetkazibBeruvchilarId,
        yetkazibBeruvchilarName: this.selectedItem.yetkazibBeruvchilarName,
        fakturaNomer: this.selectedItem.fakturaNomer,
        fakturaSana: new Date(this.selectedItem.fakturaSana).toISOString().slice(0, 10),
        ishonchnomaNomer: this.selectedItem.ishonchnomaNomer,
        ishonchnomaSana: new Date(this.selectedItem.ishonchnomaSana).toISOString().slice(0, 10),
        kimOrqali: this.selectedItem.kimOrqali,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        yuklashSana: this.selectedItem.yuklashSana,
        tartibRaqamBlanka: this.selectedItem.jadval.length + 1
      });
      if (this.selectedItem.jadval) {
        this.jadvalBlanKirimi = this.selectedItem.jadval;
      }
      if (this.omborlar.length > 0 && this.selectedItem.omborlarId) {
        this.omborlarName = this.omborlar.find(x => x._id === this.selectedItem.omborlarId);
      }
      if (this.yetkazibBeruvchilar.length > 0 && this.selectedItem.yetkazibBeruvchilarId) {
        this.yetkazibBeruvchilarName = this.yetkazibBeruvchilar.find(x => x._id === this.selectedItem.yetkazibBeruvchilarId);
      }
      this.positionId = null;
      this.blankalarName = null;
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
    this.omborlarName = null;
    this.yetkazibBeruvchilarName = null;
    this.blankalarName = null;
    this.isVisbleForm = false;
    this.jadvalBlanKirimi = [];
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.stepperRef.previous();
  }

  getOmborlar() {
    this.apiService.getAll<Omborlar>('omborlar/')
      .subscribe(result => {
        this.omborlar = result;
      });
  }

  getBlankalar() {
    this.apiService.getAll<Blankalar>('blankalar/')
      .subscribe(result => {
        this.blankalar = result;
      });
  }

  getYetkazibBeruvchilar() {
    this.apiService.getAll<YetkazibBeruvchilar>('yetkazibBeruvchilar/')
      .subscribe(result => {
        this.yetkazibBeruvchilar = result;
      });
  }

  onChangeOmborlar(event) {
    this.secondFormGroup.get('omborlarId').setValue(event._id);
    this.secondFormGroup.get('omborlarName').setValue(event.name);
    this.secondFormGroup.get('qabulQildi').setValue(event.javobgarShaxs);
  }

  onChangeYetkazibBeruvchilar(event) {
    this.secondFormGroup.get('yetkazibBeruvchilarId').setValue(event._id);
    this.secondFormGroup.get('yetkazibBeruvchilarName').setValue(event.name);
  }

  onChangeBlankalar(event) {
    this.secondFormGroup.get('blankalarId').setValue(event._id);
    this.secondFormGroup.get('blankalarName').setValue(event.name);
  }

  onChangeBlankagacha(event) {
    if (this.secondFormGroup.value.blankadan) {
      if (event.target.value) {
        const soni = (parseInt(event.target.value) - parseInt(this.secondFormGroup.value.blankadan)) + 1;
        this.secondFormGroup.get('soni').setValue(soni);
      } else {
        this.secondFormGroup.get('soni').setValue(0);
      }
    } else {
      this.openSnackBar('Бланка(...дан) қаторига рақам киритинг!', 'Хатолик', 3);
      this.secondFormGroup.get('soni').setValue(0);
    }
  }

  onChangeBlankadan(event) {
    if (this.secondFormGroup.value.blankagacha) {
      if (event.target.value) {
        const soni = (parseInt(event.target.value) - parseInt(this.secondFormGroup.value.blankadan)) + 1;
        this.secondFormGroup.get('soni').setValue(soni);
      } else {
        this.secondFormGroup.get('soni').setValue(0);
      }
    } else {
      this.openSnackBar('Бланка(...гача) қаторига рақам киритинг!', 'Хатолик', 3);
      this.secondFormGroup.get('soni').setValue(0);
    }
  }

  onCloseForm() {
    this.omborlarName = null;
    this.yetkazibBeruvchilarName = null;
    this.blankalarName = null;
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedRow(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.omborlarName = null;
    this.yetkazibBeruvchilarName = null;
    this.blankalarName = null;
    this.EnableButton();
  }

  selectedJadval(jadvalBlanka) {
    this.selectBlankalar = jadvalBlanka;
  }

  adder() {
    const idx = this.jadvalBlanKirimi.find(p => p.blankalarId === this.secondFormGroup.value.blankalarId);
    if (idx) {
      this.openSnackBar(`${this.secondFormGroup.value.blankalarName}${'номли бланка киритилган, бир хил бланка киритиш мумкин эмас!'}`, 'Хатолик', 3);
      return;
    }
    this.jadvalBlanKirimi.push(
      {
        tartibRaqam: this.secondFormGroup.value.tartibRaqamBlanka,
        blankalarId: this.secondFormGroup.value.blankalarId,
        blankalarName: this.secondFormGroup.value.blankalarName,
        blankadan: this.secondFormGroup.value.blankadan,
        blankagacha: this.secondFormGroup.value.blankagacha,
        soni: this.secondFormGroup.value.soni,
        narxi: this.secondFormGroup.value.narxi,
        summasi: parseInt(this.secondFormGroup.value.soni) * parseInt(this.secondFormGroup.value.narxi),
      }
    );
    this.blankalarName = null;
    this.secondFormGroup.patchValue({
      tartibRaqamBlanka: this.jadvalBlanKirimi.length + 1,
      blankalarId: '',
      blankalarName: '',
      blankadan: 0,
      blankagacha: 0,
      soni: 0,
      narxi: 0
    });
  }

  editJadVal() {
    if (this.selectBlankalar) {
      this.secondFormGroup.patchValue({
        tartibRaqamBlanka: this.selectBlankalar.tartibRaqam,
        blankalarId: this.selectBlankalar.blankalarId,
        blankalarName: this.selectBlankalar.blankalarName,
        blankadan: this.selectBlankalar.blankadan,
        blankagacha: this.selectBlankalar.blankagacha,
        soni: this.selectBlankalar.soni,
        narxi: this.selectBlankalar.narxi,
      });
      if (this.blankalar.length > 0 && this.selectBlankalar.blankalarId) {
        this.blankalarName = this.blankalar.find(x => x._id === this.selectBlankalar.blankalarId);
      }
    }
  }

  deleteJadval() {
    if (this.selectBlankalar) {
      const idx = this.jadvalBlanKirimi.find(p => p.blankalarId === this.selectBlankalar.blankalarId).tartibRaqam - 1;
      this.jadvalBlanKirimi.splice(idx, 1);
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
    this.secondFormGroup.patchValue({yuklashSana: new Date().toISOString().slice(0, 10) + 'T' + new Date().toString().slice(16, 21)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({tartibRaqamBlanka: 1});
    this.positionId = null;
    this.DisableButton();

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
      this.apiService.updated<BlankaKirimi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<BlankaKirimi>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<BlankaKirimi>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<BlankaKirimi>>(params, this.className)
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
