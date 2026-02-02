import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader2, UploadCloud, X, PlusCircle, Save } from "lucide-react";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  interface UserWithRole {
    role?: {
      name: string;
    };
  }

  const { data: session } = useSession();
  const user = session?.user as unknown as UserWithRole;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    if (!session) {
      toast.error("Session expired. Please log in again.");
      // Optional state save here?
      return;
    }

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
      if (user?.role?.name === "Admin" || user?.role?.name === "SuperAdmin") {
        navigate("/admin/blog"); // Or wherever the admin list is
      } else {
        navigate("/blog");
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      console.error("Failed to create blog:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired or unauthorized. Please log in.");
      } else if (error.response?.status === 403) {
        toast.error("Permission denied. You do not have rights to post blogs.");
      } else {
        toast.error("Failed to create blog post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#5A270F] tracking-tight">
          Create New Story
        </h1>
        <p className="text-lg text-[#6C3B1C] max-w-2xl mx-auto font-medium">
          Share your architectural insights, news, and narratives with the
          community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="premium-card p-8 space-y-8 bg-white/50 backdrop-blur-sm border border-[#92664A]/20 shadow-xl shadow-[#5A270F]/5">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#92664A]">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling title..."
                  className="w-full px-6 py-4 bg-[#f8f5f2] border border-[#d9d9c2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#DF8142]/30 focus:border-[#DF8142] transition-all text-xl font-display font-bold text-[#5A270F] placeholder:text-[#92664A]/40"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#92664A]">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your story here (Markdown supported)..."
                  rows={18}
                  className="w-full px-6 py-4 bg-[#f8f5f2] border border-[#d9d9c2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#DF8142]/30 focus:border-[#DF8142] transition-all text-base leading-relaxed text-[#6C3B1C] placeholder:text-[#92664A]/40 resize-none font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right: Sidebar Metadata */}
          <div className="space-y-8">
            {/* Image Upload */}
            <div className="premium-card p-6 space-y-4 border border-[#92664A]/20">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#92664A]">
                Featured Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group relative aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center ${
                  imagePreview
                    ? "border-[#DF8142]/50 bg-[#DF8142]/5"
                    : "border-[#d9d9c2] hover:border-[#DF8142]/60 hover:bg-[#DF8142]/5 bg-[#f8f5f2]"
                }`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#5A270F]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium text-sm bg-[#5A270F]/80 px-4 py-2 rounded-full backdrop-blur-md">
                        Change Image
                      </p>
                    </div>
                    <button
                      type="button"
                      title="Remove Image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 text-[#d32f2f] rounded-full hover:bg-white transition-all shadow-md transform hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#DF8142]/10 flex items-center justify-center mx-auto text-[#DF8142] group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#5A270F]">
                        Click to upload
                      </p>
                      <p className="text-xs text-[#92664A]">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
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
            <div className="premium-card p-6 space-y-6 border border-[#92664A]/20">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#92664A]">
                  Tags
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#DF8142]/10 flex items-center justify-center text-[#DF8142] group-focus-within:bg-[#DF8142] group-focus-within:text-white transition-colors duration-300">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="architecture, design, news..."
                    className="w-full pl-14 pr-4 py-3.5 bg-[#f8f5f2] border border-[#d9d9c2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DF8142]/30 focus:border-[#DF8142] transition-all font-medium text-[#5A270F] placeholder:text-[#92664A]/40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#f8f5f2] rounded-xl border border-[#d9d9c2] transition-colors hover:border-[#DF8142]/30">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    id="published"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#92664A]/40 bg-white transition-all checked:border-[#DF8142] checked:bg-[#DF8142] hover:border-[#DF8142] focus:outline-none focus:ring-2 focus:ring-[#DF8142]/20"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <label
                  htmlFor="published"
                  className="font-bold text-sm text-[#5A270F] cursor-pointer select-none flex-1"
                >
                  Publish Immediately
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#DF8142] text-white rounded-xl font-bold tracking-wide shadow-lg shadow-[#DF8142]/25 hover:shadow-[#DF8142]/40 hover:bg-[#c9743a] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
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
