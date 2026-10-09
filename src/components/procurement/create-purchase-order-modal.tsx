"use client";

import React, { useState, useEffect } from "react";
import {
  PurchaseOrderItem,
  SupplierItem,
  MaterialCategory,
  PurchaseRequest,
} from "@/types/procurement";
import {
  X,
  ShoppingCart,
  Calendar,
  Building,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Package,
} from "lucide-react";

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPo: PurchaseOrderItem) => void;
  suppliers: SupplierItem[];
  prefilledFromRequest?: PurchaseRequest | null;
}

const CATEGORIES: MaterialCategory[] = [
  "Raw Materials",
  "Packaging",
  "Spare Parts",
  "Maintenance",
  "Operations",
];

export function CreatePurchaseOrderModal({
  isOpen,
  onClose,
  onSubmit,
  suppliers,
  prefilledFromRequest,
}: CreatePurchaseOrderModalProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "sup_001");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedDelivery, setExpectedDelivery] = useState(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );
  const [paymentTerms, setPaymentTerms] = useState("Net 30 Days");
  const [material, setMaterial] = useState("Wheat Flour (Refined)");
  const [category, setCategory] = useState<MaterialCategory>("Raw Materials");
  const [quantity, setQuantity] = useState<number>(15000);
  const [unit, setUnit] = useState("kg");
  const [unitPrice, setUnitPrice] = useState<number>(32);
  const [taxPercent, setTaxPercent] = useState<number>(5);
  const [notes, setNotes] = useState("Direct dock delivery at Receiving Bay 1. Certificate of Analysis (CoA) required with shipment.");

  useEffect(() => {
    if (prefilledFromRequest) {
      setMaterial(prefilledFromRequest.material);
      setCategory(prefilledFromRequest.category);
      setQuantity(prefilledFromRequest.quantity);
      setUnit(prefilledFromRequest.unit);
      setUnitPrice(prefilledFromRequest.estimatedUnitCost || 30);
      setExpectedDelivery(prefilledFromRequest.requiredDate);
      const matchedSup = suppliers.find(
        (s) => s.supplierName === prefilledFromRequest.supplierPreference
      );
      if (matchedSup) {
        setSelectedSupplierId(matchedSup.id);
      }
      setNotes(`Generated from Requisition ${prefilledFromRequest.requestId}. ${prefilledFromRequest.notes || ""}`);
    }
  }, [prefilledFromRequest, suppliers]);

  if (!isOpen) return null;

  const subtotal = (Number(quantity) || 0) * (Number(unitPrice) || 0);
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const totalAmount = subtotal + taxAmount;

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const poNumber = `PO-2026-0${randomSuffix}`;

    const newPo: PurchaseOrderItem = {
      id: `po_${Date.now()}`,
      poNumber,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.supplierName,
      orderDate,
      expectedDelivery,
      paymentTerms,
      buyer: "Rajesh Sharma (Procurement Head)",
      items: [
        {
          id: `item_${Date.now()}`,
          material: material.trim(),
          category,
          quantity: Number(quantity) || 1,
          receivedQuantity: 0,
          unit,
          unitPrice: Number(unitPrice) || 0,
          taxPercent: Number(taxPercent) || 0,
          totalPrice: totalAmount,
        },
      ],
      subtotal,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      paymentStatus: "Pending",
      deliveryStatus: "Not Shipped",
      poStatus: "Approved",
      notes: notes.trim(),
    };

    onSubmit(newPo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[92vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Create Purchase Order</h3>
              <p className="text-xs text-slate-600 font-medium">
                Generate official vendor order with commercial tax calculations
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
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs overflow-y-auto flex-1 pr-1">
          {/* Supplier Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Contracted Supplier *
            </label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white cursor-pointer"
              required
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.supplierName} ({s.category} • On-Time: {s.onTimeDeliveryRate}%)
                </option>
              ))}
            </select>
          </div>

          {/* Dates & Payment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                PO Date *
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Expected Delivery *
              </label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Payment Terms *
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white cursor-pointer"
              >
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Net 45 Days">Net 45 Days</option>
                <option value="Advance 50%, Net 15">Advance 50%, Net 15</option>
                <option value="100% Advance">100% Advance</option>
              </select>
            </div>
          </div>

          {/* Material & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Material / Line Item *
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Wheat Flour (Refined)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity, Unit, Price, Tax */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              >
                <option value="kg">kg</option>
                <option value="boxes">boxes</option>
                <option value="rolls">rolls</option>
                <option value="liters">liters</option>
                <option value="units">units</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-700 mb-1">
                Unit Price (₹) *
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-700 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                GST / Tax (%) *
              </label>
              <select
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold"
              >
                <option value="0">0% (Nil)</option>
                <option value="5">5% (GST)</option>
                <option value="12">12% (GST)</option>
                <option value="18">18% (GST)</option>
                <option value="28">28% (GST)</option>
              </select>
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Tax ({taxPercent}%):</span>
              <span className="font-mono font-bold text-slate-900">₹{taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200 font-bold text-slate-900">
              <span>Grand Total PO Amount:</span>
              <span className="text-emerald-700 font-mono text-sm font-extrabold">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Issue Purchase Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
