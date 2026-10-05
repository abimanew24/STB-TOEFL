import { runMigrations } from './database.js';

(async () => {
  try {
    console.log('[MIGRATION] Starting database setup...');
    await runMigrations();
    console.log('[MIGRATION] Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[MIGRATION FAILED]', error);
    process.exit(1);
  }
})();
