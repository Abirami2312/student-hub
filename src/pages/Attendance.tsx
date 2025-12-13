import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AttendanceForm from '@/components/AttendanceForm';
import AttendanceList from '@/components/AttendanceList';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Attendance, AttendanceInput, Student, attendanceApi, studentApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AttendancePage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const { toast } = useToast();

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [attendanceRes, studentsRes] = await Promise.all([
        attendanceApi.getAll(),
        studentApi.getAll(),
      ]);
      setAttendances(attendanceRes.data);
      setFilteredAttendances(attendanceRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data. Make sure your API is running.',
        variant: 'destructive',
      });
      // Demo data
      const demoStudents: Student[] = [
        { _id: '1', name: 'John Doe', rollNumber: 'CS2024001', department: 'Computer Science', year: '2nd Year' },
        { _id: '2', name: 'Jane Smith', rollNumber: 'EE2024002', department: 'Electrical Engineering', year: '3rd Year' },
        { _id: '3', name: 'Mike Johnson', rollNumber: 'ME2024003', department: 'Mechanical Engineering', year: '1st Year' },
      ];
      const demoAttendances: Attendance[] = [
        { _id: '1', studentId: '1', date: new Date().toISOString(), status: 'present' },
        { _id: '2', studentId: '2', date: new Date().toISOString(), status: 'absent' },
        { _id: '3', studentId: '3', date: new Date(Date.now() - 86400000).toISOString(), status: 'present' },
      ];
      setStudents(demoStudents);
      setAttendances(demoAttendances);
      setFilteredAttendances(demoAttendances);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter attendance
  useEffect(() => {
    let filtered = attendances;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((attendance) => {
        const student = typeof attendance.studentId === 'object' 
          ? attendance.studentId 
          : students.find(s => s._id === attendance.studentId);
        if (!student) return false;
        return (
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((attendance) => attendance.status === statusFilter);
    }

    // Sort by date (newest first)
    filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredAttendances(filtered);
  }, [searchQuery, statusFilter, attendances, students]);

  // Handle form submit
  const handleSubmit = async (data: AttendanceInput) => {
    try {
      setIsSubmitting(true);
      if (selectedAttendance) {
        await attendanceApi.update(selectedAttendance._id, data);
        toast({ title: 'Success', description: 'Attendance updated successfully' });
      } else {
        await attendanceApi.create(data);
        toast({ title: 'Success', description: 'Attendance marked successfully' });
      }
      fetchData();
      setFormOpen(false);
      setSelectedAttendance(null);
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to save attendance. Check your API connection.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedAttendance) return;
    try {
      setIsSubmitting(true);
      await attendanceApi.delete(selectedAttendance._id);
      toast({ title: 'Success', description: 'Attendance record deleted' });
      fetchData();
      setDeleteOpen(false);
      setSelectedAttendance(null);
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete attendance. Check your API connection.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditForm = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setFormOpen(true);
  };

  const openDeleteDialog = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setDeleteOpen(true);
  };

  const presentCount = attendances.filter(a => a.status === 'present').length;
  const absentCount = attendances.filter(a => a.status === 'absent').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground mt-1">Track and manage attendance records</p>
          </div>
          <Button 
            onClick={() => { setSelectedAttendance(null); setFormOpen(true); }} 
            className="gap-2"
            disabled={students.length === 0}
          >
            <Plus className="h-4 w-4" />
            Mark Attendance
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <p className="text-sm font-medium text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold text-foreground mt-1">{attendances.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm font-medium text-muted-foreground">Present</p>
            <p className="text-2xl font-bold text-success mt-1">{presentCount}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm font-medium text-muted-foreground">Absent</p>
            <p className="text-2xl font-bold text-destructive mt-1">{absentCount}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm font-medium text-muted-foreground">Rate</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Record Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredAttendances.length} of {attendances.length} records
        </div>

        {/* Attendance List */}
        <AttendanceList
          attendances={filteredAttendances}
          students={students}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          isLoading={isLoading}
        />
      </div>

      {/* Forms and Dialogs */}
      <AttendanceForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setSelectedAttendance(null); }}
        onSubmit={handleSubmit}
        students={students}
        attendance={selectedAttendance}
        isLoading={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setSelectedAttendance(null); }}
        onConfirm={handleDelete}
        title="Delete Attendance Record"
        description="Are you sure you want to delete this attendance record? This action cannot be undone."
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AttendancePage;
