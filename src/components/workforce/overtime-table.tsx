"use client";

import React, { useState } from "react";
import { OvertimeRecord, OvertimeApprovalStatus } from "@/types/workforce";
import { Timer, AlertCircle, CheckCircle2, XCircle, Clock, ShieldAlert, Check, X } from "lucide-react";

interface OvertimeTableProps {
  records: OvertimeRecord[];
  onUpdateStatus?: (recordId: string, status: OvertimeApprovalStatus) => void;
}

export function OvertimeTable({ records, onUpdateStatus }: OvertimeTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredRecords = records.filter((r) => {
    if (filterStatus === "All") return true;
    return r.approvalStatus === filterStatus;
  });

  const totalOvertime = records.reduce((sum, r) => sum + r.overtimeHours, 0);
  const highOtCount = records.filter((r) => r.isHighOvertime).length;

  const getStatusBadge = (status: OvertimeApprovalStatus) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Overtime Monitoring</h3>
              <p className="text-xs text-slate-600 font-medium">Shift extensions, operational justifications & approval workflow</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {highOtCount > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                {highOtCount} High-OT Records (&gt;4h)
              </span>
            )}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Overtime Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Regular</th>
                <th className="py-3 px-3 text-right">Overtime</th>
                <th className="py-3 px-3 text-right">Total Hours</th>
                <th className="py-3 px-3">Reason / Justification</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                    No overtime records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>{item.employeeName}</div>
                      <div className="text-[10px] text-cyan-800 font-mono font-medium">{item.employeeId}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {item.department}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-mono text-[11px] font-medium">{item.date}</td>
                    <td className="py-3 px-3 text-right text-slate-700 font-mono font-medium">{item.regularHours.toFixed(1)}h</td>
                    <td className="py-3 px-3 text-right font-mono">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`font-bold ${item.isHighOvertime ? "text-amber-800" : "text-slate-800"}`}>
                          +{item.overtimeHours.toFixed(1)}h
                        </span>
                        {item.isHighOvertime && (
                          <span
                            title="Unusually high overtime (>4 hours)"
                            className="p-0.5 rounded bg-amber-50 text-amber-800 text-[10px]"
                          >
                            ⚠️
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900 font-black font-mono">
                      {item.totalHours.toFixed(1)}h
                    </td>
                    <td className="py-3 px-3 max-w-xs text-slate-700 font-medium text-[11px] leading-relaxed line-clamp-2" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-3 px-3 text-center">{getStatusBadge(item.approvalStatus)}</td>
                    <td className="py-3 px-3 text-right">
                      {item.approvalStatus === "Pending" && onUpdateStatus ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onUpdateStatus(item.id, "Approved")}
                            title="Approve Overtime"
                            className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(item.id, "Rejected")}
                            title="Reject Overtime"
                            className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span>Logged OT Period: <strong className="text-slate-900 font-bold">Current Billing Cycle</strong></span>
        <span className="text-purple-800 font-bold">Total Cumulative OT: {totalOvertime.toFixed(1)} hrs</span>
      </div>
    </div>
  );
}
