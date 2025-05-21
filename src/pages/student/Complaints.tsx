
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/layouts/StudentLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthData, Complaint } from "@/contexts/HealthDataContext";
import { AlertTriangle, ThumbsUp, MessageCircle } from "lucide-react";

const StudentComplaints = () => {
  const { user } = useAuth();
  const { addComplaint, getStudentComplaints } = useHealthData();
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    if (user) {
      const fetchedComplaints = getStudentComplaints(user.id);
      setComplaints(fetchedComplaints);
    }
  }, [user, getStudentComplaints]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);

    // Submit complaint
    addComplaint({
      studentId: user.id,
      studentName: user.name,
      kelas: user.kelas || "",
      title,
      description,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setLoading(false);
    
    // Refresh complaints list
    if (user) {
      const fetchedComplaints = getStudentComplaints(user.id);
      setComplaints(fetchedComplaints);
    }
  };

  return (
    <StudentLayout title="Keluhan Kesehatan">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="form" className="text-base py-3">Buat Keluhan</TabsTrigger>
          <TabsTrigger value="history" className="text-base py-3">Riwayat Keluhan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <div className="max-w-2xl mx-auto">
            <Card className="kids-card">
              <CardHeader>
                <CardTitle className="text-kids-purple">Form Keluhan Kesehatan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">Judul Keluhan</Label>
                    <Input
                      id="title"
                      placeholder="Contoh: Sakit Kepala, Batuk, dll."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="border-kids-purple focus-visible:ring-kids-blue"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">Deskripsi Keluhan</Label>
                    <Textarea
                      id="description"
                      placeholder="Jelaskan keluhan kesehatan Anda secara detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="resize-none min-h-[150px] border-kids-purple focus-visible:ring-kids-blue"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-kids-purple hover:bg-kids-blue"
                    disabled={loading}
                  >
                    {loading ? "Mengirim..." : "Kirim Keluhan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-kids-purple">Riwayat Keluhan</CardTitle>
              </CardHeader>
              <CardContent>
                {complaints.length > 0 ? (
                  <div className="space-y-6">
                    {complaints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((complaint) => (
                        <Card key={complaint.id} className="overflow-hidden">
                          <div className={`px-4 py-2 ${complaint.status === 'responded' ? 'bg-kids-light-green' : 'bg-kids-light-yellow'}`}>
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{complaint.title}</h3>
                              {complaint.status === 'responded' ? (
                                <Badge className="bg-kids-green">Sudah Direspon</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  Menunggu Respon
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">Tanggal: {complaint.date}</p>
                          </div>
                          <CardContent className="pt-4">
                            <div className="space-y-4">
                              <div className="flex items-start gap-2">
                                <MessageCircle size={16} className="text-kids-blue mt-1" />
                                <div>
                                  <p className="font-medium text-sm">Keluhan Anda:</p>
                                  <p className="text-gray-700">{complaint.description}</p>
                                </div>
                              </div>
                              
                              {complaint.status === 'responded' && complaint.response ? (
                                <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  <ThumbsUp size={16} className="text-kids-green mt-1" />
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-sm">{complaint.response.teacherName}</p>
                                      <p className="text-xs text-gray-500">{complaint.response.date}</p>
                                    </div>
                                    <p className="text-gray-700">{complaint.response.message}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-gray-500">
                                  <AlertTriangle size={16} />
                                  <span className="text-sm">Belum ada tanggapan dari guru</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
                    <p>Belum ada riwayat keluhan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </StudentLayout>
  );
};

export default StudentComplaints;
