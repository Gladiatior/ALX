import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Fumigatsiya, ImagesTypesDocs} from '../../classes/interfaceDoc';
import {RoutService} from '../../services/rout.service';
import {MatDialog, MatHorizontalStepper, MatSnackBar} from '@angular/material';
import {RestClientDocumentsService} from '../../services/rest-client-documents.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  FaoliyatTuri,
  FaoliyatYunalishi,
  FermerXujaligi, FumigatsiyaForSpravochnik,
  FumigatsiyaTuri,
  ImagesTypes,
  Kasalliklar,
  KasalliklarTuri,
  LabaratoriyaXulosa,
  Massivlar,
  Mfylar, Preparatlar,
  Qfylar,
  Tumanlar,
  Viloyatlar,
  Xodimlar,
  Xulosalar,
  Zararkunandalar,
  ZararkunandalarTuri
} from '../../classes/interfaceSpr';
import {PageResponse} from '../../classes/pageResponse';
import {FilterDocumentsDateComponent} from '../../filter-documents-date/filter-documents-date.component';
import {FilterDateDocuments} from '../../classes/docFilter';
import {XulosalarFilterForDocumentsComponent} from "../../xulosalar-filter-for-documents/xulosalar-filter-for-documents.component";


@Component({
  selector: 'app-fumigatsiya',
  templateUrl: './fumigatsiya.component.html',
  styleUrls: ['../../../assets/styles/Documents.css']
})
export class FumigatsiyaComponent implements OnInit {
  displayedColumns: string[] = ['tasdiqlash', 'id', 'sana', 'yuridik',
    'jismoniy', 'labaratoriya', 'xodim', 'afblankanomer', 'viloyat',
    'qfy', 'massiv', 'mfy', 'tuman', 'faoliyatTuri',
    'faoliyatYunalishi', 'fermer', 'fumigator', 'fumigatsiyaTuri',
    'fumigatsiyaObyekt', 'xonadon',];
  filterDocuments: FilterDateDocuments = {};

  readonlyXulosalarXulosasi = true;
  readonlyLabaratoriyaXulosasi = true;

  StringXulosalar = '';
  StringlabaratoriyaXulosa = '';

  imagePreviewLabaratoriya: string | ArrayBuffer = '';
  imagePreview: string | ArrayBuffer = '';

  indexImages = 0;
  ortgaDisable = true;
  oldingaDistable = true;
  EditCopySelected: boolean;

  yuridiklar = true;
  jismoniylar = false;

  labaratoriya = false;

  imageSrc: ImagesTypes[] = [];
  imageSrcLabaratoriya: ImagesTypesDocs[] = [];

  filesToUploadDalolatnoma: Array<File> = [];

  faoliyatTuri: FaoliyatTuri[] = [];
  faoliyatTuriName: FaoliyatTuri;
  faoilyatTuriId: FaoliyatTuri;
  faoliyatYunalishi: FaoliyatYunalishi[] = [];
  faoliyatTunalishiName: FaoliyatYunalishi;

  fumigatsiyaTuri: FumigatsiyaTuri[] = [];
  fumigatsiyaTuriName: FumigatsiyaTuri;
  fumigatsiyaTuriId: FumigatsiyaTuri;

  fumigatsiya: FumigatsiyaForSpravochnik[] = [];
  fumigatsiyaName: FumigatsiyaForSpravochnik;

  preparatlar: Preparatlar[] = [];
  preparatlarName: Preparatlar;

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

  zararkunandalarTuri: ZararkunandalarTuri[] = [];
  zararkunandalarTuriName: ZararkunandalarTuri;
  zararkunandalarTuriId: ZararkunandalarTuri;
  zararkunandalar: Zararkunandalar[] = [];
  zararkunandalarName: Zararkunandalar;


  xodimlar: Xodimlar[] = [];
  xodimlarName: Xodimlar;

  xulosalar: Xulosalar[] = [];
  labaratoriyaXulosa: LabaratoriyaXulosa[] = [];

  fumigator: Xodimlar[] = [];
  fumigatorName: Xodimlar;

  xaqiqiySana = 0;
  s = 0;
  data1: number;
  data2: number;

  kun = '';
  oy = '';
  yil = '';

  @ViewChild('stepper') stepperRef: MatHorizontalStepper;
  @ViewChild('imageInputLabaratoriya') inputRefLabaratoriya: ElementRef;


