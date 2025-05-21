
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Define types for our context
type Role = 'siswa' | 'guru' | 'admin';

type User = {
  id: string;
  name: string;
  role: Role;
  kelas?: string; // For students and teachers
  username: string;
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Sample user data (in a real app, this would come from an API or database)
const sampleUsers = [
  { id: "1", name: "Admin Utama", username: "admin", password: "admin123", role: "admin" as Role },
  { id: "2", name: "Budi Santoso", username: "budi", password: "budi123", role: "siswa" as Role, kelas: "6A" },
  { id: "3", name: "Siti Nurhaliza", username: "siti", password: "siti123", role: "siswa" as Role, kelas: "6A" },
  { id: "4", name: "Ibu Wati", username: "guru", password: "guru123", role: "guru" as Role, kelas: "6A" },
  { id: "5", name: "Pak Dedi", username: "dedi", password: "dedi123", role: "guru" as Role, kelas: "5B" },
];

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = sampleUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${foundUser.name}!`,
      });
      
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Username atau password salah",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
