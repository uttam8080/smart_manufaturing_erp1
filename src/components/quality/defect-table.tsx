"use client";

import React from "react";
import { QualityDefect, DefectSeverity, DefectStatus } from "@/types/quality";
import { DEFECT_COLORS } from "@/lib/mock-data/quality";
import {
  AlertTriangle,
  AlertOctagon,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  Eye,
  FileEdit,
} from "lucide-react";

interface DefectTableProps {
  defects: QualityDefect[];
  onViewDefect: (defect: QualityDefect) => void;
  onInvestigateDefect: (defect: QualityDefect) => void;
  onResolveDefect: (defect: QualityDefect) => void;
  onUpdateIssueModal: (defect: QualityDefect) => void;
}

export function DefectSeverityBadge({ severity }: { severity: DefectSeverity }) {
  switch (severity) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
          <AlertOctagon className="w-3 h-3 text-red-600" />
          Critical
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          High
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Medium
        </span>
      );
    case "Low":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
          Low
        </span>
      );
  }
}

export function DefectStatusBadge({ status }: { status: DefectStatus }) {
  switch (status) {
    case "Open":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <Clock className="w-3 h-3 text-rose-600" />
          Open
        </span>
      );
    case "Investigating":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Search className="w-3 h-3 text-amber-600" />
          Investigating
        </span>
      );
    case "Resolved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
          <Wrench className="w-3 h-3 text-blue-600" />
          Resolved
        </span>
      );
    case "Closed":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Closed
        </span>
      );
  }
}

export function DefectTable({
  defects,
  onViewDefect,
  onInvestigateDefect,
  onResolveDefect,
  onUpdateIssueModal,
}: DefectTableProps) {
  if (defects.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No active defect records found</h3>
        <p className="text-xs text-slate-600 font-medium">All non-conformance issues are resolved.</p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Quality Defects</h3>
            <p className="text-xs text-slate-600 font-medium">
              Non-conformance root cause records, quarantine actions, and CAPA resolution tracking
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
          {defects.length} Issues Logged
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4">Defect ID</th>
              <th className="py-3.5 px-4">Inspection</th>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Batch</th>
              <th className="py-3.5 px-4">Defect Mode</th>
              <th className="py-3.5 px-4 text-right">Quantity</th>
              <th className="py-3.5 px-4 text-center">Severity</th>
              <th className="py-3.5 px-4 max-w-xs">Root Cause</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
            {defects.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-rose-700 whitespace-nowrap">
                  {d.qualityDefectId}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-700 whitespace-nowrap">
                  {d.inspectionNumber}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {d.product}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700 font-medium whitespace-nowrap">
                  {d.batchNumber}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className="px-2 py-0.5 rounded font-bold text-[11px] border"
                    style={{
                      color: DEFECT_COLORS[d.defectType],
                      backgroundColor: `${DEFECT_COLORS[d.defectType]}15`,
                      borderColor: `${DEFECT_COLORS[d.defectType]}40`,
                    }}
                  >
                    {d.defectType}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                  {d.defectQuantity.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <DefectSeverityBadge severity={d.severity} />
                </td>
                <td className="py-3.5 px-4 max-w-xs text-slate-700 font-medium truncate" title={d.rootCause}>
                  {d.rootCause}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <DefectStatusBadge status={d.status} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateIssueModal(d)}
                      title="Update Root Cause & Corrective Action"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-cyan-600" />
                    </button>
                    {d.status === "Open" && (
                      <button
                        type="button"
                        onClick={() => onInvestigateDefect(d)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
                      >
                        Investigate
                      </button>
                    )}
                    {(d.status === "Open" || d.status === "Investigating") && (
                      <button
                        type="button"
                        onClick={() => onResolveDefect(d)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors cursor-pointer"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onViewDefect(d)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer"
                      title="View Full Defect Audit"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {defects.map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-rose-700 block">
                  {d.qualityDefectId}
                </span>
                <span className="font-bold text-slate-900 text-sm">{d.product}</span>
                <span className="text-xs text-slate-600 font-mono block">
                  {d.defectType} • {d.defectQuantity} units
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <DefectSeverityBadge severity={d.severity} />
                <DefectStatusBadge status={d.status} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-700 font-bold block mb-0.5">Root Cause:</span>
              <p className="text-slate-800 font-medium line-clamp-2">{d.rootCause}</p>
            </div>

            <div className="flex items-center justify-between pt-1 gap-2">
              <button
                type="button"
                onClick={() => onUpdateIssueModal(d)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300"
              >
                <FileEdit className="w-3.5 h-3.5 text-cyan-600" />
                <span>Update CAPA</span>
              </button>
              <div className="flex items-center gap-1.5">
                {d.status === "Open" && (
                  <button
                    type="button"
                    onClick={() => onInvestigateDefect(d)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"
                  >
                    Investigate
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onResolveDefect(d)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
