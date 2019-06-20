import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {ImagesTypes, Zararkunandalar, ZararkunandalarTuri} from '../../classes/interfaceSpr';
import {FilterName} from '../../classes/sprFilter';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PageResponse} from '../../classes/pageResponse';

@Component({
  selector: 'app-zararkunandalar',
  templateUrl: './zararkunandalar.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class ZararkunandalarComponent implements OnInit {
  @ViewChild('imageInput') inputRef: ElementRef;
  filesToUpload: Array<File> = [];
  filterZararkunandalar: FilterName = {};
  displayedColumns: string[] = ['id', 'nomi', 'zararkunandalarTuri'];
  zararkunandalarTuri: Zararkunandalar[] = [];
  zararkunandalarTuriName: Zararkunandalar;
  imagePreview: string | ArrayBuffer = '';
  indexImages = 0;
  imageSrc: ImagesTypes[] = [];
  deleteImage = true;
  ortgaDisable = true;
  oldingaDistable = true;
  EditCopySelected: boolean;


  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: Zararkunandalar;
  reloading = false;
  positionId: string;
  className = 'zararkunandalar';
  list: Zararkunandalar;
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
      lotinchaNomi: new FormControl(null),
      izoxi: new FormControl(null),
      zararkunandalarTuriId: new FormControl(null, Validators.required),
      imageSrc: new FormControl(null),
    });
    this.getZararkunandalarTuri();
    this.getAll();
  }

  opeFilterDialog(): void {
    const dialogRef = this.dialogFilter.open(FilterNameSprComponent, {
      width: '350px',
      data: {name: this.filterZararkunandalar.name, SPR: 'Зараркунанда номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterZararkunandalar.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterZararkunandalar.name = null;
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  selectedRowForm(row) {
    this.selectedItem = row;
    this.positionId = row._id;
    this.EnableButton();
    this.form.reset();
    this.EditCopySelected = false;
    this.imagePreview = '';
    this.zararkunandalarTuriName = null;
    this.oldingaDistable = true;
    this.ortgaDisable = true;
  }

  onSubmit() {
    const newZararkunandalar: Zararkunandalar = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      lotinchaNomi: this.form.value.lotinchaNomi,
      izoxi: this.form.value.izoxi,
      zararkunandalarTuriId: this.form.value.zararkunandalarTuriId,
      imageSrc: this.imageSrc
    };
    if (newZararkunandalar) {
      const fd = new FormData();
      if (this.filesToUpload) {
        for (const value of this.filesToUpload) {
          fd.append('image', value, value.name);
        }
        fd.append('name', newZararkunandalar.name);
        fd.append('tartibRaqam', String(newZararkunandalar.tartibRaqam));
        fd.append('lotinchaNomi', newZararkunandalar.lotinchaNomi);
        fd.append('izoxi', newZararkunandalar.izoxi);
        fd.append('zararkunandalarTuriId', newZararkunandalar.zararkunandalarTuriId);
      }
      this.creatAll(fd);
    }
    this.zararkunandalarTuriName = null;
    this.imageSrc.splice(0, this.imageSrc.length);
    this.filesToUpload.splice(0, this.filesToUpload.length);
    this.imagePreview = '';
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.form.reset();
    this.EnableButton();
  }

  addObject() {
    this.EditCopySelected = false;
    this.zararkunandalarTuriName = null;
    this.imageSrc.splice(0, this.imageSrc.length);
    this.filesToUpload.splice(0, this.filesToUpload.length);
    this.addNewObject();
  }

  editObject() {
    this.DisableButton();
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        lotinchaNomi: this.selectedItem.lotinchaNomi,
        izoxi: this.selectedItem.izoxi,
        kasallikTuriId: this.selectedItem.zararkunandalarTuriId,
        imageSrc: this.selectedItem.imageSrc,
      });
      if (this.selectedItem.imageSrc && this.selectedItem.imageSrc.length > 1) {
        this.imageSrc = this.selectedItem.imageSrc;
        this.imagePreview = this.selectedItem.imageSrc[1].url;
      } else {
        this.imagePreview = '';
      }
      if (this.zararkunandalarTuri.length > 0 && this.selectedItem.zararkunandalarTuriId) {
        this.zararkunandalarTuriName = this.zararkunandalarTuri.find(x => x._id === this.selectedItem.zararkunandalarTuriId);
      } else {
        this.zararkunandalarTuriName = null;
      }
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
    this.DisableButton();
    this.EditCopySelected = true;
    if (this.selectedItem.imageSrc.length > 2) {
      this.oldingaDistable = false;
      this.ortgaDisable = true;
      this.indexImages = 0;
    } else {
      this.oldingaDistable = true;
      this.ortgaDisable = true;
      this.indexImages = 0;
    }
  }

  copyObject() {
    this.DisableButton();
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        lotinchaNomi: this.selectedItem.lotinchaNomi,
        izoxi: this.selectedItem.izoxi,
        kasallikTuriId: this.selectedItem.zararkunandalarTuriId,
        imageSrc: this.selectedItem.imageSrc,
        tartibRaqam: this.totalDocs + 1
      });
      if (this.selectedItem.imageSrc) {
        this.imagePreview = '';
      }
      if (this.zararkunandalarTuri.length > 0 && this.selectedItem.zararkunandalarTuriId) {
        this.zararkunandalarTuriName = this.zararkunandalarTuri.find(x => x._id === this.selectedItem.zararkunandalarTuriId);
      }
      this.positionId = null;
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
    this.DisableButton();
    this.form.enable();
    this.EditCopySelected = true;
    if (this.selectedItem.imageSrc.length > 2) {
      this.oldingaDistable = false;
      this.ortgaDisable = true;
      this.indexImages = 0;
    } else {
      this.oldingaDistable = true;
      this.ortgaDisable = true;
      this.indexImages = 0;
    }
  }

  deleteObjectForm() {
    if (this.positionId) {
      this.deleteObject(this.selectedItem);
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  onResetForm() {
    this.filterZararkunandalar = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.getZararkunandalarTuri();
    this.getAll();
    this.EnableButton();
    this.form.reset();
    this.form.enable();
    this.EditCopySelected = false;
    this.imageSrc.splice(0, this.imageSrc.length);
    this.filesToUpload.splice(0, this.filesToUpload.length);
    this.imagePreview = '';
  }

  getZararkunandalarTuri() {
    this.apiService.getAll<ZararkunandalarTuri>('zararkunandalarTuri/')
      .subscribe(result => {
        this.zararkunandalarTuri = result;
      });
  }

  getNameZararkunandalarTuri(zararkunandalarTuriId) {
    if (this.zararkunandalarTuri.length > 0 && zararkunandalarTuriId) {
      return this.zararkunandalarTuri.find(x => x._id === zararkunandalarTuriId).name;
    }
  }

  onChangeZararkunandalarTuri(event) {
    this.form.get('zararkunandalarTuriId').setValue(event._id);
  }

  onCloseForm() {
    this.zararkunandalarTuriName = null;
    this.imagePreview = '';
    this.oldingaDistable = true;
    this.ortgaDisable = true;
    this.closeObject();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.filesToUpload.push(file);
      this.indexImages = this.indexImages + 1;
      this.deleteImage = false;
      if (this.filesToUpload.length > 1) {
        this.ortgaDisable = false;
      }
    };
    reader.readAsDataURL(file);
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  deleteImages() {
    if (!this.EditCopySelected) {
      if (this.filesToUpload.length && this.indexImages) {
        this.filesToUpload.splice(this.indexImages - 1, 1);
        if (this.filesToUpload.length) {
          const file = this.filesToUpload[0];
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.imagePreview = reader.result;
            };
          }
        } else {
          this.imagePreview = '';
          this.deleteImage = true;
          this.ortgaDisable = true;
          this.oldingaDistable = true;
        }
      }
    } else {
      if (this.imageSrc.length && this.indexImages) {
        this.imageSrc.splice(this.indexImages, 1);
        this.imagePreview = this.imageSrc[this.indexImages - 1].url;
        this.indexImages = this.indexImages - 1;
      }
    }
  }

  ortga() {
    if (!this.EditCopySelected) {
      if (this.filesToUpload.length && this.indexImages) {
        if (this.filesToUpload.length > 1) {
          this.oldingaDistable = false;
          const file = this.filesToUpload[this.indexImages - 1];
          this.indexImages = this.indexImages - 1;
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.imagePreview = reader.result;
            };
          }
          if (this.indexImages === 1) {
            this.ortgaDisable = true;
          } else {
            this.ortgaDisable = false;
          }
        } else if (this.filesToUpload.length === 1) {
          const file = this.filesToUpload[0];
          this.ortgaDisable = true;
          this.oldingaDistable = true;
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.imagePreview = reader.result;
            };
          }
        }
      }
    } else {
      if (this.imageSrc.length > 1) {
        const images = this.imageSrc[this.indexImages - 1];
        this.indexImages = this.indexImages - 1;
        if (this.indexImages === 1) {
          this.imagePreview = this.imageSrc[1].url;
        } else {
          if (images) {
            this.imagePreview = images.url;
          } else {
            this.imagePreview = this.imageSrc[1].url;
          }
        }
        if (this.indexImages === 1) {
          this.ortgaDisable = true;
        } else {
          this.ortgaDisable = false;
        }
        this.oldingaDistable = false;
      }
    }
  }

  oldinga() {
    if (!this.EditCopySelected) {
      if (this.filesToUpload.length) {
        if (this.filesToUpload.length > 1) {
          this.indexImages = this.indexImages + 1;
          const file = this.filesToUpload[this.indexImages];
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.imagePreview = reader.result;
            };
          }
          this.ortgaDisable = false;
          if (this.filesToUpload.length > this.indexImages + 1) {
            this.oldingaDistable = false;
          } else {
            this.oldingaDistable = true;
          }
        } else if (this.filesToUpload.length === 1) {
          const file = this.filesToUpload[0];
          this.ortgaDisable = true;
          this.oldingaDistable = true;
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.imagePreview = reader.result;
            };
          }
        }
      }
    } else {
      if (this.imageSrc.length > 1) {
        this.indexImages = this.indexImages + 1;
        const images = this.imageSrc[this.indexImages];
        if (images) {
          this.imagePreview = images.url;
        }
        this.ortgaDisable = false;
        if (this.imageSrc.length > this.indexImages + 1) {
          this.oldingaDistable = false;
        } else {
          this.oldingaDistable = true;
        }
      }
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
      this.apiService.updated<Zararkunandalar>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Zararkunandalar>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterZararkunandalar, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<Zararkunandalar>>(params, this.className)
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
    const params = Object.assign({}, this.filterZararkunandalar, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<Zararkunandalar>>(params, this.className)
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
