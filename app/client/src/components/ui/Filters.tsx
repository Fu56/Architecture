import { useState, useEffect } from "react";
import { SlidersHorizontal, Search, X, ChevronDown } from "lucide-react";

export type FilterState = {
  search?: string;
  fileType?: string;
  stage?: string;
  year?: string;
  semester?: string;
  sort?: string;
};

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const designStages = [
  "Architectural Design I",
  "Architectural Design II",
  "Architectural Design III",
  "Integrated Design I",
  "Integrated Design II",
  "Integrated Design III",
  "Thesis Project",
  "Others",
];

const fileTypes = ["pdf", "docx", "jpeg", "png", "mp4", "rfa", "skp"];

const Filters = ({ onFilterChange, initialFilters }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 400); // Slightly faster debounce for "as you type" feel

    return () => {
      clearTimeout(handler);
    };
  }, [filters, onFilterChange]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "search" && key !== "sort" && value !== "",
  ).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search Bar - Premium Style */}
        <div className="relative flex-grow group">
          <div className="absolute -inset-0.5 bg-[#DF8142]/90 rounded-xl blur opacity-10 group-focus-within:opacity-20 transition duration-500" />
          <div className="relative flex items-center bg-white border border-[#EEB38C]/30 rounded-xl overflow-hidden shadow-sm group-focus-within:border-[#DF8142]/80 group-focus-within:shadow-[#DF8142]/5 transition-all">
            <Search className="ml-5 h-5 w-5 text-[#92664A]" />
            <input
              type="text"
              name="search"
              placeholder="Search library matrix..."
              value={filters.search || ""}
              onChange={handleInputChange}
              className="w-full pl-4 pr-4 py-3.5 text-[#5A270F] placeholder:text-[#92664A]/50 font-bold outline-none"
            />
            {filters.search && (
              <button
                title="Clear Search"
                onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                className="mr-4 p-1 hover:bg-[#F5F5DC] rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-[#92664A]" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 border-2 ${
            showFilters || activeFilterCount > 0
              ? "bg-[#DF8142] text-white border-[#DF8142] shadow-md shadow-[#DF8142]/20"
              : "bg-white text-[#5A270F] border-[#D9D9C2] hover:border-[#DF8142]/40"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter Resource</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-white text-[#DF8142] px-2 py-0.5 rounded-full text-[10px]">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-500 ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          showFilters
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#EEB38C]/10 border border-[#EEB38C]/30 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#92664A]">
                Parameter Configuration
              </h3>
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold uppercase tracking-widest text-[#DF8142] hover:text-[#5A270F] transition-colors"
              >
                Reset Matrix
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#92664A] ml-1">
                  Asset Protocol
                </label>
                <select
                  name="fileType"
                  title="File Type Protocol"
                  value={filters.fileType || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-[#EEB38C]/50 rounded-lg font-bold text-[#5A270F] focus:ring-2 focus:ring-[#DF8142]/90 focus:border-[#DF8142] outline-none appearance-none cursor-pointer placeholder:text-[#92664A]/50"
                >
                  <option value="">All Formats</option>
                  {fileTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()} Protocol
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#92664A] ml-1">
                  Design Stage Nexus
                </label>
                <select
                  name="stage"
                  title="Design Stage Nexus"
                  value={filters.stage || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-[#EEB38C]/50 rounded-lg font-bold text-[#5A270F] focus:ring-2 focus:ring-[#DF8142]/90 focus:border-[#DF8142] outline-none appearance-none cursor-pointer"
                >
                  <option value="">All Development Stages</option>
                  {designStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#92664A] ml-1">
                  Temporal Alignment
                </label>
                <select
                  name="sort"
                  title="Temporal Alignment Sort"
                  value={filters.sort || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-[#EEB38C]/50 rounded-lg font-bold text-[#5A270F] focus:ring-2 focus:ring-[#DF8142]/90 focus:border-[#DF8142] outline-none appearance-none cursor-pointer"
                >
                  <option value="">Chronological: Newest First</option>
                  <option value="oldest">Chronological: Archive Access</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#92664A] ml-1">
                  Academic Cycle
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="year"
                    placeholder="Year..."
                    value={filters.year || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-[#EEB38C]/50 rounded-lg font-bold text-[#5A270F] outline-none focus:ring-2 focus:ring-[#DF8142]/90 focus:border-[#DF8142] placeholder:text-[#92664A]/50"
                  />
                  <input
                    type="number"
                    name="semester"
                    placeholder="Sem..."
                    value={filters.semester || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-[#EEB38C]/50 rounded-lg font-bold text-[#5A270F] outline-none focus:ring-2 focus:ring-[#DF8142]/90 focus:border-[#DF8142] placeholder:text-[#92664A]/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
