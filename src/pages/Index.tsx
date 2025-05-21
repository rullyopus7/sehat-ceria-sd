
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Activity, Heart, Award } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to appropriate dashboard if already logged in
    if (user) {
      if (user.role === "siswa") {
        navigate("/siswa");
      } else if (user.role === "guru") {
        navigate("/guru");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    }
  }, [user, navigate]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-kids-blue to-kids-purple text-white py-12 md:py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Peduli Kesehatan Anak SD
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Platform pemantauan kesehatan anak sekolah dasar yang memudahkan komunikasi antara siswa, guru, dan administrator.
            </p>
            <Button 
              onClick={handleLoginClick} 
              className="text-lg rounded-full px-8 py-6 bg-white text-kids-purple hover:bg-opacity-90"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Masuk Sekarang
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="bg-white rounded-full p-4 shadow-xl animate-bounce">
                <Heart size={120} className="text-kids-red" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-kids-purple mb-12">
            Fitur Aplikasi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="kids-card flex flex-col items-center text-center">
              <div className="rounded-full bg-kids-light-blue p-4 mb-4">
                <Activity size={40} className="text-kids-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-kids-blue">Pantau Kesehatan</h3>
              <p className="text-gray-600">
                Siswa dapat memasukkan data kesehatan harian seperti suhu tubuh, berat badan, dan tinggi badan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="kids-card flex flex-col items-center text-center">
              <div className="rounded-full bg-kids-light-green p-4 mb-4">
                <Heart size={40} className="text-kids-green" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-kids-green">Laporkan Keluhan</h3>
              <p className="text-gray-600">
                Siswa dapat melaporkan keluhan kesehatan dan mendapatkan tanggapan langsung dari guru.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="kids-card flex flex-col items-center text-center">
              <div className="rounded-full bg-kids-light-yellow p-4 mb-4">
                <Award size={40} className="text-kids-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-kids-orange">Manajemen Menyeluruh</h3>
              <p className="text-gray-600">
                Administrator dapat mengelola seluruh pengguna dan melihat laporan kesehatan komprehensif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-kids-purple mb-12">
            Cara Kerja
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-kids-blue text-white w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-kids-blue">Siswa</h3>
              <p className="text-gray-600">
                Masuk ke aplikasi dan isi data kesehatan harian atau laporkan keluhan jika merasa tidak enak badan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-kids-green text-white w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-kids-green">Guru</h3>
              <p className="text-gray-600">
                Pantau kesehatan siswa melalui dashboard dan berikan tanggapan terhadap keluhan yang dilaporkan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-kids-purple text-white w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-kids-purple">Admin</h3>
              <p className="text-gray-600">
                Kelola seluruh pengguna dan akses laporan kesehatan komprehensif untuk pemantauan yang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-kids-blue text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mulai Pantau Kesehatan Anak Sekarang
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Dengan aplikasi Peduli Kesehatan Anak SD, Anda dapat memantau kesehatan anak-anak dengan lebih efektif.
          </p>
          <Button 
            onClick={handleLoginClick} 
            className="text-lg rounded-full px-8 py-6 bg-white text-kids-purple hover:bg-opacity-90"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Masuk Sekarang
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Peduli Kesehatan Anak SD</h2>
            <p className="mb-6">Platform pemantauan kesehatan anak sekolah dasar yang komprehensif.</p>
            <p>© 2025 Peduli Kesehatan Anak SD. Dibuat dengan penuh kasih sayang untuk anak-anak Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
