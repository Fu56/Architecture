import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  id: string | number;
  name: string;
}

interface SelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
  error,
  icon,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.id) === String(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionId: string | number) => {
    onChange(String(optionId));
    setIsOpen(false);
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[8.5px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C]/40 mb-1 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white dark:bg-[#1A0B02] border border-[#92664A]/30 dark:border-white/10 rounded-lg px-2.5 py-2
                     text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C]
                     flex items-center justify-between transition-all duration-300
                     hover:border-[#DF8142] focus:border-[#DF8142] focus:outline-none"
        >
          <div className="flex items-center gap-2">
            {icon && <div className="text-[#DF8142] scale-75">{icon}</div>}
            <span className="uppercase tracking-tight text-[#5A270F]/60 dark:text-white/40">
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-[#92664A] transition-transform duration-500 ${isOpen ? "rotate-180 text-[#DF8142]" : ""}`} />
        </button>

        {/* Dropdown Menu - Architectural Glassmorphism */}
        {isOpen && (
          <div 
            className="absolute z-[999] min-w-full w-max max-w-[calc(100vw-2rem)] left-0 top-full mt-2 border-2 border-[#DF8142]/60 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 bg-white/95 dark:bg-[#1A0B04]/95 backdrop-blur-3xl overflow-hidden shadow-[#5A270F]/20 dark:shadow-black"
          >
            <div className="max-h-[70vh] overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-[#DF8142] scrollbar-track-transparent">
              {options.length === 0 ? (
                <div className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-center text-[#5A270F]/40 dark:text-[#EEB38C]/40">
                  Void: No protocols found
                </div>
              ) : (
                <div className="flex flex-col">
                  {options.map((option, index) => {
                    const isSelected = String(option.id) === String(value);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelect(option.id)}
                        className={`w-full flex items-center justify-between gap-4 px-4 py-3 text-left transition-all duration-200 group
                                   ${index !== options.length - 1 ? "border-b border-[#92664A]/10 dark:border-white/5" : ""}
                                   ${isSelected 
                                     ? "bg-[#DF8142] text-white" 
                                     : "text-[#5A270F] dark:text-[#EEB38C]/80 hover:bg-[#DF8142]/5 dark:hover:bg-[#DF8142]/10"}`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-tight">
                          {option.name}
                        </span>
                        {isSelected && <Check className="h-3 w-3 text-white flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
