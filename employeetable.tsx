import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  salary: number;
  department: string;
  hireDate: string;
}

interface EmployeeTableProps {
  employees?: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  userRole?: "admin" | "manager" | "viewer";
}

const EmployeeTable = ({
  employees = mockEmployees,
  onEdit = () => {},
  onDelete = () => {},
  userRole = "admin",
}: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const itemsPerPage = 10;

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate employees
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle sort
  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle row selection
  const toggleRowSelection = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id],
    );
  };

  // Get unique departments for filter
  const departments = [
    "all",
    ...new Set(employees.map((emp) => emp.department)),
  ];

  // Check if user has edit/delete permissions
  const canEdit = userRole === "admin" || userRole === "manager";
  const canDelete = userRole === "admin";

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {canEdit && (
            <Button
              variant="destructive"
              disabled={selectedEmployees.length === 0}
            >
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {canEdit && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      paginatedEmployees.length > 0 &&
                      selectedEmployees.length === paginatedEmployees.length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEmployees(
                          paginatedEmployees.map((emp) => emp.id),
                        );
                      } else {
                        setSelectedEmployees([]);
                      }
                    }}
                  />
                </TableHead>
              )}
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
                {sortField === "email" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role
                {sortField === "role" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("salary")}
              >
                Salary
                {sortField === "salary" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("department")}
              >
                Department
                {sortField === "department" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("hireDate")}
              >
                Hire Date
                {sortField === "hireDate" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline ml-1 h-4 w-4" />
                  ))}
              </TableHead>
              {(canEdit || canDelete) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className={
                    selectedEmployees.includes(employee.id) ? "bg-muted/50" : ""
                  }
                >
                  {canEdit && (
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => toggleRowSelection(employee.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.role === "Manager"
                          ? "secondary"
                          : employee.role === "Admin"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell>${employee.salary.toLocaleString()}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  {(canEdit || canDelete) && (
                    <TableCell className="text-right space-x-2">
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(employee)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={canEdit || canDelete ? 9 : 8}
                  className="text-center py-10 text-muted-foreground"
                >
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        Showing {paginatedEmployees.length} of {filteredEmployees.length}{" "}
        employees
      </div>
    </div>
  );
};

// Mock data for development
const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Fiona Reeze Herrada",
    email: "fionaherrada@gmail.com",
    role: "Developer",
    salary: 75000,
    department: "Engineering",
    hireDate: "2020-03-15",
  },
  {
    id: "EMP002",
    name: "Hana Labanon",
    email: "hanalabanon@gmail.com",
    role: "Manager",
    salary: 95000,
    department: "Engineering",
    hireDate: "2019-06-22",
  },
  {
    id: "EMP003",
    name: "Bea Colita",
    email: "beacolita@gmail.com",
    role: "Designer",
    salary: 70000,
    department: "Design",
    hireDate: "2021-01-10",
  },
  {
    id: "EMP004",
    name: "Mabelle Magbanua",
    email: "mabelle@gmail.com",
    role: "HR Specialist",
    salary: 65000,
    department: "Human Resources",
    hireDate: "2020-11-05",
  },
  {
    id: "EMP005",
    name: "Michael Wilson",
    email: "michael.w@gmail.com",
    role: "Admin",
    salary: 85000,
    department: "IT",
    hireDate: "2018-09-30",
  },
  {
    id: "EMP006",
    name: "Sarah Brown",
    email: "sarah.b@gmail.com",
    role: "Accountant",
    salary: 72000,
    department: "Finance",
    hireDate: "2019-12-15",
  },
  {
    id: "EMP007",
    name: "David Miller",
    email: "david.m@gmail.com",
    role: "Developer",
    salary: 78000,
    department: "Engineering",
    hireDate: "2020-07-22",
  },
  {
    id: "EMP008",
    name: "Jennifer Taylor",
    email: "jennifer.t@gmail.com",
    role: "Manager",
    salary: 92000,
    department: "Marketing",
    hireDate: "2018-04-18",
  },
  {
    id: "EMP009",
    name: "Thomas Anderson",
    email: "thomas.a@gmail.com",
    role: "Developer",
    salary: 76000,
    department: "Engineering",
    hireDate: "2021-03-01",
  },
  {
    id: "EMP010",
    name: "Lisa White",
    email: "lisa.w@gmail.com",
    role: "Designer",
    salary: 71000,
    department: "Design",
    hireDate: "2020-05-12",
  },
  {
    id: "EMP011",
    name: "James Martin",
    email: "james.m@gmail.com",
    role: "Sales Rep",
    salary: 68000,
    department: "Sales",
    hireDate: "2019-08-24",
  },
  {
    id: "EMP012",
    name: "Patricia Clark",
    email: "patricia.c@gmail.com",
    role: "HR Manager",
    salary: 88000,
    department: "Human Resources",
    hireDate: "2018-11-15",
  },
];

export default EmployeeTable;
