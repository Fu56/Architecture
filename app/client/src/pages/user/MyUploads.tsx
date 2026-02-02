import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import ResourceCard from "../../components/ui/ResourceCard";
import { Loader2, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const MyUploads = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyUploads = async () => {
      setLoading(true);
      try {
        // This endpoint should be protected and return resources for the logged-in user
        const { data } = await api.get("/user/resources");
        if (Array.isArray(data)) {
          setResources(data);
        }
      } catch (err) {
        console.error("Failed to fetch user uploads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyUploads();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-800">
            No Uploads Yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't uploaded any resources.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              Upload Your First Resource
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUploads;