  Buttons: boolean;
  tartibRaqamLength: number;
  isVisbleForm = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedItem: Fumigatsiya;
  reloading = false;
  positionId: string;
  className = 'fumigatsiya';
  list: Fumigatsiya;
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
     // this.onSubmit();
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
      kasalliklarTuriId: new FormControl(''),
      kasalliklarId: new FormControl(''),
      zararkunandalarTuriId: new FormControl(''),
      zararkunandalarId: new FormControl(''),
      labaratoriya: new FormControl({value: this.labaratoriya}),
      labaratoriyaXulosasi: new FormControl({value: ''}),
      imageSrcLabaratoriya: new FormControl([]),
      xodimId: new FormControl('', Validators.required),
      xodimName: new FormControl(''),
      foydalanuvchiId: new FormControl(''),
      vakilFIO: new FormControl(''),
      obektUlchami: new FormControl(''),
      obektXarorati: new FormControl(''),
      boshlanishVaqti: new FormControl(new Date()),
      tugashVaqti: new FormControl(new Date()),
      ekspozitsiya: new FormControl(0),
      degezatsiya: new FormControl(''),
      fumigatsiyaTuriId: new FormControl(''),
      fumigatsiyaTuriName: new FormControl(''),
      fumigatsiyaForSpravochnikId: new FormControl(''),
      fumigatsiyaForSpravochnikName: new FormControl(''),
      narxi: new FormControl(0),
      jamiSumma: new FormControl(0),
      preparatlarId: new FormControl(''),
      preparatlarName: new FormControl(''),
      dozirovka: new FormControl(0),
      preparatXajmi: new FormControl(0),
      bioIndikator: new FormControl(''),
      natijaXulosa: new FormControl(''),
      afBlankaNomer: new FormControl(''),
      fumigatorId: new FormControl(''),
      fumigatorName: new FormControl(''),
      fumigatsiyaObyekt: new FormControl(''),
      ishlatilganPreparatXajmi: new FormControl(0),
      junatuvchi: new FormControl(0),
      qabulQiluvchi: new FormControl(0),
    });
    this.getLabaratoriyaXulosa();
    this.getViloyatlar();
    this.getFaoliyatTuri();
    this.getXodimlar();
    this.getFumigatsiyaTuri();
    this.getKasalliklarTuri();
    this.getFumigator();
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
    const newFumigatsiya: Fumigatsiya = {
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
      raxbari: this.secondFormGroup.value.raxbari,
      kasalliklarTuriId: this.secondFormGroup.value.kasalliklarTuriId,
      kasalliklarId: this.secondFormGroup.value.kasalliklarId,
      zararkunandalarTuriId: this.secondFormGroup.value.zararkunandalarTuriId,
      zararkunandalarId: this.secondFormGroup.value.zararkunandalarId,
      labaratoriya: this.secondFormGroup.value.labaratoriya,
      labaratoriyaXulosasi: this.secondFormGroup.value.labaratoriyaXulosasi,
      imageSrcLabaratoriya: this.imageSrcLabaratoriya,
      xodimId: this.secondFormGroup.value.xodimId,
      xodimName: this.secondFormGroup.value.xodimName,
      foydalanuvchiId: this.secondFormGroup.value.foydalanuvchiId,
      vakilFIO: this.secondFormGroup.value.vakilFIO,
      obektUlchami: this.secondFormGroup.value.obektUlchami,
      obektXarorati: this.secondFormGroup.value.obektXarorati,
      boshlanishVaqti: this.secondFormGroup.value.boshlanishVaqti,
      tugashVaqti: this.secondFormGroup.value.tugashVaqti,
      ekspozitsiya: this.secondFormGroup.value.ekspozitsiya,
      degezatsiya: this.secondFormGroup.value.degezatsiya,
      fumigatsiyaTuriId: this.secondFormGroup.value.fumigatsiyaTuriId,
      fumigatsiyaTuriName: this.secondFormGroup.value.fumigatsiyaTuriName,
      fumigatsiyaForSpravochnikId: this.secondFormGroup.value.fumigatsiyaForSpravochnikId,
      fumigatsiyaForSpravochnikName: this.secondFormGroup.value.fumigatsiyaForSpravochnikName,
      narxi: this.secondFormGroup.value.narxi,
      jamiSumma: this.secondFormGroup.value.jamiSumma,
      preparatlarId: this.secondFormGroup.value.preparatlarId,
      preparatlarName: this.secondFormGroup.value.preparatlarName,
      dozirovka: this.secondFormGroup.value.dozirovka,
      preparatXajmi: this.secondFormGroup.value.preparatXajmi,
      bioIndikator: this.secondFormGroup.value.bioIndikator,
      natijaXulosa: this.secondFormGroup.value.natijaXulosa,
      afBlankaNomer: this.secondFormGroup.value.afBlankaNomer,
      fumigatorId: this.secondFormGroup.value.fumigatorId,
      fumigatorName: this.secondFormGroup.value.fumigatorName,
      fumigatsiyaObyekt: this.secondFormGroup.value.fumigatsiyaObyekt,
      ishlatilganPreparatXajmi: this.secondFormGroup.value.ishlatilganPreparatXajmi,
      junatuvchi: this.secondFormGroup.value.junatuvchi,
      qabulQiluvchi: this.secondFormGroup.value.qabulQiluvchi,
    };
    if (newFumigatsiya) {
      const fd = new FormData();
      if (this.filesToUploadDalolatnoma) {
        for (const valueDalolatnoma of this.filesToUploadDalolatnoma) {
          fd.append('imageDalolatNoma', valueDalolatnoma, valueDalolatnoma.name);
        }
      }
      fd.append('tasdiqlash', String(newFumigatsiya.tasdiqlash));
      fd.append('tartibRaqam', String(newFumigatsiya.tartibRaqam));
      fd.append('sana', String(newFumigatsiya.sana));
      fd.append('yuridik', (newFumigatsiya.yuridik ? String(newFumigatsiya.yuridik) : String(false)));
      fd.append('jismoniy', (newFumigatsiya.jismoniy ? String(newFumigatsiya.jismoniy) : String(false)));
      fd.append('viloyatId', (newFumigatsiya.viloyatId) ? newFumigatsiya.viloyatId : '');
      fd.append('viloyatName', (newFumigatsiya.viloyatName) ? newFumigatsiya.viloyatName : '');
      fd.append('tumanId', (newFumigatsiya.tumanId) ? newFumigatsiya.tumanId : '');
      fd.append('tumanName', (newFumigatsiya.tumanName) ? newFumigatsiya.tumanName : '');
      fd.append('massivId', (newFumigatsiya.massivId) ? newFumigatsiya.massivId : '');
      fd.append('massivName', (newFumigatsiya.massivName) ? newFumigatsiya.massivName : '');
      fd.append('fermerXujaligiId', (newFumigatsiya.fermerXujaligiId) ? newFumigatsiya.fermerXujaligiId : '');
      fd.append('fermerXujaligiName', (newFumigatsiya.fermerXujaligiName) ? newFumigatsiya.fermerXujaligiName : '');
      fd.append('raxbari', (newFumigatsiya.raxbari) ? newFumigatsiya.raxbari : '');
      fd.append('qfyId', (newFumigatsiya.qfyId) ? newFumigatsiya.qfyId : '');
      fd.append('qfyName', (newFumigatsiya.qfyName) ? newFumigatsiya.qfyName : '');
      fd.append('mfyId', (newFumigatsiya.mfyId) ? newFumigatsiya.mfyId : '');
      fd.append('mfyName', (newFumigatsiya.mfyName) ? newFumigatsiya.mfyName : '');
      fd.append('xonadon', (newFumigatsiya.xonadon) ? newFumigatsiya.xonadon : '');
      fd.append('faoliyatTuriId', (newFumigatsiya.faoliyatTuriId) ? newFumigatsiya.faoliyatTuriId : '');
      fd.append('faoliyatTuriName', (newFumigatsiya.faoliyatTuriName) ? newFumigatsiya.faoliyatTuriName : '');
      fd.append('faoliyatYunalishlariId', (newFumigatsiya.faoliyatYunalishlariId) ? newFumigatsiya.faoliyatYunalishlariId : '');
      fd.append('faoliyatYunalishlariName', (newFumigatsiya.faoliyatYunalishlariName) ? newFumigatsiya.faoliyatYunalishlariName : '');
      fd.append('kasalliklarTuriId', (newFumigatsiya.kasalliklarTuriId) ? newFumigatsiya.kasalliklarTuriId : '');
      fd.append('kasalliklarId', (newFumigatsiya.kasalliklarId) ? newFumigatsiya.kasalliklarId : '');
      fd.append('zararkunandalarTuriId', (newFumigatsiya.zararkunandalarTuriId) ? newFumigatsiya.zararkunandalarTuriId : '');
      fd.append('zararkunandalarId', (newFumigatsiya.zararkunandalarId) ? newFumigatsiya.zararkunandalarId : '');
      fd.append('labaratoriya', (newFumigatsiya.labaratoriya ? String(newFumigatsiya.labaratoriya) : String(false)));
      fd.append('labaratoriyaXulosasi', (newFumigatsiya.labaratoriyaXulosasi) ? newFumigatsiya.labaratoriyaXulosasi : '');
      fd.append('xodimId', (newFumigatsiya.xodimId) ? newFumigatsiya.xodimId : '');
      fd.append('xodimName', (newFumigatsiya.xodimName) ? newFumigatsiya.xodimName : '');
      fd.append('vakilFIO', (newFumigatsiya.vakilFIO) ? newFumigatsiya.vakilFIO : '');
      fd.append('obektUlchami', (newFumigatsiya.obektUlchami) ? newFumigatsiya.obektUlchami : '');
      fd.append('obektXarorati', (newFumigatsiya.obektXarorati) ? newFumigatsiya.obektXarorati : '');
      fd.append('boshlanishVaqti', (newFumigatsiya.boshlanishVaqti) ? String(newFumigatsiya.boshlanishVaqti) : '');
      fd.append('tugashVaqti', (newFumigatsiya.tugashVaqti) ? String(newFumigatsiya.tugashVaqti) : '');
      fd.append('ekspozitsiya', (newFumigatsiya.ekspozitsiya) ? String(newFumigatsiya.ekspozitsiya) : '');
      fd.append('degezatsiya', (newFumigatsiya.degezatsiya) ? newFumigatsiya.degezatsiya : '');
      fd.append('fumigatsiyaTuriId', (newFumigatsiya.fumigatsiyaTuriId) ? newFumigatsiya.fumigatsiyaTuriId : '');
      fd.append('fumigatsiyaTuriName', (newFumigatsiya.fumigatsiyaTuriName) ? newFumigatsiya.fumigatsiyaTuriName : '');
      fd.append('fumigatsiyaForSpravochnikId', (newFumigatsiya.fumigatsiyaForSpravochnikId) ? newFumigatsiya.fumigatsiyaForSpravochnikId : '');
      fd.append('fumigatsiyaForSpravochnikName', (newFumigatsiya.fumigatsiyaForSpravochnikName) ? newFumigatsiya.fumigatsiyaForSpravochnikName : '');
      fd.append('narxi', (newFumigatsiya.narxi) ? String(newFumigatsiya.narxi) : '');
      fd.append('jamiSumma', (newFumigatsiya.jamiSumma) ? String(newFumigatsiya.jamiSumma) : '');
      fd.append('preparatlarId', (newFumigatsiya.preparatlarId) ? newFumigatsiya.preparatlarId : '');
      fd.append('preparatlarName', (newFumigatsiya.preparatlarName) ? newFumigatsiya.preparatlarName : '');
      fd.append('dozirovka', (newFumigatsiya.dozirovka) ? String(newFumigatsiya.dozirovka) : '');
      fd.append('preparatXajmi', (newFumigatsiya.preparatXajmi) ? String(newFumigatsiya.preparatXajmi) : '');
      fd.append('bioIndikator', (newFumigatsiya.bioIndikator) ? newFumigatsiya.bioIndikator : '');
      fd.append('natijaXulosa', (newFumigatsiya.natijaXulosa) ? newFumigatsiya.natijaXulosa : '');
      fd.append('afBlankaNomer', (newFumigatsiya.afBlankaNomer) ? newFumigatsiya.afBlankaNomer : '');
      fd.append('fumigatorId', (newFumigatsiya.fumigatorId) ? newFumigatsiya.fumigatorId : '');
      fd.append('fumigatorName', (newFumigatsiya.fumigatorName) ? newFumigatsiya.fumigatorName : '');
      fd.append('fumigatsiyaObyekt', (newFumigatsiya.fumigatsiyaObyekt) ? newFumigatsiya.fumigatsiyaObyekt : '');
      fd.append('ishlatilganPreparatXajmi', (newFumigatsiya.ishlatilganPreparatXajmi) ? String(newFumigatsiya.ishlatilganPreparatXajmi) : '');
      fd.append('junatuvchi', (newFumigatsiya.junatuvchi) ? String(newFumigatsiya.junatuvchi) : '');
      fd.append('qabulQiluvchi', (newFumigatsiya.qabulQiluvchi) ? String(newFumigatsiya.qabulQiluvchi) : '');

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
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
    this.tartibRaqamLength = this.totalDocs + 1;
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.secondFormGroup.patchValue({yuridik: true});
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
    this.fermerXujaligiName = null;
    this.xodimlarName = null;
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
        raxbari: this.selectedItem.raxbari,
        qfyId: this.selectedItem.qfyId,
        qfyName: this.selectedItem.qfyName,
        mfyId: this.selectedItem.mfyId,
        mfyName: this.selectedItem.mfyName,
        xonadon: this.selectedItem.xonadon,
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatTuriName: this.selectedItem.faoliyatTuriName,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        faoliyatYunalishlariName: this.selectedItem.faoliyatYunalishlariName,
        kasalliklarTuriId: this.selectedItem.kasalliklarTuriId,
        kasalliklarId: this.selectedItem.kasalliklarId,
        zararkunandalarTuriId: this.selectedItem.zararkunandalarTuriId,
        zararkunandalarId: this.selectedItem.zararkunandalarId,
        labaratoriya: this.selectedItem.labaratoriya,
        labaratoriyaXulosasi: this.selectedItem.labaratoriyaXulosasi,
        imageSrcLabaratoriya: this.imageSrcLabaratoriya,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        vakilFIO: this.selectedItem.vakilFIO,
        obektUlchami: this.selectedItem.obektUlchami,
        obektXarorati: this.selectedItem.obektXarorati,
        boshlanishVaqti: new Date(this.selectedItem.boshlanishVaqti).toISOString().slice(0,16),
        tugashVaqti: new Date(this.selectedItem.tugashVaqti).toISOString().slice(0,16),
        ekspozitsiya: this.selectedItem.ekspozitsiya,
        degezatsiya: this.selectedItem.degezatsiya,
        fumigatsiyaTuriId: this.selectedItem.fumigatsiyaTuriId,
        fumigatsiyaTuriName: this.selectedItem.fumigatsiyaTuriName,
        fumigatsiyaForSpravochnikId: this.selectedItem.fumigatsiyaForSpravochnikId,
        fumigatsiyaForSpravochnikName: this.selectedItem.fumigatsiyaForSpravochnikName,
        narxi: this.selectedItem.narxi,
        jamiSumma: this.selectedItem.jamiSumma,
        preparatlarId: this.selectedItem.preparatlarId,
        preparatlarName: this.selectedItem.preparatlarName,
        dozirovka: this.selectedItem.dozirovka,
        preparatXajmi: this.selectedItem.preparatXajmi,
        bioIndikator: this.selectedItem.bioIndikator,
        natijaXulosa: this.selectedItem.natijaXulosa,
        afBlankaNomer: this.selectedItem.afBlankaNomer,
        fumigatorId: this.selectedItem.fumigatorId,
        fumigatorName: this.selectedItem.fumigatorName,
        fumigatsiyaObyekt: this.selectedItem.fumigatsiyaObyekt,
        ishlatilganPreparatXajmi: this.selectedItem.ishlatilganPreparatXajmi,
        junatuvchi: this.selectedItem.junatuvchi,
        qabulQiluvchi: this.selectedItem.qabulQiluvchi,
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
      if (this.selectedItem.imageSrcLabaratoriya && this.selectedItem.imageSrcLabaratoriya.length > 1) {
        this.imageSrcLabaratoriya = this.selectedItem.imageSrcLabaratoriya;
        this.imagePreviewLabaratoriya = this.selectedItem.imageSrcLabaratoriya[1].url;
      } else {
        this.imagePreviewLabaratoriya = '';
      }
      if (this.xodimlar.length > 0 && this.selectedItem.xodimId) {
        this.xodimlarName = this.xodimlar.find(x => x._id === this.selectedItem.xodimId);
      }
      if (this.fumigator.length > 0 && this.selectedItem.fumigatorId) {
        this.fumigatorName = this.fumigator.find(x => x._id === this.selectedItem.fumigatorId);
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
        raxbari: this.selectedItem.raxbari,
        qfyId: this.selectedItem.qfyId,
        qfyName: this.selectedItem.qfyName,
        mfyId: this.selectedItem.mfyId,
        mfyName: this.selectedItem.mfyName,
        xonadon: this.selectedItem.xonadon,
        faoliyatTuriId: this.selectedItem.faoliyatTuriId,
        faoliyatTuriName: this.selectedItem.faoliyatTuriName,
        faoliyatYunalishlariId: this.selectedItem.faoliyatYunalishlariId,
        faoliyatYunalishlariName: this.selectedItem.faoliyatYunalishlariName,
        kasalliklarTuriId: this.selectedItem.kasalliklarTuriId,
        kasalliklarId: this.selectedItem.kasalliklarId,
        zararkunandalarTuriId: this.selectedItem.zararkunandalarTuriId,
        zararkunandalarId: this.selectedItem.zararkunandalarId,
        labaratoriya: this.selectedItem.labaratoriya,
        labaratoriyaXulosasi: this.selectedItem.labaratoriyaXulosasi,
        imageSrcLabaratoriya: this.imageSrcLabaratoriya,
        xodimId: this.selectedItem.xodimId,
        xodimName: this.selectedItem.xodimName,
        foydalanuvchiId: this.selectedItem.foydalanuvchiId,
        vakilFIO: this.selectedItem.vakilFIO,
        obektUlchami: this.selectedItem.obektUlchami,
        obektXarorati: this.selectedItem.obektXarorati,
        boshlanishVaqti: this.selectedItem.boshlanishVaqti,
        tugashVaqti: this.selectedItem.tugashVaqti,
        ekspozitsiya: this.selectedItem.ekspozitsiya,
        degezatsiya: this.selectedItem.degezatsiya,
        fumigatsiyaTuriId: this.selectedItem.fumigatsiyaTuriId,
        fumigatsiyaTuriName: this.selectedItem.fumigatsiyaTuriName,
        fumigatsiyaForSpravochnikId: this.selectedItem.fumigatsiyaForSpravochnikId,
        fumigatsiyaForSpravochnikName: this.selectedItem.fumigatsiyaForSpravochnikName,
        narxi: this.selectedItem.narxi,
        jamiSumma: this.selectedItem.jamiSumma,
        preparatlarId: this.selectedItem.preparatlarId,
        preparatlarName: this.selectedItem.preparatlarName,
        dozirovka: this.selectedItem.dozirovka,
        preparatXajmi: this.selectedItem.preparatXajmi,
        bioIndikator: this.selectedItem.bioIndikator,
        natijaXulosa: this.selectedItem.natijaXulosa,
        afBlankaNomer: this.selectedItem.afBlankaNomer,
        fumigatorId: this.selectedItem.fumigatorId,
        fumigatorName: this.selectedItem.fumigatorName,
        fumigatsiyaObyekt: this.selectedItem.fumigatsiyaObyekt,
        ishlatilganPreparatXajmi: this.selectedItem.ishlatilganPreparatXajmi,
        junatuvchi: this.selectedItem.junatuvchi,
        qabulQiluvchi: this.selectedItem.qabulQiluvchi,
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
      if (this.selectedItem.imageSrcLabaratoriya && this.selectedItem.imageSrcLabaratoriya.length > 1) {
        this.imageSrcLabaratoriya = this.selectedItem.imageSrcLabaratoriya;
        this.imagePreviewLabaratoriya = this.selectedItem.imageSrcLabaratoriya[1].url;
      } else {
        this.imagePreviewLabaratoriya = '';
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
    this.imageSrcLabaratoriya.splice(0, this.imageSrcLabaratoriya.length);
    this.filesToUploadDalolatnoma.splice(0, this.filesToUploadDalolatnoma.length);
    this.imagePreviewLabaratoriya = '';
    this.imagePreview = '';
    this.imageSrc = [];
    this.stepperRef.previous();
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

  getFumigatsiyaTuri() {
    this.apiService.getAll<FumigatsiyaTuri>('fumigatsiyaTuri/')
      .subscribe(result => {
        this.fumigatsiyaTuri = result;
      });
    this.fumigatsiya = [];
    this.preparatlar = [];
  }

  getFumigatsiya() {
    if (this.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.fumigatsiyaTuriId._id
      });
      this.apiService.getObjectId<FumigatsiyaForSpravochnik[]>(params, '/fumigatsiyaForSpravochnik')
        .subscribe(result => {
          this.fumigatsiya = result;
        });
    }
  }

  getPreparatlar() {
    if (this.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.fumigatsiyaTuriId._id
      });
      this.apiService.getObjectId<Preparatlar[]>(params, '/preparatlar')
        .subscribe(result => {
          this.preparatlar = result;
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

  getXodimlar() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.xodimlar = result;
      });
  }

  getFumigator() {
    this.apiService.getAll<Xodimlar>('xodimlar/')
      .subscribe(result => {
        this.fumigator = result;
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

  onChangeTugashVaqti(vaqt){
    if (this.secondFormGroup.value.boshlanishVaqti && vaqt.target.value) {
      this.data1 = Number(this.secondFormGroup.value.boshlanishVaqti.slice(8, 10)) + 1;
      this.data2 = Number(vaqt.target.value.slice(8, 10));
      this.kun = this.secondFormGroup.value.boshlanishVaqti.slice(8,10);
      this.oy = this.secondFormGroup.value.boshlanishVaqti.slice(5,7);
      this.yil = this.secondFormGroup.value.boshlanishVaqti.slice(2,4);
    }
    this.s = 0;
    this.xaqiqiySana = 0;

    if (!this.secondFormGroup.value.boshlanishVaqti) {
      this.openSnackBar('Сиз бошланғич санани киритмадингиз', 'Хатолик', 5);
      return;
    }
    if (this.data1 < this.data2 || this.data1 === this.data2) {
      for (let i = this.data1; i < this.data2; i++) {
        if (this.s === 0) {
          let soatTug = Number(vaqt.target.value.slice(11, 13));
          let soatBosh = Number(this.secondFormGroup.value.boshlanishVaqti.slice(11, 13));
          let minuTug = Number(vaqt.target.value.slice(14, 17));
          let minuBosh = Number(this.secondFormGroup.value.boshlanishVaqti.slice(14, 17));
          let natija = (soatTug - soatBosh) - ((minuTug - minuBosh) * (-1) / 60) + 24;
          this.xaqiqiySana = this.xaqiqiySana + natija;
          this.s = this.s + 1;
        } else {
          this.xaqiqiySana = this.xaqiqiySana + 24;
        }
      }
    } else {
      let soatTug = Number(vaqt.target.value.slice(11, 13));
      let soatBosh = Number(this.secondFormGroup.value.boshlanishVaqti.slice(11, 13));
      let minuTug = Number(vaqt.target.value.slice(14, 17));
      let minuBosh = Number(this.secondFormGroup.value.boshlanishVaqti.slice(14, 17));
      let natija = (soatTug - soatBosh) - ((minuTug - minuBosh) * (-1) / 60);
      this.xaqiqiySana = natija;
    }
  }

  onChangeFaoliyatYunalishlari(event) {
    if (event) {
      this.secondFormGroup.get('faoliyatYunalishlariId').setValue(event._id);
      this.secondFormGroup.get('faoliyatYunalishlariName').setValue(event.name);

    } else {
      this.secondFormGroup.get('faoliyatYunalishlariId').setValue('');
      this.secondFormGroup.get('faoliyatYunalishlariName').setValue('');
    }
  }

  onChangeFumigatsiyaTuri(event) {
    if (event) {
      this.secondFormGroup.get('fumigatsiyaTuriId').setValue(event._id);
      this.secondFormGroup.get('fumigatsiyaTuriName').setValue(event.name);
      if (event._id) {
        this.fumigatsiyaTuriId = event;
        this.getFumigatsiya();
        this.getPreparatlar();
      }
    } else {
      this.secondFormGroup.get('fumigatsiyaTuriId').setValue('');
      this.secondFormGroup.get('fumigatsiyaTuriName').setValue('');
    }
  }

  onChangeFumigatsiyaForSpravochnik(event) {
    if (event) {
      this.secondFormGroup.get('fumigatsiyaForSpravochnikId').setValue(event._id);
      this.secondFormGroup.get('fumigatsiyaForSpravochnikName').setValue(event.name);

    } else {
      this.secondFormGroup.get('fumigatsiyaForSpravochnikId').setValue('');
      this.secondFormGroup.get('fumigatsiyaForSpravochnikName').setValue('');
    }
  }

  onChangePreparatlar(event) {
    if (event) {
      this.secondFormGroup.get('preparatlarId').setValue(event._id);
      this.secondFormGroup.get('preparatlarName').setValue(event.name);

    } else {
      this.secondFormGroup.get('preparatlarId').setValue('');
      this.secondFormGroup.get('preparatlarName').setValue('');
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
        this.zararkunandalarTuriName = null;
        this.secondFormGroup.get('zararkunandalarTuriId').setValue('');
        this.secondFormGroup.get('zararkunandalarId').setValue('');

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
        this.kasalliklarTuriName = null;
        this.secondFormGroup.get('kasalliklarTuriId').setValue('');
        this.secondFormGroup.get('kasalliklarId').setValue('');
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

  onChangeXodimlar(event) {
    if (event) {
      this.secondFormGroup.get('xodimId').setValue(event._id);
      this.secondFormGroup.get('xodimName').setValue(event.name);
    } else {
      this.secondFormGroup.get('xodimId').setValue('');
      this.secondFormGroup.get('xodimName').setValue('');
    }
  }

  onChangeFumigator(event) {
    if (event) {
      this.secondFormGroup.get('fumigatorId').setValue(event._id);
      this.secondFormGroup.get('fumigatorName').setValue(event.name);
    } else {
      this.secondFormGroup.get('fumigatorId').setValue('');
      this.secondFormGroup.get('fumigatorName').setValue('');
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

  onChangeLabaratoirya() {
    //this.readonlyLabaratoriyaXulosasi = this.labaratoriya;
  }

  onChangeXaqiqiyPrint(cmpName) {
    const printContent = document.getElementById(cmpName);
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
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
    this.fermerXujaligiName = null;
    this.fumigatsiyaName = null;
    this.fumigatorName = null;
    this.fumigatsiyaTuriName = null;
    this.preparatlarName = null;
    this.xodimlarName = null;

    this.tumanlar = [];
    this.massivlar = [];
    this.qfylar = [];
    this.mfylar = [];
    this.fermerXujaligi = [];
    this.faoliyatYunalishi = [];
    this.kasalliklar = [];
    this.fumigator = [];
    this.zararkunandalar = [];
    this.xodimlar = [];
    this.fumigatsiya = [];
    this.fumigatsiyaTuri = [];
    this.preparatlar = [];
    this.secondFormGroup.reset();
    this.secondFormGroup.patchValue({tartibRaqam: this.totalDocs + 1});
    this.secondFormGroup.patchValue({sana: new Date().toISOString().slice(0, 10)});
    this.secondFormGroup.patchValue({tasdiqlash: false});
    this.closeObject();
    this.stepperRef.previous();
  }

  selectedTumanAndMassiv(row) {
    this.secondFormGroup.reset();
    this.selectedItem = row;
    this.positionId = row._id;
    this.viloyatlarName = null;
    this.faoliyatTuriName = null;
    this.fumigatsiyaTuriName = null;
    this.kasalliklarTuriName = null;
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

    if (this.selectedItem.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.fumigatsiyaTuriId
      });
      this.apiService.getObjectId<FumigatsiyaForSpravochnik[]>(params, '/fumigatsiyaForSpravochnik')
        .subscribe(result => {
          this.fumigatsiya = result;
        });
    } else {
      this.fumigatsiya = [];
    }

    if (this.selectedItem.fumigatsiyaTuriId) {
      const params = Object.assign({}, {
        allIds: this.selectedItem.fumigatsiyaTuriId
      });
      this.apiService.getObjectId<Preparatlar[]>(params, '/preparatlar')
        .subscribe(result => {
          this.preparatlar = result;
        });
    } else {
      this.preparatlar = [];
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
      this.apiService.updated<Fumigatsiya>(this.className, ObjectForm, ObjectForm._id)
        .subscribe(
          () => this.openSnackBar('Маълумот ўзгартирилди', 'Тасдиқлаш', 4),
          error => this.openSnackBar(error.error.message, 'Хатолик', 4),
          () => this.getAll()
        );
    } else {

      this.apiService.creted<Fumigatsiya>(this.className, ObjectForm)
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
    this.apiService.getAllByPagePost<PageResponse<Fumigatsiya>>(params, this.className)
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

    this.apiService.getFilter<PageResponse<Fumigatsiya>>(params, this.className)
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
