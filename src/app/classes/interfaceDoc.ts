import {Data} from "@angular/router";

export interface PlanKiritish {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  chorak: string;
  faoliyatTuriId: string;
  faoliyatYunalishlariId: string;
  viloyatId: string;
  tumanId: string;
  massivId: string;
  fermerXujaligiId: string;
  fermerXujaligiNomi?: string;
  fermerXujaligiInn?: string;
  foydalanuvchiId?: string;
  yerMaydoni: number;
  _id?: string;
}

export interface RejaBuyichaNazorat {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  qfyId?: string;
  qfyName?: string;
  mfyId?: string;
  mfyName?: string;
  xonadon?: string;
  faoliyatTuriId?: string;
  faoliyatTuriName?: string;
  faoliyatYunalishlariId?: string;
  faoliyatYunalishlariName?: string;
  yerMaydoni?: number;
  kasalliklarTuriId?: string;
  kasalliklarId?: string;
  begonaUtlarTuriId?: string;
  begonaUtlarId?: string;
  zararkunandalarTuriId?: string;
  zararkunandalarId?: string;
  topildi?: boolean;
  topilmadi?: boolean;
  xulosa?: string;
  muddati?: number;
  kurashUsullariId?: string;
  kurashishUsuliXulosasi?: string;
  labaratoriya?: boolean;
  labaratoriyaXulosasi?: string;
  imageSrcLabaratoriya?: ImagesTypesDocs[];
  imageSrcDalolatnoma?: ImagesTypesDocs[];
  kurilganYerMaydoni?: number;
  xodimId: string;
  xodimName?: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface ImagesTypesDocs {
  url?: string;
  _id?: string;
}

export interface RejadanTashqariNazorat {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  qfyId?: string;
  qfyName?: string;
  mfyId?: string;
  mfyName?: string;
  xonadon?: string;
  faoliyatTuriId?: string;
  faoliyatTuriName?: string;
  faoliyatYunalishlariId?: string;
  faoliyatYunalishlariName?: string;
  yerMaydoni?: number;
  kasalliklarTuriId?: string;
  kasalliklarId?: string;
  begonaUtlarTuriId?: string;
  begonaUtlarId?: string;
  zararkunandalarTuriId?: string;
  zararkunandalarId?: string;
  topildi?: boolean;
  topilmadi?: boolean;
  xulosa?: string;
  muddati?: number;
  kurashUsullariId?: string;
  kurashishUsuliXulosasi?: string;
  labaratoriya?: boolean;
  labaratoriyaXulosasi?: string;
  imageSrcLabaratoriya?: ImagesTypesDocs[];
  imageSrcDalolatnoma?: ImagesTypesDocs[];
  kurilganYerMaydoni?: number;
  xodimId: string;
  xodimName?: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface BlankaKirimi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  omborlarId: string;
  omborlarName: string;
  qabulQildi?: string;
  yetkazibBeruvchilarId: string;
  yetkazibBeruvchilarName?: string;
  fakturaNomer?: string;
  fakturaSana?: Date;
  ishonchnomaNomer?: string;
  ishonchnomaSana?: Date;
  kimOrqali?: string;
  foydalanuvchiId?: string;
  yuklashSana: Date;
  jadval: JadvalBlankaKirimi[];
  _id?: string;
}

export interface JadvalBlankaKirimi {
  tartibRaqam: number;
  blankalarId: string;
  blankalarName: string;
  blankadan: number;
  blankagacha: number;
  soni: number;
  narxi: number;
  summasi: number;
  _id?: string;
}

export interface BlankaChiqimi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  omborlarId: string;
  omborlarName: string;
  qabulQildi?: string;
  xodimlarId: string;
  xodimlarName?: string;
  tashkilotlarId?: string;
  tashkilotlarName?: string;
  izoxi?: string;
  chiqimTuri?: string;
  foydalanuvchiId?: string;
  yuklashSana: Date;
  jadval: JadvalBlankaChiqimi[];
  _id?: string;
}
export interface JadvalBlankaChiqimi {
  tartibRaqam: number;
  partiyaId?: string;
  partiyaDocId?: string;
  blankalarId: string;
  blankalarName: string;
  blankadan: number;
  blankagacha: number;
  qoldiqBlankadan: number;
  qoldiqBlankagacha: number;
  soni: number;
  narxi: number;
  summasi: number;
  _id?: string
}

