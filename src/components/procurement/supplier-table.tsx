"use client";

import React from "react";
import { SupplierItem, SupplierStatus } from "@/types/procurement";
import {
  Users,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

interface SupplierTableProps {
  suppliers: SupplierItem[];
  onViewSupplier?: (supplier: SupplierItem) => void;
}

export function SupplierStatusBadge({ status }: { status: SupplierStatus }) {
  switch (status) {
    case "Active":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Active
        </span>
      );
    case "On Hold":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3 h-3 text-amber-600" />
          On Hold
        </span>
      );
    case "Inactive":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
          <AlertCircle className="w-3 h-3 text-slate-600" />
          Inactive
        </span>
      );
  }
}

export function SupplierTable({ suppliers, onViewSupplier }: SupplierTableProps) {
  const formatCurrency = (val?: number) => {
    const num = typeof val === "number" && !isNaN(val) ? val : 0;
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }
    return `₹${num.toLocaleString()}`;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Suppliers Directory</h3>
            <p className="text-xs text-slate-600 font-medium">
              Verified vendor catalog, contractual lead times, and fulfillment ratings
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
          {suppliers.length} Approved Vendors
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4">Supplier Name</th>
              <th className="py-3.5 px-4">Code</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Contact Person</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4 text-center">Rating</th>
              <th className="py-3.5 px-4 text-right">Total Orders</th>
              <th className="py-3.5 px-4 text-right">Total Spend</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 text-sm">{s.supplierName}</div>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {s.city}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-700 whitespace-nowrap">
                  {s.supplierCode}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                    {s.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                  {s.contactPerson}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap font-medium">
                  <div className="text-slate-800 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {s.phone}
                  </div>
                  <div className="text-slate-600 text-[11px] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    {s.email}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {s.rating}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  {s.totalOrders}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700 whitespace-nowrap">
                  {formatCurrency(s.totalSpend)}
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <SupplierStatusBadge status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-700 block">
                  {s.supplierCode}
                </span>
                <span className="font-bold text-slate-900 text-sm">{s.supplierName}</span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {s.city}
                </span>
              </div>
              <SupplierStatusBadge status={s.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Contact</span>
                <span className="font-bold text-slate-900 truncate block">
                  {s.contactPerson}
                </span>
                <span className="text-[11px] text-slate-600 font-medium">{s.phone}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block">Total Spend</span>
                <span className="font-mono font-extrabold text-emerald-700">
                  {formatCurrency(s.totalSpend)}
                </span>
                <span className="text-[11px] text-slate-600 font-medium">{s.totalOrders} Orders</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800 border border-slate-300">
                {s.category}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {s.rating} ★
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
