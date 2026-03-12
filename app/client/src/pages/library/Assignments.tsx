import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Assignment } from "../../models";
import {
  FileText,
  User,
  ChevronRight,
  Plus,
  Bell,
  Calendar,
} from "lucide-react";
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

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#EEB38C] opacity-20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#DF8142] animate-spin" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]">
          Loading Assignments...
        </p>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0 py-6 space-y-8 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 bg-[#DF8142] rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F] dark:text-[#EEB38C]/60">
              Architect Interface
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter italic uppercase leading-none">
            Assignments
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6C3B1C] dark:text-[#EEB38C]">
            Access and share architectural assignment briefs
          </p>
        </div>

        {(role === "Admin" || role === "Faculty" || role === "SuperAdmin") && (
          <Link
            to={`${basePath}/assignments/new`}
            className="self-start sm:self-auto flex items-center gap-2 bg-[#5A270F] text-white px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#6C3B1C] transition-all duration-300 shadow-xl shadow-[#5A270F]/25 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Post Assignment
          </Link>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="h-0.5 rounded-full bg-[#DF8142] opacity-30" />

      {/* ── List / Empty ── */}
      {assignments.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-[#1A0B04] rounded-3xl border-2 border-dashed border-[#92664A]/30 dark:border-white/10 shadow-sm">
          <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-[#EEB38C]/20 dark:bg-[#1A0B04] border-2 border-[#92664A]/30 dark:border-white/10 flex items-center justify-center">
            <FileText className="h-9 w-9 text-[#DF8142]" />
          </div>
          <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] italic uppercase mb-2">
            No Assignments Yet
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6C3B1C] dark:text-[#EEB38C]">
            Check back later for new academic tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {assignments.map((assignment: Assignment) => (
            <Link
              key={assignment.id}
              to={`${basePath}/assignments/${assignment.id}`}
              className="group bg-white dark:bg-[#1A0B04] p-6 sm:p-7 rounded-3xl border-2 border-[#92664A]/30 dark:border-white/10 shadow-md hover:shadow-xl hover:shadow-[#5A270F]/10 hover:-translate-y-1 hover:border-[#DF8142]/50 transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              {/* Accent glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#DF8142]/8 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Top row: icon + due date */}
              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] shadow-lg group-hover:bg-[#DF8142] group-hover:text-white transition-colors duration-300">
                  <FileText className="h-5 w-5" />
                </div>
                {assignment.due_date && (
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-[#EEB38C]/20 text-[#5A270F] dark:text-[#EEB38C] px-3 py-1.5 rounded-full border border-[#92664A]/20">
                    <Calendar className="h-3 w-3 text-[#DF8142]" />
                    {new Date(assignment.due_date).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-black text-[#5A270F] dark:text-[#EEB38C] mb-2 group-hover:text-[#DF8142] transition-colors uppercase tracking-tighter line-clamp-2 relative z-10">
                {assignment.title}
              </h2>

              {/* Description */}
              <p className="text-[#5A270F] dark:text-[#EEB38C] text-xs line-clamp-3 mb-5 font-medium leading-relaxed relative z-10 flex-1">
                {assignment.description || "No description provided."}
              </p>

              {/* Footer */}
              <div className="pt-4 border-t-2 border-[#92664A]/20 dark:border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#EEB38C]/20 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-[#5A270F] dark:text-[#EEB38C]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C] uppercase tracking-[0.2em] leading-none mb-0.5">
                      Instructor
                    </p>
                    <p className="text-[11px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase italic">
                      {assignment.creator.first_name}{" "}
                      {assignment.creator.last_name}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[#92664A] dark:text-[#EEB38C] group-hover:text-[#DF8142] group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stats bar if has assignments */}
      {assignments.length > 0 && (
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] pt-2">
          <Bell className="h-3.5 w-3.5 text-[#DF8142]" />
          {assignments.length} Assignment{assignments.length !== 1 ? "s" : ""} available
        </div>
      )}
    </div>
  );
};

export default Assignments;
