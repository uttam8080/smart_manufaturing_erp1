"use client";

import React from "react";
import { InventoryFilterState } from "@/types/inventory";
import {
  Search,
  Filter,
  RotateCcw,
  Boxes,
  Building2,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";

const STATUSES = ["Healthy", "Low Stock", "Critical", "Overstock"];

interface InventoryFiltersProps {
  filters: InventoryFilterState;
  onFilterChange: (newFilters: Partial<InventoryFilterState>) => void;
  onResetFilters: () => void;
  totalItems: number;
  filteredCount: number;
  availableCategories?: string[];
  availableWarehouses?: string[];
  availableStatuses?: string[];
}

export function InventoryFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalItems,
  filteredCount,
  availableCategories = [],
  availableWarehouses = [],
  availableStatuses = [],
}: InventoryFiltersProps) {
  const categories = availableCategories.length > 0 
    ? availableCategories 
    : ["Raw Material", "Finished Goods", "Packaging Material"];

  const warehouses = availableWarehouses.length > 0 
    ? availableWarehouses 
    : ["Main Raw Material Warehouse", "Finished Goods Warehouse"];

  const statuses = availableStatuses.length > 0 
    ? availableStatuses 
    : ["Healthy", "Low Stock", "Critical", "Overstock"];
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.category !== "all" ||
    filters.warehouse !== "all" ||
    filters.status !== "all" ||
    filters.dateRange !== "7d";

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Top row: Search and counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search material by code (e.g. RM-FLOUR, PKG-BOX) or item name..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: "" })}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-600 font-mono text-[11px] font-medium">
            Showing <strong className="text-cyan-800 font-bold">{filteredCount}</strong> of {totalItems} items
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-3 h-3 text-amber-600" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-slate-200">
        {/* Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <Boxes className="w-3 h-3 text-cyan-600" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 cursor-pointer shadow-xs"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Warehouse */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-blue-600" />
            Warehouse
          </label>
          <select
            value={filters.warehouse}
            onChange={(e) => onFilterChange({ warehouse: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 cursor-pointer shadow-xs"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh} value={wh}>
                {wh}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Stock Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 cursor-pointer shadow-xs"
          >
            <option value="all">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-purple-600" />
            Date Period
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ dateRange: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 cursor-pointer shadow-xs"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
    </div>
  );
}
