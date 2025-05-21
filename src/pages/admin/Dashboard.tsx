
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useHealthData } from "@/contexts/HealthDataContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#33C3F0', '#7FD66F', '#FFD166', '#EF476F', '#9b87f5', '#FF9E5D'];

const AdminDashboard = () => {
  const { getAllHealthData, getAllComplaints } = useHealthData();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [classSummary, setClassSummary] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchedHealthData = getAllHealthData();
    const fetchedComplaints = getAllComplaints();
    
    setHealthData(fetchedHealthData);
    setComplaints(fetchedComplaints);
    
    // Prepare timeline data
    const dateGroups = fetchedHealthData.reduce((groups: any, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = {
          count: 0,
          avgTemp: 0,
          totalTemp: 0,
        };
      }
      groups[date].count += 1;
      groups[date].totalTemp += item.temperature;
      return groups;
    }, {});
    
    const timeline = Object.keys(dateGroups).map(date => {
      return {
        date,
        count: dateGroups[date].count,
        avgTemp: Math.round((dateGroups[date].totalTemp / dateGroups[date].count) * 10) / 10
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setTimelineData(timeline);
    
    // Prepare class summary
    const classCounts = fetchedHealthData.reduce((counts: any, item) => {
      const kelas = item.kelas;
      counts[kelas] = (counts[kelas] || 0) + 1;
      return counts;
    }, {});
    
    const classData = Object.keys(classCounts).map(kelas => ({
      name: kelas,
      value: classCounts[kelas]
    }));
    
    setClassSummary(classData);
    
  }, [getAllHealthData, getAllComplaints]);

  // Calculate response rate for complaints
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const respondedCount = complaints.filter(c => c.status === 'responded').length;
  const responseRate = complaints.length > 0 ? (respondedCount / complaints.length) * 100 : 0;

  return (
    <AdminLayout title="Dashboard Admin">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <Card className="kids-card bg-gradient-to-br from-white to-kids-light-blue">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-kids-blue">{healthData.length}</div>
            <p className="text-sm text-gray-600">Total Data Kesehatan</p>
          </CardContent>
        </Card>
        
        <Card className="kids-card bg-gradient-to-br from-white to-kids-light-green">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-kids-green">{complaints.length}</div>
            <p className="text-sm text-gray-600">Total Keluhan</p>
          </CardContent>
        </Card>
        
        <Card className="kids-card bg-gradient-to-br from-white to-kids-light-yellow">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-kids-orange">{pendingComplaints}</div>
            <p className="text-sm text-gray-600">Keluhan Belum Direspon</p>
          </CardContent>
        </Card>
        
        <Card className="kids-card">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-kids-purple">{responseRate.toFixed(0)}%</div>
            <p className="text-sm text-gray-600 mb-1">Tingkat Respons</p>
            <Progress value={responseRate} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Timeline Chart */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="text-kids-purple">Data Kesehatan Per Hari</CardTitle>
            <CardDescription>Jumlah input data dan rata-rata suhu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#9b87f5" />
                    <YAxis yAxisId="right" orientation="right" stroke="#33C3F0" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="count" name="Jumlah Data" stroke="#9b87f5" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="avgTemp" name="Rata-rata Suhu (°C)" stroke="#33C3F0" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Belum ada data yang cukup untuk ditampilkan dalam grafik
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Class Distribution */}
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="text-kids-purple">Distribusi Data Per Kelas</CardTitle>
            <CardDescription>Jumlah data kesehatan berdasarkan kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {classSummary.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classSummary}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {classSummary.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value, name, props) => [`${value} data`, `Kelas ${name}`]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Belum ada data kelas yang cukup untuk ditampilkan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaint Status */}
      <Card className="kids-card">
        <CardHeader>
          <CardTitle className="text-kids-purple">Status Keluhan</CardTitle>
          <CardDescription>Perbandingan keluhan yang sudah dan belum direspon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {complaints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: 'Keluhan',
                      Direspon: respondedCount,
                      'Belum Direspon': pendingComplaints
                    }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Direspon" stackId="a" fill="#7FD66F" />
                  <Bar dataKey="Belum Direspon" stackId="a" fill="#FFD166" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Belum ada data keluhan yang tersedia
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
