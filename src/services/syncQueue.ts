import { db, type UserAnswerItem } from './db';
import api from './api';

let syncIntervalId: NodeJS.Timeout | null = null;
let isSyncing = false;

/**
 * Memicu sinkronisasi transaksi jawaban yang belum terkirim ke server Express (LWW Sync)
 */
export async function flushSyncQueue() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const pendingAnswers = await db.userAnswers
      .where('synced')
      .equals(0)
      .toArray();

    if (pendingAnswers.length === 0) {
      isSyncing = false;
      return;
    }

    const payload = pendingAnswers.map((ans) => ({
      soal_id: ans.soal_id,
      jawaban_dipilih: ans.jawaban_dipilih,
      stempel_waktu_klien: ans.stempel_waktu_klien
    }));

    const response = await api.post('/exam/sync-answers', { answers: payload });

    if (response.status === 200) {
      // Tandai seluruh jawaban sebagai synced = 1
      const idsToUpdate = pendingAnswers.map((a) => a.id!).filter(Boolean);
      await db.userAnswers.where('id').anyOf(idsToUpdate).modify({ synced: 1 });
    }
  } catch (error) {
    console.warn('[SYNC QUEUE WARNING] Offine mode active or sync failed:', error);
  } finally {
    isSyncing = false;
  }
}

/**
 * Mulai pemantau sinkronisasi otomatis per 10 detik
 */
export function startAutoSync(intervalMs: number = 10000) {
  if (syncIntervalId) return;
  // Sync segera saat diaktifkan
  flushSyncQueue();
  syncIntervalId = setInterval(flushSyncQueue, intervalMs);
}

/**
 * Hentikan pemantau sinkronisasi otomatis
 */
export function stopAutoSync() {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
}
