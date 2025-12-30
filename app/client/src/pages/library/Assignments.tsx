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
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Assignment Sharing
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Access and share architectural assignment briefs and tasks.
          </p>
        </div>
        {(role === "Admin" || role === "Faculty" || role === "SuperAdmin") && (
          <Link
            to={`${basePath}/assignments/new`}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="h-5 w-5" />
            Post Assignment
          </Link>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] py-20 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">
            No assignments posted yet
          </h3>
          <p className="text-gray-500 mt-2">
            Check back later for new academic tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment: Assignment) => (
            <Link
              key={assignment.id}
              to={`${basePath}/assignments/${assignment.id}`}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                {assignment.due_date && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">
                    Due:{" "}
                    {new Date(assignment.due_date).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {assignment.title}
              </h2>
              <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                {assignment.description || "No description provided."}
              </p>
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      Instructor
                    </p>
                    <p className="text-xs font-bold text-gray-700">
                      {assignment.creator.first_name}{" "}
                      {assignment.creator.last_name}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;
