import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Student Pages
import { LoginStudent } from './Page/student/LoginStudent';
import { AudioCheck } from './Page/student/AudioCheck';
import { ExamInstructions } from './Page/student/ExamInstructions';
import { ExamCBT } from './Page/student/ExamCBT';
import { ResultReport } from './Page/student/ResultReport';

// Proctor Pages
import { LoginProctor } from './Page/proctor/LoginProctor';
import { DashboardProctor } from './Page/proctor/DashboardProctor';
import { ParticipantManager } from './Page/proctor/ParticipantManager';
import { TokenManager } from './Page/proctor/TokenManager';
import { QuestionBank } from './Page/proctor/QuestionBank';
import { ScoreRecap } from './Page/proctor/ScoreRecap';
import { SettingsProctor } from './Page/proctor/SettingsProctor';
import { AudioManager } from './Page/proctor/AudioManager';

// Error Page
import { SebForbidden } from './Page/error/SebForbidden';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student Exam Routes */}
        <Route path="/" element={<Navigate to="/student/login" replace />} />
        <Route path="/student/login" element={<LoginStudent />} />
        <Route path="/student/audio-check" element={<AudioCheck />} />
        <Route path="/student/instructions" element={<ExamInstructions />} />
        <Route path="/student/exam" element={<ExamCBT />} />
        <Route path="/student/result" element={<ResultReport />} />

        {/* Proctor Portal Routes */}
        <Route path="/proctor/login" element={<LoginProctor />} />
        <Route path="/proctor/dashboard" element={<DashboardProctor />} />
        <Route path="/proctor/peserta" element={<ParticipantManager />} />
        <Route path="/proctor/tokens" element={<TokenManager />} />
        <Route path="/proctor/bank" element={<QuestionBank />} />
        <Route path="/proctor/audio" element={<AudioManager />} />
        <Route path="/proctor/recap" element={<ScoreRecap />} />
        <Route path="/proctor/settings" element={<SettingsProctor />} />

        {/* Security & Error Routes */}
        <Route path="/seb-forbidden" element={<SebForbidden />} />

        {/* Catch All Fallback */}
        <Route path="*" element={<Navigate to="/student/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
