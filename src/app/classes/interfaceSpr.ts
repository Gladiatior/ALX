export interface Message {
  message: string;
}

export interface login {
  name: string;
  password: string;
}

export interface Foydalanuvchi {
  tartibRaqam: number;
  name: string;
  xodimId?: string;
  xodimName?: string;
  xuquqId?: string;
  xuquqName?: string;
  password?: string;
  viloyatId?: string;
  imageSrc?: string;
  _id?: string;
}

export interface Xuquqlar {
  name: string;
  tartibRaqam: number;
  foydalanuvchi?: string;
  _id?: string;
}

export interface Banklar {
  name: string;
  tartibRaqam: number;
  mfo?: string;
  indexNo?: string;
  inn: string;
  manzili?: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Viloyatlar {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface KurashUsullari {
  name: string;
  tartibRaqam: number;
  izoxi?: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface KasalliklarTuri {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface ZararkunandalarTuri {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface BegonaUtlarTuri {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Bulimlar {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Bulinmalar {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Lavozimlar {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}


export interface FumigatsiyaTuri {
  name: string;
  tartibRaqam: number;
  formula: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface FumigatsiyaForSpravochnik {
  name: string;
  tartibRaqam: number;
  narxi: string;
  ulchovBirligiId: string;
  fumigatsiyaId: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Preparatlar {
  name: string;
  tartibRaqam: number;
  narxi: string;
  xuquqId: string;
  xuquqName: string;
  fumigatsiyaId: string;
  ulchovBirligiId: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Omborlar {
  name: string;
  tartibRaqam: number;
  javobgarShaxs: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface UlchovBirligi {
  name: string;
  tartibRaqam: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Tashkilotlar {
  name: string;
  tartibRaqam: number;
  tuliqNomi?: string;
  inn: string;
  oked?: string;
  manzili?: string;
  telefon?: string;
  raxbar?: string;
  viloyatId?: string;
  xisobRaqamlar?: TashkilotXisobRaqamlar[];
  _id?: string;
}

export interface TashkilotXisobRaqamlar {
  name?: string;
  tartibRaqam?: number;
  xisobRaqam?: string;
  bankId?: string;
  mfo?: string;
}

export interface Xodimlar {
  name: string;
  tartibRaqam: number;
  inn: string;
  manzili?: string;
  passportType?: string;
  lavozimId: string;
  bulimiId: string;
  bulinmaId: string;
  viloyatId: string;
  ishgaKirganSana: Date;
  ishdanKetganSana: Date;
  tashkilotId: string;
  _id?: string;
}

export interface Tumanlar {
  name: string;
  tartibRaqam: number;
  viloyatId: string;
  _id?: string;
}

export interface Qfylar {
  name: string;
  tartibRaqam: number;
  viloyatId: string;
  tumanId: string;
  _id?: string;
}

export interface Mfylar {
  name: string;
  tartibRaqam: number;
  viloyatId: string;
  tumanId: string;
  qfyId: string;
  _id?: string;
}

export interface Massivlar {
  name: string;
  tartibRaqam: number;
  viloyatId: string;
  tumanId: string;
  _id?: string;
}

export interface Blankalar {
  name: string;
  tartibRaqam: number;
  xuquqId: string;
  xuquqName: string;
  _id?: string;
}

export interface Davlatlar {
  name: string;
  tartibRaqam: number;
  qisqachaNomi?: string;
  _id?: string;
}

export interface YetkazibBeruvchilar {
  name: string;
  tartibRaqam: number;
  inn: string;
  oked?: string;
  manzili?: string;
  telefon?: string;
  turi: string;
  xisobRaqamlar?: YetkazibBeruvchiXisobRaqamlar[];
  _id?: string;
}

export interface YetkazibBeruvchiXisobRaqamlar {
  name?: string;
  tartibRaqam?: number;
  xisobRaqam?: string;
  bankId?: string;
  mfo?: string;
}


export interface FaoliyatTuri {
  name: string;
  tartibRaqam: number;
  _id?: string;
}

export interface FaoliyatYunalishi {
  name: string;
  tartibRaqam: number;
  faoliyatTuriId: string;
  _id?: string;
}

export interface Qadoqlar {
  name: string;
  tartibRaqam: number;
  _id?: string;
}

export interface QushimchaDekloratsiya {
  name: string;
  tartibRaqam: number;
  _id?: string;
}

export interface Maxsulotalar {
  name: string;
  tartibRaqam: number;
  botanikNomi?: string;
  TIFTNKODI?: string;
  ruschaNomi?: string;
  inglizchaNomi?: string;
  _id?: string;
}

export interface FermerXujaligi {
  name: string;
  tartibRaqam: number;
  inn: string;
  oked?: string;
  manzili?: string;
  telefon?: string;
  turi: string;
  raxbari?: string;
  viloyatId: string;
  tumanId: string;
  massivId: string;
  xisobRaqamlar?: FermerXujaligiXisobRaqamlar[];
  _id?: string;
}

export interface FermerXujaligiXisobRaqamlar {
  name?: string;
  tartibRaqam?: number;
  xisobRaqam?: string;
  bankId?: string;
  mfo?: string;
}

export interface ImagesTypes {
  url?: string;
  _id?: string;
}

export interface Kasalliklar {
  name: string;
  tartibRaqam: number;
  kasallikTuriId?: string;
  lotinchaNomi?: string;
  izoxi?: string;
  imageSrc?: ImagesTypes[];
  _id?: string;
}

export interface Zararkunandalar {
  name: string;
  tartibRaqam: number;
  zararkunandalarTuriId?: string;
  lotinchaNomi?: string;
  izoxi?: string;
  imageSrc?: ImagesTypes[];
  _id?: string;
}

export interface BegonaUtlar {
  name: string;
  tartibRaqam: number;
  begonaUtlarTuriId?: string;
  lotinchaNomi?: string;
  izoxi?: string;
  imageSrc?: ImagesTypes[];
  _id?: string;
}

export interface Xulosalar {
  name: string;
  tartibRaqam: number;
  _id?: string;
}

export interface KurashishUsuliXulosa {
  name: string;
  tartibRaqam: number;
  _id?: string;
}

export interface LabaratoriyaXulosa {
  name: string;
  tartibRaqam: number;
  _id?: string;
}
