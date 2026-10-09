"use client";

import React from "react";
import { ShiftItem } from "@/types/workforce";
import { Clock, Users, Sun, Sunset, Moon, Shield, CheckCircle2 } from "lucide-react";

interface ShiftManagementProps {
  shifts: ShiftItem[];
}

export function ShiftManagement({ shifts }: ShiftManagementProps) {
  const getShiftIcon = (name: string) => {
    if (name.includes("Morning")) return Sun;
    if (name.includes("Evening")) return Sunset;
    if (name.includes("Night")) return Moon;
    return Clock;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Shift Management</h3>
            <p className="text-xs text-slate-600 font-medium">
              Rotational shift schedules, active floor manning, and roster utilization rates
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-300">
          4 Rotational Rosters
        </span>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map((s) => {
          const Icon = getShiftIcon(s.shiftName);

          return (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-cyan-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{s.shiftName}</h4>
                      <span className="text-xs font-mono font-semibold text-slate-600">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 font-medium mb-3 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Supervisor: <strong className="text-slate-900 font-bold">{s.leadSupervisor}</strong></span>
                </div>

                {/* Headcount breakdown */}
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-white border border-slate-200 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Total</span>
                    <span className="font-mono font-black text-slate-900">{s.totalAssigned}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold block">Present</span>
                    <span className="font-mono font-black text-emerald-800">{s.presentCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-800 font-bold block">Absent</span>
                    <span className="font-mono font-black text-rose-800">{s.absentCount}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 text-xs pt-1 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-bold">Shift Utilization:</span>
                  <span className="font-mono font-black text-cyan-800">{s.utilizationRate}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.utilizationRate >= 90
                        ? "bg-emerald-600"
                        : s.utilizationRate >= 80
                        ? "bg-cyan-600"
                        : "bg-amber-600"
                    }`}
                    style={{ width: `${s.utilizationRate}%` }}
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
