
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthData } from "@/contexts/HealthDataContext";
import { FileText, Search } from "lucide-react";

const TeacherStudentList = () => {
  const { user } = useAuth();
  const { getClassHealthData } = useHealthData();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentsList, setStudentsList] = useState<{[key: string]: any}>({});
  
  useEffect(() => {
    if (user && user.kelas) {
      const fetchedHealthData = getClassHealthData(user.kelas);
      setHealthData(fetchedHealthData);
      setFilteredData(fetchedHealthData);
      
      // Create a map of students and their latest data
      const students: {[key: string]: any} = {};
      
      fetchedHealthData.forEach(data => {
        if (!students[data.studentId] || new Date(data.date) > new Date(students[data.studentId].date)) {
          students[data.studentId] = data;
        }
      });
      
      setStudentsList(students);
    }
  }, [user, getClassHealthData]);

  // Filter data when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(healthData);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = healthData.filter(data => 
        data.studentName.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, healthData]);

  // Group health data by student
  const groupedData = filteredData.reduce((groups: any, item) => {
    const studentId = item.studentId;
    if (!groups[studentId]) {
      groups[studentId] = [];
    }
    groups[studentId].push(item);
    return groups;
  }, {});

  return (
    <TeacherLayout title="Daftar Siswa">
      <Card className="kids-card mb-6">
        <CardHeader>
          <CardTitle className="text-kids-green">Data Kesehatan Siswa</CardTitle>
          <CardDescription>Daftar siswa kelas {user?.kelas}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Cari siswa..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Students List */}
          <div className="space-y-6">
            {Object.keys(studentsList).length > 0 ? (
              Object.keys(studentsList).map(studentId => {
                const student = studentsList[studentId];
                return (
                  <Card key={studentId} className="overflow-hidden border-l-4 border-l-kids-green">
                    <CardHeader className="bg-kids-light-green bg-opacity-50 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-kids-green">{student.studentName}</CardTitle>
                          <CardDescription>Kelas {student.kelas}</CardDescription>
                        </div>
                        <Badge className="bg-kids-green">
                          Data Terbaru: {student.date}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <div className="text-sm text-gray-500">Suhu Tubuh</div>
                            <div className="text-xl font-bold text-kids-blue">{student.temperature}°C</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <div className="text-sm text-gray-500">Berat Badan</div>
                            <div className="text-xl font-bold text-kids-green">{student.weight} kg</div>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3 text-center">
                            <div className="text-sm text-gray-500">Tinggi Badan</div>
                            <div className="text-xl font-bold text-kids-orange">{student.height} cm</div>
                          </div>
                        </div>
                        
                        {student.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-1">Catatan:</p>
                            <p className="text-gray-600">{student.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* History Table */}
                      {groupedData[studentId] && groupedData[studentId].length > 1 && (
                        <div className="border-t p-4">
                          <h4 className="font-medium mb-3">Riwayat Data Kesehatan</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Suhu (°C)</TableHead>
                                <TableHead>Berat (kg)</TableHead>
                                <TableHead>Tinggi (cm)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {groupedData[studentId]
                                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((entry: any, index: number) => (
                                  <TableRow key={entry.id}>
                                    <TableCell>{entry.date}</TableCell>
                                    <TableCell>{entry.temperature}</TableCell>
                                    <TableCell>{entry.weight}</TableCell>
                                    <TableCell>{entry.height}</TableCell>
                                  </TableRow>
                                ))
                              }
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4" />
                <p>Tidak ada data kesehatan siswa yang tersedia</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
};

export default TeacherStudentList;
