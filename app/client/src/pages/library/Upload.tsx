import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { UploadCloud, Loader2 } from "lucide-react";
import type { DesignStage } from "../../models";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    keywords: "",
    design_stage_id: "",
    forYearStudents: "",
    batch: "",
  });
  const [designStages, setDesignStages] = useState<DesignStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isReady] = useState(() => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("user");
  });

  useEffect(() => {
    if (!isReady) {
      navigate("/login", { replace: true, state: { from: "/upload" } });
    }
  }, [isReady, navigate]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data } = await api.get("/common/design-stages");
        setDesignStages(data);
      } catch {
        console.error("Failed to fetch design stages");
      }
    };
    fetchStages();
  }, []);

  if (!isReady) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", metadata.title);
    formData.append("author", metadata.author);
    formData.append("keywords", metadata.keywords);
    formData.append("design_stage_id", metadata.design_stage_id);
    formData.append("forYearStudents", metadata.forYearStudents);
    if (metadata.batch) formData.append("batch", metadata.batch);

    try {
      const { data } = await api.post("/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/resources/${data.id}`);
    } catch (err: unknown) {
      const errorMessage = (
        err as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      setError(
        errorMessage || "Upload failed. Please check your data and try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Upload Resource
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Share your knowledge with the community.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Input */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">
                1. Select File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  {file ? (
                    <p className="text-sm text-gray-800 font-medium">
                      {file.name}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, PPTX, DWG, RVT, SKP, ZIP, JPG, PNG, MP4, TXT up
                      to 5GB
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata Input */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-4">
                2. Add Details
              </label>
              <div className="space-y-6">
                <input
                  name="title"
                  placeholder="Resource Title"
                  value={metadata.title}
                  onChange={handleMetaChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="author"
                  placeholder="Author(s)"
                  value={metadata.author}
                  onChange={handleMetaChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="keywords"
                  placeholder="Keywords (comma-separated)"
                  value={metadata.keywords}
                  onChange={handleMetaChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    name="design_stage_id"
                    value={metadata.design_stage_id}
                    onChange={handleMetaChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>
                      Select Design Stage
                    </option>
                    {designStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="forYearStudents"
                    placeholder="For Year Students (e.g. 1-5)"
                    value={metadata.forYearStudents}
                    onChange={handleMetaChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    name="batch"
                    placeholder="Batch Year (Optional)"
                    value={metadata.batch}
                    onChange={handleMetaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center border border-red-200 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting for
                    Approval...
                  </>
                ) : (
                  "Submit Resource"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
