import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Student, StudentInput, studentApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  // Fetch students
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentApi.getAll();
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students. Make sure your API is running.',
        variant: 'destructive',
      });
      // Use demo data for preview
      const demoData: Student[] = [
        { _id: '1', name: 'John Doe', rollNumber: 'CS2024001', department: 'Computer Science', year: '2nd Year' },
        { _id: '2', name: 'Jane Smith', rollNumber: 'EE2024002', department: 'Electrical Engineering', year: '3rd Year' },
        { _id: '3', name: 'Mike Johnson', rollNumber: 'ME2024003', department: 'Mechanical Engineering', year: '1st Year' },
      ];
      setStudents(demoData);
      setFilteredStudents(demoData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students by search
  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  // Handle form submit (add/edit)
  const handleSubmit = async (data: StudentInput) => {
    try {
      setIsSubmitting(true);
      if (selectedStudent) {
        await studentApi.update(selectedStudent._id, data);
        toast({ title: 'Success', description: 'Student updated successfully' });
      } else {
        await studentApi.create(data);
        toast({ title: 'Success', description: 'Student added successfully' });
      }
      fetchStudents();
      setFormOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: 'Error',
        description: 'Failed to save student. Check your API connection.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      setIsSubmitting(true);
      await studentApi.delete(selectedStudent._id);
      toast({ title: 'Success', description: 'Student deleted successfully' });
      fetchStudents();
      setDeleteOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete student. Check your API connection.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditForm = (student: Student) => {
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">Manage your student roster</p>
          </div>
          <Button onClick={() => { setSelectedStudent(null); setFormOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, roll number, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Student Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredStudents.length} of {students.length} students
        </div>

        {/* Student List */}
        <StudentList
          students={filteredStudents}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          isLoading={isLoading}
        />
      </div>

      {/* Forms and Dialogs */}
      <StudentForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setSelectedStudent(null); }}
        onSubmit={handleSubmit}
        student={selectedStudent}
        isLoading={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setSelectedStudent(null); }}
        onConfirm={handleDelete}
        title="Delete Student"
        description={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone and will also remove all attendance records for this student.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Students;
