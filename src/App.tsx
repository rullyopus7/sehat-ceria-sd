
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HealthDataProvider } from "./contexts/HealthDataContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import StudentHealthForm from "./pages/student/HealthForm";
import StudentComplaints from "./pages/student/Complaints";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherStudentList from "./pages/teacher/StudentList";
import TeacherComplaints from "./pages/teacher/Complaints"; 
import AdminDashboard from "./pages/admin/Dashboard";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminReports from "./pages/admin/Reports";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HealthDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Student routes */}
              <Route path="/siswa" element={<ProtectedRoute allowedRoles={["siswa"]} />}>
                <Route index element={<StudentDashboard />} />
                <Route path="isi-data" element={<StudentHealthForm />} />
                <Route path="keluhan" element={<StudentComplaints />} />
              </Route>
              
              {/* Teacher routes */}
              <Route path="/guru" element={<ProtectedRoute allowedRoles={["guru"]} />}>
                <Route index element={<TeacherDashboard />} />
                <Route path="daftar-siswa" element={<TeacherStudentList />} />
                <Route path="keluhan" element={<TeacherComplaints />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="kelola-pengguna" element={<AdminManageUsers />} />
                <Route path="laporan" element={<AdminReports />} />
              </Route>
              
              {/* Catch all not found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HealthDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
