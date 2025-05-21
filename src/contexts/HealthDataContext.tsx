
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Type definitions
export type HealthData = {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  date: string;
  temperature: number;
  weight: number;
  height: number;
  notes?: string;
};

export type Complaint = {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  date: string;
  title: string;
  description: string;
  response?: {
    teacherId: string;
    teacherName: string;
    date: string;
    message: string;
  };
  status: 'pending' | 'responded';
};

interface HealthDataContextType {
  healthData: HealthData[];
  complaints: Complaint[];
  addHealthData: (data: Omit<HealthData, 'id' | 'date'>) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  respondToComplaint: (complaintId: string, teacherId: string, teacherName: string, message: string) => void;
  getStudentHealthData: (studentId: string) => HealthData[];
  getStudentComplaints: (studentId: string) => Complaint[];
  getClassHealthData: (kelas: string) => HealthData[];
  getClassComplaints: (kelas: string) => Complaint[];
  getAllHealthData: () => HealthData[];
  getAllComplaints: () => Complaint[];
}

// Sample initial data
const sampleHealthData: HealthData[] = [
  {
    id: '1',
    studentId: '2',
    studentName: 'Budi Santoso',
    kelas: '6A',
    date: '2025-05-20',
    temperature: 36.5,
    weight: 35,
    height: 145,
    notes: 'Kondisi sehat'
  },
  {
    id: '2',
    studentId: '3',
    studentName: 'Siti Nurhaliza',
    kelas: '6A',
    date: '2025-05-20',
    temperature: 36.7,
    weight: 33,
    height: 142,
    notes: 'Sedikit batuk'
  }
];

const sampleComplaints: Complaint[] = [
  {
    id: '1',
    studentId: '2',
    studentName: 'Budi Santoso',
    kelas: '6A',
    date: '2025-05-19',
    title: 'Sakit Kepala',
    description: 'Saya merasa pusing sejak pagi hari',
    status: 'responded',
    response: {
      teacherId: '4',
      teacherName: 'Ibu Wati',
      date: '2025-05-19',
      message: 'Budi sebaiknya istirahat di UKS dan minum air putih yang cukup.'
    }
  },
  {
    id: '2',
    studentId: '3',
    studentName: 'Siti Nurhaliza',
    kelas: '6A',
    date: '2025-05-20',
    title: 'Batuk',
    description: 'Saya batuk sejak kemarin malam',
    status: 'pending'
  }
];

// Create the context
const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const storedHealthData = localStorage.getItem('healthData');
    const storedComplaints = localStorage.getItem('complaints');
    
    if (storedHealthData) {
      setHealthData(JSON.parse(storedHealthData));
    } else {
      setHealthData(sampleHealthData);
      localStorage.setItem('healthData', JSON.stringify(sampleHealthData));
    }
    
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints));
    } else {
      setComplaints(sampleComplaints);
      localStorage.setItem('complaints', JSON.stringify(sampleComplaints));
    }
  }, []);

  // Add new health data entry
  const addHealthData = (data: Omit<HealthData, 'id' | 'date'>) => {
    const newData: HealthData = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedData = [...healthData, newData];
    setHealthData(updatedData);
    localStorage.setItem('healthData', JSON.stringify(updatedData));
    
    toast({
      title: "Data Kesehatan Tersimpan",
      description: "Data kesehatan Anda telah berhasil disimpan",
    });
  };

  // Add a new complaint
  const addComplaint = (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    const updatedComplaints = [...complaints, newComplaint];
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    toast({
      title: "Keluhan Terkirim",
      description: "Keluhan Anda telah berhasil dikirim ke guru kelas",
    });
  };

  // Respond to a complaint
  const respondToComplaint = (complaintId: string, teacherId: string, teacherName: string, message: string) => {
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          status: 'responded' as const,
          response: {
            teacherId,
            teacherName,
            date: new Date().toISOString().split('T')[0],
            message
          }
        };
      }
      return complaint;
    });
    
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    toast({
      title: "Tanggapan Terkirim",
      description: "Tanggapan Anda telah berhasil dikirim ke siswa",
    });
  };

  // Filter health data by student ID
  const getStudentHealthData = (studentId: string) => {
    return healthData.filter(data => data.studentId === studentId);
  };

  // Filter complaints by student ID
  const getStudentComplaints = (studentId: string) => {
    return complaints.filter(complaint => complaint.studentId === studentId);
  };

  // Filter health data by class
  const getClassHealthData = (kelas: string) => {
    return healthData.filter(data => data.kelas === kelas);
  };

  // Filter complaints by class
  const getClassComplaints = (kelas: string) => {
    return complaints.filter(complaint => complaint.kelas === kelas);
  };

  // Get all health data
  const getAllHealthData = () => {
    return healthData;
  };

  // Get all complaints
  const getAllComplaints = () => {
    return complaints;
  };

  return (
    <HealthDataContext.Provider value={{
      healthData,
      complaints,
      addHealthData,
      addComplaint,
      respondToComplaint,
      getStudentHealthData,
      getStudentComplaints,
      getClassHealthData,
      getClassComplaints,
      getAllHealthData,
      getAllComplaints
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};
