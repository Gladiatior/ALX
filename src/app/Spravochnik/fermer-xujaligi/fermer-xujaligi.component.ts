import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FilterNameSprComponent} from '../../filter-name-spr/filter-name-spr.component';
import {
  FermerXujaligi,
  FermerXujaligiXisobRaqamlar,
  Massivlar,
  Tumanlar,
  Viloyatlar,
} from '../../classes/interfaceSpr';
import {RestClientService} from '../../services/rest-client.service';
import {RoutService} from '../../services/rout.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterName} from '../../classes/sprFilter';
import {PageResponse} from '../../classes/pageResponse';

interface Turi {
  name: string;
}

@Component({
  selector: 'app-fermer-xujaligi',
  templateUrl: './fermer-xujaligi.component.html',
  styleUrls: ['../../../assets/styles/spravochniks.css']
})
export class FermerXujaligiComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomi', 'inn', 'raxbar', 'turi'];
  fermerXujaligiTuri: Turi[] = [
    {name: 'Агро фирма'},
    {name: 'МЧЖ'},
    {name: 'Фермер хўжалиги'},
    {name: 'Хусусий корхона'},
    {name: 'ЯТТ'},
  ];
  selectXisobRaqam: FermerXujaligiXisobRaqamlar;
  xisobRaqamlar: FermerXujaligiXisobRaqamlar[] = [];
  fermerXujaligiTuriName: Turi;
  tumanlar: Tumanlar[] = [];
  tumanlarName: Tumanlar;
  tumanId: Tumanlar;
  viloyatlar: Viloyatlar[] = [];
  viloyatlarName: Viloyatlar;
  viloyatId: Viloyatlar;
  massivlar: Massivlar[] = [];
  massivName: Massivlar;
  filterFermerXujaligi: FilterName = {};
  massivDisabled = false;
  tumanDisabled = false;
  xisobRaqamUzgartirish = false;
  xisobRaqamId = '';


  Buttonlar: boolean;
  form: FormGroup;
  tartibRaqamLength: number;
  isVisbleForm = false;
  selectedItem: FermerXujaligi;
  reloading = false;
  positionId: string;
  className = 'fermerXujaligi';
  list: FermerXujaligi;
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
      raxbari: new FormControl(null),
      inn: new FormControl(null, Validators.required),
      oked: new FormControl(null),
      manzili: new FormControl(null),
      telefon: new FormControl(null),
      turi: new FormControl(null),
      viloyatId: new FormControl(null, Validators.required),
      tumanId: new FormControl(null, Validators.required),
      massivId: new FormControl(null, Validators.required),
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
      data: {name: this.filterFermerXujaligi.name, SPR: 'Юридик ташкилот номи'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.name && result.ok) {
        this.filterFermerXujaligi.name = result.name;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterFermerXujaligi.name = null;
          this.getViloyatlar();
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }

  onSubmit() {
    const newFermerXujaligi: FermerXujaligi = {
      name: this.form.value.name,
      tartibRaqam: this.form.value.tartibRaqam,
      inn: this.form.value.inn,
      oked: this.form.value.oked,
      manzili: this.form.value.manzili,
      telefon: this.form.value.telefon,
      turi: this.form.value.turi,
      raxbari: this.form.value.raxbari,
      viloyatId: this.form.value.viloyatId,
      tumanId: this.form.value.tumanId,
      massivId: this.form.value.massivId,
      xisobRaqamlar: this.xisobRaqamlar
    };
    if (newFermerXujaligi) {
      this.creatAll(newFermerXujaligi);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.form.reset();
      this.EnableButton();
    }
    this.fermerXujaligiTuriName = null;
    this.xisobRaqamlar.splice(0, this.xisobRaqamlar.length);
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivName = null;
    this.tumanDisabled = false;
    this.massivDisabled = false;
  }

  addObject() {
    this.tumanDisabled = false;
    this.massivDisabled = false;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivName = null;
    this.tumanlar = null;
    this.massivlar = null;
    this.fermerXujaligiTuriName = null;
    this.addNewObject();
  }

  editObject() {
    if (this.selectedItem) {
      this.form.patchValue({
        name: this.selectedItem.name,
        tartibRaqam: this.selectedItem.tartibRaqam,
        inn: this.selectedItem.inn,
        oked: this.selectedItem.oked,
        manzili: this.selectedItem.manzili,
        telefon: this.selectedItem.telefon,
        turi: this.selectedItem.turi,
        raxbari: this.selectedItem.raxbari,
        viloyatId: this.selectedItem.viloyatId,
        tumanId: this.selectedItem.tumanId,
        massivId: this.selectedItem.massivId,
        xisobRaqamlar: this.selectedItem.xisobRaqamlar
      });
      this.xisobRaqamlar = this.selectedItem.xisobRaqamlar;
      if (this.fermerXujaligiTuri.length > 0 && this.selectedItem.turi) {
        this.fermerXujaligiTuriName = this.fermerXujaligiTuri.find(x => x.name === this.selectedItem.turi);
      } else {
        this.fermerXujaligiTuriName = null;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
        this.tumanDisabled = false;
        this.massivDisabled = false;
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
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
        oked: this.selectedItem.oked,
        manzili: this.selectedItem.manzili,
        telefon: this.selectedItem.telefon,
        turi: this.selectedItem.turi,
        raxbari: this.selectedItem.raxbari,
        viloyatId: this.selectedItem.viloyatId,
        tumanId: this.selectedItem.tumanId,
        massivId: this.selectedItem.massivId,
        xisobRaqamlar: this.selectedItem.xisobRaqamlar,
        tartibRaqam: this.totalDocs + 1
      });
      if (this.fermerXujaligiTuri.length > 0 && this.selectedItem.turi) {
        this.fermerXujaligiTuriName = this.fermerXujaligiTuri.find(x => x.name === this.selectedItem.turi);
      } else {
        this.fermerXujaligiTuriName = null;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
        this.tumanDisabled = false;
        this.massivDisabled = false;
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
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
      this.tumanDisabled = false;
      this.massivDisabled = false;
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  onResetForm() {
    this.filterFermerXujaligi = {};
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.tumanDisabled = false;
    this.massivDisabled = false;
    this.getAll();
    this.getViloyatlar();
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
      this.massivlar = null;
    }
  }

  getMassivlar() {
    if (this.tumanId) {
      const params = Object.assign({}, {
        allIds: this.tumanId._id
      });
      this.apiService.getObjectId<Massivlar[]>(params, '/massivlar')
        .subscribe(result => {
          this.massivlar = result;
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
    if (event._id) {
      this.tumanId = event;
      this.getMassivlar();
    }
  }

  onChangeMassivlar(event) {
    this.form.get('massivId').setValue(event._id);
  }

  onChangeTuri(event) {
    this.form.get('turi').setValue(event.name);
  }

  onCloseForm() {
    this.fermerXujaligiTuriName = null;
    this.viloyatlarName = null;
    this.xisobRaqamlar.splice(0, this.xisobRaqamlar.length);
    this.tumanlarName = null;
    this.tumanlar = null;
    this.massivlar = null;
    this.massivName = null;
    this.tumanDisabled = false;
    this.massivDisabled = false;
    this.closeObject();
  }

  selectedTumanAndMassiv(row) {
    this.form.reset();
    this.viloyatlarName = null;
    this.selectedItem = row;
    this.positionId = row._id;
    this.tumanDisabled = true;
    this.massivDisabled = true;
    this.fermerXujaligiTuriName = null;
    this.EnableButton();
    if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
      this.viloyatId = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      this.getTumanlar();
    }
    if (this.selectedItem.tumanId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.tumanId
      });
      this.apiService.getObjectId<Massivlar[]>(params, '/massivlar')
        .subscribe(result => {
          this.massivlar = result;
        });
    }
  }


  selectedXisobRaqam(xisoboraqam) {
    this.selectXisobRaqam = xisoboraqam;
  }

  adder() {
    if (this.xisobRaqamId === '') {
      const idx = this.xisobRaqamlar.find(p => p.xisobRaqam === this.form.value.xisobRaqamxis);
      if (idx) {
        this.openSnackBar('Бир хил хисоб рақам билан киритиш мумкинмас', 'Хатолик', 3);
      } else {
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
    } else if (this.xisobRaqamId === '1') {
      const idx = this.xisobRaqamlar.find(p => p.xisobRaqam === this.form.value.xisobRaqamxis);
      if (idx) {
        idx.name = this.form.value.nameXis;
        idx.tartibRaqam = this.form.value.tartibRaqamXis;
        idx.bankId = this.form.value.bankId;
        idx.mfo = this.form.value.mfo;
      }
    } else {
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
      this.xisobRaqamId = '';
    }
    this.xisobRaqamUzgartirish = true;
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
      this.xisobRaqamId = '1';
      this.xisobRaqamUzgartirish = true;
    }
  }

  deleteXisobRaqam() {
    if (this.selectXisobRaqam) {
      const idx = this.xisobRaqamlar.findIndex(p => p.xisobRaqam === this.selectXisobRaqam.xisobRaqam);
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
    this.xisobRaqamUzgartirish = false;
    this.xisobRaqamId = '';
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
      this.apiService.updated<FermerXujaligi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<FermerXujaligi>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterFermerXujaligi, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<FermerXujaligi>>(params, this.className)
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
    const params = Object.assign({}, this.filterFermerXujaligi, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<FermerXujaligi>>(params, this.className)
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
