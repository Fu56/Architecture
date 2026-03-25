import { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Layers,
  Database,
  SortAsc,
} from "lucide-react";
import Select from "./Select";
import { useTheme } from "../../context/useTheme";

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
  const { theme } = useTheme();
  const isLight = theme === "light";

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
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar - Premium Style */}
        <div className="relative flex-grow group">
          <div className="absolute -inset-0.5 bg-[#DF8142]/30 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-500" />
          <div className={`relative flex items-center rounded-xl overflow-hidden shadow-sm transition-all border ${isLight ? "bg-white border-[#92664A]/30 group-focus-within:border-[#DF8142]/60" : "bg-[#1A0B02] border-white/5 group-focus-within:border-[#DF8142]/60"}`}>
            <Search className={`ml-4 h-4 w-4 ${isLight ? "text-[#5A270F]/40" : "text-[#EEB38C]/40"}`} />
            <input
              type="text"
              name="search"
              placeholder="Search resource nexus..."
              value={filters.search || ""}
              onChange={handleInputChange}
              className={`w-full pl-3 pr-4 py-3 bg-transparent font-black uppercase tracking-widest text-[9px] outline-none ${isLight ? "text-[#5A270F] placeholder:text-[#5A270F]/40" : "text-white placeholder:text-white/20"}`}
            />
            {filters.search && (
              <button
                title="Clear Search"
                onClick={() =>
                  setFilters((prev: FilterState) => ({ ...prev, search: "" }))
                }
                className={`mr-3 p-1 rounded-full transition-colors ${isLight ? "hover:bg-[#FAF8F4]" : "hover:bg-white/10"}`}
              >
                <X className={`h-3.5 w-3.5 ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all duration-300 border ${
            showFilters || activeFilterCount > 0
              ? "bg-[#5A270F] text-white border-[#5A270F] shadow-lg shadow-[#5A270F]/10"
              : isLight ? "bg-white text-[#5A270F] border-[#92664A]/30 hover:border-[#DF8142]" : "bg-[#1A0B02] text-[#EEB38C] border-white/5 hover:border-[#DF8142]"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-0.5 bg-[#DF8142] text-white px-1.5 py-0.5 rounded text-[8px] font-black">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-500 ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          showFilters
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-h-0">
          <div className={`p-5 rounded-2xl space-y-5 transition-colors duration-500 shadow-xl border ${isLight ? "bg-white border-[#92664A]/30 shadow-[#5A270F]/5" : "bg-[#1A0B02] border-white/5 shadow-none"}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? "border-[#92664A]/10" : "border-white/5"}`}>
              <h3 className={`text-[9px] font-black uppercase tracking-[0.2em] ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`}>
                Nexus <span className="text-[#DF8142]">Configuration</span>
              </h3>
              <button
                onClick={clearFilters}
                className="text-[8.5px] font-black uppercase tracking-widest text-[#DF8142] hover:text-[#5A270F] transition-colors"
              >
                Reset Matrix
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Select
                label="Asset Protocol"
                options={[
                  { id: "", name: "All Formats" },
                  ...fileTypes.map((type) => ({
                    id: type,
                    name: `${type.toUpperCase()} Protocol`,
                  })),
                ]}
                value={filters.fileType || ""}
                onChange={(val) =>
                  setFilters((prev: FilterState) => ({
                    ...prev,
                    fileType: val,
                  }))
                }
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
                onChange={(val) =>
                  setFilters((prev: FilterState) => ({ ...prev, stage: val }))
                }
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
                onChange={(val) =>
                  setFilters((prev: FilterState) => ({ ...prev, sort: val }))
                }
                placeholder="Sort By..."
                icon={<SortAsc className="h-4 w-4 text-[#DF8142]" />}
              />

              <div className="space-y-1.5">
                <label className={`text-[8.5px] font-black uppercase tracking-[0.2em] ml-1 ${isLight ? "text-[#92664A]" : "text-[#EEB38C]/40"}`}>
                  Temporal Cycle
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    name="year"
                    placeholder="Year..."
                    value={filters.year || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 rounded-lg font-black uppercase tracking-widest text-[9px] outline-none focus:border-[#DF8142] border ${isLight ? "bg-[#FAF8F4] border-[#92664A]/30 text-[#5A270F] placeholder:text-[#5A270F]/40" : "bg-white/5 border-white/5 text-white placeholder:text-white/20"}`}
                  />
                  <input
                    type="number"
                    name="semester"
                    placeholder="Sem..."
                    value={filters.semester || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 rounded-lg font-black uppercase tracking-widest text-[9px] outline-none focus:border-[#DF8142] border ${isLight ? "bg-[#FAF8F4] border-[#92664A]/30 text-[#5A270F] placeholder:text-[#5A270F]/40" : "bg-white/5 border-white/5 text-white placeholder:text-white/20"}`}
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
