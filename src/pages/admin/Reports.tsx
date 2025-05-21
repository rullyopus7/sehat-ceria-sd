
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useHealthData } from "@/contexts/HealthDataContext";
import { Search, FileText, Download } from "lucide-react";

const Reports = () => {
  const { getAllHealthData, getAllComplaints } = useHealthData();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredHealthData, setFilteredHealthData] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  
  // Filters
  const [dataType, setDataType] = useState<string>("health");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterKelas, setFilterKelas] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");

  // Get unique classes
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchedHealthData = getAllHealthData();
    const fetchedComplaints = getAllComplaints();
    
    setHealthData(fetchedHealthData);
    setComplaints(fetchedComplaints);
    
    // Extract unique classes and dates
    const classes = Array.from(new Set([
      ...fetchedHealthData.map(item => item.kelas),
      ...fetchedComplaints.map(item => item.kelas)
    ])).sort();
    
    const dates = Array.from(new Set([
      ...fetchedHealthData.map(item => item.date),
      ...fetchedComplaints.map(item => item.date)
    ])).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    setAvailableClasses(classes);
    setAvailableDates(dates);
    
    // Initial filter
    setFilteredHealthData(fetchedHealthData);
    setFilteredComplaints(fetchedComplaints);
    
  }, [getAllHealthData, getAllComplaints]);

  // Apply filters
  useEffect(() => {
    let filteredHealth = healthData;
    let filteredComplaint = complaints;
    
    // Apply class filter
    if (filterKelas !== "all") {
      filteredHealth = filteredHealth.filter(item => item.kelas === filterKelas);
      filteredComplaint = filteredComplaint.filter(item => item.kelas === filterKelas);
    }
    
    // Apply date filter
    if (filterDate) {
      filteredHealth = filteredHealth.filter(item => item.date === filterDate);
      filteredComplaint = filteredComplaint.filter(item => item.date === filterDate);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredHealth = filteredHealth.filter(item => 
        item.studentName.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
      filteredComplaint = filteredComplaint.filter(item => 
        item.studentName.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.response && item.response.message.toLowerCase().includes(query))
      );
    }
    
    setFilteredHealthData(filteredHealth);
    setFilteredComplaints(filteredComplaint);
    
  }, [searchQuery, filterKelas, filterDate, healthData, complaints]);

  // Export data as CSV
  const exportCSV = () => {
    const data = dataType === "health" ? filteredHealthData : filteredComplaints;
    
    if (data.length === 0) {
      return;
    }
    
    let csvContent = "";
    let headers = [];
    
    // Create headers based on data type
    if (dataType === "health") {
      headers = ["Nama Siswa", "Kelas", "Tanggal", "Suhu (°C)", "Berat (kg)", "Tinggi (cm)", "Catatan"];
      csvContent = headers.join(",") + "\n";
      
      data.forEach(item => {
        const row = [
          `"${item.studentName}"`,
          `"${item.kelas}"`,
          `"${item.date}"`,
          item.temperature,
          item.weight,
          item.height,
          `"${item.notes || ""}"`
        ];
        csvContent += row.join(",") + "\n";
      });
    } else {
      headers = ["Nama Siswa", "Kelas", "Tanggal", "Judul", "Deskripsi", "Status", "Tanggapan", "Tanggal Tanggapan"];
      csvContent = headers.join(",") + "\n";
      
      data.forEach(item => {
        const row = [
          `"${item.studentName}"`,
          `"${item.kelas}"`,
          `"${item.date}"`,
          `"${item.title}"`,
          `"${item.description}"`,
          `"${item.status === 'responded' ? 'Sudah Ditanggapi' : 'Belum Ditanggapi'}"`,
          `"${item.response ? item.response.message : ""}"`,
          `"${item.response ? item.response.date : ""}"`
        ];
        csvContent += row.join(",") + "\n";
      });
    }
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_${dataType}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Laporan Kesehatan">
      <Card className="kids-card mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-kids-purple">
              {dataType === "health" ? "Laporan Data Kesehatan" : "Laporan Keluhan"}
            </CardTitle>
            <CardDescription>
              {dataType === "health" 
                ? `Menampilkan ${filteredHealthData.length} data kesehatan` 
                : `Menampilkan ${filteredComplaints.length} keluhan`}
            </CardDescription>
          </div>
          <Button onClick={exportCSV} className="bg-kids-green hover:bg-kids-blue">
            <Download className="mr-2 h-4 w-4" />
            Ekspor CSV
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Jenis Data</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Data Kesehatan</SelectItem>
                  <SelectItem value="complaints">Keluhan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Filter Kelas</Label>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {availableClasses.map((kelas) => (
                    <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Filter Tanggal</Label>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tanggal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Tanggal</SelectItem>
                  {availableDates.map((date) => (
                    <SelectItem key={date} value={date}>{date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Cari</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Cari..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Table for Health Data */}
          {dataType === "health" && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Suhu (°C)</TableHead>
                    <TableHead>Berat (kg)</TableHead>
                    <TableHead>Tinggi (cm)</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHealthData.length > 0 ? (
                    filteredHealthData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.studentName}</TableCell>
                        <TableCell>{item.kelas}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.temperature}</TableCell>
                        <TableCell>{item.weight}</TableCell>
                        <TableCell>{item.height}</TableCell>
                        <TableCell>{item.notes || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileText size={32} className="mb-2" />
                          <p>Tidak ada data kesehatan yang ditemukan</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Table for Complaints */}
          {dataType === "complaints" && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.studentName}</TableCell>
                        <TableCell>{item.kelas}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          {item.status === 'responded' ? (
                            <Badge className="bg-kids-green">Sudah Ditanggapi</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              Belum Ditanggapi
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Keluhan:</span>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            {item.status === 'responded' && item.response && (
                              <div>
                                <span className="font-medium">Tanggapan:</span>
                                <p className="text-sm text-gray-600">{item.response.message}</p>
                                <p className="text-xs text-gray-500">
                                  {item.response.teacherName} - {item.response.date}
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileText size={32} className="mb-2" />
                          <p>Tidak ada keluhan yang ditemukan</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Reports;
