import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Student, Attendance, AttendanceInput } from '@/services/api';
import { Loader2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AttendanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AttendanceInput) => Promise<void>;
  students: Student[];
  attendance?: Attendance | null;
  isLoading?: boolean;
}

const AttendanceForm = ({ open, onClose, onSubmit, students, attendance, isLoading }: AttendanceFormProps) => {
  const [formData, setFormData] = useState<AttendanceInput>({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<Partial<Record<keyof AttendanceInput, string>>>({});

  useEffect(() => {
    if (attendance) {
      const studentId = typeof attendance.studentId === 'string' 
        ? attendance.studentId 
        : attendance.studentId._id;
      setFormData({
        studentId,
        date: attendance.date.split('T')[0],
        status: attendance.status,
      });
      setSelectedDate(new Date(attendance.date));
    } else {
      setFormData({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
      });
      setSelectedDate(new Date());
    }
    setErrors({});
  }, [attendance, open]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AttendanceInput, string>> = {};
    if (!formData.studentId) newErrors.studentId = 'Please select a student';
    if (!formData.date) newErrors.date = 'Please select a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData({ ...formData, date: date.toISOString().split('T')[0] });
    }
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
            {attendance ? 'Edit Attendance' : 'Mark Attendance'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData({ ...formData, studentId: value })}
            >
              <SelectTrigger className={errors.studentId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student._id} value={student._id}>
                    {student.name} ({student.rollNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.studentId && <p className="text-sm text-destructive">{errors.studentId}</p>}
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                    errors.date && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={formData.status === 'present' ? 'default' : 'outline'}
                className={cn(
                  "flex-1",
                  formData.status === 'present' && "bg-success hover:bg-success/90"
                )}
                onClick={() => setFormData({ ...formData, status: 'present' })}
              >
                Present
              </Button>
              <Button
                type="button"
                variant={formData.status === 'absent' ? 'default' : 'outline'}
                className={cn(
                  "flex-1",
                  formData.status === 'absent' && "bg-destructive hover:bg-destructive/90"
                )}
                onClick={() => setFormData({ ...formData, status: 'absent' })}
              >
                Absent
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {attendance ? 'Update' : 'Mark'} Attendance
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceForm;
