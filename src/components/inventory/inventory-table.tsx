"use client";

import React from "react";
import { ComputedInventoryItem } from "@/types/inventory";
import { InventoryStatusBadge } from "./inventory-status-badge";
import {
  Eye,
  Sliders,
  ArrowLeftRight,
  ShoppingCart,
  Boxes,
  Building2,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

interface InventoryTableProps {
  items: ComputedInventoryItem[];
  onViewItem: (item: ComputedInventoryItem) => void;
  onAdjustStock: (item: ComputedInventoryItem) => void;
  onTransferStock: (item: ComputedInventoryItem) => void;
  onCreatePurchaseRequest: (item: ComputedInventoryItem) => void;
}

export function InventoryTable({
  items,
  onViewItem,
  onAdjustStock,
  onTransferStock,
  onCreatePurchaseRequest,
}: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <Boxes className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No inventory items match your filter</h3>
        <p className="text-xs text-slate-500 font-medium">
          Try adjusting your search criteria or resetting your active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Table Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-4 h-4 text-cyan-600" />
            Inventory Stock Master
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time material availability, reserved work order allocations & stock valuation
          </p>
        </div>
        <span className="text-xs font-mono font-semibold text-cyan-800">
          {items.length} Items Listed
        </span>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden md:block max-h-[520px] overflow-y-auto overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs">
            <tr className="border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3 font-semibold">Item Code & Name</th>
              <th className="py-3 px-3 font-semibold">Category</th>
              <th className="py-3 px-3 font-semibold">Warehouse</th>
              <th className="py-3 px-3 font-semibold text-right">Available Stock</th>
              <th className="py-3 px-3 font-semibold text-right">Reorder Lvl</th>
              <th className="py-3 px-3 font-semibold text-right">Unit Cost</th>
              <th className="py-3 px-3 font-semibold text-right">Stock Value</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Code & Name */}
                <td className="py-3.5 pr-3 whitespace-nowrap">
                  <div className="font-mono font-bold text-cyan-800">
                    {item.itemCode}
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {item.itemName}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-3 whitespace-nowrap text-slate-700">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
                    {item.category}
                  </span>
                </td>

                {/* Warehouse */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="text-slate-900 font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    {item.warehouse}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {item.locationBin}
                  </div>
                </td>

                {/* Available Quantity (Calculated) */}
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  <span
                    className={
                      item.status === "Critical"
                        ? "text-rose-700 font-extrabold"
                        : item.status === "Low Stock"
                        ? "text-amber-700 font-bold"
                        : "text-emerald-700 font-bold"
                    }
                  >
                    {item.availableQuantity.toLocaleString()} {item.unit}
                  </span>
                </td>

                {/* Reorder Level */}
                <td className="py-3.5 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                  {item.reorderLevel.toLocaleString()} {item.unit}
                </td>

                {/* Unit Cost */}
                <td className="py-3.5 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                  ₹{item.unitCost.toFixed(2)}
                </td>

                {/* Stock Value (Calculated) */}
                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  ₹{item.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <InventoryStatusBadge status={item.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    {/* View Details */}
                    <button
                      onClick={() => onViewItem(item)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-300 text-slate-600 border border-slate-200 transition shadow-xs"
                      title="View Stock Movement & Transaction Details"
                      aria-label="View Item"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Adjust Stock */}
                    <button
                      onClick={() => onAdjustStock(item)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-600 border border-slate-200 transition shadow-xs"
                      title="Adjust Physical Stock Count"
                      aria-label="Adjust Stock"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>

                    {/* Transfer Stock */}
                    <button
                      onClick={() => onTransferStock(item)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 text-slate-600 border border-slate-200 transition shadow-xs"
                      title="Transfer Between Warehouses"
                      aria-label="Transfer Stock"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Create Purchase Request */}
                    <button
                      onClick={() => onCreatePurchaseRequest(item)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-600 border border-slate-200 transition shadow-xs"
                      title="Create Purchase Request for Procurement"
                      aria-label="Purchase Request"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-800">
                  {item.itemCode}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {item.itemName}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {item.warehouse} • {item.locationBin}
                </span>
              </div>
              <InventoryStatusBadge status={item.status} />
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-200">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Reorder Lvl</span>
                <span className="font-mono text-slate-700 font-medium">
                  {item.reorderLevel.toLocaleString()} {item.unit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Available Stock</span>
                <span
                  className={`font-mono font-bold ${
                    item.status === "Critical" ? "text-rose-700" : "text-emerald-700"
                  }`}
                >
                  {item.availableQuantity.toLocaleString()} {item.unit}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Stock Value:</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{item.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => onViewItem(item)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 flex items-center gap-1 transition"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-700" />
                <span>View</span>
              </button>
              <button
                onClick={() => onAdjustStock(item)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                title="Adjust"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onTransferStock(item)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                title="Transfer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onCreatePurchaseRequest(item)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-emerald-700 border border-slate-200 transition"
                title="Purchase Request"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
