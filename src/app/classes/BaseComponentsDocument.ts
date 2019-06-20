import {RoutService} from '../services/rout.service';
import {LocalStorageService} from '../services/local-storage.service';
import {Foydalanuvchi} from './interfaceSpr';
import {PageResponse} from './pageResponse';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../services/rest-client-documents.service';


export abstract class BaseComponentsDocument<T> {
  protected Buttons: boolean;
  protected restClientService: RestClientDocumentsService;
  protected snackBarObject: MatSnackBar;
  protected firstFormGroup: FormGroup;
  protected secondFormGroup: FormGroup;
  protected formBuilder: FormBuilder;
  protected tartibRaqamLength: number;
  protected positionId: string;
  protected rout: RoutService;
  protected className: string;
  protected isVisbleForm = false;
  protected list: T;
  protected selectedItem: T;
  protected page = 1;
  protected reloading = false;
  protected pageSize = 10;
  protected totalPages: number;
  protected totalDocs: number;
  protected hasNextPage = false;
  protected hasPrevPage = false;
  protected pagingCounter: number;
  protected prevPage = false;
  protected nextPage = false;
  protected db: LocalStorageService;
  protected user: Foydalanuvchi;
  protected filter = {};

  constructor(apiService: RestClientDocumentsService, appRout: RoutService,
              className: string, loacalDb: LocalStorageService, snackBar: MatSnackBar, formBuilder: FormBuilder) {
    this.restClientService = apiService;
    this.className = className;
    this.rout = appRout;
    this.db = loacalDb;
    this.snackBarObject = snackBar;
    this.formBuilder = formBuilder;
  }

  protected EnableButton() {
    this.Buttons = false;
  }

  protected DisableButton() {
    this.Buttons = true;
  }

  protected goHome() {
    this.rout.goHome();
  }


  protected creatAll(ObjectForm) {
    if (this.positionId) {
      ObjectForm._id = this.positionId;
      this.restClientService.updated<T>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          result => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.restClientService.creted<T>(this.className, ObjectForm)
        .subscribe(
          result => this.openSnackBar('Маълумот сақланди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    }
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.firstFormGroup.reset();
    this.positionId = null;
    this.EnableButton();
  }

  protected getAll() {
    const params = Object.assign({}, this.filter, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.restClientService.getAllByPagePost<PageResponse<T>>(params, this.className)
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
      }, error => {
        this.reloading = true;
      });
    this.EnableButton();
  }

  protected hasPrevPageGet() {
    this.page = 1;
    this.getAll();
    this.reloading = true;
  }

  protected prevPageGet() {
    this.page = this.page - 1;
    this.getAll();
    this.reloading = true;
  }

  protected nextPageGet() {
    if (this.totalPages > this.page) {
      this.page = this.page + 1;
    } else {
      this.page = this.totalPages;
    }
    this.getAll();
    this.reloading = true;
  }

  protected hasNextPageGet() {
    this.page = this.totalPages;
    this.getAll();
    this.reloading = true;
  }

  protected getPage() {
    if (this.page > this.totalPages) {
      this.page = this.totalPages;
    }
    this.getAll();
    this.reloading = true;
  }

  protected addNewObject() {
    this.isVisbleForm = true;
    this.selectedItem = null;
    this.tartibRaqamLength = this.totalDocs + 1;
    this.firstFormGroup.reset();
    this.firstFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.positionId = null;
    this.DisableButton();

  }

  protected selectedRow(row) {
    this.selectedItem = row;
    this.positionId = row._id;
    this.EnableButton();
    this.firstFormGroup.reset();
  }

  protected closeObject() {
    this.selectedItem = null;
    this.secondFormGroup.reset();
    this.isVisbleForm = false;
    this.positionId = null;
    this.EnableButton();

  }

  protected deleteObject(item) {
    const decision = window.confirm(`"${item.name}" қаторини ўчиришни хохлайсизми!`);
    if (decision) {
      this.restClientService.delete(this.positionId, this.className)
        .subscribe(
          response =>
            this.openSnackBar(response.message, 'Тасдиқлаш', 2),
          error => this.openSnackBar(error.error.message, 'Хатолик', 2),
          () => this.getAll()
        );
    }
    this.DisableButton();
  }

  protected openSnackBar(message: string, action: string, duration: number) {
    this.snackBarObject.open(message, action, {
      duration: duration * 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  protected getByFilter() {
    const params = Object.assign({}, this.filter, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.restClientService.getFilter<PageResponse<T>>(params, this.className)
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
