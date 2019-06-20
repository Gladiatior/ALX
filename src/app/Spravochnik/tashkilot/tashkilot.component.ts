import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Tashkilotlar, TashkilotXisobRaqamlar, Viloyatlar} from '../../classes/interfaceSpr';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {FilterName} from '../../classes/sprFilter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {PageResponse} from '../../classes/pageResponse';


@Component({
  selector: 'app-tashkilot',
  templateUrl: './tashkilot.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class TashkilotComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomi', 'viloyat', 'inn', 'raxbar'];
  viloyatlar: Viloyatlar[] = [];
  viloyatlarName: Viloyatlar;
  filterTashkilotlar: FilterName = {};
  selectXisobRaqam: TashkilotXisobRaqamlar;
  xisobRaqamlar: TashkilotXisobRaqamlar[] = [];

  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: Tashkilotlar;
  reloading = false;
  positionId: string;
  className = 'tashkilotlar';
  list: Tashkilotlar;
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
      tuliqNomi: new FormControl(null),
      inn: new FormControl(null, Validators.required),
      oked: new FormControl(null),
      manzili: new FormControl(null),
      telefon: new FormControl(null),
      raxbar: new FormControl(null),
      viloyatId: new FormControl(null),
      nameXis: new FormControl(null),
      tartibRaqamXis: new FormControl(null),
      xisobRaqamxis: new FormControl(null),
      bankId: new FormControl(null),
      mfo: new FormControl(null)
    });
    this.getViloyatlar();
    this.getAll();
  }

  opeFilterDialog(): void {
    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {name: this.filterTashkilotlar.name, SPR: 'Ташкилот номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterTashkilotlar.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterTashkilotlar.name = null;
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  onSubmit() {
    const newTashkilotlar: Tashkilotlar = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      tuliqNomi: this.form.value.tuliqNomi,
      inn: this.form.value.inn,
      oked: this.form.value.oked,
      manzili: this.form.value.manzili,
      telefon: this.form.value.telefon,
      raxbar: this.form.value.raxbar,
      viloyatId: this.form.value.viloyatId,
      xisobRaqamlar: this.xisobRaqamlar
    };
    if (newTashkilotlar) {
      this.creatAll(newTashkilotlar);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.EnableButton();
    }
    this.viloyatlarName = null;
    this.xisobRaqamlar.splice(0, this.xisobRaqamlar.length);
  }

  addObject() {
    this.viloyatlarName = null;
    this.addNewObject();
  }

  editObject() {
    this.DisableButton();
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        tuliqNomi: this.selectedItem.tuliqNomi,
        inn: this.selectedItem.inn,
        oked: this.selectedItem.oked,
        manzili: this.selectedItem.manzili,
        telefon: this.selectedItem.telefon,
        raxbar: this.selectedItem.raxbar,
        viloyatId: this.selectedItem.viloyatId,
        xisobRaqamlar: this.selectedItem.xisobRaqamlar
      });
      if (this.selectedItem.xisobRaqamlar) {
        this.xisobRaqamlar = this.selectedItem.xisobRaqamlar;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      } else {
        this.viloyatlarName = null;
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
        tuliqNomi: this.selectedItem.tuliqNomi,
        inn: this.selectedItem.inn,
        oked: this.selectedItem.oked,
        manzili: this.selectedItem.manzili,
        telefon: this.selectedItem.telefon,
        raxbar: this.selectedItem.raxbar,
        viloyatId: this.selectedItem.viloyatId,
        xisobRaqamlar: this.selectedItem.xisobRaqamlar,
        tartibRaqam: this.totalDocs + 1
      });
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
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
    this.filterTashkilotlar = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
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
  }

  getNameViloyat(viloyatId) {
    if (this.viloyatlar.length > 0 && viloyatId) {
      return this.viloyatlar.find(x => x._id === viloyatId).name;
    }
  }

  onChangeViloyat(event) {
    this.form.get('viloyatId').setValue(event._id);
  }

  onCloseForm() {
    this.viloyatlarName = null;
    this.xisobRaqamlar.splice(0, this.xisobRaqamlar.length);
    this.closeObject();
  }

  selectedRowTashkilot(row) {
    this.selectedItem = row;
    this.positionId = row._id;
    this.isVisbleForm = false;
  }

  selectedXisobRaqam(xisoboraqam) {
    this.selectXisobRaqam = xisoboraqam;
  }

  adder() {
    const idx = this.xisobRaqamlar.find(p => p.tartibRaqam === this.form.value.tartibRaqamXis);
    if (idx) {
      this.openSnackBar('Бир хил тартиб рақам билан киритиш мумкин эмас!', 'Хатолик', 3);
      return;
    }
    this.xisobRaqamlar.push(
      {
        name: this.form.value.nameXis,
        tartibRaqam: this.form.value.tartibRaqamXis,
        xisobRaqam: this.form.value.xisobRaqamxis,
        bankId: this.form.value.bankId,
        mfo: this.form.value.mfo
      }
    );
    this.form.patchValue({
      tartibRaqamXis: this.xisobRaqamlar.length + 1,
      nameXis: '',
      xisobRaqamxis: '',
      bankId: '',
      mfo: ''
    });
  }

  editXisobRaqam() {
    if (this.selectXisobRaqam) {
      this.form.patchValue({
        nameXis: this.selectXisobRaqam.name,
        tartibRaqamXis: this.selectXisobRaqam.tartibRaqam,
        xisobRaqamxis: this.selectXisobRaqam.xisobRaqam,
        bankId: this.selectXisobRaqam.bankId,
        mfo: this.selectXisobRaqam.mfo
      });
    }
  }

  deleteXisobRaqam() {
    if (this.selectXisobRaqam) {
      const idx = this.xisobRaqamlar.find(p => p.xisobRaqam === this.selectXisobRaqam.xisobRaqam).tartibRaqam - 1;
      this.xisobRaqamlar.splice(idx, 1);
    }
  }

  onOpenPanel() {
    if (this.xisobRaqamlar) {
      this.form.patchValue({
        tartibRaqamXis: this.xisobRaqamlar.length + 1
      });
    } else {
      this.form.patchValue({
        tartibRaqamXis: 1
      });
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
      this.apiService.updated<Tashkilotlar>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Tashkilotlar>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterTashkilotlar, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Tashkilotlar>>(params, this.className)
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
    const params = Object.assign({}, this.filterTashkilotlar, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Tashkilotlar>>(params, this.className)
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
