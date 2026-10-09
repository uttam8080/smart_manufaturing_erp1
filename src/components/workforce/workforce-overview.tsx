"use client";

import React from "react";
import { EmployeeItem } from "@/types/workforce";
import {
  Users,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react";

interface WorkforceOverviewProps {
  employees: EmployeeItem[];
}

export function WorkforceOverview({ employees }: WorkforceOverviewProps) {
  const totalEmployees = 86;
  const present = 74;
  const absent = 5;
  const onLeave = 7;
  const lateArrivals = 4;
  const overtimeEmployees = 14;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Workforce Overview & Today&apos;s Plant Floor Staffing
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Real-time shift clock-in, attendance deviations, and operator availability
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Biometric Access Terminal Synced</span>
        </div>
      </div>

      {/* Grid of Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Employees */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-blue-700" />
            <span>Total Staff</span>
          </div>
          <div className="text-lg font-black text-slate-900">{totalEmployees}</div>
          <span className="text-[10px] text-slate-500 font-bold font-mono">100% Registered</span>
        </div>

        {/* Present Today */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Present Today</span>
          </div>
          <div className="text-lg font-black text-emerald-900">{present}</div>
          <span className="text-[10px] text-emerald-700 font-bold font-mono">86.0% Floor Rate</span>
        </div>

        {/* Absent */}
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300">
          <div className="flex items-center gap-1.5 text-xs text-rose-800 font-bold mb-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Absent</span>
          </div>
          <div className="text-lg font-black text-rose-900">{absent}</div>
          <span className="text-[10px] text-rose-700 font-bold font-mono">5.8% Unplanned</span>
        </div>

        {/* On Leave */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300">
          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
            <span>On Leave</span>
          </div>
          <div className="text-lg font-black text-amber-900">{onLeave}</div>
          <span className="text-[10px] text-amber-700 font-bold font-mono">8.2% Approved</span>
        </div>

        {/* Late Arrivals */}
        <div className="p-3.5 rounded-xl bg-yellow-50 border border-yellow-300">
          <div className="flex items-center gap-1.5 text-xs text-yellow-800 font-bold mb-1">
            <Clock className="w-3.5 h-3.5 text-yellow-600" />
            <span>Late Arrivals</span>
          </div>
          <div className="text-lg font-black text-yellow-900">{lateArrivals}</div>
          <span className="text-[10px] text-yellow-700 font-bold font-mono">&gt;15 min grace</span>
        </div>

        {/* Overtime Employees */}
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-300">
          <div className="flex items-center gap-1.5 text-xs text-purple-800 font-bold mb-1">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>On Overtime</span>
          </div>
          <div className="text-lg font-black text-purple-900">{overtimeEmployees}</div>
          <span className="text-[10px] text-purple-700 font-bold font-mono">Extended Shift</span>
        </div>
      </div>
    </div>
  );
}
