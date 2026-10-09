"use client";

import React, { useState } from "react";
import { ComputedInventoryItem } from "@/types/inventory";
import { WAREHOUSES } from "@/lib/mock-data/inventory";
import { X, ArrowLeftRight, Save, Building2 } from "lucide-react";

interface StockTransferModalProps {
  item: ComputedInventoryItem | null;
  onClose: () => void;
  availableWarehouses?: string[];
  onSaveTransfer: (params: {
    itemId: string;
    targetWarehouse: string;
    transferQuantity: number;
    notes: string;
  }) => void;
}

export function StockTransferModal({
  item,
  onClose,
  availableWarehouses = [],
  onSaveTransfer,
}: StockTransferModalProps) {
  const warehouseList = availableWarehouses.length > 0 ? availableWarehouses : WAREHOUSES;
  const [targetWarehouse, setTargetWarehouse] = useState<string>(
    warehouseList.find((w) => w !== item?.warehouse) || warehouseList[0] || "Finished Goods Warehouse"
  );
  const [transferQuantity, setTransferQuantity] = useState<number>(100);
  const [notes, setNotes] = useState<string>("");

  if (!item) return null;

  const maxTransferable = item.availableQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferQuantity > maxTransferable) {
      alert(`Cannot transfer more than available unreserved stock (${maxTransferable} ${item.unit}).`);
      return;
    }
    onSaveTransfer({
      itemId: item.id,
      targetWarehouse,
      transferQuantity,
      notes,
    });
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Transfer Inventory</h3>
              <p className="text-xs text-slate-500 font-mono">
                {item.itemCode} • {item.itemName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Source vs Target */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Source Warehouse:</span>
              <span className="font-bold text-slate-900">{item.warehouse}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Available to Move:</span>
              <span className="font-mono font-bold text-cyan-800">
                {maxTransferable.toLocaleString()} {item.unit}
              </span>
            </div>
          </div>

          {/* Destination Warehouse */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              Destination Warehouse
            </label>
            <select
              value={targetWarehouse}
              onChange={(e) => setTargetWarehouse(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-600 cursor-pointer shadow-xs"
            >
              {warehouseList.filter((w) => w !== item.warehouse).map((wh) => (
                <option key={wh} value={wh}>
                  {wh}
                </option>
              ))}
            </select>
          </div>

          {/* Transfer Quantity */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              Transfer Quantity ({item.unit})
            </label>
            <input
              type="number"
              min={1}
              max={maxTransferable}
              required
              value={transferQuantity}
              onChange={(e) => setTransferQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              Transfer Manifest Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Relocating stock to buffer production bay..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white shadow-md shadow-cyan-600/20 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Confirm Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
