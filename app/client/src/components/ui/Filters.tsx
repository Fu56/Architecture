import { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Layers,
  Database,
  SortAsc,
  Calendar,
} from "lucide-react";
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
  { id: "Architectural Design I", name: "Architectural Design I" },
  { id: "Architectural Design II", name: "Architectural Design II" },
  { id: "Architectural Design III", name: "Architectural Design III" },
  { id: "Integrated Design I", name: "Integrated Design I" },
  { id: "Integrated Design II", name: "Integrated Design II" },
  { id: "Integrated Design III", name: "Integrated Design III" },
  { id: "Thesis Project", name: "Thesis Project" },
  { id: "Others", name: "Others" },
];

const fileTypes = ["pdf", "docx", "jpeg", "png", "mp4", "rfa", "skp"];

const Filters = ({ onFilterChange, initialFilters }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 400);

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
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Superior Search Interface */}
        <div className="relative flex-grow group w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#DF8142] to-[#5A270F] rounded-2xl blur-lg opacity-0 group-focus-within:opacity-10 transition-opacity duration-700" />
          <div
            className="relative flex items-center h-16 rounded-2xl border border-[#92664A]/30 dark:border-white/10 bg-white dark:bg-[#1A0B05] focus-within:border-[#DF8142] transition-all duration-500 overflow-hidden shadow-md shadow-[#5A270F]/5 dark:shadow-none"
          >
            <Search
              className="ml-6 h-5 w-5 text-[#5A270F]/60 dark:text-[#EEB38C]/40"
            />
            <input
              type="text"
              name="search"
              placeholder="Explore the architectural archive..."
              value={filters.search || ""}
              onChange={handleInputChange}
              className="w-full pl-4 pr-12 py-3 bg-transparent text-[11px] font-black uppercase tracking-[0.15em] outline-none transition-all placeholder:transition-all focus:placeholder:translate-x-4 text-[#5A270F] dark:text-white placeholder:text-[#5A270F]/60 dark:placeholder:text-white/20"
            />
            {filters.search && (
              <button
                title="Clear Search"
                onClick={() =>
                  setFilters((prev: FilterState) => ({ ...prev, search: "" }))
                }
                className="absolute right-4 p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4 text-[#92664A] dark:text-[#EEB38C]/60" />
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filter Trigger */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-16 flex items-center justify-center gap-4 px-10 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 border whitespace-nowrap active:scale-95 group/filter ${
            showFilters || activeFilterCount > 0
              ? "bg-[#5A270F] text-white border-[#5A270F] shadow-xl shadow-[#5A270F]/30"
              : "bg-white dark:bg-[#1A0B05] text-[#5A270F] dark:text-[#EEB38C] border-[#92664A]/30 dark:border-white/10 hover:border-[#DF8142] dark:hover:border-[#DF8142] hover:shadow-2xl hover:shadow-[#5A270F]/10 dark:hover:shadow-none"
          }`}
        >
          <SlidersHorizontal
            className={`h-5 w-5 transition-transform duration-700 ${showFilters ? "rotate-180" : "group-hover/filter:scale-110"}`}
          />
          <span>Filter Resources</span>
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#DF8142] text-white text-[10px] shadow-lg animate-in zoom-in duration-500">
              {activeFilterCount}
            </div>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-500 ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
      >
        <div>
          <div
            className="p-10 rounded-[2.5rem] space-y-10 transition-colors duration-500 border border-[#92664A]/15 dark:border-white/10 bg-white dark:bg-[#1A0B05] shadow-2xl shadow-[#5A270F]/10 dark:shadow-none min-h-0"
          >
            <div className="flex items-center justify-between border-b pb-6 border-[#92664A]/10 dark:border-white/5">
              <div className="space-y-1">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">
                  Filter Configuration
                </h3>
                <p className="text-[9px] font-bold text-[#5A270F] dark:text-[#EEB38C]/40 uppercase tracking-[0.15em]">
                  Optimize your architectural repository
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="px-6 py-2 border border-[#DF8142]/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#DF8142] hover:bg-[#DF8142] hover:text-white transition-all active:scale-95"
              >
                Reset Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
              <div className="relative z-[100]">
                <Select
                  label="File Format"
                  options={[
                    { id: "", name: "All Extensions" },
                    ...fileTypes.map((type) => ({
                      id: type,
                      name: type.toUpperCase(),
                    })),
                  ]}
                  value={filters.fileType || ""}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, fileType: val }))
                  }
                  placeholder="Choose Format"
                  icon={<Layers className="h-5 w-5 text-[#DF8142]" />}
                />
              </div>

              <div className="relative z-[90]">
                <Select
                  label="Design Phase"
                  options={[{ id: "", name: "All Phases" }, ...designStages]}
                  value={filters.stage || ""}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, stage: val }))
                  }
                  placeholder="Select Stage"
                  icon={<Database className="h-5 w-5 text-[#DF8142]" />}
                />
              </div>

              <div className="relative z-[80]">
                <Select
                  label="Sort Order"
                  options={[
                    { id: "", name: "Newest Arrivals" },
                    { id: "oldest", name: "Archival Order" },
                    { id: "top-rated", name: "Peer Favorites" },
                  ]}
                  value={filters.sort || ""}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, sort: val }))
                  }
                  placeholder="Arrange By"
                  icon={<SortAsc className="h-5 w-5 text-[#DF8142]" />}
                />
              </div>

              <div className="space-y-3 relative z-[10]">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C] flex items-center gap-2 opacity-70 dark:opacity-50">
                  <Calendar className="h-3.5 w-3.5" /> Academic Period
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group/input">
                    <input
                      type="number"
                      name="year"
                      placeholder="Year"
                      value={filters.year || ""}
                      onChange={handleInputChange}
                      className="w-full h-12 px-5 rounded-xl font-black text-xs outline-none focus:border-[#DF8142] border border-[#92664A]/30 dark:border-white/10 bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-white placeholder:text-[#5A270F]/60 dark:placeholder:text-white/20 transition-all"
                    />
                  </div>
                  <div className="relative group/input">
                    <input
                      type="number"
                      name="semester"
                      placeholder="Sem"
                      value={filters.semester || ""}
                      onChange={handleInputChange}
                      className="w-full h-12 px-5 rounded-xl font-black text-xs outline-none focus:border-[#DF8142] border border-[#92664A]/30 dark:border-white/10 bg-[#FAF8F4] dark:bg-white/5 text-[#5A270F] dark:text-white placeholder:text-[#5A270F]/60 dark:placeholder:text-white/20 transition-all"
                    />
                  </div>
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
