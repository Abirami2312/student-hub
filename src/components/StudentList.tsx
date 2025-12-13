import { Student } from '@/services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  isLoading?: boolean;
}

const StudentList = ({ students, onEdit, onDelete, isLoading }: StudentListProps) => {
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="table-container">
        <div className="p-12 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No students yet</h3>
          <p className="text-muted-foreground">Add your first student to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Roll Number</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Year</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow 
              key={student._id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {student.rollNumber}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{student.department}</TableCell>
              <TableCell>
                <Badge variant="secondary">{student.year}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(student)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(student)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentList;
