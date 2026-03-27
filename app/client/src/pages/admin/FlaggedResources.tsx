import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Flag } from "../../models";
import { useSession } from "../../lib/auth-client";
import { useNavigate } from "react-router-dom";
import { toast } from "../../lib/toast";

const FlaggedResources = () => {
  const { data: session } = useSession();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = session?.user as any;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isAuthorized = role === "DepartmentHead";

  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlags = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/admin/flags");
        if (data && Array.isArray(data.flags)) {
          setFlags(data.flags);
        } else if (Array.isArray(data)) {
          setFlags(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch flagged resources.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlags();
  }, []);

  const handleResolve = async (id: number) => {
    try {
      await api.patch(`/admin/flags/${id}/resolve`);
      setFlags(flags.filter((f) => f.id !== id));
      toast.success("Security violation cleared. Synchronizing registry.");
      navigate("/admin/browse");
    } catch (err) {
      console.error("Failed to resolve flag:", err);
      toast.error("Protocol Error: Resolution transmission failed.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter uppercase italic">
        Flagged <span className="not-italic text-[#DF8142]">Resources</span>
      </h2>
      <div className="space-y-3">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className="p-4 border border-[#D9D9C2] dark:border-[#DF8142]/20 rounded-xl bg-white dark:bg-[#1A0B04] flex justify-between items-center shadow-sm"
          >
            <div>
              <h3 className="font-black text-sm text-[#5A270F] dark:text-[#EEB38C] tracking-tight uppercase italic">{flag.resource.title}</h3>
              <p className="text-[10px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-widest mt-1">Reason: {flag.reason}</p>
            </div>
            {isAuthorized && (
              <button
                onClick={() => handleResolve(flag.id)}
                className="px-4 py-1.5 bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-[0.1em] rounded-lg hover:bg-[#2A1205] transition-all active:scale-95 shadow-md"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlaggedResources;
