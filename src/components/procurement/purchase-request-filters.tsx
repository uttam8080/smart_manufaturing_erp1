"use client";

import React from "react";
import {
  PurchaseRequestFilterState,
  RequestStatus,
  RequestPriority,
} from "@/types/procurement";
import { Search, RotateCcw, Filter } from "lucide-react";

interface PurchaseRequestFiltersProps {
  filters: PurchaseRequestFilterState;
  onFilterChange: (newFilters: Partial<PurchaseRequestFilterState>) => void;
  onResetFilters: () => void;
  totalRequests: number;
  filteredCount: number;
  availableDepartments?: string[];
  availableStatuses?: string[];
  availablePriorities?: string[];
  availableMaterials?: string[];
}

export function PurchaseRequestFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalRequests,
  filteredCount,
  availableDepartments = [],
  availableStatuses = [],
  availablePriorities = [],
  availableMaterials = [],
}: PurchaseRequestFiltersProps) {
  const departments = availableDepartments.length > 0 
    ? availableDepartments 
    : ["Production & Operations", "Packaging", "Maintenance", "QA/QC", "Inventory"];

  const statuses = availableStatuses.length > 0 
    ? availableStatuses 
    : ["Pending", "Approved", "Rejected", "Converted to PO"];

  const priorities = availablePriorities.length > 0 
    ? availablePriorities 
    : ["Normal", "High", "Urgent", "Low"];

  const materials = availableMaterials.length > 0 
    ? availableMaterials 
    : ["Wheat Flour", "Sugar", "Cocoa Powder", "Biscuit Wrapper", "Biscuit Box"];
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.department !== "all" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.material !== "all";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search request ID, requester, or material..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Department */}
          <div className="relative">
            <select
              value={filters.department}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Priorities</option>
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Material */}
          <div className="relative">
            <select
              value={filters.material}
              onChange={(e) => onFilterChange({ material: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Materials</option>
              {materials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Filter status row & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-medium">
        <div className="text-slate-600 flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredCount}</strong> of{" "}
            <strong className="text-slate-900 font-bold">{totalRequests}</strong> purchase requisitions
          </span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold border border-cyan-200 text-[11px]">
              Filters Active
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-xs font-bold cursor-pointer border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