export interface PreparatKirimi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  omborlarId: string;
  omborlarName: string;
  qabulQildi?: string;
  yetkazibBeruvchilarId: string;
  yetkazibBeruvchilarName?: string;
  fakturaNomer?: string;
  fakturaSana?: Date;
  ishonchnomaNomer?: string;
  ishonchnomaSana?: Date;
  kimOrqali?: string;
  foydalanuvchiId?: string;
  yuklashSana: Date;
  jadval: JadvalPreparatKirimi[];
  _id?: string;
}

export interface JadvalPreparatKirimi {
  tartibRaqam?: number;
  preparatlarId?: string;
  preparatlarName?: string;
  ulchovBirligiId?: string;
  ulchovBirligiName?: string;
  soni?: number;
  narxi?: number;
  summasi?: number;
  _id?: string;
}

export interface PreparatChiqimi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  omborlarId: string;
  omborlarName: string;
  qabulQildi?: string;
  xodimlarId: string;
  xodimlarName?: string;
  tashkilotlarId?: string;
  tashkilotlarName?: string;
  izoxi?: string;
  chiqimTuri?: string;
  foydalanuvchiId?: string;
  yuklashSana: Date;
  jadval: JadvalPreparatChiqimi[];
  _id?: string;
}

export interface JadvalPreparatChiqimi {
  tartibRaqam?: number;
  partiyaId?: string;
  partiyaDocId?: string;
  preparatlarId?: string;
  preparatlarName?: string;
  ulchovBirligiId?: string;
  ulchovBirligiName?: string;
  soni?: number;
  qoldiqSoni?: number;
  narxi?: number;
  summasi?: number;
  _id?: string;
}

export interface BlankaChiqimiXodim {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  xodimlarId: string;
  xodimlarName: string;
  chiqimTuri?: string;
  partiyaId: string;
  partiyaDocId?: string;
  foydalanuvchiId?: string;
  yuklashSana?: Date;
  izoxi?: string;
  xulosa?: string;
  blankalarId?: string;
  blankalarName?: string;
  blankadan?: number;
  blankagacha?: number;
  qoldiqBlankadan?: number;
  qoldiqBlankagacha?: number;
  soni?: number;
  narxi?: number;
  summasi?: number;
  _id?: string;
}

export interface FumigatsiyaNazorati {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  raxbari?: string;
  qfyId?: string;
  qfyName?: string;
  mfyId?: string;
  mfyName?: string;
  xonadon?: string;
  faoliyatTuriId?: string;
  faoliyatTuriName?: string;
  faoliyatYunalishlariId?: string;
  faoliyatYunalishlariName?: string;
  kasalliklarTuriId?: string;
  kasalliklarId?: string;
  zararkunandalarTuriId?: string;
  zararkunandalarId?: string;
  labaratoriya?: boolean;
  labaratoriyaXulosasi?: string;
  imageSrcLabaratoriya?: ImagesTypesDocs[];
  xodimId: string;
  xodimName?: string;
  foydalanuvchiId?: string;
  vakilFIO?: string;
  obektUlchami?: string;
  obektXarorati?: string;
  boshlanishVaqti?: Date;
  tugashVaqti?: Date;
  ekspozitsiya?: number;
  degezatsiya?: string;
  fumigatsiyaTuriId?: string;
  fumigatsiyaTuriName?: string;
  fumigatsiyaForSpravochnikId?: string;
  fumigatsiyaForSpravochnikName?: string;
  narxi?: number;
  jamiSumma?: number;
  preparatlarId?: string;
  preparatlarName?: string;
  dozirovka?: number;
  preparatXajmi?: number;
  bioIndikator?: string;
  natijaXulosa?: string;
  afBlankaNomer?: string;
  fumigatorId?: string;
  fumigatorName?: string;
  fumigatsiyaObyekt?: string;
  ishlatilganPreparatXajmi?: number;
  _id?: string;
}

export interface YozilganSertifikatlar {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  raxbari?: string;
  qfyId?: string;
  qfyName?: string;
  mfyId?: string;
  mfyName?: string;
  xonadon?: string;
  faoliyatTuriId?: string;
  faoliyatTuriName?: string;
  faoliyatYunalishlariId?: string;
  faoliyatYunalishlariName?: string;
  sertifikatNomer?: string;
  xodimId: string;
  xodimName?: string;
  foydalanuvchiId?: string;
  maxsulot?: string;
  soni?: number;
  _id?: string;
}

export interface Labaratoriya {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  raxbari?: string;
  qfyId?: string;
  qfyName?: string;
  mfyId?: string;
  mfyName?: string;
  xonadon?: string;
  faoliyatTuriId?: string;
  faoliyatTuriName?: string;
  faoliyatYunalishlariId?: string;
  faoliyatYunalishlariName?: string;
  imageSrcLabaratoriya?: ImagesTypesDocs[];
  labaratoriyaXulosasi?: string;
  xodimId: string;
  xodimName?: string;
  foydalanuvchiId?: string;
  namuna?: string;
  kimOrqali?: string;
  _id?: string;
}

