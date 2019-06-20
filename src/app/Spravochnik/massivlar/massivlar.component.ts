import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {Massivlar, Tumanlar, Viloyatlar} from '../../classes/interfaceSpr';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {FilterName} from '../../classes/sprFilter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PageResponse} from '../../classes/pageResponse';

@Component({
  selector: 'app-massivlar',
  templateUrl: './massivlar.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class MassivlarComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomi'];
  tumanlar: Tumanlar[] = [];
  tumanlarName: Tumanlar;
  viloyatlar: Viloyatlar[] = [];
  viloyatlarName: Viloyatlar;
  viloyatId: Viloyatlar;
  filterMassivlar: FilterName = {};
  tumanDisabled = false;

  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: Massivlar;
  reloading = false;
  positionId: string;
  className = 'massivlar';
  list: Massivlar;
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
      viloyatId: new FormControl(null, Validators.required),
      tumanId: new FormControl(null, Validators.required)
    });
    this.getViloyatlar();
    this.getAll();
  }

  opeFilterDialog(): void {

    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {name: this.filterMassivlar.name, SPR: 'Массив номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterMassivlar.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterMassivlar.name = null;
          this.getViloyatlar();
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  onSubmit() {
    const newMassivlar: Massivlar = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      viloyatId: this.form.value.viloyatId,
      tumanId: this.form.value.tumanId
    };
    if (newMassivlar) {
      this.creatAll(newMassivlar);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.EnableButton();
    }
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.tumanDisabled = false;
  }

  addObject() {
    this.tumanDisabled = false;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.tumanlar = null;
    this.addNewObject();
  }

  editObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        viloyatId: this.selectedItem.viloyatId,
        tumanId: this.selectedItem.tumanId,
      });
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
        this.tumanDisabled = false;
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
    this.DisableButton();
  }

  copyObject() {
    if (this.selectedItem) {
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
        this.tumanDisabled = false;
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      this.form.patchValue({
        name: this.selectedItem.name,
        viloyatId: this.selectedItem.viloyatId,
        tumanId: this.selectedItem.tumanId,
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
      this.tumanDisabled = false;
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  onResetForm() {
    this.filterMassivlar = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.tumanDisabled = false;
    this.getViloyatlar();
    this.getAll();
    this.EnableButton();
    this.form.reset();
  }

  getViloyatlar() {
    this.apiService.getAll<Viloyatlar>('viloyatlar/')
      .subscribe(result => {
        this.viloyatlar = result;
      });
    this.tumanlar = null;
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

    }
  }


  onChangeViloyatlar(event) {
    this.form.get('viloyatId').setValue(event._id);
    if (event._id) {
      this.viloyatId = event;
      this.getTumanlar();
    }
  }

  onChangeTumanlar(event) {
    this.form.get('tumanId').setValue(event._id);
  }

  onCloseForm() {
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.tumanlar = null;
    this.tumanDisabled = false;
    this.closeObject();
  }

  selectedTuman(row) {
    this.form.reset();
    this.viloyatlarName = null;
    this.selectedItem = row;
    this.positionId = row._id;
    this.tumanDisabled = true;
    this.EnableButton();
    if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
      this.viloyatId = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      this.getTumanlar();
    }
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
      this.apiService.updated<Massivlar>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Massivlar>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterMassivlar, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Massivlar>>(params, this.className)
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
    const params = Object.assign({}, this.filterMassivlar, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Massivlar>>(params, this.className)
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
