import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader2, UploadCloud, X, PlusCircle, Save } from "lucide-react";
import { toast } from "react-toastify";

const PostBlog = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    published: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Intellectual Property Validation
    if (!formData.title.trim()) {
      toast.warn("Transmission Aborted: Compelling story title required.");
      return;
    }

    if (!formData.content.trim()) {
      toast.warn("Transmission Aborted: Narrative content body missing.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("tags", formData.tags);
    data.append("published", String(formData.published));
    if (image) {
      data.append("image", image);
    }

    try {
      await api.post("/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Blog post created successfully!");
      navigate("/blog");
    } catch (err) {
      console.error("Failed to create blog:", err);
      toast.error("Failed to create blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-[#5A270F] mb-2">
          Create New Story
        </h1>
        <p className="text-[#5A270F]">
          Share your architectural insights and news with the community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D9D9C2] space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling title..."
                  className="w-full px-6 py-4 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/90 text-lg font-bold text-[#5A270F]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your story here (Markdown supported)..."
                  rows={15}
                  className="w-full px-6 py-4 bg-[#EFEDED] border border-[#D9D9C2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/90 text-[#6C3B1C] leading-relaxed font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right: Sidebar Metadata */}
          <div className="space-y-8">
            {/* Image Upload */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D9D9C2] space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-500">
                Featured Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center ${
                  imagePreview
                    ? "border-primary/90"
                    : "border-[#D9D9C2] hover:border-primary/80 bg-[#EFEDED]"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      title="Remove Image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-[#5A270F]/50 text-white rounded-full hover:bg-[#5A270F] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#5A270F]">
                      Click to upload image
                    </p>
                  </div>
                )}
                <input
                  id="featured-image"
                  type="file"
                  title="Featured Image"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Tags & Settings */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#D9D9C2] space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2..."
                    className="w-full pl-12 pr-4 py-3 bg-[#EFEDED] border border-[#D9D9C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/90 font-bold text-[#5A270F]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  id="published"
                  className="h-5 w-5 text-primary focus:ring-primary/90 border-slate-300 rounded"
                />
                <label
                  htmlFor="published"
                  className="font-bold text-[#2A1205] cursor-pointer select-none"
                >
                  Publish Immediately
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black tracking-tight shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Story
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostBlog;
