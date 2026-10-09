"use client";

import React from "react";
import { ProductionOrder } from "@/types/production";
import {
  ProductionPriorityBadge,
  ProductionStatusBadge,
} from "./status-badge";
import {
  X,
  ClipboardList,
  Calendar,
  Clock,
  Wrench,
  Layers,
  Boxes,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface ProductionOrderDetailsProps {
  order: ProductionOrder | null;
  onClose: () => void;
}

export function ProductionOrderDetails({
  order,
  onClose,
}: ProductionOrderDetailsProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-cyan-800">
                {order.orderNumber}
              </span>
              <ProductionStatusBadge status={order.status} />
              <ProductionPriorityBadge priority={order.priority} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{order.product}</h2>
            <p className="text-xs text-slate-500 font-mono font-medium">
              Batch: {order.batchNumber} • SKU: {order.productSku}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Production Output Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Planned Quantity
            </span>
            <span className="text-base font-bold font-mono text-slate-900">
              {order.plannedQuantity.toLocaleString()} {order.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Produced Quantity
            </span>
            <span className="text-base font-bold font-mono text-cyan-800">
              {order.actualQuantity.toLocaleString()} {order.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Good Quantity
            </span>
            <span className="text-base font-bold font-mono text-emerald-700">
              {order.goodQuantity.toLocaleString()} {order.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Rejected Quantity
            </span>
            <span className="text-base font-bold font-mono text-rose-700">
              {order.rejectedQuantity.toLocaleString()} {order.unit}
            </span>
          </div>
        </div>

        {/* 2. Efficiency & Quality Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Production Efficiency
              </span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {order.efficiency}%
              </span>
            </div>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  order.efficiency >= 95 ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(order.efficiency, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Rejection Rate
              </span>
              <span
                className={`text-lg font-bold font-mono ${
                  order.rejectionRate > 3.0 ? "text-rose-700" : "text-amber-700"
                }`}
              >
                {order.rejectionRate}%
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {order.rejectionRate <= 2.5 ? "Within 2.5% Target" : "Exceeds Target"}
            </span>
          </div>
        </div>

        {/* 3. Schedule & Machine Routing */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs text-xs space-y-2.5">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-cyan-600" />
            Machine Routing & Shift Timing
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Assigned Machine:</span>
              <span className="font-bold text-slate-900">{order.machine}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Assigned Shift:</span>
              <span className="font-bold text-slate-900">{order.shift} Shift</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Scheduled Window:</span>
              <span className="font-mono text-slate-800 font-semibold">
                {new Date(order.scheduledStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                {new Date(order.scheduledEnd).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Downtime Logged:</span>
              <span className="font-mono text-amber-700 font-bold">
                {order.downtimeMinutes} minutes
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="pt-1 text-[11px] text-slate-600 font-medium">
              <strong className="text-slate-900 font-bold">Operator Notes:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* 4. Bill of Materials (BOM) & Material Requirements */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-emerald-600" />
              Material Requirements & Issuance (BOM)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono font-medium">
              BOM v1.4 Formula
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px] font-bold bg-slate-50">
                  <th className="py-2.5 px-3 font-bold">Material Item</th>
                  <th className="py-2.5 px-3 font-bold text-right">Required Qty</th>
                  <th className="py-2.5 px-3 font-bold text-right">Issued Qty</th>
                  <th className="py-2.5 px-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.materials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {mat.materialName}
                      <span className="text-[10px] text-slate-500 block font-normal">
                        {mat.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-600">
                      {mat.requiredQuantity.toLocaleString()} {mat.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {mat.issuedQuantity.toLocaleString()} {mat.unit}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          mat.status === "Fully Issued"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                            : "bg-amber-50 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {mat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
}