export interface Fumigatsiya {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  raxbari?: string;
  qfyId?: string;
  qfyName?: string;
  mfyId?: string;
  mfyName?: string;
  xonadon?: string;
  faoliyatTuriId?: string;
  faoliyatTuriName?: string;
  faoliyatYunalishlariId?: string;
  faoliyatYunalishlariName?: string;
  kasalliklarTuriId?: string;
  kasalliklarId?: string;
  zararkunandalarTuriId?: string;
  zararkunandalarId?: string;
  labaratoriya?: boolean;
  labaratoriyaXulosasi?: string;
  imageSrcLabaratoriya?: ImagesTypesDocs[];
  xodimId: string;
  xodimName?: string;
  foydalanuvchiId?: string;
  vakilFIO?: string;
  obektUlchami?: string;
  obektXarorati?: string;
  boshlanishVaqti?: Date;
  tugashVaqti?: Date;
  ekspozitsiya?: number;
  degezatsiya?: string;
  fumigatsiyaTuriId?: string;
  fumigatsiyaTuriName?: string;
  fumigatsiyaForSpravochnikId?: string;
  fumigatsiyaForSpravochnikName?: string;
  narxi?: number;
  jamiSumma?: number;
  preparatlarId?: string;
  preparatlarName?: string;
  dozirovka?: number;
  preparatXajmi?: number;
  bioIndikator?: string;
  natijaXulosa?: string;
  afBlankaNomer?: string;
  fumigatorId?: string;
  fumigatorName?: string;
  fumigatsiyaObyekt?: string;
  ishlatilganPreparatXajmi?: number;
  junatuvchi?: string;
  qabulQiluvchi?: string;
  _id?: string;
}

export interface KarantinRuxsatnomasi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  raxbari?: string;
  qfyId?: string;
  qfyName?: string;
  mfyId?: string;
  mfyName?: string;
  xonadon?: string;
  kimga?: string;
  kurikJoyi?: string;
  karantinRuxsatnomasiNomer?: string;
  muddati?: Date;
  utishChegaraPunktlari?: string;
  davlatlarId?: string;
  davlatlarName?: string;
  foydalanuvchiId?: string;
  jadval?: JadvalKarantinRuxsatnomasi[];
  _id?: string;
}

export interface JadvalKarantinRuxsatnomasi {
  tartibRaqam: number;
  maxsulotId: string;
  maxsulotName: string;
  botanikNomi: string;
  TIFTNKODI: string;
  ulchovBirligiId: string;
  ulchovBirligiName: string;
  soni: number;
  _id?: string
}

