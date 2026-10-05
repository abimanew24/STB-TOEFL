import React from 'react';
import { Navbar } from '../common/Navbar';

interface StudentHeaderProps {
  title?: string;
  subtitle?: string;
  onLogout?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ 
  title = 'STBTOEFL',
  subtitle = 'Student Portal',
  onLogout
}) => {
  const studentInfoStr = localStorage.getItem('student_info');
  const studentInfo = studentInfoStr ? JSON.parse(studentInfoStr) : null;
  const name = studentInfo?.nama_lengkap || 'Peserta';

  return (
    <Navbar
      title={title}
      subtitle={subtitle}
      userName={name}
      userRole="mahasiswa"
      theme="light"
      onLogout={onLogout}
    />
  );
};
