import {Component, HostListener, OnInit} from '@angular/core';
import {Maxsulotalar} from '../../classes/interfaceSpr';
import {FilterName} from '../../classes/sprFilter';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {PageResponse} from '../../classes/pageResponse';

@Component({
  selector: 'app-maxsulotlar',
  templateUrl: './maxsulotlar.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class MaxsulotlarComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomi', 'botanik', 'tiftnkod', 'ruschanomi', 'ingilizcha'];
  filterMaxsulotlar: FilterName = {};

  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: Maxsulotalar;
  reloading = false;
  positionId: string;
  className = 'maxsulotlar';
  list: Maxsulotalar;
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
      this.closeObject();
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      tartibRaqam: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      name: new FormControl(null, Validators.required),
      botanikNomi: new FormControl(null),
      TIFTNKODI: new FormControl(null),
      ruschaNomi: new FormControl(null),
      inglizchaNomi: new FormControl(null),
    });
    this.getAll();
  }

  opeFilterDialog(): void {
    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {name: this.filterMaxsulotlar.name, SPR: 'Махсулот номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterMaxsulotlar.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterMaxsulotlar.name = null;
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  onSubmit() {
    const newMaxsulotlar: Maxsulotalar = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      botanikNomi: this.form.value.botanikNomi,
      TIFTNKODI: this.form.value.TIFTNKODI,
      ruschaNomi: this.form.value.ruschaNomi,
      inglizchaNomi: this.form.value.inglizchaNomi,
    };
    if (newMaxsulotlar) {
      this.creatAll(newMaxsulotlar);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.EnableButton();
    }
  }

  editObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        botanikNomi: this.selectedItem.botanikNomi,
        TIFTNKODI: this.selectedItem.TIFTNKODI,
        ruschaNomi: this.selectedItem.ruschaNomi,
        inglizchaNomi: this.selectedItem.inglizchaNomi,
      });
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
    this.DisableButton();
  }

  copyObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        botanikNomi: this.selectedItem.botanikNomi,
        TIFTNKODI: this.selectedItem.TIFTNKODI,
        ruschaNomi: this.selectedItem.ruschaNomi,
        inglizchaNomi: this.selectedItem.inglizchaNomi,
        tartibRaqam: this.totalDocs + 1
      });
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
    this.filterMaxsulotlar = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.getAll();
    this.EnableButton();
    this.form.reset();
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
      this.apiService.updated<Maxsulotalar>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Maxsulotalar>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterMaxsulotlar, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Maxsulotalar>>(params, this.className)
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
    const params = Object.assign({}, this.filterMaxsulotlar, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Maxsulotalar>>(params, this.className)
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
