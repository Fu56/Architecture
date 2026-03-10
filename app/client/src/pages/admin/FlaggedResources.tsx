import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Flag } from "../../models";
import { useSession } from "../../lib/auth-client";

const FlaggedResources = () => {
  const { data: session } = useSession();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = session?.user as any;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isAuthorized = role === "DepartmentHead";

  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err) {
      console.error("Failed to resolve flag:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Flagged Resources</h2>
      <div className="space-y-4">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className="p-4 border rounded-lg bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{flag.resource.title}</h3>
              <p className="text-sm text-gray-600">Reason: {flag.reason}</p>
            </div>
            {isAuthorized && (
              <button
                onClick={() => handleResolve(flag.id)}
                className="px-3 py-1 bg-primary/80 text-white rounded hover:bg-primary"
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
