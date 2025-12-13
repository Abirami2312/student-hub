import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Student, StudentInput } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentInput) => Promise<void>;
  student?: Student | null;
  isLoading?: boolean;
}

const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const StudentForm = ({ open, onClose, onSubmit, student, isLoading }: StudentFormProps) => {
  const [formData, setFormData] = useState<StudentInput>({
    name: '',
    rollNumber: '',
    department: '',
    year: '',
  });
  const [errors, setErrors] = useState<Partial<StudentInput>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        year: student.year,
      });
    } else {
      setFormData({ name: '', rollNumber: '', department: '', year: '' });
    }
    setErrors({});
  }, [student, open]);

  const validate = (): boolean => {
    const newErrors: Partial<StudentInput> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.year) newErrors.year = 'Year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {student ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter student name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              placeholder="e.g., CS2024001"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className={errors.rollNumber ? 'border-destructive' : ''}
            />
            {errors.rollNumber && <p className="text-sm text-destructive">{errors.rollNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select
              value={formData.year}
              onValueChange={(value) => setFormData({ ...formData, year: value })}
            >
              <SelectTrigger className={errors.year ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {student ? 'Update' : 'Add'} Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
