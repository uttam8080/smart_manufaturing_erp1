"use client";

import React from "react";
import { DepartmentBudget } from "@/types/finance";
import { PieChart, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";

interface BudgetManagementProps {
  budgets: DepartmentBudget[];
}

export function BudgetManagement({ budgets }: BudgetManagementProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedBudget, 0);
  const totalUsed = budgets.reduce((sum, b) => sum + b.usedAmount, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remainingBudget, 0);
  const overallUtilization = ((totalUsed / (totalAllocated || 1)) * 100).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Department Budget Management</h3>
              <p className="text-xs text-slate-600 font-medium">Monthly fiscal expenditure quotas, utilized allocations & burn thresholds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-600 font-medium">Allocated: <strong className="text-slate-900 font-bold">{formatCurrency(totalAllocated)}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Used: <strong className="text-cyan-800 font-bold">{formatCurrency(totalUsed)}</strong> ({overallUtilization}%)</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Remaining: <strong className="text-emerald-800 font-bold">{formatCurrency(totalRemaining)}</strong></span>
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {budgets.map((b) => {
            const isNearLimit = b.utilizationRate >= 90;
            const isExceeded = b.utilizationRate > 100;

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isExceeded
                    ? "bg-rose-50/40 border-rose-300 shadow-sm"
                    : isNearLimit
                    ? "bg-amber-50/40 border-amber-300 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{b.department}</span>
                    {isExceeded ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
                        <ShieldAlert className="w-3 h-3 text-rose-600" /> Exceeded
                      </span>
                    ) : isNearLimit ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Near Limit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Normal
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 my-3 p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Allocated:</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(b.allocatedBudget)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Used Amount:</span>
                      <span className="font-mono font-black text-cyan-800">{formatCurrency(b.usedAmount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium border-t border-slate-100 pt-1">
                      <span>Remaining:</span>
                      <span className="font-mono font-bold text-emerald-800">{formatCurrency(b.remainingBudget)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">Budget Consumed</span>
                    <span className={`font-bold font-mono ${isNearLimit ? "text-amber-800" : "text-emerald-800"}`}>
                      {b.utilizationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isExceeded
                          ? "bg-rose-600"
                          : isNearLimit
                          ? "bg-amber-600"
                          : "bg-emerald-600"
                      }`}
                      style={{ width: `${Math.min(b.utilizationRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span>Fiscal Cycle: <strong className="text-slate-900 font-bold">Monthly Operational Budget (Oct 2026)</strong></span>
        <span className="text-cyan-800 font-bold">Auto-reconciliation with POs & Payroll active</span>
      </div>
    </div>
  );
}
