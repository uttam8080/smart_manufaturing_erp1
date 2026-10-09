"use client";

import React from "react";
import { MaterialProcurementRow, MaterialProcurementState } from "@/types/procurement";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  AlertOctagon,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

interface MaterialProcurementStatusProps {
  materials: MaterialProcurementRow[];
  onCreatePrForMaterial?: (materialName: string) => void;
}

export function MaterialStateBadge({ status }: { status: MaterialProcurementState }) {
  switch (status) {
    case "Sufficient":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Sufficient
        </span>
      );
    case "On Order":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-300">
          <Truck className="w-3 h-3 text-cyan-600" />
          On Order
        </span>
      );
    case "Reorder Required":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3 h-3 text-amber-600" />
          Reorder Required
        </span>
      );
    case "Delayed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Delayed
        </span>
      );
    case "Critical":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
          <AlertOctagon className="w-3 h-3 text-red-600" />
          Critical Buffer
        </span>
      );
  }
}

export function MaterialProcurementStatus({
  materials,
  onCreatePrForMaterial,
}: MaterialProcurementStatusProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Material Procurement Status
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Cross-module bridge syncing warehouse raw material stock with scheduled batch consumption
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">
          Inventory & Production Sync
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4">Material / SKU</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-right">Current Stock</th>
              <th className="py-3.5 px-4 text-right">Production Demand</th>
              <th className="py-3.5 px-4 text-right">On Order</th>
              <th className="py-3.5 px-4 text-right">Pending Inflow</th>
              <th className="py-3.5 px-4">Expected Delivery</th>
              <th className="py-3.5 px-4 text-center">Procurement Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 text-sm">{m.materialName}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{m.primarySupplier}</div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">{m.category}</td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                  {(m.currentStock ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                  {(m.requiredQuantity ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-700">
                  {(m.onOrderQuantity ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                  {(m.pendingQuantity ?? 0).toLocaleString()} {m.unit}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                  {m.expectedDelivery || "—"}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <MaterialStateBadge status={m.status} />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {onCreatePrForMaterial && (
                    <button
                      type="button"
                      onClick={() => onCreatePrForMaterial(m.materialName)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Reorder</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {materials.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">{m.materialName}</span>
                <span className="text-slate-500 text-[11px] font-medium">{m.primarySupplier}</span>
              </div>
              <MaterialStateBadge status={m.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Stock</span>
                <span className="font-mono font-bold text-slate-900">
                  {(m.currentStock ?? 0).toLocaleString()} {m.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-700 font-bold block">On Order</span>
                <span className="font-mono font-bold text-cyan-700">
                  {(m.onOrderQuantity ?? 0).toLocaleString()} {m.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 font-bold block">Pending</span>
                <span className="font-mono font-bold text-amber-700">
                  {(m.pendingQuantity ?? 0).toLocaleString()} {m.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600 font-medium text-[11px]">Exp: {m.expectedDelivery}</span>
              {onCreatePrForMaterial && (
                <button
                  type="button"
                  onClick={() => onCreatePrForMaterial(m.materialName)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Reorder PR</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
