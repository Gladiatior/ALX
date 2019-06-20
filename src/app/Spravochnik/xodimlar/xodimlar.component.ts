import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {Bulimlar, Bulinmalar, Lavozimlar, Tashkilotlar, Xodimlar} from '../../classes/interfaceSpr';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterName} from '../../classes/sprFilter';
import {PageResponse} from '../../classes/pageResponse';

@Component({
  selector: 'app-xodimlar',
  templateUrl: './xodimlar.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class XodimlarComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomi', 'inn','ishgaKirganSana','ishdanKetganSana', 'lavozimi', 'bulimi', 'bulinma'];
  lavozimlar: Lavozimlar[] = [];
  lavozimlarName: Lavozimlar;
  tashkiloatlar: Tashkilotlar[] = [];
  tashkilotalarName: Tashkilotlar;
  bulimlar: Bulimlar[] = [];
  bulimlarName: Bulimlar;
  bulinmalar: Bulinmalar[] = [];
  bulinmalarName: Bulinmalar;
  filterXodimlar: FilterName = {};

  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: Xodimlar;
  reloading = false;
  positionId: string;
  className = 'xodimlar';
  list: Xodimlar;
  page = 1;
  pageSize = 10;
  totalPages: number;
  totalDocs: number;
  hasNextPage = false;
  hasPrevPage = false;
  pagingCounter: number;
  prevPage = false;
  nextPage = false;

  constructor(private apiService: RestClientService, private appRout: RoutService,
              private dialogFilter: MatDialog, private snackBar: MatSnackBar) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      this.editObject();
    }
    if (event.key === 'Insert') {
      this.addObject();
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
      if (!this.Buttonlar) {
        this.deleteObjectForm();
      }
    }
    if (event.key === 'F3' && event.altKey) {
      if (!this.Buttonlar) {
        this.opeFilterDialog();
      }
    }
    if (event.key === 'Escape') {
      this.onCloseForm();
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      tartibRaqam: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      name: new FormControl(null, Validators.required),
      inn: new FormControl(null, Validators.required),
      manzili: new FormControl(null),
      passportType: new FormControl(null),
      lavozimId: new FormControl(null),
      bulimiId: new FormControl(null),
      bulinmaId: new FormControl(null),
      viloyatId: new FormControl(''),
      ishgaKirganSana: new FormControl(new Date()),
      ishdanKetganSana: new FormControl(new Date()),
      tashkilotId: new FormControl(null, Validators.required),
    });
    this.getLavozimlar();
    this.getBulimlar();
    this.getBulinmalar();
    this.getTashkilotlar();
    this.getAll();
  }

  opeFilterDialog(): void {
    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {name: this.filterXodimlar.name, SPR: 'ИНН'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterXodimlar.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterXodimlar.name = null;
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  onSubmit() {
    const newXodimlar: Xodimlar = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      inn: this.form.value.inn,
      manzili: this.form.value.manzili,
      passportType: this.form.value.passportType,
      lavozimId: this.form.value.lavozimId,
      bulimiId: this.form.value.bulimiId,
      bulinmaId: this.form.value.bulinmaId,
      viloyatId: this.form.value.viloyatId,
      ishgaKirganSana: this.form.value.ishgaKirganSana,
      ishdanKetganSana: this.form.value.ishdanKetganSana,
      tashkilotId: this.form.value.tashkilotId,
    };
    if (newXodimlar) {
      this.creatAll(newXodimlar);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.EnableButton();
    }
    this.lavozimlarName = null;
    this.tashkilotalarName = null;
    this.bulimlarName = null;
    this.bulinmalarName = null;
  }

  addObject() {
    this.lavozimlarName = null;
    this.tashkilotalarName = null;
    this.bulimlarName = null;
    this.bulinmalarName = null;
    this.addNewObject();
  }

  editObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        inn: this.selectedItem.inn,
        manzili: this.selectedItem.manzili,
        passportType: this.selectedItem.passportType,
        lavozimId: this.selectedItem.lavozimId,
        bulimiId: this.selectedItem.bulimiId,
        bulinmaId: this.selectedItem.bulinmaId,
        viloyatId: this.selectedItem.viloyatId,
        ishgaKirganSana: new Date(this.selectedItem.ishgaKirganSana).toISOString().slice(0,10),
        ishdanKetganSana: new Date(this.selectedItem.ishdanKetganSana).toISOString().slice(0,10),
        tashkilotId: this.selectedItem.tashkilotId
      });
      if (this.lavozimlar.length > 0 && this.selectedItem.lavozimId) {
        this.lavozimlarName = this.lavozimlar.find(x => x._id === this.selectedItem.lavozimId);
      } else {
        this.lavozimlarName = null;
      }
      if (this.bulimlar.length > 0 && this.selectedItem.bulimiId) {
        this.bulimlarName = this.bulimlar.find(x => x._id === this.selectedItem.bulimiId);
      } else {
        this.bulimlarName = null;
      }
      if (this.bulinmalar.length > 0 && this.selectedItem.bulinmaId) {
        this.bulinmalarName = this.bulinmalar.find(x => x._id === this.selectedItem.bulinmaId);
      } else {
        this.bulinmalarName = null;
      }
      if (this.tashkiloatlar.length > 0 && this.selectedItem.tashkilotId) {
        this.tashkilotalarName = this.tashkiloatlar.find(x => x._id === this.selectedItem.tashkilotId);
      } else {
        this.tashkilotalarName = null;
      }
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
    this.DisableButton();
  }

  copyObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        inn: this.selectedItem.inn,
        manzili: this.selectedItem.manzili,
        passportType: this.selectedItem.passportType,
        lavozimId: this.selectedItem.lavozimId,
        bulimiId: this.selectedItem.bulimiId,
        bulinmaId: this.selectedItem.bulinmaId,
        viloyatId: this.selectedItem.viloyatId,
        ishgaKirganSana: new Date(this.selectedItem.ishgaKirganSana).toISOString().slice(0,10),
        ishdanKetganSana: new Date(this.selectedItem.ishdanKetganSana).toISOString().slice(0,10),
        tashkilotId: this.selectedItem.tashkilotId,
        tartibRaqam: this.totalDocs + 1
      });
      if (this.lavozimlar.length > 0 && this.selectedItem.lavozimId) {
        this.lavozimlarName = this.lavozimlar.find(x => x._id === this.selectedItem.lavozimId);
      }
      if (this.bulimlar.length > 0 && this.selectedItem.bulimiId) {
        this.bulimlarName = this.bulimlar.find(x => x._id === this.selectedItem.bulimiId);
      }
      if (this.bulinmalar.length > 0 && this.selectedItem.bulinmaId) {
        this.bulinmalarName = this.bulinmalar.find(x => x._id === this.selectedItem.bulinmaId);
      }
      if (this.tashkiloatlar.length > 0 && this.selectedItem.tashkilotId) {
        this.tashkilotalarName = this.tashkiloatlar.find(x => x._id === this.selectedItem.tashkilotId);
      }
      this.positionId = null;
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
    this.DisableButton();
  }

  deleteObjectForm() {
    if (this.positionId) {
      this.deleteObject(this.selectedItem);
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  onResetForm() {
    this.filterXodimlar = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.getLavozimlar();
    this.getBulimlar();
    this.getBulinmalar();
    this.getTashkilotlar();
    this.getAll();
    this.EnableButton();
    this.form.reset();
  }

  getLavozimlar() {
    this.apiService.getAll<Lavozimlar>('lavozimlar/')
      .subscribe(result => {
        this.lavozimlar = result;
      });
  }

  getBulimlar() {
    this.apiService.getAll<Bulimlar>('bulimlar/')
      .subscribe(result => {
        this.bulimlar = result;
      });
  }

  getBulinmalar() {
    this.apiService.getAll<Bulinmalar>('bulinmalar/')
      .subscribe(result => {
        this.bulinmalar = result;
      });
  }

  getTashkilotlar() {
    this.apiService.getAll<Tashkilotlar>('tashkilotlar/')
      .subscribe(result => {
        this.tashkiloatlar = result;
      });
  }

  getNameLavozimlar(lavozimId) {
    if (this.lavozimlar.length > 0 && lavozimId) {
      return this.lavozimlar.find(x => x._id === lavozimId).name;
    }
  }

  getNameBulimlar(bulimlarId) {
    if (this.bulimlar.length > 0 && bulimlarId) {
      return this.bulimlar.find(x => x._id === bulimlarId).name;
    }
  }

  getNameBulinmalar(bulinmalarId) {
    if (this.bulinmalar.length > 0 && bulinmalarId) {
      return this.bulinmalar.find(x => x._id === bulinmalarId).name;
    }
  }

  onChangeLavozim(event) {
    this.form.get('lavozimId').setValue(event._id);
  }

  onChangeBulim(event) {
    this.form.get('bulimiId').setValue(event._id);
  }

  onChangeBulinma(event) {
    this.form.get('bulinmaId').setValue(event._id);
  }

  onChangeTashkilot(event) {
    this.form.get('tashkilotId').setValue(event._id);
    this.form.get('viloyatId').setValue(event.viloyatId);
  }

  onCloseForm() {
    this.lavozimlarName = null;
    this.bulimlarName = null;
    this.bulinmalarName = null;
    this.tashkilotalarName = null;
    this.closeObject();
  }

  EnableButton() {
    this.Buttonlar = false;
  }

  DisableButton() {
    this.Buttonlar = true;
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
    this.form.reset();
    this.form.patchValue({tartibRaqam: this.totalDocs + 1});
    this.positionId = null;
    this.DisableButton();

  }

  selectedRow(row) {
    this.selectedItem = row;
    this.positionId = row._id;
    this.EnableButton();
    this.form.reset();
  }

  closeObject() {
    this.selectedItem = null;
    this.form.reset();
    this.isVisbleForm = false;
    this.positionId = null;
    this.EnableButton();

  }

  deleteObject(item) {
    const decision = window.confirm(`"${item.name}" қаторини ўчиришни хохлайсизми!`);
    if (decision) {
      this.apiService.delete(this.positionId, this.className)
        .subscribe(
          response =>
            this.openSnackBar(response.message, 'Тасдиқлаш', 2),
          error => this.openSnackBar(error.error.message, 'Хатолик', 2),
          () => this.getAll()
        );
    }
    this.DisableButton();
  }

  creatAll(ObjectForm) {
    if (this.positionId) {
      ObjectForm._id = this.positionId;
      this.apiService.updated<Xodimlar>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Xodimlar>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterXodimlar, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Xodimlar>>(params, this.className)
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
    const params = Object.assign({}, this.filterXodimlar, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Xodimlar>>(params, this.className)
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
}
