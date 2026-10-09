"use client";

import React from "react";
import { PurchaseOrderItem } from "@/types/procurement";
import {
  POStatusBadge,
  DeliveryStatusBadge,
  PaymentStatusBadge,
} from "./purchase-order-table";
import {
  X,
  ShoppingCart,
  Building,
  Calendar,
  User,
  CreditCard,
  Truck,
  PackageCheck,
  Receipt,
  FileText,
} from "lucide-react";

interface PurchaseOrderDetailsProps {
  order: PurchaseOrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReceive?: (order: PurchaseOrderItem) => void;
  onApprove?: (order: PurchaseOrderItem) => void;
  onReject?: (order: PurchaseOrderItem) => void;
}

export function PurchaseOrderDetails({
  order,
  isOpen,
  onClose,
  onReceive,
  onApprove,
  onReject,
}: PurchaseOrderDetailsProps) {
  if (!isOpen || !order) return null;

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

  const totalOrderedQty = (order.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0);
  const totalReceivedQty = (order.items || []).reduce((sum, it) => sum + (it.receivedQuantity || 0), 0);
  const totalPendingQty = Math.max(0, totalOrderedQty - totalReceivedQty);
  const pendingAmount = Math.max(0, (order.totalAmount || 0) - (order.paidAmount || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{order.poNumber}</h2>
                <POStatusBadge status={order.poStatus} />
                <DeliveryStatusBadge status={order.deliveryStatus} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Binding Commercial Purchase Agreement & Material Delivery Schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {order.poStatus === "Pending Approval" && onApprove && (
              <button
                type="button"
                onClick={() => {
                  onApprove(order);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Approve PO
              </button>
            )}
            {order.poStatus === "Pending Approval" && onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject(order);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-colors cursor-pointer"
              >
                Reject PO
              </button>
            )}
            {(order.poStatus === "Approved" ||
              order.poStatus === "Confirmed" ||
              order.poStatus === "Ordered" ||
              order.poStatus === "Partially Received") &&
              onReceive && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReceive(order);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Receive PO</span>
                </button>
              )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Contracted Supplier</span>
              <span className="text-sm font-extrabold text-slate-900 block truncate">
                {order.supplierName}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Purchase Order Date</span>
              <span className="text-sm font-bold text-slate-800 block">
                {formatDate(order.orderDate)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Expected Delivery</span>
              <span className="text-sm font-bold text-cyan-800 block">
                {formatDate(order.expectedDelivery)}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold block mb-1">Payment Terms</span>
              <span className="text-sm font-bold text-emerald-800 block truncate">
                {order.paymentTerms}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              Procurement Officer: <strong className="text-slate-900 font-bold">{order.buyer}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-500" />
              Contracted Total: <strong className="text-emerald-700 font-mono font-bold">₹{(order.totalAmount ?? 0).toLocaleString()}</strong>
            </span>
          </div>

          {/* 1. Order Items Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-700" />
              <span>Order Line Items</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Material / Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Tax (%)</th>
                    <th className="py-3 px-4 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {(order.items || []).map((it) => (
                    <tr key={it.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{it.material}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{it.category}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {(it.quantity ?? 0).toLocaleString()} {it.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-800">
                        ₹{(it.unitPrice ?? 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {it.taxPercent ?? 0}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-700">
                        ₹{(it.totalPrice ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Delivery & Fulfillment Information */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-700" />
              <span>Delivery & Receiving Fulfillment Status</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block">Ordered Qty</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {(totalOrderedQty ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-emerald-300 shadow-xs">
                <span className="text-[10px] text-emerald-700 font-bold block">Received Qty</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">
                  {(totalReceivedQty ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-300 shadow-xs">
                <span className="text-[10px] text-amber-700 font-bold block">Pending Qty</span>
                <span className="font-mono font-extrabold text-amber-700 text-sm">
                  {(totalPendingQty ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block">Expected Date</span>
                <span className="font-bold text-slate-800 text-xs">
                  {formatDate(order.expectedDelivery)}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 col-span-2 sm:col-span-1 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Status</span>
                <DeliveryStatusBadge status={order.deliveryStatus} />
              </div>
            </div>

            {/* Visual Delivery Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                <span>Receipt Completion</span>
                <span className="font-mono font-bold text-slate-900">
                  {totalOrderedQty > 0
                    ? ((totalReceivedQty / totalOrderedQty) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-emerald-500 transition-all"
                  style={{
                    width: `${totalOrderedQty > 0 ? (totalReceivedQty / totalOrderedQty) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Information */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-700" />
              <span>Payment & Invoice Reconciliation</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block">PO Total Value</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  ₹{(order.totalAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-emerald-300 shadow-xs">
                <span className="text-[10px] text-emerald-700 font-bold block">Paid Amount</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">
                  ₹{(order.paidAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-purple-300 shadow-xs">
                <span className="text-[10px] text-purple-700 font-bold block">Pending Balance</span>
                <span className="font-mono font-extrabold text-purple-700 text-sm">
                  ₹{(pendingAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">Payment Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                <FileText className="w-4 h-4 text-cyan-700" />
                <span>Commercial Dispatch & Freight Notes</span>
              </div>
              <p className="text-slate-800 text-sm font-medium leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium shrink-0">
          <span>
            Database schema target: <code className="text-cyan-800 font-bold">purchase_orders</code> & <code className="text-cyan-800 font-bold">goods_receipts</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold transition-colors cursor-pointer"
          >
            Close PO
          </button>
        </div>
      </div>
    </div>
  );
}
