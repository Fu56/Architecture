import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Assignment } from "../../models";
import { Loader2, FileText, User, ChevronRight, Plus } from "lucide-react";
import { currentRole } from "../../lib/auth";

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const role = currentRole();

  const isBaseAdmin = location.pathname.startsWith("/admin");
  const basePath = isBaseAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await api.get("/assignments");
        setAssignments(data);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#DF8142]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#5A270F] tracking-tight">
            Assignment Sharing
          </h1>
          <p className="text-[#92664A] mt-2 font-medium">
            Access and share architectural assignment briefs and tasks.
          </p>
        </div>
        {(role === "Admin" || role === "Faculty" || role === "SuperAdmin") && (
          <Link
            to={`${basePath}/assignments/new`}
            className="flex items-center gap-2 bg-[#5A270F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6C3B1C] transition-all shadow-lg shadow-[#5A270F]/20"
          >
            <Plus className="h-5 w-5" />
            Post Assignment
          </Link>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#EEB38C]/40 rounded-[2rem] py-20 text-center">
          <FileText className="h-16 w-16 text-[#EEB38C]/60 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#5A270F]">
            No assignments posted yet
          </h3>
          <p className="text-[#92664A] mt-2">
            Check back later for new academic tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment: Assignment) => (
            <Link
              key={assignment.id}
              to={`${basePath}/assignments/${assignment.id}`}
              className="bg-white p-6 rounded-[2rem] border border-[#EEB38C]/30 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#DF8142]/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-[#DF8142]/10 text-[#DF8142] rounded-2xl group-hover:bg-[#DF8142] group-hover:text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                {assignment.due_date && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#EEB38C]/20 text-[#6C3B1C] px-3 py-1 rounded-full border border-[#EEB38C]/40">
                    Due:{" "}
                    {new Date(assignment.due_date).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-[#5A270F] mb-2 group-hover:text-[#DF8142] transition-colors line-clamp-2 relative z-10">
                {assignment.title}
              </h2>
              <p className="text-[#92664A] text-sm line-clamp-3 mb-6 font-medium leading-relaxed relative z-10">
                {assignment.description || "No description provided."}
              </p>
              <div className="pt-6 border-t border-[#EFEDED] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#EFEDED] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#92664A]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#92664A]/60 uppercase tracking-widest leading-none">
                      Instructor
                    </p>
                    <p className="text-xs font-bold text-[#6C3B1C]">
                      {assignment.creator.first_name}{" "}
                      {assignment.creator.last_name}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[#92664A]/40 group-hover:text-[#DF8142] transition-colors group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;
