import {Component, HostListener, OnInit} from '@angular/core';
import {FumigatsiyaTuri, Preparatlar, UlchovBirligi, Xuquqlar} from '../../classes/interfaceSpr';
import {FilterName} from '../../classes/sprFilter';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {PageResponse} from '../../classes/pageResponse';

@Component({
  selector: 'app-preparatlar',
  templateUrl: './preparatlar.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class PreparatlarComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomi', 'xuquqlar', 'ulchovBirligi', 'narxi', 'fumigatsiyaTuri'];

  xuquqlar: Xuquqlar[] = [];
  xuqularName: Xuquqlar;

  fumigatsiyaTuri: FumigatsiyaTuri[] = [];
  fumiatsiyaTuriname: FumigatsiyaTuri;
  ulchovBirligi: UlchovBirligi[] = [];
  ulchovBirligiName: UlchovBirligi;
  filterPreparatlar: FilterName = {};

  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: Preparatlar;
  reloading = false;
  positionId: string;
  className = 'preparatlar';
  list: Preparatlar;
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
      narxi: new FormControl(null, Validators.required),
      xuquqId: new FormControl('', Validators.required),
      xuquqName: new FormControl(''),
      fumigatsiyaId: new FormControl(null, Validators.required),
      ulchovBirligiId: new FormControl(null)
    });
    this.getFumitagsiyaTuri();
    this.getUlchovBirligi();
    this.getXuqular();
    this.getAll();
  }

  opeFilterDialog(): void {
    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {name: this.filterPreparatlar.name, SPR: 'Препарат номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterPreparatlar.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterPreparatlar.name = null;
          this.getAll();
        }
      }
    });
  }

  onSubmit() {
    const newPreparatlar: Preparatlar = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      narxi: this.form.value.narxi,
      xuquqId: this.form.value.xuquqId,
      xuquqName: this.form.value.xuquqName,
      ulchovBirligiId: this.form.value.ulchovBirligiId,
      fumigatsiyaId: this.form.value.fumigatsiyaId
    };
    if (newPreparatlar) {
      this.creatAll(newPreparatlar);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.EnableButton();
    }
    this.fumiatsiyaTuriname = null;
    this.ulchovBirligiName = null;
  }

  addObject() {
    this.fumiatsiyaTuriname = null;
    this.ulchovBirligiName = null;
    this.xuqularName = null;
    this.addNewObject();
  }

  editObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        narxi: this.selectedItem.narxi,
        xuquqId: this.selectedItem.xuquqId,
        xuquqName: this.selectedItem.xuquqName,
        ulchovBirligiId: this.selectedItem.ulchovBirligiId,
        fumigatsiyaId: this.selectedItem.fumigatsiyaId
      });
      if (this.xuquqlar.length > 0 && this.selectedItem.xuquqId) {
        this.xuqularName = this.xuquqlar.find(x => x._id === this.selectedItem.xuquqId);
      }
      if (this.fumigatsiyaTuri.length > 0 && this.selectedItem.fumigatsiyaId) {
        this.fumiatsiyaTuriname = this.fumigatsiyaTuri.find(x => x._id === this.selectedItem.fumigatsiyaId);
      } else {
        this.fumiatsiyaTuriname = null;
      }
      if (this.ulchovBirligi.length > 0 && this.selectedItem.ulchovBirligiId) {
        this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === this.selectedItem.ulchovBirligiId);
      } else {
        this.ulchovBirligiName = null;
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
        narxi: this.selectedItem.narxi,
        xuquqId: this.selectedItem.xuquqId,
        xuquqName: this.selectedItem.xuquqName,
        fumigatsiyaId: this.selectedItem.fumigatsiyaId,
        ulchovBirligiId: this.selectedItem.ulchovBirligiId,
        tartibRaqam: this.totalDocs + 1
      });
      if (this.xuquqlar.length > 0 && this.selectedItem.xuquqId) {
        this.xuqularName = this.xuquqlar.find(x => x._id === this.selectedItem.xuquqId);
      }
      if (this.fumigatsiyaTuri.length > 0 && this.selectedItem.fumigatsiyaId) {
        this.fumiatsiyaTuriname = this.fumigatsiyaTuri.find(x => x._id === this.selectedItem.fumigatsiyaId);
      }
      if (this.ulchovBirligi.length > 0 && this.selectedItem.ulchovBirligiId) {
        this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === this.selectedItem.ulchovBirligiId);
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
    this.filterPreparatlar = {};
    this.xuqularName = null;
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.getFumitagsiyaTuri();
    this.getUlchovBirligi();
    this.getAll();
    this.EnableButton();
    this.form.reset();
  }

  getFumitagsiyaTuri() {
    this.apiService.getAll<FumigatsiyaTuri>('fumigatsiyaTuri/')
      .subscribe(result => {
        this.fumigatsiyaTuri = result;
      });
  }

  getUlchovBirligi() {
    this.apiService.getAll<UlchovBirligi>('ulchovBirligi/')
      .subscribe(result => {
        this.ulchovBirligi = result;
      });
  }

  getXuqular() {
    this.apiService.getAll<Xuquqlar>('xuquqlar/')
      .subscribe(result => {
        this.xuquqlar = result;
      });
  }

  getNameFumigatsiyaTuri(fumigatsiyaId) {
    if (this.fumigatsiyaTuri.length > 0 && fumigatsiyaId) {
      return this.fumigatsiyaTuri.find(x => x._id === fumigatsiyaId).name;
    }
  }

  getNameUlchovBirligi(ulchovBirligiId) {
    if (this.ulchovBirligi.length > 0 && ulchovBirligiId) {
      return this.ulchovBirligi.find(x => x._id === ulchovBirligiId).name;
    }
  }

  onChangeXuquqlar(event) {
    if (event) {
      this.form.get('xuquqId').setValue(event._id);
      this.form.get('xuquqName').setValue(event.name);
    } else {
      this.form.get('xuquqId').setValue('');
      this.form.get('xuquqName').setValue('');
    }
  }

  onChangeFumigatsiyaTuri(event) {
    this.form.get('fumigatsiyaId').setValue(event._id);
  }

  onChangeUlchovBirligi(event) {
    this.form.get('ulchovBirligiId').setValue(event._id);
  }

  onCloseForm() {
    this.fumiatsiyaTuriname = null;
    this.ulchovBirligiName = null;
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
      this.apiService.updated<Preparatlar>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Preparatlar>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterPreparatlar, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Preparatlar>>(params, this.className)
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
    const params = Object.assign({}, this.filterPreparatlar, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Preparatlar>>(params, this.className)
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
