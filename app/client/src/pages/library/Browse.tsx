import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";
import Filters, { type FilterState } from "../../components/ui/Filters";
import ResourceCard from "../../components/ui/ResourceCard";
import type { Resource } from "../../models";
import { Loader2, ServerCrash } from "lucide-react";

const Browse = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async (filters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.append("q", filters.q);
      if (filters.fileType) params.append("fileType", filters.fileType);
      if (filters.stage) params.append("stage", filters.stage);
      if (filters.year) params.append("year", filters.year);
      if (filters.semester) params.append("semester", filters.semester);
      if (filters.sort) params.append("sort", filters.sort);

      const { data } = await api.get(`/resources?${params.toString()}`);

      if (Array.isArray(data)) {
        setResources(data);
      } else {
        setResources([]);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError(
        "An error occurred while loading resources. Please try again later."
      );
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load with no filters
    fetchResources({});
  }, [fetchResources]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Explore Resources
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Find the materials you need for your next project.
        </p>
      </div>

      <Filters onFilterChange={fetchResources} />

      <div className="mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg font-medium text-gray-600">
              Loading Resources...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-red-50 rounded-lg">
            <ServerCrash className="h-12 w-12 text-red-500" />
            <p className="mt-4 text-lg font-medium text-red-700">{error}</p>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
            <h3 className="text-xl font-medium text-gray-800">
              No Resources Found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
