import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {JadvalPreparatChiqimi, PreparatChiqimi} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Omborlar, Preparatlar, Tashkilotlar, UlchovBirligi, Xodimlar} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';
import {PreparatQoldiq} from "../../classes/interfaceRegister";

@Component({
  selector: 'app-preparat-chiqimi',
  templateUrl: './preparat-chiqimi.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class PreparatChiqimiComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'ombor',
    'qabulQildi', 'chiqimTuri', 'xodim', 'tashkilot', 'izox'];

  filterDocuments: FilterDateDocuments = {};

  omborlar: Omborlar[] = [];
  omborlarName: Omborlar;
  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

  preparatlar: Preparatlar[] = [];
  preparatlarName: Preparatlar;

  ulchovBirligi: UlchovBirligi[] = [];
  ulchovBirligiName: UlchovBirligi;

  preparatQoldiq: PreparatQoldiq;
  jadvalPrepartChiqimi: JadvalPreparatChiqimi[] = [];
  selectPrepartlar: JadvalPreparatChiqimi;

  tashkilot: Tashkilotlar[] = [];
  tashkilotName: Tashkilotlar;

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;
  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: PreparatChiqimi;
  reloading = false;
  positionId: string;
  className = 'preparatChiqimi';
  list: PreparatChiqimi;
  page = 1;
  pageSize = 20;
  totalPages: number;
  totalDocs: number;
  hasNextPage = false;
  hasPrevPage = false;
  pagingCounter: number;
  prevPage = false;
  nextPage = false;
  disabledObjectTashkilot = false;
  disabledObjectXodim = true;

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
      omborlarId: new FormControl('', Validators.required),
      omborlarName: new FormControl(''),
      qabulQildi: new FormControl(''),
      xodimlarId: new FormControl(''),
      xodimlarName: new FormControl(''),
      tashkilotlarId: new FormControl(''),
      tashkilotlarName: new FormControl(''),
      izoxi: new FormControl(''),
      chiqimTuri: new FormControl(''),
      partiyaId: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
      yuklashSana: new FormControl(new Date().toISOString().slice(0, 16)),
      tartibRaqamPerparat: new FormControl(1),
      preparatlarId: new FormControl(''),
      preparatlarName: new FormControl(''),
      ulchovBirligiId: new FormControl(0),
      ulchovBirligiName: new FormControl(0),
      qoldiqSoni: new FormControl(0),
      soni: new FormControl(0),
      narxi: new FormControl(0),
    });
    this.getOmborlar();
    this.getPreparatlar();
    this.getUlchovBirligi();
    this.getXodimlar();
    this.getTashkilot();
    this.getAll();
  }

  backTable() {
    this.stepperRef.previous();
  }

  backForm() {
    this.stepperRef.next();
  }

  onSubmit() {
    if (this.selectedItem && this.positionId) {
      const YEAR = this.secondFormGroup.value.sana.slice(0, 4);
      const MONTH = this.secondFormGroup.value.sana.slice(5, 7);
      const DAY = this.secondFormGroup.value.sana.slice(8, 10);
      const HOURS = this.selectedItem.yuklashSana.toString().slice(11, 16).slice(0, 2);
      const MINUT = this.selectedItem.yuklashSana.toString().slice(11, 16).slice(3, 5);
      const SEKUND = this.selectedItem.yuklashSana.toString().slice(16, 24).slice(6, 8);
      const yuklashSanasi = new Date(Number(YEAR), Number(MONTH) - 1, Number(DAY), Number(HOURS) + 5, Number(MINUT), Number(SEKUND));
      const newPreparatlar: PreparatChiqimi = {
        tasdiqlash: true,
        tartibRaqam: this.secondFormGroup.value.tartibRaqam,
        sana: this.secondFormGroup.value.sana,
        omborlarId: this.secondFormGroup.value.omborlarId,
        omborlarName: this.secondFormGroup.value.omborlarName,
        qabulQildi: this.secondFormGroup.value.qabulQildi,
        xodimlarId: this.secondFormGroup.value.xodimlarId,
        xodimlarName: this.secondFormGroup.value.xodimlarName,
        tashkilotlarId: this.secondFormGroup.value.tashkilotlarId,
        tashkilotlarName: this.secondFormGroup.value.tashkilotlarName,
        izoxi: this.secondFormGroup.value.izoxi,
        chiqimTuri: this.secondFormGroup.value.chiqimTuri,
        foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
        yuklashSana: yuklashSanasi,
        jadval: this.jadvalPrepartChiqimi,
      };
      if (newPreparatlar) {
        this.creatAll(newPreparatlar);
        this.selectedItem = null;
        this.isVisbleForm = false;
        this.secondFormGroup.reset();
        this.EnableButton();
      }
    } else {
      const YEAR = this.secondFormGroup.value.sana.slice(0, 4);
      const MONTH = this.secondFormGroup.value.sana.slice(5, 7);
      const DAY = this.secondFormGroup.value.sana.slice(8, 10);
      const HOURS = new Date().toString().slice(16, 21).slice(0, 2);
      const MINUT = new Date().toString().slice(16, 21).slice(3, 5);
      const SEKUND = new Date().toString().slice(16, 24).slice(6, 8);
      const yuklashSanasi = new Date(Number(YEAR), Number(MONTH) - 1, Number(DAY), Number(HOURS), Number(MINUT), Number(SEKUND));
      const newPreparatlar: PreparatChiqimi = {
        tasdiqlash: true,
        tartibRaqam: this.secondFormGroup.value.tartibRaqam,
        sana: this.secondFormGroup.value.sana,
        omborlarId: this.secondFormGroup.value.omborlarId,
        omborlarName: this.secondFormGroup.value.omborlarName,
        qabulQildi: this.secondFormGroup.value.qabulQildi,
        xodimlarId: this.secondFormGroup.value.xodimlarId,
        xodimlarName: this.secondFormGroup.value.xodimlarName,
        tashkilotlarId: this.secondFormGroup.value.tashkilotlarId,
        tashkilotlarName: this.secondFormGroup.value.tashkilotlarName,
        izoxi: this.secondFormGroup.value.izoxi,
        chiqimTuri: this.secondFormGroup.value.chiqimTuri,
        foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
        yuklashSana: yuklashSanasi,
        jadval: this.jadvalPrepartChiqimi,
      };
      if (newPreparatlar) {
        this.creatAll(newPreparatlar);
        this.selectedItem = null;
        this.isVisbleForm = false;
        this.secondFormGroup.reset();
        this.EnableButton();
      }
    }
    this.omborlarName = null;
    this.xodimlarName = null;
    this.preparatlarName = null;
    this.ulchovBirligiName = null;
    this.jadvalPrepartChiqimi = [];
  }

  addObject() {
    this.omborlarName = null;
    this.xodimlarName = null;
    this.preparatlarName = null;
    this.ulchovBirligiName = null;
    this.jadvalPrepartChiqimi = [];
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
        omborlarId: this.selectedItem.omborlarId,
        omborlarName: this.selectedItem.omborlarName,
        qabulQildi: this.selectedItem.qabulQildi,
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        tashkilotlarId: this.selectedItem.tashkilotlarId,
        tashkilotlarName: this.selectedItem.tashkilotlarName,
        izoxi: this.selectedItem.izoxi,
        chiqimTuri: this.selectedItem.chiqimTuri,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        yuklashSana: this.selectedItem.yuklashSana,
        tartibRaqamPerparat: this.selectedItem.jadval.length + 1
      });
      this.onChangeRadioButton(this.selectedItem.chiqimTuri);
      if (this.selectedItem.jadval) {
        this.jadvalPrepartChiqimi = this.selectedItem.jadval;
      }
      if (this.omborlar.length > 0 && this.selectedItem.omborlarId) {
        this.omborlarName = this.omborlar.find(x => x._id === this.selectedItem.omborlarId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
        this.secondFormGroup.get('xodimlarId').setValue(this.xodimlarName._id);
        this.secondFormGroup.get('xodimlarName').setValue(this.xodimlarName.name);
      }
      if (this.tashkilot.length > 0 && this.selectedItem.tashkilotlarId) {
        this.tashkilotName = this.tashkilot.find(x => x._id === this.selectedItem.tashkilotlarId);
        this.secondFormGroup.get('tashkilotlarId').setValue(this.tashkilotName._id);
        this.secondFormGroup.get('tashkilotlarName').setValue(this.tashkilotName.name);
      }

      if (this.selectedItem.izoxi) {
        this.secondFormGroup.get('izoxi').setValue(this.selectedItem.izoxi);
      }
      this.preparatlarName = null;
      this.ulchovBirligiName = null;
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
        tasdiqlash: this.selectedItem.tasdiqlash,
        tartibRaqam: this.totalDocs + 1,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0, 10),
        omborlarId: this.selectedItem.omborlarId,
        omborlarName: this.selectedItem.omborlarName,
        qabulQildi: this.selectedItem.qabulQildi,
        xodimlarId: this.selectedItem.xodimlarId,
        xodimlarName: this.selectedItem.xodimlarName,
        tashkilotlarId: this.selectedItem.tashkilotlarId,
        tashkilotlarName: this.selectedItem.tashkilotlarName,
        izoxi: this.selectedItem.izoxi,
        chiqimTuri: this.selectedItem.chiqimTuri,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        yuklashSana: this.selectedItem.yuklashSana,
        tartibRaqamPerparat: this.selectedItem.jadval.length + 1
      });
      this.onChangeRadioButton(this.selectedItem.chiqimTuri);
      if (this.selectedItem.jadval) {
        this.jadvalPrepartChiqimi = this.selectedItem.jadval;
      }
      if (this.omborlar.length > 0 && this.selectedItem.omborlarId) {
        this.omborlarName = this.omborlar.find(x => x._id === this.selectedItem.omborlarId);

      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimlarId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimlarId);
        this.secondFormGroup.get('xodimlarId').setValue(this.xodimlarName._id);
        this.secondFormGroup.get('xodimlarName').setValue(this.xodimlarName.name);
      }
      if (this.tashkilot.length > 0 && this.selectedItem.tashkilotlarId) {
        this.tashkilotName = this.tashkilot.find(x => x._id === this.selectedItem.tashkilotlarId);
        this.secondFormGroup.get('tashkilotlarId').setValue(this.tashkilotName._id);
        this.secondFormGroup.get('tashkilotlarName').setValue(this.tashkilotName.name);
      }

      if (this.selectedItem.izoxi) {
        this.secondFormGroup.get('izoxi').setValue(this.selectedItem.izoxi);
      }
      this.positionId = null;
      this.preparatlarName = null;
      this.ulchovBirligiName = null;
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
    this.omborlarName = null;
    this.xodimlarName = null;
    this.preparatlarName = null;
    this.ulchovBirligiName = null;
    this.isVisbleForm = false;
    this.jadvalPrepartChiqimi = [];
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.stepperRef.previous();
  }

  getIzoxi(chiqimTuri) {
    if (chiqimTuri === 'xodimga') {
      return 'Ходимга';
    }
    if (chiqimTuri === 'viloyatga') {
      return 'Вилоятга';
    }
    if (chiqimTuri === 'chiqim') {
      return 'Чиқим';
    }
  }

  getOmborlar() {
    this.apiService.getAll<Omborlar>('omborlar/')
      .subscribe(result => {
        this.omborlar = result;
      });
  }

  getTashkilot() {
    this.apiService.getAll<Tashkilotlar>('tashkilotlar/')
      .subscribe(result => {
        this.tashkilot = result;
      });
  }

  getPreparatlar() {
    this.apiService.getAll<Preparatlar>('preparatlar/')
      .subscribe(result => {
        this.preparatlar = result;
      });
  }

  getUlchovBirligi() {
    this.apiService.getAll<UlchovBirligi>('ulchovBirligi/')
      .subscribe(result => {
        this.ulchovBirligi = result;
      });
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  onChangeOmborlar(event) {
    this.secondFormGroup.get('omborlarId').setValue(event._id);
    this.secondFormGroup.get('omborlarName').setValue(event.name);
    this.secondFormGroup.get('qabulQildi').setValue(event.javobgarShaxs);
  }

  onChangeTashkilot(event) {
    this.secondFormGroup.get('tashkilotlarId').setValue(event._id);
    this.secondFormGroup.get('tashkilotlarName').setValue(event.name);
  }

  onChangeRadioButton(event) {
    if (event) {
      this.secondFormGroup.get('chiqimTuri').setValue(event);
      if (event === 'viloyatga') {
        this.tashkilotName = null;
        this.xodimlarName = null;
        this.secondFormGroup.get('izoxi').disable();
        this.secondFormGroup.get('izoxi').setValue('');
        this.secondFormGroup.get('tashkilotlarId').setValue('');
        this.secondFormGroup.get('tashkilotlarName').setValue('');
        this.secondFormGroup.get('xodimlarId').setValue('');
        this.secondFormGroup.get('xodimlarName').setValue('');
        this.disabledObjectTashkilot = false;
        this.disabledObjectXodim = true;
      } else if (event === 'xodimga') {
        this.tashkilotName = null;
        this.xodimlarName = null;
        this.secondFormGroup.get('izoxi').disable();
        this.secondFormGroup.get('izoxi').setValue('');
        this.secondFormGroup.get('tashkilotlarId').setValue('');
        this.secondFormGroup.get('tashkilotlarName').setValue('');
        this.secondFormGroup.get('xodimlarId').setValue('');
        this.secondFormGroup.get('xodimlarName').setValue('');
        this.disabledObjectTashkilot = true;
        this.disabledObjectXodim = false;
      } else if (event === 'chiqim') {
        this.tashkilotName = null;
        this.xodimlarName = null;
        this.secondFormGroup.get('izoxi').enable();
        this.secondFormGroup.get('izoxi').setValue('');
        this.secondFormGroup.get('tashkilotlarId').setValue('');
        this.secondFormGroup.get('tashkilotlarName').setValue('');
        this.secondFormGroup.get('xodimlarId').setValue('');
        this.secondFormGroup.get('xodimlarName').setValue('');
        this.disabledObjectTashkilot = true;
        this.disabledObjectXodim = true;
      }
    }

  }

  onChangeXodimlar(event) {
    this.secondFormGroup.get('xodimlarId').setValue(event._id);
    this.secondFormGroup.get('xodimlarName').setValue(event.name);
  }

  onChangePrepatlar(event) {
    this.secondFormGroup.get('preparatlarId').setValue(event._id);
    this.secondFormGroup.get('preparatlarName').setValue(event.name);
    if (this.secondFormGroup.get('omborlarId').value === null) {
      this.openSnackBar('Омборни киритмадингиз!', 'Хатолик!', 5);
      this.preparatlarName = null;
      this.ulchovBirligiName = null;
      this.secondFormGroup.patchValue({
        partiyaId: '',
        preparatlarId: '',
        preparatlarName: '',
        ulchovBirligiId: '',
        ulchovBirligiName: '',
        soni: 0,
        qoldiqSoni: 0,
        narxi: 0,
      });
      return;
    }
    if (event) {
      const params = Object.assign({}, {
        end: this.secondFormGroup.get('sana').value,
        preparatlarId: event._id,
        omborlarId: this.secondFormGroup.get('omborlarId').value,
      });
      this.apiService.getQoldiq<PreparatQoldiq>(params, '/preparatQoldiq')
        .subscribe(result => {
          this.preparatQoldiq = result;
          if (this.preparatQoldiq) {
            if (this.preparatQoldiq.soni < 0 || this.preparatQoldiq.soni === 0) {
              this.openSnackBar('Бундай бланка омборда қолмаган!', 'Хатолик!', 5);
              this.preparatlarName = null;
              this.ulchovBirligiName = null;
              this.secondFormGroup.patchValue({
                partiyaId: '',
                preparatlarId: '',
                preparatlarName: '',
                ulchovBirligiId: '',
                ulchovBirligiName: '',
                qoldiqSoni: 0,
                soni: 0,
                narxi: 0,
              });
              return;
            }
            this.secondFormGroup.patchValue({
              qoldiqSoni: this.preparatQoldiq.soni,
              partiyaId: this.preparatQoldiq.partiyaId,
              narxi: this.preparatQoldiq.narxi,
              ulchovBirligiId: this.preparatQoldiq.ulchovBirligiId,
              ulchovBirligiName: this.preparatQoldiq.ulchovBirligiName
            });
            if (this.ulchovBirligi.length > 0 && this.secondFormGroup.value.ulchovBirligiId) {
              this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === this.secondFormGroup.value.ulchovBirligiId);
            }
          } else {
            this.openSnackBar('Бундай бланка омборда мавжуд эмас!', 'Хатолик!', 5);
            this.preparatlarName = null;
            this.ulchovBirligiName = null;
            this.secondFormGroup.patchValue({
              partiyaId: '',
              preparatlarId: '',
              preparatlarName: '',
              ulchovBirligiId: '',
              ulchovBirligiName: '',
              qoldiqSoni: 0,
              soni: 0,
              narxi: 0,
            });
          }
        });
    }
  }

  onChangeUlchovBirligi(event) {
    this.secondFormGroup.get('ulchovBirligiId').setValue(event._id);
    this.secondFormGroup.get('ulchovBirligiName').setValue(event.name);
  }

  onCloseForm() {
    this.omborlarName = null;
    this.xodimlarName = null;
    this.preparatlarName = null;
    this.ulchovBirligiName = null;
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedRow(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.omborlarName = null;
    this.xodimlarName = null;
    this.preparatlarName = null;
    this.ulchovBirligiName = null;
    this.EnableButton();
  }

  selectedJadval(jadvalPreparat) {
    this.selectPrepartlar = jadvalPreparat;
  }

  adder() {
    const idx = this.jadvalPrepartChiqimi.find(p => p.preparatlarId === this.secondFormGroup.value.preparatlarId);
    if (idx) {
      this.openSnackBar(`${this.secondFormGroup.value.preparatlarName}${'номли бланка киритилган, бир хил бланка киритиш мумкин эмас!'}`, 'Хатолик', 3);
      return;
    }
    this.jadvalPrepartChiqimi.push(
      {
        tartibRaqam: this.secondFormGroup.value.tartibRaqamPerparat,
        partiyaId: this.secondFormGroup.value.partiyaId,
        preparatlarId: this.secondFormGroup.value.preparatlarId,
        preparatlarName: this.secondFormGroup.value.preparatlarName,
        ulchovBirligiId: this.secondFormGroup.value.ulchovBirligiId,
        ulchovBirligiName: this.secondFormGroup.value.ulchovBirligiName,
        qoldiqSoni: this.secondFormGroup.value.qoldiqSoni,
        soni: this.secondFormGroup.value.soni,
        narxi: this.secondFormGroup.value.narxi,
        summasi: parseInt(this.secondFormGroup.value.soni) * parseInt(this.secondFormGroup.value.narxi),
      }
    );
    this.preparatlarName = null;
    this.ulchovBirligiName = null;
    this.secondFormGroup.patchValue({
      tartibRaqamPerparat: this.jadvalPrepartChiqimi.length + 1,
      preparatlarId: '',
      preparatlarName: '',
      ulchovBirligiId: '',
      ulchovBirligiName: '',
      qoldiqSoni: 0,
      soni: 0,
      narxi: 0
    });
  }

  editJadVal() {
    if (this.selectPrepartlar) {
      this.secondFormGroup.patchValue({
        tartibRaqamPerparat: this.selectPrepartlar.tartibRaqam,
        preparatlarId: this.selectPrepartlar.preparatlarId,
        preparatlarName: this.selectPrepartlar.preparatlarName,
        ulchovBirligiId: this.selectPrepartlar.ulchovBirligiId,
        ulchovBirligiName: this.selectPrepartlar.ulchovBirligiName,
        qoldiqSoni: this.selectPrepartlar.qoldiqSoni,
        soni: this.selectPrepartlar.soni,
        narxi: this.selectPrepartlar.narxi,
      });
      if (this.preparatlar.length > 0 && this.selectPrepartlar.preparatlarId) {
        this.preparatlarName = this.preparatlar.find(x => x._id === this.selectPrepartlar.preparatlarId);
      }
      if (this.ulchovBirligi.length > 0 && this.selectPrepartlar.ulchovBirligiId) {
        this.ulchovBirligiName = this.ulchovBirligi.find(x => x._id === this.selectPrepartlar.ulchovBirligiId);
      }
    }
  }

  deleteJadval() {
    if (this.selectPrepartlar) {
      const idx = this.jadvalPrepartChiqimi.find(p => p.preparatlarId === this.selectPrepartlar.preparatlarId).tartibRaqam - 1;
      this.jadvalPrepartChiqimi.splice(idx, 1);
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
    this.secondFormGroup.patchValue({yuklashSana: new Date().toISOString().slice(0, 10) + 'T' + new Date().toString().slice(16, 21)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({tartibRaqamPerparat: 1});
    this.onChangeRadioButton('xodimga');
    this.positionId = null;
    this.DisableButton();

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
      this.apiService.updated<PreparatChiqimi>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<PreparatChiqimi>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<PreparatChiqimi>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<PreparatChiqimi>>(params, this.className)
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
