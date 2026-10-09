"use client";

import React from "react";
import { PurchaseRequest } from "@/types/procurement";
import {
  RequestStatusBadge,
  RequestPriorityBadge,
} from "./purchase-request-table";
import {
  X,
  FileText,
  Building,
  Calendar,
  User,
  IndianRupee,
  Layers,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Send,
  Truck,
} from "lucide-react";

interface PurchaseRequestDetailsProps {
  request: PurchaseRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (request: PurchaseRequest) => void;
  onReject?: (request: PurchaseRequest) => void;
  onConvertToPo?: (request: PurchaseRequest) => void;
  onSubmitPending?: (request: PurchaseRequest) => void;
}

export function PurchaseRequestDetails({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onConvertToPo,
  onSubmitPending,
}: PurchaseRequestDetailsProps) {
  if (!isOpen || !request) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {request.requestId}
                </h2>
                <RequestStatusBadge status={request.status} />
                <RequestPriorityBadge priority={request.priority} />
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Internal Material Requisition & Shop Floor Demand
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Requested Quantity
              </span>
              <span className="text-lg font-extrabold font-mono text-cyan-700">
                {(request.quantity ?? 0).toLocaleString()} {request.unit}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Estimated Total Cost
              </span>
              <span className="text-lg font-extrabold font-mono text-emerald-700">
                ₹{(request.estimatedTotalCost ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Unit Est. Cost
              </span>
              <span className="text-lg font-extrabold font-mono text-slate-900">
                ₹{(request.estimatedUnitCost ?? 25).toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Category
              </span>
              <span className="text-sm font-bold text-purple-700 truncate block">
                {request.category || "Raw Materials"}
              </span>
            </div>
          </div>

          {/* Material & Request Info */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-700" />
              Requisition Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Material Item:</span>
                <span className="font-bold text-slate-900 text-sm">{request.material}</span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Requesting Department:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {request.department}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Requested By:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {request.requestedBy}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Required By Date:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {formatDate(request.requiredDate)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Preferred Supplier:</span>
                <span className="font-bold text-cyan-800 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-700" />
                  {request.supplierPreference || "Direct Qualified Supplier"}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Request Date:</span>
                <span className="font-bold text-slate-800">
                  {formatDate(request.requestedDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Reason & Notes */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
              Business Justification & Notes:
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              {request.reason || "Scheduled shop floor production buffer replenishment."}
            </p>
            {request.rejectionReason && (
              <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                <strong>Rejection Reason:</strong> {request.rejectionReason}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {request.status === "Draft" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onReject) onReject(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 text-xs font-bold transition cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSubmitPending) onSubmitPending(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit for Approval</span>
                </button>
              </>
            )}

            {request.status === "Pending" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onReject) onReject(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 text-xs font-bold transition cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onApprove) onApprove(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Request</span>
                </button>
              </>
            )}

            {request.status === "Approved" && (
              <button
                type="button"
                onClick={() => {
                  if (onConvertToPo) onConvertToPo(request);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Convert to Purchase Order</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
