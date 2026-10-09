"use client";

import React from "react";
import {
  AttendanceFilterState,
  DepartmentName,
  ShiftName,
  AttendanceStatus,
} from "@/types/workforce";
import { Search, RotateCcw, Calendar } from "lucide-react";

interface AttendanceFiltersProps {
  filters: AttendanceFilterState;
  onFilterChange: (newFilters: Partial<AttendanceFilterState>) => void;
  onResetFilters: () => void;
  totalRecords: number;
  filteredCount: number;
}

const DEPARTMENTS: DepartmentName[] = [
  "Production",
  "Packaging",
  "Quality",
  "Maintenance",
  "Inventory",
  "Procurement",
  "Finance",
  "HR",
];

const SHIFTS: ShiftName[] = [
  "Morning Shift",
  "General Shift",
  "Evening Shift",
  "Night Shift",
];

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Half Day", "Leave"];

export function AttendanceFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalRecords,
  filteredCount,
}: AttendanceFiltersProps) {
  const isFiltered =
    filters.date !== "all" ||
    filters.department !== "all" ||
    filters.shift !== "all" ||
    filters.status !== "all";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {/* Date Filter */}
        <div className="relative">
          <select
            value={filters.date}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Dates</option>
            <option value="today">Today (Oct 01)</option>
            <option value="yesterday">Yesterday (Sep 30)</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Department Filter */}
        <div className="relative">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Shift Filter */}
        <div className="relative">
          <select
            value={filters.shift}
            onChange={(e) => onFilterChange({ shift: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Shifts</option>
            {SHIFTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 focus:bg-white appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Attendance Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* Filter status row & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
        <div className="text-slate-600 font-medium flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredCount}</strong> of{" "}
            <strong className="text-slate-900 font-bold">{totalRecords}</strong> attendance punch records
          </span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 font-bold border border-cyan-300 text-[11px]">
              Filters Active
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
