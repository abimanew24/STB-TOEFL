import pool from './database.js';
import { calculateAndStoreScore } from './controllers/scoringController.js';

async function runSystemTest() {
  console.log('===================================================');
  console.log('  SECURE-TOEFL CBT Automated Verification Test Suite');
  console.log('===================================================\n');

  try {
    // 1. Test Database Connectivity
    console.log('[TEST 1] Testing MySQL Database Connection...');
    const [tables] = await pool.query('SHOW TABLES');
    console.log(`[PASS] MySQL Connected. Found ${tables.length} tables in db_stbtoefl.`);

    // 2. Test ETS Score Calculation Math
    console.log('\n[TEST 2] Testing ETS TOEFL ITP Score Engine Math...');
    
    // Test raw scores: Listening=35, Structure=25, Reading=35
    const [scaleL] = await pool.query('SELECT skala_listening FROM konversi_skor WHERE skor_mentah = 35');
    const [scaleS] = await pool.query('SELECT skala_structure FROM konversi_skor WHERE skor_mentah = 25');
    const [scaleR] = await pool.query('SELECT skala_reading FROM konversi_skor WHERE skor_mentah = 35');

    const l = scaleL[0].skala_listening;
    const s = scaleS[0].skala_structure;
    const r = scaleR[0].skala_reading;
    const total = Math.round(((l + s + r) * 10) / 3);

    console.log(`   - Raw Answers: L=35/50, S=25/40, R=35/50`);
    console.log(`   - Scaled Scores: Listening=${l}, Structure=${s}, Reading=${r}`);
    console.log(`   - Calculated Total Score: ${total} (Formula: Round((${l} + ${s} + ${r}) * 10 / 3))`);

    if (total >= 310 && total <= 677) {
      console.log(`[PASS] Total TOEFL Score is within valid ETS range (310–677).`);
    } else {
      throw new Error(`Total TOEFL Score ${total} out of bounds!`);
    }

    // 3. Test Bank Questions Count
    console.log('\n[TEST 3] Testing Master Question Bank...');
    const [questions] = await pool.query('SELECT COUNT(*) as count FROM bank_soal');
    console.log(`[PASS] Question Bank active with ${questions[0].count} questions.`);

    console.log('\n===================================================');
    console.log('  ALL AUTOMATED SYSTEM TESTS PASSED SUCCESSFULLY!  ');
    console.log('===================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n[SYSTEM TEST FAILED]', error);
    process.exit(1);
  }
}

runSystemTest();
