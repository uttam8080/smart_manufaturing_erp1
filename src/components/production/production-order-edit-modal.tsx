"use client";

import React, { useState, useEffect } from "react";
import { ProductionOrder, ProductionPriority } from "@/types/production";
import { X, Edit2, Save, AlertCircle } from "lucide-react";

interface ProductionOrderEditModalProps {
  order: ProductionOrder | null;
  onClose: () => void;
  onSave: (updated: {
    id: string;
    plannedQuantity: number;
    priority: ProductionPriority;
    notes: string;
  }) => void;
}

export function ProductionOrderEditModal({
  order,
  onClose,
  onSave,
}: ProductionOrderEditModalProps) {
  const [plannedQuantity, setPlannedQuantity] = useState<number>(0);
  const [priority, setPriority] = useState<ProductionPriority>("Normal");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (order) {
      setPlannedQuantity(order.plannedQuantity);
      setPriority(order.priority);
      setNotes(order.notes || "");
    }
  }, [order]);

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: order.id,
      plannedQuantity,
      priority,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Production Order</h3>
              <p className="text-xs text-slate-500 font-mono font-medium">
                {order.orderNumber} • {order.product}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Planned Quantity */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Planned Target Quantity ({order.unit})
            </label>
            <input
              type="number"
              min={100}
              step={100}
              required
              value={plannedQuantity}
              onChange={(e) => setPlannedQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Scheduling Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ProductionPriority)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Operator Instructions & Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Work Order Instructions & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add shop floor instructions..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
