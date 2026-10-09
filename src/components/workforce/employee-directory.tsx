"use client";

import React from "react";
import {
  EmployeeItem,
  EmployeeStatus,
  AttendanceStatus,
} from "@/types/workforce";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  AlertCircle,
  Eye,
  TrendingUp,
  Building,
} from "lucide-react";

interface EmployeeDirectoryProps {
  employees: EmployeeItem[];
  onViewEmployee: (employee: EmployeeItem) => void;
}

export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  switch (status) {
    case "Active":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Active
        </span>
      );
    case "On Leave":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <CalendarDays className="w-3 h-3 text-amber-600" />
          On Leave
        </span>
      );
    case "Inactive":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
          <AlertCircle className="w-3 h-3 text-slate-500" />
          Inactive
        </span>
      );
  }
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  switch (status) {
    case "Present":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Present
        </span>
      );
    case "Late":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-300">
          <Clock className="w-3 h-3 text-yellow-600" />
          Late
        </span>
      );
    case "Leave":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <CalendarDays className="w-3 h-3 text-amber-600" />
          On Leave
        </span>
      );
    case "Half Day":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
          Half Day
        </span>
      );
    case "Absent":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-600" />
          Absent
        </span>
      );
  }
}

export function EmployeeDirectory({
  employees,
  onViewEmployee,
}: EmployeeDirectoryProps) {
  if (employees.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <Users className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No employees found</h3>
        <p className="text-xs text-slate-600">Try clearing filters or add a new employee.</p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Employee Directory</h3>
            <p className="text-xs text-slate-600 font-medium">
              Plant personnel roster, shift assignments, real-time floor attendance, and productivity scores
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-xl border border-blue-300">
          {employees.length} Personnel
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4">Employee ID</th>
              <th className="py-3.5 px-4">Full Name</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Designation</th>
              <th className="py-3.5 px-4">Shift</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center">Today Attendance</th>
              <th className="py-3.5 px-4 text-right">Productivity</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {employees.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-800 whitespace-nowrap">
                  {e.employeeId}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {e.name}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {e.department}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">{e.designation}</td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 border border-slate-200 text-slate-800">
                    {e.shift}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <EmployeeStatusBadge status={e.status} />
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <AttendanceStatusBadge status={e.todayAttendance} />
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-800 whitespace-nowrap">
                  {e.productivityScore}%
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewEmployee(e)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-600" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {employees.map((e) => (
          <div
            key={e.id}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-800 block">
                  {e.employeeId}
                </span>
                <span className="font-bold text-slate-900 text-sm">{e.name}</span>
                <span className="text-slate-600 font-medium text-[11px] block">
                  {e.designation} • {e.department}
                </span>
              </div>
              <EmployeeStatusBadge status={e.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Shift</span>
                <span className="text-slate-800 font-medium">{e.shift}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block">Today Status</span>
                <AttendanceStatusBadge status={e.todayAttendance} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-700 font-medium">
                Productivity: <strong className="text-emerald-800 font-mono font-bold">{e.productivityScore}%</strong>
              </span>
              <button
                type="button"
                onClick={() => onViewEmployee(e)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-300"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
