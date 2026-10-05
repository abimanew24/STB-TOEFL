import Dexie, { type Table } from 'dexie';

export interface QuestionItem {
  id: number;
  nomor_section: number; // 1: Listening, 2: Structure, 3: Reading
  nama_bagian?: string;
  wacana_id?: number | null;
  berkas_audio?: string | null;
  pertanyaan: string;
  pilihan_a: string;
  pilihan_b: string;
  pilihan_c: string;
  pilihan_d: string;
}

export interface PassageItem {
  id: number;
  judul?: string | null;
  isi_wacana: string;
}

export interface UserAnswerItem {
  id?: number;
  soal_id: number;
  jawaban_dipilih: string | null; // 'A' | 'B' | 'C' | 'D' | null
  is_flagged: boolean; // Status ragu-ragu
  stempel_waktu_klien: number; // Unix epoch ms
  synced: number; // 0: Pending sync, 1: Synced to server
}

export class ToeflDatabase extends Dexie {
  questions!: Table<QuestionItem, number>;
  passages!: Table<PassageItem, number>;
  userAnswers!: Table<UserAnswerItem, number>;

  constructor() {
    super('ToeflCbtDatabase');
    this.version(1).stores({
      questions: 'id, nomor_section, wacana_id',
      passages: 'id',
      userAnswers: '++id, soal_id, is_flagged, synced'
    });
  }
}

export const db = new ToeflDatabase();
