import { Attendance, Student } from '@/services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, CalendarCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AttendanceListProps {
  attendances: Attendance[];
  students: Student[];
  onEdit: (attendance: Attendance) => void;
  onDelete: (attendance: Attendance) => void;
  isLoading?: boolean;
}

const AttendanceList = ({ attendances, students, onEdit, onDelete, isLoading }: AttendanceListProps) => {
  const getStudentName = (studentId: string | Student): string => {
    if (typeof studentId === 'object') return studentId.name;
    const student = students.find(s => s._id === studentId);
    return student?.name || 'Unknown';
  };

  const getStudentRoll = (studentId: string | Student): string => {
    if (typeof studentId === 'object') return studentId.rollNumber;
    const student = students.find(s => s._id === studentId);
    return student?.rollNumber || '';
  };

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

  if (attendances.length === 0) {
    return (
      <div className="table-container">
        <div className="p-12 text-center">
          <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No attendance records</h3>
          <p className="text-muted-foreground">Start marking attendance to see records here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Student</TableHead>
            <TableHead className="font-semibold">Roll Number</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance, index) => (
            <TableRow 
              key={attendance._id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium">
                {getStudentName(attendance.studentId)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {getStudentRoll(attendance.studentId)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(attendance.date), 'PPP')}
              </TableCell>
              <TableCell>
                <Badge
                  variant={attendance.status === 'present' ? 'default' : 'destructive'}
                  className={attendance.status === 'present' ? 'bg-success hover:bg-success/90' : ''}
                >
                  {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(attendance)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(attendance)}
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

export default AttendanceList;
