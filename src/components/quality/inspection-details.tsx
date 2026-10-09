"use client";

import React from "react";
import { QualityInspection, QualityDefect } from "@/types/quality";
import { InspectionStatusBadge } from "./inspection-table";
import { DefectSeverityBadge, DefectStatusBadge } from "./defect-table";
import { DEFECT_COLORS } from "@/lib/mock-data/quality";
import {
  X,
  ClipboardCheck,
  Package,
  Calendar,
  User,
  Hash,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
} from "lucide-react";

interface InspectionDetailsProps {
  inspection: QualityInspection | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDefect?: (defect: QualityDefect) => void;
}

export function InspectionDetails({
  inspection,
  isOpen,
  onClose,
  onUpdateDefect,
}: InspectionDetailsProps) {
  if (!isOpen || !inspection) return null;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const passPercent =
    inspection.inspectedQuantity > 0
      ? ((inspection.passedQuantity / inspection.inspectedQuantity) * 100).toFixed(1)
      : "100.0";

  const failPercent =
    inspection.inspectedQuantity > 0
      ? ((inspection.failedQuantity / inspection.inspectedQuantity) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {inspection.inspectionNumber}
                </h2>
                <InspectionStatusBadge status={inspection.status} />
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Batch QA Conformance Record & Lot Sampling Audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with vertical scrollbar */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs custom-scrollbar">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Product</span>
              <span className="text-sm font-extrabold text-slate-900 block truncate">
                {inspection.product}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Production Order</span>
              <span className="text-sm font-mono font-bold text-cyan-700 block">
                {inspection.productionOrderId}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Batch Number</span>
              <span className="text-sm font-mono font-bold text-slate-800 block">
                {inspection.batchNumber}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Assigned Inspector</span>
              <span className="text-sm font-bold text-slate-900 block truncate">
                {inspection.inspectorName}
              </span>
            </div>
          </div>

          {/* Date & Sampling Meta */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              Inspection Date: <strong className="text-slate-900 font-bold">{formatDate(inspection.inspectionDate)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              Inspector ID: <strong className="text-cyan-800 font-mono font-bold">{inspection.inspectorEmployeeId}</strong>
            </span>
          </div>

          {/* Inspection Result Visual Comparison */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-700" />
              <span>Inspection Result & Sampling Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-bold block mb-1">Total Inspected</span>
                <span className="text-2xl font-extrabold font-mono text-slate-900">
                  {inspection.inspectedQuantity.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-1">100% Sample Size</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-emerald-800 font-bold block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed Quantity
                </span>
                <span className="text-2xl font-extrabold font-mono text-emerald-700">
                  {inspection.passedQuantity.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-800 font-bold block mt-1">{passPercent}% Conformance</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                <span className="text-rose-800 font-bold block mb-1 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Failed Quantity
                </span>
                <span className="text-2xl font-extrabold font-mono text-rose-700">
                  {inspection.failedQuantity.toLocaleString()}
                </span>
                <span className="text-[11px] text-rose-800 font-bold block mt-1">{failPercent}% Non-conforming</span>
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${passPercent}%` }}
                title={`Passed: ${passPercent}%`}
              />
              <div
                className="bg-rose-500 h-full transition-all"
                style={{ width: `${failPercent}%` }}
                title={`Failed: ${failPercent}%`}
              />
            </div>
          </div>

          {/* Notes */}
          {inspection.notes && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                <FileText className="w-4 h-4 text-cyan-700" />
                <span>Inspector Observations & Compliance Notes</span>
              </div>
              <p className="text-slate-800 text-sm font-medium leading-relaxed">{inspection.notes}</p>
            </div>
          )}

          {/* Defect Details (For Non-Conformances) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Defect Details & CAPA Non-Conformance Logs</span>
            </h3>

            {inspection.defects.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span>Zero major or critical defects logged for this batch inspection.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {inspection.defects.map((def) => (
                  <div
                    key={def.id}
                    className="p-4 rounded-xl bg-white border border-rose-200 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-rose-700">
                          {def.qualityDefectId}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded font-bold text-xs border"
                          style={{
                            color: DEFECT_COLORS[def.defectType],
                            backgroundColor: `${DEFECT_COLORS[def.defectType]}15`,
                            borderColor: `${DEFECT_COLORS[def.defectType]}40`,
                          }}
                        >
                          {def.defectType} ({def.defectQuantity} units)
                        </span>
                        <DefectSeverityBadge severity={def.severity} />
                      </div>

                      <div className="flex items-center gap-2">
                        <DefectStatusBadge status={def.status} />
                        {onUpdateDefect && (
                          <button
                            type="button"
                            onClick={() => onUpdateDefect(def)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-300 transition-colors cursor-pointer"
                          >
                            Update CAPA
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-700 font-bold block mb-1">
                          Root Cause Analysis:
                        </span>
                        <p className="text-slate-800 font-medium">{def.rootCause}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-cyan-800 font-bold block mb-1">
                          Corrective & Preventive Action (CAPA):
                        </span>
                        <p className="text-slate-800 font-medium">{def.correctiveAction}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium shrink-0">
          <span>
            Database schema target: <code className="text-cyan-800 font-bold">quality_inspections</code> & <code className="text-cyan-800 font-bold">quality_defects</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
