import { useState } from "react";
import { api } from "../../lib/api";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";

interface StudentRow {
  first_name: string;
  last_name: string;
  email: string;
  university_id?: string;
  batch?: number;
  year?: number;
  semester?: number;
  password?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  students: StudentRow[];
}

interface RegistrationResult {
  email: string;
  password?: string;
  status: string;
  error?: string;
}

const RegisterStudents = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    results?: RegistrationResult[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview([]);
      setValidationResult(null);
      setUploadResult(null);
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = async (file: File) => {
    setLoading(true);
    try {
      // Using FileReader to read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (typeof data === "string") {
          // Parse CSV (simplified version)
          const lines = data.split("\n");
          // Skip header row (first line)

          const students: StudentRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(",").map((v) => v.trim());
              students.push({
                first_name: values[0] || "",
                last_name: values[1] || "",
                email: values[2] || "",
                university_id: values[3] || undefined,
                batch: values[4] ? parseInt(values[4]) : undefined,
                year: values[5] ? parseInt(values[5]) : undefined,
                semester: values[6] ? parseInt(values[6]) : undefined,
                password: values[7] || undefined,
              });
            }
          }

          setPreview(students);
          validateStudents(students);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error parsing file:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateStudents = (students: StudentRow[]) => {
    const errors: string[] = [];
    const validStudents: StudentRow[] = [];

    students.forEach((student, index) => {
      const rowErrors: string[] = [];

      if (!student.first_name)
        rowErrors.push(`Row ${index + 2}: Missing first name`);
      if (!student.last_name)
        rowErrors.push(`Row ${index + 2}: Missing last name`);
      if (!student.email) rowErrors.push(`Row ${index + 2}: Missing email`);
      if (student.email && !student.email.includes("@")) {
        rowErrors.push(`Row ${index + 2}: Invalid email format`);
      }

      if (rowErrors.length === 0) {
        validStudents.push(student);
      } else {
        errors.push(...rowErrors);
      }
    });

    setValidationResult({
      valid: errors.length === 0,
      errors,
      students: validStudents,
    });
  };

  const handleUpload = async () => {
    if (!validationResult?.students.length) return;

    setLoading(true);
    try {
      const response = await api.post("/admin/users/bulk-register", {
        students: validationResult.students,
        role: "Student",
      });

      setUploadResult({
        success: response.data.success || 0,
        failed: response.data.failed || 0,
        results: response.data.results, // Store the credentials results
      });

      // Clear form after successful upload
      if (response.data.success > 0) {
        toast.success(
          `Registered ${response.data.success} students successfully`
        );
        setFile(null);
        setPreview([]);
        setValidationResult(null);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message ||
          "Protocol Error: Student registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadCredentials = () => {
    if (!uploadResult?.results) return;

    const headers = "Email,Password,Status,Error\n";
    const csvContent = uploadResult.results
      .map(
        (r: {
          email: string;
          password?: string;
          status: string;
          error?: string;
        }) => `${r.email},${r.password || "N/A"},${r.status},${r.error || ""}`
      )
      .join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_credentials.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const template =
      "first_name,last_name,email,university_id,batch,year,semester,password\nJohn,Doe,john.doe@example.com,U12345,2024,1,1,pass123\nJane,Smith,jane.smith@example.com,U67890,2024,1,1,securepass";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_registration_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Register Students (Bulk)
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Upload an Excel/CSV file to register multiple students at once
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
        <div className="text-center">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <Upload className="h-4 w-4" />
                Choose File
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            CSV, XLS, or XLSX up to 10MB
          </p>
        </div>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div
          className={`p-4 rounded-lg ${
            validationResult.valid
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            {validationResult.valid ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="ml-3 flex-1">
              <h3
                className={`text-sm font-medium ${
                  validationResult.valid ? "text-green-800" : "text-red-800"
                }`}
              >
                {validationResult.valid
                  ? "Validation Passed"
                  : "Validation Failed"}
              </h3>
              <div className="mt-2 text-sm">
                <p
                  className={
                    validationResult.valid ? "text-green-700" : "text-red-700"
                  }
                >
                  {validationResult.students.length} valid student(s) found
                </p>
                {validationResult.errors.length > 0 && (
                  <ul className="mt-2 list-disc list-inside space-y-1 text-red-700">
                    {validationResult.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">
              Preview ({preview.length} students)
            </h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((student, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.first_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.university_id || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.batch || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.year || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.semester || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.password ? "******" : "Auto-generated"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {validationResult?.valid && validationResult.students.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Register {validationResult.students.length} Student(s)
              </>
            )}
          </button>
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div
          className={`rounded-lg p-4 border ${
            uploadResult.success > 0
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle
                className={`h-5 w-5 ${
                  uploadResult.success > 0 ? "text-green-600" : "text-gray-400"
                }`}
              />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Registration Complete
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Successfully registered {uploadResult.success} student(s).
                  {uploadResult.failed > 0 && ` ${uploadResult.failed} failed.`}
                </p>
              </div>
            </div>

            {uploadResult.success > 0 && (
              <button
                onClick={downloadCredentials}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                Download Credentials
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterStudents;
