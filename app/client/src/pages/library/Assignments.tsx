import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Assignment } from "../../models";
import {
  FileText,
  ChevronRight,
  Plus,
  Bell,
  Calendar,
  Layers,
  Zap,
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-3xl border-4 border-[#EEB38C]/20" />
          <div className="absolute inset-0 rounded-3xl border-4 border-t-[#DF8142] animate-spin shadow-[0_0_20px_rgba(223,129,66,0.3)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="h-8 w-8 text-[#DF8142] opacity-40" />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#5A270F] dark:text-[#EEB38C] animate-pulse">
          Synchronizing_Brief_Repository
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] px-4 sm:px-8 py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* ── Header Segment ─────────────────────────────── */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#EEB38C]/10 to-transparent rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b-2 border-[#92664A]/10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-1.5 w-12 bg-[#DF8142] rounded-full shadow-[0_0_10px_rgba(223,129,66,0.4)]" />
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#92664A] dark:text-[#EEB38C]/40">
                ARCHITECT_BRIEF_CATALOG // 0x4B
              </p>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#5A270F] dark:text-white tracking-tighter uppercase leading-none italic font-space-grotesk">
                ASSIGNMENT <br /> <span className="text-[#DF8142] uppercase not-italic">PORTFOLIO.</span>
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.6em] text-[#6C3B1C] dark:text-[#EEB38C]/30 italic pl-1">
                ACCESS_AND_SHARE_ARCHITECTURAL_DATA_SHARDS
              </p>
            </div>
          </div>

          {(role === "Admin" || role === "Faculty" || role === "SuperAdmin") && (
            <Link
              to={`${basePath}/assignments/new`}
              className="group relative inline-flex items-center gap-4 bg-[#5A270F] p-1.5 pr-8 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-[#5A270F]/30"
            >
              <div className="h-12 w-12 rounded-xl bg-[#DF8142] flex items-center justify-center text-white shadow-lg group-hover:rotate-90 transition-transform duration-500">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                Post New Brief
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#DF8142]/0 via-white/10 to-[#DF8142]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Brief List / Matrix ────────────────────────── */}
      {assignments.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-[#1A0B04] rounded-[3rem] border-2 border-dashed border-[#92664A]/20 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 architectural-dot-grid dark:architectural-dot-grid-dark opacity-10" />
          <div className="relative z-10">
            <div className="h-24 w-24 mx-auto mb-8 rounded-[2rem] bg-[#EEB38C]/10 dark:bg-black/20 border-2 border-[#DF8142]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <FileText className="h-10 w-10 text-[#DF8142] animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic mb-3">
              No Data Shards Detected
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#92664A] dark:text-[#EEB38C]/30">
              The assignment repository is currently offline for your sector.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assignments.map((assignment: Assignment, idx: number) => (
            <Link
              key={assignment.id}
              to={`${basePath}/assignments/${assignment.id}`}
              className="group relative flex flex-col min-h-[420px] bg-white dark:bg-[#1A0B04] rounded-[2.5rem] border-2 border-[#92664A]/10 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#DF8142]/40 hover:shadow-[0_30px_60px_-15px_rgba(90,39,15,0.15)] animate-in fade-in slide-in-from-bottom-6 duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Card visual elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#DF8142]/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute bottom-4 left-4 text-[60px] font-black text-[#5A270F]/2 dark:text-white/2 select-none pointer-events-none uppercase italic group-hover:text-[#DF8142]/5 transition-colors">
                BRIEF_{assignment.id.toString().padStart(3, '0')}
              </div>

              {/* Status Header */}
              <div className="p-8 pb-4 flex items-start justify-between relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-[#5A270F] flex items-center justify-center text-[#EEB38C] shadow-2xl shadow-[#5A270F]/30 group-hover:bg-[#DF8142] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                  <FileText className="h-6 w-6" />
                </div>
                {assignment.due_date && (
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#92664A] dark:text-[#EEB38C]/40">Deadline</p>
                    <div className="flex items-center gap-2 bg-[#EEB38C]/10 dark:bg-white/5 px-4 py-2 rounded-xl border border-[#92664A]/20 shadow-sm transition-all group-hover:border-[#DF8142]/30">
                      <Calendar className="h-3.5 w-3.5 text-[#DF8142]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white">
                        {new Date(assignment.due_date).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="px-8 pb-8 flex-1 space-y-4 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#5A270F] dark:text-white transition-colors group-hover:text-[#DF8142] leading-tight uppercase tracking-tighter line-clamp-2 italic font-space-grotesk">
                    {assignment.title}
                  </h2>
                  <div className="h-1 w-12 bg-[#DF8142]/30 group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
                <p className="text-[#5A270F]/60 dark:text-[#EEB38C]/50 text-xs font-medium leading-relaxed line-clamp-4">
                  {assignment.description || "No description provided for this academic protocol."}
                </p>
              </div>

              {/* Footer Attribution */}
              <div className="mt-auto px-8 py-6 bg-[#EEB38C]/5 dark:bg-black/20 border-t border-[#92664A]/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-[#DF8142] flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                      {assignment.creator.first_name?.[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#5A270F] border-2 border-white dark:border-[#1A0B04] flex items-center justify-center">
                      <Zap className="h-2 w-2 text-[#DF8142]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] leading-none mb-1">
                      Instructor_Node
                    </p>
                    <p className="text-[11px] font-black text-[#5A270F] dark:text-white uppercase tracking-wider">
                      {assignment.creator.first_name}{" "}
                      {assignment.creator.last_name}
                    </p>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#6C3B1C] shadow-md border border-[#92664A]/20 flex items-center justify-center text-[#92664A] dark:text-[#EEB38C] group-hover:bg-[#DF8142] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Status Feed ────────────────────────────────── */}
      {assignments.length > 0 && (
        <div className="sticky bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50 px-4">
          <div className="bg-[#5A270F]/90 backdrop-blur-xl px-10 py-5 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto flex items-center gap-6 animate-in slide-in-from-bottom-10 duration-1000">
            <div className="h-10 w-10 rounded-full bg-[#DF8142]/20 flex items-center justify-center border border-[#DF8142]/30">
              <Bell className="h-5 w-5 text-[#DF8142] animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#EEB38C]">
                SYNC_STATUS // OK
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#DF8142]">
                {assignments.length} ACTIVE_BRIEFS_IN_MEMORY
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;

