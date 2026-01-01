import { useState } from "react";
import { api } from "../../lib/api";
import {
  UserPlus,
  Loader2,
  Shield,
  Key,
  Briefcase,
  Award,
  Zap,
  Building2,
  AtSign,
  GraduationCap,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FacultyFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  department?: string;
  specialization?: string;
}

const RegisterFaculty = () => {
  const [formData, setFormData] = useState<FacultyFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      toast.warning("Missing required identity protocols.");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.warning("Invalid credential syntax.");
      return;
    }

    if (formData.password.length < 6) {
      toast.warning("Security breach: Password insufficient length.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/admin/users/register-faculty", {
        ...formData,
        role: "Faculty",
      });
      toast.success("Faculty Node initialized successfully.");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        department: "",
        specialization: "",
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message ||
          "Protocol Error: Faculty registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-xl border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Faculty Registration
            </h2>
            <p className="text-muted-foreground text-sm">
              Create new faculty credentials and assign permissions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-7">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Core Identity</CardTitle>
              <CardDescription>
                Enter the personal and system details for the new faculty
                member.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Julian"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Wright"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">System Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="faculty@studio-nexus.edu"
                      className="pl-9"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Authorization Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="text"
                        placeholder="Secure credential"
                        className="pl-9 font-mono"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePassword}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Auto
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Academic Profile</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="department"
                          name="department"
                          placeholder="e.g. Parametric Architecture"
                          className="pl-9"
                          value={formData.department}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="specialization"
                          name="specialization"
                          placeholder="e.g. Kinetic Structures"
                          className="pl-9"
                          value={formData.specialization}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Initialize Faculty Member
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live ID Preview */}
        <div className="lg:col-span-5 sticky top-10">
          <Card className="bg-slate-950 text-white border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-24 opacity-10 blur-3xl bg-indigo-500 rounded-full pointer-events-none" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">
                    Access Level
                  </p>
                  <p className="text-lg font-bold tracking-widest text-white">
                    FACULTY
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-slate-900">
                  {formData.first_name?.[0] || formData.last_name?.[0] || "?"}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {formData.first_name || "Faculty"}{" "}
                    {formData.last_name || "Member"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {formData.email || "ID: PENDING"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Department
                  </p>
                  <p className="text-sm font-medium text-indigo-200">
                    {formData.department || "N/A"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Specialization
                  </p>
                  <p className="text-sm font-medium text-purple-200">
                    {formData.specialization || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4 mt-2">
              <div className="flex justify-between items-center w-full opacity-50">
                <div className="h-3 w-10 bg-white/20 rounded-full" />
                <div className="text-[9px] font-mono tracking-widest">
                  SECURE::ENC
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6 bg-indigo-50/50 border-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Privileged Access
                  </h4>
                  <p className="text-xs text-indigo-700 mt-1">
                    Faculty nodes handle assignment creation and resource
                    validation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterFaculty;
