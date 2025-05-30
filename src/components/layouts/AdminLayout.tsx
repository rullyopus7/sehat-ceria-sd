
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  FileText, 
  LogOut, 
  Settings,
  Home,
  Menu,
  X
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isActive ? "bg-kids-light-yellow text-kids-purple font-medium" : "hover:bg-gray-100"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-kids-light-yellow bg-opacity-20">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/placeholder.svg" 
              alt="Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-xl md:text-2xl font-bold text-kids-purple">Peduli Kesehatan Anak SD</h1>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden rounded-full p-2 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/admin" icon={Home} label="Dashboard" />
            <NavLink to="/admin/kelola-pengguna" icon={User} label="Kelola Pengguna" />
            <NavLink to="/admin/laporan" icon={FileText} label="Laporan Kesehatan" />
            <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
              <NavLink to="/admin" icon={Home} label="Dashboard" />
              <NavLink to="/admin/kelola-pengguna" icon={User} label="Kelola Pengguna" />
              <NavLink to="/admin/laporan" icon={FileText} label="Laporan Kesehatan" />
              <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50 justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="kids-title text-center text-kids-purple">{title}</h2>
          {user && (
            <p className="text-center text-gray-600">
              Selamat datang, {user.name} | Administrator
            </p>
          )}
        </div>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-kids-purple text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Peduli Kesehatan Anak SD. Dibuat dengan penuh kasih sayang untuk anak-anak Indonesia.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
