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
        <label className="block text-[8.5px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/40 mb-1 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white dark:bg-[#1A0B02] border rounded-lg px-2.5 py-2
                     text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C]
                     flex items-center justify-between transition-all duration-300
                     ${isOpen ? "border-[#DF8142]" : "border-[#D9D9C2] dark:border-white/5"}
                     ${error ? "border-rose-400 bg-rose-50/10" : ""}`}
        >
          <div className="flex items-center gap-2">
            {icon && <div className={`${error ? "text-rose-500" : "text-[#DF8142]"} scale-75`}>{icon}</div>}
            <span className={`uppercase tracking-tight ${!selectedOption ? "text-[#92664A]/40 dark:text-white/20" : ""}`}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-[#92664A] transition-transform duration-500 ${isOpen ? "rotate-180 text-[#DF8142]" : ""}`} />
        </button>

        {/* Dropdown Menu - Positioned ABOVE the input */}
        {isOpen && (
          <div 
            className="absolute z-[999] min-w-full w-max max-w-[calc(100vw-2rem)] right-0 bottom-full mb-2 bg-[#1F0F08] dark:bg-[#1A0B04] border-2 border-[#DF8142]/60 rounded-xl shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 backdrop-blur-3xl overflow-hidden"
          >
            <div className="max-h-[70vh] overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-[#DF8142] scrollbar-track-transparent
                            [&:cc-scrollbar]:w-1 [&:cc-scrollbar-thumb]:bg-[#DF8142] [&:cc-scrollbar-track]:bg-transparent">
              {options.length === 0 ? (
                <div className="px-5 py-4 text-[9px] font-bold text-[#EEB38C]/40 uppercase tracking-[0.2em] text-center">
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
                        className={`w-full flex items-center justify-between gap-4 px-4 py-1.5 text-left transition-all duration-200 group
                                   ${index !== options.length - 1 ? "border-b border-white/5" : ""}
                                   ${isSelected 
                                     ? "bg-[#DF8142] text-white" 
                                     : "text-[#EEB38C]/80 hover:bg-[#DF8142]/10"}`}
                      >
                        <span className="text-[8.5px] font-black uppercase tracking-[0.15em] leading-tight">
                          {option.name}
                        </span>
                        {isSelected && <Check className="h-2 w-2 text-white flex-shrink-0" />}
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
