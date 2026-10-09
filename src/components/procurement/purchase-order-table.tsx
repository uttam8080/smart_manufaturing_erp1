"use client";

import React from "react";
import {
  PurchaseOrderItem,
  POStatus,
  PODeliveryStatus,
  POPaymentStatus,
} from "@/types/procurement";
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  XCircle,
  Eye,
  PackageCheck,
  Building,
} from "lucide-react";

interface PurchaseOrderTableProps {
  orders: PurchaseOrderItem[];
  onViewDetails: (order: PurchaseOrderItem) => void;
  onApprove: (order: PurchaseOrderItem) => void;
  onReject: (order: PurchaseOrderItem) => void;
  onReceive: (order: PurchaseOrderItem) => void;
}

export function POStatusBadge({ status }: { status: POStatus }) {
  switch (status) {
    case "Received":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Received
        </span>
      );
    case "Partially Received":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-300">
          <PackageCheck className="w-3 h-3 text-cyan-600" />
          Partially Received
        </span>
      );
    case "Ordered":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
          <Truck className="w-3 h-3 text-blue-600" />
          Ordered
        </span>
      );
    case "Confirmed":
    case "Approved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          {status === "Confirmed" ? "Confirmed" : "Approved"}
        </span>
      );
    case "Pending Approval":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3 h-3 text-amber-600" />
          Pending Approval
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-600" />
          Cancelled
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

export function DeliveryStatusBadge({ status }: { status: PODeliveryStatus }) {
  switch (status) {
    case "Delivered":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Delivered
        </span>
      );
    case "In Transit":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-300">
          <Truck className="w-3 h-3 text-cyan-600" />
          In Transit
        </span>
      );
    case "Delayed":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Delayed
        </span>
      );
    case "Not Shipped":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
          Not Shipped
        </span>
      );
  }
}

export function PaymentStatusBadge({ status }: { status: POPaymentStatus }) {
  switch (status) {
    case "Paid":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          Paid
        </span>
      );
    case "Partially Paid":
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300">
          Partially Paid
        </span>
      );
    case "Pending":
    default:
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
          Pending
        </span>
      );
  }
}

export function PurchaseOrderTable({
  orders,
  onViewDetails,
  onApprove,
  onReject,
  onReceive,
}: PurchaseOrderTableProps) {
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

  if (orders.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <ShoppingCart className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No purchase orders found</h3>
        <p className="text-xs text-slate-600 font-medium">Try adjusting your filters or generate a new PO.</p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Purchase Orders</h3>
            <p className="text-xs text-slate-600 font-medium">
              Contracted supplier orders, dispatch lead times, dock receiving, and invoice matching
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
          {orders.length} Purchase Orders
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden xl:block max-h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-700 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4">PO Number</th>
              <th className="py-3.5 px-4">Supplier</th>
              <th className="py-3.5 px-4">Order Date</th>
              <th className="py-3.5 px-4">Expected Delivery</th>
              <th className="py-3.5 px-4 text-right">Total Amount</th>
              <th className="py-3.5 px-4">Items / Materials</th>
              <th className="py-3.5 px-4 text-center">Payment</th>
              <th className="py-3.5 px-4 text-center">Delivery</th>
              <th className="py-3.5 px-4 text-center">PO Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-700 whitespace-nowrap">
                  {o.poNumber}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {o.supplierName}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                  {formatDate(o.orderDate)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                  {formatDate(o.expectedDelivery)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700 whitespace-nowrap">
                  ₹{(o.totalAmount ?? 0).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 max-w-xs truncate text-slate-700 font-medium">
                  {(o.items ?? []).map((it) => `${it.material || 'Item'} (${it.quantity || 0} ${it.unit || ''})`).join(", ")}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <PaymentStatusBadge status={o.paymentStatus} />
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <DeliveryStatusBadge status={o.deliveryStatus} />
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <POStatusBadge status={o.poStatus} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => onViewDetails(o)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer"
                      title="View Complete PO Audit"
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

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:hidden">
        {orders.map((o) => (
          <div
            key={o.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-700 block">
                  {o.poNumber}
                </span>
                <span className="font-bold text-slate-900 text-sm">{o.supplierName}</span>
                <span className="text-xs text-slate-500 font-medium block">
                  Exp: {formatDate(o.expectedDelivery)}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <POStatusBadge status={o.poStatus} />
                <DeliveryStatusBadge status={o.deliveryStatus} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600 font-semibold">Total Value:</span>
                <span className="font-mono font-extrabold text-emerald-700">
                  ₹{(o.totalAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-700 font-medium truncate">
                {(o.items ?? []).map((it) => `${it.material || 'Item'} (${it.quantity || 0} ${it.unit || ''})`).join(", ")}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <PaymentStatusBadge status={o.paymentStatus} />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onViewDetails(o)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 cursor-pointer"
                  title="View Complete PO Audit"
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
