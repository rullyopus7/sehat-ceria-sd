
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthData } from "@/contexts/HealthDataContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { getClassHealthData, getClassComplaints } = useHealthData();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (user && user.kelas) {
      const fetchedHealthData = getClassHealthData(user.kelas);
      const fetchedComplaints = getClassComplaints(user.kelas);
      
      setHealthData(fetchedHealthData);
      setComplaints(fetchedComplaints);
      
      // Prepare chart data - average temperature by date
      const dateGroups = fetchedHealthData.reduce((groups: any, item) => {
        const date = item.date;
        if (!groups[date]) {
          groups[date] = {
            temperatures: [],
            weights: [],
            heights: []
          };
        }
        groups[date].temperatures.push(item.temperature);
        groups[date].weights.push(item.weight);
        groups[date].heights.push(item.height);
        return groups;
      }, {});
      
      const chartData = Object.keys(dateGroups).map(date => {
        const temps = dateGroups[date].temperatures;
        const weights = dateGroups[date].weights;
        const heights = dateGroups[date].heights;
        
        return {
          date,
          avgTemp: Math.round((temps.reduce((sum: number, val: number) => sum + val, 0) / temps.length) * 10) / 10,
          avgWeight: Math.round(weights.reduce((sum: number, val: number) => sum + val, 0) / weights.length),
          avgHeight: Math.round(heights.reduce((sum: number, val: number) => sum + val, 0) / heights.length)
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setChartData(chartData);
    }
  }, [user, getClassHealthData, getClassComplaints]);

  // Calculate response rate
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const respondedCount = complaints.filter(c => c.status === 'responded').length;
  const responseRate = complaints.length > 0 ? (respondedCount / complaints.length) * 100 : 0;

  // Calculate average health metrics
  const calculateAverages = () => {
    if (healthData.length === 0) return { avgTemp: 0, avgWeight: 0, avgHeight: 0 };
    
    const totals = healthData.reduce((acc, curr) => {
      return {
        temperature: acc.temperature + curr.temperature,
        weight: acc.weight + curr.weight,
        height: acc.height + curr.height
      };
    }, { temperature: 0, weight: 0, height: 0 });
    
    return {
      avgTemp: Math.round((totals.temperature / healthData.length) * 10) / 10,
      avgWeight: Math.round(totals.weight / healthData.length),
      avgHeight: Math.round(totals.height / healthData.length)
    };
  };
  
  const averages = calculateAverages();

  return (
    <TeacherLayout title="Dashboard Guru">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Students Stats Card */}
        <Card className="kids-card bg-gradient-to-br from-white to-kids-light-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-kids-green">Statistik Kelas</CardTitle>
            <CardDescription>Kelas {user?.kelas}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Entri Data:</span>
                <Badge variant="outline" className="bg-kids-light-green text-kids-green">
                  {healthData.length} Entri
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Keluhan:</span>
                <Badge variant="outline" className="bg-kids-light-yellow text-kids-orange">
                  {complaints.length} Keluhan
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Keluhan Belum Direspon:</span>
                <Badge variant="outline" className="bg-red-100 text-red-600">
                  {pendingComplaints} Keluhan
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tingkat Respons:</span>
                  <span className="text-sm font-medium">{responseRate.toFixed(0)}%</span>
                </div>
                <Progress value={responseRate} className="h-2 bg-kids-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Averages Card */}
        <Card className="kids-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-kids-green">Rata-rata Kesehatan</CardTitle>
            <CardDescription>Data rata-rata siswa kelas {user?.kelas}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Suhu Tubuh</span>
                <span className="text-xl font-bold text-kids-blue">{averages.avgTemp}°C</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-lg">
                <span className="font-medium">Berat Badan</span>
                <span className="text-xl font-bold text-kids-green">{averages.avgWeight} kg</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Tinggi Badan</span>
                <span className="text-xl font-bold text-kids-orange">{averages.avgHeight} cm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="kids-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-kids-green">Tindakan Cepat</CardTitle>
            <CardDescription>Akses cepat untuk guru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              <a 
                href="/guru/daftar-siswa" 
                className="block px-4 py-3 bg-kids-light-green text-kids-green rounded-lg hover:bg-kids-green hover:text-white transition-colors"
              >
                <div className="font-bold">Lihat Data Siswa</div>
                <div className="text-sm">Pantau data kesehatan semua siswa</div>
              </a>
              
              <a 
                href="/guru/keluhan" 
                className="block px-4 py-3 bg-kids-light-yellow text-kids-orange rounded-lg hover:bg-kids-orange hover:text-white transition-colors"
              >
                <div className="font-bold">Keluhan Siswa</div>
                <div className="text-sm">
                  {pendingComplaints > 0 ? 
                    `${pendingComplaints} keluhan perlu ditanggapi` : 
                    'Semua keluhan telah ditanggapi'
                  }
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Data Chart */}
      <Card className="kids-card">
        <CardHeader>
          <CardTitle className="text-kids-green">Grafik Kesehatan Siswa</CardTitle>
          <CardDescription>Rata-rata suhu tubuh siswa berdasarkan tanggal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'avgTemp') return [`${value}°C`, 'Suhu Tubuh'];
                      if (name === 'avgWeight') return [`${value} kg`, 'Berat Badan'];
                      if (name === 'avgHeight') return [`${value} cm`, 'Tinggi Badan'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="avgTemp" name="Suhu Tubuh" fill="#33C3F0" />
                  <Bar dataKey="avgWeight" name="Berat Badan" fill="#7FD66F" />
                  <Bar dataKey="avgHeight" name="Tinggi Badan" fill="#FFD166" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Belum ada data yang cukup untuk ditampilkan dalam grafik
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
