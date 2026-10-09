"use client";

import React, { useState } from "react";
import { InvoiceRecord, InvoiceStatus, InvoiceType } from "@/types/finance";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Check,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

interface InvoiceTableProps {
  invoices: InvoiceRecord[];
  onUpdateStatus?: (id: string, newStatus: InvoiceStatus) => void;
}

export function InvoiceTable({ invoices, onUpdateStatus }: InvoiceTableProps) {
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filterType !== "All" && inv.type !== filterType) return false;
    if (filterStatus !== "All" && inv.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Overdue
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
            <XCircle className="w-3 h-3 text-slate-500" /> Cancelled
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
    }
  };

  const getTypeBadge = (type: InvoiceType) => {
    if (type === "Customer Invoice") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
          <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Receivable
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-purple-50 text-purple-800 border border-purple-300 font-bold">
        <ArrowUpRight className="w-3 h-3 text-purple-600" /> Payable
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Invoice & Payment Tracking</h3>
              <p className="text-xs text-slate-600 font-medium">Customer billing receivables and vendor supplier payables ledger</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-600"
            >
              <option value="All">All Types</option>
              <option value="Customer Invoice">Customer Invoices (AR)</option>
              <option value="Supplier Invoice">Supplier Invoices (AP)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-3">Invoice Number</th>
                <th className="py-3.5 px-3">Customer / Supplier</th>
                <th className="py-3.5 px-3">Type</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Due Date</th>
                <th className="py-3.5 px-3 text-right">Amount</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    No invoices match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-800 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-900">
                      <div className="font-bold text-slate-900">{inv.entityName}</div>
                      {inv.notes && (
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{inv.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">{getTypeBadge(inv.type)}</td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-700 font-medium whitespace-nowrap">{inv.date}</td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-700 font-medium whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">{getStatusBadge(inv.status)}</td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          title="View Invoice Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-cyan-800 border border-slate-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onUpdateStatus && inv.status !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(inv.id, "Paid")}
                            title="Mark as Settled / Paid"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Invoice Specification</h3>
              <span className="font-mono text-xs text-cyan-800 font-bold">{selectedInvoice.invoiceNumber}</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Entity / Counterparty:</span>
                <span className="font-bold text-slate-900">{selectedInvoice.entityName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Classification:</span>
                <span className="font-bold">{selectedInvoice.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Billed Amount:</span>
                <span className="text-sm font-black text-emerald-800 font-mono">{formatCurrency(selectedInvoice.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Issued Date:</span>
                <span className="font-mono font-bold text-slate-900">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Settlement Due Date:</span>
                <span className="font-mono font-bold text-slate-900">{selectedInvoice.dueDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Payment Status:</span>
                <div>{getStatusBadge(selectedInvoice.status)}</div>
              </div>
              {selectedInvoice.notes && (
                <div className="pt-1">
                  <span className="text-slate-600 font-medium block mb-1">Billing Reference / Description:</span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium">
                    {selectedInvoice.notes}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
