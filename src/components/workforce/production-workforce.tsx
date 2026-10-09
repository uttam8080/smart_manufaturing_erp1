"use client";

import React from "react";
import { ProductionLineWorkforce } from "@/types/workforce";
import { Factory, Users, ShieldAlert, CheckCircle, Clock, ArrowUpRight } from "lucide-react";

interface ProductionWorkforceProps {
  lines: ProductionLineWorkforce[];
}

export function ProductionWorkforce({ lines }: ProductionWorkforceProps) {
  const getStatusBadge = (status: ProductionLineWorkforce["status"]) => {
    switch (status) {
      case "Fully Staffed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Fully Staffed
          </span>
        );
      case "Understaffed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            Understaffed
          </span>
        );
      case "Overstaffed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-300">
            Overstaffed
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Production Workforce</h3>
            <p className="text-xs text-slate-600 font-medium">Shop-floor line manning, supervisor assignments & shift distribution</p>
          </div>
        </div>
        <div className="text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Production Sync Ready
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {lines.map((line) => (
          <div
            key={line.id}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-cyan-800 px-2 py-0.5 rounded-lg bg-cyan-50 border border-cyan-200">
                  {line.lineId}
                </span>
                {getStatusBadge(line.status)}
              </div>

              <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-800 transition-colors line-clamp-1 mb-3" title={line.lineName}>
                {line.lineName}
              </h4>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Current Shift
                  </span>
                  <span className="font-bold text-slate-900">{line.currentShift}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Shift Lead
                  </span>
                  <span className="font-bold text-slate-900">{line.leadSupervisor}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-center mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Assigned</span>
                  <span className="text-sm font-black text-slate-900">{line.assignedEmployees}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Operators</span>
                  <span className="text-sm font-black text-cyan-800">{line.operatorsCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Supv</span>
                  <span className="text-sm font-black text-amber-800">{line.supervisorsCount}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">Line Staffing Rate</span>
                <span className={`font-bold ${line.workforceUtilization >= 95 ? "text-emerald-800" : "text-amber-800"}`}>
                  {line.workforceUtilization}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    line.workforceUtilization >= 95
                      ? "bg-emerald-600"
                      : line.workforceUtilization >= 80
                      ? "bg-cyan-600"
                      : "bg-amber-600"
                  }`}
                  style={{ width: `${Math.min(line.workforceUtilization, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
