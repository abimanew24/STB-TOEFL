import pool, { runMigrations } from './database.js';

async function seed() {
  try {
    console.log('[SEED] Running migrations...');
    await runMigrations();

    const [rows] = await pool.query('SELECT id, nomor_induk, nama_lengkap, email FROM pengguna WHERE peran = "mahasiswa" ORDER BY id ASC');
    console.log(`[SEED SUCCESS] Total peserta terdaftar: ${rows.length}`);
    console.table(rows.slice(0, 10));
    process.exit(0);
  } catch (err) {
    console.error('[SEED ERROR]', err);
    process.exit(1);
  }
}

seed();
