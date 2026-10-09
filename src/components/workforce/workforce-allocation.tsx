"use client";

import React from "react";
import { WorkforceAllocationItem } from "@/types/workforce";
import { Users, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

interface WorkforceAllocationProps {
  allocations: WorkforceAllocationItem[];
}

export function WorkforceAllocation({ allocations }: WorkforceAllocationProps) {
  const totalRequired = allocations.reduce((sum, a) => sum + a.requiredEmployees, 0);
  const totalAssigned = allocations.reduce((sum, a) => sum + a.assignedEmployees, 0);
  const totalAvailable = allocations.reduce((sum, a) => sum + a.availableEmployees, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Workforce Allocation</h3>
              <p className="text-xs text-slate-600 font-medium">Headcount distribution & floor staffing requirements</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-600 font-medium">Req: <strong className="text-slate-900 font-bold">{totalRequired}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">Assigned: <strong className="text-cyan-800 font-bold">{totalAssigned}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">Available: <strong className="text-emerald-800 font-bold">{totalAvailable}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {allocations.map((item) => {
          const shortageDiff = item.requiredEmployees - item.availableEmployees;
          const isShortage = shortageDiff > 0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isShortage
                  ? "bg-amber-50/40 border-amber-300 hover:border-amber-400 shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-lg bg-white text-slate-800 border border-slate-200">
                      {item.department}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-1" title={item.category}>
                      {item.category}
                    </h4>
                  </div>
                  {isShortage ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Shortage (-{shortageDiff})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Staffed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Required</span>
                    <span className="text-sm font-black text-slate-900">{item.requiredEmployees}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Assigned</span>
                    <span className="text-sm font-black text-cyan-800">{item.assignedEmployees}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Available</span>
                    <span className={`text-sm font-black ${isShortage ? "text-amber-800" : "text-emerald-800"}`}>
                      {item.availableEmployees}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Utilization Rate</span>
                  <span className={`font-bold ${item.utilizationRate >= 95 ? "text-emerald-800" : "text-slate-800"}`}>
                    {item.utilizationRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      item.utilizationRate >= 95
                        ? "bg-emerald-600"
                        : item.utilizationRate >= 85
                        ? "bg-cyan-600"
                        : "bg-amber-600"
                    }`}
                    style={{ width: `${Math.min(item.utilizationRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
