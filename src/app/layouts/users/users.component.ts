import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Foydalanuvchi, Xodimlar, Xuquqlar} from '../../classes/interfaceSpr';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {FilterName} from '../../classes/sprFilter';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {PageResponse} from '../../classes/pageResponse';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('imageInput') inputRef: ElementRef;

  displayedColumns: string[] = ['id', 'nomi', 'xodim', 'xuquqi'];
  xuquqlar: Xuquqlar[] = [];
  XuquqName: Xuquqlar;
  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;
  filterFoydalanuvchi: FilterName = {};
  qayta = true;
  image: File;
  imagePreview: string | ArrayBuffer = '';

  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: Foydalanuvchi;
  reloading = false;
  positionId: string;
  className = 'foydalanuvchi';
  list: Foydalanuvchi;
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
    if (event.key === 'Delete') {
      this.deleteUser();
    }
    if (event.key === 'Escape') {
      this.closeObject();
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      tartibRaqam: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      xuquqId: new FormControl(null, Validators.required),
      xuquqName: new FormControl(''),
      xodimId: new FormControl(null, Validators.required),
      xodimName: new FormControl(''),
      viloyatId: new FormControl(''),
      imageSrc: new FormControl(''),
      qaytmaxfiy: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
    this.objectAllComponent();
    this.getXodimlar();
    this.getAll();
  }

  opeFilterDialog(): void {
    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {nomi: this.filterFoydalanuvchi.name, SPR: 'Фойдаланувчи номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.nomi && result.ok) {
        this.filterFoydalanuvchi.name = result.nomi;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterFoydalanuvchi.name = null;
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  onFileUpload(event) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result
    };
    reader.readAsDataURL(file);
  }

  onFileClear() {
    this.image = new File([], '',);
    this.imagePreview = '';
  }

  onSubmit() {
    this.registerUser();
    this.XuquqName = null;
    this.xodimlarName = null;
    this.getAll();
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.form.reset();
    this.EnableButton();
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  registerUser() {
    const newFoydalanuvchi: Foydalanuvchi = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      password: this.form.value.password,
      xuquqId: this.form.value.xuquqId,
      xodimId: this.form.value.xodimId,
      xodimName: this.form.value.xodimName,
      xuquqName: this.form.value.xuquqName,
      viloyatId: this.form.value.viloyatId,
      imageSrc: this.form.value.imageSrc,
    };
    if (newFoydalanuvchi) {
      const fd = new FormData();
      if (this.image) {
        fd.append('image', this.image, this.image.name);
      }
      fd.append('name', newFoydalanuvchi.name);
      fd.append('tartibRaqam', String(newFoydalanuvchi.tartibRaqam));
      fd.append('password', newFoydalanuvchi.password);
      fd.append('xuquqId', newFoydalanuvchi.xuquqId);
      fd.append('xodimId', newFoydalanuvchi.xodimId);
      fd.append('xodimName', newFoydalanuvchi.xodimName);
      fd.append('xuquqName', newFoydalanuvchi.xuquqName);
      fd.append('viloyatId', newFoydalanuvchi.viloyatId);
      this.creatAll(fd);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.positionId = null;
    }
  }

  editObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        password: this.selectedItem.password,
        xuquqId: this.selectedItem.xuquqId,
        xuquqName: this.selectedItem.xuquqId,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimId,
        viloyatId: this.selectedItem.viloyatId,
        imageSrc: this.selectedItem.imageSrc,
      });
      this.imagePreview = this.selectedItem.imageSrc;
      if (this.xuquqlar.length > 0 && this.selectedItem.xuquqId) {
        this.XuquqName = this.xuquqlar.find(x => x._id === this.selectedItem.xuquqId);
      } else {
        this.XuquqName = null;
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimId);
      } else {
        this.xodimlarName = null;
      }
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  copyObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.totalDocs + 1,
        xuquqId: this.selectedItem.xuquqId,
        xuquqName: this.selectedItem.xuquqId,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimId,
        viloyatId: this.selectedItem.viloyatId,
        imageSrc: this.selectedItem.imageSrc,
        password: null
      });
      this.imagePreview = this.selectedItem.imageSrc;
      if (this.xuquqlar.length > 0 && this.selectedItem.xuquqId) {
        this.XuquqName = this.xuquqlar.find(x => x._id === this.selectedItem.xuquqId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimId);
      }
      this.positionId = null;
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  deleteUser() {
    if (this.positionId) {
      this.deleteObject(this.selectedItem);
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  objectAllComponent() {
    this.apiService.getAll<Xuquqlar>('xuquqlar/')
      .subscribe(result => {
        this.xuquqlar = result;
      });
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  onChange(event) {
    this.form.get('xuquqId').setValue(event._id);
    this.form.get('xuquqName').setValue(event.name);
  }

  onChangeXodimlar(event) {
    this.form.get('xodimId').setValue(event._id);
    this.form.get('xodimName').setValue(event.name);
    this.form.get('viloyatId').setValue(event.viloyatId);
  }

  getNameXuquq(id) {
    if (this.xuquqlar.length > 0 && id) {
      return this.xuquqlar.find(x => x._id === id).name;
    }
  }

  getNameXodim(id) {
    if (this.xodimlar.length > 0 && id) {
      return this.xodimlar.find(x => x._id === id).name;
    }
  }

  PasswordConfilickt() {
    this.qayta = this.form.controls.password.value === this.form.controls.qaytmaxfiy.value;
    // if (!this.qayta) {
    //   this.openSnackBar('Кайта махфий ракам нотўғри киритилди', 'Текширинг!', 3);
    //   this.form.get('qaytmaxfiy').setValue('');
    // }
  }

  onResetForm() {
    this.filterFoydalanuvchi = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.objectAllComponent();
    this.getAll();
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

  creatAll(ObjectForm) {
    if (this.positionId) {
      ObjectForm._id = this.positionId;
      this.apiService.updated<Foydalanuvchi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Foydalanuvchi>('foydalanuvchi/register', ObjectForm)
        .subscribe(
          () => this.openSnackBar('Маълумот сақланди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    }
    this.positionId = null;
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

  getAll() {
    this.reloading = true;
    const params = Object.assign({}, this.filterFoydalanuvchi, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Foydalanuvchi>>(params, this.className)
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
    const params = Object.assign({}, this.filterFoydalanuvchi, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Foydalanuvchi>>(params, this.className)
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
