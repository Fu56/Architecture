import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader2, UploadCloud, X, PlusCircle, Save, Sparkles } from "lucide-react";
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
      <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wide mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
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
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0F0602] lg:bg-[#EEB38C]/10 dark:bg-background transition-colors duration-500 relative">
      <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-6xl relative z-10">

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="mb-12 md:mb-16 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#DF8142]/10 border border-[#DF8142]/25 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#DF8142] animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="h-3 w-3" />
            Narrative Nexus
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-[#5A270F] dark:text-[#EEB38C] italic uppercase leading-none">
            Create New Story
          </h1>
          <p className="text-[12px] text-[#5A270F] dark:text-[#EEB38C]/60 max-w-lg mx-auto font-bold uppercase tracking-[0.3em]">
            Share your architectural insights with the community
          </p>
        </div>

        {/* ── Form ────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* ── LEFT: Main Content ── */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#1A0B04] p-8 md:p-12 space-y-10 border-2 border-[#92664A]/20 dark:border-white/10 shadow-xl shadow-[#5A270F]/5 rounded-3xl md:rounded-[3.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#DF8142]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="relative z-10 space-y-10">
                  {/* Story Title */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C]">
                      <span className="w-2 h-2 bg-[#DF8142] rounded-full block flex-shrink-0" />
                      Story Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a compelling title..."
                      className={`w-full px-8 py-5 md:py-7 bg-white dark:bg-black/30 border-2 rounded-2xl md:rounded-3xl
                        focus:outline-none focus:ring-4 focus:ring-[#DF8142]/15 focus:border-[#DF8142]
                        transition-all duration-300
                        text-xl md:text-3xl font-black uppercase tracking-tight
                        text-[#5A270F] dark:text-white
                        placeholder:text-[#5A270F]/25 dark:placeholder-white/20
                        ${errors.title
                          ? "border-rose-500 bg-rose-50/30"
                          : "border-[#92664A]/25 dark:border-white/15 hover:border-[#DF8142]/50"
                        }`}
                    />
                    <FieldError message={errors.title} />
                  </div>

                  {/* Narrative Content */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C]">
                      <span className="w-2 h-2 bg-[#DF8142] rounded-full block flex-shrink-0" />
                      Narrative Content
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Share your architectural wisdom here (Markdown supported)..."
                      className={`w-full px-8 py-8 bg-white dark:bg-black/30 border-2 rounded-3xl md:rounded-[2.5rem]
                        focus:outline-none focus:ring-4 focus:ring-[#DF8142]/15 focus:border-[#DF8142]
                        transition-all duration-300
                        text-base md:text-lg leading-relaxed font-medium
                        text-[#5A270F] dark:text-white/90
                        placeholder:text-[#5A270F]/25 dark:placeholder-white/20
                        resize-none min-h-[500px] md:min-h-[700px]
                        ${errors.content
                          ? "border-rose-500 bg-rose-50/30"
                          : "border-[#92664A]/25 dark:border-white/15 hover:border-[#DF8142]/50"
                        }`}
                    />
                    <FieldError message={errors.content} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="space-y-6 lg:sticky lg:top-8">

              {/* Cover Image */}
              <div className="bg-white dark:bg-[#1A0B04] p-6 space-y-5 border-2 border-[#92664A]/20 dark:border-white/10 rounded-3xl shadow-xl shadow-[#5A270F]/5">
                <label className="block text-[13px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] italic">
                  Featured Cover
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative aspect-video rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-300
                    ${imagePreview
                      ? "border-[#DF8142]"
                      : errors.image
                        ? "border-rose-400 bg-rose-50/20"
                        : "border-[#92664A]/30 dark:border-white/15 hover:border-[#DF8142] bg-[#EEB38C]/5 dark:bg-white/5"
                    }`}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Story cover preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#5A270F]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-black text-xs uppercase tracking-widest bg-[#5A270F]/80 px-4 py-2 rounded-full backdrop-blur-md">
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
                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/80 text-rose-600 rounded-full hover:scale-110 transition-all shadow-md"
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
                        <p className="text-xs font-black uppercase tracking-widest text-[#5A270F] dark:text-white">
                          Click to Upload
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#92664A] dark:text-white/50">
                          SVG · PNG · JPG · GIF
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
                <FieldError message={errors.image} />
              </div>

              {/* Tags & Settings */}
              <div className="bg-white dark:bg-[#1A0B04] p-6 space-y-6 border-2 border-[#92664A]/20 dark:border-white/10 rounded-3xl shadow-xl shadow-[#5A270F]/5">
                {/* Tags Input */}
                <div className="space-y-3">
                  <label className="block text-[13px] font-black uppercase tracking-widest text-[#5A270F] dark:text-[#EEB38C] italic">
                    Tags
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#DF8142]/10 flex items-center justify-center text-[#DF8142]">
                      <PlusCircle className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="architecture, design..."
                      className={`w-full pl-16 pr-4 py-5 bg-white dark:bg-black/30 border-2 rounded-2xl
                        focus:outline-none focus:ring-4 focus:ring-[#DF8142]/15 focus:border-[#DF8142]
                        transition-all duration-300
                        font-black uppercase tracking-widest text-[11px]
                        text-[#5A270F] dark:text-white
                        placeholder:text-[#5A270F]/30 dark:placeholder-white/20
                        ${errors.tags
                          ? "border-rose-500 bg-rose-50/30"
                          : "border-[#92664A]/25 dark:border-white/15 hover:border-[#DF8142]/50"
                        }`}
                    />
                  </div>
                  <FieldError message={errors.tags} />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-4 p-5 bg-[#EEB38C]/10 dark:bg-black/30 rounded-2xl border-2 border-[#92664A]/15 dark:border-white/10 hover:border-[#DF8142]/40 transition-all duration-300">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleInputChange}
                      id="published"
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-[#92664A]/50 bg-white dark:bg-black/60 transition-all checked:border-[#DF8142] checked:bg-[#DF8142] hover:border-[#DF8142] focus:outline-none focus:ring-4 focus:ring-[#DF8142]/20"
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                  <label
                    htmlFor="published"
                    className="font-black text-[12px] uppercase tracking-widest text-[#5A270F] dark:text-white cursor-pointer select-none italic"
                  >
                    Publish Immediately
                  </label>
                </div>

                {/* Desktop Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="hidden lg:flex w-full py-7 items-center justify-center gap-3 bg-[#5A270F] dark:bg-[#DF8142] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.35em] shadow-2xl shadow-[#5A270F]/30 hover:bg-[#6C3B1C] dark:hover:bg-[#c4703a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      Publish Story
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Mobile Sticky Submit */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t-2 border-[#92664A]/15 z-50 shadow-[0_-10px_40px_rgba(90,39,15,0.1)]">
        <button
          onClick={(e) => handleSubmit(e as any)}
          disabled={loading}
          className="w-full py-5 flex items-center justify-center gap-3 bg-[#5A270F] dark:bg-[#DF8142] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.35em] shadow-2xl active:scale-95 disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Save className="h-6 w-6" />
              Publish Story
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostBlog;
