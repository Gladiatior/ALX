import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {PlanKiritish} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  FaoliyatTuri,
  FaoliyatYunalishi,
  FermerXujaligi,
  Massivlar,
  Tumanlar,
  Viloyatlar
} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';

interface Chorak {
  name: string;
}

@Component({
  selector: 'app-plan-kiritish',
  templateUrl: './plan-kiritish.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class PlanKiritishComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'chorak', 'faoliyatTuri', 'fermerXujaligi', 'fermerXujaligiInn'];
  filterDocuments: FilterDateDocuments = {};
  faoliyatTuri: FaoliyatTuri[] = [];
  faoliyatTuriName: FaoliyatTuri;
  faoilyatTuriId: FaoliyatTuri;
  faoliyatYunalishi: FaoliyatYunalishi[] = [];
  faoliyatTunalishiName: FaoliyatYunalishi;
  viloyatlar: Viloyatlar[] = [];
  viloyatlarName: Viloyatlar;
  viloyatId: Viloyatlar;
  tumanlar: Tumanlar[] = [];
  tumanlarName: Tumanlar;
  tumanlarId: Tumanlar;
  massivlar: Massivlar[] = [];
  massivlarName: Massivlar;
  massivlarId: Massivlar;
  fermerXujaligi: FermerXujaligi[] = [];
  fermerXujaligiName: FermerXujaligi;
  chorak: Chorak[] = [
    {name: 'I-чорак'},
    {name: 'II-чорак'},
    {name: 'III-чорак'},
    {name: 'IV-чорак'},
  ];
  chorakName: Chorak;
  @ViewChild('stepper') stepperRef: MatHorizontalStepper;
  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: PlanKiritish;
  reloading = false;
  positionId: string;
  className = 'planKiritish';
  list: PlanKiritish;
  page = 1;
  pageSize = 20;
  totalPages: number;
  totalDocs: number;
  hasNextPage = false;
  hasPrevPage = false;
  pagingCounter: number;
  prevPage = false;
  nextPage = false;

  constructor(private apiService: RestClientDocumentsService, private appRout: RoutService,
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
      if (!this.Buttons) {
        this.deleteObjectForm();
      }
    }
    if (event.key === '9' && event.altKey) {
      if (!this.Buttons) {
        this.opeFilterDialog();
      }
    }
    if (event.key === 'Escape') {
      this.onCloseForm();
    }
    if (event.key === '1' && event.altKey) {
      this.backTable();
    }
    if (event.key === '2' && event.altKey) {
      this.backForm();
    }
  }


  ngOnInit() {
    this.firstFormGroup = new FormGroup({
      firstCtrl: new FormControl(this.page)
    });
    this.secondFormGroup = new FormGroup({
      tasdiqlash: new FormControl(false, Validators.required),
      tartibRaqam: new FormControl(1, Validators.required),
      sana: new FormControl(new Date().toISOString().slice(0, 10), Validators.required),
      chorak: new FormControl('', Validators.required),
      faoliyatTuriId: new FormControl('', Validators.required),
      faoliyatYunalishlariId: new FormControl(null, Validators.required),
      viloyatId: new FormControl('', Validators.required),
      tumanId: new FormControl('', Validators.required),
      massivId: new FormControl('', Validators.required),
      fermerXujaligiId: new FormControl('', Validators.required),
      fermerXujaligiNomi: new FormControl(''),
      fermerXujaligiInn: new FormControl(''),
      yerMaydoni: new FormControl(0, Validators.required)
    });
    this.getViloyatlar();
    this.getFaoliyatTuri();
    this.getAll();
  }

  backTable() {
    this.stepperRef.previous();
  }

  backForm() {
    this.stepperRef.next();
  }

  onSubmit() {
    const newPlanKiritish: PlanKiritish = {
      tasdiqlash: true,
      tartibRaqam: this.secondFormGroup.value.tartibRaqam,
      sana: this.secondFormGroup.value.sana,
      chorak: this.secondFormGroup.value.chorak,
      faoliyatTuriId: this.secondFormGroup.value.faoliyatTuriId,
      faoliyatYunalishlariId: this.secondFormGroup.value.faoliyatYunalishlariId,
      viloyatId: this.secondFormGroup.value.viloyatId,
      tumanId: this.secondFormGroup.value.tumanId,
      massivId: this.secondFormGroup.value.massivId,
      fermerXujaligiId: this.secondFormGroup.value.fermerXujaligiId,
      fermerXujaligiNomi: this.secondFormGroup.value.fermerXujaligiNomi,
      fermerXujaligiInn: this.secondFormGroup.value.fermerXujaligiInn,
      yerMaydoni: this.secondFormGroup.value.yerMaydoni,
    };
    if (newPlanKiritish) {
      this.creatAll(newPlanKiritish);
      this.selectedItem = null;
      this.isVisbleForm = false;
      this.secondFormGroup.reset();
      this.EnableButton();
    }
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
  }

  addObject() {
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.stepperRef.next();
    this.addNewObject();
  }

  editObject() {
    if (this.selectedItem) {
      this.secondFormGroup.reset();
      this.secondFormGroup.patchValue({
        tasdiqlash: this.selectedItem.tasdiqlash,
        tartibRaqam: this.selectedItem.tartibRaqam,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0, 10),
        chorak: this.selectedItem.chorak,
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        viloyatId: this.selectedItem.viloyatId,
        tumanId: this.selectedItem.tumanId,
        massivId: this.selectedItem.massivId,
        fermerXujaligiId: this.selectedItem.fermerXujaligiId,
        fermerXujaligiNomi: this.selectedItem.fermerXujaligiNomi,
        fermerXujaligiInn: this.selectedItem.fermerXujaligiInn,
        yerMaydoni: this.selectedItem.yerMaydoni,
      });
      if (this.chorak.length > 0 && this.selectedItem.chorak) {
        this.chorakName = this.chorak.find(x => x.name === this.selectedItem.chorak);
      } else {
        this.chorakName = null;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);

      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
      }
      if (this.faoliyatYunalishi.length > 0 && this.selectedItem.faoliyatYunalishlariId) {
        this.faoliyatTunalishiName = this.faoliyatYunalishi.find(x => x._id === this.selectedItem.faoliyatYunalishlariId);
      }
      this.DisableButton();
      this.stepperRef.next();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  copyObject() {
    if (this.selectedItem) {
      this.secondFormGroup.reset();
      this.secondFormGroup.patchValue({
        tartibRaqam: this.totalDocs + 1,
        tasdiqlash: this.selectedItem.tasdiqlash,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0,10),
        chorak: this.selectedItem.chorak,
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        viloyatId: this.selectedItem.viloyatId,
        tumanId: this.selectedItem.tumanId,
        massivId: this.selectedItem.massivId,
        fermerXujaligiId: this.selectedItem.fermerXujaligiId,
        fermerXujaligiNomi: this.selectedItem.fermerXujaligiNomi,
        fermerXujaligiInn: this.selectedItem.fermerXujaligiInn,
        yerMaydoni: this.selectedItem.yerMaydoni,
      });
      if (this.chorak.length > 0 && this.selectedItem.chorak) {
        this.chorakName = this.chorak.find(x => x.name === this.selectedItem.chorak);
      } else {
        this.chorakName = null;
      }
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);

      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
      }
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
      }
      if (this.faoliyatYunalishi.length > 0 && this.selectedItem.faoliyatYunalishlariId) {
        this.faoliyatTunalishiName = this.faoliyatYunalishi.find(x => x._id === this.selectedItem.faoliyatYunalishlariId);
      }
      this.positionId = null;
      this.DisableButton();
      this.stepperRef.next();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  deleteObjectForm() {
    if (this.positionId) {
      this.deleteObject();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  onResetForm() {
    this.filterDocuments = {};
    this.selectedItem = null;
    this.chorakName = null;
    this.isVisbleForm = false;
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.stepperRef.previous();
  }


  getFaoliyatTuri() {
    this.apiService.getAll<FaoliyatTuri>('faoliyatTuri/')
      .subscribe(result => {
        this.faoliyatTuri = result;
      });
    this.faoliyatYunalishi = null;
  }

  getFaoliyatYunalishlari() {
    if (this.faoilyatTuriId) {
      const params = Object.assign({}, {
        allIds: this.faoilyatTuriId._id
      });
      this.apiService.getObjectId<FaoliyatYunalishi[]>(params, '/faoliyatYunalishlari')
        .subscribe(result => {
          this.faoliyatYunalishi = result;
        });
    }
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
    if (this.tumanlarId) {
      const params = Object.assign({}, {
        allIds: this.tumanlarId._id
      });
      this.apiService.getObjectId<Massivlar[]>(params, '/massivlar')
        .subscribe(result => {
          this.massivlar = result;
        });
      this.fermerXujaligi = null;
    }
  }

  getFermerXujaliklari() {
    if (this.massivlarId) {
      const params = Object.assign({}, {
        allIds: this.massivlarId._id
      });
      this.apiService.getObjectId<FermerXujaligi[]>(params, '/fermerXujaligi')
        .subscribe(result => {
          this.fermerXujaligi = result;
        });
    }
  }

  onChangeFaoliyatTuri(event) {
    this.secondFormGroup.get('faoliyatTuriId').setValue(event._id);
    if (event._id) {
      this.faoilyatTuriId = event;
      this.getFaoliyatYunalishlari();
    }
  }

  onChangeFaoliyatYunalishlari(event) {
    this.secondFormGroup.get('faoliyatYunalishlariId').setValue(event._id);
  }

  onChangeViloyatlar(event) {
    this.secondFormGroup.get('viloyatId').setValue(event._id);
    if (event._id) {
      this.viloyatId = event;
      this.getTumanlar();
    }
  }

  onChangeTumanlar(event) {
    this.secondFormGroup.get('tumanId').setValue(event._id);
    if (event._id) {
      this.tumanlarId = event;
      this.getMassivlar();
    }
  }

  onChangeMassivlar(event) {
    this.secondFormGroup.get('massivId').setValue(event._id);
    if (event._id) {
      this.massivlarId = event;
      this.getFermerXujaliklari();
    }
  }

  onChangeFermerXujaliklari(event) {
    this.secondFormGroup.get('fermerXujaligiId').setValue(event._id);
    if (event) {
      this.secondFormGroup.get('fermerXujaligiNomi').setValue(event.name);
      this.secondFormGroup.get('fermerXujaligiInn').setValue(event.inn);
    }
  }

  onChangeChorak(event) {
    this.secondFormGroup.get('chorak').setValue(event.name);
    if (event.name === 'I-чорак') {
      this.secondFormGroup.get('sana').setValue(new Date(2019, 2, 32).toISOString().slice(0, 10));
    } else if (event.name === 'II-чорак') {
      this.secondFormGroup.get('sana').setValue(new Date(2019, 5, 31).toISOString().slice(0, 10));
    } else if (event.name === 'III-чорак') {
      this.secondFormGroup.get('sana').setValue(new Date(2019, 8, 31).toISOString().slice(0, 10));
    } else if (event.name === 'IV-чорак') {
      this.secondFormGroup.get('sana').setValue(new Date(2019, 11, 32).toISOString().slice(0, 10));
    } else {
      this.secondFormGroup.get('sana').setValue(new Date().toISOString().slice(0, 10));
    }

  }

  onCloseForm() {
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.fermerXujaligiName = null;
    this.chorakName = null;
    this.tumanlar = null;
    this.massivlar = null;
    this.fermerXujaligi = null;
    this.faoliyatYunalishi = null;
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedTumanAndMassiv(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.viloyatlarName = null;
    this.faoliyatTuriName = null;
    this.chorakName = null;
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
    if (this.selectedItem.massivId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.massivId
      });
      this.apiService.getObjectId<FermerXujaligi[]>(params, '/fermerXujaligi')
        .subscribe(result => {
          this.fermerXujaligi = result;
        });
    }

    if (this.selectedItem.faoliyatTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.faoliyatTuriId
      });
      this.apiService.getObjectId<FaoliyatYunalishi[]>(params, '/faoliyatYunalishlari')
        .subscribe(result => {
          this.faoliyatYunalishi = result;
        });
    }
  }

  getNameFaoliyatTuri(faoliyatTuriId) {
    if (this.faoliyatTuri.length > 0 && faoliyatTuriId) {
      return this.faoliyatTuri.find(x => x._id === faoliyatTuriId).name;
    }
  }

  EnableButton() {
    this.Buttons = false;
  }

  DisableButton() {
    this.Buttons = true;
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
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.positionId = null;
    this.DisableButton();

  }

  selectedRow(row) {
    this.selectedItem = row;
    this.positionId = row._id;
    this.secondFormGroup.reset();
    this.EnableButton();
  }

  closeObject() {
    this.selectedItem = null;
    this.isVisbleForm = false;
    this.positionId = null;
    this.secondFormGroup.reset();
    this.EnableButton();

  }

  deleteObject() {
    const decision = window.confirm("Танланган қаторини ўчиришни хохлайсизми!");
    if (decision) {
      this.apiService.delete(this.positionId, this.className)
        .subscribe(
          response =>
            this.openSnackBar(response.message, 'Тасдиқлаш', 2),
          error => this.openSnackBar(error.error.message, 'Хатолик', 2),
          () => this.getAll()
        );
    }
    this.EnableButton();
  }

  creatAll(ObjectForm) {
    if (this.positionId) {
      ObjectForm._id = this.positionId;
      this.apiService.updated<PlanKiritish>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<PlanKiritish>(this.className, ObjectForm)
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
    const params = Object.assign({}, this.filterDocuments, {
      page: this.page,
      pageSize: this.pageSize
    });
    this.apiService.getAllByPagePost<PageResponse<PlanKiritish>>(params, this.className)
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
        this.backTable();
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
    const params = Object.assign({}, this.filterDocuments, {
      page: this.page,
      pageSize: this.pageSize
    });

    this.apiService.getFilter<PageResponse<PlanKiritish>>(params, this.className)
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

  opeFilterDialog() {
    const dialogRef = this.dialogFilter.open(FilterDocumentsDateComponent, {
      width: '350px',
      data: {start: this.filterDocuments.start, end: this.filterDocuments.end}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      if (result.start && result.end && result.ok && (typeof result.start) === 'string' && (typeof result.end) === 'string') {
        this.filterDocuments.start = result.start;
        this.filterDocuments.end = result.end;
        this.reloading = true;
        this.getByFilter();
      } else {
        if (!result.close) {
          this.filterDocuments = {};
          this.getAll();
          this.EnableButton();
        }
      }
    });
  }
}

