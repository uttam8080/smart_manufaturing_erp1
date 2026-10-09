"use client";

import React from "react";
import { EmployeeItem } from "@/types/workforce";
import { EmployeeStatusBadge, AttendanceStatusBadge } from "./employee-directory";
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Package,
  Layers,
} from "lucide-react";

interface EmployeeDetailsProps {
  employee: EmployeeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetails({
  employee,
  isOpen,
  onClose,
}: EmployeeDetailsProps) {
  if (!isOpen || !employee) return null;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{employee.name}</h2>
                <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200">
                  {employee.employeeId}
                </span>
                <EmployeeStatusBadge status={employee.status} />
                <AttendanceStatusBadge status={employee.todayAttendance} />
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {employee.designation} • {employee.department} Department
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-bold block mb-1">Shift Schedule</span>
              <span className="text-sm font-bold text-slate-900 block truncate">
                {employee.shift}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-bold block mb-1">Joining Date</span>
              <span className="text-sm font-bold text-slate-900 block">
                {formatDate(employee.joiningDate)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-bold block mb-1">Phone Number</span>
              <span className="text-sm font-mono font-bold text-slate-900 block truncate">
                {employee.phone}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-bold block mb-1">Email Address</span>
              <span className="text-sm font-bold text-cyan-800 block truncate">
                {employee.email}
              </span>
            </div>
          </div>

          {/* 1. Attendance Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600" />
                <span>Monthly Attendance Summary (Last 24 Days)</span>
              </h3>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                {employee.attendanceRate}% Attendance Rate
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                <span className="text-[10px] text-emerald-800 font-bold block">Present Days</span>
                <span className="font-mono font-black text-emerald-900 text-lg">
                  {employee.presentDaysCount}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium block">shifts worked</span>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-300">
                <span className="text-[10px] text-rose-800 font-bold block">Absent Days</span>
                <span className="font-mono font-black text-rose-900 text-lg">
                  {employee.absentDaysCount}
                </span>
                <span className="text-[10px] text-rose-700 font-medium block">unplanned</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-300">
                <span className="text-[10px] text-amber-800 font-bold block">Leave Days</span>
                <span className="font-mono font-black text-amber-900 text-lg">
                  {employee.leaveDaysCount}
                </span>
                <span className="text-[10px] text-amber-700 font-medium block">approved</span>
              </div>

              <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-300">
                <span className="text-[10px] text-yellow-800 font-bold block">Late Clock-Ins</span>
                <span className="font-mono font-black text-yellow-900 text-lg">
                  {employee.lateArrivalsCount}
                </span>
                <span className="text-[10px] text-yellow-700 font-medium block">&gt;15 min delay</span>
              </div>
            </div>
          </div>

          {/* 2. Performance Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Plant Floor Performance & Skill Output</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block">Productivity Score</span>
                <span className="font-mono font-black text-emerald-800 text-lg">
                  {employee.productivityScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">AQL Level</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block">Today Units</span>
                <span className="font-mono font-black text-slate-900 text-lg">
                  {employee.unitsProducedToday.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">output units</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block">Quality Pass Rate</span>
                <span className="font-mono font-black text-cyan-800 text-lg">
                  {employee.qualityPassRate}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">inspection index</span>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-300">
                <span className="text-[10px] text-purple-800 font-bold block">Monthly Overtime</span>
                <span className="font-mono font-black text-purple-900 text-lg">
                  {employee.overtimeHoursMonth}h
                </span>
                <span className="text-[10px] text-purple-700 font-medium block">logged hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>
            Database schema target: <code className="text-cyan-800 font-bold">employees</code> & <code className="text-cyan-800 font-bold">attendance</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
