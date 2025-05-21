
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If already logged in, redirect to appropriate dashboard
  if (user) {
    if (user.role === "siswa") {
      navigate("/siswa");
    } else if (user.role === "guru") {
      navigate("/guru");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        // Auth context will handle the redirect
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-kids-light-blue via-kids-light-green to-kids-light-yellow">
      <div className="w-full max-w-md px-4">
        <Card className="w-full shadow-xl animate-scale-in">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto bg-kids-blue rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <User size={32} className="text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-kids-purple">Selamat Datang</CardTitle>
            <p className="text-gray-500">
              Aplikasi Pemantau Kesehatan Anak Sekolah Dasar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  placeholder="Masukkan nama pengguna"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-kids-blue focus-visible:ring-kids-purple"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-kids-blue focus-visible:ring-kids-purple"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-kids-purple hover:bg-kids-blue text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Masuk...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={20} />
                    Masuk
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-center text-gray-500">
                Demo Login:
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                <div className="text-center p-2 rounded bg-gray-50">
                  <p className="font-semibold">Siswa</p>
                  <p>Username: budi</p>
                  <p>Password: budi123</p>
                </div>
                <div className="text-center p-2 rounded bg-gray-50">
                  <p className="font-semibold">Guru</p>
                  <p>Username: guru</p>
                  <p>Password: guru123</p>
                </div>
                <div className="text-center p-2 rounded bg-gray-50">
                  <p className="font-semibold">Admin</p>
                  <p>Username: admin</p>
                  <p>Password: admin123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p>© 2025 Peduli Kesehatan Anak SD. Dibuat dengan penuh kasih sayang untuk anak-anak Indonesia.</p>
      </div>
    </div>
  );
};

export default Login;
