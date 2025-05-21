
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthData, Complaint } from "@/contexts/HealthDataContext";
import { MessageCircle, CheckCircle, AlertCircle, Search } from "lucide-react";

const TeacherComplaints = () => {
  const { user } = useAuth();
  const { getClassComplaints, respondToComplaint } = useHealthData();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user && user.kelas) {
      const fetchedComplaints = getClassComplaints(user.kelas);
      setComplaints(fetchedComplaints);
      setFilteredComplaints(fetchedComplaints);
    }
  }, [user, getClassComplaints]);

  // Filter complaints when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredComplaints(complaints);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = complaints.filter(complaint => 
        complaint.studentName.toLowerCase().includes(query) ||
        complaint.title.toLowerCase().includes(query) ||
        complaint.description.toLowerCase().includes(query)
      );
      setFilteredComplaints(filtered);
    }
  }, [searchQuery, complaints]);

  const handleOpenDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResponse(complaint.response?.message || "");
    setDialogOpen(true);
  };

  const handleSendResponse = () => {
    if (!user || !selectedComplaint) return;
    
    respondToComplaint(
      selectedComplaint.id,
      user.id,
      user.name,
      response
    );
    
    setDialogOpen(false);
    
    // Refresh complaints list
    if (user && user.kelas) {
      const fetchedComplaints = getClassComplaints(user.kelas);
      setComplaints(fetchedComplaints);
      setFilteredComplaints(fetchedComplaints);
    }
  };

  const pendingComplaints = filteredComplaints.filter(c => c.status === 'pending');
  const respondedComplaints = filteredComplaints.filter(c => c.status === 'responded');

  return (
    <TeacherLayout title="Keluhan Siswa">
      <Card className="kids-card mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-kids-green">Keluhan Siswa</CardTitle>
              <CardDescription>Daftar keluhan dari siswa kelas {user?.kelas}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-red-100 text-red-600">
                Belum Ditanggapi: {pendingComplaints.length}
              </Badge>
              <Badge className="bg-green-100 text-green-600">
                Sudah Ditanggapi: {respondedComplaints.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Cari keluhan..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="pending" className="text-base py-3">
                Belum Ditanggapi
                {pendingComplaints.length > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-600">{pendingComplaints.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="responded" className="text-base py-3">
                Sudah Ditanggapi
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <div className="space-y-6">
                {pendingComplaints.length > 0 ? (
                  pendingComplaints
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden border-l-4 border-l-kids-orange">
                        <CardHeader className="bg-kids-light-yellow bg-opacity-50 p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-kids-orange">{complaint.title}</CardTitle>
                              <CardDescription>
                                <span className="font-medium">{complaint.studentName}</span> • Tanggal: {complaint.date}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              Belum Ditanggapi
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="mb-4">
                            <div className="flex items-start gap-2">
                              <MessageCircle size={18} className="text-kids-orange mt-1" />
                              <p className="text-gray-700">{complaint.description}</p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              onClick={() => handleOpenDialog(complaint)}
                              className="bg-kids-green hover:bg-kids-blue"
                            >
                              Tanggapi Keluhan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle size={48} className="mx-auto mb-4 text-kids-green" />
                    <p>Tidak ada keluhan yang belum ditanggapi</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="responded">
              <div className="space-y-6">
                {respondedComplaints.length > 0 ? (
                  respondedComplaints
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((complaint) => (
                      <Card key={complaint.id} className="overflow-hidden border-l-4 border-l-kids-green">
                        <CardHeader className="bg-kids-light-green bg-opacity-50 p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-kids-green">{complaint.title}</CardTitle>
                              <CardDescription>
                                <span className="font-medium">{complaint.studentName}</span> • Tanggal: {complaint.date}
                              </CardDescription>
                            </div>
                            <Badge className="bg-kids-green">
                              Sudah Ditanggapi
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start gap-2">
                              <MessageCircle size={18} className="text-kids-orange mt-1" />
                              <div>
                                <p className="font-medium text-sm">Keluhan Siswa:</p>
                                <p className="text-gray-700">{complaint.description}</p>
                              </div>
                            </div>
                            
                            {complaint.response && (
                              <div className="flex items-start gap-2 bg-green-50 p-3 rounded-lg border border-green-100">
                                <CheckCircle size={18} className="text-kids-green mt-1" />
                                <div>
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm">Tanggapan Anda:</p>
                                    <p className="text-xs text-gray-500">{complaint.response.date}</p>
                                  </div>
                                  <p className="text-gray-700">{complaint.response.message}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button 
                              onClick={() => handleOpenDialog(complaint)}
                              variant="outline"
                              className="border-kids-green text-kids-green hover:bg-kids-light-green"
                            >
                              Edit Tanggapan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
                    <p>Tidak ada keluhan yang sudah ditanggapi</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-kids-green">
              {selectedComplaint?.status === 'responded' ? 'Edit Tanggapan' : 'Tanggapi Keluhan'}
            </DialogTitle>
            <DialogDescription>
              {selectedComplaint?.title} - dari {selectedComplaint?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="font-medium text-sm text-gray-700 mb-1">Keluhan Siswa:</p>
            <p className="text-gray-600">{selectedComplaint?.description}</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="response" className="text-sm font-medium">
                Tanggapan Anda
              </label>
              <Textarea
                id="response"
                placeholder="Tulis tanggapan Anda di sini..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button 
              onClick={handleSendResponse} 
              className="bg-kids-green hover:bg-kids-blue"
              disabled={!response.trim()}
            >
              {selectedComplaint?.status === 'responded' ? 'Perbarui Tanggapan' : 'Kirim Tanggapan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
};

export default TeacherComplaints;
