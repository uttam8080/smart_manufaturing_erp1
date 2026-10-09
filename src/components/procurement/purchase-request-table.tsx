"use client";

import React from "react";
import {
  PurchaseRequest,
  RequestStatus,
  RequestPriority,
} from "@/types/procurement";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Eye,
  PlusCircle,
  Building,
} from "lucide-react";

interface PurchaseRequestTableProps {
  requests: PurchaseRequest[];
  onApprove: (request: PurchaseRequest) => void;
  onReject: (request: PurchaseRequest) => void;
  onConvertToPo: (request: PurchaseRequest) => void;
  onViewDetails: (request: PurchaseRequest) => void;
  onSubmitPending?: (request: PurchaseRequest) => void;
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  switch (status) {
    case "Approved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Approved
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3 h-3 text-amber-600" />
          Pending
        </span>
      );
    case "Converted to PO":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-300">
          <ArrowRight className="w-3 h-3 text-cyan-600" />
          Converted to PO
        </span>
      );
    case "Rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-600" />
          Rejected
        </span>
      );
    case "Draft":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
          Draft
        </span>
      );
  }
}

export function RequestPriorityBadge({ priority }: { priority: RequestPriority }) {
  switch (priority) {
    case "Urgent":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-900 border border-red-300">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          Urgent
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          High
        </span>
      );
    case "Normal":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
          Normal
        </span>
      );
    case "Low":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
          Low
        </span>
      );
  }
}

export function PurchaseRequestTable({
  requests,
  onApprove,
  onReject,
  onConvertToPo,
  onViewDetails,
  onSubmitPending,
}: PurchaseRequestTableProps) {
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

  if (requests.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <FileText className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No purchase requests found</h3>
        <p className="text-xs text-slate-600 font-medium">
          Try clearing search filters or create a new purchase requisition.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Purchase Requests</h3>
            <p className="text-xs text-slate-600 font-medium">
              Departmental requisition demands, material approvals, and procurement order queue
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">
          {requests.length} Demands
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden xl:block max-h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-700 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4">Request ID</th>
              <th className="py-3.5 px-4">Requested By</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Material</th>
              <th className="py-3.5 px-4 text-right">Quantity</th>
              <th className="py-3.5 px-4">Required Date</th>
              <th className="py-3.5 px-4 text-right">Est. Cost</th>
              <th className="py-3.5 px-4 text-center">Priority</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-700 whitespace-nowrap">
                  {r.requestId}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {r.requestedBy}
                </td>
                <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {r.department}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate" title={r.material}>
                  {r.material}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900 whitespace-nowrap">
                  {(r.quantity ?? 0).toLocaleString()} {r.unit}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                  {formatDate(r.requiredDate)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700 whitespace-nowrap">
                  ₹{(r.estimatedTotalCost ?? 0).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <RequestPriorityBadge priority={r.priority} />
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <RequestStatusBadge status={r.status} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {r.status === "Draft" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onSubmitPending ? onSubmitPending(r) : onApprove(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 transition-colors cursor-pointer"
                          title="Submit Draft to Pending Approval"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition-colors cursor-pointer"
                          title="Reject / Cancel Requisition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === "Pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
                          title="Approve Requisition"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(r)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition-colors cursor-pointer"
                          title="Reject Requisition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === "Approved" && (
                      <button
                        type="button"
                        onClick={() => onConvertToPo(r)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        title="Convert Approved PR into Official PO"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Create PO</span>
                      </button>
                    )}
                    {r.status === "Rejected" && (
                      <button
                        type="button"
                        onClick={() => onSubmitPending ? onSubmitPending(r) : onApprove(r)}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                        title="Re-open Requisition to Pending"
                      >
                        Re-open
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onViewDetails(r)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer"
                      title="View Full Requisition Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:hidden">
        {requests.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-700 block">
                  {r.requestId}
                </span>
                <span className="font-bold text-slate-900 text-sm">{r.material}</span>
                <span className="text-xs text-slate-600 font-medium block">
                  {r.department} • {r.requestedBy}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <RequestStatusBadge status={r.status} />
                <RequestPriorityBadge priority={r.priority} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Quantity</span>
                <span className="font-mono font-extrabold text-slate-900">
                  {(r.quantity ?? 0).toLocaleString()} {r.unit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block">Est. Cost</span>
                <span className="font-mono font-extrabold text-emerald-700">
                  ₹{(r.estimatedTotalCost ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-600 font-medium">
                Required: {formatDate(r.requiredDate)}
              </span>
              <div className="flex items-center gap-1.5">
                {r.status === "Draft" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onSubmitPending ? onSubmitPending(r) : onApprove(r)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-300"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(r)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300"
                    >
                      Reject
                    </button>
                  </>
                )}
                {r.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onApprove(r)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(r)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300"
                    >
                      Reject
                    </button>
                  </>
                )}
                {r.status === "Approved" && (
                  <button
                    type="button"
                    onClick={() => onConvertToPo(r)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-600 text-white"
                  >
                    Create PO
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onViewDetails(r)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 cursor-pointer"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
