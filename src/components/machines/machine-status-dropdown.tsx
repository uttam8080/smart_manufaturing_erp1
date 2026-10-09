"use client";

import React, { useState, useRef, useEffect } from "react";
import { MachineStatus } from "@/types/machines";
import {
  AlertTriangle,
  Clock,
  Wrench,
  ChevronDown,
  Check,
  Power,
  Play,
  Pause,
} from "lucide-react";

interface MachineStatusDropdownProps {
  machineId: string;
  status: MachineStatus | string;
  onStatusChange: (machineId: string, newStatus: "Running" | "Idle" | "Maintenance" | "Warning") => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function MachineStatusDropdown({
  machineId,
  status,
  onStatusChange,
  disabled = false,
  size = "md",
}: MachineStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const norm = (status || "Running").toLowerCase().trim();
  let currentStatus: "Running" | "Idle" | "Maintenance" | "Warning" = "Running";
  if (norm === "warning" || norm === "alert" || norm === "degraded") {
    currentStatus = "Warning";
  } else if (norm === "maintenance" || norm === "under maintenance" || norm === "repair" || norm === "offline") {
    currentStatus = "Maintenance";
  } else if (norm === "idle" || norm === "standby" || norm === "ready") {
    currentStatus = "Idle";
  } else {
    currentStatus = "Running";
  }

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (newStatus: "Running" | "Idle" | "Maintenance" | "Warning", e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (newStatus !== currentStatus) {
      onStatusChange(machineId, newStatus);
    }
  };

  const getBadgeStyle = () => {
    switch (currentStatus) {
      case "Warning":
        return "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100";
      case "Maintenance":
        return "bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100";
      case "Idle":
        return "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200";
      case "Running":
      default:
        return "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100";
    }
  };

  const options: Array<{
    id: "Running" | "Idle" | "Maintenance" | "Warning";
    label: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: "Running",
      label: "Running",
      desc: "Active production load & sensor telemetry",
      icon: <Play className="w-3.5 h-3.5 text-emerald-600" />,
      color: "text-emerald-900",
    },
    {
      id: "Idle",
      label: "Idle (Standby)",
      desc: "Zero motor load, ambient temperature",
      icon: <Pause className="w-3.5 h-3.5 text-slate-500" />,
      color: "text-slate-800",
    },
    {
      id: "Maintenance",
      label: "Maintenance",
      desc: "Offline for preventive / corrective service",
      icon: <Wrench className="w-3.5 h-3.5 text-rose-600" />,
      color: "text-rose-900",
    },
    {
      id: "Warning",
      label: "Warning",
      desc: "Anomalous vibration or thermal drift",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
      color: "text-amber-900",
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs select-none ${getBadgeStyle()} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        title="Click to change machine status (Running / Idle / Maintenance / Warning)"
      >
        {currentStatus === "Running" && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
        )}
        {currentStatus === "Idle" && <Clock className="w-3.5 h-3.5 text-slate-500" />}
        {currentStatus === "Maintenance" && <Wrench className="w-3.5 h-3.5 text-rose-600 animate-pulse" />}
        {currentStatus === "Warning" && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}

        <span>{currentStatus}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 z-50 mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            Switch Machine State
          </div>
          <div className="py-1 space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.id === currentStatus;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={(e) => handleSelect(opt.id, e)}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-slate-100 text-slate-900"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{opt.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${opt.color}`}>
                        {opt.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 font-medium">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
