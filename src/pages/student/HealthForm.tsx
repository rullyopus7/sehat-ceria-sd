
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import StudentLayout from "@/components/layouts/StudentLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthData } from "@/contexts/HealthDataContext";

const StudentHealthForm = () => {
  const { user } = useAuth();
  const { addHealthData } = useHealthData();
  
  const [temperature, setTemperature] = useState<number>(36.5);
  const [weight, setWeight] = useState<number>(30);
  const [height, setHeight] = useState<number>(130);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);

    // Submit health data
    addHealthData({
      studentId: user.id,
      studentName: user.name,
      kelas: user.kelas || "",
      temperature,
      weight,
      height,
      notes
    });

    // Reset form
    setTemperature(36.5);
    setWeight(30);
    setHeight(130);
    setNotes("");
    setLoading(false);
  };

  return (
    <StudentLayout title="Isi Data Kesehatan">
      <div className="max-w-2xl mx-auto">
        <Card className="kids-card">
          <CardHeader>
            <CardTitle className="text-kids-blue">Form Data Kesehatan</CardTitle>
            <CardDescription>Silakan isi data kesehatan harian Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature" className="text-base">Suhu Tubuh (°C)</Label>
                  <span className="font-mono bg-kids-light-blue text-kids-blue px-2 rounded">
                    {temperature.toFixed(1)}°C
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={35.0}
                  max={42.0}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>35.0°C</span>
                  <span>Normal: 36.5°C - 37.5°C</span>
                  <span>42.0°C</span>
                </div>
              </div>
              
              {/* Weight */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="weight" className="text-base">Berat Badan (kg)</Label>
                  <span className="font-mono bg-kids-light-green text-kids-green px-2 rounded">
                    {weight} kg
                  </span>
                </div>
                <Slider
                  id="weight"
                  min={15}
                  max={100}
                  step={1}
                  value={[weight]}
                  onValueChange={(value) => setWeight(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>15 kg</span>
                  <span>Rata-rata anak SD: 20-50 kg</span>
                  <span>100 kg</span>
                </div>
              </div>
              
              {/* Height */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="height" className="text-base">Tinggi Badan (cm)</Label>
                  <span className="font-mono bg-kids-light-yellow text-kids-orange px-2 rounded">
                    {height} cm
                  </span>
                </div>
                <Slider
                  id="height"
                  min={100}
                  max={180}
                  step={1}
                  value={[height]}
                  onValueChange={(value) => setHeight(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>100 cm</span>
                  <span>Rata-rata anak SD: 110-160 cm</span>
                  <span>180 cm</span>
                </div>
              </div>
              
              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  placeholder="Tuliskan catatan tambahan (opsional)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none min-h-[100px]"
                />
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-kids-blue hover:bg-kids-purple"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Data Kesehatan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentHealthForm;
