"use client";

import React from "react";
import { FinanceFilterState, ExpenseCategory, FinanceDepartment, PaymentStatus } from "@/types/finance";
import { Search, RotateCcw } from "lucide-react";

interface FinanceFiltersProps {
  filters: FinanceFilterState;
  onFilterChange: (newFilters: Partial<FinanceFilterState>) => void;
  onResetFilters: () => void;
  totalRecords: number;
  filteredCount: number;
}

const CATEGORIES: ExpenseCategory[] = [
  "Maintenance",
  "Electricity",
  "Salary",
  "Logistics",
  "Software",
  "Utilities",
  "Raw Materials",
  "Packaging Materials",
  "Other",
];

const DEPARTMENTS: FinanceDepartment[] = [
  "Production",
  "Quality",
  "Maintenance",
  "Inventory",
  "Procurement",
  "Workforce",
  "Administration",
  "Finance",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Pending", "Overdue"];

export function FinanceFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalRecords,
  filteredCount,
}: FinanceFiltersProps) {
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.dateRange !== "all" ||
    filters.category !== "all" ||
    filters.department !== "all" ||
    filters.paymentStatus !== "all";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Expense ID, Invoice No, Supplier, Category..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange({ dateRange: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Dates</option>
              <option value="current_month">Current Month (Oct)</option>
              <option value="last_month">Last Month (Sep)</option>
              <option value="last_3_months">Last 3 Months</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer pr-8"
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

          {/* Payment Status Filter */}
          <div className="relative">
            <select
              value={filters.paymentStatus}
              onChange={(e) => onFilterChange({ paymentStatus: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Payment Statuses</option>
              {PAYMENT_STATUSES.map((st) => (
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
      </div>

      {/* Filter status row & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
        <div className="text-slate-600 font-medium flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredCount}</strong> of{" "}
            <strong className="text-slate-900 font-bold">{totalRecords}</strong> ledger entries
          </span>
          {isFiltered && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 text-[11px]">
              Filters Active
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
