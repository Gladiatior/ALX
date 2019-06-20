export interface BlankaQoldiq {
  kirimChiqim: boolean;
  sana: Date;
  yuklashSana: Date;
  chiqimTuri: string;
  blankalarId: string;
  blankalarName: string;
  omborlarId: string;
  omborlarName: string;
  blankadan: string;
  blankagacha: string;
  partiyaId: string;
  partiyaDocId: string;
  soni?: number;
  narxi?: number;
  summasi?: number;
  foydalanuvchiId?: string;
  _id?: string;
}
export interface PreparatQoldiq {
  kirimChiqim: boolean;
  sana: Date;
  yuklashSana: Date;
  chiqimTuri: string;
  preparatlarId: string;
  preparatlarName: string;
  omborlarId: string;
  omborlarName: string;
  ulchovBirligiId: string;
  ulchovBirligiName: string;
  partiyaId: string;
  partiyaDocId: string;
  soni?: number;
  narxi?: number;
  summasi?: number;
  foydalanuvchiId?: string;
  _id?: string;
}

export interface BlankaQoldiqXodim {
  kirimChiqim: boolean;
  sana: Date;
  yuklashSana: Date;
  chiqimTuri: string;
  blankalarId: string;
  blankalarName: string;
  xodimlarId: string;
  xodimlarName: string;
  blankadan: string;
  blankagacha: string;
  partiyaId: string;
  partiyaDocId: string;
  soni?: number;
  qoldiqSon?: number;
  narxi?: number;
  summasi?: number;
  foydalanuvchiId?: string;
  _id?: string;
}
