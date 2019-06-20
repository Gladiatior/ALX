import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ImagesTypesDocs, PlanKiritish, RejaBuyichaNazorat} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  BegonaUtlar, BegonaUtlarTuri, FaoliyatTuri, FaoliyatYunalishi,
  FermerXujaligi, ImagesTypes, Kasalliklar, KasalliklarTuri, KurashishUsuliXulosa, KurashUsullari, LabaratoriyaXulosa,
  Massivlar, Mfylar, Qfylar, Tumanlar, Viloyatlar, Xodimlar, Xulosalar,
  Zararkunandalar, ZararkunandalarTuri
} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';
import {XulosalarFilterForDocumentsComponent} from "../../xulosalar-filter-for-documents/xulosalar-filter-for-documents.component";

@Component({
  selector: 'app-reja-buyicha-nazorati',
  templateUrl: './reja-buyicha-nazorati.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class RejaBuyichaNazoratiComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'yuridik',
    'jismoniy', 'topildi', 'topilmadi', 'labaratoriya', 'xodim',
    'kurilganYerMaydoni', 'viloyat', 'qfy', 'massiv', 'mfy', 'tuman'
    , 'faoliyatTuri', 'faoliyatYunalishi', 'fermer', 'xonadon'];
  filterDocuments: FilterDateDocuments = {};

  readonlyXulosalarXulosasi = true;
  readonlyLabaratoriyaXulosasi = true;
  readonlyKurashUsusllariXulosasi = true;

  StringXulosalar = '';
  StringlabaratoriyaXulosa = '';
  StringKurashUsuliXulosa = '';

  imagePreviewDalolatnoma: string | ArrayBuffer = '';
  imagePreviewLabaratoriya: string | ArrayBuffer = '';
  imagePreview: string | ArrayBuffer = '';

  indexImages = 0;
  ortgaDisable = true;
  oldingaDistable = true;
  EditCopySelected: boolean;

  yuridiklar = true;
  jismoniylar = false;

  topildi = false;
  topilmadi = true;
  labaratoriya = false;

  imageSrc: ImagesTypes[] = [];
  imageSrcLabaratoriya: ImagesTypesDocs[] = [];
  imageSrcDalolatnoma: ImagesTypesDocs[] = [];

  filesToUploadDalolatnoma: Array<File> = [];


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

  qfylar: Qfylar[] = [];
  qfylarName: Qfylar;
  qfylarId: Qfylar;
  mfylar: Mfylar[] = [];
  mfylarName: Mfylar;

  kasalliklarTuri: KasalliklarTuri[] = [];
  kasalliklarTuriName: KasalliklarTuri;
  kasalliklarTuriId: KasalliklarTuri;
  kasalliklar: Kasalliklar[] = [];
  kasalliklarName: Kasalliklar;

  begonaUtlarTuri: BegonaUtlarTuri[] = [];
  begonaUtlarTuriName: BegonaUtlarTuri;
  begonaUtlarTuriId: BegonaUtlarTuri;
  begonaUtlar: BegonaUtlar[] = [];
  begonaUtlarName: BegonaUtlar;

  zararkunandalarTuri: ZararkunandalarTuri[] = [];
  zararkunandalarTuriName: ZararkunandalarTuri;
  zararkunandalarTuriId: ZararkunandalarTuri;
  zararkunandalar: Zararkunandalar[] = [];
  zararkunandalarName: Zararkunandalar;

  kurashUsullari: KurashUsullari[] = [];
  kurashUsullariName: KurashUsullari;

  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

  xulosalar: Xulosalar[] = [];
  labaratoriyaXulosa: LabaratoriyaXulosa[] = [];
  kurashUsuliXulosa: KurashishUsuliXulosa[] = [];

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;
  @ViewChild('imageInputDalolatnoma') inputRefDalolatnoma: ElementRef;
  @ViewChild('imageInputLabaratoriya') inputRefLabaratoriya: ElementRef;


  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: RejaBuyichaNazorat;
  reloading = false;
  positionId: string;
  className = 'rejaBuyichaNazorat';
  list: RejaBuyichaNazorat;
  page = 1;
  pageSize = 20;
  totalPages: number;
  totalDocs: number;
  hasNextPage = false;
  hasPrevPage = false;
  pagingCounter: number;
  prevPage = false;
  nextPage = false;
  plan: PlanKiritish;

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
      yuridik: new FormControl(this.yuridiklar),
      jismoniy: new FormControl(this.jismoniylar),
      viloyatId: new FormControl(''),
      viloyatName: new FormControl(''),
      tumanId: new FormControl(''),
      tumanName: new FormControl(''),
      massivId: new FormControl(''),
      massivName: new FormControl(''),
      fermerXujaligiId: new FormControl(''),
      fermerXujaligiName: new FormControl(''),
      raxbari: new FormControl(''),
      qfyId: new FormControl(''),
      qfyName: new FormControl(''),
      mfyId: new FormControl(''),
      mfyName: new FormControl(''),
      xonadon: new FormControl(''),
      faoliyatTuriId: new FormControl(''),
      faoliyatTuriName: new FormControl(''),
      faoliyatYunalishlariId: new FormControl(''),
      faoliyatYunalishlariName: new FormControl(''),
      yerMaydoni: new FormControl(0),
      kasalliklarTuriId: new FormControl(''),
      kasalliklarId: new FormControl(''),
      begonaUtlarTuriId: new FormControl(''),
      begonaUtlarId: new FormControl(''),
      zararkunandalarTuriId: new FormControl(''),
      zararkunandalarId: new FormControl(''),
      topildi: new FormControl(this.topildi),
      topilmadi: new FormControl(this.topilmadi),
      xulosa: new FormControl(''),
      muddati: new FormControl({value: 0, disabled: this.topilmadi}),
      kurashUsullariId: new FormControl(''),
      kurashishUsuliXulosasi: new FormControl({value: '', disabled: this.topilmadi}),
      labaratoriya: new FormControl({value: this.labaratoriya, disabled: this.topilmadi}),
      labaratoriyaXulosasi: new FormControl({value: '', disabled: this.topilmadi}),
      imageSrcLabaratoriya: new FormControl([]),
      imageSrcDalolatnoma: new FormControl([]),
      kurilganYerMaydoni: new FormControl(0),
      xodimId: new FormControl('', Validators.required),
      xodimName: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
    });
    this.getXulosalar();
    this.getKurashUsuliXulosa();
    this.getLabaratoriyaXulosa();
    this.getViloyatlar();
    this.getFaoliyatTuri();
    this.getXodimlar();
    this.getBegonaUtlarTuri();
    this.getKasalliklarTuri();
    this.getKurashUsullari();
    this.getZararkunandalarTuri();
    this.getAll();
  }

  backTable() {
    this.stepperRef.previous();
  }

  backForm() {
    this.stepperRef.next();
  }

  onSubmit() {
    const newRejaBuyichaNazorat: RejaBuyichaNazorat = {
      tasdiqlash: true,
      tartibRaqam: this.secondFormGroup.value.tartibRaqam,
      sana: this.secondFormGroup.value.sana,
      yuridik: this.secondFormGroup.value.yuridik,
      jismoniy: this.secondFormGroup.value.jismoniy,
      viloyatId: this.secondFormGroup.value.viloyatId,
      viloyatName: this.secondFormGroup.value.viloyatName,
      tumanId: this.secondFormGroup.value.tumanId,
      tumanName: this.secondFormGroup.value.tumanName,
      massivId: this.secondFormGroup.value.massivId,
      massivName: this.secondFormGroup.value.massivName,
      fermerXujaligiId: this.secondFormGroup.value.fermerXujaligiId,
      fermerXujaligiName: this.secondFormGroup.value.fermerXujaligiName,
      qfyId: this.secondFormGroup.value.qfyId,
      qfyName: this.secondFormGroup.value.qfyName,
      mfyId: this.secondFormGroup.value.mfyId,
      mfyName: this.secondFormGroup.value.mfyName,
      xonadon: this.secondFormGroup.value.xonadon,
      faoliyatTuriId: this.secondFormGroup.value.faoliyatTuriId,
      faoliyatTuriName: this.secondFormGroup.value.faoliyatTuriName,
      faoliyatYunalishlariId: this.secondFormGroup.value.faoliyatYunalishlariId,
      faoliyatYunalishlariName: this.secondFormGroup.value.faoliyatYunalishlariName,
      yerMaydoni: this.secondFormGroup.value.yerMaydoni,
      kasalliklarTuriId: this.secondFormGroup.value.kasalliklarTuriId,
      kasalliklarId: this.secondFormGroup.value.kasalliklarId,
      begonaUtlarTuriId: this.secondFormGroup.value.begonaUtlarTuriId,
      begonaUtlarId: this.secondFormGroup.value.begonaUtlarId,
      zararkunandalarTuriId: this.secondFormGroup.value.zararkunandalarTuriId,
      zararkunandalarId: this.secondFormGroup.value.zararkunandalarId,
      topildi: this.secondFormGroup.value.topildi,
      topilmadi: this.secondFormGroup.value.topilmadi,
      xulosa: this.secondFormGroup.value.xulosa,
      muddati: this.secondFormGroup.value.muddati,
      kurashUsullariId: this.secondFormGroup.value.kurashUsullariId,
      kurashishUsuliXulosasi: this.secondFormGroup.value.kurashishUsuliXulosasi,
      labaratoriya: this.secondFormGroup.value.labaratoriya,
      labaratoriyaXulosasi: this.secondFormGroup.value.labaratoriyaXulosasi,
      imageSrcLabaratoriya: this.imageSrcLabaratoriya,
      imageSrcDalolatnoma: this.imageSrcDalolatnoma,
      kurilganYerMaydoni: this.secondFormGroup.value.kurilganYerMaydoni,
      xodimId: this.secondFormGroup.value.xodimId,
      xodimName: this.secondFormGroup.value.xodimName,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
    };
    if (newRejaBuyichaNazorat) {
      const fd = new FormData();
      if (this.filesToUploadDalolatnoma) {
        for (const valueDalolatnoma of this.filesToUploadDalolatnoma) {
          fd.append('imageDalolatNoma', valueDalolatnoma, valueDalolatnoma.name);
        }
      }
      fd.append('tasdiqlash', String(newRejaBuyichaNazorat.tasdiqlash));
      fd.append('tartibRaqam', String(newRejaBuyichaNazorat.tartibRaqam));
      fd.append('sana', String(newRejaBuyichaNazorat.sana));
      fd.append('yuridik', (newRejaBuyichaNazorat.yuridik ? String(newRejaBuyichaNazorat.yuridik) : String(false)));
      fd.append('jismoniy', (newRejaBuyichaNazorat.jismoniy ? String(newRejaBuyichaNazorat.jismoniy) : String(false)));
      fd.append('viloyatId', (newRejaBuyichaNazorat.viloyatId) ? newRejaBuyichaNazorat.viloyatId : '');
      fd.append('viloyatName', (newRejaBuyichaNazorat.viloyatName) ? newRejaBuyichaNazorat.viloyatName : '');
      fd.append('tumanId', (newRejaBuyichaNazorat.tumanId) ? newRejaBuyichaNazorat.tumanId : '');
      fd.append('tumanName', (newRejaBuyichaNazorat.tumanName) ? newRejaBuyichaNazorat.tumanName : '');
      fd.append('massivId', (newRejaBuyichaNazorat.massivId) ? newRejaBuyichaNazorat.massivId : '');
      fd.append('massivName', (newRejaBuyichaNazorat.massivName) ? newRejaBuyichaNazorat.massivName : '');
      fd.append('fermerXujaligiId', (newRejaBuyichaNazorat.fermerXujaligiId) ? newRejaBuyichaNazorat.fermerXujaligiId : '');
      fd.append('fermerXujaligiName', (newRejaBuyichaNazorat.fermerXujaligiName) ? newRejaBuyichaNazorat.fermerXujaligiName : '');
      fd.append('qfyId', (newRejaBuyichaNazorat.qfyId) ? newRejaBuyichaNazorat.qfyId : '');
      fd.append('qfyName', (newRejaBuyichaNazorat.qfyName) ? newRejaBuyichaNazorat.qfyName : '');
      fd.append('mfyId', (newRejaBuyichaNazorat.mfyId) ? newRejaBuyichaNazorat.mfyId : '');
      fd.append('mfyName', (newRejaBuyichaNazorat.mfyName) ? newRejaBuyichaNazorat.mfyName : '');
      fd.append('xonadon', (newRejaBuyichaNazorat.xonadon) ? newRejaBuyichaNazorat.xonadon : '');
      fd.append('faoliyatTuriId', (newRejaBuyichaNazorat.faoliyatTuriId) ? newRejaBuyichaNazorat.faoliyatTuriId : '');
      fd.append('faoliyatTuriName', (newRejaBuyichaNazorat.faoliyatTuriName) ? newRejaBuyichaNazorat.faoliyatTuriName : '');
      fd.append('faoliyatYunalishlariId', (newRejaBuyichaNazorat.faoliyatYunalishlariId) ? newRejaBuyichaNazorat.faoliyatYunalishlariId : '');
      fd.append('faoliyatYunalishlariName', (newRejaBuyichaNazorat.faoliyatYunalishlariName) ? newRejaBuyichaNazorat.faoliyatYunalishlariName : '');
      fd.append('yerMaydoni', String((newRejaBuyichaNazorat.yerMaydoni) ? newRejaBuyichaNazorat.yerMaydoni : '0'));
      fd.append('kasalliklarTuriId', (newRejaBuyichaNazorat.kasalliklarTuriId) ? newRejaBuyichaNazorat.kasalliklarTuriId : '');
      fd.append('kasalliklarId', (newRejaBuyichaNazorat.kasalliklarId) ? newRejaBuyichaNazorat.kasalliklarId : '');
      fd.append('begonaUtlarTuriId', (newRejaBuyichaNazorat.begonaUtlarTuriId) ? newRejaBuyichaNazorat.begonaUtlarTuriId : '');
      fd.append('begonaUtlarId', (newRejaBuyichaNazorat.begonaUtlarId) ? newRejaBuyichaNazorat.begonaUtlarId : '');
      fd.append('zararkunandalarTuriId', (newRejaBuyichaNazorat.zararkunandalarTuriId) ? newRejaBuyichaNazorat.zararkunandalarTuriId : '');
      fd.append('zararkunandalarId', (newRejaBuyichaNazorat.zararkunandalarId) ? newRejaBuyichaNazorat.zararkunandalarId : '');
      fd.append('topildi', (newRejaBuyichaNazorat.topildi ? String(newRejaBuyichaNazorat.topildi) : String(false)));
      fd.append('topilmadi', (newRejaBuyichaNazorat.topilmadi ? String(newRejaBuyichaNazorat.topilmadi) : String(false)));
      fd.append('xulosa', (newRejaBuyichaNazorat.xulosa) ? newRejaBuyichaNazorat.xulosa : '');
      fd.append('muddati', String((newRejaBuyichaNazorat.muddati) ? newRejaBuyichaNazorat.muddati : '0'));
      fd.append('kurashUsullariId', (newRejaBuyichaNazorat.kurashUsullariId) ? newRejaBuyichaNazorat.kurashUsullariId : '');
      fd.append('kurashishUsuliXulosasi', (newRejaBuyichaNazorat.kurashishUsuliXulosasi) ? newRejaBuyichaNazorat.kurashishUsuliXulosasi : '');
      fd.append('labaratoriya', (newRejaBuyichaNazorat.labaratoriya ? String(newRejaBuyichaNazorat.labaratoriya) : String(false)));
      fd.append('labaratoriyaXulosasi', (newRejaBuyichaNazorat.labaratoriyaXulosasi) ? newRejaBuyichaNazorat.labaratoriyaXulosasi : '');
      fd.append('kurilganYerMaydoni', String((newRejaBuyichaNazorat.kurilganYerMaydoni) ? newRejaBuyichaNazorat.kurilganYerMaydoni : '0'));
      fd.append('xodimId', (newRejaBuyichaNazorat.xodimId) ? newRejaBuyichaNazorat.xodimId : '');
      fd.append('xodimName', (newRejaBuyichaNazorat.xodimName) ? newRejaBuyichaNazorat.xodimName : '');
      fd.append('foydalanuvchiId', (newRejaBuyichaNazorat.foydalanuvchiId) ? newRejaBuyichaNazorat.foydalanuvchiId : '');

      this.creatAll(fd);
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
    this.qfylarName = null;
    this.mfylarName = null;
    this.kasalliklarTuriName = null;
    this.kasalliklarName = null;
    this.zararkunandalarTuriName = null;
    this.zararkunandalarName = null;
    this.begonaUtlarTuriName = null;
    this.begonaUtlarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.kurashUsullariName = null;
    this.imageSrc = [];
    this.imagePreview = '';
    this.tartibRaqamLength = this.totalDocs + 1;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
    this.secondFormGroup.patchValue({topilmadi: true});
  }

  addObject() {
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.kasalliklarTuriName = null;
    this.kasalliklarName = null;
    this.zararkunandalarTuriName = null;
    this.zararkunandalarName = null;
    this.begonaUtlarTuriName = null;
    this.begonaUtlarName = null;
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.kurashUsullariName = null;
    this.imageSrc = [];
    this.imagePreview = '';
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
        yuridik: this.selectedItem.yuridik,
        jismoniy: this.selectedItem.jismoniy,
        viloyatId: this.selectedItem.viloyatId,
        viloyatName: this.selectedItem.viloyatName,
        tumanId: this.selectedItem.tumanId,
        tumanName: this.selectedItem.tumanName,
        massivId: this.selectedItem.massivId,
        massivName: this.selectedItem.massivName,
        fermerXujaligiId: this.selectedItem.fermerXujaligiId,
        fermerXujaligiName: this.selectedItem.fermerXujaligiName,
        qfyId: this.selectedItem.qfyId,
        qfyName: this.selectedItem.qfyName,
        mfyId: this.selectedItem.mfyId,
        mfyName: this.selectedItem.mfyName,
        xonadon: this.selectedItem.xonadon,
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatTuriName: this.selectedItem.faoliyatTuriName,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        faoliyatYunalishlariName: this.selectedItem.faoliyatYunalishlariName,
        yerMaydoni: this.selectedItem.yerMaydoni,
        kasalliklarTuriId: this.selectedItem.kasalliklarTuriId,
        kasalliklarId: this.selectedItem.kasalliklarId,
        begonaUtlarTuriId: this.selectedItem.begonaUtlarTuriId,
        begonaUtlarId: this.selectedItem.begonaUtlarId,
        zararkunandalarTuriId: this.selectedItem.zararkunandalarTuriId,
        zararkunandalarId: this.selectedItem.zararkunandalarId,
        topildi: this.selectedItem.topildi,
        topilmadi: this.selectedItem.topilmadi,
        xulosa: this.selectedItem.xulosa,
        muddati: this.selectedItem.muddati,
        kurashUsullariId: this.selectedItem.kurashUsullariId,
        kurashishUsuliXulosasi: this.selectedItem.kurashishUsuliXulosasi,
        labaratoriya: this.selectedItem.labaratoriya,
        labaratoriyaXulosasi: this.selectedItem.labaratoriyaXulosasi,
        imageSrcLabaratoriya: this.imageSrcLabaratoriya,
        imageSrcDalolatnoma: this.imageSrcDalolatnoma,
        kurilganYerMaydoni: this.selectedItem.kurilganYerMaydoni,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
      });
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.qfylar.length > 0 && this.selectedItem.qfyId) {
        this.qfylarName = this.qfylar.find(x => x._id === this.selectedItem.qfyId);
      }
      if (this.mfylar.length > 0 && this.selectedItem.mfyId) {
        this.mfylarName = this.mfylar.find(x => x._id === this.selectedItem.mfyId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
        this.secondFormGroup.get('raxbari').setValue(this.fermerXujaligiName.raxbari);
      }
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
      }
      if (this.faoliyatYunalishi.length > 0 && this.selectedItem.faoliyatYunalishlariId) {
        this.faoliyatTunalishiName = this.faoliyatYunalishi.find(x => x._id === this.selectedItem.faoliyatYunalishlariId);
      }
      if (this.kasalliklarTuri.length > 0 && this.selectedItem.kasalliklarTuriId) {
        this.kasalliklarTuriName = this.kasalliklarTuri.find(x => x._id === this.selectedItem.kasalliklarTuriId);
      }
      if (this.kasalliklar.length > 0 && this.selectedItem.kasalliklarId) {
        this.kasalliklarName = this.kasalliklar.find(x => x._id === this.selectedItem.kasalliklarId);
        this.imageSrc = this.kasalliklarName.imageSrc;
        if (this.kasalliklarName.imageSrc.length) {
          this.imagePreview = this.kasalliklarName.imageSrc[1].url;
        }
      }
      if (this.begonaUtlarTuri.length > 0 && this.selectedItem.begonaUtlarTuriId) {
        this.begonaUtlarTuriName = this.begonaUtlarTuri.find(x => x._id === this.selectedItem.begonaUtlarTuriId);
      }
      if (this.begonaUtlar.length > 0 && this.selectedItem.begonaUtlarId) {
        this.begonaUtlarName = this.begonaUtlar.find(x => x._id === this.selectedItem.begonaUtlarId);
        this.imageSrc = this.begonaUtlarName.imageSrc;
        if (this.begonaUtlarName.imageSrc.length) {
          this.imagePreview = this.begonaUtlarName.imageSrc[1].url;
        }
      }
      if (this.zararkunandalarTuri.length > 0 && this.selectedItem.zararkunandalarTuriId) {
        this.zararkunandalarTuriName = this.zararkunandalarTuri.find(x => x._id === this.selectedItem.zararkunandalarTuriId);
      }
      if (this.zararkunandalar.length > 0 && this.selectedItem.zararkunandalarId) {
        this.zararkunandalarName = this.zararkunandalar.find(x => x._id === this.selectedItem.zararkunandalarId);
        this.imageSrc = this.zararkunandalarName.imageSrc;
        if (this.zararkunandalarName.imageSrc.length) {
          this.imagePreview = this.zararkunandalarName.imageSrc[1].url;
        }
      }
      if (this.selectedItem.imageSrcDalolatnoma && this.selectedItem.imageSrcDalolatnoma.length > 1) {
        this.imageSrcDalolatnoma = this.selectedItem.imageSrcDalolatnoma;
        this.imagePreviewDalolatnoma = this.selectedItem.imageSrcDalolatnoma[1].url;
      } else {
        this.imagePreviewDalolatnoma = '';
      }
      if (this.selectedItem.imageSrcLabaratoriya && this.selectedItem.imageSrcLabaratoriya.length > 1) {
        this.imageSrcLabaratoriya = this.selectedItem.imageSrcLabaratoriya;
        this.imagePreviewLabaratoriya = this.selectedItem.imageSrcLabaratoriya[1].url;
      } else {
        this.imagePreviewLabaratoriya = '';
      }
      if (this.kurashUsullari.length > 0 && this.selectedItem.kurashUsullariId) {
        this.kurashUsullariName = this.kurashUsullari.find(x => x._id === this.selectedItem.kurashUsullariId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimId);
      }
      this.DisableButton();
      this.stepperRef.next();
    } else {
      this.openSnackBar('Қаторни танланг!', 'Эслатма!', 2);
    }
  }

  copyObject() {
    if (this.selectedItem) {
      this.secondFormGroup.patchValue({
        tasdiqlash: this.selectedItem.tasdiqlash,
        tartibRaqam: this.totalDocs + 1,
        sana: new Date(this.selectedItem.sana).toISOString().slice(0, 10),
        yuridik: this.selectedItem.yuridik,
        jismoniy: this.selectedItem.jismoniy,
        viloyatId: this.selectedItem.viloyatId,
        viloyatName: this.selectedItem.viloyatName,
        tumanId: this.selectedItem.tumanId,
        tumanName: this.selectedItem.tumanName,
        massivId: this.selectedItem.massivId,
        massivName: this.selectedItem.massivName,
        fermerXujaligiId: this.selectedItem.fermerXujaligiId,
        fermerXujaligiName: this.selectedItem.fermerXujaligiName,
        qfyId: this.selectedItem.qfyId,
        qfyName: this.selectedItem.qfyName,
        mfyId: this.selectedItem.mfyId,
        mfyName: this.selectedItem.mfyName,
        xonadon: this.selectedItem.xonadon,
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatTuriName: this.selectedItem.faoliyatTuriName,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        faoliyatYunalishlariName: this.selectedItem.faoliyatYunalishlariName,
        yerMaydoni: this.selectedItem.yerMaydoni,
        kasalliklarTuriId: this.selectedItem.kasalliklarTuriId,
        kasalliklarId: this.selectedItem.kasalliklarId,
        begonaUtlarTuriId: this.selectedItem.begonaUtlarTuriId,
        begonaUtlarId: this.selectedItem.begonaUtlarId,
        zararkunandalarTuriId: this.selectedItem.zararkunandalarTuriId,
        zararkunandalarId: this.selectedItem.zararkunandalarId,
        topildi: this.selectedItem.topildi,
        topilmadi: this.selectedItem.topilmadi,
        xulosa: this.selectedItem.xulosa,
        muddati: this.selectedItem.muddati,
        kurashUsullariId: this.selectedItem.kurashUsullariId,
        kurashishUsuliXulosasi: this.selectedItem.kurashishUsuliXulosasi,
        labaratoriya: this.selectedItem.labaratoriya,
        labaratoriyaXulosasi: this.selectedItem.labaratoriyaXulosasi,
        imageSrcLabaratoriya: this.imageSrcLabaratoriya,
        imageSrcDalolatnoma: this.imageSrcDalolatnoma,
        kurilganYerMaydoni: this.selectedItem.kurilganYerMaydoni,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
      });
      if (this.viloyatlar.length > 0 && this.selectedItem.viloyatId) {
        this.viloyatlarName = this.viloyatlar.find(x => x._id === this.selectedItem.viloyatId);
      }
      if (this.tumanlar.length > 0 && this.selectedItem.tumanId) {
        this.tumanlarName = this.tumanlar.find(x => x._id === this.selectedItem.tumanId);
      }
      if (this.massivlar.length > 0 && this.selectedItem.massivId) {
        this.massivlarName = this.massivlar.find(x => x._id === this.selectedItem.massivId);
      }
      if (this.qfylar.length > 0 && this.selectedItem.qfyId) {
        this.qfylarName = this.qfylar.find(x => x._id === this.selectedItem.qfyId);
      }
      if (this.mfylar.length > 0 && this.selectedItem.mfyId) {
        this.mfylarName = this.mfylar.find(x => x._id === this.selectedItem.mfyId);
      }
      if (this.fermerXujaligi.length > 0 && this.selectedItem.fermerXujaligiId) {
        this.fermerXujaligiName = this.fermerXujaligi.find(x => x._id === this.selectedItem.fermerXujaligiId);
        this.secondFormGroup.get('raxbari').setValue(this.fermerXujaligiName.raxbari);
      }
      if (this.faoliyatTuri.length > 0 && this.selectedItem.faoliyatTuriId) {
        this.faoliyatTuriName = this.faoliyatTuri.find(x => x._id === this.selectedItem.faoliyatTuriId);
      }
      if (this.faoliyatYunalishi.length > 0 && this.selectedItem.faoliyatYunalishlariId) {
        this.faoliyatTunalishiName = this.faoliyatYunalishi.find(x => x._id === this.selectedItem.faoliyatYunalishlariId);
      }
      if (this.kasalliklarTuri.length > 0 && this.selectedItem.kasalliklarTuriId) {
        this.kasalliklarTuriName = this.kasalliklarTuri.find(x => x._id === this.selectedItem.kasalliklarTuriId);
      }
      if (this.kasalliklar.length > 0 && this.selectedItem.kasalliklarId) {
        this.kasalliklarName = this.kasalliklar.find(x => x._id === this.selectedItem.kasalliklarId);
        this.imageSrc = this.kasalliklarName.imageSrc;
        if (this.kasalliklarName.imageSrc.length) {
          this.imagePreview = this.kasalliklarName.imageSrc[1].url;
        }
      }
      if (this.begonaUtlarTuri.length > 0 && this.selectedItem.begonaUtlarTuriId) {
        this.begonaUtlarTuriName = this.begonaUtlarTuri.find(x => x._id === this.selectedItem.begonaUtlarTuriId);
      }
      if (this.begonaUtlar.length > 0 && this.selectedItem.begonaUtlarId) {
        this.begonaUtlarName = this.begonaUtlar.find(x => x._id === this.selectedItem.begonaUtlarId);
        this.imageSrc = this.begonaUtlarName.imageSrc;
        if (this.begonaUtlarName.imageSrc.length) {
          this.imagePreview = this.begonaUtlarName.imageSrc[1].url;
        }
      }
      if (this.zararkunandalarTuri.length > 0 && this.selectedItem.zararkunandalarTuriId) {
        this.zararkunandalarTuriName = this.zararkunandalarTuri.find(x => x._id === this.selectedItem.zararkunandalarTuriId);
      }
      if (this.zararkunandalar.length > 0 && this.selectedItem.zararkunandalarId) {
        this.zararkunandalarName = this.zararkunandalar.find(x => x._id === this.selectedItem.zararkunandalarId);
        this.imageSrc = this.zararkunandalarName.imageSrc;
        if (this.zararkunandalarName.imageSrc.length) {
          this.imagePreview = this.zararkunandalarName.imageSrc[1].url;
        }
      }
      if (this.selectedItem.imageSrcDalolatnoma && this.selectedItem.imageSrcDalolatnoma.length > 1) {
        this.imageSrcDalolatnoma = this.selectedItem.imageSrcDalolatnoma;
        this.imagePreviewDalolatnoma = this.selectedItem.imageSrcDalolatnoma[1].url;
      } else {
        this.imagePreviewDalolatnoma = '';
      }
      if (this.selectedItem.imageSrcLabaratoriya && this.selectedItem.imageSrcLabaratoriya.length > 1) {
        this.imageSrcLabaratoriya = this.selectedItem.imageSrcLabaratoriya;
        this.imagePreviewLabaratoriya = this.selectedItem.imageSrcLabaratoriya[1].url;
      } else {
        this.imagePreviewLabaratoriya = '';
      }
      if (this.kurashUsullari.length > 0 && this.selectedItem.kurashUsullariId) {
        this.kurashUsullariName = this.kurashUsullari.find(x => x._id === this.selectedItem.kurashUsullariId);
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimId);
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
    this.isVisbleForm = false;
    this.getAll();
    this.EnableButton();
    this.secondFormGroup.reset();
    this.imageSrcDalolatnoma.splice(0, this.imageSrcDalolatnoma.length);
    this.imageSrcLabaratoriya.splice(0, this.imageSrcLabaratoriya.length);
    this.filesToUploadDalolatnoma.splice(0, this.filesToUploadDalolatnoma.length);
    this.imagePreviewDalolatnoma = '';
    this.imagePreviewLabaratoriya = '';
    this.imagePreview = '';
    this.imageSrc = [];
    this.stepperRef.previous();
  }

  getXulosalar() {
    this.apiService.getAll<Xulosalar>('xulosalar/')
      .subscribe(result => {
        this.xulosalar = result;
      });
  }

  getKurashUsuliXulosa() {
    this.apiService.getAll<KurashUsullari>('kurashishUsuliXulosa/')
      .subscribe(result => {
        this.kurashUsuliXulosa = result;
      });
  }

  getLabaratoriyaXulosa() {
    this.apiService.getAll<LabaratoriyaXulosa>('labaratoriyaXulosa/')
      .subscribe(result => {
        this.labaratoriyaXulosa = result;
      });
  }

  getFaoliyatTuri() {
    this.apiService.getAll<FaoliyatTuri>('faoliyatTuri/')
      .subscribe(result => {
        this.faoliyatTuri = result;
      });
    this.faoliyatYunalishi = [];
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
    this.tumanlar = [];
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
      this.massivlar = [];
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
      this.fermerXujaligi = [];
    }
  }

  getQfylar() {
    if (this.tumanlarId) {
      const params = Object.assign({}, {
        allIds: this.tumanlarId._id
      });
      this.apiService.getObjectId<Qfylar[]>(params, '/qfylar')
        .subscribe(result => {
          this.qfylar = result;
        });
      this.mfylar = [];
    }
  }

  getMfylar() {
    if (this.qfylarId) {
      const params = Object.assign({}, {
        allIds: this.qfylarId._id
      });
      this.apiService.getObjectId<Mfylar[]>(params, '/mfylar')
        .subscribe(result => {
          this.mfylar = result;
        });
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

  getKasalliklarTuri() {
    this.apiService.getAll<KasalliklarTuri>('kasalliklarTuri/')
      .subscribe(result => {
        this.kasalliklarTuri = result;
      });
    this.kasalliklar = [];
  }

  getKasalliklar() {
    if (this.kasalliklarTuriId) {
      const params = Object.assign({}, {
        allIds: this.kasalliklarTuriId._id
      });
      this.apiService.getObjectId<Kasalliklar[]>(params, 'kasalliklar')
        .subscribe(result => {
          this.kasalliklar = result;
        });
    }
  }

  getBegonaUtlarTuri() {
    this.apiService.getAll<BegonaUtlarTuri>('begonaUtlarTuri/')
      .subscribe(result => {
        this.begonaUtlarTuri = result;
      });
    this.begonaUtlar = [];
  }

  getBegonaUtlar() {
    if (this.begonaUtlarTuriId) {
      const params = Object.assign({}, {
        allIds: this.begonaUtlarTuriId._id
      });
      this.apiService.getObjectId<BegonaUtlar[]>(params, 'begonaUtlar')
        .subscribe(result => {
          this.begonaUtlar = result;
        });
    }
  }

  getZararkunandalarTuri() {
    this.apiService.getAll<ZararkunandalarTuri>('zararkunandalarTuri/')
      .subscribe(result => {
        this.zararkunandalarTuri = result;
      });
    this.zararkunandalarTuri = [];
  }

  getZararkunandalar() {
    if (this.zararkunandalarTuriId) {
      const params = Object.assign({}, {
        allIds: this.zararkunandalarTuriId._id
      });
      this.apiService.getObjectId<Zararkunandalar[]>(params, 'zararkunandalar')
        .subscribe(result => {
          this.zararkunandalar = result;
        });
    }
  }

  getKurashUsullari() {
    this.apiService.getAll<KurashUsullari>('kurashUsullari/')
      .subscribe(result => {
        this.kurashUsullari = result;
      });
  }

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  onChangeFaoliyatTuri(event) {
    if (event) {
      this.secondFormGroup.get('faoliyatTuriId').setValue(event._id);
      this.secondFormGroup.get('faoliyatTuriName').setValue(event.name);
      if (event._id) {
        this.faoilyatTuriId = event;
        this.getFaoliyatYunalishlari();
      }
    } else {
      this.secondFormGroup.get('faoliyatTuriId').setValue('');
      this.secondFormGroup.get('faoliyatTuriName').setValue('');
    }
  }

  onChangeFaoliyatYunalishlari(event) {
    if (event) {
      const year = this.secondFormGroup.get('sana').value.toString().substring(0, 4);
      const month = this.secondFormGroup.get('sana').value.toString().substring(7, 5);
      const day = this.secondFormGroup.get('sana').value.toString().substring(10, 8);
      this.secondFormGroup.get('faoliyatYunalishlariId').setValue(event._id);
      this.secondFormGroup.get('faoliyatYunalishlariName').setValue(event.name);
      const params = Object.assign({}, {
        faoliyatYunalishlariId: event._id,
        fermerXujaligiId: this.secondFormGroup.get('fermerXujaligiId').value,
        year: year,
        month: month,
        day: day
      });
      this.apiService.getYerMardoni<PlanKiritish>(params, '/planKiritish')
        .subscribe(result => {
          this.plan = result;
          if (this.plan) {
            this.secondFormGroup.get('yerMaydoni').setValue(this.plan.yerMaydoni);
          } else {
            this.secondFormGroup.get('yerMaydoni').setValue('');
          }
        });


    } else {
      this.secondFormGroup.get('faoliyatYunalishlariId').setValue('');
      this.secondFormGroup.get('faoliyatYunalishlariName').setValue('');
    }
  }

  onChangeViloyatlar(event) {
    if (event) {
      this.secondFormGroup.get('viloyatId').setValue(event._id);
      this.secondFormGroup.get('viloyatName').setValue(event.name);
      if (event._id) {
        this.viloyatId = event;
        this.getTumanlar();
      }
    } else {
      this.secondFormGroup.get('viloyatId').setValue('');
      this.secondFormGroup.get('viloyatName').setValue('');
    }
  }

  onChangeTumanlar(event) {
    if (event) {
      this.secondFormGroup.get('tumanId').setValue(event._id);
      this.secondFormGroup.get('tumanName').setValue(event.name);
      if (event._id) {
        this.tumanlarId = event;
        this.getMassivlar();
        this.getQfylar();
      }
    } else {
      this.secondFormGroup.get('tumanId').setValue('');
      this.secondFormGroup.get('tumanName').setValue('');
    }
  }

  onChangeMassivlar(event) {
    if (event) {
      this.secondFormGroup.get('massivId').setValue(event._id);
      this.secondFormGroup.get('massivName').setValue(event.name);
      if (event._id) {
        this.massivlarId = event;
        this.getFermerXujaliklari();
      }
    } else {
      this.secondFormGroup.get('massivId').setValue('');
      this.secondFormGroup.get('massivName').setValue('');
    }
  }

  onChangeQfylar(event) {
    if (event) {
      this.secondFormGroup.get('qfyId').setValue(event._id);
      this.secondFormGroup.get('qfyName').setValue(event.name);
      if (event._id) {
        this.qfylarId = event;
        this.getMfylar();
      }
    } else {
      this.secondFormGroup.get('qfyId').setValue('');
      this.secondFormGroup.get('qfyName').setValue('');
    }
  }

  onChangeMfylar(event) {
    if (event) {
      this.secondFormGroup.get('mfyId').setValue(event._id);
      this.secondFormGroup.get('mfyName').setValue(event.name);
    } else {
      this.secondFormGroup.get('mfyId').setValue('');
      this.secondFormGroup.get('mfyName').setValue('');
    }
  }

  onChangeFermerXujaliklari(event) {
    if (event) {
      this.secondFormGroup.get('fermerXujaligiId').setValue(event._id);
      this.secondFormGroup.get('fermerXujaligiName').setValue(event.name);
      this.secondFormGroup.get('raxbari').setValue(event.raxbari);
    } else {
      this.secondFormGroup.get('fermerXujaligiId').setValue('');
      this.secondFormGroup.get('fermerXujaligiName').setValue('');
      this.secondFormGroup.get('raxbari').setValue('');
    }
  }

  onChangeKasalliklarTuri(event) {
    if (event) {
      this.secondFormGroup.get('kasalliklarTuriId').setValue(event._id);
      if (event._id) {
        this.kasalliklarTuriId = event;
        this.getKasalliklar();
        this.zararkunandalar = [];
        this.begonaUtlar = [];
        this.zararkunandalarTuriName = null;
        this.begonaUtlarTuriName = null;
        this.secondFormGroup.get('zararkunandalarTuriId').setValue('');
        this.secondFormGroup.get('zararkunandalarId').setValue('');
        this.secondFormGroup.get('begonaUtlarTuriId').setValue('');
        this.secondFormGroup.get('begonaUtlarId').setValue('');
      }
    } else {
      this.secondFormGroup.get('kasalliklarTuriId').setValue('');

    }
  }

  onChangeKasalliklar(event) {
    if (event) {
      this.secondFormGroup.get('kasalliklarId').setValue(event._id);
      if (event.imageSrc && event.imageSrc.length > 1) {
        this.imageSrc = event.imageSrc;
        this.imagePreview = event.imageSrc[1].url;
      } else {
        this.imagePreview = '';
      }
      this.EditCopySelected = true;
      if (event.imageSrc.length > 2) {
        this.oldingaDistable = false;
        this.ortgaDisable = true;
        this.indexImages = 0;
      } else {
        this.oldingaDistable = true;
        this.ortgaDisable = true;
        this.indexImages = 0;
      }
    } else {
      this.secondFormGroup.get('kasalliklarId').setValue('');
    }
  }

  onChangeZararkunandalarTuri(event) {
    if (event) {
      this.secondFormGroup.get('zararkunandalarTuriId').setValue(event._id);
      if (event._id) {
        this.zararkunandalarTuriId = event;
        this.getZararkunandalar();
        this.kasalliklar = [];
        this.begonaUtlar = [];
        this.kasalliklarTuriName = null;
        this.begonaUtlarTuriName = null;
        this.secondFormGroup.get('kasalliklarTuriId').setValue('');
        this.secondFormGroup.get('kasalliklarId').setValue('');
        this.secondFormGroup.get('begonaUtlarTuriId').setValue('');
        this.secondFormGroup.get('begonaUtlarId').setValue('');
      }
    } else {
      this.secondFormGroup.get('zararkunandalarTuriId').setValue('');
    }
  }

  onChangeZararkunandalar(event) {
    if (event) {
      this.secondFormGroup.get('zararkunandalarId').setValue(event._id);
      if (event.imageSrc && event.imageSrc.length > 1) {
        this.imageSrc = event.imageSrc;
        this.imagePreview = event.imageSrc[1].url;
      } else {
        this.imagePreview = '';
      }
      this.EditCopySelected = true;
      if (event.imageSrc.length > 2) {
        this.oldingaDistable = false;
        this.ortgaDisable = true;
        this.indexImages = 0;
      } else {
        this.oldingaDistable = true;
        this.ortgaDisable = true;
        this.indexImages = 0;
      }
    } else {
      this.secondFormGroup.get('zararkunandalarId').setValue('');
    }
  }

  onChangeBegonaUtlarTuri(event) {
    if (event) {
      this.secondFormGroup.get('begonaUtlarTuriId').setValue(event._id);
      if (event._id) {
        this.begonaUtlarTuriId = event;
        this.getBegonaUtlar();
        this.zararkunandalar = [];
        this.kasalliklar = [];
        this.zararkunandalarTuriName = null;
        this.kasalliklarTuriName = null;
        this.secondFormGroup.get('kasalliklarTuriId').setValue('');
        this.secondFormGroup.get('kasalliklarId').setValue('');
        this.secondFormGroup.get('zararkunandalarTuriId').setValue('');
        this.secondFormGroup.get('zararkunandalarId').setValue('');
      }
    } else {
      this.secondFormGroup.get('begonaUtlarTuriId').setValue('');
    }
  }

  onChangeBegonaUtlar(event) {
    if (event) {
      this.secondFormGroup.get('begonaUtlarId').setValue(event._id);
      if (event.imageSrc && event.imageSrc.length > 1) {
        this.imageSrc = event.imageSrc;
        this.imagePreview = event.imageSrc[1].url;
      } else {
        this.imagePreview = '';
      }
      this.EditCopySelected = true;
      if (event.imageSrc.length > 2) {
        this.oldingaDistable = false;
        this.ortgaDisable = true;
        this.indexImages = 0;
      } else {
        this.oldingaDistable = true;
        this.ortgaDisable = true;
        this.indexImages = 0;
      }
    } else {
      this.secondFormGroup.get('begonaUtlarId').setValue('');
    }
  }

  onChangeKurashUsullari(event) {
    if (event) {
      this.secondFormGroup.get('kurashUsullariId').setValue(event._id);
    } else {
      this.secondFormGroup.get('kurashUsullariId').setValue('');
    }
  }

  onChangeXodimlar(event) {
    if (event) {
      this.secondFormGroup.get('xodimId').setValue(event._id);
      this.secondFormGroup.get('xodimName').setValue(event.name);
    } else {
      this.secondFormGroup.get('xodimId').setValue('');
      this.secondFormGroup.get('xodimName').setValue('');
    }
  }

  onChangeJismoniylar() {
    this.yuridiklar = false;
    this.massivlarName = null;
    this.fermerXujaligi = null;
    this.secondFormGroup.get('raxbari').setValue('');
  }

  onChangeYuridiklar() {
    this.jismoniylar = false;
    this.qfylarName = null;
    this.mfylar = null;
    this.secondFormGroup.get('xonadon').setValue('');

  }

  onChangeXulosalar() {
    const dialogRef = this.dialogFilter.open(XulosalarFilterForDocumentsComponent, {
      width: '700px',
      data: {nameXulosa: 'Режа бўйича назорат хулосасини танланг!', xulosalar: this.xulosalar, matIcons: 'flip_to_back'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.StringXulosalar = '';
      if (result.ok && result.clickXulosa) {
        for (let value of result.clickXulosa) {
          if (value.name === 'ва бошка....') {
            this.readonlyXulosalarXulosasi = false;
            this.secondFormGroup.get('xulosa').setValue('');
            this.openSnackBar('Хулосани киритинг', 'Хатолик', 2);
            return;
          }
          this.readonlyXulosalarXulosasi = true;
          this.StringXulosalar = value.name + ' , ' + this.StringXulosalar;
        }
        if (this.StringXulosalar) {
          this.secondFormGroup.get('xulosa').setValue(this.StringXulosalar);
        }
      }
    });
  }

  onChangeKurashihsUsullariXulosa() {
    const dialogRef = this.dialogFilter.open(XulosalarFilterForDocumentsComponent, {
      width: '700px',
      data: {
        nameXulosa: 'Курашиши усули хулосасини танланг!',
        xulosalar: this.kurashUsuliXulosa,
        matIcons: 'blur_circular'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.StringKurashUsuliXulosa = '';
      if (result.ok && result.clickXulosa) {
        for (let value of result.clickXulosa) {
          if (value.name === 'ва бошка....') {
            this.readonlyKurashUsusllariXulosasi = false;
            this.secondFormGroup.get('kurashishUsuliXulosasi').setValue('');
            this.openSnackBar('Хулосани киритинг', 'Хатолик', 2);
            return;
          }
          this.readonlyKurashUsusllariXulosasi = true;
          this.StringKurashUsuliXulosa = value.name + ' , ' + this.StringKurashUsuliXulosa;
        }
        if (this.StringKurashUsuliXulosa) {
          this.secondFormGroup.get('kurashishUsuliXulosasi').setValue(this.StringKurashUsuliXulosa);
        }
      }
    });
  }

  onChangeLabaratoriyaXulosalari() {
    const dialogRef = this.dialogFilter.open(XulosalarFilterForDocumentsComponent, {
      width: '700px',
      data: {
        nameXulosa: 'Лабаратория хулосасини танланг!',
        xulosalar: this.labaratoriyaXulosa,
        matIcons: 'notes'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.StringlabaratoriyaXulosa = '';
      if (result.ok && result.clickXulosa) {
        for (let value of result.clickXulosa) {
          if (value.name === 'ва бошка....') {
            this.readonlyLabaratoriyaXulosasi = false;
            this.secondFormGroup.get('labaratoriyaXulosasi').setValue('');
            this.openSnackBar('Хулосани киритинг', 'Хатолик', 2);
            return;
          }
          this.readonlyLabaratoriyaXulosasi = true;
          this.StringlabaratoriyaXulosa = value.name + ' , ' + this.StringlabaratoriyaXulosa;
        }
        if (this.StringlabaratoriyaXulosa) {
          this.secondFormGroup.get('labaratoriyaXulosasi').setValue(this.StringlabaratoriyaXulosa);
        }
      }
    });
  }

  onChangeTopildi() {
    this.topilmadi = false;
    this.secondFormGroup.get('labaratoriya').enable();
    this.secondFormGroup.get('labaratoriyaXulosasi').enable();
    this.secondFormGroup.get('kurashishUsuliXulosasi').enable();
    this.secondFormGroup.get('muddati').enable();

  }

  onChangeTopilmadi() {
    this.topildi = false;
    this.labaratoriya = false;
    this.secondFormGroup.get('muddati').setValue('');
    this.secondFormGroup.get('labaratoriyaXulosasi').setValue('');
    this.secondFormGroup.get('labaratoriyaXulosasi').disable();
    this.secondFormGroup.get('kurashishUsuliXulosasi').setValue('');
    this.secondFormGroup.get('kurashishUsuliXulosasi').disable();
    this.secondFormGroup.get('labaratoriya').disable();
    this.secondFormGroup.get('muddati').disable();
    this.kurashUsullariName = null;

  }

  onChangeLabaratoirya() {
    //this.readonlyLabaratoriyaXulosasi = this.labaratoriya;
  }

  ortga() {
    if (this.imageSrc.length > 1) {
      const images = this.imageSrc[this.indexImages - 1];
      this.indexImages = this.indexImages - 1;
      if (this.indexImages === 1) {
        this.imagePreview = this.imageSrc[1].url;
        this.ortgaDisable = true;
      } else {
        this.ortgaDisable = false;
        if (images) {
          this.imagePreview = images.url;
        } else {
          this.imagePreview = this.imageSrc[1].url;
        }
      }
      this.oldingaDistable = false;
    }
  }

  oldinga() {
    if (this.imageSrc.length > 1) {
      this.indexImages = this.indexImages + 1;
      this.oldingaDistable = false;
      const images = this.imageSrc[this.indexImages];
      if (images) {
        this.imagePreview = images.url;
      }
    } else {
      this.oldingaDistable = true;
    }
  }

  onCloseForm() {
    this.faoliyatTuriName = null;
    this.faoliyatTunalishiName = null;
    this.viloyatlarName = null;
    this.tumanlarName = null;
    this.massivlarName = null;
    this.qfylarName = null;
    this.mfylarName = null;
    this.kasalliklarTuriName = null;
    this.kasalliklarName = null;
    this.zararkunandalarTuriName = null;
    this.zararkunandalarName = null;
    this.begonaUtlarTuriName = null;
    this.begonaUtlarName = null;
    this.fermerXujaligiName = null;
    this.kurashUsullariName = null;
    this.xodimlarName = null;

    this.tumanlar = [];
    this.massivlar = [];
    this.qfylar = [];
    this.mfylar = [];
    this.fermerXujaligi = [];
    this.faoliyatYunalishi = [];
    this.kasalliklar = [];
    this.begonaUtlar = [];
    this.zararkunandalar = [];
    this.xodimlar = [];
    this.kurashUsullari = [];
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
    this.secondFormGroup.patchValue({topilmadi: true});
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedTumanAndMassiv(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.viloyatlarName = null;
    this.faoliyatTuriName = null;
    this.kasalliklarTuriName = null;
    this.begonaUtlarTuriName = null;
    this.zararkunandalarTuriName = null;
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
    } else {
      this.fermerXujaligi = [];
    }

    if (this.selectedItem.tumanId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.tumanId
      });
      this.apiService.getObjectId<Qfylar[]>(params, '/qfylar')
        .subscribe(result => {
          this.qfylar = result;
        });
    }

    if (this.selectedItem.qfyId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.qfyId
      });
      this.apiService.getObjectId<Mfylar[]>(params, '/mfylar')
        .subscribe(result => {
          this.mfylar = result;
        });
    } else {
      this.mfylar = [];
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

    if (this.selectedItem.kasalliklarTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.kasalliklarTuriId
      });
      this.apiService.getObjectId<Kasalliklar[]>(params, '/kasalliklar')
        .subscribe(result => {
          this.kasalliklar = result;
        });
    } else {
      this.kasalliklar = [];
    }

    if (this.selectedItem.begonaUtlarTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.begonaUtlarTuriId
      });
      this.apiService.getObjectId<BegonaUtlar[]>(params, '/begonaUtlar')
        .subscribe(result => {
          this.begonaUtlar = result;
        });
    } else {
      this.begonaUtlar = [];
    }

    if (this.selectedItem.zararkunandalarTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.zararkunandalarTuriId
      });
      this.apiService.getObjectId<Zararkunandalar[]>(params, '/zararkunandalar')
        .subscribe(result => {
          this.zararkunandalar = result;
        });
    } else {
      this.zararkunandalar = [];
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
    this.secondFormGroup.patchValue({yuridik: true});
    this.secondFormGroup.patchValue({topilmadi: true});
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
      this.apiService.updated<RejaBuyichaNazorat>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<RejaBuyichaNazorat>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<RejaBuyichaNazorat>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<RejaBuyichaNazorat>>(params, this.className)
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
