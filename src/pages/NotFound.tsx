
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kids-light-blue via-kids-light-green to-kids-light-yellow">
      <div className="text-center bg-white rounded-xl shadow-xl p-8 max-w-md">
        <div className="text-9xl font-bold text-kids-blue mb-4">404</div>
        <h1 className="text-3xl font-bold text-kids-purple mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-xl text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Button onClick={() => window.location.href = "/"} className="bg-kids-purple hover:bg-kids-blue">
          <Home className="mr-2 h-5 w-5" />
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
