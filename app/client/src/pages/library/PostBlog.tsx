import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import {
  Loader2,
  UploadCloud,
  X,
  PlusCircle,
  Save,
  Sparkles,
} from "lucide-react";
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  interface UserWithRole {
    role?: { name: string };
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
        {message}
      </p>
    );
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
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Story title is required.";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Narrative content is required.";
    }
    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required.";
    }
    if (!image) {
      newErrors.image = "A featured cover image is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
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
        navigate("/admin/blog");
      } else {
        navigate("/blog");
      }
    } catch (err: unknown) {
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
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0F0602] transition-colors duration-500 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Page Header ── */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEB38C]/20 dark:bg-[#1A0B02] border border-[#DF8142]/30 dark:border-[#5A270F] rounded-lg text-[8px] font-black uppercase tracking-widest text-[#DF8142] mb-3">
            <Sparkles className="h-2.5 w-2.5" />
            Control Nexus
          </div>
          <h1 className="text-3xl font-black text-[#5A270F] dark:text-white uppercase tracking-tight leading-none mb-1">
            Initiate <span className="text-[#DF8142]">Blog</span>
          </h1>
          <p className="text-[9px] font-bold text-[#92664A] dark:text-[#EEB38C]/50 uppercase tracking-[0.2em]">
            Transmit Narrative to the Architectural Network
          </p>
        </div>

        {/* ── Form Assembly ── */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-5">
          {/* Main Information Panel */}
          <div className="col-span-12 md:col-span-8 space-y-5">
            <div className="bg-white dark:bg-[#1A0B02] p-5 border border-[#EEB38C]/40 dark:border-[#5A270F]/50 shadow-md rounded-2xl relative">
              <div className="space-y-4">
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#6C3B1C] dark:text-[#EEB38C]/80">
                    <span className="w-1 h-1 bg-[#DF8142] rounded-full" />
                    Transmission Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter Title..."
                    className={`w-full px-3 py-2 bg-[#FAF8F4] dark:bg-[#0F0602] border border-[#EEB38C]/50 dark:border-[#5A270F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DF8142]/20 focus:border-[#DF8142] transition-colors text-xs font-bold text-[#5A270F] dark:text-white placeholder:text-[#92664A]/50 dark:placeholder:text-[#EEB38C]/30 ${errors.title && "!border-rose-500 bg-rose-50/50 dark:bg-rose-500/10"}`}
                  />
                  <FieldError message={errors.title} />
                </div>

                {/* Content Input */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#6C3B1C] dark:text-[#EEB38C]/80">
                    <span className="w-1 h-1 bg-[#DF8142] rounded-full" />
                    Narrative Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Markdown supported..."
                    className={`w-full px-3 py-2 bg-[#FAF8F4] dark:bg-[#0F0602] border border-[#EEB38C]/50 dark:border-[#5A270F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DF8142]/20 focus:border-[#DF8142] transition-colors text-xs font-medium leading-relaxed text-[#5A270F] dark:text-[#EEB38C]/90 placeholder:text-[#92664A]/50 dark:placeholder:text-[#EEB38C]/30 min-h-[220px] custom-scrollbar ${errors.content && "!border-rose-500 bg-rose-50/50 dark:bg-rose-500/10"}`}
                  />
                  <FieldError message={errors.content} />
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Sidebar */}
          <div className="col-span-12 md:col-span-4 space-y-5 flex flex-col">
            {/* Image Upload Compact */}
            <div className="bg-white dark:bg-[#1A0B02] p-4 border border-[#EEB38C]/40 dark:border-[#5A270F]/50 shadow-md rounded-2xl">
              <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#6C3B1C] dark:text-[#EEB38C]/80 mb-2">
                <span className="w-1 h-1 bg-[#DF8142] rounded-full" />
                Featured Hero
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group aspect-video rounded-xl border border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all bg-[#FAF8F4] dark:bg-[#0F0602] ${imagePreview ? "border-[#DF8142]" : errors.image ? "border-rose-500 bg-rose-50/50" : "border-[#DF8142]/40 dark:border-[#5A270F] hover:border-[#DF8142]"}`}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:blur-sm transition-all"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-[8px] font-black uppercase text-white tracking-widest bg-[#DF8142] px-2 py-1 rounded">
                        Swap
                      </span>
                    </div>
                    <button
                      type="button"
                      title="Remove Image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-1 right-1 bg-rose-500 text-white rounded p-1 hover:bg-rose-600 shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="h-5 w-5 text-[#DF8142] mb-1 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#92664A] dark:text-[#EEB38C]/60">
                      Upload Source
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  title="Upload Featured Image"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <FieldError message={errors.image} />
            </div>

            {/* Core Settings Compact */}
            <div className="bg-white dark:bg-[#1A0B02] p-4 border border-[#EEB38C]/40 dark:border-[#5A270F]/50 shadow-md rounded-2xl flex flex-col flex-grow">
              {/* Tags Input */}
              <div className="space-y-1.5 mb-5">
                <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#6C3B1C] dark:text-[#EEB38C]/80">
                  <span className="w-1 h-1 bg-[#DF8142] rounded-full" />
                  Classification Tags
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#DF8142]">
                    <PlusCircle className="h-3 w-3" />
                  </div>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="architecture, guide..."
                    className={`w-full pl-7 pr-2 py-2 bg-[#FAF8F4] dark:bg-[#0F0602] border border-[#EEB38C]/50 dark:border-[#5A270F] rounded-lg focus:outline-none focus:border-[#DF8142] text-[10px] font-bold text-[#5A270F] dark:text-white uppercase tracking-wider placeholder:text-[#92664A]/50 dark:placeholder:text-[#EEB38C]/30 ${errors.tags && "!border-rose-500"}`}
                  />
                </div>
                <FieldError message={errors.tags} />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 p-2.5 bg-[#EEB38C]/20 dark:bg-[#0F0602] rounded-lg border border-[#EEB38C]/40 dark:border-[#5A270F] mb-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="published"
                    title="Publish log immediately on save"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-[#92664A]/30 dark:bg-[#2C1105] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#DF8142]" />
                  <span className="ml-2 text-[9px] font-black uppercase tracking-[0.1em] text-[#5A270F] dark:text-[#EEB38C]">
                    Live Transmission
                  </span>
                </label>
              </div>

              {/* Desktop Submit */}
              <button
                type="submit"
                disabled={loading}
                className="hidden md:flex w-full mt-5 py-2.5 items-center justify-center gap-2 bg-[#5A270F] dark:bg-[#DF8142] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#2A1205] dark:hover:bg-[#c4703a] transition-all shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <Save className="h-3 w-3" /> Commit Log
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile Sticky Action */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-[#0F0602]/95 backdrop-blur-xl border-t border-[#EEB38C]/30 dark:border-[#5A270F]/50 z-50">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 flex items-center justify-center gap-2 bg-[#5A270F] dark:bg-[#DF8142] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <Save className="h-3 w-3" /> Commit Log
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostBlog;
