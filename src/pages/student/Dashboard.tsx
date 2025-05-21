
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StudentLayout from "@/components/layouts/StudentLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthData } from "@/contexts/HealthDataContext";
import { FileText, ThumbsUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getStudentHealthData, getStudentComplaints } = useHealthData();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [latestData, setLatestData] = useState<any | null>(null);
  
  useEffect(() => {
    if (user) {
      const fetchedHealthData = getStudentHealthData(user.id);
      const fetchedComplaints = getStudentComplaints(user.id);
      
      setHealthData(fetchedHealthData);
      setComplaints(fetchedComplaints);
      
      // Get latest health data entry
      if (fetchedHealthData.length > 0) {
        const sortedData = [...fetchedHealthData].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setLatestData(sortedData[0]);
      }
    }
  }, [user, getStudentHealthData, getStudentComplaints]);

  // Calculate response rate
  const respondedCount = complaints.filter(c => c.status === 'responded').length;
  const responseRate = complaints.length > 0 ? (respondedCount / complaints.length) * 100 : 0;

  return (
    <StudentLayout title="Dashboard Siswa">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card */}
        <Card className="kids-card bg-gradient-to-br from-white to-kids-light-blue">
          <CardHeader>
            <CardTitle className="text-kids-blue">Statistik Kesehatan</CardTitle>
            <CardDescription>Data statistik kesehatan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Data Kesehatan:</span>
                <Badge variant="outline" className="bg-kids-light-blue text-kids-blue">
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
                <span className="text-gray-600">Keluhan Direspon:</span>
                <Badge variant="outline" className="bg-kids-light-green text-kids-green">
                  {respondedCount} Respon
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tingkat Respons:</span>
                  <span className="text-sm font-medium">{responseRate.toFixed(0)}%</span>
                </div>
                <Progress value={responseRate} className="h-2 bg-kids-light-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Health Data */}
        <Card className="kids-card bg-gradient-to-br from-white to-kids-light-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-kids-green">Data Kesehatan Terbaru</CardTitle>
            <CardDescription>
              {latestData ? `Tanggal: ${latestData.date}` : "Belum ada data kesehatan"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestData ? (
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Suhu Tubuh</span>
                  <span className="text-xl font-bold">{latestData.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Berat Badan</span>
                  <span className="text-xl font-bold">{latestData.weight} kg</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Tinggi Badan</span>
                  <span className="text-xl font-bold">{latestData.height} cm</span>
                </div>
                {latestData.notes && (
                  <div className="pt-1">
                    <span className="font-medium block">Catatan:</span>
                    <p className="text-gray-600 italic">{latestData.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                <FileText size={40} className="mb-2" />
                <p>Belum ada data kesehatan. Silakan isi data kesehatan Anda.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Complaint Response */}
        <Card className="kids-card bg-gradient-to-br from-white to-kids-light-yellow">
          <CardHeader>
            <CardTitle className="text-kids-orange">Status Keluhan</CardTitle>
            <CardDescription>Respon terbaru dari guru</CardDescription>
          </CardHeader>
          <CardContent>
            {complaints.length > 0 ? (
              (() => {
                const sortedComplaints = [...complaints].sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                const latestComplaint = sortedComplaints[0];
                
                return (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-md">{latestComplaint.title}</h4>
                      <p className="text-sm text-gray-600">Diajukan: {latestComplaint.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      {latestComplaint.status === 'responded' ? (
                        <Badge className="bg-kids-green">Sudah Direspon</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Menunggu Respon
                        </Badge>
                      )}
                    </div>
                    
                    {latestComplaint.status === 'responded' && latestComplaint.response ? (
                      <div className="bg-gray-50 p-3 rounded-lg mt-2 border border-gray-200">
                        <div className="flex items-start gap-2 mb-1">
                          <ThumbsUp size={16} className="text-kids-green mt-1" />
                          <div>
                            <p className="font-medium text-sm">{latestComplaint.response.teacherName}</p>
                            <p className="text-xs text-gray-500">{latestComplaint.response.date}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm pl-6">{latestComplaint.response.message}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 mt-3">
                        <AlertTriangle size={16} />
                        <span className="text-sm">Belum ada tanggapan dari guru</span>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                <FileText size={40} className="mb-2" />
                <p>Belum ada keluhan yang diajukan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
