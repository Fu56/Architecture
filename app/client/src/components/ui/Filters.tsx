import { useState, useEffect } from "react";
import { SlidersHorizontal, Search, X, ChevronDown, Layers, Database, SortAsc } from "lucide-react";
import Select from "./Select";

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
    setFilters((prev: FilterState) => ({ ...prev, [name]: value }));
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
          <div className="relative flex items-center bg-[#FAF8F4] dark:bg-white/5 border border-[#D9D9C2] dark:border-white/10 rounded-xl overflow-hidden shadow-sm group-focus-within:border-[#DF8142]/80 group-focus-within:shadow-[#DF8142]/5 transition-all">
            <Search className="ml-5 h-5 w-5 text-[#5A270F]/40 dark:text-[#EEB38C]/40" />
            <input
              type="text"
              name="search"
              placeholder="Search library matrix..."
              value={filters.search || ""}
              onChange={handleInputChange}
              className="w-full pl-4 pr-4 py-3.5 bg-transparent text-[#5A270F] dark:text-white placeholder:text-[#5A270F]/40 dark:placeholder-white/20 font-black uppercase tracking-widest text-[10px] outline-none"
            />
            {filters.search && (
              <button
                title="Clear Search"
                onClick={() => setFilters((prev: FilterState) => ({ ...prev, search: "" }))}
                className="mr-4 p-1 hover:bg-[#F5F5DC] dark:hover:bg-white/10 dark:bg-card/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-[#92664A] dark:text-[#EEB38C]/40" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 border ${
            showFilters || activeFilterCount > 0
              ? "bg-[#5A270F] dark:bg-[#DF8142] text-white border-[#5A270F] dark:border-[#DF8142] shadow-xl shadow-[#5A270F]/20 dark:shadow-[#DF8142]/20"
              : "bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-white border-[#D9D9C2] dark:border-white/10 hover:border-[#DF8142]"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter Resource</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-white dark:bg-primary text-[#DF8142] dark:text-[#EEB38C] px-2 py-0.5 rounded-full text-[10px]">
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
        <div className="min-h-0">
          <div className="bg-[#FAF8F4] dark:bg-card p-6 border border-[#D9D9C2] dark:border-white/10 rounded-2xl space-y-6 transition-colors duration-500 shadow-inner">
            <div className="flex items-center justify-between border-b border-[#5A270F]/5 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#5A270F]/40 dark:text-[#EEB38C]/40">
                Parameter <span className="text-[#DF8142]">Configuration</span>
              </h3>
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold uppercase tracking-widest text-[#DF8142] hover:text-[#5A270F] dark:text-[#EEB38C] transition-colors bg-[#DF8142]/5 px-3 py-1 rounded-full border border-[#DF8142]/20"
              >
                Reset Matrix
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Select
                label="Asset Protocol"
                options={[
                  { id: "", name: "All Formats" },
                  ...fileTypes.map((type) => ({ id: type, name: `${type.toUpperCase()} Protocol` })),
                ]}
                value={filters.fileType || ""}
                onChange={(val) => setFilters((prev: FilterState) => ({ ...prev, fileType: val }))}
                placeholder="All Formats"
                icon={<Layers className="h-4 w-4 text-[#DF8142]" />}
              />

              <Select
                label="Design Stage Nexus"
                options={[
                  { id: "", name: "All Development Stages" },
                  ...designStages.map((stage) => ({ id: stage, name: stage })),
                ]}
                value={filters.stage || ""}
                onChange={(val) => setFilters((prev: FilterState) => ({ ...prev, stage: val }))}
                placeholder="All Development Stages"
                icon={<Database className="h-4 w-4 text-[#DF8142]" />}
              />

              <Select
                label="Temporal Alignment"
                options={[
                  { id: "", name: "Chronological: Newest First" },
                  { id: "oldest", name: "Chronological: Archive Access" },
                  { id: "top-rated", name: "Evaluation Matrix: Top Rated" },
                ]}
                value={filters.sort || ""}
                onChange={(val) => setFilters((prev: FilterState) => ({ ...prev, sort: val }))}
                placeholder="Sort By..."
                icon={<SortAsc className="h-4 w-4 text-[#DF8142]" />}
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#92664A] dark:text-white/40 ml-1">
                  Academic Cycle
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="year"
                    placeholder="Year..."
                    value={filters.year || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-lg font-black uppercase tracking-widest text-[10px] text-[#5A270F] dark:text-white outline-none focus:ring-2 focus:ring-[#DF8142] focus:border-[#DF8142] placeholder:text-[#5A270F]/40"
                  />
                  <input
                    type="number"
                    name="semester"
                    placeholder="Sem..."
                    value={filters.semester || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-background border border-[#D9D9C2] dark:border-white/10 rounded-lg font-black uppercase tracking-widest text-[10px] text-[#5A270F] dark:text-white outline-none focus:ring-2 focus:ring-[#DF8142] focus:border-[#DF8142] placeholder:text-[#5A270F]/40"
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