export interface Ekspertiza {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  xodimlarId?: string;
  xodimlarName?: string;
  karantinRuxsatnomasiNomer?: string;
  ruxsatnomaSanasi?: Date;
  kimga?: string;
  utishChegaraPunktlari?: string;
  kurikJoyi?: string;
  muddati?: Date;
  jadval?: JadvalKarantinRuxsatnomasi[];
  fitosanitarSertifikatNomer?: string;
  fitosanitarSertifikatSana?: Date;
  davlatlarId?: string;
  davlatlarName?: string;
  tekshirish?: boolean;
  transportTuri?: string;
  transportNomi?: string;
  xulosa?: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface Eksport {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  raxbari?: string;
  jismoniyFISH?: string;
  manzili?: string;
  passport?: string;
  inn?: string;
  telefon?: string;
  davlatlarId?: string;
  davlatlarName?: string;
  kkManzili?: string;
  kkNomi?: string;
  kkPochtaIndex?: string;
  kkElektronPochta?: string;
  kkTelefon?: string;
  kimga?: string;
  ishlabChiqarilganViloyatId?: string;
  ishlabChiqarilganViloyatName?: string;
  ishlabChiqarilganTumanId?: string;
  ishlabChiqarilganTumanName?: string;
  transportTuri?: string;
  transportNomi?: string;
  qushimchaDekloratsiyaId?: string;
  qushimchaDekloratsiyaName?: string;
  eksportShartnomaNomer?: string;
  eksportShartnomaSana?: Date;
  markirovka?: boolean;
  chiqishChegaraMaskani?: string;
  ifsBlankaNomer?: string;
  afBlankaNomer?: string;
  obektXarorati?: string;
  fumigatsiyaSana?: Date;
  ekspozitsiya?: number;
  dozirovka?: number;
  fumigatsiyaTuriId?: string;
  fumigatsiyaTuriName?: string;
  fumigatsiyaId?: string;
  fumigatsiyaName?: string;
  preparatlarId?: string;
  preparatlarName?: string;
  ishlatilganPreparatXajmi?: number;
  xodimlarId?: string;
  xodimlarName?: string;
  fitosanitarSertifikatNomer?: string;
  foydalanuvchiId?: string;
  jadval?: JadvalEksport[];
  _id?: string;
}

export interface JadvalEksport {
  tartibRaqam: number;
  maxsulotId: string;
  maxsulotName: string;
  botanikNomi: string;
  TIFTNKODI: string;
  ulchovBirligiId: string;
  ulchovBirligiName: string;
  netto: number;
  brutto: number;
  qadoqlarId: string;
  qadoqlarName: string;
  joySoni: number;
  narxi: number;
  soni: number;
  summasi: number;
  _id?: string
}

export interface Kurik {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  yuridik?: boolean;
  jismoniy?: boolean;
  xodimlarId?: string;
  xodimlarName?: string;
  viloyatId?: string;
  viloyatName?: string;
  tumanId?: string;
  tumanName?: string;
  massivId?: string;
  massivName?: string;
  fermerXujaligiId?: string;
  fermerXujaligiName?: string;
  raxbari?: string;
  jismoniyFISH?: string;
  manzili?: string;
  passport?: string;
  inn?: string;
  telefon?: string;
  kelganDavlatlarId?: string;
  kelganDavlatlarName?: string;
  transportTuri?: string;
  transportNomi?: string;
  xulosaVaTakliflar?: string;
  jadval?: JadvalKurik[];
  ekspertizaSana?: Date;
  ekspertizaNomer?: string;
  ekspertizaXodimId?: string;
  ekspertizaXodimName?: string;
  karantinRuxsatnomasiNomer?: string;
  ruxsatnomaSanasi?: Date;
  muddati?: Date;
  kimga?: string;
  utishChegaraPunktlari?: string;
  kurikJoyi?: string;
  jadvalKurik?: JadvalKurik[];
  fitosanitarSertifikatSana?: Date;
  fitosanitarSertifikatNomer?: string;
  davlatlarId?: String;
  davlatlarName?: String;
  tekshirish?: boolean;
  xulosa?: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface JadvalKurik {
  tartibRaqam: number;
  maxsulotId: string;
  maxsulotName: string;
  botanikNomi: string;
  TIFTNKODI: string;
  ulchovBirligiId: string;
  ulchovBirligiName: string;
  soni: number;
  _id?: string
}

export interface TranzitYukKurigi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  xodimlarId?: string;
  xodimlarName?: string;
  tashkilot?: string;
  vakil?: string;
  transportTuri?: string;
  transportNomi?: string;
  yukKelganDavlatlarId?: string;
  yukKelganDavlatlarName?: string;
  yukUtganDavlatlarId?: string;
  yukUtganDavlatlarName?: string;
  kirdiChiqdi?: boolean;
  xulosaVaTakliflar?: string;
  jadval?: JadvalKarantinRuxsatnomasi[];
  karantinRuxsatnomasiNomer?: string;
  ruxsatnomaSanasi?: Date;
  muddati?: Date;
  kimga?: string;
  utishChegaraPunktlari?: string;
  kurikJoyi?: string;
  jadvalKurik?: JadvalKurik[];
  xulosa?: string;
  fitosanitarSertifikatSana?: Date;
  fitosanitarSertifikatNomer?: string;
  davlatlarId?: String;
  davlatlarName?: String;
  tekshirish?: boolean;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface LavozimniUzgartirishBuyrugi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  xodimlarId?: string;
  xodimlarName?: string;
  ishgaKirganSana?: Date;
  ishdanKetganSana?: Date;
  lavozimlarId?: string;
  lavozimlarName?: string;
  tashkilotlarId?: string;
  tashkilotlarName?: string;
  bulimlarId?: string;
  bulimlarName?: string;
  bulinmalarId?: string;
  bulinmalarName?: string;
  eskiLavozimlarId?: string;
  eskiLavozimlarName?: string;
  eskiTashkilotlarId?: string;
  eskiTashkilotlarName?: string;
  eskiBulimlarId?: string;
  eskiBulimlarName?: string;
  eskiBulinmalarId?: string;
  eskiBulinmalarName?: string;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface IshdanBushatishBuyrugi {
  tasdiqlash: boolean;
  tartibRaqam: number;
  sana: Date;
  xodimlarId?: string;
  xodimlarName?: string;
  ishgaKirganSana?: Date;
  ishdanKetganSana?: Date;
  _id?: string;
}


