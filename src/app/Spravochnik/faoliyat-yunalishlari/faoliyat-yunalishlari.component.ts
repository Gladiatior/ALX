import {Component, HostListener, OnInit} from '@angular/core';
import {FaoliyatTuri, FaoliyatYunalishi, FumigatsiyaTuri} from '../../classes/interfaceSpr';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FilterName} from '../../classes/sprFilter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {PageResponse} from '../../classes/pageResponse';

@Component({
  selector: 'app-faoliyat-yunalishlari',
  templateUrl: './faoliyat-yunalishlari.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class FaoliyatYunalishlariComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomi', 'faoliyatTuri'];
  faoliyatTuri: FaoliyatTuri[] = [];
  faoliyatTuriName: FaoliyatTuri;
  filterFaoliyatYunalishi: FilterName = {};

  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: FaoliyatYunalishi;
  reloading = false;
  positionId: string;
  className = 'faoliyatYunalishlari';
  list: FaoliyatYunalishi;
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
      this.addObject();
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
      faoliyatTuriId: new FormControl(null, Validators.required),
    });
    this.getFaoliyatTuri();
    this.getAll();
  }

  opeFilterDialog(): void {
    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {name: this.filterFaoliyatYunalishi.name, SPR: 'Фаолият йўналиши номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterFaoliyatYunalishi.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterFaoliyatYunalishi.name = null;
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  onSubmit() {
    const newFaoliyatYunalishi: FaoliyatYunalishi = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      faoliyatTuriId: this.form.value.faoliyatTuriId
    };
    if (newFaoliyatYunalishi) {
      this.creatAll(newFaoliyatYunalishi);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.EnableButton();
    }
    this.faoliyatTuriName = null;
  }

  addObject() {
    this.faoliyatTuriName = null;
    this.addNewObject();
  }

  editObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        faoliyatTuriId: this.selectedItem.faoliyatTuriId
      });
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
      } else {
        this.faoliyatTuriName = null;
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
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        tartibRaqam: this.totalDocs + 1
      });
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
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
    this.filterFaoliyatYunalishi = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.getFaoliyatTuri();
    this.getAll();
    this.EnableButton();
    this.reloading = true;
    this.form.reset();
  }

  getFaoliyatTuri() {
    this.apiService.getAll<FumigatsiyaTuri>('faoliyatTuri/')
      .subscribe(result => {
        this.faoliyatTuri = result;
      });
  }


  getNameFaoliyatTuri(faoliyatTuriId) {
    if (this.faoliyatTuri.length > 0 && faoliyatTuriId) {
      return this.faoliyatTuri.find(x => x._id === faoliyatTuriId).name;
    }
  }


  onChangeFaoliyatTuri(event) {
    this.form.get('faoliyatTuriId').setValue(event._id);
  }


  onCloseForm() {
    this.faoliyatTuriName = null;
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
      this.apiService.updated<FaoliyatYunalishi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<FaoliyatYunalishi>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterFaoliyatYunalishi, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<FaoliyatYunalishi>>(params, this.className)
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

  openSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration: duration * 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  getByFilter() {
    this.reloading = true;
    const params = Object.assign({}, this.filterFaoliyatYunalishi, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<FaoliyatYunalishi>>(params, this.className)
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
