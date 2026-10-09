"use client";

import React, { useState, useEffect } from "react";
import { PurchaseOrderItem, PODeliveryStatus, POStatus } from "@/types/procurement";
import {
  X,
  PackageCheck,
  Building,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
} from "lucide-react";

interface ReceivePurchaseOrderModalProps {
  order: PurchaseOrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReceiveSuccess: (
    poId: string,
    receivedQty: number,
    newPoStatus: POStatus,
    newDeliveryStatus: PODeliveryStatus
  ) => void;
}

export function ReceivePurchaseOrderModal({
  order,
  isOpen,
  onClose,
  onReceiveSuccess,
}: ReceivePurchaseOrderModalProps) {
  const [receiveQuantity, setReceiveQuantity] = useState<number>(0);
  const [grnNumber, setGrnNumber] = useState("");
  const [receivingBay, setReceivingBay] = useState("Bay 1 — Main Raw Material Dock");
  const [qaInspectionRequired, setQaInspectionRequired] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order && order.items.length > 0) {
      const primaryItem = order.items[0];
      const remaining = Math.max(0, primaryItem.quantity - primaryItem.receivedQuantity);
      setReceiveQuantity(remaining);
      const randomGrn = Math.floor(100 + Math.random() * 900);
      setGrnNumber(`GRN-2026-0${randomGrn}`);
      setError("");
    }
  }, [order]);

  if (!isOpen || !order || order.items.length === 0) return null;

  const primaryItem = order.items[0];
  const orderedQty = primaryItem.quantity;
  const previouslyReceived = primaryItem.receivedQuantity;
  const maxReceivable = Math.max(0, orderedQty - previouslyReceived);
  const remainingAfterThis = Math.max(0, maxReceivable - (Number(receiveQuantity) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyToReceive = Number(receiveQuantity);

    if (isNaN(qtyToReceive) || qtyToReceive <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    if (qtyToReceive > maxReceivable) {
      setError(`Cannot receive more than remaining pending quantity (${maxReceivable.toLocaleString()} ${primaryItem.unit}).`);
      return;
    }

    const totalNowReceived = previouslyReceived + qtyToReceive;
    const isFullyReceived = totalNowReceived >= orderedQty;

    const newPoStatus: POStatus = isFullyReceived ? "Received" : "Partially Received";
    const newDeliveryStatus: PODeliveryStatus = isFullyReceived ? "Delivered" : "In Transit";

    onReceiveSuccess(order.id, qtyToReceive, newPoStatus, newDeliveryStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 text-xs text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Receive Goods Receipt Note (GRN)</h3>
              <p className="text-slate-600 font-mono text-[11px] font-medium">
                {order.poNumber} • {order.supplierName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Material & Numbers Review Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Item Material:</span>
              <span className="font-bold text-slate-900 text-sm">{primaryItem.material}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold block">Ordered</span>
                <span className="font-mono font-bold text-slate-900">
                  {orderedQty.toLocaleString()} {primaryItem.unit}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-emerald-300 shadow-xs">
                <span className="text-[10px] text-emerald-700 font-bold block">Prev. Received</span>
                <span className="font-mono font-extrabold text-emerald-700">
                  {previouslyReceived.toLocaleString()} {primaryItem.unit}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-amber-300 shadow-xs">
                <span className="text-[10px] text-amber-700 font-bold block">Remaining Pending</span>
                <span className="font-mono font-extrabold text-amber-700">
                  {maxReceivable.toLocaleString()} {primaryItem.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Receive Quantity Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Quantity to Receive Now ({primaryItem.unit}) *
              </label>
              <input
                type="number"
                min="1"
                max={maxReceivable}
                value={receiveQuantity}
                onChange={(e) => {
                  setReceiveQuantity(Number(e.target.value));
                  setError("");
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                GRN Reference # *
              </label>
              <input
                type="text"
                value={grnNumber}
                onChange={(e) => setGrnNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Receiving Bay & QA Check */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Receiving Bay Dock
            </label>
            <select
              value={receivingBay}
              onChange={(e) => setReceivingBay(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white cursor-pointer"
            >
              <option value="Bay 1 — Main Raw Material Dock">Bay 1 — Main Raw Material Dock</option>
              <option value="Bay 2 — Packaging Storage Inflow">Bay 2 — Packaging Storage Inflow</option>
              <option value="Bay 3 — Chemical & Sanitation Inflow">Bay 3 — Chemical & Sanitation Inflow</option>
              <option value="Bay 4 — Mechanical Spares Quarantine">Bay 4 — Mechanical Spares Quarantine</option>
            </select>
          </div>

          {/* Balance Preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-semibold">Balance Remaining After Receipt:</span>
            <span className="font-mono font-bold text-slate-900">
              {remainingAfterThis.toLocaleString()} {primaryItem.unit}{" "}
              {remainingAfterThis === 0 ? (
                <span className="text-emerald-700 text-[11px] font-bold">(100% Fulfilled)</span>
              ) : (
                <span className="text-amber-700 text-[11px] font-bold">(Partial Inflow)</span>
              )}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 rounded-lg transition-colors shadow-md shadow-cyan-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Confirm Goods Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
