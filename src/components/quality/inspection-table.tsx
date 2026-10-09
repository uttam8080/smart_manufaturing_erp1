"use client";

import React from "react";
import { QualityInspection, InspectionStatus } from "@/types/quality";
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ClipboardList,
  FileCheck,
} from "lucide-react";

interface InspectionTableProps {
  inspections: QualityInspection[];
  onViewInspection: (inspection: QualityInspection) => void;
}

export function InspectionStatusBadge({ status }: { status: InspectionStatus }) {
  switch (status) {
    case "Passed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Passed
        </span>
      );
    case "Failed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-600" />
          Failed
        </span>
      );
    case "Conditional":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Conditional
        </span>
      );
    case "Pending":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
          <Clock className="w-3 h-3 text-slate-600" />
          Pending
        </span>
      );
  }
}

export function InspectionTable({
  inspections,
  onViewInspection,
}: InspectionTableProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (inspections.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <ClipboardList className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No inspection records found</h3>
        <p className="text-xs text-slate-600 font-medium">
          Try clearing search filters or create a new quality inspection.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Recent Quality Inspections
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              In-line QA lot sampling records, conformity verification, and batch release status
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">
          {inspections.length} Records
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block max-h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-700 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4">Inspection #</th>
              <th className="py-3.5 px-4">Production Order</th>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Batch Number</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Inspected</th>
              <th className="py-3.5 px-4 text-right">Passed</th>
              <th className="py-3.5 px-4 text-right">Failed</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Inspector</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
            {inspections.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-700">
                  {item.inspectionNumber}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                  {item.productionOrderId}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {item.product}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                  {item.batchNumber}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                  {formatDate(item.inspectionDate)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  {item.inspectedQuantity.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                  {item.passedQuantity.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-700">
                  {item.failedQuantity > 0 ? item.failedQuantity.toLocaleString() : "0"}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <InspectionStatusBadge status={item.status} />
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                  {item.inspectorName}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewInspection(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-xs cursor-pointer"
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

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {inspections.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-700 block">
                  {item.inspectionNumber}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {item.product}
                </span>
                <span className="text-xs text-slate-600 font-mono block">
                  {item.batchNumber} • {item.productionOrderId}
                </span>
              </div>
              <InspectionStatusBadge status={item.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Inspected</span>
                <span className="font-mono font-bold text-slate-900">
                  {item.inspectedQuantity.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Passed</span>
                <span className="font-mono font-bold text-emerald-700">
                  {item.passedQuantity.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Failed</span>
                <span className="font-mono font-bold text-rose-700">
                  {item.failedQuantity.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-700 font-semibold">{item.inspectorName}</span>
              <button
                type="button"
                onClick={() => onViewInspection(item)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-600" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
