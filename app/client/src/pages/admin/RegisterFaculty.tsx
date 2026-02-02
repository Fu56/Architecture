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
import { toast } from "../../lib/toast";
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warn("Protocol Breach: Invalid email syntax detected.");
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
          "Protocol Error: Faculty registration failed",
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-[#EEB38C]/30 shadow-md">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 bg-[#EEB38C]/20 rounded-xl flex items-center justify-center text-[#DF8142]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#5A270F]">
              Faculty Registration
            </h2>
            <p className="text-[#6C3B1C] text-sm">
              Create new faculty credentials and assign permissions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-7">
          <Card className="shadow-2xl shadow-[#5A270F]/5 border-[#EEB38C]/30 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-[#EFEDED]/50 border-b border-[#EEB38C]/20 p-8">
              <CardTitle className="text-[#5A270F]">Core Identity</CardTitle>
              <CardDescription className="text-[#92664A]">
                Enter the personal and system details for the new faculty
                member.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1"
                    >
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Julian"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-[#D9D9C2] focus:border-[#DF8142] focus:ring-[#DF8142]/10 bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Wright"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="rounded-xl border-[#D9D9C2] focus:border-[#DF8142] focus:ring-[#DF8142]/10 bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1"
                  >
                    System Email
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-[#92664A]" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="faculty@studio-nexus.edu"
                      className="pl-9 rounded-xl border-[#D9D9C2] focus:border-[#DF8142] focus:ring-[#DF8142]/10 bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1"
                  >
                    Authorization Key
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-[#92664A]" />
                      <Input
                        id="password"
                        name="password"
                        type="text"
                        placeholder="Secure credential"
                        className="pl-9 font-mono rounded-xl border-[#D9D9C2] focus:border-[#DF8142] focus:ring-[#DF8142]/10 bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePassword}
                      className="rounded-xl border-[#D9D9C2] text-[#6C3B1C] hover:bg-[#EEB38C]/10 transition-all font-bold"
                    >
                      <Zap className="h-4 w-4 mr-2 text-[#DF8142]" />
                      Auto
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#EEB38C]/20">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-[#EEB38C]/10 rounded-lg">
                      <GraduationCap className="h-4 w-4 text-[#DF8142]" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#5A270F]">
                      Academic Profile
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1"
                      >
                        Department
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-[#92664A]" />
                        <Input
                          id="department"
                          name="department"
                          placeholder="e.g. Parametric Architecture"
                          className="pl-9 rounded-xl border-[#D9D9C2] focus:border-[#DF8142] focus:ring-[#DF8142]/10 bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                          value={formData.department}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="specialization"
                        className="text-[#92664A] font-bold uppercase tracking-widest text-[10px] ml-1"
                      >
                        Specialization
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-[#92664A]" />
                        <Input
                          id="specialization"
                          name="specialization"
                          placeholder="e.g. Kinetic Structures"
                          className="pl-9 rounded-xl border-[#D9D9C2] focus:border-[#DF8142] focus:ring-[#DF8142]/10 bg-[#EFEDED]/30 text-[#5A270F] font-bold"
                          value={formData.specialization}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#5A270F] hover:bg-[#6C3B1C] text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#5A270F]/20 transition-all hover:-translate-y-1 active:scale-95"
                  disabled={loading}
                >
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
          <Card className="bg-[#5A270F] text-white border-[#EEB38C]/20 shadow-2xl rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 opacity-20 blur-3xl bg-[#DF8142] rounded-full pointer-events-none" />
            <CardHeader className="p-10 pb-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Award className="h-6 w-6 text-[#DF8142]" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#EEB38C]">
                    Access Level
                  </p>
                  <p className="text-2xl font-black tracking-tighter text-white">
                    FACULTY
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-10 space-y-8 relative z-10">
              <div className="text-center space-y-4">
                <div className="h-32 w-32 bg-gradient-to-br from-[#DF8142] via-[#6C3B1C] to-[#5A270F] mx-auto rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-[#5A270F] relative group overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {formData.first_name?.[0] || formData.last_name?.[0] || "?"}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight uppercase">
                    {formData.first_name || "Faculty"}{" "}
                    {formData.last_name || "Member"}
                  </h3>
                  <p className="text-[10px] text-[#EEB38C]/40 font-black uppercase tracking-[0.2em]">
                    {formData.email || "ID: PENDING"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 group transition-all hover:bg-white/10">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#EEB38C]/60 font-black mb-1">
                    Department
                  </p>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">
                    {formData.department || "N/A"}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 group transition-all hover:bg-white/10">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#EEB38C]/60 font-black mb-1">
                    Specialization
                  </p>
                  <p className="text-sm font-bold text-[#EEB38C] uppercase tracking-wider">
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

          <Card className="mt-8 bg-[#EEB38C]/10 border-[#EEB38C]/20 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#DF8142]" />
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#DF8142]/10 rounded-xl text-[#DF8142]">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#5A270F] uppercase tracking-tight">
                    Privileged Access
                  </h4>
                  <p className="text-xs text-[#92664A] font-bold leading-relaxed mt-1">
                    Faculty nodes handle assignment creation and resource
                    validation within the system matrix.
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
