
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Search, User, Plus, Edit, Trash2 } from "lucide-react";

// Sample initial users
const initialUsers = [
  { id: "1", name: "Admin Utama", username: "admin", password: "admin123", role: "admin" },
  { id: "2", name: "Budi Santoso", username: "budi", password: "budi123", role: "siswa", kelas: "6A" },
  { id: "3", name: "Siti Nurhaliza", username: "siti", password: "siti123", role: "siswa", kelas: "6A" },
  { id: "4", name: "Ibu Wati", username: "guru", password: "guru123", role: "guru", kelas: "6A" },
  { id: "5", name: "Pak Dedi", username: "dedi", password: "dedi123", role: "guru", kelas: "5B" },
];

const availableClasses = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"];

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "siswa",
    kelas: "",
  });
  
  const { toast } = useToast();

  // Load users from localStorage or use initial data
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }, []);

  // Filter users based on search query and active tab
  useEffect(() => {
    let filtered = [...users];
    
    // Filter by role if tab is not "all"
    if (activeTab !== "all") {
      filtered = filtered.filter(user => user.role === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.username.toLowerCase().includes(query) ||
        (user.kelas && user.kelas.toLowerCase().includes(query))
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, activeTab]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Open add user dialog
  const handleOpenAddDialog = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      role: "siswa",
      kelas: "",
    });
    setIsAddDialogOpen(true);
  };

  // Open edit user dialog
  const handleOpenEditDialog = (user: any) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      kelas: user.kelas || "",
    });
    setIsEditDialogOpen(true);
  };

  // Open delete user dialog
  const handleOpenDeleteDialog = (user: any) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Add new user
  const handleAddUser = () => {
    // Validate form data
    if (!formData.name || !formData.username || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua kolom wajib diisi",
      });
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === formData.username)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username sudah digunakan",
      });
      return;
    }

    // If role is siswa or guru, kelas is required
    if ((formData.role === "siswa" || formData.role === "guru") && !formData.kelas) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Kelas wajib diisi untuk Siswa dan Guru",
      });
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      ...(formData.role === "admin" ? {} : { kelas: formData.kelas }),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Pengguna Ditambahkan",
      description: `${formData.name} berhasil ditambahkan sebagai ${formData.role}`,
    });
  };

  // Update user
  const handleUpdateUser = () => {
    // Validate form data
    if (!formData.name || !formData.username || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua kolom wajib diisi",
      });
      return;
    }

    // Check if username already exists (excluding current user)
    if (
      users.some(
        user => user.username === formData.username && user.id !== currentUser.id
      )
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username sudah digunakan",
      });
      return;
    }

    // If role is siswa or guru, kelas is required
    if ((formData.role === "siswa" || formData.role === "guru") && !formData.kelas) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Kelas wajib diisi untuk Siswa dan Guru",
      });
      return;
    }

    // Update user
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          name: formData.name,
          username: formData.username,
          password: formData.password,
          role: formData.role,
          ...(formData.role === "admin" 
            ? { kelas: undefined } 
            : { kelas: formData.kelas }),
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Pengguna Diperbarui",
      description: `${formData.name} berhasil diperbarui`,
    });
  };

  // Delete user
  const handleDeleteUser = () => {
    // Don't allow deleting the last admin
    const admins = users.filter(user => user.role === "admin");
    if (currentUser.role === "admin" && admins.length === 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tidak dapat menghapus admin terakhir",
      });
      setIsDeleteDialogOpen(false);
      return;
    }

    const updatedUsers = users.filter(user => user.id !== currentUser.id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Pengguna Dihapus",
      description: `${currentUser.name} berhasil dihapus`,
    });
  };

  return (
    <AdminLayout title="Kelola Pengguna">
      <Card className="kids-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-kids-purple">Daftar Pengguna</CardTitle>
          <Button onClick={handleOpenAddDialog} className="bg-kids-purple hover:bg-kids-blue">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Cari pengguna..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="siswa">Siswa</TabsTrigger>
                <TabsTrigger value="guru">Guru</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-kids-purple"
                            : user.role === "guru"
                            ? "bg-kids-green"
                            : "bg-kids-blue"
                        }
                      >
                        {user.role === "admin" ? "Admin" : user.role === "guru" ? "Guru" : "Siswa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.kelas || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEditDialog(user)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(user)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada pengguna yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-kids-purple">Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Isi formulir berikut untuk menambahkan pengguna baru
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="siswa">Siswa</SelectItem>
                  <SelectItem value="guru">Guru</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.role === "siswa" || formData.role === "guru") && (
              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas</Label>
                <Select
                  value={formData.kelas}
                  onValueChange={(value) => handleSelectChange("kelas", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((kelas) => (
                      <SelectItem key={kelas} value={kelas}>
                        {kelas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddUser} className="bg-kids-purple hover:bg-kids-blue">
              Tambah Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-kids-purple">Edit Pengguna</DialogTitle>
            <DialogDescription>
              Perbarui informasi untuk pengguna ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="siswa">Siswa</SelectItem>
                  <SelectItem value="guru">Guru</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.role === "siswa" || formData.role === "guru") && (
              <div className="space-y-2">
                <Label htmlFor="edit-kelas">Kelas</Label>
                <Select
                  value={formData.kelas}
                  onValueChange={(value) => handleSelectChange("kelas", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((kelas) => (
                      <SelectItem key={kelas} value={kelas}>
                        {kelas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdateUser} className="bg-kids-purple hover:bg-kids-blue">
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-kids-red">Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <p className="font-medium">Nama: {currentUser.name}</p>
              <p>Username: {currentUser.username}</p>
              <p>Role: {currentUser.role}</p>
              {currentUser.kelas && <p>Kelas: {currentUser.kelas}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ManageUsers;
