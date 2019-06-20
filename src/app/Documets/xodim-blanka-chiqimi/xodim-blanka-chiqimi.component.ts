import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {BlankaChiqimiXodim} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Blankalar, Xodimlar} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';
import {BlankaQoldiqXodim} from '../../classes/interfaceRegister';

@Component({
  selector: 'app-xodim-blanka-chiqimi',
  templateUrl: './xodim-blanka-chiqimi.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class XodimBlankaChiqimiComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana',
    'xodim', 'izoxi'];

  filterDocuments: FilterDateDocuments = {};
  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;
  blankalar: Blankalar[] = [];
  blankalarName: Blankalar;
  blankaQoldiq: BlankaQoldiqXodim;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;
  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: BlankaChiqimiXodim;
  reloading = false;
  positionId: string;
  className = 'blankaChiqimiXodim';
  list: BlankaChiqimiXodim;
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
      chiqimTuri: new FormControl(''),
      partiyaId: new FormControl(''),
      partiyaDocId: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
      yuklashSana: new FormControl(new Date().toISOString().slice(0, 16)),
      izoxi: new FormControl(''),
      xulosa: new FormControl(''),
      blankalarId: new FormControl(''),
      blankalarName: new FormControl(''),
      blankadan: new FormControl(0),
      blankagacha: new FormControl(0),
      qoldiqBlankadan: new FormControl(0),
      qoldiqBlankagacha: new FormControl(0),
      soni: new FormControl(0),
      narxi: new FormControl(0),
      summasi: new FormControl(0),
    });
    this.getBlankalar();
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
    if (this.selectedItem && this.positionId) {
      const YEAR = this.secondFormGroup.value.sana.slice(0, 4);
      const MONTH = this.secondFormGroup.value.sana.slice(5, 7);
      const DAY = this.secondFormGroup.value.sana.slice(8, 10);
      const HOURS = this.selectedItem.yuklashSana.toString().slice(11, 16).slice(0, 2);
      const MINUT = this.selectedItem.yuklashSana.toString().slice(11, 16).slice(3, 5);
      const SEKUND = this.selectedItem.yuklashSana.toString().slice(16, 24).slice(6, 8);
      const yuklashSanasi = new Date(Number(YEAR), Number(MONTH) - 1, Number(DAY), Number(HOURS) + 5, Number(MINUT), Number(SEKUND));
      const newBlankaChiqimiXodim: BlankaChiqimiXodim = {
        tasdiqlash: true,
        tartibRaqam: this.secondFormGroup.value.tartibRaqam,
        sana: this.secondFormGroup.value.sana,
        xodimlarId: this.secondFormGroup.value.xodimlarId,
        xodimlarName: this.secondFormGroup.value.xodimlarName,
        chiqimTuri: this.secondFormGroup.value.chiqimTuri,
        partiyaId: this.secondFormGroup.value.partiyaId,
        partiyaDocId: this.secondFormGroup.value.partiyaDocId,
        foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
        yuklashSana: yuklashSanasi,
        izoxi: this.secondFormGroup.value.izoxi,
        xulosa: this.secondFormGroup.value.xulosa,
        blankalarId: this.secondFormGroup.value.blankalarId,
        blankalarName: this.secondFormGroup.value.blankalarName,
        blankadan: this.secondFormGroup.value.blankadan,
        blankagacha: this.secondFormGroup.value.blankagacha,
        qoldiqBlankadan: this.secondFormGroup.value.qoldiqBlankadan,
        qoldiqBlankagacha: this.secondFormGroup.value.qoldiqBlankagacha,
        soni: this.secondFormGroup.value.soni,
        narxi: this.secondFormGroup.value.narxi,
        summasi: this.secondFormGroup.value.summasi,
      };
      if (newBlankaChiqimiXodim) {
        this.creatAll(newBlankaChiqimiXodim);
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
      const SEKUND = new Date().toString().slice(16, 24).slice(6, 8);
      const yuklashSanasi = new Date(Number(YEAR), Number(MONTH) - 1, Number(DAY), Number(HOURS), Number(MINUT), Number(SEKUND));
      const newBlankaChiqimiXodim: BlankaChiqimiXodim = {
        tasdiqlash: true,
        tartibRaqam: this.secondFormGroup.value.tartibRaqam,
        sana: this.secondFormGroup.value.sana,
        xodimlarId: this.secondFormGroup.value.xodimlarId,
        xodimlarName: this.secondFormGroup.value.xodimlarName,
        chiqimTuri: this.secondFormGroup.value.chiqimTuri,
        partiyaId: this.secondFormGroup.value.partiyaId,
        partiyaDocId: this.secondFormGroup.value.partiyaDocId,
        foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
        yuklashSana: yuklashSanasi,
        izoxi: this.secondFormGroup.value.izoxi,
        xulosa: this.secondFormGroup.value.xulosa,
        blankalarId: this.secondFormGroup.value.blankalarId,
        blankalarName: this.secondFormGroup.value.blankalarName,
        blankadan: this.secondFormGroup.value.blankadan,
        blankagacha: this.secondFormGroup.value.blankagacha,
        qoldiqBlankadan: this.secondFormGroup.value.qoldiqBlankadan,
        qoldiqBlankagacha: this.secondFormGroup.value.qoldiqBlankagacha,
        soni: this.secondFormGroup.value.soni,
        narxi: this.secondFormGroup.value.narxi,
        summasi: this.secondFormGroup.value.summasi,
      };
      if (newBlankaChiqimiXodim) {
        this.creatAll(newBlankaChiqimiXodim);
        this.selectedItem = null;
        this.isVisbleForm = false;
        this.secondFormGroup.reset();
        this.EnableButton();
      }
    }
    this.xodimlarName = null;
    this.blankalarName = null;
  }

  addObject() {
    this.xodimlarName = null;
    this.blankalarName = null;
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
        chiqimTuri: this.selectedItem.chiqimTuri,
        partiyaId: this.selectedItem.partiyaId,
        partiyaDocId: this.selectedItem.partiyaDocId,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        yuklashSana: this.selectedItem.yuklashSana,
        izoxi: this.selectedItem.izoxi,
        xulosa: this.selectedItem.xulosa,
        blankalarId: this.selectedItem.blankalarId,
        blankalarName: this.selectedItem.blankalarName,
        blankadan: this.selectedItem.blankadan,
        blankagacha: this.selectedItem.blankagacha,
        qoldiqBlankadan: this.selectedItem.qoldiqBlankadan,
        qoldiqBlankagacha: this.selectedItem.qoldiqBlankagacha,
        soni: this.selectedItem.soni,
        narxi: this.selectedItem.narxi,
        summasi: this.selectedItem.summasi,
      });
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
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
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        chiqimTuri: this.selectedItem.chiqimTuri,
        partiyaId: this.selectedItem.partiyaId,
        partiyaDocId: this.selectedItem.partiyaDocId,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        yuklashSana: this.selectedItem.yuklashSana,
        izoxi: this.selectedItem.izoxi,
        xulosa: this.selectedItem.xulosa,
        blankalarId: this.selectedItem.blankalarId,
        blankalarName: this.selectedItem.blankalarName,
        blankadan: this.selectedItem.blankadan,
        blankagacha: this.selectedItem.blankagacha,
        qoldiqBlankadan: this.selectedItem.qoldiqBlankadan,
        qoldiqBlankagacha: this.selectedItem.qoldiqBlankagacha,
        soni: this.selectedItem.soni,
        narxi: this.selectedItem.narxi,
        summasi: this.selectedItem.summasi,
      });
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
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
    this.selectedItem = null;
    this.xodimlarName = null;
    this.blankalarName = null;
    this.isVisbleForm = false;
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.stepperRef.previous();
  }

  getBlankalar() {
    this.apiService.getAll<Blankalar>('blankalar/')
      .subscribe(result => {
        this.blankalar = result;
      });
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  onChangeXodimlar(event) {
    this.secondFormGroup.get('xodimlarId').setValue(event._id);
    this.secondFormGroup.get('xodimlarName').setValue(event.name);
  }

  onChangeBlankalar(event) {
    this.secondFormGroup.get('blankalarId').setValue(event._id);
    this.secondFormGroup.get('blankalarName').setValue(event.name);

    if (this.secondFormGroup.get('xodimlarId').value === null) {
      this.openSnackBar('Ходимни киритмадингиз!', 'Хатолик!', 5);
      this.blankalarName = null;
      this.secondFormGroup.patchValue({
        partiyaId: '',
        partiyaDocId: '',
        blankalarId: '',
        blankalarName: '',
        qoldiqBlankadan: 0,
        qoldiqBlankagacha: 0,
        blankadan: 0,
        blankagacha: 0,
        soni: 0,
        narxi: 0,
        summasi: 0,
      });
      return;
    }
    if (event) {
      const params = Object.assign({}, {
        end: this.secondFormGroup.get('sana').value,
        blankalarId: event._id,
        xodimlarId: this.secondFormGroup.get('xodimlarId').value,
      });
      this.apiService.getQoldiq<BlankaQoldiqXodim>(params, '/blankaQoldiqXodim')
        .subscribe(result => {
          this.blankaQoldiq = result;
          if (this.blankaQoldiq) {
            if (this.blankaQoldiq.blankadan > this.blankaQoldiq.blankagacha) {
              this.openSnackBar('Бундай бланка омборда қолмаган!', 'Хатолик!', 5);
              this.blankalarName = null;
              this.secondFormGroup.patchValue({
                partiyaId: '',
                partiyaDocId: '',
                blankalarId: '',
                blankalarName: '',
                qoldiqBlankadan: 0,
                qoldiqBlankagacha: 0,
                blankadan: 0,
                blankagacha: 0,
                soni: 0,
                narxi: 0,
                summasi: 0,
              });
              return;
            }
            this.secondFormGroup.patchValue({
              qoldiqBlankadan: this.blankaQoldiq.blankadan,
              qoldiqBlankagacha: this.blankaQoldiq.blankagacha,
              blankadan: this.blankaQoldiq.blankadan,
              blankagacha: this.blankaQoldiq.blankadan+1,
              partiyaId: this.blankaQoldiq.partiyaId,
              partiyaDocId: this.blankaQoldiq.partiyaDocId,
              soni: 1,
              narxi: this.blankaQoldiq.narxi,
              summasi: this.blankaQoldiq.narxi
            });
          } else {
            this.openSnackBar('Бундай бланка омборда мавжуд эмас!', 'Хатолик!', 5);
            this.blankalarName = null;
            this.secondFormGroup.patchValue({
              partiyaId: '',
              partiyaDocId: '',
              blankalarId: '',
              blankalarName: '',
              qoldiqBlankadan: 0,
              qoldiqBlankagacha: 0,
              blankadan: 0,
              blankagacha: 0,
              soni: 0,
              narxi: 0,
              summasi: 0,
            });
          }
        });
    }
  }

  onCloseForm() {
    this.xodimlarName = null;
    this.blankalarName = null;
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedRow(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.xodimlarName = null;
    this.blankalarName = null;
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
    this.secondFormGroup.patchValue({yuklashSana: new Date().toISOString().slice(0, 10) + 'T' + new Date().toString().slice(16, 21)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({chiqimTuri: 'chiqim'});
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
      this.apiService.updated<BlankaChiqimiXodim>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<BlankaChiqimiXodim>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<BlankaChiqimiXodim>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<BlankaChiqimiXodim>>(params, this.className)
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
